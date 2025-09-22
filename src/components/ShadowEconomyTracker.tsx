import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  BarChart3,
  Activity,
  RefreshCw,
  Clock,
  Database,
  AlertCircle,
  CheckCircle,
  Globe,
  Shield,
  Coins,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface ShadowEconomyTrackerProps {
  className?: string;
}

// 비제도권 자금 데이터 타입
interface ShadowCapitalData {
  id: string;
  name: string;
  category: 'offshore' | 'crypto' | 'precious_metals' | 'art' | 'real_estate' | 'cash' | 'other';
  estimatedValue: number;
  unit: string;
  change: number;
  flow: number;
  color: string;
  icon: any;
  lastUpdated: string;
  dataSource: string;
  reliability: 'high' | 'medium' | 'low';
  nextUpdate: string;
  trend: 'up' | 'down' | 'stable';
  volatility: number;
  marketShare: number;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  liquidity: 'high' | 'medium' | 'low';
}

// 메인 컴포넌트
export default function ShadowEconomyTracker({ className = '' }: ShadowEconomyTrackerProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 비제도권 자금 데이터
  const shadowCapitalData: ShadowCapitalData[] = [
    {
      id: 'offshore',
      name: '오프쇼어 자금',
      category: 'offshore',
      estimatedValue: 32.1,
      unit: 'T',
      change: 2.8,
      flow: 1.2,
      color: '#6366F1',
      icon: Globe,
      lastUpdated: '2024-12-01T09:30:00Z',
      dataSource: 'Tax Justice Network',
      reliability: 'medium',
      nextUpdate: '2024-12-02T09:30:00Z',
      trend: 'up',
      volatility: 12.5,
      marketShare: 15.2,
      description: '세금 피난처 및 오프쇼어 금융센터에 숨겨진 자금',
      riskLevel: 'high',
      liquidity: 'low'
    },
    {
      id: 'crypto',
      name: '암호화폐 자금',
      category: 'crypto',
      estimatedValue: 2.1,
      unit: 'T',
      change: 8.4,
      flow: 0.3,
      color: '#8B5CF6',
      icon: Coins,
      lastUpdated: '2024-12-01T11:30:00Z',
      dataSource: 'Chainalysis',
      reliability: 'high',
      nextUpdate: '2024-12-02T11:30:00Z',
      trend: 'up',
      volatility: 45.7,
      marketShare: 1.0,
      description: '비트코인, 이더리움 등 암호화폐로 보관된 자금',
      riskLevel: 'high',
      liquidity: 'high'
    },
    {
      id: 'precious_metals',
      name: '귀금속 자금',
      category: 'precious_metals',
      estimatedValue: 8.7,
      unit: 'T',
      change: 3.2,
      flow: 0.4,
      color: '#F59E0B',
      icon: Coins,
      lastUpdated: '2024-12-01T10:00:00Z',
      dataSource: 'World Gold Council',
      reliability: 'high',
      nextUpdate: '2024-12-02T10:00:00Z',
      trend: 'up',
      volatility: 18.3,
      marketShare: 4.1,
      description: '금, 은, 백금 등 귀금속으로 보관된 자금',
      riskLevel: 'medium',
      liquidity: 'medium'
    },
    {
      id: 'art',
      name: '예술품 자금',
      category: 'art',
      estimatedValue: 1.7,
      unit: 'T',
      change: 5.1,
      flow: 0.1,
      color: '#EC4899',
      icon: Target,
      lastUpdated: '2024-11-30T14:00:00Z',
      dataSource: 'Art Basel',
      reliability: 'low',
      nextUpdate: '2024-12-07T14:00:00Z',
      trend: 'up',
      volatility: 25.8,
      marketShare: 0.8,
      description: '고가 예술품으로 투자된 자금',
      riskLevel: 'high',
      liquidity: 'low'
    },
    {
      id: 'real_estate',
      name: '부동산 자금',
      category: 'real_estate',
      estimatedValue: 45.3,
      unit: 'T',
      change: 1.8,
      flow: 2.1,
      color: '#10B981',
      icon: Shield,
      lastUpdated: '2024-12-01T08:00:00Z',
      dataSource: 'Savills',
      reliability: 'high',
      nextUpdate: '2024-12-02T08:00:00Z',
      trend: 'up',
      volatility: 15.2,
      marketShare: 21.4,
      description: '고가 부동산으로 투자된 자금',
      riskLevel: 'medium',
      liquidity: 'low'
    },
    {
      id: 'cash',
      name: '현금 자금',
      category: 'cash',
      estimatedValue: 12.4,
      unit: 'T',
      change: -1.2,
      flow: -0.8,
      color: '#6B7280',
      icon: DollarSign,
      lastUpdated: '2024-12-01T07:00:00Z',
      dataSource: 'IMF',
      reliability: 'medium',
      nextUpdate: '2024-12-02T07:00:00Z',
      trend: 'down',
      volatility: 8.7,
      marketShare: 5.9,
      description: '물리적 현금으로 보관된 자금',
      riskLevel: 'low',
      liquidity: 'high'
    },
    {
      id: 'other',
      name: '기타 자금',
      category: 'other',
      estimatedValue: 18.9,
      unit: 'T',
      change: 0.5,
      flow: 0.3,
      color: '#8B5CF6',
      icon: Activity,
      lastUpdated: '2024-11-29T16:00:00Z',
      dataSource: 'Various',
      reliability: 'low',
      nextUpdate: '2024-12-06T16:00:00Z',
      trend: 'stable',
      volatility: 22.1,
      marketShare: 8.9,
      description: '기타 비제도권 자금 (컬렉터블, 보석 등)',
      riskLevel: 'high',
      liquidity: 'low'
    }
  ];

  // 카테고리별 필터링
  const filteredData = selectedCategory === 'all' 
    ? shadowCapitalData 
    : shadowCapitalData.filter(item => item.category === selectedCategory);

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
    
    if (diffMinutes < 30) {
      status = 'fresh';
      color = 'text-green-700';
      text = '실시간';
      timeText = `${diffMinutes}분 전`;
    } else if (diffMinutes < 120) {
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

  // 전체 요약 계산
  const totalValue = shadowCapitalData.reduce((sum, item) => sum + item.estimatedValue, 0);
  const totalFlow = shadowCapitalData.reduce((sum, item) => sum + item.flow, 0);
  const avgVolatility = shadowCapitalData.reduce((sum, item) => sum + item.volatility, 0) / shadowCapitalData.length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Eye className="w-8 h-8 text-purple-700" />
            비제도권 자금 추적
          </h2>
          <p className="text-gray-700 mt-2 font-medium">
            오프쇼어, 암호화폐, 귀금속 등 비제도권 자금의 실시간 현황
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

      {/* 전체 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Database className="w-6 h-6 text-blue-700" />
            <h3 className="text-lg font-bold text-gray-900">총 추정 규모</h3>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-2">
            ${formatNumber(totalValue)}T
          </div>
          <div className="text-sm text-gray-700 font-medium">
            비제도권 자금 추정치
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-6 h-6 text-green-700" />
            <h3 className="text-lg font-bold text-gray-900">순자금 흐름</h3>
          </div>
          <div className={`text-3xl font-black mb-2 ${
            totalFlow >= 0 ? 'text-green-700' : 'text-red-700'
          }`}>
            {totalFlow >= 0 ? '+' : ''}${formatNumber(totalFlow)}B
          </div>
          <div className="text-sm text-gray-700 font-medium">
            지난 24시간
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-yellow-700" />
            <h3 className="text-lg font-bold text-gray-900">평균 변동성</h3>
          </div>
          <div className="text-3xl font-black text-yellow-700 mb-2">
            {avgVolatility.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-700 font-medium">
            전체 평균
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-6 h-6 text-purple-700" />
            <h3 className="text-lg font-bold text-gray-900">업데이트 주기</h3>
          </div>
          <div className="text-3xl font-black text-purple-700 mb-2">
            24시간
          </div>
          <div className="text-sm text-gray-700 font-medium">
            평균 업데이트 간격
          </div>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all backdrop-blur-lg border-2 ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-600 shadow-lg'
              : 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-gray-200 border-gray-400 shadow-md'
          }`}
        >
          전체
        </motion.button>
        {['offshore', 'crypto', 'precious_metals', 'art', 'real_estate', 'cash', 'other'].map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all backdrop-blur-lg border-2 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-600 shadow-lg'
                : 'bg-gradient-to-r from-white to-gray-100 text-gray-800 hover:from-gray-100 hover:to-gray-200 border-gray-400 shadow-md'
            }`}
          >
            {category === 'offshore' ? '오프쇼어' :
             category === 'crypto' ? '암호화폐' :
             category === 'precious_metals' ? '귀금속' :
             category === 'art' ? '예술품' :
             category === 'real_estate' ? '부동산' :
             category === 'cash' ? '현금' : '기타'}
          </motion.button>
        ))}
      </div>

      {/* 자금 분야별 상세 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((asset, index) => {
          const freshness = getDataFreshness(asset.lastUpdated);
          const AssetIcon = asset.icon;
          
          return (
            <motion.div
              key={asset.id}
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
                    style={{ backgroundColor: `${asset.color}20` }}
                  >
                    <AssetIcon className="w-6 h-6" style={{ color: asset.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{asset.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 font-medium">{asset.dataSource}</span>
                      {getReliabilityIcon(asset.reliability)}
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
                  <div className="text-xs text-gray-500 font-medium">
                    {new Date(asset.lastUpdated).toLocaleString('ko-KR')}
                  </div>
                </div>
              </div>

              {/* 주요 지표 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">추정 규모</span>
                  <span className="text-gray-900 font-black text-xl">
                    ${formatNumber(asset.estimatedValue)}{asset.unit}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">변화율</span>
                  <div className="flex items-center gap-2">
                    {asset.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-700" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-700" />
                    )}
                    <span className={`font-black ${
                      asset.change >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {asset.change >= 0 ? '+' : ''}{asset.change}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">자금 흐름</span>
                  <span className={`font-black ${
                    asset.flow >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {asset.flow >= 0 ? '+' : ''}${formatNumber(asset.flow)}B
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">시장 점유율</span>
                  <span className="text-gray-900 font-black">{asset.marketShare}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">변동성</span>
                  <span className="text-gray-900 font-black">{asset.volatility}%</span>
                </div>
              </div>

              {/* 위험도 및 유동성 */}
              <div className="flex gap-2 mt-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(asset.riskLevel)}`}>
                  위험도: {asset.riskLevel === 'low' ? '낮음' : asset.riskLevel === 'medium' ? '보통' : '높음'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLiquidityColor(asset.liquidity)}`}>
                  유동성: {asset.liquidity === 'high' ? '높음' : asset.liquidity === 'medium' ? '보통' : '낮음'}
                </span>
              </div>

              {/* 설명 */}
              <div className="mt-4 pt-4 border-t-2 border-gray-300">
                <p className="text-sm text-gray-700 font-medium">{asset.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 데이터 소스 정보 */}
      <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-700" />
          데이터 소스 정보
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">Tax Justice Network</h4>
            <p className="text-sm text-gray-700 font-medium">오프쇼어 자금 추적 및 분석</p>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-700" />
              <span className="text-xs text-yellow-700 font-semibold">보통 신뢰도</span>
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">Chainalysis</h4>
            <p className="text-sm text-gray-700 font-medium">암호화폐 블록체인 분석</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">높은 신뢰도</span>
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">World Gold Council</h4>
            <p className="text-sm text-gray-700 font-medium">귀금속 시장 데이터</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">높은 신뢰도</span>
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">Art Basel</h4>
            <p className="text-sm text-gray-700 font-medium">예술품 시장 분석</p>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-700" />
              <span className="text-xs text-red-700 font-semibold">낮은 신뢰도</span>
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">Savills</h4>
            <p className="text-sm text-gray-700 font-medium">고가 부동산 시장 데이터</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">높은 신뢰도</span>
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">IMF</h4>
            <p className="text-sm text-gray-700 font-medium">국제통화기금 경제 데이터</p>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-700" />
              <span className="text-xs text-yellow-700 font-semibold">보통 신뢰도</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
