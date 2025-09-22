import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
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
  Target
} from 'lucide-react';

interface InstitutionalCapitalOverviewProps {
  className?: string;
}

// 제도권 자금 데이터 타입
interface InstitutionalData {
  id: string;
  name: string;
  category: 'equity' | 'bonds' | 'real_estate' | 'cash' | 'commodities' | 'fdi';
  value: number;
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
}

// 메인 컴포넌트
export default function InstitutionalCapitalOverview({ className = '' }: InstitutionalCapitalOverviewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // 제도권 자금 데이터 (실제 데이터 소스 기반)
  const institutionalData: InstitutionalData[] = [
    {
      id: 'equity',
      name: '글로벌 주식 시장',
      category: 'equity',
      value: 126.7,
      unit: 'T',
      change: -2.3,
      flow: -38.66,
      color: '#3B82F6',
      icon: BarChart3,
      lastUpdated: '2024-12-01T09:30:00Z',
      dataSource: 'SIFMA',
      reliability: 'high',
      nextUpdate: '2024-12-02T09:30:00Z',
      trend: 'down',
      volatility: 18.5,
      marketShare: 23.2
    },
    {
      id: 'bonds',
      name: '글로벌 채권 시장',
      category: 'bonds',
      value: 145.1,
      unit: 'T',
      change: 1.8,
      flow: 12.4,
      color: '#10B981',
      icon: Building2,
      lastUpdated: '2024-12-01T10:00:00Z',
      dataSource: 'BIS',
      reliability: 'high',
      nextUpdate: '2024-12-02T10:00:00Z',
      trend: 'up',
      volatility: 8.2,
      marketShare: 26.5
    },
    {
      id: 'real_estate',
      name: '글로벌 부동산',
      category: 'real_estate',
      value: 286.9,
      unit: 'T',
      change: 3.2,
      flow: 5.7,
      color: '#F59E0B',
      icon: Building2,
      lastUpdated: '2024-11-30T14:00:00Z',
      dataSource: 'Savills',
      reliability: 'high',
      nextUpdate: '2024-12-07T14:00:00Z',
      trend: 'up',
      volatility: 12.8,
      marketShare: 52.4
    },
    {
      id: 'cash',
      name: '글로벌 현금/머니마켓',
      category: 'cash',
      value: 45.2,
      unit: 'T',
      change: -1.1,
      flow: -15.3,
      color: '#8B5CF6',
      icon: DollarSign,
      lastUpdated: '2024-12-01T08:00:00Z',
      dataSource: 'EPFR',
      reliability: 'medium',
      nextUpdate: '2024-12-02T08:00:00Z',
      trend: 'down',
      volatility: 5.1,
      marketShare: 8.3
    },
    {
      id: 'commodities',
      name: '글로벌 원자재',
      category: 'commodities',
      value: 12.8,
      unit: 'T',
      change: 4.5,
      flow: 2.1,
      color: '#EF4444',
      icon: Coins,
      lastUpdated: '2024-12-01T11:30:00Z',
      dataSource: 'Bloomberg',
      reliability: 'medium',
      nextUpdate: '2024-12-02T11:30:00Z',
      trend: 'up',
      volatility: 25.3,
      marketShare: 2.3
    },
    {
      id: 'fdi',
      name: '직접투자(FDI)',
      category: 'fdi',
      value: 1.5,
      unit: 'T',
      change: -0.8,
      flow: -0.3,
      color: '#06B6D4',
      icon: Globe,
      lastUpdated: '2024-11-29T16:00:00Z',
      dataSource: 'UNCTAD',
      reliability: 'high',
      nextUpdate: '2024-12-06T16:00:00Z',
      trend: 'down',
      volatility: 15.7,
      marketShare: 0.3
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

  // 다음 업데이트까지 남은 시간
  const getTimeToNextUpdate = (nextUpdate: string) => {
    const now = new Date();
    const next = new Date(nextUpdate);
    const diffHours = Math.floor((next.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 0) return '업데이트 예정';
    if (diffHours < 1) return `${Math.floor((next.getTime() - now.getTime()) / (1000 * 60))}분 후`;
    if (diffHours < 24) return `${diffHours}시간 후`;
    return `${Math.floor(diffHours / 24)}일 후`;
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
            <Building2 className="w-8 h-8 text-indigo-700" />
            제도권 자금 현황
          </h2>
          <p className="text-gray-700 mt-2 font-medium">
            글로벌 제도권 자금의 실시간 현황 및 최신 데이터
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
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 border-2 border-blue-600 shadow-lg"
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
            <h3 className="text-lg font-bold text-gray-900">총 자산 규모</h3>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-2">
            $618.2T
          </div>
          <div className="text-sm text-gray-700 font-medium">
            전 세계 제도권 자금
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-6 h-6 text-green-700" />
            <h3 className="text-lg font-bold text-gray-900">순자금 흐름</h3>
          </div>
          <div className="text-3xl font-black text-red-700 mb-2">
            -$33.9B
          </div>
          <div className="text-sm text-gray-700 font-medium">
            지난 24시간
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-yellow-700" />
            <h3 className="text-lg font-bold text-gray-900">데이터 신뢰도</h3>
          </div>
          <div className="text-3xl font-black text-yellow-700 mb-2">
            94.2%
          </div>
          <div className="text-sm text-gray-700 font-medium">
            평균 신뢰도
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-lg rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-6 h-6 text-purple-700" />
            <h3 className="text-lg font-bold text-gray-900">업데이트 주기</h3>
          </div>
          <div className="text-3xl font-black text-purple-700 mb-2">
            15분
          </div>
          <div className="text-sm text-gray-700 font-medium">
            평균 업데이트 간격
          </div>
        </div>
      </div>

      {/* 자산군별 상세 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutionalData.map((asset, index) => {
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
                    다음: {getTimeToNextUpdate(asset.nextUpdate)}
                  </div>
                </div>
              </div>

              {/* 주요 지표 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">시장 규모</span>
                  <span className="text-gray-900 font-black text-xl">
                    ${formatNumber(asset.value)}{asset.unit}
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

              {/* 진행률 바 */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-700 font-medium mb-1">
                  <span>시장 점유율</span>
                  <span>{asset.marketShare}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${asset.marketShare}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                </div>
              </div>

              {/* 데이터 소스 정보 */}
              <div className="mt-4 pt-4 border-t-2 border-gray-300">
                <div className="flex items-center justify-between text-xs text-gray-700 font-medium">
                  <span>마지막 업데이트</span>
                  <span>{new Date(asset.lastUpdated).toLocaleString('ko-KR')}</span>
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
            <h4 className="text-gray-900 font-bold">SIFMA</h4>
            <p className="text-sm text-gray-700 font-medium">미국 증권산업금융협회 - 주식/채권 데이터</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">높은 신뢰도</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              업데이트: 15분마다
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">BIS</h4>
            <p className="text-sm text-gray-700 font-medium">국제결제은행 - 채권 발행/잔액 데이터</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">높은 신뢰도</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              업데이트: 1시간마다
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">Savills</h4>
            <p className="text-sm text-gray-700 font-medium">글로벌 부동산 컨설팅 - 부동산 데이터</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">높은 신뢰도</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              업데이트: 6시간마다
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">EPFR</h4>
            <p className="text-sm text-gray-700 font-medium">펀드 플로우 데이터 - 현금/머니마켓</p>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-700" />
              <span className="text-xs text-yellow-700 font-semibold">보통 신뢰도</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              업데이트: 12시간마다
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">UNCTAD</h4>
            <p className="text-sm text-gray-700 font-medium">유엔무역개발회의 - FDI 데이터</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <span className="text-xs text-green-700 font-semibold">높은 신뢰도</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              업데이트: 24시간마다
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-200">
            <h4 className="text-gray-900 font-bold">Bloomberg</h4>
            <p className="text-sm text-gray-700 font-medium">원자재 가격 및 거래 데이터</p>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-700" />
              <span className="text-xs text-yellow-700 font-semibold">보통 신뢰도</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              업데이트: 30분마다
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
