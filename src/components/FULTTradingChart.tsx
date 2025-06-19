import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, DollarSign, Volume2, Zap, Target } from 'lucide-react';

interface PriceData {
  timestamp: number;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

const FULTTradingChart: React.FC = () => {
  const [currentPrice, setCurrentPrice] = useState(0.0847);
  const [priceChange24h, setPriceChange24h] = useState(0);
  const [volume24h, setVolume24h] = useState(2847392);
  const [marketCap, setMarketCap] = useState(84700000);
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [timeframe, setTimeframe] = useState<'1H' | '4H' | '1D' | '1W'>('1H');
  const [buyOrders, setBuyOrders] = useState<OrderBookEntry[]>([]);
  const [sellOrders, setSellOrders] = useState<OrderBookEntry[]>([]);
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize price history
  useEffect(() => {
    const generateInitialData = () => {
      const data: PriceData[] = [];
      let basePrice = 0.0820;
      const now = Date.now();
      
      for (let i = 100; i >= 0; i--) {
        const timestamp = now - (i * 60000); // 1 minute intervals
        const volatility = 0.002; // 0.2% volatility
        const change = (Math.random() - 0.5) * volatility;
        const price = basePrice * (1 + change);
        
        data.push({
          timestamp,
          price,
          volume: Math.random() * 50000 + 10000,
          high: price * (1 + Math.random() * 0.001),
          low: price * (1 - Math.random() * 0.001),
          open: basePrice,
          close: price
        });
        
        basePrice = price;
      }
      
      return data;
    };

    const initialData = generateInitialData();
    setPriceHistory(initialData);
    setCurrentPrice(initialData[initialData.length - 1].price);
    
    // Calculate 24h change
    const change = ((initialData[initialData.length - 1].price - initialData[0].price) / initialData[0].price) * 100;
    setPriceChange24h(change);
  }, []);

  // Generate order book data
  useEffect(() => {
    const generateOrderBook = () => {
      const buyOrdersData: OrderBookEntry[] = [];
      const sellOrdersData: OrderBookEntry[] = [];
      
      // Generate buy orders (below current price)
      for (let i = 0; i < 10; i++) {
        const price = currentPrice * (1 - (i + 1) * 0.001);
        const amount = Math.random() * 10000 + 1000;
        buyOrdersData.push({
          price,
          amount,
          total: price * amount
        });
      }
      
      // Generate sell orders (above current price)
      for (let i = 0; i < 10; i++) {
        const price = currentPrice * (1 + (i + 1) * 0.001);
        const amount = Math.random() * 10000 + 1000;
        sellOrdersData.push({
          price,
          amount,
          total: price * amount
        });
      }
      
      setBuyOrders(buyOrdersData);
      setSellOrders(sellOrdersData);
    };

    if (currentPrice > 0) {
      generateOrderBook();
    }
  }, [currentPrice]);

  // Generate recent trades
  useEffect(() => {
    const generateRecentTrades = () => {
      const trades = [];
      const now = Date.now();
      
      for (let i = 0; i < 20; i++) {
        const timestamp = now - (i * 30000); // 30 second intervals
        const price = currentPrice * (1 + (Math.random() - 0.5) * 0.002);
        const amount = Math.random() * 5000 + 100;
        const side = Math.random() > 0.5 ? 'buy' : 'sell';
        
        trades.push({
          timestamp,
          price,
          amount,
          side,
          total: price * amount
        });
      }
      
      setRecentTrades(trades);
    };

    if (currentPrice > 0) {
      generateRecentTrades();
    }
  }, [currentPrice]);

  // Real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceHistory(prev => {
        const lastPrice = prev[prev.length - 1]?.price || currentPrice;
        const volatility = 0.001; // 0.1% volatility
        const change = (Math.random() - 0.5) * volatility;
        const newPrice = lastPrice * (1 + change);
        
        const newData: PriceData = {
          timestamp: Date.now(),
          price: newPrice,
          volume: Math.random() * 50000 + 10000,
          high: newPrice * (1 + Math.random() * 0.0005),
          low: newPrice * (1 - Math.random() * 0.0005),
          open: lastPrice,
          close: newPrice
        };
        
        setCurrentPrice(newPrice);
        
        // Keep last 100 data points
        const updated = [...prev.slice(-99), newData];
        
        // Update 24h change
        const change24h = ((newPrice - updated[0].price) / updated[0].price) * 100;
        setPriceChange24h(change24h);
        
        // Update volume
        setVolume24h(prev => prev + newData.volume);
        setMarketCap(newPrice * 1000000000); // 1B total supply
        
        return updated;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [currentPrice]);

  // Draw chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || priceHistory.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Calculate price range
    const prices = priceHistory.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 0.5;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw price line
    ctx.strokeStyle = priceChange24h >= 0 ? '#10b981' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();

    priceHistory.forEach((data, index) => {
      const x = (index / (priceHistory.length - 1)) * width;
      const y = height - ((data.price - minPrice) / priceRange) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw area under curve
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, priceChange24h >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    
    priceHistory.forEach((data, index) => {
      const x = (index / (priceHistory.length - 1)) * width;
      const y = height - ((data.price - minPrice) / priceRange) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Draw current price line
    const currentY = height - ((currentPrice - minPrice) / priceRange) * height;
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(width, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [priceHistory, currentPrice, priceChange24h]);

  const formatPrice = (price: number) => `$${price.toFixed(6)}`;
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(2)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toFixed(0);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">FULT/USDT</h3>
              <p className="text-gray-400 text-sm">Flash USDT Liquidity Bot Token</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{formatPrice(currentPrice)}</p>
              <div className={`flex items-center space-x-1 ${priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-medium">
                  {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Volume2 className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-sm">24h Volume</span>
            </div>
            <p className="text-white font-semibold">{formatVolume(volume24h)} FULT</p>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 text-sm">Market Cap</span>
            </div>
            <p className="text-white font-semibold">${(marketCap / 1000000).toFixed(2)}M</p>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-gray-400 text-sm">Circulating</span>
            </div>
            <p className="text-white font-semibold">1.00B FULT</p>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Activity className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400 text-sm">24h High</span>
            </div>
            <p className="text-white font-semibold">{formatPrice(Math.max(...priceHistory.map(d => d.high)))}</p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center space-x-2 mt-4">
          {(['1H', '4H', '1D', '1W'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                timeframe === tf
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            className="w-full h-[300px] bg-gray-900/50 rounded-lg"
          />
          
          {/* Price Labels */}
          <div className="absolute right-2 top-2 bg-gray-800/80 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-purple-400 text-sm font-mono">{formatPrice(currentPrice)}</span>
          </div>
        </div>
      </div>

      {/* Trading Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-t border-gray-700/50">
        {/* Order Book */}
        <div>
          <h4 className="text-white font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
            Order Book
          </h4>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-400 mb-2">
              <span>Price (USDT)</span>
              <span className="text-right">Amount (FULT)</span>
              <span className="text-right">Total</span>
            </div>
            
            {/* Sell Orders */}
            <div className="space-y-1 mb-3">
              {sellOrders.slice(0, 5).map((order, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 text-xs">
                  <span className="text-red-400 font-mono">{order.price.toFixed(6)}</span>
                  <span className="text-right text-gray-300">{order.amount.toFixed(0)}</span>
                  <span className="text-right text-gray-300">{order.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            {/* Current Price */}
            <div className="border-t border-b border-gray-700 py-2 mb-3">
              <div className="text-center">
                <span className="text-purple-400 font-mono text-sm">{formatPrice(currentPrice)}</span>
                <span className="text-gray-400 text-xs ml-2">Current Price</span>
              </div>
            </div>
            
            {/* Buy Orders */}
            <div className="space-y-1">
              {buyOrders.slice(0, 5).map((order, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 text-xs">
                  <span className="text-green-400 font-mono">{order.price.toFixed(6)}</span>
                  <span className="text-right text-gray-300">{order.amount.toFixed(0)}</span>
                  <span className="text-right text-gray-300">{order.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <div>
          <h4 className="text-white font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-400" />
            Recent Trades
          </h4>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="grid grid-cols-4 gap-4 text-xs text-gray-400 mb-2">
              <span>Time</span>
              <span className="text-right">Price</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Total</span>
            </div>
            
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {recentTrades.map((trade, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 text-xs">
                  <span className="text-gray-400">{formatTime(trade.timestamp)}</span>
                  <span className={`text-right font-mono ${trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.price.toFixed(6)}
                  </span>
                  <span className="text-right text-gray-300">{trade.amount.toFixed(0)}</span>
                  <span className="text-right text-gray-300">{trade.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trading Info */}
      <div className="p-6 border-t border-gray-700/50 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-semibold mb-2">FULT Token Bilgileri</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Total Supply:</span>
                <p className="text-white font-medium">1,000,000,000 FULT</p>
              </div>
              <div>
                <span className="text-gray-400">Contract:</span>
                <p className="text-purple-400 font-mono text-xs">0x...deploy</p>
              </div>
              <div>
                <span className="text-gray-400">Decimals:</span>
                <p className="text-white font-medium">18</p>
              </div>
              <div>
                <span className="text-gray-400">Network:</span>
                <p className="text-white font-medium">Ethereum</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Live Trading</span>
            </div>
            <p className="text-gray-400 text-xs mt-1">Real-time simulation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FULTTradingChart;