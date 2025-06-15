import React from 'react';
import { ArrowLeft, AlertTriangle, TrendingDown, Shield, Info } from 'lucide-react';
import Logo from '../components/Logo';

interface RiskDisclosureProps {
  onBack: () => void;
}

const RiskDisclosure: React.FC<RiskDisclosureProps> = ({ onBack }) => {
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
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Risk Bildirimi</h1>
            <p className="text-gray-300">Yatırım yapmadan önce mutlaka okuyun</p>
          </div>

          <div className="space-y-8 text-gray-300">
            {/* Genel Risk Uyarısı */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-red-400 font-bold text-lg mb-2">ÖNEMLİ RİSK UYARISI</h3>
                  <p className="text-red-300">
                    Kripto para yatırımları son derece risklidir. Yatırım değerinizin tamamını 
                    kaybetme riski bulunmaktadır. Sadece kaybetmeyi göze alabileceğiniz miktarda 
                    yatırım yapın.
                  </p>
                </div>
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <TrendingDown className="w-6 h-6 mr-2 text-red-400" />
                Piyasa Riskleri
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-2">Volatilite Riski</h4>
                  <p className="text-sm">
                    Kripto para piyasaları son derece volatildir. Fiyatlar dakikalar içinde 
                    %50 veya daha fazla değişebilir.
                  </p>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-2">Likidite Riski</h4>
                  <p className="text-sm">
                    Piyasa koşullarına bağlı olarak yatırımınızı istediğiniz anda 
                    çekemeyebilirsiniz.
                  </p>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-2">Arbitraj Riski</h4>
                  <p className="text-sm">
                    Arbitraj fırsatları her zaman mevcut olmayabilir ve kar garantisi yoktur.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-yellow-400" />
                Teknoloji Riskleri
              </h2>
              <div className="space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-medium mb-2">Smart Contract Riskleri</h4>
                  <ul className="list-disc list-inside space-y-1 text-yellow-300 text-sm">
                    <li>Kod hatalarından kaynaklanan kayıplar</li>
                    <li>Güvenlik açıklarından yararlanma girişimleri</li>
                    <li>Blockchain ağı sorunları</li>
                    <li>Gas fee dalgalanmaları</li>
                  </ul>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-2">Platform Riskleri</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                    <li>Sistem kesintileri ve bakım süreleri</li>
                    <li>Siber saldırı riskleri</li>
                    <li>Veri kaybı olasılığı</li>
                    <li>Üçüncü taraf hizmet sağlayıcı sorunları</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Yasal ve Düzenleyici Riskler</h2>
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-2">Düzenleyici Değişiklikler</h4>
                  <p className="text-blue-300 text-sm">
                    Kripto para düzenlemeleri hızla değişmektedir. Yeni yasalar 
                    hizmetimizi etkileyebilir veya yasaklayabilir.
                  </p>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-2">Vergi Yükümlülükleri</h4>
                  <p className="text-sm">
                    Kripto para kazançları vergi kapsamında olabilir. Vergi 
                    yükümlülüklerinizi yerel yasalara göre değerlendirin.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Operasyonel Riskler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-2">İnsan Hatası</h4>
                  <p className="text-sm">
                    Yanlış adres girme, private key kaybı gibi kullanıcı hataları 
                    geri alınamaz kayıplara neden olabilir.
                  </p>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-2">Cüzdan Güvenliği</h4>
                  <p className="text-sm">
                    Cüzdan güvenliğiniz tamamen sizin sorumluluğunuzdadır. 
                    Private key'lerinizi güvenli tutun.
                  </p>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-2">Ağ Tıkanıklığı</h4>
                  <p className="text-sm">
                    Ethereum ağı tıkanıklığı işlem gecikmelerine ve yüksek 
                    gas ücretlerine neden olabilir.
                  </p>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-2">Slippage Riski</h4>
                  <p className="text-sm">
                    Büyük işlemlerde beklenen fiyattan farklı fiyatlarla 
                    işlem gerçekleşebilir.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Info className="w-6 h-6 mr-2 text-purple-400" />
                Risk Yönetimi Önerileri
              </h2>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
                <ul className="space-y-3 text-purple-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Sadece kaybetmeyi göze alabileceğiniz miktarda yatırım yapın</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Portföyünüzü çeşitlendirin, tek bir varlığa bağımlı kalmayın</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Düzenli olarak kar realizasyonu yapın</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Piyasa koşullarını sürekli takip edin</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Cüzdan güvenliğinizi en üst seviyede tutun</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Yatırım kararlarınızı duygusal değil, analitik olarak verin</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Sorumluluk Reddi</h2>
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                <p className="text-sm leading-relaxed">
                  Flash USDT Likidite Bot, yukarıda belirtilen risklerden kaynaklanan 
                  hiçbir kayıptan sorumlu değildir. Bu platform yatırım tavsiyesi vermez 
                  ve kar garantisi sağlamaz. Tüm yatırım kararları kullanıcının kendi 
                  sorumluluğundadır. Yatırım yapmadan önce bağımsız finansal danışmanlık 
                  almanızı önemle tavsiye ederiz.
                </p>
              </div>
            </section>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mt-8">
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <h3 className="text-red-400 font-bold text-lg mb-2">
                  Bu Risk Bildirimini Okuduğunuzu Onaylayın
                </h3>
                <p className="text-red-300 text-sm">
                  Yatırım yapmadan önce tüm riskleri anladığınızdan ve kabul ettiğinizden 
                  emin olun. Kripto para yatırımları spekülatif niteliktedir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskDisclosure;