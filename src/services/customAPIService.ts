// API 설정 타입 정의
export interface APIConfig {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  description: string;
  category: 'financial' | 'crypto' | 'economic' | 'other';
  isActive: boolean;
  lastTested?: string;
  status?: 'success' | 'error' | 'unknown';
}

// API 테스트 결과 타입
export interface APITestResult {
  success: boolean;
  status?: number;
  statusText?: string;
  error?: string;
}

// API 사용 통계 타입
export interface APIUsageStats {
  id: string;
  name: string;
  category: string;
  isActive: boolean;
  lastTested?: string;
  status?: 'success' | 'error' | 'unknown';
}

// 사용자 정의 API 서비스
export class CustomAPIService {
  private static instance: CustomAPIService;
  private apis: APIConfig[] = [];

  private constructor() {
    this.loadAPIs();
  }

  static getInstance(): CustomAPIService {
    if (!CustomAPIService.instance) {
      CustomAPIService.instance = new CustomAPIService();
    }
    return CustomAPIService.instance;
  }

  // 저장된 API 목록 로드
  loadAPIs(): void {
    try {
      if (typeof window !== 'undefined') {
        const savedAPIs = localStorage.getItem('custom-apis');
        if (savedAPIs) {
          this.apis = JSON.parse(savedAPIs);
        }
      }
    } catch (error) {
      console.error('Error loading custom APIs:', error);
      this.apis = [];
    }
  }

  // API 목록 저장
  saveAPIs(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('custom-apis', JSON.stringify(this.apis));
      }
    } catch (error) {
      console.error('Error saving custom APIs:', error);
    }
  }

  // API 데이터 가져오기
  async fetchFromAPI(apiId: string, endpoint: string, params: Record<string, any> = {}): Promise<any> {
    this.loadAPIs();
    const api = this.apis.find(a => a.id === apiId);
    
    if (!api || !api.isActive) {
      throw new Error('API not found or inactive');
    }

    try {
      const url = new URL(endpoint, api.baseUrl);
      
      // API 키가 있다면 추가
      if (api.apiKey) {
        url.searchParams.set('api_key', api.apiKey);
      }
      
      // 추가 파라미터 추가
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value.toString());
      });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching from API ${api.name}:`, error);
      throw error;
    }
  }

  // Alpha Vantage API 사용 예시
  async getAlphaVantageData(symbol: string, functionName: string = 'GLOBAL_QUOTE'): Promise<any> {
    const api = this.apis.find(a => a.name === 'Alpha Vantage');
    if (!api) {
      throw new Error('Alpha Vantage API not configured');
    }

    return this.fetchFromAPI(api.id, '', {
      function: functionName,
      symbol,
      apikey: api.apiKey
    });
  }

  // Yahoo Finance API 사용 예시
  async getYahooFinanceData(symbol: string): Promise<any> {
    const api = this.apis.find(a => a.name === 'Yahoo Finance');
    if (!api) {
      throw new Error('Yahoo Finance API not configured');
    }

    return this.fetchFromAPI(api.id, `/${symbol}`, {
      interval: '1d',
      range: '1mo'
    });
  }

  // CoinGecko Pro API 사용 예시
  async getCoinGeckoProData(coinId: string): Promise<any> {
    const api = this.apis.find(a => a.name === 'CoinGecko Pro');
    if (!api) {
      throw new Error('CoinGecko Pro API not configured');
    }

    return this.fetchFromAPI(api.id, `/coins/${coinId}`, {
      localization: 'false',
      tickers: 'false',
      market_data: 'true',
      community_data: 'false',
      developer_data: 'false',
      sparkline: 'false'
    });
  }

  // FRED API 사용 예시
  async getFREDData(seriesId: string): Promise<any> {
    const api = this.apis.find(a => a.name === 'FRED (Federal Reserve)');
    if (!api) {
      throw new Error('FRED API not configured');
    }

    return this.fetchFromAPI(api.id, `/series/observations`, {
      series_id: seriesId,
      file_type: 'json',
      api_key: api.apiKey
    });
  }

  // 모든 활성 API 목록 반환
  getActiveAPIs(): APIConfig[] {
    this.loadAPIs();
    return this.apis.filter(api => api.isActive);
  }

  // API 상태 확인
  async testAPI(apiId: string): Promise<APITestResult> {
    this.loadAPIs();
    const api = this.apis.find(a => a.id === apiId);
    
    if (!api) {
      throw new Error('API not found');
    }

    try {
      // 간단한 테스트 요청
      const testUrl = `${api.baseUrl}?${api.apiKey ? `api_key=${api.apiKey}&` : ''}test=true`;
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // API 사용 통계
  getAPIUsageStats(): APIUsageStats[] {
    this.loadAPIs();
    return this.apis.map(api => ({
      id: api.id,
      name: api.name,
      category: api.category,
      isActive: api.isActive,
      lastTested: api.lastTested,
      status: api.status
    }));
  }

  // 모든 API 목록 반환 (활성/비활성 포함)
  getAllAPIs(): APIConfig[] {
    this.loadAPIs();
    return this.apis;
  }

  // API 추가
  addAPI(api: Omit<APIConfig, 'id'>): string {
    const newAPI: APIConfig = {
      ...api,
      id: Date.now().toString()
    };
    this.apis.push(newAPI);
    this.saveAPIs();
    return newAPI.id;
  }

  // API 업데이트
  updateAPI(id: string, updates: Partial<APIConfig>): boolean {
    const index = this.apis.findIndex(api => api.id === id);
    if (index === -1) return false;
    
    this.apis[index] = { ...this.apis[index], ...updates };
    this.saveAPIs();
    return true;
  }

  // API 삭제
  deleteAPI(id: string): boolean {
    const index = this.apis.findIndex(api => api.id === id);
    if (index === -1) return false;
    
    this.apis.splice(index, 1);
    this.saveAPIs();
    return true;
  }

  // API ID로 찾기
  getAPIById(id: string): APIConfig | undefined {
    this.loadAPIs();
    return this.apis.find(api => api.id === id);
  }

  // API 이름으로 찾기
  getAPIByName(name: string): APIConfig | undefined {
    this.loadAPIs();
    return this.apis.find(api => api.name === name);
  }
}

// 싱글톤 인스턴스 내보내기
export const customAPIService = CustomAPIService.getInstance();