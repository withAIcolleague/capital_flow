import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Database,
  Clock,
  Globe,
  Shield,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { realAPIService } from '../services/realAPIService';

interface APIStatusMonitorProps {
  className?: string;
}

interface APIStatus {
  name: string;
  status: 'active' | 'error' | 'unknown';
  message: string;
  responseTime?: number;
  lastChecked?: string;
}

export default function APIStatusMonitor({ className = '' }: APIStatusMonitorProps) {
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  // API 상태 확인
  const checkAllAPIs = async () => {
    setIsChecking(true);
    try {
      const results = await realAPIService.checkAllAPIStatus();
      setApiStatuses(results);
      setLastCheck(new Date());
    } catch (error) {
      console.error('API 상태 확인 오류:', error);
    } finally {
      setIsChecking(false);
    }
  };

  // 컴포넌트 마운트 시 API 상태 확인
  useEffect(() => {
    checkAllAPIs();
    
    // 5분마다 자동 확인
    const interval = setInterval(checkAllAPIs, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 상태별 아이콘과 색상
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-700" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-700" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-700" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'error':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
  };

  // 전체 상태 요약
  const activeCount = apiStatuses.filter(api => api.status === 'active').length;
  const errorCount = apiStatuses.filter(api => api.status === 'error').length;
  const totalCount = apiStatuses.length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" />
            API 상태 모니터
          </h2>
          <p className="text-gray-700 mt-2 font-medium">
            연결된 모든 API의 실시간 상태를 모니터링합니다
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-700 font-medium">마지막 확인</div>
            <div className="text-gray-900 font-bold">
              {lastCheck.toLocaleTimeString('ko-KR')}
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={checkAllAPIs}
            disabled={isChecking}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 backdrop-blur-lg text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 border-2 border-blue-600 shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            새로고침
          </motion.button>
        </div>
      </div>

      {/* 전체 상태 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Database className="w-6 h-6 text-blue-700" />
            <h3 className="text-lg font-bold text-gray-900">전체 API</h3>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-2">
            {totalCount}
          </div>
          <div className="text-sm text-gray-700 font-medium">
            등록된 API 수
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-green-700" />
            <h3 className="text-lg font-bold text-gray-900">정상 작동</h3>
          </div>
          <div className="text-3xl font-black text-green-700 mb-2">
            {activeCount}
          </div>
          <div className="text-sm text-gray-700 font-medium">
            활성 API 수
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <XCircle className="w-6 h-6 text-red-700" />
            <h3 className="text-lg font-bold text-gray-900">오류 발생</h3>
          </div>
          <div className="text-3xl font-black text-red-700 mb-2">
            {errorCount}
          </div>
          <div className="text-sm text-gray-700 font-medium">
            문제가 있는 API
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-purple-700" />
            <h3 className="text-lg font-bold text-gray-900">가동률</h3>
          </div>
          <div className="text-3xl font-black text-purple-700 mb-2">
            {totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-700 font-medium">
            전체 가동률
          </div>
        </div>
      </div>

      {/* API별 상세 상태 */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-700" />
          API별 상세 상태
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apiStatuses.map((api, index) => (
            <motion.div
              key={api.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(api.status)}
                  <h4 className="font-bold text-gray-900">{api.name}</h4>
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {api.lastChecked ? new Date(api.lastChecked).toLocaleTimeString('ko-KR') : 'N/A'}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-700 font-medium">
                  {api.message}
                </div>
                
                {api.responseTime && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <Clock className="w-3 h-3" />
                    응답 시간: {api.responseTime}ms
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* API 연결 가이드 */}
      <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-700" />
          API 연결 가이드
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900">Alpha Vantage</h4>
            <div className="space-y-2 text-sm text-gray-700 font-medium">
              <p>• 무료 API 키: <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">여기서 발급</a></p>
              <p>• 제한: 5 calls/min, 500 calls/day</p>
              <p>• 데이터: 주식, 외환, 암호화폐</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">FRED (Federal Reserve)</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• 무료 API 키: <a href="https://fred.stlouisfed.org/docs/api/api_key.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">여기서 발급</a></p>
              <p>• 제한: 120 calls/min</p>
              <p>• 데이터: 경제 지표, 금리, GDP</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">CoinGecko</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• 무료 API: <a href="https://www.coingecko.com/en/api" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">여기서 확인</a></p>
              <p>• 제한: 10-50 calls/min</p>
              <p>• 데이터: 암호화폐 가격, 시장 데이터</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Yahoo Finance</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• 무료 API: 공식 API 없음 (비공식 사용)</p>
              <p>• 제한: CORS 정책으로 인한 제한</p>
              <p>• 데이터: 주식, 옵션, 외환</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
