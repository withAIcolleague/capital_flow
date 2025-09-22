import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Activity,
  Zap,
  Clock,
  RefreshCw,
  Database,
  CheckCircle,
  AlertCircle,
  DollarSign,
  BarChart3,
  Eye,
  Bell
} from 'lucide-react';

interface RealTimeDataFeedProps {
  className?: string;
}

interface PriceUpdate {
  id: string;
  symbol: string;
  price: number;
  change: number;
  volume: number;
  timestamp: string;
  source: string;
}

interface FlowUpdate {
  id: string;
  from: string;
  to: string;
  amount: number;
  type: 'in' | 'out' | 'neutral';
  timestamp: string;
  source: string;
}

interface Alert {
  id: string;
  type: 'price' | 'flow' | 'anomaly' | 'system';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  isRead: boolean;
}

export default function RealTimeDataFeed({ className = '' }: RealTimeDataFeedProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [selectedTab, setSelectedTab] = useState<'prices' | 'flows' | 'alerts'>('prices');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 실시간 데이터 (모의 데이터)
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([
    {
      id: '1',
      symbol: 'BTC',
      price: 65000,
      change: 2.5,
      volume: 28500000000,
      timestamp: '2024-12-01T12:00:00Z',
      source: 'CoinGecko'
    },
    {
      id: '2',
      symbol: 'ETH',
      price: 3500,
      change: -1.2,
      volume: 15200000000,
      timestamp: '2024-12-01T12:00:00Z',
      source: 'CoinGecko'
    },
    {
      id: '3',
      symbol: 'AAPL',
      price: 180.50,
      change: 0.8,
      volume: 4500000000,
      timestamp: '2024-12-01T12:00:00Z',
      source: 'Yahoo Finance'
    }
  ]);

  const [flowUpdates, setFlowUpdates] = useState<FlowUpdate[]>([
    {
      id: '1',
      from: 'Institutional',
      to: 'Bitcoin',
      amount: 1500000000,
      type: 'in',
      timestamp: '2024-12-01T12:00:00Z',
      source: 'Chainalysis'
    },
    {
      id: '2',
      from: 'Ethereum',
      to: 'Stablecoins',
      amount: 800000000,
      type: 'out',
      timestamp: '2024-12-01T11:58:00Z',
      source: 'Chainalysis'
    }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'price',
      title: '비트코인 급등',
      message: '비트코인이 24시간 내 5% 이상 상승했습니다.',
      severity: 'medium',
      timestamp: '2024-12-01T12:00:00Z',
      isRead: false
    },
    {
      id: '2',
      type: 'flow',
      title: '대규모 자금 유입',
      message: '기관투자자로부터 15억 달러의 자금이 유입되었습니다.',
      severity: 'high',
      timestamp: '2024-12-01T11:55:00Z',
      isRead: false
    },
    {
      id: '3',
      type: 'anomaly',
      title: '이상 거래 감지',
      message: '의심스러운 거래 패턴이 감지되었습니다.',
      severity: 'critical',
      timestamp: '2024-12-01T11:50:00Z',
      isRead: true
    }
  ]);

  // 자동 새로고침
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastRefresh(new Date());
        // 실제로는 WebSocket이나 API 호출
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // 데이터 새로고침
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  // 데이터 신선도 계산
  const getDataFreshness = (timestamp: string) => {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    
    let status, color, text, timeText;
    
    if (diffMinutes < 1) {
      status = 'fresh';
      color = 'text-green-700';
      text = '실시간';
      timeText = '방금 전';
    } else if (diffMinutes < 5) {
      status = 'fresh';
      color = 'text-green-600';
      text = '최신';
      timeText = `${diffMinutes}분 전`;
    } else if (diffMinutes < 60) {
      status = 'recent';
      color = 'text-yellow-600';
      text = '최근';
      timeText = `${diffMinutes}분 전`;
    } else {
      status = 'stale';
      color = 'text-orange-600';
      text = '오래됨';
      timeText = `${diffHours}시간 전`;
    }
    
    return { status, color, text, timeText };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-700 bg-green-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'critical': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'price': return <DollarSign className="w-4 h-4" />;
      case 'flow': return <BarChart3 className="w-4 h-4" />;
      case 'anomaly': return <AlertTriangle className="w-4 h-4" />;
      case 'system': return <Activity className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number, decimals: number = 1) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(decimals)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
    return num.toFixed(decimals);
  };

  const unreadAlerts = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="w-8 h-8 text-green-600" />
            실시간 데이터 피드
          </h2>
          <p className="text-gray-700 mt-2 font-medium">
            실시간 가격, 자금 흐름, 알림 및 이상 징후 모니터링
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-700 font-medium">
              {isConnected ? '연결됨' : '연결 끊김'}
            </span>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-700 font-medium">마지막 업데이트</div>
            <div className="text-gray-900 font-bold">
              {lastRefresh.toLocaleTimeString('ko-KR')}
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 backdrop-blur-lg text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 border-2 border-blue-600 shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            새로고침
          </motion.button>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedTab('prices')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all backdrop-blur-lg border-2 ${
            selectedTab === 'prices'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-600 shadow-lg'
              : 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-gray-200 border-gray-400 shadow-md'
          }`}
        >
          <DollarSign className="w-4 h-4 inline mr-2" />
          가격 업데이트
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedTab('flows')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all backdrop-blur-lg border-2 ${
            selectedTab === 'flows'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-600 shadow-lg'
              : 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-gray-200 border-gray-400 shadow-md'
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          자금 흐름
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedTab('alerts')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all backdrop-blur-lg border-2 ${
            selectedTab === 'alerts'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-600 shadow-lg'
              : 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-gray-200 border-gray-400 shadow-md'
          }`}
        >
          <Bell className="w-4 h-4 inline mr-2" />
          알림 {unreadAlerts > 0 && (
            <span className="ml-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
              {unreadAlerts}
            </span>
          )}
        </motion.button>
      </div>

      {/* 탭 콘텐츠 */}
      <AnimatePresence mode="wait">
        {selectedTab === 'prices' && (
          <motion.div
            key="prices"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {priceUpdates.map((update, index) => {
              const freshness = getDataFreshness(update.timestamp);
              return (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{update.symbol}</h3>
                        <p className="text-sm text-gray-700 font-medium">{update.source}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-black text-gray-900">
                        ${update.price.toLocaleString()}
                      </div>
                      <div className={`text-sm font-bold ${freshness.color}`}>
                        {freshness.text} • {freshness.timeText}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {update.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-700" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-700" />
                      )}
                      <span className={`font-black ${
                        update.change >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {update.change >= 0 ? '+' : ''}{update.change}%
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-700 font-medium">
                      거래량: ${formatNumber(update.volume)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {selectedTab === 'flows' && (
          <motion.div
            key="flows"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {flowUpdates.map((flow, index) => {
              const freshness = getDataFreshness(flow.timestamp);
              return (
                <motion.div
                  key={flow.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-green-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {flow.from} → {flow.to}
                        </h3>
                        <p className="text-sm text-gray-700 font-medium">{flow.source}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-black text-gray-900">
                        ${formatNumber(flow.amount)}
                      </div>
                      <div className={`text-sm font-bold ${freshness.color}`}>
                        {freshness.text} • {freshness.timeText}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      flow.type === 'in' ? 'text-green-700 bg-green-100' :
                      flow.type === 'out' ? 'text-red-700 bg-red-100' :
                      'text-gray-700 bg-gray-100'
                    }`}>
                      {flow.type === 'in' ? '유입' : flow.type === 'out' ? '유출' : '중립'}
                    </div>
                    
                    <div className="text-sm text-gray-700 font-medium">
                      {new Date(flow.timestamp).toLocaleString('ko-KR')}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {selectedTab === 'alerts' && (
          <motion.div
            key="alerts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {alerts.map((alert, index) => {
              const freshness = getDataFreshness(alert.timestamp);
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 shadow-lg ${
                    alert.isRead ? 'border-gray-300' : 'border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        alert.severity === 'critical' ? 'bg-red-100' :
                        alert.severity === 'high' ? 'bg-orange-100' :
                        alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        {getTypeIcon(alert.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{alert.title}</h3>
                        <p className="text-sm text-gray-700 font-medium">{alert.message}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${getSeverityColor(alert.severity)}`}>
                        {alert.severity === 'low' ? '낮음' :
                         alert.severity === 'medium' ? '보통' :
                         alert.severity === 'high' ? '높음' : '위험'}
                      </div>
                      <div className={`text-sm font-bold ${freshness.color} mt-1`}>
                        {freshness.text} • {freshness.timeText}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 데이터 소스 정보 */}
      <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-700" />
          실시간 데이터 소스
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">CoinGecko</h4>
            <p className="text-sm text-gray-700 font-medium">암호화폐 가격 데이터</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">실시간</span>
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">Yahoo Finance</h4>
            <p className="text-sm text-gray-700 font-medium">주식 가격 데이터</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">실시간</span>
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">Chainalysis</h4>
            <p className="text-sm text-gray-700 font-medium">블록체인 분석 데이터</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">실시간</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}