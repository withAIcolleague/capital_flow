import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { customAPIService, APIConfig, CustomAPIService } from '../services/customAPIService';

interface APIDataDisplayProps {
  className?: string;
}

export default function APIDataDisplay({ className = '' }: APIDataDisplayProps) {
  const [apiData, setApiData] = useState<APIConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadAPIData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiService: CustomAPIService = customAPIService;
      const activeAPIs = apiService.getActiveAPIs();
      const dataPromises = activeAPIs.map(async (api: APIConfig) => {
        try {
          let data;
          switch (api.name) {
            case 'Alpha Vantage':
              data = await apiService.getAlphaVantageData('AAPL');
              break;
            case 'Yahoo Finance':
              data = await apiService.getYahooFinanceData('AAPL');
              break;
            case 'CoinGecko Pro':
              data = await apiService.getCoinGeckoProData('bitcoin');
              break;
            case 'FRED (Federal Reserve)':
              data = await apiService.getFREDData('GDP');
              break;
            default:
              data = { message: 'No specific data available' };
          }
          
          return {
            ...api,
            data,
            status: 'success' as const,
            lastFetched: new Date().toISOString()
          };
        } catch (error) {
          return {
            ...api,
            data: null,
            status: 'error' as const,
            error: error instanceof Error ? error.message : 'Unknown error',
            lastFetched: new Date().toISOString()
          };
        }
      });

      const results = await Promise.all(dataPromises);
      setApiData(results);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAPIData();
    
    // 5분마다 자동 새로고침
    const interval = setInterval(loadAPIData, 300000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'crypto': return 'bg-purple-500/20 text-purple-400 border-purple-400/30';
      case 'economic': return 'bg-green-500/20 text-green-400 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  if (loading && apiData.length === 0) {
    return (
      <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl ${className}`}>
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"
          />
          <span className="ml-3 text-white">API 데이터 로딩 중...</span>
        </div>
      </div>
    );
  }

  if (apiData.length === 0) {
    return (
      <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl ${className}`}>
        <div className="text-center">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">API 데이터 없음</h3>
          <p className="text-gray-400 text-sm">
            API 설정 페이지에서 API를 추가하고 활성화하세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Database className="w-6 h-6 text-indigo-400" />
          사용자 정의 API 데이터
        </h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadAPIData}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          새로고침
        </motion.button>
      </div>

      {/* API 데이터 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apiData.map((api, index) => (
          <motion.div
            key={api.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white/10 backdrop-blur-lg rounded-xl p-4 border shadow-xl ${getCategoryColor(api.category)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(api.status)}
                <h3 className="text-white font-semibold">{api.name}</h3>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-white/10">
                {api.category}
              </span>
            </div>

            <p className="text-sm text-gray-300 mb-3">{api.description}</p>

            {api.status === 'success' && (api as any).data && (
              <div className="space-y-2">
                <div className="text-xs text-gray-400">
                  데이터 샘플:
                </div>
                <div className="bg-black/20 rounded-lg p-2 text-xs font-mono text-gray-300 max-h-20 overflow-y-auto">
                  {JSON.stringify((api as any).data, null, 2).substring(0, 200)}...
                </div>
              </div>
            )}

            {api.status === 'error' && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2">
                <div className="text-red-400 text-sm font-medium">오류 발생</div>
                <div className="text-red-300 text-xs mt-1">{(api as any).error}</div>
              </div>
            )}

            <div className="mt-3 text-xs text-gray-400">
              마지막 업데이트: {new Date((api as any).lastFetched).toLocaleTimeString()}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 전체 상태 */}
      {lastUpdated && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              전체 API 상태: {apiData.filter(api => api.status === 'success').length} / {apiData.length} 성공
            </span>
            <span className="text-gray-400">
              마지막 전체 업데이트: {lastUpdated?.toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">오류 발생</span>
          </div>
          <div className="text-red-300 text-sm mt-1">{error}</div>
        </div>
      )}
    </div>
  );
}
