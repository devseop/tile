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

    const { city, district, nx, ny, displayName } = req.body;

    const hasMissingLocationInfo =
      !city || !district || !nx || !ny || !displayName;

    if (hasMissingLocationInfo) {
      res.status(400).json({ error: "필수 필드 누락" });
      return;
    }

    const ref = db.collection("locations")
      .doc(city)
      .collection("districts")
      .doc(district);

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

  for (const cityDoc of locationsSnap.docs) {
    const city = cityDoc.id;
    const districtsSnap = await cityDoc.ref.collection("districts").get();

    for (const districtDoc of districtsSnap.docs) {
      const district = districtDoc.id;
      const { nx, ny } = districtDoc.data();
      const weatherService = new WeatherService(WEATHER_API_SERVICE_KEY as string);

      const result = await weatherService.getLocationTemperature(nx, ny);
      if (!result) continue;

      const { temperature, base_date, base_time } = result;
      const hour = base_time.substring(0, 2);

      await db
        .collection("weather")
        .doc(city)
        .collection(district)
        .doc("hourly")
        .collection(hour)
        .doc("data")
        .set({
          temperature,
          base_date,
          base_time,        
          createdAt: FieldValue.serverTimestamp()
        });

      console.log(`✅ ${city}/${district} → ${temperature}°C`);
    }
  }
};

// 스케줄 함수
export const collectHourlyWeather = functions.pubsub
  .schedule("every 1 hours")
  .timeZone("Asia/Seoul")
  .onRun(async () => {
    await handleHourlyWeatherCollection();
  });

// 테스트용 함수
export const testCollectWeather = functions.https.onRequest(async (req, res) => {
  await handleHourlyWeatherCollection();
  res.send("✅ 수동 수집 완료");
});

export const getLatestWeather = functions.https.onRequest(async (req, res) => {
  try {
    const { city, district } = req.query;

    if (!city || !district) {
      res.status(400).json({ error: "Missing city or district" });
      return;
    }

    const districtRef = db
      .collection("weather")
      .doc(city as string)
      .collection(district as string)
      .doc("hourly");

    const hourlyCollection = await districtRef.listCollections();

    if (hourlyCollection.length === 0) {
      res.status(404).json({ error: "No weather data available" });
      return;
    }

    // 가장 최근 시간대(hour) 찾기 (숫자로 정렬)
    const latestHour = hourlyCollection
      .map((col) => col.id)
      .sort((a, b) => Number(b) - Number(a))[0];

    const dataSnap = await districtRef.collection(latestHour).doc("data").get();

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