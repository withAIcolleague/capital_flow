// 실시간 데이터 서비스 - 무료 API 활용
export class LiveDataService {
  private static instance: LiveDataService;
  
  // 무료 API 엔드포인트들
  private readonly FREE_APIS = {
    // 주식 시장 데이터
    stockMarket: 'https://api.coingecko.com/api/v3/global',
    
    // 암호화폐 데이터 (주식 대용)
    crypto: 'https://api.coingecko.com/api/v3/global',
    
    // 환율 데이터
    exchangeRate: 'https://api.exchangerate-api.com/v4/latest/USD',
    
    // 금 가격
    gold: 'https://api.metals.live/v1/spot/gold',
    
    // 경제 지표
    economic: 'https://api.stlouisfed.org/fred/series/observations'
  };

  static getInstance(): LiveDataService {
    if (!LiveDataService.instance) {
      LiveDataService.instance = new LiveDataService();
    }
    return LiveDataService.instance;
  }

  // 주식 시장 데이터 가져오기 (CoinGecko 글로벌 데이터 활용)
  async getStockMarketData() {
    try {
      const response = await fetch(this.FREE_APIS.stockMarket);
      const data = await response.json();
      
      return {
        totalMarketCap: data.data?.total_market_cap?.usd || 0,
        totalVolume: data.data?.total_volume?.usd || 0,
        marketCapChange: data.data?.market_cap_change_percentage_24h_usd || 0,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching stock market data:', error);
      return this.getFallbackData();
    }
  }

  // 암호화폐 데이터 가져오기
  async getCryptoData() {
    try {
      const response = await fetch(this.FREE_APIS.crypto);
      const data = await response.json();
      
      return {
        totalMarketCap: data.data?.total_market_cap?.usd || 0,
        totalVolume: data.data?.total_volume?.usd || 0,
        activeCryptocurrencies: data.data?.active_cryptocurrencies || 0,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return this.getFallbackCryptoData();
    }
  }

  // 환율 데이터 가져오기
  async getExchangeRates() {
    try {
      const response = await fetch(this.FREE_APIS.exchangeRate);
      const data = await response.json();
      
      return {
        rates: data.rates,
        base: data.base,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      return { rates: { USD: 1 }, base: 'USD', lastUpdated: new Date().toISOString() };
    }
  }

  // 금 가격 데이터 가져오기
  async getGoldPrice() {
    try {
      const response = await fetch(this.FREE_APIS.gold);
      const data = await response.json();
      
      return {
        price: data.price || 0,
        currency: 'USD',
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching gold price:', error);
      return { price: 2000, currency: 'USD', lastUpdated: new Date().toISOString() };
    }
  }

  // 폴백 데이터 (API 실패 시)
  private getFallbackData() {
    return {
      totalMarketCap: 126700000000000, // $126.7T
      totalVolume: 50000000000000,     // $50T
      marketCapChange: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  private getFallbackCryptoData() {
    return {
      totalMarketCap: 2500000000000,   // $2.5T
      totalVolume: 100000000000,       // $100B
      activeCryptocurrencies: 5000,
      lastUpdated: new Date().toISOString()
    };
  }

  // 모든 데이터를 한 번에 가져오기
  async getAllLiveData() {
    const [stockData, cryptoData, exchangeRates, goldData] = await Promise.all([
      this.getStockMarketData(),
      this.getCryptoData(),
      this.getExchangeRates(),
      this.getGoldPrice()
    ]);

    return {
      stock: stockData,
      crypto: cryptoData,
      exchangeRates,
      gold: goldData,
      lastUpdated: new Date().toISOString()
    };
  }
}

export const liveDataService = LiveDataService.getInstance();
