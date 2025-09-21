import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';

interface FlowAnimationProps {
  fromAsset: string;
  toAsset: string;
  amount: number;
  direction: 'in' | 'out';
  color: string;
}

export default function FlowAnimation({ 
  fromAsset, 
  toAsset, 
  amount, 
  direction, 
  color 
}: FlowAnimationProps) {
  return (
    <div className="relative w-full h-20 flex items-center justify-center">
      {/* 출발 자산 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute left-0 flex items-center gap-2"
      >
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: color }}
        >
          {fromAsset.charAt(0).toUpperCase()}
        </div>
        <span className="text-white font-medium">{fromAsset}</span>
      </motion.div>

      {/* 자금 흐름 애니메이션 */}
      <div className="relative w-full h-1 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ x: direction === 'out' ? '0%' : '100%' }}
          animate={{ x: direction === 'out' ? '100%' : '0%' }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut"
          }}
          className="absolute top-0 h-full rounded-full"
          style={{ 
            backgroundColor: color,
            width: '20%'
          }}
        />
        
        {/* 흐름 파티클 효과 */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: direction === 'out' ? '0%' : '100%', opacity: 0 }}
            animate={{ 
              x: direction === 'out' ? '100%' : '0%',
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"
            style={{ 
              left: `${i * 30}%`,
              boxShadow: `0 0 10px ${color}`
            }}
          />
        ))}
      </div>

      {/* 도착 자산 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute right-0 flex items-center gap-2"
      >
        <span className="text-white font-medium">{toAsset}</span>
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: color }}
        >
          {toAsset.charAt(0).toUpperCase()}
        </div>
      </motion.div>

      {/* 금액 표시 */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8"
      >
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-white text-sm font-bold">
            ${Math.abs(amount)}B
          </span>
        </div>
      </motion.div>

      {/* 방향 아이콘 */}
      <motion.div
        animate={{ 
          x: direction === 'out' ? [0, 20, 0] : [0, -20, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        {direction === 'out' ? (
          <ArrowRight className="w-6 h-6 text-white" />
        ) : (
          <ArrowLeft className="w-6 h-6 text-white" />
        )}
      </motion.div>
    </div>
  );
}

