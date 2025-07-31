import { getFirestore, doc, getDoc } from 'firebase/firestore';
import dayjs from 'dayjs';

const db = getFirestore();

export const getCurrentWeather = async (city: string, district: string) => {
  const hour = dayjs().format('HH');
  const weatherDocRef = doc(db, 'weather', city, district, 'hourly', hour, 'data');
  const snapshot = await getDoc(weatherDocRef);

  if (!snapshot.exists()) {
    throw new Error(`날씨 데이터를 찾을 수 없습니다: ${city}/${district}/${hour}`);
  }

  return snapshot.data();
};