import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Building2,
  Coins,
  Globe,
  Lock,
  Unlock
} from 'lucide-react';

interface ShadowEconomyData {
  id: string;
  name: string;
  category: 'shadow' | 'offshore' | 'illicit' | 'crypto' | 'physical';
  estimatedValue: number;
  unit: 'T';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
  description: string;
  color: string;
  icon: any;
}

export default function ShadowEconomyTracker() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const shadowEconomyData: ShadowEconomyData[] = [
    {
      id: 'shadow_economy',
      name: '그림자 경제',
      category: 'shadow',
      estimatedValue: 15.0,
      unit: 'T',
      riskLevel: 'high',
      trend: 'up',
      lastUpdate: '2024-12-01',
      description: 'GDP의 10-20% 규모의 비공식 경제 활동',
      color: '#EF4444',
      icon: EyeOff
    },
    {
      id: 'offshore_wealth',
      name: '조세회피처 자산',
      category: 'offshore',
      estimatedValue: 8.5,
      unit: 'T',
      riskLevel: 'critical',
      trend: 'stable',
      lastUpdate: '2024-11-15',
      description: '역외펀드, 신탁, 유령회사 등을 통한 자산 은닉',
      color: '#F59E0B',
      icon: Building2
    },
    {
      id: 'illicit_finance',
      name: '불법 금융',
      category: 'illicit',
      estimatedValue: 1.5,
      unit: 'T',
      riskLevel: 'critical',
      trend: 'up',
      lastUpdate: '2024-12-10',
      description: '마약, 무기, 사이버 범죄 등 불법 활동 자금',
      color: '#DC2626',
      icon: AlertTriangle
    },
    {
      id: 'crypto_assets',
      name: '암호화폐 자산',
      category: 'crypto',
      estimatedValue: 2.5,
      unit: 'T',
      riskLevel: 'medium',
      trend: 'up',
      lastUpdate: '2024-12-15',
      description: '비트코인, 이더리움 등 암호화폐 시가총액',
      color: '#8B5CF6',
      icon: Coins
    },
    {
      id: 'physical_assets',
      name: '현물 자산',
      category: 'physical',
      estimatedValue: 18.0,
      unit: 'T',
      riskLevel: 'low',
      trend: 'stable',
      lastUpdate: '2024-11-30',
      description: '금, 현금, 예술품, 다이아몬드 등 현물 자산',
      color: '#10B981',
      icon: DollarSign
    }
  ];

  const categories = [
    { id: 'all', name: '전체', icon: Globe },
    { id: 'shadow', name: '그림자경제', icon: EyeOff },
    { id: 'offshore', name: '조세회피처', icon: Building2 },
    { id: 'illicit', name: '불법금융', icon: AlertTriangle },
    { id: 'crypto', name: '암호화폐', icon: Coins },
    { id: 'physical', name: '현물자산', icon: DollarSign }
  ];

  const filteredData = selectedCategory === 'all' 
    ? shadowEconomyData 
    : shadowEconomyData.filter(item => item.category === selectedCategory);

  const totalValue = shadowEconomyData.reduce((sum, item) => sum + item.estimatedValue, 0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/20';
      case 'critical': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-400" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            비제도권 자금 추적
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-red-200"
          >
            그림자 경제를 모니터링합니다
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      {/* 헤더 */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 border-b border-red-800/30"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.h1
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Eye className="w-8 h-8 text-red-400" />
            </motion.div>
            비제도권 자금 추적
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
              onClick={() => setIsVisible(!isVisible)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isVisible
                  ? 'bg-red-600 text-white'
                  : 'bg-red-800/50 text-red-200 hover:bg-red-700/50'
              }`}
            >
              {isVisible ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {isVisible ? '공개 모드' : '비공개 모드'}
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto p-6">
        {/* 총합 요약 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">비제도권 자금 총합</h2>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 rounded-lg bg-red-500/20"
              >
                <Shield className="w-6 h-6 text-red-400" />
              </motion.div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                className="text-4xl font-bold text-white"
              >
                ${totalValue.toFixed(1)}T
              </motion.span>
              <span className="text-lg text-gray-300">추정 규모</span>
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-red-200 text-sm mt-2"
            >
              ⚠️ 이는 추정치이며, 실제 규모는 더 클 수 있습니다
            </motion.p>
          </div>
        </motion.div>

        {/* 카테고리 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white'
                    : 'bg-red-800/50 text-red-200 hover:bg-red-700/50'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 데이터 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.2 }
              }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(item.trend)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(item.riskLevel)}`}>
                    {item.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="text-3xl font-bold text-white"
                  >
                    ${item.estimatedValue}
                  </motion.span>
                  <span className="text-lg text-gray-300">{item.unit}</span>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.7 }}
                  className="text-sm text-gray-300"
                >
                  {item.description}
                </motion.p>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: index * 0.1 + 0.9, duration: 1 }}
                  className="h-1 bg-gray-700 rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    transition={{ delay: index * 0.1 + 1.1, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: item.color,
                      width: `${(item.estimatedValue / totalValue) * 100}%`
                    }}
                  />
                </motion.div>

                <div className="flex justify-between text-xs text-gray-400">
                  <span>마지막 업데이트: {item.lastUpdate}</span>
                  <span>위험도: {item.riskLevel}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 경고 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-bold text-red-400">중요 고지사항</h3>
            </div>
            <p className="text-red-200 text-sm">
              이 데이터는 공개된 연구 자료와 추정치를 바탕으로 한 것으로, 
              실제 비제도권 자금의 규모와 흐름은 더 복잡하고 정확한 측정이 어렵습니다. 
              투자 결정에 참고용으로만 사용하시기 바랍니다.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
