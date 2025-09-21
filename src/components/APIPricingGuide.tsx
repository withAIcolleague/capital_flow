import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Shield, 
  Clock, 
  CheckCircle,
  XCircle,
  Info,
  ExternalLink
} from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  calls: string;
  features: string[];
  color: string;
  icon: React.ReactNode;
  recommended?: boolean;
}

interface APIPricing {
  name: string;
  description: string;
  category: string;
  website: string;
  tiers: PricingTier[];
  notes?: string;
  pros: string[];
  cons: string[];
}

const apiPricingData: APIPricing[] = [
  {
    name: 'Alpha Vantage',
    description: '주식, 외환, 암호화폐 실시간 데이터',
    category: '금융',
    website: 'https://www.alphavantage.co',
    tiers: [
      {
        name: 'Free',
        price: '무료',
        calls: '5 calls/min, 500 calls/day',
        features: ['기본 주식 데이터', '외환 데이터', '암호화폐 데이터', '기술적 지표'],
        color: 'text-green-400',
        icon: <CheckCircle className="w-5 h-5" />
      },
      {
        name: 'Premium',
        price: '$49.99/월',
        calls: '75 calls/min, 30 calls/sec',
        features: ['실시간 데이터', '고급 지표', '뉴스 센티먼트', '이메일 지원'],
        color: 'text-blue-400',
        icon: <TrendingUp className="w-5 h-5" />
      },
      {
        name: 'Enterprise',
        price: '$249.99/월',
        calls: '1200 calls/min, 75 calls/sec',
        features: ['무제한 호출', '전용 지원', '커스텀 통합', 'SLA 보장'],
        color: 'text-purple-400',
        icon: <Shield className="w-5 h-5" />,
        recommended: true
      }
    ],
    pros: ['무료 티어 제공', '다양한 데이터 소스', '기술적 지표 풍부'],
    cons: ['무료 티어 제한 많음', '응답 속도 느림', '데이터 지연']
  },
  {
    name: 'Yahoo Finance',
    description: '실시간 주식 데이터 (비공식 API)',
    category: '금융',
    website: 'https://finance.yahoo.com',
    tiers: [
      {
        name: 'Unofficial API',
        price: '무료',
        calls: '무제한 (제한 없음)',
        features: ['실시간 주식 가격', '차트 데이터', '뉴스', '재무 정보'],
        color: 'text-green-400',
        icon: <Zap className="w-5 h-5" />
      }
    ],
    notes: 'Yahoo Finance는 공식 API를 제공하지 않습니다. 비공식 API 사용 시 제한이나 차단될 수 있습니다.',
    pros: ['완전 무료', '실시간 데이터', 'API 키 불필요'],
    cons: ['비공식 API', '안정성 보장 없음', '서비스 중단 위험']
  },
  {
    name: 'CoinGecko Pro',
    description: '암호화폐 시장 데이터',
    category: '암호화폐',
    website: 'https://www.coingecko.com',
    tiers: [
      {
        name: 'Free',
        price: '무료',
        calls: '10-50 calls/min',
        features: ['기본 가격 데이터', '시장 통계', '거래소 정보'],
        color: 'text-green-400',
        icon: <CheckCircle className="w-5 h-5" />
      },
      {
        name: 'Pro',
        price: '$129/월',
        calls: '500 calls/min',
        features: ['실시간 데이터', '고급 차트', '뉴스 센티먼트', 'DeFi 데이터'],
        color: 'text-blue-400',
        icon: <TrendingUp className="w-5 h-5" />
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        calls: '10,000+ calls/min',
        features: ['무제한 호출', '전용 지원', '커스텀 통합', 'SLA 보장'],
        color: 'text-purple-400',
        icon: <Shield className="w-5 h-5" />,
        recommended: true
      }
    ],
    pros: ['무료 티어 제공', '포괄적인 암호화폐 데이터', '사용하기 쉬움'],
    cons: ['무료 티어 제한', '고가의 유료 플랜', '일부 데이터 지연']
  },
  {
    name: 'FRED (Federal Reserve)',
    description: '미국 경제 데이터',
    category: '경제',
    website: 'https://fred.stlouisfed.org',
    tiers: [
      {
        name: 'Free',
        price: '무료',
        calls: '120 calls/min, 무제한 일일 호출',
        features: ['GDP, 인플레이션', '고용 데이터', '금리 데이터', '경제 지표'],
        color: 'text-green-400',
        icon: <CheckCircle className="w-5 h-5" />,
        recommended: true
      }
    ],
    notes: 'FRED API는 완전 무료입니다. API 키만 등록하면 됩니다.',
    pros: ['완전 무료', '공식 데이터', '높은 신뢰성', '풍부한 경제 데이터'],
    cons: ['미국 데이터만', '실시간 데이터 제한', '복잡한 데이터 구조']
  },
  {
    name: 'Polygon.io',
    description: '실시간 주식, 옵션, 외환 데이터',
    category: '금융',
    website: 'https://polygon.io',
    tiers: [
      {
        name: 'Free',
        price: '무료',
        calls: '5 calls/min',
        features: ['기본 주식 데이터', '옵션 데이터', '외환 데이터'],
        color: 'text-green-400',
        icon: <CheckCircle className="w-5 h-5" />
      },
      {
        name: 'Starter',
        price: '$99/월',
        calls: '5 calls/min',
        features: ['실시간 데이터', 'WebSocket 지원', '이메일 지원'],
        color: 'text-blue-400',
        icon: <TrendingUp className="w-5 h-5" />
      },
      {
        name: 'Developer',
        price: '$199/월',
        calls: '15 calls/min',
        features: ['고급 필터링', '배치 요청', '우선 지원'],
        color: 'text-purple-400',
        icon: <Shield className="w-5 h-5" />
      },
      {
        name: 'Advanced',
        price: '$499/월',
        calls: '50 calls/min',
        features: ['무제한 호출', '전용 지원', '커스텀 통합'],
        color: 'text-yellow-400',
        icon: <Zap className="w-5 h-5" />,
        recommended: true
      }
    ],
    pros: ['실시간 데이터', 'WebSocket 지원', '높은 품질'],
    cons: ['고가', '복잡한 가격 구조', '무료 티어 제한']
  },
  {
    name: 'IEX Cloud',
    description: '주식, 암호화폐, 뉴스 데이터',
    category: '금융',
    website: 'https://iexcloud.io',
    tiers: [
      {
        name: 'Free',
        price: '무료',
        calls: '500,000 calls/월',
        features: ['주식 데이터', '암호화폐 데이터', '뉴스 데이터', '기업 정보'],
        color: 'text-green-400',
        icon: <CheckCircle className="w-5 h-5" />,
        recommended: true
      },
      {
        name: 'Paid',
        price: '$9/월',
        calls: '1M calls/월',
        features: ['더 많은 데이터', '우선 지원', '고급 필터링'],
        color: 'text-blue-400',
        icon: <TrendingUp className="w-5 h-5" />
      }
    ],
    pros: ['매우 관대한 무료 티어', '다양한 데이터', '사용하기 쉬움'],
    cons: ['제한된 실시간 데이터', '일부 데이터 지연', '지원 제한']
  }
];

export default function APIPricingGuide() {
  const [selectedAPI, setSelectedAPI] = useState<APIPricing | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredAPIs = apiPricingData.filter(api => 
    filter === 'all' || api.category === filter
  );

  const categories = ['all', '금융', '암호화폐', '경제'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <DollarSign className="w-10 h-10 text-indigo-400" />
            API 가격 가이드
          </h1>
          <p className="text-gray-300 text-lg">
            다양한 데이터 API 서비스의 가격 정책과 기능을 비교해보세요
          </p>
        </motion.div>

        {/* 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center mb-8"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {category === 'all' ? '전체' : category}
            </button>
          ))}
        </motion.div>

        {/* API 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAPIs.map((api, index) => (
            <motion.div
              key={api.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl cursor-pointer hover:bg-white/15 transition-all"
              onClick={() => setSelectedAPI(api)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{api.name}</h3>
                <span className="px-2 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-400">
                  {api.category}
                </span>
              </div>

              <p className="text-gray-300 text-sm mb-4">{api.description}</p>

              <div className="space-y-2 mb-4">
                {api.tiers.slice(0, 2).map((tier, tierIndex) => (
                  <div key={tierIndex} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{tier.name}</span>
                    <span className={`text-sm font-medium ${tier.color}`}>
                      {tier.price}
                    </span>
                  </div>
                ))}
                {api.tiers.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{api.tiers.length - 2}개 더...
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-xs text-green-400">✓ {api.pros[0]}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* 상세 모달 */}
        <AnimatePresence>
          {selectedAPI && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">{selectedAPI.name}</h2>
                  <button
                    onClick={() => setSelectedAPI(null)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 가격 티어 */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">가격 정책</h3>
                    <div className="space-y-4">
                      {selectedAPI.tiers.map((tier, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl border ${
                            tier.recommended
                              ? 'border-indigo-400 bg-indigo-500/10'
                              : 'border-white/20 bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {tier.icon}
                              <span className="font-semibold text-white">{tier.name}</span>
                              {tier.recommended && (
                                <span className="px-2 py-1 text-xs bg-indigo-600 text-white rounded-full">
                                  추천
                                </span>
                              )}
                            </div>
                            <span className={`font-bold ${tier.color}`}>
                              {tier.price}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 mb-2">{tier.calls}</div>
                          <ul className="space-y-1">
                            {tier.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="text-sm text-gray-300 flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 장단점 */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">장단점</h3>
                    
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-green-400 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        장점
                      </h4>
                      <ul className="space-y-1">
                        {selectedAPI.pros.map((pro, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                            <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-md font-medium text-red-400 mb-2 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        단점
                      </h4>
                      <ul className="space-y-1">
                        {selectedAPI.cons.map((con, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {selectedAPI.notes && (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium mb-1">
                          <Info className="w-4 h-4" />
                          주의사항
                        </div>
                        <p className="text-yellow-300 text-sm">{selectedAPI.notes}</p>
                      </div>
                    )}

                    <div className="mt-4">
                      <a
                        href={selectedAPI.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        공식 웹사이트 방문
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
