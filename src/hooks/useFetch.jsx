import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function useFetchOne({ url, query = "", dependency = [] }) {
  const [response, setResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        console.log(`${url}?${query}`);
        const { data } = await axios.get(`${url}?${query}`);
        setResponse(data);
      } catch (err) {
        setResponse([]);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
      console.log(response);
    }
    fetchData();
  }, dependency);
  console.log(response);
  return { response, isLoading };
}
