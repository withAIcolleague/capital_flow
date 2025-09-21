import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Smartphone, Monitor, X, Check } from 'lucide-react';

interface PWAInstallerProps {
  onInstall?: () => void;
}

export default function PWAInstaller({ onInstall }: PWAInstallerProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [installStep, setInstallStep] = useState(0);

  useEffect(() => {
    // PWA 설치 가능 여부 확인
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    // PWA 설치 완료 확인
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    // 이미 설치된 경우 확인
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      // 설치 프롬프트 표시
      deferredPrompt.prompt();
      
      // 사용자 선택 결과 확인
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA 설치 승인됨');
        if (onInstall) onInstall();
      } else {
        console.log('PWA 설치 거부됨');
      }
      
      setDeferredPrompt(null);
      setShowBanner(false);
    } catch (error) {
      console.error('PWA 설치 중 오류:', error);
    }
  };

  const handleManualInstall = () => {
    setInstallStep(1);
  };

  const getInstallSteps = () => [
    {
      step: 1,
      title: 'Chrome/Edge에서 설치',
      description: '주소창 오른쪽의 설치 아이콘을 클릭하세요',
      icon: Monitor,
      color: '#3B82F6'
    },
    {
      step: 2,
      title: 'Safari에서 설치',
      description: '공유 버튼을 누르고 "홈 화면에 추가"를 선택하세요',
      icon: Smartphone,
      color: '#10B981'
    },
    {
      step: 3,
      title: 'Firefox에서 설치',
      description: '주소창의 설치 아이콘을 클릭하세요',
      icon: Monitor,
      color: '#F59E0B'
    }
  ];

  if (isInstalled) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="bg-green-500/90 backdrop-blur-lg rounded-xl p-4 border border-green-400/30 shadow-2xl">
          <div className="flex items-center gap-3 text-white">
            <Check className="w-5 h-5" />
            <span className="font-medium">앱이 설치되었습니다!</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* 설치 배너 */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 left-4 right-4 z-50"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-2 rounded-lg bg-blue-500/20"
                  >
                    <Download className="w-5 h-5 text-blue-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-semibold">앱 설치</h3>
                    <p className="text-sm text-gray-300">더 나은 경험을 위해 앱을 설치하세요</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInstall}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    설치
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowBanner(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 수동 설치 가이드 */}
      <AnimatePresence>
        {installStep > 0 && (
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
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">앱 설치 방법</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setInstallStep(0)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4">
                {getInstallSteps().map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border transition-colors ${
                      installStep === step.step
                        ? 'border-blue-400/50 bg-blue-500/10'
                        : 'border-white/20 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${step.color}20` }}
                      >
                        <step.icon 
                          className="w-5 h-5" 
                          style={{ color: step.color }} 
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{step.title}</h3>
                        <p className="text-sm text-gray-300">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setInstallStep(0)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  닫기
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleInstall}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  자동 설치
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 설치 버튼 (수동 설치용) */}
      {!showBanner && !isInstalled && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleManualInstall}
          className="fixed bottom-4 right-4 z-40 p-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors shadow-2xl"
        >
          <Download className="w-5 h-5" />
        </motion.button>
      )}
    </>
  );
}
