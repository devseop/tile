import { useState, useEffect } from 'react';
import { getCurrentLocationWeather } from '../api/weatherAPI';
import spotIcon from '../assets/ic_spot.svg'
import type { WeatherInfoProps } from '../types/Weather';
import { getGeoLocation, getDistrictName } from '../utils/location';

export const WeatherInfoContainer = () => {
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

  if (error) return <main>오류: {error}</main>
  if (!weather || !district) return <main>로딩 중…</main>
  
  return (
    <section className='flex-col px-[24px] mt-[24px]'>
        {/* 헤더 */}
        <div className='flex-col gap-[10px] mb-[64px]'>
          <p className='font-semibold text-[36px]'>{weather?.temperature}</p>
          <p className="flex items-center gap-[4px] text-lg">
            <img
              src={spotIcon}
              alt="위치 아이콘"
              className="w-5 h-5"
              />
            <span className="text-[17px] text-[#CACACA]">{district}</span>
          </p>
        </div>
        {/* 세부정보 */}
        <div className='flex'>
          <span>세부 정보</span>
        </div>
      </section>
  )
}