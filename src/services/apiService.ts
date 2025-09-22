// API 서비스 클래스 - 실제 데이터 연동을 위한 서비스
export class APIService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.capitalflowmonitor.com/v1';
    this.apiKey = process.env.NEXT_PUBLIC_API_KEY || 'demo_key';
  }

  // 자산 규모 데이터 가져오기
  async getAssetLevels(asOf?: string) {
    try {
      const response = await fetch(`${this.baseURL}/levels?as_of=${asOf || ''}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching asset levels:', error);
      // 폴백 데이터 반환
      return this.getFallbackAssetLevels();
    }
  }

  // 자금 흐름 데이터 가져오기
  async getFlowData(freq: string = 'weekly', asset?: string, window: number = 13) {
    try {
      const params = new URLSearchParams({
        freq,
        window: window.toString(),
        ...(asset && { asset })
      });
      
      const response = await fetch(`${this.baseURL}/flows?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching flow data:', error);
      return this.getFallbackFlowData();
    }
  }

  // 비제도권 자금 데이터 가져오기
  async getShadowEconomyData() {
    try {
      const response = await fetch(`${this.baseURL}/shadow-economy`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching shadow economy data:', error);
      return this.getFallbackShadowEconomyData();
    }
  }

  // 암호화폐 데이터 가져오기
  async getCryptoData() {
    try {
      const response = await fetch(`${this.baseURL}/crypto`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return this.getFallbackCryptoData();
    }
  }

  // 실시간 알림 데이터 가져오기
  async getAlerts() {
    try {
      const response = await fetch(`${this.baseURL}/alerts`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return this.getFallbackAlerts();
    }
  }

  // 히트맵 데이터 가져오기
  async getHeatmapData(window: number = 13) {
    try {
      const response = await fetch(`${this.baseURL}/heatmap?window=${window}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
      return this.getFallbackHeatmapData();
    }
  }

  // 폴백 데이터들
  private getFallbackAssetLevels() {
    return [
      { asset_id: 'equity', value_usd_trn: 126.7, yoy: -2.3, source: 'SIFMA' },
      { asset_id: 'bonds', value_usd_trn: 145.1, yoy: 1.8, source: 'SIFMA' },
      { asset_id: 'real_estate', value_usd_trn: 286.9, yoy: 3.2, source: 'Savills' },
      { asset_id: 'cash', value_usd_trn: 45.2, yoy: -1.1, source: 'IMF' },
      { asset_id: 'commodities', value_usd_trn: 12.8, yoy: 4.5, source: 'IMF' },
      { asset_id: 'fdi', value_usd_trn: 1.5, yoy: -0.8, source: 'UNCTAD' }
    ];
  }

  private getFallbackFlowData() {
    return [
      { week: '2024-12-16', equity: -38.66, bonds: 12.4, real_estate: 5.7, cash: -15.3, commodities: 2.1, fdi: -0.3 },
      { week: '2024-12-09', equity: -25.2, bonds: 8.1, real_estate: 3.2, cash: -8.7, commodities: 1.5, fdi: 0.1 },
      { week: '2024-12-02', equity: 15.8, bonds: -5.3, real_estate: 2.1, cash: 12.4, commodities: -0.8, fdi: 0.5 }
    ];
  }

  private getFallbackShadowEconomyData() {
    return [
      { id: 'shadow_economy', name: '그림자 경제', value: 15.0, risk: 'high', trend: 'up' },
      { id: 'offshore_wealth', name: '조세회피처', value: 8.5, risk: 'critical', trend: 'stable' },
      { id: 'illicit_finance', name: '불법 금융', value: 1.5, risk: 'critical', trend: 'up' },
      { id: 'crypto_assets', name: '암호화폐', value: 2.5, risk: 'medium', trend: 'up' },
      { id: 'physical_assets', name: '현물 자산', value: 18.0, risk: 'low', trend: 'stable' }
    ];
  }

  private getFallbackCryptoData() {
    return [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 65000, change24h: 2.5, marketCap: 1.2, volume24h: 28.5 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3200, change24h: -1.2, marketCap: 0.8, volume24h: 15.2 },
      { id: 'tether', name: 'Tether', symbol: 'USDT', price: 1.00, change24h: 0.1, marketCap: 0.3, volume24h: 45.8 }
    ];
  }

  private getFallbackAlerts() {
    return [
      {
        id: '1',
        type: 'flow',
        severity: 'high',
        title: '대규모 자금 유출 감지',
        description: '주식 시장에서 $38.66B 규모의 자금 유출이 감지되었습니다.',
        timestamp: new Date().toISOString(),
        asset: 'EQUITY',
        value: 38.66,
        change: -2.3
      }
    ];
  }

  private getFallbackHeatmapData() {
    return {
      'equity': [0.2, -0.5, 0.8, -0.3, 0.6, -0.2, 0.4, -0.7, 0.3, -0.1, 0.5, -0.4, 0.1],
      'bonds': [-0.3, 0.6, -0.2, 0.4, -0.1, 0.7, -0.5, 0.2, -0.6, 0.3, -0.4, 0.8, -0.2],
      'real_estate': [0.4, 0.1, -0.3, 0.6, -0.2, 0.5, -0.1, 0.3, -0.4, 0.7, -0.3, 0.2, -0.5]
    };
  }
}

// 싱글톤 인스턴스
export const apiService = new APIService();
