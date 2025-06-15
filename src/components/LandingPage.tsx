import React, { useState } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Star,
  BarChart3,
  Coins,
  Globe,
  Lock,
  Rocket,
  Target,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [email, setEmail] = useState('');

  // Smooth scroll fonksiyonu
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Flash Arbitraj",
      description: "Milisaniye hızında arbitraj fırsatlarını yakala"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Otomatik Kar",
      description: "7/24 çalışan AI destekli kar üretim sistemi"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Güvenli Kontrat",
      description: "Audit edilmiş smart contract ile %100 güvenlik"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Topluluk Odaklı",
      description: "Karlar otomatik olarak yatırımcılara dağıtılır"
    }
  ];

  const stats = [
    { value: "2,847.92 ETH", label: "Toplam Kar Üretildi" },
    { value: "47,832", label: "Başarılı İşlem" },
    { value: "3,247", label: "Aktif Yatırımcı" },
    { value: "18,456.7 ETH", label: "Toplam Yatırım" }
  ];

  const testimonials = [
    {
      name: "Ahmet K.",
      role: "DeFi Yatırımcısı",
      content: "3 ayda %34 kar elde ettim. Harika bir sistem!",
      rating: 5
    },
    {
      name: "Zeynep M.",
      role: "Kripto Trader",
      content: "Otomatik kar dağıtımı çok güvenilir. Kesinlikle tavsiye ederim.",
      rating: 5
    },
    {
      name: "Mehmet S.",
      role: "Blockchain Developer",
      content: "Smart contract kodu çok temiz ve güvenli yazılmış.",
      rating: 5
    }
  ];
  // Gerçek zamanlı istatistikler için animasyon
  const [liveStats, setLiveStats] = useState(stats);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => prev.map(stat => {
        if (stat.label === "Toplam Kar Üretildi") {
          const currentValue = parseFloat(stat.value.replace(' ETH', ''));
          const newValue = currentValue + (Math.random() * 0.15 + 0.05); // 0.05-0.2 ETH increase
          return { ...stat, value: `${newValue.toFixed(4)} ETH` };
        }
        if (stat.label === "Başarılı İşlem") {
          const currentValue = parseInt(stat.value.replace(',', ''));
          const newValue = Math.random() > 0.3 ? currentValue + Math.floor(Math.random() * 3 + 1) : currentValue; // 1-3 new transactions
          return { ...stat, value: newValue.toLocaleString() };
        }
        if (stat.label === "Aktif Yatırımcı") {
          const currentValue = parseInt(stat.value.replace(',', ''));
          const newValue = Math.random() > 0.85 ? currentValue + 1 : currentValue; // Occasional new investor
          return { ...stat, value: newValue.toLocaleString() };
        }
        if (stat.label === "Toplam Yatırım") {
          const currentValue = parseFloat(stat.value.replace(' ETH', '').replace(',', ''));
          const newValue = Math.random() > 0.7 ? currentValue + (Math.random() * 2 + 0.5) : currentValue; // 0.5-2.5 ETH increase
          return { ...stat, value: `${newValue.toLocaleString()} ETH` };
        }
        return stat;
      }));
    }, 3000); // Update every 3 seconds for more dynamic feel

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" showText={true} animated={false} />
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer hover:bg-purple-500/10 px-3 py-2 rounded-lg"
              >
                Özellikler
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer hover:bg-purple-500/10 px-3 py-2 rounded-lg"
              >
                Nasıl Çalışır
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer hover:bg-purple-500/10 px-3 py-2 rounded-lg"
              >
                Fiyatlandırma
              </button>
              <button 
                onClick={() => scrollToSection('statistics')}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer hover:bg-purple-500/10 px-3 py-2 rounded-lg"
              >
                İstatistikler
              </button>
              <button 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Başla
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm mb-6">
                <Rocket className="w-4 h-4 mr-2" />
                Yeni: 1 Milyar FULT Token Lansmanı
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                DeFi'nin
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Geleceği</span>
                <br />Burada Başlıyor
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Flash USDT Likidite Bot ile otomatik arbitraj yapın. AI destekli sistemimiz 
                7/24 çalışarak sizin için kar üretiyor. Minimum risk, maksimum getiri.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center"
                >
                  Hemen Başla
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="border border-purple-500 text-purple-300 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-500/10 transition-all duration-200"
                >
                  Demo İzle
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Canlı İstatistikler</h3>
                  <div className="flex items-center space-x-2 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm">Aktif</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {liveStats.map((stat, index) => (
                    <div key={index} className="bg-gray-800/30 rounded-lg p-4">
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400">
                    🔴 Canlı veriler - Her 5 saniyede güncellenir
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Neden Flash USDT Bot?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Gelişmiş teknoloji ve güvenilir altyapı ile DeFi dünyasında öncü olmaya devam ediyoruz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Ek Özellikler */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-8 h-8 text-green-400 mr-3" />
                <h4 className="text-lg font-semibold text-white">Gerçek Zamanlı Analiz</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Blockchain verilerini anlık olarak analiz ederek en karlı arbitraj fırsatlarını yakalar
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-center mb-4">
                <Lock className="w-8 h-8 text-blue-400 mr-3" />
                <h4 className="text-lg font-semibold text-white">Audit Edilmiş Kod</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Smart contract kodumuz bağımsız güvenlik firmaları tarafından audit edilmiştir
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center mb-4">
                <Globe className="w-8 h-8 text-purple-400 mr-3" />
                <h4 className="text-lg font-semibold text-white">Çoklu DEX Desteği</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Uniswap, SushiSwap, PancakeSwap ve daha fazla DEX'te arbitraj imkanı
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-xl text-gray-300">
              3 basit adımda kar elde etmeye başlayın
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Cüzdan Bağla</h3>
              <p className="text-gray-300">
                MetaMask, Trust Wallet veya diğer Web3 cüzdanınızı güvenle bağlayın
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Yatırım Yap</h3>
              <p className="text-gray-300">
                Minimum 0.1 ETH ile yatırım yapın ve otomatik kar sistemine katılın
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Kar Elde Et</h3>
              <p className="text-gray-300">
                AI botumuz 7/24 çalışarak sizin için kar üretir ve otomatik dağıtır
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="statistics" className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Platform İstatistikleri & Kullanıcı Yorumları
            </h2>
            <p className="text-xl text-gray-300">
              Gerçek veriler ve memnun yatırımcılarımızdan yorumlar
            </p>
          </div>
          
          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30 text-center"
            >
              <div className="text-3xl font-bold text-green-400 mb-2">%34.7</div>
              <div className="text-gray-300">Ortalama Aylık Getiri</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30 text-center"
            >
              <div className="text-3xl font-bold text-blue-400 mb-2">99.2%</div>
              <div className="text-gray-300">İşlem Başarı Oranı</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30 text-center"
            >
              <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-300">Kesintisiz Çalışma</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30 text-center"
            >
              <div className="text-3xl font-bold text-yellow-400 mb-2">15ms</div>
              <div className="text-gray-300">Ortalama İşlem Süresi</div>
            </motion.div>
          </div>
          
          {/* Kullanıcı Yorumları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-12 border border-purple-500/30"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              DeFi Devrimi'ne Katılın
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              🎯 <strong>Minimum Yatırım:</strong> 0.1 ETH<br/>
              💎 <strong>Komisyon:</strong> Sadece %2 (kar üzerinden)<br/>
              🚀 <strong>Erken Yatırımcı Bonusu:</strong> İlk 100 yatırımcı için %0 komisyon!<br/><br/>
              1 milyar FULT token ile desteklenen ekosistemimizde yerinizi alın.
            </p>
            
            {/* Fiyatlandırma Tablosu */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-2">Başlangıç</h3>
                <div className="text-2xl font-bold text-purple-400 mb-4">0.1 - 1 ETH</div>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>✅ Temel arbitraj</li>
                  <li>✅ %2 komisyon</li>
                  <li>✅ Günlük kar dağıtımı</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-500/50 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-medium">
                  Popüler
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Profesyonel</h3>
                <div className="text-2xl font-bold text-purple-400 mb-4">1 - 10 ETH</div>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>✅ Gelişmiş arbitraj</li>
                  <li>✅ %1.5 komisyon</li>
                  <li>✅ Öncelikli işlemler</li>
                  <li>✅ VIP destek</li>
                </ul>
              </div>
              
              <div className="bg-gray-800/30 rounded-lg p-6 border border-yellow-500/50">
                <h3 className="text-lg font-semibold text-white mb-2">Kurumsal</h3>
                <div className="text-2xl font-bold text-yellow-400 mb-4">10+ ETH</div>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>✅ Premium arbitraj</li>
                  <li>✅ %1 komisyon</li>
                  <li>✅ Özel stratejiler</li>
                  <li>✅ Kişisel danışman</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresinizi girin"
                className="bg-gray-800/50 border border-gray-600 rounded-lg px-6 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none w-full sm:w-80"
              />
              <button 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 whitespace-nowrap"
              >
                Hemen Başla
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              ✅ Spam yok, sadece önemli güncellemeler
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-purple-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Logo size="sm" showText={true} animated={false} />
              </div>
              <p className="text-gray-400 text-sm">
                DeFi'nin geleceğini bugünden yaşayın. Güvenli, otomatik ve karlı.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Ürün</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors cursor-pointer">Özellikler</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors cursor-pointer">Nasıl Çalışır</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors cursor-pointer">Fiyatlandırma</button></li>
                <li><button onClick={() => { window.location.hash = 'api'; window.scrollTo(0, 0); }} className="hover:text-white transition-colors cursor-pointer">API</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Destek</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => { window.location.hash = 'docs'; window.scrollTo(0, 0); }} className="hover:text-white transition-colors cursor-pointer">Dokümantasyon</button></li>
                <li><button onClick={() => { window.location.hash = 'help'; window.scrollTo(0, 0); }} className="hover:text-white transition-colors cursor-pointer">Yardım Merkezi</button></li>
                <li><button onClick={() => { window.location.hash = 'contact'; window.scrollTo(0, 0); }} className="hover:text-white transition-colors cursor-pointer">İletişim</button></li>
                <li><a href="https://discord.gg/flashusdt" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">Discord</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Yasal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => { window.location.hash = 'privacy'; window.scrollTo(0, 0); }} className="hover:text-white transition-colors cursor-pointer">Gizlilik Politikası</button></li>
                <li><button onClick={() => { window.location.hash = 'terms'; window.scrollTo(0, 0); }} className="hover:text-white transition-colors cursor-pointer">Kullanım Şartları</button></li>
                <li><button onClick={() => { window.location.hash = 'risk'; window.scrollTo(0, 0); }} className="hover:text-white transition-colors cursor-pointer">Risk Bildirimi</button></li>
                <li><button onClick={() => { window.location.hash = 'audit'; window.scrollTo(0, 0); }} className="hover:text-white transition-colors cursor-pointer">Audit Raporu</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Flash USDT Likidite Bot. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;