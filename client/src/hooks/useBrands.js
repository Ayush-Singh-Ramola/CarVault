import { useState, useEffect } from 'react';
import { brandService } from '@services/brandService';

export function useBrands() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchBrands() {
      try {
        const res = await brandService.getBrands();
        if (!cancelled) setBrands(res.data.brands);
      } catch {
        if (!cancelled) setBrands([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchBrands();
    return () => {
      cancelled = true;
    };
  }, []);

  return { brands, isLoading };
}