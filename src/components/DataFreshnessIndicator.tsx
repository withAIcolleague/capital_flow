import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface DataFreshnessIndicatorProps {
  lastUpdated: string;
  dataSource: string;
  className?: string;
}

export default function DataFreshnessIndicator({ 
  lastUpdated, 
  dataSource, 
  className = '' 
}: DataFreshnessIndicatorProps) {
  const getDataAge = (dateString: string) => {
    const now = new Date();
    const dataDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - dataDate.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) return { age: '방금 전', status: 'fresh', color: 'text-green-400' };
    if (diffInHours < 24) return { age: `${diffInHours}시간 전`, status: 'recent', color: 'text-yellow-400' };
    if (diffInDays < 7) return { age: `${diffInDays}일 전`, status: 'stale', color: 'text-orange-400' };
    return { age: `${Math.floor(diffInDays / 30)}개월 전`, status: 'outdated', color: 'text-red-400' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fresh': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'recent': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'stale': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'outdated': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'fresh': return '최신 데이터';
      case 'recent': return '최근 데이터';
      case 'stale': return '오래된 데이터';
      case 'outdated': return '구식 데이터';
      default: return '알 수 없음';
    }
  };

  const { age, status, color } = getDataAge(lastUpdated);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon(status)}
          <div>
            <div className="text-sm text-white font-medium">
              {getStatusMessage(status)}
            </div>
            <div className="text-xs text-gray-400">
              마지막 업데이트: {age}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-gray-400">
            출처: {dataSource}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="데이터 새로고침"
          >
            <RefreshCw className="w-3 h-3" />
          </motion.button>
        </div>
      </div>
      
      {/* 데이터 신선도 바 */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ 
            width: status === 'fresh' ? '100%' : 
                   status === 'recent' ? '75%' : 
                   status === 'stale' ? '50%' : '25%'
          }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className={`h-full rounded-full ${
            status === 'fresh' ? 'bg-green-400' :
            status === 'recent' ? 'bg-yellow-400' :
            status === 'stale' ? 'bg-orange-400' : 'bg-red-400'
          }`}
        />
      </motion.div>
    </motion.div>
  );
}
