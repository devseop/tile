import React from 'react'
// import { WeatherInfoHead } from './WeatherInfoHead';

export const WeatherInfoContainer = () => {
  
  return (
    <section className='flex-col px-[24px] mt-[24px]'>
        {/* 헤더 */}
        {/* <WeatherInfoHead /> */}
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