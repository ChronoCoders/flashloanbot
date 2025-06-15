import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Search, ChevronDown, ChevronRight, MessageCircle, Mail, Phone } from 'lucide-react';
import Logo from '../components/Logo';

interface HelpCenterProps {
  onBack: () => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqCategories = [
    {
      title: 'Başlangıç',
      faqs: [
        {
          question: 'Flash USDT Bot nasıl çalışır?',
          answer: 'Flash USDT Bot, farklı DEX\'ler arasındaki fiyat farklarını tespit ederek arbitraj işlemleri yapar. AI destekli sistemimiz 7/24 çalışarak kar fırsatlarını yakalar ve karları otomatik olarak yatırımcılara dağıtır.'
        },
        {
          question: 'Minimum yatırım miktarı nedir?',
          answer: 'Minimum yatırım miktarı 0.1 ETH\'dir. Bu miktar, gas ücretlerini karşılamak ve etkili arbitraj işlemleri yapabilmek için belirlenmiştir.'
        },
        {
          question: 'Cüzdanımı nasıl bağlarım?',
          answer: 'MetaMask, Trust Wallet veya WalletConnect destekli herhangi bir cüzdanı kullanabilirsiniz. "Cüzdan Bağla" butonuna tıklayın ve cüzdanınızı seçin.'
        }
      ]
    },
    {
      title: 'Yatırım ve Kar',
      faqs: [
        {
          question: 'Karlar ne zaman dağıtılır?',
          answer: 'Karlar her başarılı arbitraj işlemi sonrasında otomatik olarak hesaplanır ve dağıtılır. Genellikle günde birkaç kez kar dağıtımı gerçekleşir.'
        },
        {
          question: 'Komisyon oranı nedir?',
          answer: 'Sadece kar üzerinden %2 komisyon alınır. Yatırım yaparken herhangi bir ücret yoktur. İlk 100 yatırımcı için komisyon %0\'dır.'
        },
        {
          question: 'Karımı ne zaman çekebilirim?',
          answer: 'Karınızı istediğiniz zaman çekebilirsiniz. Çekim işlemi anında gerçekleşir, sadece blockchain gas ücreti ödersiniz.'
        }
      ]
    },
    {
      title: 'Güvenlik',
      faqs: [
        {
          question: 'Fonlarım güvende mi?',
          answer: 'Evet, smart contract CertiK tarafından audit edilmiştir. ReentrancyGuard, Pausable ve Ownable güvenlik özellikleri kullanılmıştır. Private key\'leriniz asla istenmez.'
        },
        {
          question: 'Smart contract adresi nedir?',
          answer: 'Mainnet contract adresi deploy sonrası paylaşılacaktır. Sepolia testnet\'te test edebilirsiniz. Contract kodu açık kaynak ve doğrulanmıştır.'
        },
        {
          question: 'Acil durumda ne olur?',
          answer: 'Acil durumlarda contract pausable özelliği ile durdurulabilir. Bu durumda tüm fonlar güvenli bir şekilde çekilebilir.'
        }
      ]
    },
    {
      title: 'Teknik Sorunlar',
      faqs: [
        {
          question: 'İşlemim onaylanmıyor, ne yapmalıyım?',
          answer: 'Gas ücretini artırın veya işlemi iptal edip tekrar deneyin. Ağ yoğunluğu yüksekse işlemler gecikebilir.'
        },
        {
          question: 'MetaMask bağlantı sorunu yaşıyorum',
          answer: 'MetaMask\'ı güncelleyin, tarayıcıyı yeniden başlatın ve doğru ağda (Ethereum Mainnet) olduğunuzdan emin olun.'
        },
        {
          question: 'Gas ücreti çok yüksek',
          answer: 'Ethereum ağı yoğun olduğunda gas ücretleri artar. Daha düşük gas ücretli saatleri bekleyebilir veya Polygon ağını kullanabilirsiniz.'
        }
      ]
    }
  ];

  const contactOptions = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Discord Topluluğu',
      description: 'Toplulukla sohbet edin ve anında yardım alın',
      action: 'Discord\'a Katıl',
      link: 'https://discord.gg/flashusdt'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'E-posta Desteği',
      description: 'Detaylı sorularınız için e-posta gönderin',
      action: 'E-posta Gönder',
      link: 'mailto:support@flashusdt.com'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Telegram Kanalı',
      description: 'Güncellemeler ve duyurular için takip edin',
      action: 'Telegram\'a Katıl',
      link: 'https://t.me/flashusdt'
    }
  ];

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" showText={true} animated={false} />
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Ana Sayfaya Dön</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Yardım Merkezi</h1>
            <p className="text-gray-300">Sorularınızın yanıtlarını bulun</p>
          </div>

          {/* Arama */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sorularınızı arayın..."
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* FAQ Kategorileri */}
          <div className="space-y-6 mb-12">
            {(searchQuery ? filteredFaqs : faqCategories).map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-gray-800/30 rounded-lg border border-gray-700/50">
                <h3 className="text-xl font-semibold text-white p-6 border-b border-gray-700/50">
                  {category.title}
                </h3>
                <div className="divide-y divide-gray-700/50">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    const isExpanded = expandedFaq === globalIndex;
                    
                    return (
                      <div key={faqIndex}>
                        <button
                          onClick={() => setExpandedFaq(isExpanded ? null : globalIndex)}
                          className="w-full text-left p-6 hover:bg-gray-700/20 transition-colors flex items-center justify-between"
                        >
                          <span className="text-white font-medium">{faq.question}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-6 pb-6">
                            <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* İletişim Seçenekleri */}
          <div className="border-t border-gray-700/50 pt-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Hala yardıma mı ihtiyacınız var?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactOptions.map((option, index) => (
                <div key={index} className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                    {option.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{option.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{option.description}</p>
                  <a
                    href={option.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    {option.action}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div className="mt-8 bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Hızlı Linkler</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <a href="#api" className="text-purple-400 hover:text-purple-300 transition-colors">
                API Dokümantasyonu
              </a>
              <a href="#privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                Gizlilik Politikası
              </a>
              <a href="#terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                Kullanım Şartları
              </a>
              <a href="#audit" className="text-purple-400 hover:text-purple-300 transition-colors">
                Audit Raporu
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;