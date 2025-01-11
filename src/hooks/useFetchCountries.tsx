import { fetchCountries } from '@/services/fetchCountries';
import { useQuery } from '@tanstack/react-query';

const useFetchCountries = () => {
  const {
    isLoading,
    isFetching,
    error,
    data: countries,
    refetch,
  } = useQuery({
    queryKey: ['countries'],
    queryFn: () => fetchCountries(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    isLoading,
    isFetching,
    error,
    countries,
    refetch,
  };
};

export default useFetchCountries;
