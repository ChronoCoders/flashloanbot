import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, FileText, Globe, Building } from 'lucide-react';
import Logo from '../components/Logo';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Gizlilik Politikası ve KVK Bildirimi</h1>
            <p className="text-gray-300">Son güncelleme: 1 Ocak 2025</p>
            <p className="text-gray-400 text-sm mt-2">6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca hazırlanmıştır</p>
          </div>

          {/* Şirket Bilgileri */}
          <section className="mb-8">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Building className="w-6 h-6 mr-2 text-blue-400" />
                Veri Sorumlusu Şirket Bilgileri
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
                  
                  <h4 className="text-white font-medium mb-2 mt-4">Kayıt Bilgileri:</h4>
                  <p className="text-sm">
                    Şirket No: 8429847-1<br/>
                    Seychelles Financial Services Authority (FSA) kayıtlı
                  </p>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">İletişim Bilgileri:</h4>
                  <p className="text-sm">
                    <strong>Telefon:</strong> +248 4 67 1000<br/>
                    <strong>E-posta:</strong> privacy@cryptoarb.sc<br/>
                    <strong>KVK Sorumlusu:</strong> kvk@cryptoarb.sc<br/>
                    <strong>Website:</strong> www.flashusdt.com
                  </p>
                  
                  <h4 className="text-white font-medium mb-2 mt-4">Türkiye Temsilcisi:</h4>
                  <p className="text-sm">
                    <strong>Adres:</strong> Maslak Mahallesi, Büyükdere Caddesi<br/>
                    No: 255, Nurol Plaza B Blok, Kat: 18<br/>
                    34398 Sarıyer/İstanbul<br/>
                    <strong>E-posta:</strong> turkiye@cryptoarb.sc
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-blue-400" />
                Kişisel Verilerin İşlenmesi (KVK Kanunu Uyarınca)
              </h2>
              <div className="space-y-4">
                <p>
                  6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVK Kanunu") uyarınca, 
                  CryptoArb Technologies Ltd. olarak kişisel verilerinizi aşağıdaki şekilde işlemekteyiz:
                </p>
                
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-3">İşlenen Kişisel Veri Kategorileri:</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Kimlik Verileri:</strong> Blockchain cüzdan adresi, kullanıcı adı</li>
                    <li><strong>İletişim Verileri:</strong> E-posta adresi, telefon numarası (isteğe bağlı)</li>
                    <li><strong>Finansal Veriler:</strong> İşlem geçmişi, yatırım miktarları, kar/zarar bilgileri</li>
                    <li><strong>Teknik Veriler:</strong> IP adresi, cihaz bilgileri, çerez verileri</li>
                    <li><strong>İşlem Güvenliği Verileri:</strong> Güvenlik logları, fraud önleme verileri</li>
                  </ul>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-3">Kişisel Verilerin İşlenme Amaçları:</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Blockchain tabanlı arbitraj hizmetlerinin sunulması</li>
                    <li>Kullanıcı hesabının oluşturulması ve yönetimi</li>
                    <li>Finansal işlemlerin gerçekleştirilmesi ve takibi</li>
                    <li>Yasal yükümlülüklerin yerine getirilmesi (AML/KYC)</li>
                    <li>Platform güvenliğinin sağlanması ve fraud önleme</li>
                    <li>Müşteri destek hizmetlerinin sunulması</li>
                    <li>İstatistiksel analiz ve hizmet geliştirme</li>
                  </ul>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-3">Kişisel Verilerin İşlenme Hukuki Sebepleri:</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Açık Rıza:</strong> Platform kullanımı için verilen onay</li>
                    <li><strong>Sözleşmenin İfası:</strong> Hizmet sözleşmesinin yerine getirilmesi</li>
                    <li><strong>Yasal Yükümlülük:</strong> AML, KYC ve vergi mevzuatı gereklilikleri</li>
                    <li><strong>Meşru Menfaat:</strong> Platform güvenliği ve fraud önleme</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-yellow-400" />
                Veri Güvenliği ve Koruma Tedbirleri
              </h2>
              <div className="space-y-4">
                <p>Kişisel verilerinizin güvenliği için aşağıdaki teknik ve idari tedbirleri almaktayız:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                    <h4 className="text-yellow-400 font-medium mb-2">Teknik Güvenlik Tedbirleri:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>AES-256 şifreleme teknolojisi</li>
                      <li>SSL/TLS güvenli veri iletimi</li>
                      <li>Multi-factor authentication (2FA)</li>
                      <li>Düzenli güvenlik penetrasyon testleri</li>
                      <li>Blockchain tabanlı şeffaf işlem kayıtları</li>
                      <li>Cold storage güvenlik sistemleri</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                    <h4 className="text-yellow-400 font-medium mb-2">İdari Güvenlik Tedbirleri:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Personel gizlilik sözleşmeleri</li>
                      <li>Erişim yetkilendirme sistemleri</li>
                      <li>Düzenli güvenlik eğitimleri</li>
                      <li>Veri işleme kayıt ve denetim sistemi</li>
                      <li>Incident response prosedürleri</li>
                      <li>Üçüncü taraf güvenlik auditleri</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">KVK Kanunu Kapsamında Veri Sahibi Hakları</h2>
              <div className="space-y-4">
                <p>KVK Kanunu'nun 11. maddesi uyarınca sahip olduğunuz haklar:</p>
                
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-purple-400 font-medium mb-3">Temel Haklar:</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li><strong>Bilgi Talep Etme:</strong> Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                        <li><strong>Bilgilendirme Talep Etme:</strong> İşlenme amacı ve üçüncü kişilere aktarım bilgisi</li>
                        <li><strong>Erişim Hakkı:</strong> İşlenen kişisel verilerinize erişim</li>
                        <li><strong>Düzeltme Hakkı:</strong> Hatalı verilerin düzeltilmesini talep etme</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-purple-400 font-medium mb-3">İleri Düzey Haklar:</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li><strong>Silme Hakkı:</strong> Kişisel verilerinizin silinmesini talep etme</li>
                        <li><strong>İşlemeyi Durdurma:</strong> Belirli işlemlerin durdurulmasını isteme</li>
                        <li><strong>Taşınabilirlik:</strong> Verilerinizi başka platformlara aktarma</li>
                        <li><strong>İtiraz Hakkı:</strong> Otomatik işlemlere itiraz etme</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-purple-500/20 rounded-lg">
                    <h4 className="text-purple-300 font-medium mb-2">Hak Kullanım Prosedürü:</h4>
                    <p className="text-purple-200 text-sm">
                      Haklarınızı kullanmak için <strong>kvk@cryptoarb.sc</strong> adresine kimlik teyidi ile 
                      birlikte başvurabilirsiniz. Başvurularınız 30 gün içinde ücretsiz olarak yanıtlanır.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-green-400" />
                Uluslararası Veri Transferi
              </h2>
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-medium mb-2">Veri Transfer Politikası:</h4>
                  <p className="text-green-300 text-sm mb-3">
                    Şirketimiz Seychelles merkezli olup, verileriniz aşağıdaki güvenceler altında işlenmektedir:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-green-200 text-sm">
                    <li>Seychelles Data Protection Act 2003 uyumluluğu</li>
                    <li>GDPR benzeri koruma standartları</li>
                    <li>Blockchain verilerinin merkezi olmayan yapısı</li>
                    <li>Türkiye'de temsilci ofis bulundurma</li>
                    <li>Uluslararası veri koruma sertifikaları</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-purple-400" />
                Çerez Politikası
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <h4 className="text-white font-medium mb-2">Kullanılan Çerez Türleri:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="text-purple-400 font-medium mb-2">Zorunlu Çerezler:</h5>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Oturum yönetimi çerezleri</li>
                        <li>Güvenlik çerezleri</li>
                        <li>Cüzdan bağlantı çerezleri</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-purple-400 font-medium mb-2">İsteğe Bağlı Çerezler:</h5>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Analitik çerezler (Google Analytics)</li>
                        <li>Performans ölçüm çerezleri</li>
                        <li>Kullanıcı deneyimi çerezleri</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Şikayet ve Başvuru Yolları</h2>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-red-400 font-medium mb-3">Şirket İçi Başvuru:</h4>
                    <p className="text-red-300 text-sm mb-2">
                      <strong>KVK Sorumlusu:</strong> kvk@cryptoarb.sc<br/>
                      <strong>Yanıt Süresi:</strong> 30 gün<br/>
                      <strong>Başvuru Dili:</strong> Türkçe/İngilizce
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-red-400 font-medium mb-3">Kişisel Verileri Koruma Kurulu:</h4>
                    <p className="text-red-300 text-sm">
                      Şirket içi başvuru sonucundan memnun kalmamanız durumunda<br/>
                      <strong>KVKK'ya başvuru:</strong> www.kvkk.gov.tr<br/>
                      <strong>Başvuru formu:</strong> Resmi web sitesinde mevcut
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">İletişim Bilgileri</h2>
              <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-2">Genel İletişim:</h4>
                    <p className="text-sm">
                      <strong>E-posta:</strong> info@cryptoarb.sc<br/>
                      <strong>Telefon:</strong> +248 4 67 1000<br/>
                      <strong>Çalışma Saatleri:</strong> 09:00-17:00 (UTC+4)
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-2">KVK ve Gizlilik:</h4>
                    <p className="text-sm">
                      <strong>KVK Sorumlusu:</strong> kvk@cryptoarb.sc<br/>
                      <strong>Gizlilik:</strong> privacy@cryptoarb.sc<br/>
                      <strong>Türkiye Temsilcisi:</strong> turkiye@cryptoarb.sc
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    <strong>Önemli Not:</strong> Bu gizlilik politikası Türkiye Cumhuriyeti 6698 sayılı 
                    Kişisel Verilerin Korunması Kanunu ve Seychelles Data Protection Act 2003 
                    uyarınca hazırlanmıştır. Güncellemeler web sitemizde duyurulur.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;