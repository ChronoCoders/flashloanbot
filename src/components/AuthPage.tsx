import React, { useState } from 'react';
import { 
  Wallet, 
  Shield, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  FileCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';

interface AuthPageProps {
  onBack: () => void;
  onConnect: (method: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack, onConnect }) => {
  const [authMode, setAuthMode] = useState<'choice' | 'web3' | 'traditional' | 'kyc'>('choice');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const wallets = [
    {
      name: 'MetaMask',
      icon: '🦊',
      description: 'En popüler Ethereum cüzdanı',
      installed: typeof window !== 'undefined' && window.ethereum?.isMetaMask,
      downloadUrl: 'https://metamask.io/download/'
    },
    {
      name: 'Trust Wallet',
      icon: '🛡️',
      description: 'Mobil odaklı güvenli cüzdan',
      installed: typeof window !== 'undefined' && window.ethereum?.isTrust,
      downloadUrl: 'https://trustwallet.com/download'
    },
    {
      name: 'WalletConnect',
      icon: '🔗',
      description: '200+ cüzdan desteği',
      installed: true,
      downloadUrl: '#'
    },
    {
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: 'Coinbase resmi cüzdanı',
      installed: typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet,
      downloadUrl: 'https://wallet.coinbase.com/'
    }
  ];

  const handleWalletConnect = async (walletName: string) => {
    try {
      if (walletName === 'MetaMask' && window.ethereum?.isMetaMask) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        onConnect('metamask');
      } else if (walletName === 'Trust Wallet' && window.ethereum?.isTrust) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        onConnect('trust');
      } else {
        // Diğer cüzdanlar için genel bağlantı
        onConnect(walletName.toLowerCase().replace(' ', ''));
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  const handleTraditionalAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Geleneksel auth sonrası KYC'ye yönlendir
    setAuthMode('kyc');
  };

  const handleKYCRequired = () => {
    setAuthMode('kyc');
  };

  const handleKYCComplete = (kycData: any) => {
    console.log('KYC Data:', kycData);
    onConnect('kyc-completed');
  };

  if (authMode === 'choice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl w-full"
        >
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/20 overflow-hidden">
            {/* Header */}
            <div className="p-8 text-center border-b border-purple-500/20">
              <button
                onClick={onBack}
                className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              
              <div className="flex justify-center mb-4">
                <Logo size="lg" showText={false} animated={true} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Flash USDT Bot'a Hoş Geldiniz
              </h1>
              <p className="text-gray-300">
                Başlamak için giriş yönteminizi seçin
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Web3 Seçeneği */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/30 cursor-pointer"
                  onClick={handleKYCRequired}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Web3 Cüzdan ile Bağlan
                    </h3>
                    <p className="text-gray-300 mb-4">
                      KYC doğrulama sonrası Web3 cüzdanınızla güvenle bağlanın
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-green-400 text-sm">
                      <FileCheck className="w-4 h-4" />
                      <span>KYC Gerekli</span>
                    </div>
                  </div>
                </motion.div>

                {/* Geleneksel Seçenek */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/30 cursor-pointer"
                  onClick={() => setAuthMode('traditional')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      E-posta ile Kayıt Ol
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Geleneksel yöntemle hesap oluşturun ve daha sonra cüzdan bağlayın
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-blue-400 text-sm">
                      <Shield className="w-4 h-4" />
                      <span>Güvenli & Hızlı</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Güvenlik Bilgisi */}
              <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-1">KYC Zorunluluğu</h4>
                    <p className="text-yellow-300 text-sm">
                      Türkiye Cumhuriyeti 6698 sayılı KVK Kanunu ve MASAK mevzuatı gereği 
                      platform kullanımı için kimlik doğrulama (KYC) zorunludur. Bu işlem 
                      güvenliğiniz ve yasal uyumluluk için gereklidir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (authMode === 'web3') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-8">
            <div className="flex items-center mb-8">
              <button
                onClick={() => setAuthMode('choice')}
                className="text-gray-400 hover:text-white transition-colors mr-4"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">Web3 Cüzdan Bağlantısı</h2>
                <p className="text-gray-300">KYC onayı sonrası cüzdanınızı bağlayabilirsiniz</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileCheck className="w-5 h-5 text-red-400" />
                <div>
                  <h4 className="text-red-400 font-medium">KYC Doğrulama Gerekli</h4>
                  <p className="text-red-300 text-sm">
                    Cüzdan bağlantısı için önce kimlik doğrulama işlemini tamamlamanız gerekiyor.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {wallets.map((wallet, index) => (
                <motion.div
                  key={wallet.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50 opacity-60 cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{wallet.icon}</div>
                      <div>
                        <h3 className="text-white font-medium">{wallet.name}</h3>
                        <p className="text-gray-400 text-sm">{wallet.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-red-400 text-sm">
                        KYC Gerekli
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleKYCRequired}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                KYC Doğrulama İşlemini Başlat
              </button>
            </div>

            <div className="mt-8 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <h4 className="text-purple-400 font-medium mb-1">Güvenlik ve Uyumluluk</h4>
                  <p className="text-purple-300 text-sm">
                    KYC doğrulama, MASAK mevzuatı ve KVK Kanunu gereği zorunludur. 
                    Kimlik doğrulama sonrası cüzdan bağlantısı tamamen güvenlidir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (authMode === 'traditional') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-8">
            <div className="flex items-center mb-8">
              <button
                onClick={() => setAuthMode('choice')}
                className="text-gray-400 hover:text-white transition-colors mr-4"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
                </h2>
                <p className="text-gray-300">
                  {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
                </p>
              </div>
            </div>

            <form onSubmit={handleTraditionalAuth} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ad Soyad
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      placeholder="Adınızı girin"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  E-posta
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="Şifrenizi girin"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Şifre Tekrar
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      placeholder="Şifrenizi tekrar girin"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
              </button>
            </div>

            <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-blue-400 font-medium mb-1">Bilgi</h4>
                  <p className="text-blue-300 text-sm">
                    Hesap oluşturduktan sonra KYC doğrulama işlemini tamamlamanız gerekecektir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (authMode === 'kyc') {
    const KYCPage = React.lazy(() => import('./KYCPage'));
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-white">Yükleniyor...</div>
        </div>
      }>
        <KYCPage 
          onBack={() => setAuthMode('choice')} 
          onComplete={handleKYCComplete}
        />
      </React.Suspense>
    );
  }

  return null;
};

export default AuthPage;