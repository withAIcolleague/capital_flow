import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link, 
  Bitcoin, 
  Coins, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Shield,
  Eye,
  Zap,
  DollarSign,
  BarChart3,
  Target,
  AlertTriangle
} from 'lucide-react';

interface BlockchainData {
  id: string;
  network: string;
  symbol: string;
  marketCap: number;
  price: number;
  change24h: number;
  volume24h: number;
  transactions: number;
  activeAddresses: number;
  hashRate: number;
  difficulty: number;
  blockTime: number;
  icon: any;
  color: string;
}

interface TransactionFlow {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  type: 'normal' | 'suspicious' | 'mixing' | 'tornado';
  risk: 'low' | 'medium' | 'high' | 'critical';
  color: string;
}

export default function BlockchainAnalyzer() {
  const [blockchainData, setBlockchainData] = useState<BlockchainData[]>([]);
  const [transactionFlows, setTransactionFlows] = useState<TransactionFlow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'transactions' | 'analysis'>('overview');

  const networks = [
    { id: 'all', name: '전체', icon: Link },
    { id: 'bitcoin', name: 'Bitcoin', icon: Bitcoin },
    { id: 'ethereum', name: 'Ethereum', icon: Coins },
    { id: 'binance', name: 'Binance Smart Chain', icon: Activity },
    { id: 'polygon', name: 'Polygon', icon: Shield }
  ];

  // 샘플 블록체인 데이터
  const sampleBlockchainData: BlockchainData[] = [
    {
      id: 'bitcoin',
      network: 'Bitcoin',
      symbol: 'BTC',
      marketCap: 1.2,
      price: 65000,
      change24h: 2.5,
      volume24h: 28.5,
      transactions: 285000,
      activeAddresses: 850000,
      hashRate: 450,
      difficulty: 67.2,
      blockTime: 10,
      icon: Bitcoin,
      color: '#F7931A'
    },
    {
      id: 'ethereum',
      network: 'Ethereum',
      symbol: 'ETH',
      marketCap: 0.8,
      price: 3200,
      change24h: -1.2,
      volume24h: 15.2,
      transactions: 1200000,
      activeAddresses: 450000,
      hashRate: 0,
      difficulty: 0,
      blockTime: 13,
      icon: Coins,
      color: '#627EEA'
    },
    {
      id: 'binance',
      network: 'Binance Smart Chain',
      symbol: 'BNB',
      marketCap: 0.15,
      price: 320,
      change24h: 3.8,
      volume24h: 8.7,
      transactions: 3500000,
      activeAddresses: 120000,
      hashRate: 0,
      difficulty: 0,
      blockTime: 3,
      icon: Activity,
      color: '#F3BA2F'
    }
  ];

  // 샘플 트랜잭션 흐름 데이터
  const sampleTransactionFlows: TransactionFlow[] = [
    {
      id: '1',
      from: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      to: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      amount: 12.5,
      timestamp: '2024-12-20 14:30:25',
      type: 'normal',
      risk: 'low',
      color: '#10B981'
    },
    {
      id: '2',
      from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      to: '0x8ba1f109551bD432803012645Hac136c',
      amount: 150.0,
      timestamp: '2024-12-20 14:28:15',
      type: 'suspicious',
      risk: 'high',
      color: '#EF4444'
    },
    {
      id: '3',
      from: 'Tornado.Cash',
      to: '0x1234567890123456789012345678901234567890',
      amount: 10.0,
      timestamp: '2024-12-20 14:25:30',
      type: 'tornado',
      risk: 'critical',
      color: '#DC2626'
    },
    {
      id: '4',
      from: '0xabcdef1234567890abcdef1234567890abcdef12',
      to: '0x9876543210987654321098765432109876543210',
      amount: 5.0,
      timestamp: '2024-12-20 14:22:45',
      type: 'mixing',
      risk: 'medium',
      color: '#F59E0B'
    }
  ];

  const filteredBlockchainData = selectedNetwork === 'all' 
    ? blockchainData 
    : blockchainData.filter(data => data.id === selectedNetwork);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setBlockchainData(sampleBlockchainData);
      setTransactionFlows(sampleTransactionFlows);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/20';
      case 'critical': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'normal': return Shield;
      case 'suspicious': return AlertTriangle;
      case 'mixing': return Eye;
      case 'tornado': return Zap;
      default: return Activity;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            블록체인 분석 도구
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-green-200"
          >
            블록체인 네트워크를 실시간으로 분석합니다
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* 헤더 */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 border-b border-green-800/30"
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
              <Link className="w-8 h-8 text-green-400" />
            </motion.div>
            블록체인 분석 도구
          </motion.h1>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-2"
          >
            {['overview', 'transactions', 'analysis'].map((mode) => (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(mode as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-green-600 text-white'
                    : 'bg-green-800/50 text-green-200 hover:bg-green-700/50'
                }`}
              >
                {mode === 'overview' ? '개요' : mode === 'transactions' ? '트랜잭션' : '분석'}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto p-6">
        {/* 네트워크 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {networks.map((network, index) => (
              <motion.button
                key={network.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedNetwork(network.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedNetwork === network.id
                    ? 'bg-green-600 text-white'
                    : 'bg-green-800/50 text-green-200 hover:bg-green-700/50'
                }`}
              >
                <network.icon className="w-4 h-4" />
                {network.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {viewMode === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* 블록체인 네트워크 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlockchainData.map((data, index) => (
                  <motion.div
                    key={data.id}
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
                          style={{ backgroundColor: `${data.color}20` }}
                        >
                          <data.icon className="w-6 h-6" style={{ color: data.color }} />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{data.network}</h3>
                          <p className="text-sm text-gray-400">{data.symbol}</p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                      >
                        {data.change24h > 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                      </motion.div>
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
                            ${data.price.toLocaleString()}
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
                            ${data.marketCap}T
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
                            data.change24h > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {data.change24h > 0 ? '+' : ''}{data.change24h}%
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
                            backgroundColor: data.color,
                            width: `${Math.abs(data.change24h) * 10}%`
                          }}
                        />
                      </motion.div>

                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                        <div>
                          <span>거래량: ${data.volume24h}B</span>
                        </div>
                        <div>
                          <span>트랜잭션: {data.transactions.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {viewMode === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Activity className="w-6 h-6 text-green-400" />
                  </motion.div>
                  실시간 트랜잭션 흐름
                </h2>
                
                <div className="space-y-4">
                  {transactionFlows.map((tx, index) => {
                    const TypeIcon = getTransactionTypeIcon(tx.type);
                    return (
                      <motion.div
                        key={tx.id}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${tx.color}20` }}
                          >
                            <TypeIcon className="w-4 h-4" style={{ color: tx.color }} />
                          </motion.div>
                          <div>
                            <div className="text-white font-medium">
                              {tx.from.slice(0, 8)}...{tx.from.slice(-8)}
                            </div>
                            <div className="text-sm text-gray-400">
                              → {tx.to.slice(0, 8)}...{tx.to.slice(-8)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-white font-bold">${tx.amount}</div>
                            <div className="text-xs text-gray-400">{tx.timestamp}</div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(tx.risk)}`}>
                            {tx.risk.toUpperCase()}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Target className="w-6 h-6 text-green-400" />
                  블록체인 분석 결과
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">네트워크 건강도</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">해시레이트</span>
                        <span className="text-white font-bold">450 EH/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">난이도</span>
                        <span className="text-white font-bold">67.2T</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">블록 시간</span>
                        <span className="text-white font-bold">10분</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">보안 지표</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">51% 공격 위험</span>
                        <span className="text-green-400 font-bold">낮음</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">이중 지출 위험</span>
                        <span className="text-green-400 font-bold">매우 낮음</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">네트워크 분산도</span>
                        <span className="text-yellow-400 font-bold">보통</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
