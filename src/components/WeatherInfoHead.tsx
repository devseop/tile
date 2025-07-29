import spotIcon from '../assets/ic_spot.svg';
import { useWeather, useDistrict } from '../hooks/useWeather';

export const WeatherInfoHead = () => {
  const { data: weather, isLoading: isWeatherLoading, error: weatherError } = useWeather();
  const { data: district, isLoading: isDistrictLoading, error: districtError } = useDistrict();
  const isLoading = isWeatherLoading || isDistrictLoading;
  const isError = weatherError || districtError;

  if (isLoading) return <main>로딩 중…</main>;
  if (isError) return <main>오류: {isError.message}</main>;
  
  return (
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
  )
}