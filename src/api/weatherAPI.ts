
import dayjs from "dayjs";
import { DEFAULT_WEATHER_PARAMS, WEATHER_API_BASE_URL } from '../constants/weather';
import type { WeatherInfoProps } from '../types/Weather';
import { getUserXYCoords } from '../utils/location';



// 날씨 변환하기
const parseWeatherData = (data: any) => {
  const weatherInfo: WeatherInfoProps = {
    temperature: null,
    rainy: null,
    windSpeed: null,
    humidity: null
  };

  data.forEach((item: any) => {
    switch (item.category) {
      case "T1H": //온도
        weatherInfo.temperature = item.obsrValue;
        break;
      case "RN1": //강수형태
        weatherInfo.rainy = item.obsrValue;
        break;
      case "WSD": //풍속
        weatherInfo.windSpeed = item.obsrValue;
        break;
      case "REH": //습도
        weatherInfo.humidity = item.obsrValue;
        break;
      default:
        break;
    }
  });

  return weatherInfo;
}

// 날씨 데이터 가져오기
export const getCurrentLocationWeather = async () => {
  // 동적으로 base_date, base_time, 좌표 계산
  const { x: nx, y: ny } = await getUserXYCoords();

  const now = dayjs();
  const base_date = now.format("YYYYMMDD");
  const base_time = now.subtract(1, 'hour').minute(0).second(0).millisecond(0).format("HHmm");

  const params = {
    ...DEFAULT_WEATHER_PARAMS,
    serviceKey: import.meta.env.VITE_WEATHER_API_SERVICE_KEY,
    base_date,
    base_time,
    nx,
    ny
  };
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const API_ENDPOINT = `${WEATHER_API_BASE_URL}?${queryString}`;

  const response = await fetch(API_ENDPOINT);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.response?.header?.resultCode === "00") {
    const items = data.response.body.items.item;
    const result = parseWeatherData(items)
    return result;
  } else {
    throw new Error(
      data.response?.header?.resultMsg ||
        "API에서 데이터를 가져오는데 실패했습니다."
    );
  }
};
