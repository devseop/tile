import { useEffect, useState } from "react";
import { WeatherIconDisplay } from './components/WeatherIconDisplay';
import { getCurrentLocationWeather } from "./api/weatherAPI";

interface WeatherInfoProps {
  temperature: string | null;
  rainy: string | null;
  windSpeed: string | null;
  humidity: string | null;
}

export default function App() {
  const [weather, setWeather] = useState<WeatherInfoProps | null>(null);

  useEffect(() => {
    const getWeather = async () => {
      const data = await getCurrentLocationWeather();
      
      setWeather(data);
    }
    getWeather();
  },[]);

  console.log(weather)

  return (
    <main>
      <WeatherIconDisplay />
      <p>{weather?.temperature}</p>
    </main>
  );
}
