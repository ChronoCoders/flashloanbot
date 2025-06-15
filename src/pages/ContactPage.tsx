import React, { useState } from 'react';
import { ArrowLeft, Mail, MessageCircle, MapPin, Phone, Send, Clock, Globe, User, FileText, Shield } from 'lucide-react';
import Logo from '../components/Logo';
import toast from 'react-hot-toast';

interface ContactPageProps {
  onBack: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  
  const [emailFormData, setEmailFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  });
  
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
    toast.success('Mesajınız başarıyla gönderildi! 24 saat içinde yanıtlanacaktır.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
  };
  
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Email form submission logic here
    toast.success('E-posta desteği talebiniz başarıyla gönderildi! 24 saat içinde yanıtlanacaktır.');
    setEmailFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'normal'
    });
    setShowEmailForm(false);
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'E-posta Desteği',
      description: 'Detaylı sorularınız için e-posta gönderin',
      action: 'E-posta Formu',
      link: '#email-form'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Canlı Destek',
      details: ['Discord: discord.gg/flashusdt', 'Telegram: @flashusdt'],
      description: 'Anında yardım için topluluk kanalları'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Adres',
      details: ['Flash USDT Ltd.', 'Blockchain District, Crypto City'],
      description: 'Merkez ofis lokasyonu'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Çalışma Saatleri',
      details: ['7/24 Otomatik Sistem', 'Destek: 09:00 - 18:00 UTC'],
      description: 'Bot kesintisiz çalışır'
    }
  ];

  const categories = [
    { value: 'general', label: 'Genel Sorular' },
    { value: 'technical', label: 'Teknik Destek' },
    { value: 'investment', label: 'Yatırım Soruları' },
    { value: 'security', label: 'Güvenlik' },
    { value: 'partnership', label: 'Ortaklık' },
    { value: 'media', label: 'Medya & Basın' }
  ];

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">İletişime Geçin</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin. 
            Ekibimiz size yardımcı olmaktan mutluluk duyar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* İletişim Bilgileri */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">İletişim Bilgileri</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">{info.title}</h3>
                      {info.details && info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-300 text-sm">{detail}</p>
                      ))}
                      <p className="text-gray-400 text-xs mt-1">{info.description}</p>
                      {info.action && (
                        <a
                          href={info.link === '#email-form' ? '#' : info.link}
                          target={info.link === '#email-form' ? '_self' : '_blank'}
                          rel={info.link === '#email-form' ? '' : 'noopener noreferrer'}
                          onClick={info.link === '#email-form' ? (e) => {
                            e.preventDefault();
                            setShowEmailForm(true);
                          } : undefined}
                          className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          {info.action}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Şirket İletişim Bilgileri */}
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <h3 className="text-white font-medium mb-4">Şirket İletişim Bilgileri</h3>
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="text-blue-400 font-medium mb-2">CryptoArb Technologies Ltd.</h4>
                      <p className="text-gray-300">
                        Suite 305, Griffon Corporate Centre<br/>
                        Beachcomber Lane, P.O. Box 1510<br/>
                        Victoria, Mahé, Seychelles<br/>
                        <strong>Tel:</strong> +248 4 67 1000<br/>
                        <strong>E-posta:</strong> info@cryptoarb.sc
                      </p>
                    </div>
                    <div>
                      <h4 className="text-blue-400 font-medium mb-2">Türkiye Temsilciliği</h4>
                      <p className="text-gray-300">
                        Maslak Mahallesi, Büyükdere Caddesi<br/>
                        No: 255, Nurol Plaza B Blok, Kat: 18<br/>
                        34398 Sarıyer/İstanbul<br/>
                        <strong>Tel:</strong> +90 212 345 67 89<br/>
                        <strong>E-posta:</strong> turkiye@cryptoarb.sc
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sosyal Medya */}
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <h3 className="text-white font-medium mb-4">Sosyal Medya</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://twitter.com/flashusdt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                  <a
                    href="https://discord.gg/flashusdt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white hover:bg-indigo-600 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                  <a
                    href="https://t.me/flashusdt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white hover:bg-cyan-600 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* İletişim Formu */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Mesaj Gönderin</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      placeholder="Adınızı girin"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Konu *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="Mesajınızın konusu"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={6}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                    placeholder="Mesajınızı detaylı olarak yazın..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Mesaj Gönder</span>
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <strong>Yanıt Süresi:</strong> Mesajlarınız genellikle 24 saat içinde yanıtlanır. 
                  Acil durumlar için Discord veya Telegram kanallarımızı kullanın. Türkiye saati ile 
                  09:00-18:00 arası canlı destek mevcuttur.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* E-posta Destek Formu Modal */}
        {showEmailForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-black/90 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">E-posta Desteği</h3>
                    <p className="text-gray-400 text-sm">Detaylı sorularınız için form doldurun</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmailForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ad Soyad *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={emailFormData.name}
                        onChange={(e) => setEmailFormData({...emailFormData, name: e.target.value})}
                        className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                        placeholder="Adınızı girin"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      E-posta *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={emailFormData.email}
                        onChange={(e) => setEmailFormData({...emailFormData, email: e.target.value})}
                        className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Öncelik Seviyesi
                  </label>
                  <select
                    value={emailFormData.priority}
                    onChange={(e) => setEmailFormData({...emailFormData, priority: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="low">Düşük - Genel sorular</option>
                    <option value="normal">Normal - Standart destek</option>
                    <option value="high">Yüksek - Acil olmayan sorunlar</option>
                    <option value="urgent">Acil - Kritik sorunlar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Konu *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={emailFormData.subject}
                      onChange={(e) => setEmailFormData({...emailFormData, subject: e.target.value})}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      placeholder="Sorununuzun kısa açıklaması"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Detaylı Açıklama *
                  </label>
                  <textarea
                    value={emailFormData.message}
                    onChange={(e) => setEmailFormData({...emailFormData, message: e.target.value})}
                    rows={6}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                    placeholder="Sorununuzu detaylı olarak açıklayın. Hata mesajları, adımlar ve ekran görüntüleri varsa belirtin..."
                    required
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-2">💡 Daha Hızlı Yanıt İçin İpuçları</h4>
                  <ul className="text-blue-300 text-sm space-y-1">
                    <li>• Sorununuzu mümkün olduğunca detaylı açıklayın</li>
                    <li>• Hata mesajları varsa tam olarak kopyalayın</li>
                    <li>• Hangi cüzdanı kullandığınızı belirtin</li>
                    <li>• İşlem hash'i varsa ekleyin</li>
                    <li>• Ekran görüntüleri varsa e-postaya ekleyin</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>E-posta Gönder</span>
                  </button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="text-green-400 font-medium mb-1">E-posta Desteği Bilgileri</h4>
                    <ul className="text-green-300 text-sm space-y-1">
                      <li>• <strong>Yanıt Süresi:</strong> Normal: 24 saat, Acil: 4 saat</li>
                      <li>• <strong>Çalışma Saatleri:</strong> 7/24 otomatik sistem, 09:00-18:00 UTC canlı destek</li>
                      <li>• <strong>Diller:</strong> Türkçe, İngilizce</li>
                      <li>• <strong>E-posta:</strong> support@flashusdt.com</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sık Sorulan Sorular Linki */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Hızlı Yanıt Arıyorsanız
            </h3>
            <p className="text-gray-300 mb-6">
              Çoğu sorunun yanıtını Yardım Merkezi'mizde bulabilirsiniz
            </p>
            <a
              href="#help"
              onClick={() => { window.location.hash = 'help'; window.scrollTo(0, 0); }}
              className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Yardım Merkezi'ne Git
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;