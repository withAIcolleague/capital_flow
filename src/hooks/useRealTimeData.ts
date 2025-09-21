import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';

// 실시간 데이터 훅
export function useRealTimeData<T>(
  fetchFunction: () => Promise<T>,
  interval: number = 30000, // 30초마다 업데이트
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
    
    const intervalId = setInterval(fetchData, interval);
    
    return () => clearInterval(intervalId);
  }, [fetchData, interval]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchData
  };
}

// 자산 규모 데이터 훅
export function useAssetLevels(asOf?: string) {
  return useRealTimeData(
    () => apiService.getAssetLevels(asOf),
    60000, // 1분마다 업데이트
    [asOf]
  );
}

// 자금 흐름 데이터 훅
export function useFlowData(freq: string = 'weekly', asset?: string, window: number = 13) {
  return useRealTimeData(
    () => apiService.getFlowData(freq, asset, window),
    30000, // 30초마다 업데이트
    [freq, asset, window]
  );
}

// 비제도권 자금 데이터 훅
export function useShadowEconomyData() {
  return useRealTimeData(
    () => apiService.getShadowEconomyData(),
    300000, // 5분마다 업데이트
    []
  );
}

// 암호화폐 데이터 훅
export function useCryptoData() {
  return useRealTimeData(
    () => apiService.getCryptoData(),
    15000, // 15초마다 업데이트
    []
  );
}

// 실시간 알림 데이터 훅
export function useAlerts() {
  return useRealTimeData(
    () => apiService.getAlerts(),
    10000, // 10초마다 업데이트
    []
  );
}

// 히트맵 데이터 훅
export function useHeatmapData(window: number = 13) {
  return useRealTimeData(
    () => apiService.getHeatmapData(window),
    60000, // 1분마다 업데이트
    [window]
  );
}
