import { httpClient } from "@/api/httpClient";
import useGlobalDebounceHandler from "@/hooks/useGlobalDebounce";
import { IGetServicePropsSchema } from "@/services/global_services.types";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IExamQuestionServiceSchema } from "./examQuestion.type";

export const useExamQuestionsService = ({
  page = "1",
  per_page = "10",
  enableQuery = true,
  filters,
  cacheKeys = [],
}: IGetServicePropsSchema) => {
  const [examQuestionSearchQuery, setExamQuestionSearchQuery] = useState("");
  const { debouncedQuery } = useGlobalDebounceHandler(examQuestionSearchQuery);

  const getAllExamQuestionService = useQuery({
    queryKey: [QUERY_KEYS.EXAM_QUESTIONS_LISTING, page, per_page, ...cacheKeys, debouncedQuery],
    queryFn: (): Promise<{ data: IExamQuestionServiceSchema }> => {
      return httpClient("GET", CORE_URLS.EXAM_QUESTIONS_LISTING, null, null,false, {
        page,
        per_page,
        ...filters,
        search_value: debouncedQuery,
      });
    },
    enabled: enableQuery,
  });

  return {
    services: { getAllExamQuestionService },
    states: { examQuestionSearchQuery, setExamQuestionSearchQuery },
  };
};
