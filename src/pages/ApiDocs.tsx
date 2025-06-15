import React from 'react';
import { ArrowLeft, Code, Key, Shield, Zap } from 'lucide-react';
import Logo from '../components/Logo';

interface ApiDocsProps {
  onBack: () => void;
}

const ApiDocs: React.FC<ApiDocsProps> = ({ onBack }) => {
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
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">API Dokümantasyonu</h1>
            <p className="text-gray-300">Flash USDT Bot API'sini kullanarak kendi uygulamanızı geliştirin</p>
          </div>

          <div className="space-y-8">
            {/* API Key */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Key className="w-5 h-5 mr-2 text-yellow-400" />
                API Key Alma
              </h3>
              <p className="text-gray-300 mb-4">
                API'yi kullanmak için önce bir API key almanız gerekiyor:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
                POST /api/v1/auth/generate-key<br/>
                Headers: Authorization: Bearer YOUR_JWT_TOKEN
              </div>
            </div>

            {/* Endpoints */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-400" />
                Ana Endpoints
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Bot İstatistikleri</h4>
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
                    GET /api/v1/bot/stats
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Bot'un genel performans verilerini döndürür</p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Yatırım Yapma</h4>
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
                    POST /api/v1/investment/create<br/>
                    Body: {`{"amount": "0.5", "currency": "ETH"}`}
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Yeni yatırım oluşturur</p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Kar Geçmişi</h4>
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
                    GET /api/v1/profits/history?address=0x...
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Kullanıcının kar geçmişini getirir</p>
                </div>
              </div>
            </div>

            {/* Rate Limits */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-400" />
                Rate Limits & Güvenlik
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>Rate Limit:</strong> 100 istek/dakika</li>
                <li>• <strong>Authentication:</strong> API Key gerekli</li>
                <li>• <strong>HTTPS:</strong> Tüm istekler HTTPS üzerinden</li>
                <li>• <strong>IP Whitelist:</strong> Güvenlik için IP kısıtlaması</li>
              </ul>
            </div>

            {/* Example Code */}
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">Örnek Kod (JavaScript)</h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
{`const response = await fetch('https://api.flashusdt.com/v1/bot/stats', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log('Bot Stats:', data);`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;