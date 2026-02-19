import { httpClient } from "@/api/httpClient";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { useQuery } from "@tanstack/react-query";

const useEndorsement = () => {
  const getAllEndorsementTypesService = useQuery({
    queryKey: [CACHE_KEYS.ENDORSEMENT_TYPES],
    queryFn: () => httpClient("GET", URLs.ENDORSEMENT_TYPES),
  });
  return {
    service: { getAllEndorsementTypesService },
  };
};

export default useEndorsement;
