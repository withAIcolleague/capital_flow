import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Shield,
  Eye,
  Zap,
  Activity,
  DollarSign,
  Building2,
  Coins,
  Globe
} from 'lucide-react';

interface AlertData {
  id: string;
  type: 'flow' | 'risk' | 'anomaly' | 'threshold';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  asset: string;
  value: number;
  change: number;
  icon: any;
  color: string;
}

export default function RealTimeAlerts() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const sampleAlerts: AlertData[] = [
    {
      id: '1',
      type: 'flow',
      severity: 'high',
      title: '대규모 자금 유출 감지',
      description: '주식 시장에서 $38.66B 규모의 자금 유출이 감지되었습니다.',
      timestamp: '2024-12-20 14:30:25',
      asset: 'EQUITY',
      value: 38.66,
      change: -2.3,
      icon: TrendingDown,
      color: '#EF4444'
    },
    {
      id: '2',
      type: 'risk',
      severity: 'critical',
      title: '비제도권 자금 급증',
      description: '그림자 경제 자금이 15% 증가하여 $15T를 초과했습니다.',
      timestamp: '2024-12-20 13:45:12',
      asset: 'SHADOW',
      value: 15.0,
      change: 15.0,
      icon: Eye,
      color: '#DC2626'
    },
    {
      id: '3',
      type: 'anomaly',
      severity: 'medium',
      title: '암호화폐 거래량 급증',
      description: '비트코인 거래량이 평균 대비 300% 증가했습니다.',
      timestamp: '2024-12-20 12:15:33',
      asset: 'BTC',
      value: 28.5,
      change: 300,
      icon: Coins,
      color: '#F59E0B'
    },
    {
      id: '4',
      type: 'threshold',
      severity: 'low',
      title: '채권 시장 안정화',
      description: '채권 시장이 정상 범위로 복귀했습니다.',
      timestamp: '2024-12-20 11:20:45',
      asset: 'BONDS',
      value: 145.1,
      change: 1.8,
      icon: TrendingUp,
      color: '#10B981'
    },
    {
      id: '5',
      type: 'flow',
      severity: 'medium',
      title: 'FDI 유입 감소',
      description: '직접투자 유입이 전월 대비 8% 감소했습니다.',
      timestamp: '2024-12-20 10:05:18',
      asset: 'FDI',
      value: 1.5,
      change: -8.0,
      icon: Globe,
      color: '#8B5CF6'
    }
  ];

  const alertTypes = [
    { id: 'all', name: '전체', icon: Bell },
    { id: 'flow', name: '자금흐름', icon: Activity },
    { id: 'risk', name: '위험', icon: AlertTriangle },
    { id: 'anomaly', name: '이상징후', icon: Zap },
    { id: 'threshold', name: '임계값', icon: Shield }
  ];

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filter);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAlerts(sampleAlerts);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isSoundEnabled && alerts.length > 0) {
      // 실제 환경에서는 알림음 재생
      console.log('🔔 알림음 재생');
    }
  }, [alerts, isSoundEnabled]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'high': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'critical': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flow': return Activity;
      case 'risk': return AlertTriangle;
      case 'anomaly': return Zap;
      case 'threshold': return Shield;
      default: return Bell;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            실시간 알림 시스템
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-orange-200"
          >
            자금 흐름을 모니터링하고 있습니다
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      {/* 헤더 */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 border-b border-orange-800/30"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.h1
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white flex items-center gap-3"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <Bell className="w-8 h-8 text-orange-400" />
            </motion.div>
            실시간 알림 시스템
          </motion.h1>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isSoundEnabled
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-800/50 text-orange-200 hover:bg-orange-700/50'
              }`}
            >
              {isSoundEnabled ? '🔊' : '🔇'}
              {isSoundEnabled ? '음성 켜짐' : '음성 꺼짐'}
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto p-6">
        {/* 알림 타입 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {alertTypes.map((type, index) => (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(type.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  filter === type.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-800/50 text-orange-200 hover:bg-orange-700/50'
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 알림 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Bell className="w-6 h-6 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">총 알림</h3>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              className="text-3xl font-bold text-white"
            >
              {alerts.length}
            </motion.div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-white">긴급 알림</h3>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
              className="text-3xl font-bold text-white"
            >
              {alerts.filter(a => a.severity === 'critical').length}
            </motion.div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">자금 흐름</h3>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.0, type: "spring", stiffness: 100 }}
              className="text-3xl font-bold text-white"
            >
              {alerts.filter(a => a.type === 'flow').length}
            </motion.div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">이상 징후</h3>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
              className="text-3xl font-bold text-white"
            >
              {alerts.filter(a => a.type === 'anomaly').length}
            </motion.div>
          </div>
        </motion.div>

        {/* 알림 목록 */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border shadow-2xl ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${alert.color}20` }}
                    >
                      <alert.icon className="w-6 h-6" style={{ color: alert.color }} />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{alert.title}</h3>
                      <p className="text-sm text-gray-300">{alert.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: alert.color }}
                    />
                  </div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="text-gray-300 mb-4"
                >
                  {alert.description}
                </motion.p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">자산:</span>
                      <span className="text-white font-medium">{alert.asset}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">값:</span>
                      <span className="text-white font-bold">${alert.value}B</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">변화:</span>
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className={`font-bold ${
                          alert.change > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {alert.change > 0 ? '+' : ''}{alert.change}%
                      </motion.span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                  >
                    상세 보기
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 실시간 업데이트 표시 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
            실시간 업데이트 중...
          </div>
        </motion.div>
      </main>
    </div>
  );
}
