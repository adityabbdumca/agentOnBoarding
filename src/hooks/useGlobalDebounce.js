import { useEffect, useState } from "react";

function useGlobalDebounceHandler(value ,delay= 300) {
  const [debouncedQuery, setDebouncedQuery] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return { debouncedQuery };
}

export default useGlobalDebounceHandler;
