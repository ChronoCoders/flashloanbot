import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, BarChart3, Activity } from 'lucide-react';

interface ChartData {
  timestamp: number;
  price: number;
}

interface TokenData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d: {
    price: number[];
  };
}

interface RealTimeChartProps {
  tokenId: string;
  symbol: string;
  name: string;
  height?: number;
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({ 
  tokenId, 
  symbol, 
  name, 
  height = 200 
}) => {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d'>('24h');

  const fetchTokenData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current price and market data
      const marketResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${tokenId}&order=market_cap_desc&per_page=1&page=1&sparkline=true&price_change_percentage=24h`
      );

      if (!marketResponse.ok) {
        throw new Error('Failed to fetch market data');
      }

      const marketData = await marketResponse.json();
      if (marketData && marketData.length > 0) {
        setTokenData(marketData[0]);
        
        // Convert sparkline data to chart format
        const sparklineData = marketData[0].sparkline_in_7d.price;
        const now = Date.now();
        const interval = (7 * 24 * 60 * 60 * 1000) / sparklineData.length; // 7 days in ms divided by data points
        
        const formattedData = sparklineData.map((price: number, index: number) => ({
          timestamp: now - (sparklineData.length - index) * interval,
          price: price
        }));
        
        setChartData(formattedData);
      }

      // Fetch detailed price history based on timeframe
      let days = '1';
      if (timeframe === '7d') days = '7';
      else if (timeframe === '24h') days = '1';
      else if (timeframe === '1h') days = '1';

      const historyResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=${days}&interval=${timeframe === '1h' ? 'minutely' : 'hourly'}`
      );

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        if (historyData.prices) {
          const formattedHistory = historyData.prices.map(([timestamp, price]: [number, number]) => ({
            timestamp,
            price
          }));
          setChartData(formattedHistory);
        }
      }

    } catch (err) {
      console.error('Error fetching token data:', err);
      setError('Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTokenData, 30000);
    return () => clearInterval(interval);
  }, [tokenId, timeframe]);

  const renderMiniChart = () => {
    if (!chartData.length) return null;

    const maxPrice = Math.max(...chartData.map(d => d.price));
    const minPrice = Math.min(...chartData.map(d => d.price));
    const priceRange = maxPrice - minPrice;

    const points = chartData.map((data, index) => {
      const x = (index / (chartData.length - 1)) * 100;
      const y = 100 - ((data.price - minPrice) / priceRange) * 100;
      return `${x},${y}`;
    }).join(' ');

    const isPositive = tokenData && tokenData.price_change_percentage_24h > 0;
    const strokeColor = isPositive ? '#10b981' : '#ef4444';

    return (
      <svg
        width="100%"
        height={height}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id={`gradient-${tokenId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.5"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
        <polygon
          fill={`url(#gradient-${tokenId})`}
          points={`${points} 100,100 0,100`}
        />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
        <div className="flex items-center justify-center h-48">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
        <div className="text-center text-red-400">
          <p>{error}</p>
          <button
            onClick={fetchTokenData}
            className="mt-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!tokenData) return null;

  const isPositive = tokenData.price_change_percentage_24h > 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {symbol.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-white font-medium">{name}</h3>
              <p className="text-gray-400 text-sm">{symbol.toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={fetchTokenData}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white">
              ${tokenData.current_price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6
              })}
            </p>
            <div className={`flex items-center space-x-1 ${changeColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isPositive ? '+' : ''}
                {tokenData.price_change_percentage_24h.toFixed(2)}%
              </span>
              <span className="text-xs">
                (${tokenData.price_change_24h.toFixed(2)})
              </span>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex bg-gray-700/50 rounded-lg p-1">
            {(['1h', '24h', '7d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  timeframe === tf
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: `${height}px` }}>
        {renderMiniChart()}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Market Cap</p>
            <p className="text-white font-medium">
              ${(tokenData.market_cap / 1e9).toFixed(2)}B
            </p>
          </div>
          <div>
            <p className="text-gray-400">24h Volume</p>
            <p className="text-white font-medium">
              ${(tokenData.total_volume / 1e6).toFixed(2)}M
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeChart;