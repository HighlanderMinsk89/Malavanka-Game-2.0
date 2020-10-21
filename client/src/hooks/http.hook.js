import { useState, useCallback } from "react";
import axios from "axios";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (url, method = "get", body = {}, headers = {}) => {
      setLoading(true);
      try {
        const { data } = await axios({
          method,
          url,
          data: body,
        });

        setLoading(false);

        return data;
      } catch (error) {
        console.dir(error);
        setLoading(false);
        setError(error.response.data.message);
        // throw e.message || e;
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return { request, loading, error, clearError };
};
