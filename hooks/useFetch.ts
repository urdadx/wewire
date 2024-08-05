import { useState, useEffect } from 'react';

interface ResponseData {
  id: string;
  from: string;
  to: string;
  bid: string;
  ask: string;
  createdAt: string;
  updatedAt: string;
}

const useFetch = () => {
  const [data, setData] = useState<ResponseData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/converter');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: ResponseData[] = await response.json();
        setData(result);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, error, loading };
};

export default useFetch;
