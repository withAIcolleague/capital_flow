import React, { useState, useEffect, useCallback } from 'react';
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
  Circle,
  RefreshCw,
  Clock,
  Database,
  CheckCircle,
  AlertCircle
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
  lastUpdated: string;
  dataSource: string;
  reliability: 'high' | 'medium' | 'low';
}

const COIN_STATIC: Record<string, {
  category: 'major' | 'alt' | 'defi' | 'privacy';
  color: string;
  icon: any;
  riskLevel: 'low' | 'medium' | 'high';
  reliability: 'high' | 'medium' | 'low';
}> = {
  bitcoin:     { category: 'major', color: '#F7931A', icon: Bitcoin,   riskLevel: 'medium', reliability: 'high' },
  ethereum:    { category: 'major', color: '#627EEA', icon: Coins,     riskLevel: 'medium', reliability: 'high' },
  binancecoin: { category: 'major', color: '#F3BA2F', icon: Circle,    riskLevel: 'high',   reliability: 'high' },
  cardano:     { category: 'alt',   color: '#0033AD', icon: Shield,    riskLevel: 'high',   reliability: 'medium' },
  solana:      { category: 'defi',  color: '#9945FF', icon: Activity,  riskLevel: 'medium', reliability: 'high' },
};

export default function CryptoFlowTracker() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [cryptoData, setCryptoData] = useState<CryptoFlowData[]>([]);
  const [totalMarketCapGlobal, setTotalMarketCapGlobal] = useState(0);
  const [totalVolumeGlobal, setTotalVolumeGlobal] = useState(0);

  const fetchCryptoData = useCallback(async () => {
    try {
      const res = await fetch('/api/crypto-data');
      if (!res.ok) throw new Error('API error');
      const json = await res.json();
      const mapped: CryptoFlowData[] = json.coins.map((c: any) => {
        const st = COIN_STATIC[c.id] ?? { category: 'alt', color: '#888888', icon: Circle, riskLevel: 'high', reliability: 'low' };
        return {
          id: c.id,
          name: c.name,
          symbol: c.symbol,
          marketCap: c.marketCap,
          price: c.price,
          change24h: c.change24h,
          volume24h: c.volume24h,
          flow: c.change24h > 1 ? 'in' : c.change24h < -1 ? 'out' : 'neutral',
          riskLevel: st.riskLevel,
          category: st.category,
          color: st.color,
          icon: st.icon,
          lastUpdated: c.lastUpdated,
          dataSource: 'CoinGecko',
          reliability: st.reliability,
        } as CryptoFlowData;
      });
      setCryptoData(mapped);
      setTotalMarketCapGlobal(json.totalMarketCapT);
      setTotalVolumeGlobal(json.totalVolumeB);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to fetch crypto data:', err);
    }
  }, []);

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

  useEffect(() => {
    fetchCryptoData().finally(() => setIsLoading(false));
  }, [fetchCryptoData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCryptoData();
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
    
    if (diffMinutes < 15) {
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

  const getFlowIcon = (flow: string) => {
    switch (flow) {
      case 'in': return <ArrowRight className="w-4 h-4 text-green-700" />;
      case 'out': return <ArrowLeft className="w-4 h-4 text-red-700" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-700 bg-green-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'high': return 'text-red-700 bg-red-100';
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
            암호화폐 자금 흐름
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-700 font-medium"
          >
            디지털 자산을 실시간으로 추적합니다
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
            <Bitcoin className="w-8 h-8 text-orange-600" />
            암호화폐 자금 흐름
          </h2>
          <p className="text-gray-700 mt-2 font-medium">
            디지털 자산의 실시간 자금 흐름 및 시장 현황
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

      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Coins className="w-6 h-6 text-purple-700" />
            <h3 className="text-lg font-bold text-gray-900">총 시가총액</h3>
          </div>
          <div className="text-3xl font-black text-gray-900">
            {totalMarketCapGlobal > 0 ? `$${totalMarketCapGlobal.toFixed(2)}T` : '-'}
          </div>
          <div className="text-sm text-gray-700 font-medium">
            전체 암호화폐 시장
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-6 h-6 text-green-700" />
            <h3 className="text-lg font-bold text-gray-900">24시간 거래량</h3>
          </div>
          <div className="text-3xl font-black text-gray-900">
            {totalVolumeGlobal > 0 ? `$${totalVolumeGlobal.toFixed(0)}B` : '-'}
          </div>
          <div className="text-sm text-gray-700 font-medium">
            지난 24시간 거래량
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-6 h-6 text-yellow-700" />
            <h3 className="text-lg font-bold text-gray-900">추적 코인</h3>
          </div>
          <div className="text-3xl font-black text-gray-900">
            {cryptoData.length}개
          </div>
          <div className="text-sm text-gray-700 font-medium">
            CoinGecko 실시간 데이터
          </div>
        </div>
      </div>

      {/* 시간대 및 카테고리 필터 */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          {timeframes.map((timeframe) => (
            <motion.button
              key={timeframe.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTimeframe(timeframe.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all backdrop-blur-lg border-2 ${
                selectedTimeframe === timeframe.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-600 shadow-lg'
                  : 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-gray-200 border-gray-400 shadow-md'
              }`}
            >
              {timeframe.name}
            </motion.button>
          ))}
        </div>
        
        <div className="flex gap-2">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all backdrop-blur-lg border-2 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-600 shadow-lg'
                  : 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-gray-200 border-gray-400 shadow-md'
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 암호화폐 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((crypto, index) => {
          const freshness = getDataFreshness(crypto.lastUpdated);
          const CryptoIcon = crypto.icon;
          
          return (
            <motion.div
              key={crypto.id}
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
                    style={{ backgroundColor: `${crypto.color}20` }}
                  >
                    <CryptoIcon className="w-6 h-6" style={{ color: crypto.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{crypto.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 font-medium">{crypto.symbol}</span>
                      {getReliabilityIcon(crypto.reliability)}
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
                    ${crypto.price.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">시가총액</span>
                  <span className="text-gray-900 font-black">
                    ${formatNumber(crypto.marketCap)}T
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">24시간 변화</span>
                  <div className="flex items-center gap-2">
                    {crypto.change24h >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-700" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-700" />
                    )}
                    <span className={`font-black ${
                      crypto.change24h >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">거래량</span>
                  <span className="text-gray-900 font-black">
                    ${formatNumber(crypto.volume24h)}B
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">자금 흐름</span>
                  <div className="flex items-center gap-2">
                    {getFlowIcon(crypto.flow)}
                    <span className={`font-black ${
                      crypto.flow === 'in' ? 'text-green-700' : 
                      crypto.flow === 'out' ? 'text-red-700' : 'text-gray-700'
                    }`}>
                      {crypto.flow === 'in' ? '유입' : 
                       crypto.flow === 'out' ? '유출' : '중립'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 위험도 및 카테고리 */}
              <div className="flex gap-2 mt-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(crypto.riskLevel)}`}>
                  위험도: {crypto.riskLevel === 'low' ? '낮음' : crypto.riskLevel === 'medium' ? '보통' : '높음'}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {crypto.category === 'major' ? '메이저' :
                   crypto.category === 'alt' ? '알트코인' :
                   crypto.category === 'defi' ? 'DeFi' : '프라이버시'}
                </span>
              </div>

              {/* 데이터 소스 정보 */}
              <div className="mt-4 pt-4 border-t-2 border-gray-300">
                <div className="flex items-center justify-between text-xs text-gray-700 font-medium">
                  <span>데이터 소스: {crypto.dataSource}</span>
                  <span>{new Date(crypto.lastUpdated).toLocaleString('ko-KR')}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 데이터 소스 정보 */}
      <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-700" />
          데이터 소스 정보 및 신뢰도
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">CoinGecko</h4>
            <p className="text-sm text-gray-700 font-medium">암호화폐 가격 및 시장 데이터</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">높은 신뢰도</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              업데이트: 1분마다
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">CoinDesk</h4>
            <p className="text-sm text-gray-700 font-medium">비트코인 가격 및 뉴스</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">높은 신뢰도</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              업데이트: 실시간
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">Yahoo Finance</h4>
            <p className="text-sm text-gray-700 font-medium">주요 암호화폐 가격 데이터</p>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-700" />
              <span className="text-xs text-yellow-700 font-semibold">보통 신뢰도</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              업데이트: 15분마다
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}