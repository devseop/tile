import * as functions from 'firebase-functions/v1'
import * as admin from 'firebase-admin'
import dayjs from 'dayjs';

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
    const now = dayjs().minute(0).second(0).millisecond(0);
    const base_date = now.format("YYYYMMDD");
    const base_time = now.subtract(1, "hour").format("HHmm"); // 기상청 실황은 보통 1시간 전 기준

    const locationsSnap = await db.collection("locations").get();

    for (const cityDoc of locationsSnap.docs) {
      const city = cityDoc.id;
      const districtsSnap = await cityDoc.ref.collection("districts").get();

      for (const districtDoc of districtsSnap.docs) {
        const district = districtDoc.id;
        const { nx, ny } = districtDoc.data();

        // 기상청 API 호출
        const params = new URLSearchParams({
          serviceKey: WEATHER_API_SERVICE_KEY,
          dataType: "JSON",
          base_date,
          base_time,
          nx: nx.toString(),
          ny: ny.toString(),
        });

        const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?${params}`;

        try {
          const response = await fetch(url);
          const json = await response.json();

          if (json.response?.header?.resultCode !== "00") {
            console.warn(`⚠️ API 실패: ${city}/${district}`, json.response?.header?.resultMsg);
            continue;
          }

          const items = json.response.body.items.item;
          const T1H = items.find((item: any) => item.category === "T1H")?.obsrValue;

          if (T1H == null) {
            console.warn(`⚠️ 기온 누락: ${city}/${district}`);
            continue;
          }

          // 저장
          await db
            .collection("weather")
            .doc(city)
            .collection(district)
            .doc("hourly")
            .collection(base_time.substring(0, 2)) // 예: "13"
            .doc("data")
            .set({
              temperature: T1H,
              base_date,
              base_time,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

          console.log(`✅ 저장 완료: ${city}/${district} - ${base_time} → ${T1H}°C`);
        } catch (err) {
          console.error(`❌ 오류: ${city}/${district}`, err);
        }
      }
    }
  });