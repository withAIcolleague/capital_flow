import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Building2, 
  BarChart3, 
  BarChart,
  Coins,
  Globe,
  ArrowRight,
  ArrowLeft,
  Zap,
  Shield,
  Activity,
  Link,
  Palette,
  Settings,
  Eye
} from 'lucide-react';

// 컴포넌트 import
import CryptoFlowTracker from '../components/CryptoFlowTracker';
import BlockchainAnalyzer from '../components/BlockchainAnalyzer';
import ThemeSwitcher from '../components/ThemeSwitcher';
import PWAInstaller from '../components/PWAInstaller';
import DataFreshnessIndicator from '../components/DataFreshnessIndicator';
import APISettings from '../components/APISettings';
import APIDataDisplay from '../components/APIDataDisplay';
import RealTimeDataFeed from '../components/RealTimeDataFeed';
import InstitutionalCapitalOverview from '../components/InstitutionalCapitalOverview';
import APIStatusMonitor from '../components/APIStatusMonitor';
import DetailedCapitalAnalysis from '../components/DetailedCapitalAnalysis';
import ShadowEconomyTracker from '../components/ShadowEconomyTracker';

// 훅 import
import { useLiveData } from '../hooks/useLiveData';

// 애니메이션 기반 인포그래픽 대시보드
export default function CapitalFlowMonitor() {
  const [activeView, setActiveView] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  // 실시간 데이터 훅
  const { data: liveData, loading: dataLoading, refresh, isStale } = useLiveData();
  const [currentTheme, setCurrentTheme] = useState('dark');

  const viewOptions = [
    { id: 'overview', name: '제도권 자금 현황', icon: BarChart3, color: '#6366F1' },
    { id: 'detailed', name: '제도권 자금 상세 분석', icon: BarChart, color: '#10B981' },
    { id: 'shadow', name: '비제도권 자금 현황', icon: Eye, color: '#8B5CF6' }, 
    { id: 'crypto', name: '암호화폐', icon: Coins, color: '#F59E0B' },
    { id: 'blockchain', name: '블록체인', icon: Link, color: '#06B6D4' },
    { id: 'realtime', name: '실시간 피드', icon: Activity, color: '#EF4444' },
    { id: 'api-settings', name: 'API 설정', icon: Settings, color: '#6B7280' },
    { id: 'api-status', name: 'API 상태', icon: Activity, color: '#8B5CF6' }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex">
      {/* 왼쪽 사이드바 */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="w-80 bg-gradient-to-br from-gray-200 to-gray-300 backdrop-blur-lg border-r-2 border-gray-400 shadow-xl flex flex-col"
      >
        {/* 로고 및 제목 */}
        <div className="p-6 border-b-2 border-gray-400">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center gap-4 mb-6"
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
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 backdrop-blur-lg rounded-xl flex items-center justify-center border-2 border-blue-600 shadow-lg"
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">자본 흐름 모니터</h1>
              <p className="text-gray-700 text-sm font-medium">실시간 글로벌 자본 흐름 분석</p>
            </div>
          </motion.div>

          {/* 테마 스위처 */}
          <ThemeSwitcher onThemeChange={handleThemeChange} />
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {viewOptions.map((view) => (
              <motion.button
                key={view.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView(view.id)}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center gap-3 text-left backdrop-blur-lg border-2 ${
                  activeView === view.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-600 shadow-lg'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 border-gray-400 shadow-md'
                }`}
              >
                <view.icon className="w-5 h-5" style={{ color: view.color }} />
                <span>{view.name}</span>
              </motion.button>
            ))}
          </div>
        </nav>

        {/* 하단 정보 */}
        <div className="p-4 border-t-2 border-gray-400">
          <div className="text-xs text-gray-800 text-center font-medium">
            <p>실시간 데이터 업데이트</p>
            <p className="text-green-700 font-bold">● 온라인</p>
          </div>
        </div>
      </motion.aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6 overflow-auto">
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
              {/* 제도권 자금 현황 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <InstitutionalCapitalOverview />
              </motion.div>

              {/* 데이터 신선도 표시 */}
              {liveData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
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
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <APIDataDisplay />
              </motion.div>

              {/* 실시간 데이터 피드 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <RealTimeDataFeed />
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

          {activeView === 'detailed' && (
            <motion.div
              key="detailed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <DetailedCapitalAnalysis />
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

          {activeView === 'realtime' && (
            <motion.div
              key="realtime"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <RealTimeDataFeed className="max-w-6xl mx-auto" />
            </motion.div>
          )}
          {activeView === 'api-status' && (
            <motion.div
              key="api-status"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <APIStatusMonitor />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* PWA 설치기 */}
      <PWAInstaller />
    </div>
  );
}