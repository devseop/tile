import { useQuery } from '@tanstack/react-query';
import { getCurrentWeather } from '../api/weatherAPI';
import QuerykeyGenerator from './common/QueryKeyGenerator';

export const useWeather = (city: string, district: string) => {
  return useQuery({
    queryKey: QuerykeyGenerator.weather({ city, district }),
    queryFn: () => getCurrentWeather(city, district),
    enabled: Boolean(city && district),
    staleTime: 1000 * 60 * 5,
  });
};
