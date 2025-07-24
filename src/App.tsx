import { useEffect, useState } from "react";
import { WeatherIconDisplay } from './components/WeatherIconDisplay';
import { getCurrentLocationWeather } from "./api/weatherAPI";
import { getDistrictName, getGeoLocation } from './utils/location';

interface WeatherInfoProps {
  temperature: string | null;
  rainy: string | null;
  windSpeed: string | null;
  humidity: string | null;
}

export default function App() {
  const [weather, setWeather] = useState<WeatherInfoProps | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const weatherData = await getCurrentLocationWeather()
        setWeather(weatherData)

        const { coords } = await getGeoLocation()
        const name = await getDistrictName(
          coords.latitude,
          coords.longitude
        )

        setDistrict(name)
      } catch (e: any) {
        setError(e.message)
      }
    })()
  }, [])

  console.log(weather, district)

  if (error) return <main>오류: {error}</main>
  if (!weather || !district) return <main>로딩 중…</main>

  return (
    <main>
      <WeatherIconDisplay />
      <p>{weather?.temperature}</p>
      <p>{district}</p>
    </main>
  );
}
