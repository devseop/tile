import { useQuery } from '@tanstack/react-query';
import { getCurrentWeather } from '../api/weatherAPI';
import QuerykeyGenerator from './common/QueryKeyGenerator';

export const useWeather = (nx: number, ny: number) => {
  return useQuery({
    queryKey: QuerykeyGenerator.weather({ nx, ny }),
    queryFn: async () => {
      console.log("🚀 Fetching weather for:", nx, ny);
      return await getCurrentWeather(nx, ny);
    },
    enabled: Number.isFinite(nx) && Number.isFinite(ny),
    staleTime: 1000 * 60 * 5,
    retry: false, // 실패 시 반복 방지 (디버깅용)
  });
};