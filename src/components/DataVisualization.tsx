import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Activity } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  color: string;
  change?: number;
}

interface DataVisualizationProps {
  data: DataPoint[];
  type: 'bar' | 'pie' | 'line' | 'area';
  title: string;
  className?: string;
}

export default function DataVisualization({ 
  data, 
  type, 
  title, 
  className = '' 
}: DataVisualizationProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  const renderBarChart = () => (
    <div className="space-y-4">
      {data.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">{item.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">${item.value}T</span>
              {item.change && (
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className={`text-sm ${
                    item.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {item.change > 0 ? '+' : ''}{item.change}%
                </motion.span>
              )}
            </div>
          </div>
          
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / maxValue) * 100}%` }}
              transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
              className="h-full rounded-full relative"
              style={{ backgroundColor: item.color }}
            >
              <motion.div
                animate={{ 
                  boxShadow: [
                    `0 0 0px ${item.color}`,
                    `0 0 20px ${item.color}`,
                    `0 0 0px ${item.color}`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderPieChart = () => {
    let cumulativePercentage = 0;
    
    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {data.map((item, index) => {
            const percentage = (item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100;
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
            
            const startAngleRad = (startAngle - 90) * (Math.PI / 180);
            const endAngleRad = (endAngle - 90) * (Math.PI / 180);
            
            const largeArcFlag = percentage > 50 ? 1 : 0;
            
            const x1 = 100 + 80 * Math.cos(startAngleRad);
            const y1 = 100 + 80 * Math.sin(startAngleRad);
            const x2 = 100 + 80 * Math.cos(endAngleRad);
            const y2 = 100 + 80 * Math.sin(endAngleRad);
            
            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            cumulativePercentage += percentage;
            
            return (
              <motion.path
                key={item.label}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: index * 0.2, duration: 1 }}
                d={pathData}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        {/* 중앙 텍스트 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              ${data.reduce((sum, d) => sum + d.value, 0).toFixed(1)}T
            </div>
            <div className="text-sm text-gray-300">총 자산</div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderLineChart = () => (
    <div className="space-y-4">
      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / maxValue) * 100}%` }}
            transition={{ delay: index * 0.1, duration: 1 }}
            className="flex-1 rounded-t-lg relative group"
            style={{ backgroundColor: item.color }}
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  `0 0 0px ${item.color}`,
                  `0 0 15px ${item.color}`,
                  `0 0 0px ${item.color}`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-t-lg"
            />
            
            {/* 툴팁 */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-sm whitespace-nowrap">
                {item.label}: ${item.value}T
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-between text-sm text-gray-400">
        {data.map((item, index) => (
          <span key={index} className="text-center">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );

  const renderAreaChart = () => (
    <div className="h-64 relative">
      <svg viewBox="0 0 400 200" className="w-full h-full">
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 400;
          const y = 200 - (item.value / maxValue) * 200;
          
          return (
            <motion.circle
              key={item.label}
              initial={{ r: 0, opacity: 0 }}
              animate={{ r: 6, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              cx={x}
              cy={y}
              fill={item.color}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
        
        {/* 영역 채우기 */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
          d={`M 0,200 ${data.map((item, index) => {
            const x = (index / (data.length - 1)) * 400;
            const y = 200 - (item.value / maxValue) * 200;
            return `L ${x},${y}`;
          }).join(' ')} L 400,200 Z`}
          fill="url(#gradient)"
          opacity="0.3"
        />
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  const getIcon = () => {
    switch (type) {
      case 'bar': return BarChart3;
      case 'pie': return PieChart;
      case 'line': return TrendingUp;
      case 'area': return Activity;
      default: return BarChart3;
    }
  };

  const Icon = getIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl ${className}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-2 rounded-lg bg-blue-500/20"
        >
          <Icon className="w-6 h-6 text-blue-400" />
        </motion.div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>

      {type === 'bar' && renderBarChart()}
      {type === 'pie' && renderPieChart()}
      {type === 'line' && renderLineChart()}
      {type === 'area' && renderAreaChart()}
    </motion.div>
  );
}

