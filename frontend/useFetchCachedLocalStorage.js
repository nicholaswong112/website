import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";

/** Custom hook for fetching data from an endpoint and caching it.
 * The data will be loaded from localStorage or initialized to null.
 *
 * The caller is responsible for providing a unique key for localStorage
 *
 * returns [data, isLoading, erro, setIsStale]
 * setIsStale(true) will trigger a forced refetch
 */
export default function useFetchCachedLocalStorage(
  url,
  key,
  options = {},
  transform = (data) => data
) {
  const [data, setData] = useLocalStorageState(key, { defaultValue: null });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStale, setStale] = useState(true);
  const [abort, setAbort] = useState(null);

  useEffect(() => {
    if (!isStale) {
      setLoading(false);
      return;
    }

    // We will attempt to fetch now
    if (data == null) {
      setLoading(true);
    }
    const abortController = new AbortController();
    const signal = abortController.signal;
    setAbort(abortController);
    const fetchData = async () => {
      try {
        const response = await fetch(url, { ...options, signal });
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: status is ${response.status}`
          );
        }
        const json = await response.json();
        setData(transform(json));
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      abort.abort();
    };
  }, [isStale]);

  return [data, isLoading, error, setStale];
}
