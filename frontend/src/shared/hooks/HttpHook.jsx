import { useState, useCallback } from "react";
import axios from "axios";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios({
          url,
          method,
          data: body,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        });
        setIsLoading(false);
        return response.data;
      } catch (err) {
        setIsLoading(false);
        setError(err.message || "Something went wrong!");
        throw err;
      }
    },
    []
  );
  const handleErrorClear = () => {
    setError(null);
  };

  return { isLoading, error, sendRequest, handleErrorClear };
};
