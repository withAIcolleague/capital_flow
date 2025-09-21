import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Globe, 
  TrendingUp, 
  TrendingDown,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move3D
} from 'lucide-react';

interface DataPoint3D {
  id: string;
  x: number;
  y: number;
  z: number;
  value: number;
  label: string;
  color: string;
  type: 'asset' | 'flow' | 'risk';
}

export default function Visualization3D() {
  const [data, setData] = useState<DataPoint3D[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'overview' | 'flow' | 'risk'>('overview');
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [zoom, setZoom] = useState(1);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 샘플 3D 데이터
  const sampleData: DataPoint3D[] = [
    // 자산 데이터
    { id: 'equity', x: 0, y: 0, z: 0, value: 126.7, label: '주식', color: '#3B82F6', type: 'asset' },
    { id: 'bonds', x: 2, y: 0, z: 0, value: 145.1, label: '채권', color: '#10B981', type: 'asset' },
    { id: 'real_estate', x: 0, y: 2, z: 0, value: 286.9, label: '부동산', color: '#F59E0B', type: 'asset' },
    { id: 'cash', x: -2, y: 0, z: 0, value: 45.2, label: '현금', color: '#8B5CF6', type: 'asset' },
    { id: 'commodities', x: 0, y: -2, z: 0, value: 12.8, label: '원자재', color: '#EF4444', type: 'asset' },
    { id: 'fdi', x: 0, y: 0, z: 2, value: 1.5, label: 'FDI', color: '#06B6D4', type: 'asset' },
    
    // 자금 흐름 데이터
    { id: 'flow1', x: 1, y: 1, z: 1, value: 38.66, label: '주식→채권', color: '#10B981', type: 'flow' },
    { id: 'flow2', x: -1, y: 1, z: 1, value: 15.3, label: '현금→부동산', color: '#F59E0B', type: 'flow' },
    { id: 'flow3', x: 1, y: -1, z: 1, value: 2.1, label: '원자재→FDI', color: '#06B6D4', type: 'flow' },
    
    // 위험 데이터
    { id: 'risk1', x: 0, y: 0, z: -2, value: 15.0, label: '그림자경제', color: '#EF4444', type: 'risk' },
    { id: 'risk2', x: 2, y: 2, z: -1, value: 8.5, label: '조세회피처', color: '#DC2626', type: 'risk' },
    { id: 'risk3', x: -2, y: -2, z: -1, value: 2.5, label: '암호화폐', color: '#8B5CF6', type: 'risk' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setData(sampleData);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAutoRotate) return;

    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x + 0.5,
        y: prev.y + 1,
        z: prev.z + 0.3
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [isAutoRotate]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    setRotation({
      x: (mouseY / centerY) * 30,
      y: (mouseX / centerX) * 30,
      z: rotation.z
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.5, Math.min(2, prev + e.deltaY * -0.001)));
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0, z: 0 });
    setZoom(1);
  };

  const filteredData = viewMode === 'overview' 
    ? data 
    : data.filter(item => item.type === viewMode);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
          >
            3D 시각화 로딩
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-indigo-200"
          >
            자금 흐름을 3차원으로 렌더링합니다
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* 헤더 */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 border-b border-indigo-800/30"
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
              <Box className="w-8 h-8 text-indigo-400" />
            </motion.div>
            3D 자금 흐름 시각화
          </motion.h1>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4"
          >
            {/* 뷰 모드 선택 */}
            <div className="flex gap-2">
              {[
                { id: 'overview', name: '전체', icon: Globe },
                { id: 'flow', name: '흐름', icon: TrendingUp },
                { id: 'risk', name: '위험', icon: TrendingDown }
              ].map((mode) => (
                <motion.button
                  key={mode.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    viewMode === mode.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-800/50 text-indigo-200 hover:bg-indigo-700/50'
                  }`}
                >
                  <mode.icon className="w-4 h-4" />
                  {mode.name}
                </motion.button>
              ))}
            </div>

            {/* 컨트롤 버튼들 */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className={`p-2 rounded-lg transition-colors ${
                  isAutoRotate
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-800/50 text-indigo-200 hover:bg-indigo-700/50'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetView}
                className="p-2 rounded-lg bg-indigo-800/50 text-indigo-200 hover:bg-indigo-700/50 transition-colors"
              >
                <Move3D className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* 3D 시각화 영역 */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="relative">
          {/* 3D 컨테이너 */}
          <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
            className="relative w-full h-[600px] bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl border border-indigo-800/30 overflow-hidden cursor-move"
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* 3D 공간 */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `
                  rotateX(${rotation.x}deg) 
                  rotateY(${rotation.y}deg) 
                  rotateZ(${rotation.z}deg) 
                  scale(${zoom})
                `,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* 3D 데이터 포인트들 */}
              {filteredData.map((point, index) => (
                <motion.div
                  key={point.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute"
                  style={{
                    transform: `translate3d(${point.x * 100}px, ${point.y * 100}px, ${point.z * 100}px)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, z: 50 }}
                    className="relative group"
                  >
                    {/* 데이터 포인트 */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          `0 0 0px ${point.color}`,
                          `0 0 20px ${point.color}`,
                          `0 0 0px ${point.color}`
                        ]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                      className="w-8 h-8 rounded-full border-2 border-white/30 shadow-2xl"
                      style={{ 
                        backgroundColor: point.color,
                        boxShadow: `0 0 20px ${point.color}50`
                      }}
                    />
                    
                    {/* 라벨 */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                    >
                      <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-medium">
                        {point.label}
                        <div className="text-xs text-gray-300">${point.value}T</div>
                      </div>
                    </motion.div>

                    {/* 연결선 (흐름 데이터인 경우) */}
                    {point.type === 'flow' && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                        className="absolute top-1/2 left-1/2 w-32 h-0.5 origin-left"
                        style={{
                          backgroundColor: point.color,
                          transform: 'translate(-50%, -50%) rotate(45deg)',
                          boxShadow: `0 0 10px ${point.color}`
                        }}
                      />
                    )}
                  </motion.div>
                </motion.div>
              ))}

              {/* 3D 그리드 */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="absolute w-full h-px bg-white/20" style={{ top: `${i * 10}%` }} />
                ))}
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="absolute w-px h-full bg-white/20" style={{ left: `${i * 10}%` }} />
                ))}
              </div>
            </motion.div>

            {/* 줌 컨트롤 */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                className="p-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                className="p-2 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </motion.button>
            </div>

            {/* 범례 */}
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <h3 className="text-white font-semibold mb-3">범례</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-white">자산</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-white">자금 흐름</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-white">위험 요소</span>
                </div>
              </div>
            </div>

            {/* 통계 정보 */}
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <h3 className="text-white font-semibold mb-3">통계</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div>총 데이터 포인트: {filteredData.length}</div>
                <div>현재 줌: {Math.round(zoom * 100)}%</div>
                <div>회전: X:{Math.round(rotation.x)}° Y:{Math.round(rotation.y)}°</div>
                <div>자동 회전: {isAutoRotate ? 'ON' : 'OFF'}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
