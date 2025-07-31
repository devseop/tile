// import spotIcon from '../assets/ic_spot.svg';
// import { useWeather, useDistrict, useYesterdayWeather } from '../hooks/useWeather';

// export const WeatherInfoHead = () => {
//   const { data: weather, isLoading: isWeatherLoading, error: weatherError } = useWeather();
//   const { data: district, isLoading: isDistrictLoading, error: districtError } = useDistrict();
//   const isLoading = isWeatherLoading || isDistrictLoading;
//   const isError = weatherError || districtError;
//   const title = `오늘은\n어제보다 더워요`

//   const { data: yesterdayWeather } = useYesterdayWeather();

//   // console.log('yesterdayWeather', yesterdayWeather)

//   if (isLoading) return <main>로딩 중…</main>;
//   if (isError) return <main>오류: {isError.message}</main>;

//   return (
//     <div>
//       <p className='font-semibold text-[36px] leading-[44px] whitespace-pre-line'>{title}</p>
//       <p className="flex items-center gap-[4px] text-lg mt-[8px] mb-[64px]">
//         <img
//           src={spotIcon}
//           alt="위치 아이콘"
//           className="w-5 h-5"
//           />
//         <span className="text-[17px] text-[#CACACA]">{district}</span>
//       </p>
//     </div>
//   )
// }