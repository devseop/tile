import { useQuery } from '@tanstack/react-query';
import { getCurrentWeather } from '../api/weatherAPI';
import QuerykeyGenerator from './common/QueryKeyGenerator';

export const useWeather = (nx: number, ny: number) => {
  return useQuery({
    queryKey: QuerykeyGenerator.weather({ nx, ny }),
    queryFn: () => getCurrentWeather(nx, ny),
    enabled: Boolean(nx && ny),
    staleTime: 1000 * 60 * 5,
  });
};
