import { useCallback, useEffect, useRef, useState } from "react";

const useFetch = (fetchFunction, options = {}) => {
  const { immediate = true } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchFunction(...args);

        if (isMounted.current) {
          setData(response);
        }

        return response;
      } catch (err) {
        if (isMounted.current) {
          setError(err);
        }

        throw err;
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [fetchFunction]
  );

  useEffect(() => {
    isMounted.current = true;

    if (immediate && fetchFunction) {
      execute().catch(() => {
        // Error is already stored in the hook state.
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [execute, fetchFunction, immediate]);

  const refetch = useCallback(
    (...args) => execute(...args),
    [execute]
  );

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export default useFetch;