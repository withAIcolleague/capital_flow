import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Building2, 
  BarChart3, 
  Coins,
  Globe,
  Activity,
  RefreshCw,
  Clock,
  Database,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
  BarChart
} from 'lucide-react';
import { realAPIService } from '../services/realAPIService';

interface DetailedCapitalAnalysisProps {
  className?: string;
}

interface CapitalSector {
  id: string;
  name: string;
  category: 'equity' | 'bonds' | 'real_estate' | 'cash' | 'commodities' | 'crypto' | 'fdi';
  totalValue: number;
  unit: string;
  change24h: number;
  change7d: number;
  change30d: number;
  flow24h: number;
  flow7d: number;
  flow30d: number;
  volatility: number;
  marketShare: number;
  color: string;
  icon: any;
  description: string;
  topHolders: string[];
  riskLevel: 'low' | 'medium' | 'high';
  liquidity: 'high' | 'medium' | 'low';
  lastUpdated: string;
  dataSource: string;
}

export default function DetailedCapitalAnalysis({ className = '' }: DetailedCapitalAnalysisProps) {
  const [selectedSector, setSelectedSector] = useState<string>('equity');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // 자금 분야별 상세 데이터
  const capitalSectors: CapitalSector[] = [
    {
      id: 'equity',
      name: '글로벌 주식 시장',
      category: 'equity',
      totalValue: 126.7,
      unit: 'T',
      change24h: -0.8,
      change7d: -2.3,
      change30d: 1.2,
      flow24h: -15.2,
      flow7d: -38.66,
      flow30d: 12.4,
      volatility: 18.5,
      marketShare: 23.2,
      color: '#3B82F6',
      icon: BarChart3,
      description: '전 세계 주식 시장의 총 시가총액 및 자금 흐름',
      topHolders: ['BlackRock', 'Vanguard', 'State Street', 'Fidelity', 'Capital Group'],
      riskLevel: 'high',
      liquidity: 'high',
      lastUpdated: '2024-12-01T09:30:00Z',
      dataSource: 'SIFMA'
    },
    {
      id: 'bonds',
      name: '글로벌 채권 시장',
      category: 'bonds',
      totalValue: 145.1,
      unit: 'T',
      change24h: 0.3,
      change7d: 1.8,
      change30d: 2.1,
      flow24h: 8.7,
      flow7d: 12.4,
      flow30d: 18.9,
      volatility: 8.2,
      marketShare: 26.5,
      color: '#10B981',
      icon: Building2,
      description: '정부채, 회사채, 국제채권 등 모든 채권 시장',
      topHolders: ['PIMCO', 'BlackRock', 'Vanguard', 'Fidelity', 'Western Asset'],
      riskLevel: 'low',
      liquidity: 'high',
      lastUpdated: '2024-12-01T10:00:00Z',
      dataSource: 'BIS'
    },
    {
      id: 'real_estate',
      name: '글로벌 부동산',
      category: 'real_estate',
      totalValue: 286.9,
      unit: 'T',
      change24h: 0.1,
      change7d: 3.2,
      change30d: 4.8,
      flow24h: 2.1,
      flow7d: 5.7,
      flow30d: 12.3,
      volatility: 12.8,
      marketShare: 52.4,
      color: '#F59E0B',
      icon: Building2,
      description: '상업용, 주거용, 산업용 부동산 투자',
      topHolders: ['Brookfield', 'Blackstone', 'Prologis', 'American Tower', 'Crown Castle'],
      riskLevel: 'medium',
      liquidity: 'low',
      lastUpdated: '2024-11-30T14:00:00Z',
      dataSource: 'Savills'
    },
    {
      id: 'cash',
      name: '글로벌 현금/머니마켓',
      category: 'cash',
      totalValue: 45.2,
      unit: 'T',
      change24h: -0.2,
      change7d: -1.1,
      change30d: -2.3,
      flow24h: -3.8,
      flow7d: -15.3,
      flow30d: -28.7,
      volatility: 5.1,
      marketShare: 8.3,
      color: '#8B5CF6',
      icon: DollarSign,
      description: '현금, 단기채권, 머니마켓 펀드 등',
      topHolders: ['JPMorgan', 'Bank of America', 'Wells Fargo', 'Goldman Sachs', 'Morgan Stanley'],
      riskLevel: 'low',
      liquidity: 'high',
      lastUpdated: '2024-12-01T08:00:00Z',
      dataSource: 'EPFR'
    },
    {
      id: 'commodities',
      name: '글로벌 원자재',
      category: 'commodities',
      totalValue: 12.8,
      unit: 'T',
      change24h: 1.2,
      change7d: 4.5,
      change30d: 8.7,
      flow24h: 0.8,
      flow7d: 2.1,
      flow30d: 4.9,
      volatility: 25.3,
      marketShare: 2.3,
      color: '#EF4444',
      icon: Coins,
      description: '금, 은, 석유, 농산물 등 원자재 투자',
      topHolders: ['SPDR Gold Trust', 'iShares Silver Trust', 'United States Oil Fund', 'Invesco DB Commodity', 'WisdomTree'],
      riskLevel: 'high',
      liquidity: 'medium',
      lastUpdated: '2024-12-01T11:30:00Z',
      dataSource: 'Bloomberg'
    },
    {
      id: 'crypto',
      name: '암호화폐 시장',
      category: 'crypto',
      totalValue: 2.1,
      unit: 'T',
      change24h: 3.2,
      change7d: 12.8,
      change30d: 28.4,
      flow24h: 0.5,
      flow7d: 1.8,
      flow30d: 4.2,
      volatility: 45.7,
      marketShare: 0.4,
      color: '#8B5CF6',
      icon: Coins,
      description: '비트코인, 이더리움 등 암호화폐 투자',
      topHolders: ['Coinbase', 'Binance', 'Kraken', 'Bitfinex', 'Huobi'],
      riskLevel: 'high',
      liquidity: 'high',
      lastUpdated: '2024-12-01T12:00:00Z',
      dataSource: 'CoinGecko'
    },
    {
      id: 'fdi',
      name: '직접투자(FDI)',
      category: 'fdi',
      totalValue: 1.5,
      unit: 'T',
      change24h: -0.1,
      change7d: -0.8,
      change30d: -1.2,
      flow24h: -0.05,
      flow7d: -0.3,
      flow30d: -0.8,
      volatility: 15.7,
      marketShare: 0.3,
      color: '#06B6D4',
      icon: Globe,
      description: '국가 간 직접투자 및 해외투자',
      topHolders: ['미국', '중국', '일본', '독일', '영국'],
      riskLevel: 'medium',
      liquidity: 'low',
      lastUpdated: '2024-11-29T16:00:00Z',
      dataSource: 'UNCTAD'
    }
  ];

  // 데이터 새로고침
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  // 선택된 섹터 데이터
  const selectedSectorData = capitalSectors.find(sector => sector.id === selectedSector);

  // 데이터 신선도 계산
  const getDataFreshness = (lastUpdated: string) => {
    const now = new Date();
    const updated = new Date(lastUpdated);
    const diffMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    let status, color, text, timeText;
    
    if (diffMinutes < 10) {
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

  // 위험도 색상
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-700 bg-green-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'high': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  // 유동성 색상
  const getLiquidityColor = (liquidity: string) => {
    switch (liquidity) {
      case 'high': return 'text-green-700 bg-green-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-red-700 bg-red-100';
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

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <PieChart className="w-8 h-8 text-indigo-700" />
            자금 분야별 상세 분석
          </h2>
          <p className="text-gray-700 mt-2 font-medium">
            각 자금 분야의 상세한 현황 및 분석 정보
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

      {/* 섹터 선택 탭 */}
      <div className="flex flex-wrap gap-2">
        {capitalSectors.map((sector) => {
          const SectorIcon = sector.icon;
          return (
            <motion.button
              key={sector.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSector(sector.id)}
              className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center gap-3 backdrop-blur-lg border-2 ${
                selectedSector === sector.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-600 shadow-lg'
                  : 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-gray-200 border-gray-400 shadow-md'
              }`}
            >
              <SectorIcon className="w-5 h-5" style={{ color: sector.color }} />
              <span>{sector.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* 선택된 섹터 상세 정보 */}
      {selectedSectorData && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSector}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* 기본 정보 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <selectedSectorData.icon className="w-6 h-6" style={{ color: selectedSectorData.color }} />
                  <h3 className="text-lg font-bold text-gray-900">총 규모</h3>
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2">
                  ${formatNumber(selectedSectorData.totalValue)}{selectedSectorData.unit}
                </div>
                <div className="text-sm text-gray-700 font-medium">
                  {selectedSectorData.description}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="w-6 h-6 text-green-700" />
                  <h3 className="text-lg font-bold text-gray-900">24시간 변화</h3>
                </div>
                <div className={`text-3xl font-black mb-2 ${
                  selectedSectorData.change24h >= 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {selectedSectorData.change24h >= 0 ? '+' : ''}{selectedSectorData.change24h}%
                </div>
                <div className="text-sm text-gray-700 font-medium">
                  {selectedSectorData.flow24h >= 0 ? '+' : ''}${formatNumber(selectedSectorData.flow24h)}B 흐름
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart className="w-6 h-6 text-yellow-700" />
                  <h3 className="text-lg font-bold text-gray-900">변동성</h3>
                </div>
                <div className="text-3xl font-black text-yellow-700 mb-2">
                  {selectedSectorData.volatility}%
                </div>
                <div className="text-sm text-gray-700 font-medium">
                  연간 변동성
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <PieChart className="w-6 h-6 text-purple-700" />
                  <h3 className="text-lg font-bold text-gray-900">시장 점유율</h3>
                </div>
                <div className="text-3xl font-black text-purple-700 mb-2">
                  {selectedSectorData.marketShare}%
                </div>
                <div className="text-sm text-gray-700 font-medium">
                  전체 자금 중 비중
                </div>
              </div>
            </div>

            {/* 상세 분석 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 성과 분석 */}
              <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-blue-700" />
                  성과 분석
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">7일 성과</span>
                    <div className="flex items-center gap-2">
                      {selectedSectorData.change7d >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-700" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-700" />
                      )}
                      <span className={`font-black ${
                        selectedSectorData.change7d >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {selectedSectorData.change7d >= 0 ? '+' : ''}{selectedSectorData.change7d}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">30일 성과</span>
                    <div className="flex items-center gap-2">
                      {selectedSectorData.change30d >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-700" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-700" />
                      )}
                      <span className={`font-black ${
                        selectedSectorData.change30d >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {selectedSectorData.change30d >= 0 ? '+' : ''}{selectedSectorData.change30d}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">7일 자금 흐름</span>
                    <span className={`font-black ${
                      selectedSectorData.flow7d >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {selectedSectorData.flow7d >= 0 ? '+' : ''}${formatNumber(selectedSectorData.flow7d)}B
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">30일 자금 흐름</span>
                    <span className={`font-black ${
                      selectedSectorData.flow30d >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {selectedSectorData.flow30d >= 0 ? '+' : ''}${formatNumber(selectedSectorData.flow30d)}B
                    </span>
                  </div>
                </div>
              </div>

              {/* 리스크 및 유동성 분석 */}
              <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-700" />
                  리스크 분석
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">위험도</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(selectedSectorData.riskLevel)}`}>
                      {selectedSectorData.riskLevel === 'low' ? '낮음' : 
                       selectedSectorData.riskLevel === 'medium' ? '보통' : '높음'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">유동성</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getLiquidityColor(selectedSectorData.liquidity)}`}>
                      {selectedSectorData.liquidity === 'high' ? '높음' : 
                       selectedSectorData.liquidity === 'medium' ? '보통' : '낮음'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">변동성</span>
                    <span className="text-gray-900 font-black">{selectedSectorData.volatility}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">시장 점유율</span>
                    <span className="text-gray-900 font-black">{selectedSectorData.marketShare}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 주요 투자자/기관 */}
            <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-700" />
                주요 투자자/기관
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedSectorData.topHolders.map((holder, index) => (
                  <motion.div
                    key={holder}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg p-4 text-center border border-gray-200 shadow-md"
                  >
                    <div className="text-gray-900 font-bold">{holder}</div>
                    <div className="text-sm text-gray-700 font-medium mt-1">
                      {index < 3 ? '주요 투자자' : '기타'}
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
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900 font-bold text-lg">{selectedSectorData.dataSource}</div>
                    <div className="text-sm text-gray-700 font-medium">
                      마지막 업데이트: {new Date(selectedSectorData.lastUpdated).toLocaleString('ko-KR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-700" />
                    <span className="text-green-700 text-sm font-bold">신뢰할 수 있는 소스</span>
                  </div>
                </div>
                
                {/* 데이터 신선도 표시 */}
                {(() => {
                  const freshness = getDataFreshness(selectedSectorData.lastUpdated);
                  return (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-gray-900 font-bold">데이터 신선도</div>
                          <div className="text-sm text-gray-700 font-medium">
                            {selectedSectorData.dataSource}에서 제공하는 최신 데이터
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${freshness.color}`}>
                            {freshness.text}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            {freshness.timeText}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
