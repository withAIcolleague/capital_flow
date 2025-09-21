import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';

interface ThemeSwitcherProps {
  onThemeChange?: (theme: string) => void;
}

export default function ThemeSwitcher({ onThemeChange }: ThemeSwitcherProps) {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'light', name: '라이트', icon: Sun, color: '#F59E0B' },
    { id: 'dark', name: '다크', icon: Moon, color: '#6366F1' },
    { id: 'auto', name: '자동', icon: Monitor, color: '#10B981' },
    { id: 'custom', name: '커스텀', icon: Palette, color: '#8B5CF6' }
  ];

  useEffect(() => {
    // 로컬 스토리지에서 테마 불러오기
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    // 기존 테마 클래스 제거
    root.classList.remove('light', 'dark', 'auto', 'custom');
    
    // 새 테마 클래스 추가
    root.classList.add(theme);
    
    // CSS 변수 설정
    switch (theme) {
      case 'light':
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f8fafc');
        root.style.setProperty('--text-primary', '#1e293b');
        root.style.setProperty('--text-secondary', '#64748b');
        root.style.setProperty('--accent-primary', '#3b82f6');
        root.style.setProperty('--accent-secondary', '#10b981');
        break;
      case 'dark':
        root.style.setProperty('--bg-primary', '#0f172a');
        root.style.setProperty('--bg-secondary', '#1e293b');
        root.style.setProperty('--text-primary', '#f1f5f9');
        root.style.setProperty('--text-secondary', '#94a3b8');
        root.style.setProperty('--accent-primary', '#3b82f6');
        root.style.setProperty('--accent-secondary', '#10b981');
        break;
      case 'auto':
        // 시스템 테마에 따라 자동 설정
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
        return;
      case 'custom':
        // 커스텀 테마 설정
        root.style.setProperty('--bg-primary', '#1a1b23');
        root.style.setProperty('--bg-secondary', '#2d2e3a');
        root.style.setProperty('--text-primary', '#e2e8f0');
        root.style.setProperty('--text-secondary', '#a0aec0');
        root.style.setProperty('--accent-primary', '#8b5cf6');
        root.style.setProperty('--accent-secondary', '#f59e0b');
        break;
    }
    
    // 로컬 스토리지에 저장
    localStorage.setItem('theme', theme);
    
    // 부모 컴포넌트에 알림
    if (onThemeChange) {
      onThemeChange(theme);
    }
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    setIsOpen(false);
  };

  const currentThemeData = themes.find(theme => theme.id === currentTheme) || themes[1];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <currentThemeData.icon 
            className="w-4 h-4" 
            style={{ color: currentThemeData.color }} 
          />
        </motion.div>
        {currentThemeData.name}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {themes.map((theme, index) => (
              <motion.button
                key={theme.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                onClick={() => handleThemeChange(theme.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  currentTheme === theme.id 
                    ? 'bg-white/20 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <theme.icon 
                  className="w-4 h-4" 
                  style={{ color: theme.color }} 
                />
                <span className="font-medium">{theme.name}</span>
                {currentTheme === theme.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-2 h-2 rounded-full"
                    style={{ backgroundColor: theme.color }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
