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
  ArrowRight,
  ArrowLeft,
  Zap,
  Eye,
  Bell,
  Shield,
  Activity,
  Brain,
  Link,
  Box,
  Palette,
  Settings
} from 'lucide-react';

// 컴포넌트 import
import ShadowEconomyTracker from '../components/ShadowEconomyTracker';
import CryptoFlowTracker from '../components/CryptoFlowTracker';
import RealTimeAlerts from '../components/RealTimeAlerts';
import MLAnomalyDetector from '../components/MLAnomalyDetector';
import BlockchainAnalyzer from '../components/BlockchainAnalyzer';
import Visualization3D from '../components/3DVisualization';
import ThemeSwitcher from '../components/ThemeSwitcher';
import PWAInstaller from '../components/PWAInstaller';
import DataFreshnessIndicator from '../components/DataFreshnessIndicator';
import APISettings from '../components/APISettings';
import APIDataDisplay from '../components/APIDataDisplay';
import APIPricingGuide from '../components/APIPricingGuide';

// 훅 import
import { useLiveData } from '../hooks/useLiveData';

// 애니메이션 기반 인포그래픽 대시보드
export default function CapitalFlowMonitor() {
  const [activeView, setActiveView] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  // 실시간 데이터 훅
  const { data: liveData, loading: dataLoading, refresh, isStale } = useLiveData();
  const [currentTheme, setCurrentTheme] = useState('dark');

  // 샘플 데이터
  const assetData = [
    {
      id: 'equity',
      name: '주식',
      value: 126.7,
      unit: 'T',
      change: -2.3,
      flow: -38.66,
      color: '#3B82F6',
      icon: BarChart3
    },
    {
      id: 'bonds',
      name: '채권',
      value: 145.1,
      unit: 'T',
      change: 1.8,
      flow: 12.4,
      color: '#10B981',
      icon: Building2
    },
    {
      id: 'real_estate',
      name: '부동산',
      value: 286.9,
      unit: 'T',
      change: 3.2,
      flow: 5.7,
      color: '#F59E0B',
      icon: Building2
    },
    {
      id: 'cash',
      name: '현금',
      value: 45.2,
      unit: 'T',
      change: -1.1,
      flow: -15.3,
      color: '#8B5CF6',
      icon: DollarSign
    },
    {
      id: 'commodities',
      name: '원자재',
      value: 12.8,
      unit: 'T',
      change: 4.5,
      flow: 2.1,
      color: '#EF4444',
      icon: Coins
    },
    {
      id: 'fdi',
      name: 'FDI',
      value: 1.5,
      unit: 'T',
      change: -0.8,
      flow: -0.3,
      color: '#06B6D4',
      icon: Globe
    }
  ];

  const viewOptions = [
    { id: 'overview', name: '개요', icon: BarChart3, color: '#3B82F6' },
    { id: 'shadow', name: '비제도권', icon: Eye, color: '#EF4444' },
    { id: 'crypto', name: '암호화폐', icon: Coins, color: '#8B5CF6' },
    { id: 'alerts', name: '실시간 알림', icon: Bell, color: '#F59E0B' },
    { id: 'ml', name: 'ML 분석', icon: Brain, color: '#8B5CF6' },
    { id: 'blockchain', name: '블록체인', icon: Link, color: '#10B981' },
    { id: '3d', name: '3D 시각화', icon: Box, color: '#06B6D4' },
    { id: 'api-settings', name: 'API 설정', icon: Settings, color: '#8B5CF6' },
    { id: 'api-pricing', name: 'API 가격 가이드', icon: DollarSign, color: '#10B981' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
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
            className="text-3xl font-bold text-white mb-2"
          >
            Global Capital Flow Monitor
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-blue-200"
          >
            자금 흐름을 실시간으로 모니터링합니다
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* 헤더 */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 border-b border-blue-800/30"
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
                duration: 3, 
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <Zap className="w-8 h-8 text-yellow-400" />
            </motion.div>
            Capital Flow Monitor
          </motion.h1>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4"
          >
            {/* 테마 스위처 */}
            <ThemeSwitcher onThemeChange={handleThemeChange} />
            
            {/* 뷰 옵션 */}
            <div className="flex gap-2">
              {viewOptions.map((view, index) => (
                <motion.button
                  key={view.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveView(view.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    activeView === view.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-800/50 text-blue-200 hover:bg-blue-700/50'
                  }`}
                >
                  <view.icon className="w-4 h-4" style={{ color: view.color }} />
                  {view.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* 데이터 신선도 표시 */}
              {liveData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6"
                >
                  <DataFreshnessIndicator
                    lastUpdated={liveData.lastUpdated}
                    dataSource="Live API"
                    className="max-w-md mx-auto"
                  />
                </motion.div>
              )}

              {/* 사용자 정의 API 데이터 표시 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <APIDataDisplay />
              </motion.div>

              {/* 자산군별 카드 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assetData.map((asset, index) => (
                  <motion.div
                    key={asset.id}
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
                          style={{ backgroundColor: `${asset.color}20` }}
                        >
                          <asset.icon className="w-6 h-6" style={{ color: asset.color }} />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-white">{asset.name}</h3>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                      >
                        {asset.change > 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                      </motion.div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                          className="text-3xl font-bold text-white"
                        >
                          ${asset.value}
                        </motion.span>
                        <span className="text-lg text-gray-300">{asset.unit}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.span
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.7 }}
                          className={`text-sm font-medium ${
                            asset.change > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {asset.change > 0 ? '+' : ''}{asset.change}%
                        </motion.span>
                        <span className="text-sm text-gray-400">YoY</span>
                      </div>

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
                            backgroundColor: asset.color,
                            width: `${Math.abs(asset.change) * 20}%`
                          }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 주간 플로우 차트 */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <ArrowRight className="w-6 h-6 text-blue-400" />
                  </motion.div>
                  주간 자금 흐름
                </h2>
                
                <div className="space-y-4">
                  {assetData.map((asset, index) => (
                    <motion.div
                      key={asset.id}
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: asset.color }}
                        />
                        <span className="text-white font-medium">{asset.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '200px' }}
                          transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                          className="h-2 bg-gray-700 rounded-full overflow-hidden"
                        >
                          <motion.div
                            initial={{ x: asset.flow > 0 ? '-100%' : '100%' }}
                            animate={{ x: 0 }}
                            transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                            className={`h-full rounded-full ${
                              asset.flow > 0 ? 'bg-green-400' : 'bg-red-400'
                            }`}
                            style={{ 
                              width: `${Math.abs(asset.flow) * 2}%`,
                              marginLeft: asset.flow > 0 ? '0' : 'auto'
                            }}
                          />
                        </motion.div>
                        
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.6 + index * 0.1 }}
                          className={`font-bold ${
                            asset.flow > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {asset.flow > 0 ? '+' : ''}${asset.flow}B
                        </motion.span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeView === 'shadow' && (
            <motion.div
              key="shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ShadowEconomyTracker />
            </motion.div>
          )}

          {activeView === 'crypto' && (
            <motion.div
              key="crypto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <CryptoFlowTracker />
            </motion.div>
          )}

          {activeView === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <RealTimeAlerts />
            </motion.div>
          )}

          {activeView === 'ml' && (
            <motion.div
              key="ml"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <MLAnomalyDetector />
            </motion.div>
          )}

          {activeView === 'blockchain' && (
            <motion.div
              key="blockchain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <BlockchainAnalyzer />
            </motion.div>
          )}

          {activeView === '3d' && (
            <motion.div
              key="3d"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Visualization3D />
            </motion.div>
          )}

          {activeView === 'api-settings' && (
            <motion.div
              key="api-settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <APISettings />
            </motion.div>
          )}

          {activeView === 'api-pricing' && (
            <motion.div
              key="api-pricing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <APIPricingGuide />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* PWA 설치기 */}
      <PWAInstaller />
    </div>
  );
}