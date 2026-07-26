import { useState, useEffect, useCallback, useRef } from 'react';
import { carService } from '@services/carService';

export function useCars(params) {
  const [cars, setCars] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const paramsKey = JSON.stringify(params);
  const requestIdRef = useRef(0);

  const fetchCars = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const res = await carService.getCars(params);
      if (requestId !== requestIdRef.current) return;
      setCars(res.data.cars);
      setMeta(res.meta);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err.message);
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return { cars, meta, isLoading, error, refetch: fetchCars };
}