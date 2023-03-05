import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";

/** Custom hook for fetching data from an endpoint and caching it.
 * The data will be loaded from localStorage or initialized to null.
 *
 * The caller is responsible for providing a unique key for localStorage
 *
 * returns [data, isLoading, error, setStale]
 * markStale() will trigger a forced refetch
 */
// TODO: refactor this to take in an object instead of positional arguments
export default function useFetchCachedLocalStorage(
  url,
  key,
  /** default transform is identity fx */
  transform = (data) => data,
  options = {}
) {
  const [data, setData] = useLocalStorageState(key, { defaultValue: null });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStale, setStale] = useState(true);
  const [abortController, setAbortController] = useState(null);

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
    setAbortController(abortController);
    const fetchData = async () => {
      try {
        const response = await fetch(url, { ...options, signal });
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: status is ${response.status}`
          );
        }
        const text = await response.text();
        // handle case of status 200, empty response when nothing is playing
        const json = text ? JSON.parse(text) : null;
        setData(json ? transform(json) : null);
        setError(null);
      } catch (err) {
        setData(null); // TODO is this good to do?
        setError(err);
      } finally {
        setLoading(false);
        setStale(false);
      }
    };
    fetchData();
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [isStale]);

  function markStale() {
    setStale(true);
  }

  return {
    data,
    isLoading,
    error,
    markStale,
  };
}
