import { useCallback, useEffect, useRef, useState } from "react";

const usePolling = (
  fetchFunction,
  interval = 30000,
  options = {}
) => {
  const { enabled = true, immediate = true } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate && enabled);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);

  const execute = useCallback(async () => {
    if (!fetchFunction) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetchFunction();

      if (isMounted.current) {
        setData(response);
      }

      return response;
    } catch (err) {
      if (isMounted.current) {
        setError(err);
      }

      return null;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [fetchFunction]);

  useEffect(() => {
    isMounted.current = true;

    if (!enabled || !fetchFunction) {
      setLoading(false);
      return undefined;
    }

    if (immediate) {
      execute();
    }

    const pollingTimer = setInterval(() => {
      execute();
    }, interval);

    return () => {
      isMounted.current = false;
      clearInterval(pollingTimer);
    };
  }, [
    execute,
    enabled,
    fetchFunction,
    immediate,
    interval,
  ]);

  const stop = useCallback(() => {
    isMounted.current = false;
  }, []);

  return {
    data,
    loading,
    error,
    refetch: execute,
    stop,
  };
};

export default usePolling;