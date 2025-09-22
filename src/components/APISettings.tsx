import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Key, 
  Link, 
  Save, 
  TestTube, 
  CheckCircle, 
  XCircle,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { APIConfig } from '../services/customAPIService';
import { realAPIService } from '../services/realAPIService';

export default function APISettings() {
  const [apis, setApis] = useState<APIConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingApi, setEditingApi] = useState<APIConfig | null>(null);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [testingAPIs, setTestingAPIs] = useState<string[]>([]);

  // 새 API 폼 상태
  const [newApi, setNewApi] = useState<Partial<APIConfig>>({
    name: '',
    baseUrl: '',
    apiKey: '',
    description: '',
    category: 'financial',
    isActive: true
  });

  // 사용자 제공 API 키들
  const apiTemplates = [
    {
      name: 'Alpha Vantage',
      baseUrl: 'https://www.alphavantage.co/query',
      description: '주식, 외환, 암호화폐 데이터',
      category: 'financial' as const,
      exampleKey: '6BM662UT3RN9UIBE',
      pricing: {
        free: '5 calls/min, 500 calls/day',
        note: '무료 티어 제공. API 키만 등록하면 됩니다.'
      }
    },
    {
      name: 'FRED (Federal Reserve)',
      baseUrl: 'https://api.stlouisfed.org/fred',
      description: '미국 경제 데이터',
      category: 'economic' as const,
      exampleKey: 'a80189315bd5dcab43e2a94caffb68df',
      pricing: {
        free: '120 calls/min, 무제한 일일 호출',
        note: 'FRED API는 완전 무료입니다. API 키만 등록하면 됩니다.'
      }
    },
    {
      name: 'Nasdaq Data Link',
      baseUrl: 'https://data.nasdaq.com/api/v3',
      description: '기관투자자 데이터',
      category: 'financial' as const,
      exampleKey: '5EpP4EX1dzbsurQ3xjsw',
      pricing: {
        free: '50 calls/day',
        note: '무료 티어 제공. 기관투자자 데이터에 특화.'
      }
    },
    {
      name: 'Polygon.io',
      baseUrl: 'https://api.polygon.io',
      description: '실시간 주식, 옵션, 외환 데이터',
      category: 'financial' as const,
      exampleKey: 'dlEuZrQUoiCbqxko74MJOM5TiVP7kusp',
      pricing: {
        free: '5 calls/min',
        note: '무료 티어 제공. 실시간 데이터에 특화.'
      }
    },
    {
      name: 'Finnhub',
      baseUrl: 'https://finnhub.io/api/v1',
      description: '주식, 암호화폐, 뉴스, 센티먼트 데이터',
      category: 'financial' as const,
      exampleKey: 'd38esn9r01qlbdj56370d38esn9r01qlbdj5637g',
      pricing: {
        free: '60 calls/min',
        note: '무료 티어 제공. 뉴스 및 센티먼트 데이터 포함.'
      }
    },
    {
      name: 'CoinDesk',
      baseUrl: 'https://api.coindesk.com/v1',
      description: '암호화폐 가격 데이터',
      category: 'crypto' as const,
      exampleKey: 'd64d7af7548b5f7ac4ebaf453c56dc33e9e5a150fd1b3db588bd6aa3770f325f',
      pricing: {
        free: '무제한',
        note: 'API 키 없이도 사용 가능. 비트코인 가격 데이터.'
      }
    },
    {
      name: 'Yahoo Finance',
      baseUrl: 'https://query1.finance.yahoo.com/v8/finance/chart',
      description: '실시간 주식 데이터 (비공식)',
      category: 'financial' as const,
      exampleKey: 'No API key required',
      pricing: {
        free: '무제한 (비공식 API)',
        note: 'Yahoo Finance는 공식 API를 제공하지 않으며, 비공식 API 사용 시 제한이 있을 수 있습니다.'
      }
    },
    {
      name: 'CoinGecko',
      baseUrl: 'https://api.coingecko.com/api/v3',
      description: '암호화폐 데이터',
      category: 'crypto' as const,
      exampleKey: 'No API key required',
      pricing: {
        free: '10-50 calls/min',
        note: 'API 키 없이도 사용 가능하지만 제한이 있습니다.'
      }
    }
  ];

  useEffect(() => {
    loadAPIs();
  }, []);

  const loadAPIs = () => {
    try {
      const savedAPIs = localStorage.getItem('custom-apis');
      if (savedAPIs) {
        setApis(JSON.parse(savedAPIs));
      }
    } catch (error) {
      console.error('Error loading APIs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAPIs = (updatedAPIs: APIConfig[]) => {
    try {
      localStorage.setItem('custom-apis', JSON.stringify(updatedAPIs));
      setApis(updatedAPIs);
    } catch (error) {
      console.error('Error saving APIs:', error);
    }
  };

  const addAPI = () => {
    if (!newApi.name || !newApi.baseUrl) return;

    const api: APIConfig = {
      id: Date.now().toString(),
      name: newApi.name!,
      baseUrl: newApi.baseUrl!,
      apiKey: newApi.apiKey || '',
      description: newApi.description || '',
      category: newApi.category!,
      isActive: newApi.isActive!,
      status: 'unknown'
    };

    const updatedAPIs = [...apis, api];
    saveAPIs(updatedAPIs);
    setNewApi({
      name: '',
      baseUrl: '',
      apiKey: '',
      description: '',
      category: 'financial',
      isActive: true
    });
    setShowAddForm(false);
  };

  const updateAPI = (id: string, updates: Partial<APIConfig>) => {
    const updatedAPIs = apis.map(api => 
      api.id === id ? { ...api, ...updates } : api
    );
    saveAPIs(updatedAPIs);
    setEditingApi(null);
  };

  const deleteAPI = (id: string) => {
    const updatedAPIs = apis.filter(api => api.id !== id);
    saveAPIs(updatedAPIs);
  };

  const testAPI = async (api: APIConfig) => {
    try {
      setTestingAPIs(prev => [...prev, api.id]);
      
      // 실제 API 서비스를 사용한 테스트
      let testResult;
      switch (api.name) {
        case 'Alpha Vantage':
          testResult = await realAPIService.checkAPIStatus('alphaVantage');
          break;
        case 'FRED (Federal Reserve)':
          testResult = await realAPIService.checkAPIStatus('fred');
          break;
        case 'CoinGecko':
          testResult = await realAPIService.checkAPIStatus('coinGecko');
          break;
        case 'Yahoo Finance':
          testResult = await realAPIService.checkAPIStatus('yahooFinance');
          break;
        case 'Nasdaq Data Link':
          testResult = await realAPIService.checkAPIStatus('nasdaq');
          break;
        case 'Polygon.io':
          testResult = await realAPIService.checkAPIStatus('polygon');
          break;
        case 'Finnhub':
          testResult = await realAPIService.checkAPIStatus('finnhub');
          break;
        case 'CoinDesk':
          testResult = await realAPIService.checkAPIStatus('coindesk');
          break;
        default:
          // 기본 테스트
          const testUrl = `${api.baseUrl}?${api.apiKey ? `api_key=${api.apiKey}&` : ''}test=true`;
          const response = await fetch(testUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (response.ok) {
            testResult = { status: 'active', message: 'API 정상 작동' };
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
      }
      
      // 결과에 따라 상태 업데이트
      updateAPI(api.id, { 
        status: testResult.status === 'active' ? 'success' : 'error',
        lastTested: new Date().toISOString() 
      });
      
    } catch (error) {
      console.error('API 테스트 실패:', error);
      updateAPI(api.id, { 
        status: 'error', 
        lastTested: new Date().toISOString() 
      });
    } finally {
      setTestingAPIs(prev => prev.filter(id => id !== api.id));
    }
  };

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'bg-blue-500/20 text-blue-400';
      case 'crypto': return 'bg-purple-500/20 text-purple-400';
      case 'economic': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

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
            API 설정 로딩
          </motion.h1>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Settings className="w-8 h-8 text-indigo-400" />
            </motion.div>
            API 설정 관리
          </motion.h1>
          
          <motion.button
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            새 API 추가
          </motion.button>
        </div>
      </motion.header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto p-6">
        {/* API 템플릿 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-400" />
              추천 API 서비스
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apiTemplates.map((template, index) => (
                <motion.div
                  key={template.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <h3 className="text-white font-semibold mb-2">{template.name}</h3>
                  <p className="text-gray-300 text-sm mb-3">{template.description}</p>
                  
                  {/* 가격 정책 표시 */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-1">가격 정책:</div>
                    <div className="space-y-1">
                      {template.pricing.free && (
                        <div className="text-xs text-green-400">
                          🆓 무료: {template.pricing.free}
                        </div>
                      )}
                      {template.pricing.note && (
                        <div className="text-xs text-yellow-400 italic">
                          ⚠️ {template.pricing.note}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                    <button
                      onClick={() => {
                        setNewApi({
                          name: template.name,
                          baseUrl: template.baseUrl,
                          apiKey: template.exampleKey,
                          description: template.description,
                          category: template.category,
                          isActive: true
                        });
                        setShowAddForm(true);
                      }}
                      className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                    >
                      사용하기
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* API 목록 */}
        <div className="space-y-4">
          {apis.map((api, index) => (
            <motion.div
              key={api.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/20">
                    <Key className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{api.name}</h3>
                    <p className="text-sm text-gray-400">{api.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(api.status)}
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(api.category)}`}>
                    {api.category}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => testAPI(api)}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    title="API 테스트"
                  >
                    <TestTube className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingApi(api)}
                    className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    title="편집"
                  >
                    <Settings className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deleteAPI(api.id)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Base URL</label>
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4 text-gray-400" />
                    <span className="text-white font-mono text-sm">{api.baseUrl}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">API Key</label>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm">
                      {showApiKey[api.id] ? api.apiKey : '••••••••••••••••'}
                    </span>
                    <button
                      onClick={() => toggleApiKeyVisibility(api.id)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      {showApiKey[api.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {api.lastTested && (
                <div className="mt-4 text-xs text-gray-400">
                  마지막 테스트: {new Date(api.lastTested).toLocaleString()}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 새 API 추가 폼 */}
        <AnimatePresence>
          {showAddForm && (
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
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl max-w-2xl w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">새 API 추가</h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">API 이름</label>
                    <input
                      type="text"
                      value={newApi.name || ''}
                      onChange={(e) => setNewApi({ ...newApi, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
                      placeholder="예: Alpha Vantage"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Base URL</label>
                    <input
                      type="url"
                      value={newApi.baseUrl || ''}
                      onChange={(e) => setNewApi({ ...newApi, baseUrl: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
                      placeholder="https://api.example.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">API Key</label>
                    <input
                      type="password"
                      value={newApi.apiKey || ''}
                      onChange={(e) => setNewApi({ ...newApi, apiKey: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
                      placeholder="API 키를 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">설명</label>
                    <input
                      type="text"
                      value={newApi.description || ''}
                      onChange={(e) => setNewApi({ ...newApi, description: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
                      placeholder="API에 대한 간단한 설명"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">카테고리</label>
                    <select
                      value={newApi.category || 'financial'}
                      onChange={(e) => setNewApi({ ...newApi, category: e.target.value as any })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-indigo-400"
                    >
                      <option value="financial">금융</option>
                      <option value="crypto">암호화폐</option>
                      <option value="economic">경제</option>
                      <option value="other">기타</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={newApi.isActive || false}
                      onChange={(e) => setNewApi({ ...newApi, isActive: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 bg-white/10 border-white/20 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-300">
                      활성화
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    취소
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addAPI}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    저장
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
