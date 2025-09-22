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
  AlertTriangle,
  RefreshCw,
  Clock,
  Database,
  CheckCircle,
  AlertCircle
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
  lastUpdated: string;
  dataSource: string;
  reliability: 'high' | 'medium' | 'low';
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [selectedNetwork, setSelectedNetwork] = useState('all');

  const networks = [
    { id: 'all', name: '전체', icon: Link },
    { id: 'bitcoin', name: 'Bitcoin', icon: Bitcoin },
    { id: 'ethereum', name: 'Ethereum', icon: Coins },
    { id: 'binance', name: 'Binance Smart Chain', icon: Activity },
    { id: 'polygon', name: 'Polygon', icon: Shield }
  ];

  const blockchainDataList: BlockchainData[] = [
    {
      id: 'bitcoin',
      network: 'Bitcoin',
      symbol: 'BTC',
      marketCap: 1.2,
      price: 65000,
      change24h: 2.5,
      volume24h: 28.5,
      transactions: 250000,
      activeAddresses: 800000,
      hashRate: 180,
      difficulty: 25.4,
      blockTime: 10,
      icon: Bitcoin,
      color: '#F7931A',
      lastUpdated: '2024-12-01T12:00:00Z',
      dataSource: 'Blockchain.info',
      reliability: 'high'
    },
    {
      id: 'ethereum',
      network: 'Ethereum',
      symbol: 'ETH',
      marketCap: 0.4,
      price: 3500,
      change24h: -1.2,
      volume24h: 15.2,
      transactions: 1200000,
      activeAddresses: 450000,
      hashRate: 0,
      difficulty: 0,
      blockTime: 13,
      icon: Coins,
      color: '#627EEA',
      lastUpdated: '2024-12-01T12:00:00Z',
      dataSource: 'Etherscan',
      reliability: 'high'
    },
    {
      id: 'binance',
      network: 'Binance Smart Chain',
      symbol: 'BNB',
      marketCap: 0.08,
      price: 320,
      change24h: 3.8,
      volume24h: 2.1,
      transactions: 800000,
      activeAddresses: 200000,
      hashRate: 0,
      difficulty: 0,
      blockTime: 3,
      icon: Activity,
      color: '#F3BA2F',
      lastUpdated: '2024-12-01T12:00:00Z',
      dataSource: 'BSCScan',
      reliability: 'high'
    },
    {
      id: 'polygon',
      network: 'Polygon',
      symbol: 'MATIC',
      marketCap: 0.05,
      price: 0.45,
      change24h: -2.1,
      volume24h: 1.8,
      transactions: 500000,
      activeAddresses: 150000,
      hashRate: 0,
      difficulty: 0,
      blockTime: 2,
      icon: Shield,
      color: '#8247E5',
      lastUpdated: '2024-12-01T12:00:00Z',
      dataSource: 'PolygonScan',
      reliability: 'high'
    }
  ];

  const transactionFlowData: TransactionFlow[] = [
    {
      id: '1',
      from: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      to: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      amount: 12.5,
      timestamp: '2024-12-01T12:00:00Z',
      type: 'normal',
      risk: 'low',
      color: '#10B981'
    },
    {
      id: '2',
      from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      to: '0x8ba1f109551bD432803012645Hac136c',
      amount: 150.0,
      timestamp: '2024-12-01T11:58:00Z',
      type: 'suspicious',
      risk: 'high',
      color: '#EF4444'
    },
    {
      id: '3',
      from: '0x1234567890123456789012345678901234567890',
      to: '0x0987654321098765432109876543210987654321',
      amount: 0.1,
      timestamp: '2024-12-01T11:55:00Z',
      type: 'mixing',
      risk: 'critical',
      color: '#F59E0B'
    }
  ];

  useEffect(() => {
    setBlockchainData(blockchainDataList);
    setTransactionFlows(transactionFlowData);
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 데이터 새로고침
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  // 데이터 신선도 계산
  const getDataFreshness = (lastUpdated: string) => {
    const now = new Date();
    const updated = new Date(lastUpdated);
    const diffMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    let status, color, text, timeText;
    
    if (diffMinutes < 5) {
      status = 'fresh';
      color = 'text-green-700';
      text = '실시간';
      timeText = `${diffMinutes}분 전`;
    } else if (diffMinutes < 60) {
      status = 'recent';
      color = 'text-green-600';
      text = '최신';
      timeText = `${diffMinutes}분 전`;
    } else if (diffHours < 6) {
      status = 'recent';
      color = 'text-yellow-600';
      text = '최근';
      timeText = `${diffHours}시간 전`;
    } else if (diffHours < 24) {
      status = 'stale';
      color = 'text-orange-600';
      text = '오래됨';
      timeText = `${diffHours}시간 전`;
    } else {
      status = 'outdated';
      color = 'text-red-600';
      text = '구식';
      timeText = `${diffDays}일 전`;
    }
    
    return { status, color, text, timeText };
  };

  // 신뢰도 아이콘
  const getReliabilityIcon = (reliability: string) => {
    switch (reliability) {
      case 'high': return <CheckCircle className="w-4 h-4 text-green-700" />;
      case 'medium': return <AlertCircle className="w-4 h-4 text-yellow-700" />;
      case 'low': return <AlertCircle className="w-4 h-4 text-red-700" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-700" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-700 bg-green-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'high': return 'text-red-700 bg-red-100';
      case 'critical': return 'text-red-800 bg-red-200';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'normal': return 'text-green-700 bg-green-100';
      case 'suspicious': return 'text-yellow-700 bg-yellow-100';
      case 'mixing': return 'text-orange-700 bg-orange-100';
      case 'tornado': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const formatNumber = (num: number, decimals: number = 1) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(decimals)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
    return num.toFixed(decimals);
  };

  const filteredData = selectedNetwork === 'all' 
    ? blockchainData 
    : blockchainData.filter(item => item.id === selectedNetwork);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            블록체인 분석
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-700 font-medium"
          >
            블록체인 네트워크를 실시간으로 분석합니다
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Link className="w-8 h-8 text-blue-600" />
            블록체인 분석
          </h2>
          <p className="text-gray-700 mt-2 font-medium">
            블록체인 네트워크의 실시간 분석 및 거래 추적
          </p>
        </div>
        
        <div className="flex items-center gap-4">
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

      {/* 네트워크 선택 */}
      <div className="flex flex-wrap gap-2">
        {networks.map((network) => {
          const NetworkIcon = network.icon;
          return (
            <motion.button
              key={network.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedNetwork(network.id)}
              className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center gap-3 backdrop-blur-lg border-2 ${
                selectedNetwork === network.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-600 shadow-lg'
                  : 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-gray-200 border-gray-400 shadow-md'
              }`}
            >
              <NetworkIcon className="w-5 h-5" />
              <span>{network.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* 블록체인 네트워크 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((blockchain, index) => {
          const freshness = getDataFreshness(blockchain.lastUpdated);
          const BlockchainIcon = blockchain.icon;
          
          return (
            <motion.div
              key={blockchain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg hover:from-gray-50 hover:to-gray-200 transition-all"
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${blockchain.color}20` }}
                  >
                    <BlockchainIcon className="w-6 h-6" style={{ color: blockchain.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{blockchain.network}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 font-medium">{blockchain.symbol}</span>
                      {getReliabilityIcon(blockchain.reliability)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-bold ${freshness.color}`}>
                    {freshness.text}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {freshness.timeText}
                  </div>
                </div>
              </div>

              {/* 주요 지표 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">가격</span>
                  <span className="text-gray-900 font-black text-xl">
                    ${blockchain.price.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">시가총액</span>
                  <span className="text-gray-900 font-black">
                    ${formatNumber(blockchain.marketCap)}T
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">24시간 변화</span>
                  <div className="flex items-center gap-2">
                    {blockchain.change24h >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-700" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-700" />
                    )}
                    <span className={`font-black ${
                      blockchain.change24h >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {blockchain.change24h >= 0 ? '+' : ''}{blockchain.change24h}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">거래량</span>
                  <span className="text-gray-900 font-black">
                    ${formatNumber(blockchain.volume24h)}B
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">일일 거래</span>
                  <span className="text-gray-900 font-black">
                    {formatNumber(blockchain.transactions)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">활성 주소</span>
                  <span className="text-gray-900 font-black">
                    {formatNumber(blockchain.activeAddresses)}
                  </span>
                </div>
                
                {blockchain.hashRate > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">해시레이트</span>
                    <span className="text-gray-900 font-black">
                      {formatNumber(blockchain.hashRate)} EH/s
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">블록 시간</span>
                  <span className="text-gray-900 font-black">
                    {blockchain.blockTime}초
                  </span>
                </div>
              </div>

              {/* 데이터 소스 정보 */}
              <div className="mt-4 pt-4 border-t-2 border-gray-300">
                <div className="flex items-center justify-between text-xs text-gray-700 font-medium">
                  <span>데이터 소스: {blockchain.dataSource}</span>
                  <span>{new Date(blockchain.lastUpdated).toLocaleString('ko-KR')}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 거래 흐름 분석 */}
      <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-700" />
          실시간 거래 흐름 분석
        </h3>
        
        <div className="space-y-4">
          {transactionFlows.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-4 border border-gray-200 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tx.color }} />
                  <div>
                    <div className="text-sm text-gray-700 font-medium">
                      {tx.from.slice(0, 8)}...{tx.from.slice(-8)}
                    </div>
                    <div className="text-xs text-gray-500">
                      → {tx.to.slice(0, 8)}...{tx.to.slice(-8)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-gray-900 font-bold">
                    {tx.amount} BTC
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(tx.type)}`}>
                      {tx.type === 'normal' ? '일반' :
                       tx.type === 'suspicious' ? '의심' :
                       tx.type === 'mixing' ? '믹싱' : '토네이도'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(tx.risk)}`}>
                      {tx.risk === 'low' ? '낮음' :
                       tx.risk === 'medium' ? '보통' :
                       tx.risk === 'high' ? '높음' : '위험'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 데이터 소스 정보 */}
      <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-700" />
          데이터 소스 정보 및 신뢰도
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">Blockchain.info</h4>
            <p className="text-sm text-gray-700 font-medium">비트코인 블록체인 데이터</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">높은 신뢰도</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              업데이트: 실시간
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">Etherscan</h4>
            <p className="text-sm text-gray-700 font-medium">이더리움 블록체인 데이터</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">높은 신뢰도</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              업데이트: 실시간
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">BSCScan</h4>
            <p className="text-sm text-gray-700 font-medium">BSC 블록체인 데이터</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">높은 신뢰도</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              업데이트: 실시간
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">PolygonScan</h4>
            <p className="text-sm text-gray-700 font-medium">폴리곤 블록체인 데이터</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">높은 신뢰도</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              업데이트: 실시간
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}