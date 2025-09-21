import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bitcoin, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  ArrowLeft,
  Shield,
  AlertTriangle,
  Coins,
  DollarSign,
  Zap,
  Activity,
  Circle
} from 'lucide-react';

interface CryptoFlowData {
  id: string;
  name: string;
  symbol: string;
  marketCap: number;
  price: number;
  change24h: number;
  volume24h: number;
  flow: 'in' | 'out' | 'neutral';
  riskLevel: 'low' | 'medium' | 'high';
  category: 'major' | 'alt' | 'defi' | 'privacy';
  color: string;
  icon: any;
}

export default function CryptoFlowTracker() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const cryptoData: CryptoFlowData[] = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      marketCap: 1.2,
      price: 65000,
      change24h: 2.5,
      volume24h: 28.5,
      flow: 'in',
      riskLevel: 'medium',
      category: 'major',
      color: '#F7931A',
      icon: Bitcoin
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      marketCap: 0.8,
      price: 3200,
      change24h: -1.2,
      volume24h: 15.2,
      flow: 'out',
      riskLevel: 'medium',
      category: 'major',
      color: '#627EEA',
      icon: Circle
    },
    {
      id: 'tether',
      name: 'Tether',
      symbol: 'USDT',
      marketCap: 0.3,
      price: 1.00,
      change24h: 0.1,
      volume24h: 45.8,
      flow: 'neutral',
      riskLevel: 'high',
      category: 'major',
      color: '#26A17B',
      icon: DollarSign
    },
    {
      id: 'monero',
      name: 'Monero',
      symbol: 'XMR',
      marketCap: 0.05,
      price: 180,
      change24h: 5.8,
      volume24h: 0.8,
      flow: 'in',
      riskLevel: 'high',
      category: 'privacy',
      color: '#FF6600',
      icon: Shield
    },
    {
      id: 'chainlink',
      name: 'Chainlink',
      symbol: 'LINK',
      marketCap: 0.12,
      price: 18.5,
      change24h: -3.2,
      volume24h: 2.1,
      flow: 'out',
      riskLevel: 'low',
      category: 'defi',
      color: '#2A5ADA',
      icon: Activity
    }
  ];

  const timeframes = [
    { id: '1h', name: '1시간' },
    { id: '24h', name: '24시간' },
    { id: '7d', name: '7일' },
    { id: '30d', name: '30일' }
  ];

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'major', name: '메이저' },
    { id: 'alt', name: '알트코인' },
    { id: 'defi', name: 'DeFi' },
    { id: 'privacy', name: '프라이버시' }
  ];

  const filteredData = selectedCategory === 'all' 
    ? cryptoData 
    : cryptoData.filter(item => item.category === selectedCategory);

  const totalMarketCap = cryptoData.reduce((sum, item) => sum + item.marketCap, 0);
  const totalVolume = cryptoData.reduce((sum, item) => sum + item.volume24h, 0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getFlowIcon = (flow: string) => {
    switch (flow) {
      case 'in': return <ArrowRight className="w-4 h-4 text-green-400" />;
      case 'out': return <ArrowLeft className="w-4 h-4 text-red-400" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'high': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
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
            암호화폐 자금 흐름
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-purple-200"
          >
            디지털 자산을 실시간으로 추적합니다
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
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Bitcoin className="w-8 h-8 text-orange-400" />
            </motion.div>
            암호화폐 자금 흐름
          </motion.h1>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <div className="flex gap-2">
              {timeframes.map((timeframe) => (
                <motion.button
                  key={timeframe.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTimeframe(timeframe.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeframe === timeframe.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'
                  }`}
                >
                  {timeframe.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto p-6">
        {/* 요약 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Coins className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">총 시가총액</h3>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="text-3xl font-bold text-white"
            >
              ${totalMarketCap.toFixed(1)}T
            </motion.div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">24시간 거래량</h3>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
              className="text-3xl font-bold text-white"
            >
              ${totalVolume.toFixed(1)}B
            </motion.div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">활성 코인</h3>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 100 }}
              className="text-3xl font-bold text-white"
            >
              {cryptoData.length}
            </motion.div>
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
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 암호화폐 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((crypto, index) => (
            <motion.div
              key={crypto.id}
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
                    style={{ backgroundColor: `${crypto.color}20` }}
                  >
                    <crypto.icon className="w-6 h-6" style={{ color: crypto.color }} />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{crypto.name}</h3>
                    <p className="text-sm text-gray-400">{crypto.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getFlowIcon(crypto.flow)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(crypto.riskLevel)}`}>
                    {crypto.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">가격</p>
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="text-lg font-bold text-white"
                    >
                      ${crypto.price.toLocaleString()}
                    </motion.p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">시가총액</p>
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                      className="text-lg font-bold text-white"
                    >
                      ${crypto.marketCap}T
                    </motion.p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">24시간 변화</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.9 }}
                    className={`font-bold ${
                      crypto.change24h > 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {crypto.change24h > 0 ? '+' : ''}{crypto.change24h}%
                  </motion.span>
                </div>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: index * 0.1 + 1.1, duration: 1 }}
                  className="h-2 bg-gray-700 rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    transition={{ delay: index * 0.1 + 1.3, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: crypto.color,
                      width: `${Math.abs(crypto.change24h) * 10}%`
                    }}
                  />
                </motion.div>

                <div className="flex justify-between text-xs text-gray-400">
                  <span>거래량: ${crypto.volume24h}B</span>
                  <span>흐름: {crypto.flow}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 자금 흐름 애니메이션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <ArrowRight className="w-6 h-6 text-purple-400" />
              </motion.div>
              실시간 자금 흐름
            </h3>
            
            <div className="space-y-4">
              {filteredData.slice(0, 3).map((crypto, index) => (
                <motion.div
                  key={crypto.id}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2 + index * 0.2 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: crypto.color }}
                    />
                    <span className="text-white font-medium">{crypto.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '200px' }}
                      transition={{ delay: 1.4 + index * 0.2, duration: 0.8 }}
                      className="h-2 bg-gray-700 rounded-full overflow-hidden"
                    >
                      <motion.div
                        initial={{ x: crypto.flow === 'in' ? '-100%' : '100%' }}
                        animate={{ x: 0 }}
                        transition={{ delay: 1.6 + index * 0.2, duration: 0.6 }}
                        className={`h-full rounded-full ${
                          crypto.flow === 'in' ? 'bg-green-400' : 'bg-red-400'
                        }`}
                        style={{ 
                          width: `${Math.abs(crypto.change24h) * 5}%`,
                          marginLeft: crypto.flow === 'in' ? '0' : 'auto'
                        }}
                      />
                    </motion.div>
                    
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.8 + index * 0.2 }}
                      className={`font-bold ${
                        crypto.change24h > 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {crypto.change24h > 0 ? '+' : ''}{crypto.change24h}%
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
