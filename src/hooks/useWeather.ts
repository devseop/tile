import { useQuery } from '@tanstack/react-query';
import { getCurrentLocationWeather, getYesterdayLocationWeather } from '../api/weatherAPI';
import { getGeoLocation, getDistrictName } from '../utils/location';

export const useWeather = () => {
  return useQuery({
    queryKey: ['weather'],
    queryFn: getCurrentLocationWeather,
  });
};

export const useYesterdayWeather = () => {
  return useQuery({
    queryKey: ['yesterday'],
    queryFn: getYesterdayLocationWeather
  })
}

export const useDistrict = () => {
  return useQuery({
    queryKey: ['district'],
    queryFn: async () => {
      const { coords } = await getGeoLocation();
      return getDistrictName(coords.latitude, coords.longitude);
    },
  });
};
