import { useState, useEffect, useCallback } from 'react';
import { liveDataService } from '../services/liveDataService';

interface LiveData {
  stock: {
    totalMarketCap: number;
    totalVolume: number;
    marketCapChange: number;
    lastUpdated: string;
  };
  crypto: {
    totalMarketCap: number;
    totalVolume: number;
    activeCryptocurrencies: number;
    lastUpdated: string;
  };
  exchangeRates: {
    rates: Record<string, number>;
    base: string;
    lastUpdated: string;
  };
  gold: {
    price: number;
    currency: string;
    lastUpdated: string;
  };
  lastUpdated: string;
}

export function useLiveData(updateInterval: number = 300000) { // 5분마다 업데이트
  const [data, setData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const liveData = await liveDataService.getAllLiveData();
      setData(liveData);
      setLastFetch(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching live data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 초기 데이터 로드
    fetchData();
    
    // 주기적 업데이트
    const interval = setInterval(fetchData, updateInterval);
    
    return () => clearInterval(interval);
  }, [fetchData, updateInterval]);

  // 수동 새로고침
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // 데이터를 T 단위로 변환
  const formatToTrillions = (value: number) => {
    return (value / 1e12).toFixed(1);
  };

  // 데이터를 B 단위로 변환
  const formatToBillions = (value: number) => {
    return (value / 1e9).toFixed(1);
  };

  // 변환된 데이터 반환
  const formattedData = data ? {
    ...data,
    stock: {
      ...data.stock,
      totalMarketCapFormatted: formatToTrillions(data.stock.totalMarketCap),
      totalVolumeFormatted: formatToTrillions(data.stock.totalVolume)
    },
    crypto: {
      ...data.crypto,
      totalMarketCapFormatted: formatToTrillions(data.crypto.totalMarketCap),
      totalVolumeFormatted: formatToBillions(data.crypto.totalVolume)
    }
  } : null;

  return {
    data: formattedData,
    loading,
    error,
    lastFetch,
    refresh,
    isStale: lastFetch ? (Date.now() - lastFetch.getTime()) > updateInterval : true
  };
}

// 개별 데이터 훅들
export function useStockData() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const stockData = await liveDataService.getStockMarketData();
        setData(stockData);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 60000); // 1분마다 업데이트
    
    return () => clearInterval(interval);
  }, []);

  return { data, loading };
}

export function useCryptoData() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const cryptoData = await liveDataService.getCryptoData();
        setData(cryptoData);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000); // 30초마다 업데이트
    
    return () => clearInterval(interval);
  }, []);

  return { data, loading };
}
