import React from 'react';
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle, Building, Globe } from 'lucide-react';
import Logo from '../components/Logo';

interface TermsOfServiceProps {
  onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Kullanım Şartları ve Hizmet Sözleşmesi</h1>
            <p className="text-gray-300">Son güncelleme: 1 Ocak 2025</p>
            <p className="text-gray-400 text-sm mt-2">Türkiye Cumhuriyeti ve Seychelles hukuku uyarınca düzenlenmiştir</p>
          </div>

          {/* Şirket ve Hukuki Bilgiler */}
          <section className="mb-8">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Building className="w-6 h-6 mr-2 text-blue-400" />
                Hizmet Sağlayıcı Bilgileri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                <div>
                  <h4 className="text-white font-medium mb-2">Şirket Unvanı:</h4>
                  <p className="text-blue-300 font-medium">CryptoArb Technologies Ltd.</p>
                  
                  <h4 className="text-white font-medium mb-2 mt-4">Merkez Adresi:</h4>
                  <p className="text-sm">
                    Suite 305, Griffon Corporate Centre<br/>
                    Beachcomber Lane, P.O. Box 1510<br/>
                    Victoria, Mahé, Seychelles
                  </p>
                  
                  <h4 className="text-white font-medium mb-2 mt-4">Lisans ve Kayıt:</h4>
                  <p className="text-sm">
                    Şirket No: 8429847-1<br/>
                    FSA (Financial Services Authority) Lisanslı<br/>
                    Seychelles International Business Companies Act uyarınca kurulmuştur
                  </p>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">İletişim Bilgileri:</h4>
                  <p className="text-sm">
                    <strong>Telefon:</strong> +248 4 67 1000<br/>
                    <strong>Faks:</strong> +248 4 67 1001<br/>
                    <strong>E-posta:</strong> legal@cryptoarb.sc<br/>
                    <strong>Website:</strong> www.flashusdt.com
                  </p>
                  
                  <h4 className="text-white font-medium mb-2 mt-4">Türkiye Temsilcisi:</h4>
                  <p className="text-sm">
                    <strong>Adres:</strong> Maslak Mahallesi, Büyükdere Caddesi<br/>
                    No: 255, Nurol Plaza B Blok, Kat: 18<br/>
                    34398 Sarıyer/İstanbul<br/>
                    <strong>E-posta:</strong> turkiye@cryptoarb.sc<br/>
                    <strong>Telefon:</strong> +90 212 345 67 89
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-blue-400" />
                Sözleşme Tarafları ve Kapsam
              </h2>
              <div className="space-y-4">
                <p>
                  Bu Kullanım Şartları ve Hizmet Sözleşmesi ("Sözleşme"), CryptoArb Technologies Ltd. 
                  ("Şirket", "Biz", "Platform") ile Flash USDT Likidite Bot hizmetini kullanan 
                  gerçek veya tüzel kişiler ("Kullanıcı", "Siz") arasında akdedilmiştir.
                </p>
                
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-2">Sözleşme Kapsamındaki Hizmetler:</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Blockchain tabanlı arbitraj bot hizmetleri</li>
                    <li>Otomatik likidite arbitraj işlemleri</li>
                    <li>DeFi protokol entegrasyonları</li>
                    <li>Kar dağıtım ve yönetim hizmetleri</li>
                    <li>Platform erişim ve kullanım hakları</li>
                    <li>Müşteri destek hizmetleri</li>
                  </ul>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-medium mb-2">Kullanıcı Uygunluk Kriterleri:</h4>
                  <ul className="list-disc list-inside space-y-2 text-yellow-300 text-sm">
                    <li>18 yaşını doldurmuş olmak (Türkiye için reşit olmak)</li>
                    <li>Hukuki ehliyete sahip olmak</li>
                    <li>Kripto para yatırımlarının yasal olduğu ülkede ikamet etmek</li>
                    <li>Platform kullanım şartlarını kabul etmek</li>
                    <li>KYC (Know Your Customer) prosedürlerini tamamlamak</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-yellow-400" />
                Risk Bildirimi ve Yatırım Uyarıları
              </h2>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <div className="space-y-4">
                  <h4 className="text-red-400 font-medium text-lg">KRİTİK RİSK UYARISI:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-red-300 font-medium mb-2">Finansal Riskler:</h5>
                      <ul className="list-disc list-inside space-y-1 text-red-200 text-sm">
                        <li>Kripto para yatırımları yüksek risk içerir</li>
                        <li>Yatırım değeri %100'e kadar azalabilir</li>
                        <li>Geçmiş performans gelecek sonuçları garanti etmez</li>
                        <li>Piyasa volatilitesi aşırı kayıplara neden olabilir</li>
                        <li>Likidite riskleri mevcuttur</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-red-300 font-medium mb-2">Teknoloji Riskleri:</h5>
                      <ul className="list-disc list-inside space-y-1 text-red-200 text-sm">
                        <li>Smart contract riskleri</li>
                        <li>Blockchain ağ sorunları</li>
                        <li>Siber güvenlik tehditleri</li>
                        <li>Teknik arıza olasılıkları</li>
                        <li>Düzenleyici değişiklik riskleri</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-red-300 text-sm font-medium mt-4">
                    ⚠️ UYARI: Sadece kaybetmeyi göze alabileceğiniz miktarda yatırım yapın. 
                    Bu platform yatırım tavsiyesi vermez ve kar garantisi sağlamaz.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Hizmet Kullanım Koşulları</h2>
              <div className="space-y-6">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-medium mb-3">İzin Verilen Kullanım:</h4>
                  <ul className="list-disc list-inside space-y-2 text-green-300 text-sm">
                    <li>Kişisel yatırım amaçlı platform kullanımı</li>
                    <li>Yasal çerçevede arbitraj işlemlerine katılım</li>
                    <li>Platform özelliklerinin normal kullanımı</li>
                    <li>Müşteri destek hizmetlerinden yararlanma</li>
                    <li>Hesap bilgilerini güncelleme ve yönetme</li>
                  </ul>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-medium mb-3">Yasaklanan Faaliyetler:</h4>
                  <ul className="list-disc list-inside space-y-2 text-red-300 text-sm">
                    <li>Sistemi manipüle etme veya hack girişimleri</li>
                    <li>Sahte hesap oluşturma veya kimlik hırsızlığı</li>
                    <li>Kara para aklama veya terör finansmanı</li>
                    <li>Diğer kullanıcıları aldatma veya dolandırma</li>
                    <li>Platform güvenliğini tehdit eden davranışlar</li>
                    <li>Fikri mülkiyet haklarını ihlal etme</li>
                    <li>Spam, phishing veya zararlı yazılım dağıtma</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Ücretler ve Ödeme Koşulları</h2>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-purple-400 font-medium mb-3">Mevcut Ücret Yapısı:</h4>
                    <ul className="list-disc list-inside space-y-2 text-purple-300 text-sm">
                      <li><strong>Hesap Açma:</strong> Ücretsiz</li>
                      <li><strong>Yatırım İşlemi:</strong> Ücretsiz</li>
                      <li><strong>Platform Kullanımı:</strong> Ücretsiz</li>
                      <li><strong>Başarı Komisyonu:</strong> Sadece kar üzerinden %2</li>
                      <li><strong>Çekim İşlemi:</strong> Blockchain gas fee</li>
                      <li><strong>Erken Yatırımcı Bonusu:</strong> İlk 100 kullanıcı için %0 komisyon</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-purple-400 font-medium mb-3">Ödeme ve Faturalandırma:</h4>
                    <ul className="list-disc list-inside space-y-2 text-purple-300 text-sm">
                      <li>Komisyonlar otomatik olarak hesaplanır</li>
                      <li>Ödemeler kripto para ile yapılır</li>
                      <li>Fatura talep edilebilir (KDV dahil)</li>
                      <li>Türkiye'de KDV %18 uygulanır</li>
                      <li>Ücret değişiklikleri 30 gün önceden duyurulur</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Sorumluluk ve Tazminat</h2>
              <div className="space-y-4">
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-3">Şirket Sorumluluk Sınırlamaları:</h4>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Platform "olduğu gibi" hizmet verir, performans garantisi vermez</li>
                    <li>Piyasa risklerinden ve fiyat dalgalanmalarından sorumlu değildir</li>
                    <li>Üçüncü taraf hizmetlerinden (blockchain ağları, DEX'ler) sorumlu değildir</li>
                    <li>Teknik arızalar ve sistem kesintilerinden kaynaklanan zararlardan sorumlu değildir</li>
                    <li>Kullanıcı hatalarından (yanlış adres, private key kaybı) sorumlu değildir</li>
                    <li>Maksimum sorumluluk tutarı son 12 ayda ödenen komisyon tutarı ile sınırlıdır</li>
                  </ul>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-3">Kullanıcı Sorumlulukları:</h4>
                  <ul className="list-disc list-inside space-y-2 text-blue-300 text-sm">
                    <li>Hesap güvenliğini sağlamak (private key, şifre koruma)</li>
                    <li>Doğru ve güncel bilgi vermek</li>
                    <li>Yasal yükümlülükleri yerine getirmek (vergi beyanı vb.)</li>
                    <li>Platform kurallarına uymak</li>
                    <li>Üçüncü kişilerin haklarına saygı göstermek</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-green-400" />
                Uygulanacak Hukuk ve Yargı Yetkisi
              </h2>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-green-400 font-medium mb-3">Uygulanacak Hukuk:</h4>
                    <ul className="list-disc list-inside space-y-2 text-green-300 text-sm">
                      <li><strong>Ana Hukuk:</strong> Seychelles Cumhuriyeti hukuku</li>
                      <li><strong>Türkiye Kullanıcıları:</strong> Türk hukuku hükümleri de uygulanır</li>
                      <li><strong>Uluslararası Anlaşmalar:</strong> Lahey Konvansiyonu</li>
                      <li><strong>Blockchain Hukuku:</strong> Malta DLT mevzuatı referans alınır</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-green-400 font-medium mb-3">Yargı Yetkisi:</h4>
                    <ul className="list-disc list-inside space-y-2 text-green-300 text-sm">
                      <li><strong>Birinci Derece:</strong> Seychelles Supreme Court</li>
                      <li><strong>Türkiye Kullanıcıları:</strong> İstanbul Mahkemeleri yetkili</li>
                      <li><strong>Alternatif Çözüm:</strong> Singapur Uluslararası Tahkim Merkezi</li>
                      <li><strong>Tüketici Uyuşmazlıkları:</strong> Türkiye Tüketici Hakem Heyetleri</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Sözleşme Değişiklikleri ve Fesih</h2>
              <div className="space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-medium mb-3">Sözleşme Değişiklikleri:</h4>
                  <ul className="list-disc list-inside space-y-2 text-yellow-300 text-sm">
                    <li>Önemli değişiklikler 30 gün önceden e-posta ile bildirilir</li>
                    <li>Küçük değişiklikler web sitesinde duyurulur</li>
                    <li>Değişiklikleri kabul etmemeniz durumunda hesabınızı kapatabilirsiniz</li>
                    <li>Platform kullanımına devam etmeniz değişiklikleri kabul ettiğiniz anlamına gelir</li>
                  </ul>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-medium mb-3">Sözleşme Feshi:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-red-300 font-medium mb-2">Kullanıcı Tarafından Fesih:</h5>
                      <ul className="list-disc list-inside space-y-1 text-red-200 text-sm">
                        <li>İstediğiniz zaman hesabınızı kapatabilirsiniz</li>
                        <li>Mevcut yatırımlar ve karlar çekilebilir</li>
                        <li>30 gün önceden bildirim önerilir</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-red-300 font-medium mb-2">Şirket Tarafından Fesih:</h5>
                      <ul className="list-disc list-inside space-y-1 text-red-200 text-sm">
                        <li>Sözleşme ihlali durumunda</li>
                        <li>Yasal yükümlülük gereği</li>
                        <li>Güvenlik tehdidi oluşturma</li>
                        <li>30 gün önceden bildirimle</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">İletişim ve Hukuki Bildirimler</h2>
              <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-2">Hukuki İletişim:</h4>
                    <p className="text-sm">
                      <strong>E-posta:</strong> legal@cryptoarb.sc<br/>
                      <strong>Posta Adresi:</strong> Suite 305, Griffon Corporate Centre<br/>
                      Beachcomber Lane, P.O. Box 1510<br/>
                      Victoria, Mahé, Seychelles<br/>
                      <strong>Telefon:</strong> +248 4 67 1000
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-2">Türkiye İletişim:</h4>
                    <p className="text-sm">
                      <strong>E-posta:</strong> turkiye@cryptoarb.sc<br/>
                      <strong>Adres:</strong> Maslak Mahallesi, Büyükdere Caddesi<br/>
                      No: 255, Nurol Plaza B Blok, Kat: 18<br/>
                      34398 Sarıyer/İstanbul<br/>
                      <strong>Telefon:</strong> +90 212 345 67 89
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    <strong>Önemli:</strong> Bu sözleşme Türkçe ve İngilizce olarak hazırlanmıştır. 
                    Çelişki durumunda İngilizce metin esas alınır. Sözleşme elektronik ortamda 
                    saklanır ve talep halinde temin edilir.
                  </p>
                </div>
              </div>
            </section>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mt-8">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-green-400 font-bold text-lg mb-2">
                  Sözleşme Kabulü
                </h3>
                <p className="text-green-300 text-sm">
                  Platform kullanımına başlayarak bu Kullanım Şartları ve Hizmet Sözleşmesi'ni 
                  okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz. Bu sözleşme 
                  elektronik ortamda akdedilmiş sayılır ve yasal bağlayıcılığa sahiptir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;