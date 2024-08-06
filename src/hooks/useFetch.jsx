import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function useFetchOne({ url, query = "", dependency = [] }) {
  const [response, setResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        console.log(`${url}?${query}`);
        const { data } = await axios.get(`${url}?${query}`, { signal: signal });
        setResponse(data);
      } catch (err) {
        if (!axios.isCancel()) {
          setResponse([]);
          toast.error(err.message);
        }
      } finally {
        setIsLoading(false);
      }
      console.log(response);
    }
    fetchData();
    return () => {
      controller.abort();
    };
  }, dependency);
  return { response, isLoading };
}
