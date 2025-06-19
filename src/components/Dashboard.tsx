import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  DollarSign,
  Activity,
  Target,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Settings,
  Bell,
  LogOut,
  Copy,
  ExternalLink,
  LineChart,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from './Logo';
import RealTimeChart from './RealTimeChart';
import MarketOverview from './MarketOverview';
import FULTTradingChart from './FULTTradingChart';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

interface BotStats {
  toplamKar: number;
  toplamIslem: number;
  toplamYatirimci: number;
  toplamYatirim: number;
  botYasi: number;
}

interface YatirimciBilgi {
  yatirim: number;
  kar: number;
  sonIslem: number;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'market'>('overview');
  const [botStats, setBotStats] = useState<BotStats>({
    toplamKar: 2847.92,
    toplamIslem: 47832,
    toplamYatirimci: 3247,
    toplamYatirim: 18456.7,
    botYasi: 127 // ~4+ months of operation
  });

  const [yatirimciBilgi, setYatirimciBilgi] = useState<YatirimciBilgi>({
    yatirim: 12.5,
    kar: 3.47,
    sonIslem: Date.now() - 3600000
  });

  const [yatirimMiktari, setYatirimMiktari] = useState('');
  const [botAktif, setBotAktif] = useState(true);
  const [sonIslemler, setSonIslemler] = useState([
    { id: 1, token: 'USDT/ETH', kar: 0.247, zaman: '1 dakika önce', durum: 'başarılı' },
    { id: 2, token: 'USDC/ETH', kar: 0.189, zaman: '3 dakika önce', durum: 'başarılı' },
    { id: 3, token: 'DAI/ETH', kar: 0.156, zaman: '5 dakika önce', durum: 'başarılı' },
    { id: 4, token: 'WBTC/ETH', kar: 0.423, zaman: '7 dakika önce', durum: 'başarılı' },
    { id: 5, token: 'USDT/USDC', kar: 0.098, zaman: '9 dakika önce', durum: 'başarılı' },
  ]);

  const [takipEdilenTokenlar] = useState([
    { sembol: 'USDT', ad: 'Tether USD', likidite: '47.8M', degisim: '+2.7%' },
    { sembol: 'USDC', ad: 'USD Coin', likidite: '38.2M', degisim: '+1.9%' },
    { sembol: 'DAI', ad: 'Dai Stablecoin', likidite: '29.6M', degisim: '+1.4%' },
    { sembol: 'WBTC', ad: 'Wrapped Bitcoin', likidite: '156.3M', degisim: '+5.8%' },
    { sembol: 'WETH', ad: 'Wrapped Ether', likidite: '89.7M', degisim: '+3.2%' },
  ]);

  // CoinGecko token IDs for charts
  const chartTokens = [
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { id: 'tether', symbol: 'USDT', name: 'Tether' },
    { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin' },
    { id: 'dai', symbol: 'DAI', name: 'Dai' },
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB' }
  ];
  useEffect(() => {
    // Gerçek zamanlı veri güncellemesi simülasyonu
    const interval = setInterval(() => {
      setBotStats(prev => ({
        ...prev,
        toplamKar: prev.toplamKar + (Math.random() * 0.25 + 0.05), // 0.05-0.3 ETH increase
        toplamIslem: prev.toplamIslem + (Math.random() > 0.4 ? Math.floor(Math.random() * 4 + 1) : 0) // 1-4 new transactions
      }));
    }, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const yatirimYap = () => {
    if (yatirimMiktari && parseFloat(yatirimMiktari) > 0) {
      toast.success(`${yatirimMiktari} ETH yatırım işlemi başlatıldı!`);
      setYatirimMiktari('');
    } else {
      toast.error('Geçerli bir miktar girin!');
    }
  };

  const karCek = () => {
    if (yatirimciBilgi.kar > 0) {
      toast.success(`${yatirimciBilgi.kar.toFixed(4)} ETH kar çekme işlemi başlatıldı!`);
    } else {
      toast.error('Çekilebilir kar bulunmuyor!');
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(user.address);
    toast.success('Adres kopyalandı!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" showText={true} animated={false} />
            <div className="flex items-center space-x-4">
              {/* Kullanıcı Bilgisi */}
              <div className="bg-gray-800/50 rounded-lg px-4 py-2 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.address.slice(2, 4).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{user.balance}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-400 text-xs">{user.address}</p>
                    <button
                      onClick={copyAddress}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                botAktif ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${botAktif ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                <span className="text-sm font-medium">{botAktif ? 'Aktif' : 'Pasif'}</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Çıkış Yap"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ana İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Toplam Kar</p>
                <p className="text-2xl font-bold text-green-400">{botStats.toplamKar.toFixed(4)} ETH</p>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12.5% bu hafta
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Toplam İşlem</p>
                <p className="text-2xl font-bold text-blue-400">{botStats.toplamIslem.toLocaleString()}</p>
                <p className="text-xs text-blue-400 flex items-center mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  Son 24 saat: 47
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Toplam Yatırımcı</p>
                <p className="text-2xl font-bold text-purple-400">{botStats.toplamYatirimci}</p>
                <p className="text-xs text-purple-400 flex items-center mt-1">
            {/* FULT Token Trading Chart */}
            <FULTTradingChart />
            
                  <Users className="w-3 h-3 mr-1" />
                  +3 yeni bu hafta
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Toplam Yatırım</p>
                <p className="text-2xl font-bold text-yellow-400">{botStats.toplamYatirim.toFixed(2)} ETH</p>
                <p className="text-xs text-yellow-400 flex items-center mt-1">
                  <Wallet className="w-3 h-3 mr-1" />
                  TVL: $456,789
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>




        {/* Tab Content */}
        {renderTabContent()}

        {/* Alt Panel - Token Bilgileri */}
        <div className="mt-8">
          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Shield className="w-6 h-6 mr-3 text-purple-400" />
                Flash USDT Likidite Bot Token (FULT)
              </h3>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Toplam Arz</p>
                  <p className="text-lg font-bold text-purple-400">1,000,000,000 FULT</p>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
                <h4 className="text-white font-medium mb-2">Token Özellikleri</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• ERC-20 Standardı</li>
                  <li>• 1 Milyar Token Arzı</li>
                  <li>• Otomatik Kar Dağıtımı</li>
                  <li>• Güvenli Akıllı Kontrat</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                <h4 className="text-white font-medium mb-2">Kar Dağıtım Sistemi</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• %70 Yatırımcılara</li>
                  <li>• %20 Geliştirici Ekibi</li>
                  <li>• %10 Bot İşletme</li>
                  <li>• Otomatik Dağıtım</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/20">
                <h4 className="text-white font-medium mb-2">Güvenlik Özellikleri</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• ReentrancyGuard</li>
                  <li>• Pausable Kontrat</li>
                  <li>• Ownable Yetkilendirme</li>
                  <li>• Audit Edilmiş Kod</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;