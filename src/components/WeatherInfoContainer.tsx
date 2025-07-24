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
        {/* //! 데이터 업데이트 필요 */}
        {/* 세부정보 */}
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-[#D9D9D9] border-collapse text-sm">
            <thead>
              <tr>
                <th colSpan={4} className="py-2 text-[#878787] text-left font-normal">
                  세부정보
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D9D9]">
              {/* 최고/최저 */}
              <tr>
                <td colSpan={4}>
                  <div className="flex gap-6">
                    {/* 좌측 50% */}
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-medium">최고</span>
                      <span className="py-2">25°</span>
                    </div>
                    {/* 우측 50% */}
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-medium">최저</span>
                      <span className="py-2">12°</span>
                    </div>
                  </div>
                </td>
              </tr>
              {/* 체감온도 */}
              <tr className='justify-between'>
                <td className="py-2 font-medium">체감온도</td>
                <td className="py-2" />
                <td className="py-2" />
                <td className="py-2 text-right">25°</td>
              </tr>
              {/* 미세먼지 */}
              <tr>
                <td className="py-2 font-medium">미세먼지</td>
                <td className="py-2" />
                <td className="py-2" />
                <td className="py-2 text-right">좋음</td>
              </tr>
              {/* 초미세먼지 */}
              <tr>
                <td className="py-2 font-medium">초미세먼지</td>
                <td className="py-2" />
                <td className="py-2" />
                <td className="py-2 text-right">좋음</td>
              </tr>
              {/* 자외선 */}
              <tr>
                <td className="py-2 font-medium">자외선</td>
                <td className="py-2" />
                <td className="py-2" />
                <td className="py-2 text-right">좋음</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
  )
}