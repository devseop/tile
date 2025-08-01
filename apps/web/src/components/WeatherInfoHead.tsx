import React from 'react';
import spotIcon from '../assets/ic_spot.svg';
import { useWeather } from '../hooks/useWeather';

export const WeatherInfoHead = () => {
  const raw = localStorage.getItem('user_location')
  const { districtName, nx, ny } = JSON.parse(raw as string);
  const {data, isLoading, isError} = useWeather(nx, ny);
  const title = `오늘은\n어제보다 더워요`


  // if (isLoading) return <main>로딩 중…</main>;
  // if (isError) return <main>오류: {isError}</main>;

  return (
    <div>
      <p className='font-semibold text-[36px] leading-[44px] whitespace-pre-line'>{title}</p>
      <p className="flex items-center gap-[4px] text-lg mt-[8px] mb-[64px]">
        <img
          src={spotIcon}
          alt="위치 아이콘"
          className="w-5 h-5"
          />
        <span className="text-[17px] text-[#CACACA]">{districtName}</span>
      </p>
    </div>
  )
}