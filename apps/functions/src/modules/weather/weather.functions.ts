import * as functions from 'firebase-functions/v1'
import { db } from '../../libs/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { WeatherService } from './weather.sevices';
import { corsHandler } from '../../libs/cors';


const WEATHER_API_SERVICE_KEY = process.env.WEATHER_API_SERVICE_KEY;

export const registerLocation = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    if (req.method !== "POST") {
      res.sendStatus(405);
      return;
    }

    const {nx, ny, displayName } = req.body;

    if (!displayName || nx === null || ny === null) {
      res.status(400).json({ error: "필수 필드 누락" });
      return;
    }

    const locationId = `${nx}_${ny}`

    const ref = db.collection("locations")
      .doc(locationId)

    ref.set({
      nx,
      ny,
      displayName,
      createdAt: FieldValue.serverTimestamp(),
    })
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error("❌ registerLocation 에러:", err);
        res.status(500).json({ error: "서버 오류" });
      });
  });
});

export const handleHourlyWeatherCollection = async () => {
  const locationsSnap = await db.collection("locations").get();

  for (const doc of locationsSnap.docs) {
    const { nx, ny, displayName } = doc.data();
    const locationId = `${nx}_${ny}`;
    const weatherService = new WeatherService(WEATHER_API_SERVICE_KEY as string);

    const result = await weatherService.getLocationTemperature(nx, ny);
    if (!result) continue;

    const { temperature, base_date, base_time } = result;
    const hour = base_time.substring(0, 2);

    await db
      .collection("weather")
      .doc(locationId)
      .collection("hourly")
      .doc(hour)
      .set({
        temperature,
        base_date,
        base_time,
        createdAt: FieldValue.serverTimestamp(),
      });

    console.log(`✅ ${displayName}(${locationId}) → ${temperature}°C`);
  }
};

// 스케줄 함수
export const collectHourlyWeather = functions.pubsub
  .schedule("every 30 minutes")
  .timeZone("Asia/Seoul")
  .onRun(async () => {
    await handleHourlyWeatherCollection();
  });

// 테스트용 함수
export const testCollectWeather = functions.https.onRequest(async (_req, res) => {
  await handleHourlyWeatherCollection();
  res.send("✅ 수동 수집 완료");
});

export const getLatestWeather = functions.https.onRequest(async (req, res) => {
  try {
    const { nx, ny } = req.query;

    if (!nx || !ny) {
      res.status(400).json({ error: "Missing nx or ny" });
      return;
    }

    const locationId = `${nx}_${ny}`;
    const hourlyCollectionRef = db.collection("weather").doc(locationId).collection("hourly");

    const hourlySnapshots = await hourlyCollectionRef.listDocuments();

    if (hourlySnapshots.length === 0) {
      res.status(404).json({ error: "No weather data available" });
      return;
    }

    const latestHour = hourlySnapshots
      .map(doc => doc.id)
      .sort((a, b) => Number(b) - Number(a))[0];

    const dataSnap = await hourlyCollectionRef.doc(latestHour).get();

    if (!dataSnap.exists) {
      res.status(404).json({ error: "Weather data not found" });
      return;
    }

    res.status(200).json({ hour: latestHour, ...dataSnap.data() });
  } catch (err) {
    console.error("❌ getLatestWeather error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
