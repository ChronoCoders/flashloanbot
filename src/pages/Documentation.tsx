import React, { useState } from 'react';
import { ArrowLeft, Book, Code, Zap, Shield, BarChart3, Settings, ExternalLink, Copy } from 'lucide-react';
import Logo from '../components/Logo';
import toast from 'react-hot-toast';

interface DocumentationProps {
  onBack: () => void;
}

const Documentation: React.FC<DocumentationProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Başlangıç', icon: <Zap className="w-4 h-4" /> },
    { id: 'smart-contract', title: 'Smart Contract', icon: <Code className="w-4 h-4" /> },
    { id: 'api-reference', title: 'API Referansı', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'security', title: 'Güvenlik', icon: <Shield className="w-4 h-4" /> },
    { id: 'configuration', title: 'Konfigürasyon', icon: <Settings className="w-4 h-4" /> }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Kopyalandı!');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Başlangıç Rehberi</h2>
              <p className="text-gray-300 text-lg mb-6">
                Flash USDT Likidite Bot'u kullanmaya başlamak için adım adım rehber.
              </p>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">1. Cüzdan Hazırlığı</h3>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Desteklenen cüzdanlar: MetaMask, Trust Wallet, WalletConnect
                </p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <code className="text-green-400 text-sm">
                    // MetaMask bağlantısı kontrol et<br/>
                    if (typeof window.ethereum !== 'undefined') {`{`}<br/>
                    &nbsp;&nbsp;console.log('MetaMask yüklü!');<br/>
                    {`}`}
                  </code>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">2. İlk Yatırım</h3>
              <div className="space-y-4">
                <p className="text-gray-300">Minimum 0.1 ETH ile yatırım yapabilirsiniz:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Cüzdanınızı bağlayın</li>
                  <li>Yatırım miktarını girin</li>
                  <li>İşlemi onaylayın</li>
                  <li>Kar dağıtımını bekleyin</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
              <h4 className="text-blue-400 font-medium mb-2">💡 İpucu</h4>
              <p className="text-blue-300 text-sm">
                İlk yatırımınızı küçük bir miktarla yaparak sistemi test edin.
              </p>
            </div>
          </div>
        );

      case 'smart-contract':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Smart Contract Dokümantasyonu</h2>
              <p className="text-gray-300 text-lg mb-6">
                FlashUSDTLikiditeBot contract'ının detaylı teknik dokümantasyonu.
              </p>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Contract Adresleri</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                  <div>
                    <p className="text-white font-medium">Mainnet</p>
                    <p className="text-gray-400 text-sm font-mono">0x... (Deploy sonrası)</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard('0x...')}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                  <div>
                    <p className="text-white font-medium">Sepolia Testnet</p>
                    <p className="text-gray-400 text-sm font-mono">0x... (Test için)</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard('0x...')}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Ana Fonksiyonlar</h3>
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="text-green-400 font-mono mb-2">yatirimYap()</h4>
                  <p className="text-gray-300 text-sm mb-2">Yatırım yapmak için kullanılır</p>
                  <code className="text-green-400 text-sm">
                    function yatirimYap() external payable nonReentrant whenNotPaused
                  </code>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="text-green-400 font-mono mb-2">karCek()</h4>
                  <p className="text-gray-300 text-sm mb-2">Kar çekmek için kullanılır</p>
                  <code className="text-green-400 text-sm">
                    function karCek() external nonReentrant
                  </code>
                </div>

                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="text-green-400 font-mono mb-2">botIstatistikleri()</h4>
                  <p className="text-gray-300 text-sm mb-2">Bot istatistiklerini görüntüler</p>
                  <code className="text-green-400 text-sm">
                    function botIstatistikleri() external view returns (uint256, uint256, uint256, uint256, uint256)
                  </code>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
              <h4 className="text-yellow-400 font-medium mb-2">⚠️ Önemli</h4>
              <p className="text-yellow-300 text-sm">
                Contract fonksiyonlarını kullanırken gas limit'lerini dikkate alın.
              </p>
            </div>
          </div>
        );

      case 'api-reference':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">API Referansı</h2>
              <p className="text-gray-300 text-lg mb-6">
                Flash USDT Bot API'sini kullanarak kendi uygulamanızı geliştirin.
              </p>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Base URL</h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-green-400">https://api.flashusdt.com/v1</code>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Authentication</h3>
              <p className="text-gray-300 mb-4">API key'inizi header'da gönderin:</p>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-green-400 text-sm">
                  Authorization: Bearer YOUR_API_KEY<br/>
                  Content-Type: application/json
                </code>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Endpoints</h3>
              <div className="space-y-4">
                <div className="border border-gray-600 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-mono">GET</span>
                    <span className="text-white font-mono">/bot/stats</span>
                  </div>
                  <p className="text-gray-300 text-sm">Bot istatistiklerini getirir</p>
                </div>

                <div className="border border-gray-600 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-mono">POST</span>
                    <span className="text-white font-mono">/investment/create</span>
                  </div>
                  <p className="text-gray-300 text-sm">Yeni yatırım oluşturur</p>
                </div>

                <div className="border border-gray-600 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-mono">GET</span>
                    <span className="text-white font-mono">/profits/history</span>
                  </div>
                  <p className="text-gray-300 text-sm">Kar geçmişini getirir</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Güvenlik Dokümantasyonu</h2>
              <p className="text-gray-300 text-lg mb-6">
                Flash USDT Bot'un güvenlik özellikleri ve en iyi uygulamalar.
              </p>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Güvenlik Özellikleri</h3>
              <ul className="space-y-2 text-green-300">
                <li>✅ ReentrancyGuard koruması</li>
                <li>✅ Pausable acil durdurma</li>
                <li>✅ Ownable erişim kontrolü</li>
                <li>✅ Input validasyonu</li>
                <li>✅ CertiK audit onayı</li>
              </ul>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">En İyi Uygulamalar</h3>
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-2">Cüzdan Güvenliği</h4>
                  <ul className="text-blue-300 text-sm space-y-1">
                    <li>• Private key'lerinizi asla paylaşmayın</li>
                    <li>• Hardware wallet kullanın</li>
                    <li>• Seed phrase'i güvenli saklayın</li>
                  </ul>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-medium mb-2">İşlem Güvenliği</h4>
                  <ul className="text-yellow-300 text-sm space-y-1">
                    <li>• Gas limit'lerini kontrol edin</li>
                    <li>• Contract adresini doğrulayın</li>
                    <li>• Slippage toleransını ayarlayın</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'configuration':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Konfigürasyon</h2>
              <p className="text-gray-300 text-lg mb-6">
                Sistem konfigürasyonu ve özelleştirme seçenekleri.
              </p>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Environment Variables</h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-green-400 text-sm">
                  VITE_MAINNET_CONTRACT_ADDRESS=0x...<br/>
                  VITE_SEPOLIA_CONTRACT_ADDRESS=0x...<br/>
                  VITE_INFURA_PROJECT_ID=your_project_id<br/>
                  VITE_ETHERSCAN_API_KEY=your_api_key
                </code>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Network Konfigürasyonu</h3>
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Ethereum Mainnet</h4>
                  <code className="text-green-400 text-sm">
                    Chain ID: 1<br/>
                    RPC: https://mainnet.infura.io/v3/PROJECT_ID
                  </code>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Sepolia Testnet</h4>
                  <code className="text-green-400 text-sm">
                    Chain ID: 11155111<br/>
                    RPC: https://sepolia.infura.io/v3/PROJECT_ID
                  </code>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Book className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Dokümantasyon</h1>
          <p className="text-gray-300">Kapsamlı geliştirici rehberi ve API dokümantasyonu</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-6 sticky top-8">
              <h3 className="text-white font-semibold mb-4">İçindekiler</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      activeSection === section.id
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                    }`}
                  >
                    {section.icon}
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <h4 className="text-white font-medium mb-3">Hızlı Linkler</h4>
                <div className="space-y-2 text-sm">
                  <a href="#api" onClick={() => { window.location.hash = 'api'; window.scrollTo(0, 0); }} className="text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>API Playground</span>
                  </a>
                  <a href="#audit" onClick={() => { window.location.hash = 'audit'; window.scrollTo(0, 0); }} className="text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>Audit Raporu</span>
                  </a>
                  <a href="https://github.com/flashusdt" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;