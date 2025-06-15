import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Activity, Globe } from 'lucide-react';

interface MarketData {
  active_cryptocurrencies: number;
  markets: number;
  total_market_cap: {
    usd: number;
  };
  total_volume: {
    usd: number;
  };
  market_cap_percentage: {
    btc: number;
    eth: number;
  };
  market_cap_change_percentage_24h_usd: number;
}

interface TopCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
}

const MarketOverview: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [topCoins, setTopCoins] = useState<TopCoin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMarketData = async () => {
    try {
      // Fetch global market data
      const globalResponse = await fetch('https://api.coingecko.com/api/v3/global');
      const globalData = await globalResponse.json();
      
      if (globalData.data) {
        setMarketData(globalData.data);
      }

      // Fetch top cryptocurrencies
      const coinsResponse = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h'
      );
      const coinsData = await coinsResponse.json();
      
      if (coinsData) {
        setTopCoins(coinsData);
      }

    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!marketData) return null;

  const isMarketUp = marketData.market_cap_change_percentage_24h_usd > 0;

  return (
    <div className="space-y-6">
      {/* Global Market Stats */}
      <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Globe className="w-6 h-6 mr-2 text-blue-400" />
            Global Kripto Piyasa Durumu
          </h3>
          <div className={`flex items-center space-x-2 ${isMarketUp ? 'text-green-400' : 'text-red-400'}`}>
            {isMarketUp ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            <span className="font-medium">
              {isMarketUp ? '+' : ''}{marketData.market_cap_change_percentage_24h_usd.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              ${(marketData.total_market_cap.usd / 1e12).toFixed(2)}T
            </p>
            <p className="text-gray-400 text-sm">Toplam Market Cap</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              ${(marketData.total_volume.usd / 1e9).toFixed(2)}B
            </p>
            <p className="text-gray-400 text-sm">24h Volume</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {marketData.market_cap_percentage.btc.toFixed(1)}%
            </p>
            <p className="text-gray-400 text-sm">BTC Dominance</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {marketData.active_cryptocurrencies.toLocaleString()}
            </p>
            <p className="text-gray-400 text-sm">Aktif Coin</p>
          </div>
        </div>
      </div>

      {/* Top Cryptocurrencies */}
      <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-purple-400" />
          Top 10 Kripto Para
        </h3>

        <div className="space-y-3">
          {topCoins.map((coin) => {
            const isPositive = coin.price_change_percentage_24h > 0;
            const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
            
            return (
              <div key={coin.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {coin.market_cap_rank}
                  </div>
                  <div>
                    <p className="text-white font-medium">{coin.name}</p>
                    <p className="text-gray-400 text-sm">{coin.symbol.toUpperCase()}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-white font-medium">
                    ${coin.current_price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: coin.current_price < 1 ? 6 : 2
                    })}
                  </p>
                  <div className={`flex items-center justify-end space-x-1 ${changeColor}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="text-sm">
                      {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-gray-300 text-sm">
                    ${(coin.market_cap / 1e9).toFixed(2)}B
                  </p>
                  <p className="text-gray-500 text-xs">Market Cap</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;