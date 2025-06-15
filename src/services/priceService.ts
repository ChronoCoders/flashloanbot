class PriceService {
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 30000; // 30 seconds cache for real-time data

  private async fetchWithCache(url: string) {
    const cached = this.cache.get(url);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      this.cache.set(url, { data, timestamp: now });
      return data;
    } catch (error) {
      console.error('Price fetch error:', error);
      // Return cached data if available, even if expired
      return cached?.data || null;
    }
  }

  async getTokenPrices() {
    const url = `${this.baseUrl}/simple/price?ids=tether,usd-coin,dai,ethereum&vs_currencies=usd&include_24hr_change=true`;
    const data = await this.fetchWithCache(url);
    
    if (!data) return null;

    return {
      USDT: {
        price: data.tether?.usd || 1,
        change24h: data.tether?.usd_24h_change || 0
      },
      USDC: {
        price: data['usd-coin']?.usd || 1,
        change24h: data['usd-coin']?.usd_24h_change || 0
      },
      DAI: {
        price: data.dai?.usd || 1,
        change24h: data.dai?.usd_24h_change || 0
      },
      ETH: {
        price: data.ethereum?.usd || 0,
        change24h: data.ethereum?.usd_24h_change || 0
      }
    };
  }

  async getMarketData() {
    const url = `${this.baseUrl}/global`;
    return await this.fetchWithCache(url);
  }

  async getTokenHistory(tokenId: string, days: string = '1', interval: string = 'hourly') {
    const url = `${this.baseUrl}/coins/${tokenId}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`;
    return await this.fetchWithCache(url);
  }

  async getTopCoins(limit: number = 10) {
    const url = `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h`;
    return await this.fetchWithCache(url);
  }

  async getGlobalMarketData() {
    const url = `${this.baseUrl}/global`;
    return await this.fetchWithCache(url);
  }
}

export const priceService = new PriceService();