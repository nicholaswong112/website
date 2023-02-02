import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";

/** Hash function taken from GeeksForGeeks */
function hash(s) {
  let hash = 0;
  if (s.length == 0) return hash;
  for (i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

/** Custom hook for fetching data from an endpoint and caching it.
 * The data will be loaded from localStorage or initialized to null.
 *
 * hash(url + access_token) is used as a key for localStorage
 *
 * returns [data, isLoading, setIsStale]
 * setIsStale(true) will trigger a forced refetch
 */
export default function useFetchCachedLocalStorage(
  url,
  options = {},
  transform
) {
  // const KEY = hash(url + accessToken);
  // TODO: this will mean that cache will contaminate different sign-ins
  const KEY = url;
  const [data, setData] = useLocalStorageState(KEY, { defaultValue: null });
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
