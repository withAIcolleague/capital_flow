import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Zap,
  Shield,
  Eye,
  BarChart3,
  Target
} from 'lucide-react';

interface AnomalyData {
  id: string;
  type: 'statistical' | 'pattern' | 'volume' | 'velocity' | 'behavioral';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  description: string;
  asset: string;
  value: number;
  expectedValue: number;
  deviation: number;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  icon: any;
  color: string;
}

export default function MLAnomalyDetector() {
  const [anomalies, setAnomalies] = useState<AnomalyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isMLEnabled, setIsMLEnabled] = useState(true);

  const anomalyTypes = [
    { id: 'all', name: '전체', icon: Brain },
    { id: 'statistical', name: '통계적', icon: BarChart3 },
    { id: 'pattern', name: '패턴', icon: Target },
    { id: 'volume', name: '거래량', icon: Activity },
    { id: 'velocity', name: '속도', icon: Zap },
    { id: 'behavioral', name: '행동', icon: Eye }
  ];

  // 샘플 이상 데이터
  const sampleAnomalies: AnomalyData[] = [
    {
      id: '1',
      type: 'statistical',
      severity: 'high',
      confidence: 87,
      description: '주식 시장에서 평균 대비 3.2 표준편차 이상의 거래량 급증 감지',
      asset: 'EQUITY',
      value: 125.6,
      expectedValue: 85.2,
      deviation: 47.4,
      timestamp: '2024-12-20 14:30:25',
      status: 'new',
      icon: BarChart3,
      color: '#EF4444'
    },
    {
      id: '2',
      type: 'pattern',
      severity: 'critical',
      confidence: 94,
      description: '비정상적인 자금 이동 패턴: 다크풀 거래와 연관된 의심스러운 흐름',
      asset: 'SHADOW',
      value: 2.8,
      expectedValue: 0.5,
      deviation: 460,
      timestamp: '2024-12-20 13:45:12',
      status: 'investigating',
      icon: Target,
      color: '#DC2626'
    },
    {
      id: '3',
      type: 'volume',
      severity: 'medium',
      confidence: 72,
      description: '암호화폐 거래량이 평균 대비 300% 급증',
      asset: 'BTC',
      value: 28.5,
      expectedValue: 9.5,
      deviation: 200,
      timestamp: '2024-12-20 12:15:33',
      status: 'new',
      icon: Activity,
      color: '#F59E0B'
    },
    {
      id: '4',
      type: 'velocity',
      severity: 'high',
      confidence: 81,
      description: '초고속 자금 이동: 1분 내 $50B 규모 이동 감지',
      asset: 'CASH',
      value: 50.0,
      expectedValue: 5.0,
      deviation: 900,
      timestamp: '2024-12-20 11:20:45',
      status: 'investigating',
      icon: Zap,
      color: '#8B5CF6'
    },
    {
      id: '5',
      type: 'behavioral',
      severity: 'medium',
      confidence: 68,
      description: '비정상적인 거래 시간대 활동: 새벽 3시 대량 거래',
      asset: 'BONDS',
      value: 15.2,
      expectedValue: 2.1,
      deviation: 624,
      timestamp: '2024-12-20 10:05:18',
      status: 'resolved',
      icon: Eye,
      color: '#10B981'
    }
  ];

  const filteredAnomalies = selectedType === 'all' 
    ? anomalies 
    : anomalies.filter(anomaly => anomaly.type === selectedType);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAnomalies(sampleAnomalies);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'high': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'critical': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-400 bg-blue-400/20';
      case 'investigating': return 'text-orange-400 bg-orange-400/20';
      case 'resolved': return 'text-green-400 bg-green-400/20';
      case 'false_positive': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-red-400';
    if (confidence >= 70) return 'text-orange-400';
    if (confidence >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            ML 이상 탐지 시스템
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-purple-200"
          >
            머신러닝으로 이상 패턴을 분석합니다
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 헤더 */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 border-b border-purple-800/30"
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
              <Brain className="w-8 h-8 text-purple-400" />
            </motion.div>
            ML 이상 탐지 시스템
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
              onClick={() => setIsMLEnabled(!isMLEnabled)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isMLEnabled
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'
              }`}
            >
              <Brain className="w-4 h-4" />
              {isMLEnabled ? 'ML 활성화' : 'ML 비활성화'}
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto p-6">
        {/* ML 모델 상태 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">ML 모델 상태</h2>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 rounded-lg bg-purple-500/20"
              >
                <Shield className="w-6 h-6 text-purple-400" />
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">5</div>
                <div className="text-sm text-gray-300">활성 모델</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">94.2%</div>
                <div className="text-sm text-gray-300">정확도</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">12ms</div>
                <div className="text-sm text-gray-300">평균 응답시간</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{anomalies.length}</div>
                <div className="text-sm text-gray-300">탐지된 이상</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 이상 타입 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {anomalyTypes.map((type, index) => (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedType === type.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 이상 목록 */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredAnomalies.map((anomaly, index) => (
              <motion.div
                key={anomaly.id}
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
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border shadow-2xl ${getSeverityColor(anomaly.severity)}`}
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
                      style={{ backgroundColor: `${anomaly.color}20` }}
                    >
                      <anomaly.icon className="w-6 h-6" style={{ color: anomaly.color }} />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{anomaly.description}</h3>
                      <p className="text-sm text-gray-300">{anomaly.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityColor(anomaly.severity)}`}>
                      {anomaly.severity.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(anomaly.status)}`}>
                      {anomaly.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">자산</p>
                    <p className="text-white font-medium">{anomaly.asset}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">실제 값</p>
                    <p className="text-white font-bold">${anomaly.value}B</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">예상 값</p>
                    <p className="text-white font-bold">${anomaly.expectedValue}B</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">편차:</span>
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="font-bold text-red-400"
                      >
                        +{anomaly.deviation}%
                      </motion.span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">신뢰도:</span>
                      <motion.span
                        className={`font-bold ${getConfidenceColor(anomaly.confidence)}`}
                      >
                        {anomaly.confidence}%
                      </motion.span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                      조사 시작
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      무시
                    </motion.button>
                  </div>
                </div>

                {/* 신뢰도 바 */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                  className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${anomaly.confidence}%` }}
                    transition={{ delay: index * 0.1 + 0.7, duration: 0.8 }}
                    className={`h-full rounded-full ${
                      anomaly.confidence >= 90 ? 'bg-red-400' :
                      anomaly.confidence >= 70 ? 'bg-orange-400' :
                      anomaly.confidence >= 50 ? 'bg-yellow-400' : 'bg-green-400'
                    }`}
                  />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ML 모델 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <Brain className="w-6 h-6 text-purple-400" />
              ML 모델 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">활성 모델</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• LSTM 시계열 이상 탐지 (정확도: 94.2%)</li>
                  <li>• Isolation Forest 이상치 탐지 (정확도: 91.8%)</li>
                  <li>• Autoencoder 패턴 분석 (정확도: 89.5%)</li>
                  <li>• Random Forest 분류 (정확도: 87.3%)</li>
                  <li>• SVM 이상 탐지 (정확도: 85.1%)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">성능 지표</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• 평균 응답시간: 12ms</li>
                  <li>• 처리량: 1,000 TPS</li>
                  <li>• 가양성률: 2.3%</li>
                  <li>• 가음성률: 1.8%</li>
                  <li>• 모델 업데이트: 매일 02:00</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
