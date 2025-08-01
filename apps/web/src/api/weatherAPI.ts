import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore';
import dayjs from 'dayjs';

export const getCurrentWeather = async (nx: number, ny: number) => {
  const hour = dayjs().format('HH');
  const locationId = `${nx}_${ny}`
  const docRef = doc(db, 'weather', locationId, 'hourly', hour);
  const snapshot = await getDoc(docRef);

  console.log(snapshot.data())
  
  if (!snapshot.exists()) {
    throw new Error(`날씨 데이터를 찾을 수 없습니다: ${locationId}/${hour}`);
  }

  return snapshot.data();
};