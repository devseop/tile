import * as functions from 'firebase-functions/v1'
import * as admin from 'firebase-admin'
import { WeatherService } from './weather.sevices';

admin.initializeApp();
const db = admin.firestore();
const WEATHER_API_SERVICE_KEY = "YAORAgNpQ5Vh9JaRAvZnpyIkSbbR8RzyMo6fk7WluflGbC5tZ9LzW%2FLKhDhn8RnAedh8ThJtacrrlHWJo2wOWA%3D%3D";

export const registerLocation = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.sendStatus(405);
    return;
  }

  try {
    const { city, district, nx, ny, displayName } = req.body;
    const hasMissingLocationInfo =
      !city || !district || !nx || !ny || !displayName; 

    if (hasMissingLocationInfo) {
      res.sendStatus(400).json({ error: "필수 필드 누락" });
      return;
    }

    const ref = db.collection("locations")
      .doc(city)
      .collection("districts")
      .doc(district);

    await ref.set({
      nx,
      ny,
      displayName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.sendStatus(200);
    return;
  } catch (err) {
    console.error("❌ registerLocation 에러:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});

export const collectHourlyWeather = functions.pubsub
  .schedule("every 1 hours")
  .timeZone("Asia/Seoul")
  .onRun(async () => {
    const locationsSnap = await db.collection("locations").get();

    for (const cityDoc of locationsSnap.docs) {
      const city = cityDoc.id;
      const districtsSnap = await cityDoc.ref.collection("districts").get();

      for (const districtDoc of districtsSnap.docs) {
        const district = districtDoc.id;
        const { nx, ny } = districtDoc.data();
        const weatherService = new WeatherService(WEATHER_API_SERVICE_KEY);

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
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

        console.log(`✅ ${city}/${district} → ${temperature}°C`);
      }
    }
  });
