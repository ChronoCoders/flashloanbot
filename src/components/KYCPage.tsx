import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Shield, 
  User, 
  FileText, 
  Camera, 
  CheckCircle, 
  AlertTriangle,
  Upload,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';
import toast from 'react-hot-toast';

interface KYCPageProps {
  onBack: () => void;
  onComplete: (kycData: any) => void;
}

interface KYCFormData {
  // Kişisel Bilgiler
  firstName: string;
  lastName: string;
  tcKimlik: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  
  // İletişim Bilgileri
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  
  // Finansal Bilgiler
  occupation: string;
  monthlyIncome: string;
  sourceOfFunds: string;
  investmentExperience: string;
  
  // Belgeler
  identityDocument: File | null;
  addressDocument: File | null;
  incomeDocument: File | null;
  
  // Onaylar
  kvkConsent: boolean;
  termsAccepted: boolean;
  riskDisclosure: boolean;
  fatcaDeclaration: boolean;
}

const KYCPage: React.FC<KYCPageProps> = ({ onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<KYCFormData>({
    firstName: '',
    lastName: '',
    tcKimlik: '',
    birthDate: '',
    birthPlace: '',
    nationality: 'Türkiye',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Türkiye',
    occupation: '',
    monthlyIncome: '',
    sourceOfFunds: '',
    investmentExperience: '',
    identityDocument: null,
    addressDocument: null,
    incomeDocument: null,
    kvkConsent: false,
    termsAccepted: false,
    riskDisclosure: false,
    fatcaDeclaration: false
  });

  const [showTcKimlik, setShowTcKimlik] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  const steps = [
    { id: 1, title: 'Kişisel Bilgiler', icon: <User className="w-5 h-5" /> },
    { id: 2, title: 'İletişim Bilgileri', icon: <MapPin className="w-5 h-5" /> },
    { id: 3, title: 'Finansal Bilgiler', icon: <CreditCard className="w-5 h-5" /> },
    { id: 4, title: 'Belge Yükleme', icon: <Upload className="w-5 h-5" /> },
    { id: 5, title: 'Onaylar ve KVK', icon: <Shield className="w-5 h-5" /> }
  ];

  const validateTcKimlik = (tc: string): boolean => {
    if (tc.length !== 11) return false;
    if (tc[0] === '0') return false;
    
    const digits = tc.split('').map(Number);
    const sum1 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
    const check1 = (sum1 * 7 - sum2) % 10;
    const check2 = (sum1 + sum2 + digits[9]) % 10;
    
    return check1 === digits[9] && check2 === digits[10];
  };

  const handleFileUpload = (field: keyof KYCFormData, file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Sadece JPG, PNG veya PDF dosyaları kabul edilir');
      return;
    }

    // Simulate upload progress
    setUploadProgress(prev => ({ ...prev, [field]: 0 }));
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = (prev[field] || 0) + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setFormData(prevData => ({ ...prevData, [field]: file }));
          toast.success('Dosya başarıyla yüklendi');
          return { ...prev, [field]: 100 };
        }
        return { ...prev, [field]: newProgress };
      });
    }, 100);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.tcKimlik && 
                 formData.birthDate && formData.birthPlace && validateTcKimlik(formData.tcKimlik));
      case 2:
        return !!(formData.email && formData.phone && formData.address && 
                 formData.city && formData.postalCode);
      case 3:
        return !!(formData.occupation && formData.monthlyIncome && 
                 formData.sourceOfFunds && formData.investmentExperience);
      case 4:
        return !!(formData.identityDocument && formData.addressDocument);
      case 5:
        return !!(formData.kvkConsent && formData.termsAccepted && 
                 formData.riskDisclosure && formData.fatcaDeclaration);
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      toast.error('Lütfen tüm zorunlu alanları doldurun');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(5)) {
      toast.success('KYC başvurunuz başarıyla gönderildi! İnceleme süreci 24-48 saat sürecektir.');
      onComplete(formData);
    } else {
      toast.error('Lütfen tüm onayları verin');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Kişisel Bilgileriniz</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ad *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="Adınız"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Soyad *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="Soyadınız"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                T.C. Kimlik Numarası *
              </label>
              <div className="relative">
                <input
                  type={showTcKimlik ? 'text' : 'password'}
                  value={formData.tcKimlik}
                  onChange={(e) => setFormData({...formData, tcKimlik: e.target.value.replace(/\D/g, '').slice(0, 11)})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="11 haneli T.C. Kimlik Numarası"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowTcKimlik(!showTcKimlik)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showTcKimlik ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.tcKimlik && !validateTcKimlik(formData.tcKimlik) && (
                <p className="text-red-400 text-sm mt-1">Geçersiz T.C. Kimlik Numarası</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Doğum Tarihi *
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Doğum Yeri *
                </label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="Doğum yeriniz"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Uyruk *
              </label>
              <select
                value={formData.nationality}
                onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="Türkiye">Türkiye Cumhuriyeti</option>
                <option value="Diğer">Diğer (Belirtiniz)</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">İletişim Bilgileriniz</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  E-posta Adresi *
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
                  Telefon Numarası *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="+90 5XX XXX XX XX"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Adres *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows={3}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                placeholder="Tam adresinizi yazın"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Şehir *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="Şehir"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Posta Kodu *
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="34000"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ülke *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="Türkiye">Türkiye</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Finansal Bilgileriniz</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meslek *
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="Mesleğiniz"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Aylık Gelir *
                </label>
                <select
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="0-5000">0 - 5.000 TL</option>
                  <option value="5000-10000">5.000 - 10.000 TL</option>
                  <option value="10000-25000">10.000 - 25.000 TL</option>
                  <option value="25000-50000">25.000 - 50.000 TL</option>
                  <option value="50000+">50.000 TL ve üzeri</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fonların Kaynağı *
              </label>
              <select
                value={formData.sourceOfFunds}
                onChange={(e) => setFormData({...formData, sourceOfFunds: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                required
              >
                <option value="">Seçiniz</option>
                <option value="salary">Maaş/Ücret</option>
                <option value="business">İş/Ticaret</option>
                <option value="investment">Yatırım Gelirleri</option>
                <option value="inheritance">Miras</option>
                <option value="savings">Birikimler</option>
                <option value="other">Diğer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Yatırım Deneyimi *
              </label>
              <select
                value={formData.investmentExperience}
                onChange={(e) => setFormData({...formData, investmentExperience: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                required
              >
                <option value="">Seçiniz</option>
                <option value="beginner">Başlangıç (0-1 yıl)</option>
                <option value="intermediate">Orta (1-3 yıl)</option>
                <option value="advanced">İleri (3-5 yıl)</option>
                <option value="expert">Uzman (5+ yıl)</option>
              </select>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-yellow-400 font-medium mb-1">Önemli Bilgilendirme</h4>
                  <p className="text-yellow-300 text-sm">
                    Bu bilgiler MASAK (Mali Suçları Araştırma Kurulu) mevzuatı gereği 
                    toplanmaktadır ve gizlilik esasları çerçevesinde korunmaktadır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Belge Yükleme</h3>
            
            <div className="space-y-6">
              {/* Kimlik Belgesi */}
              <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-400" />
                  Kimlik Belgesi *
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  T.C. Kimlik Kartı (ön-arka) veya Pasaport (fotoğraflı sayfa)
                </p>
                
                {!formData.identityDocument ? (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Dosyayı sürükleyin veya seçin</p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('identityDocument', e.target.files[0])}
                      className="hidden"
                      id="identity-upload"
                    />
                    <label
                      htmlFor="identity-upload"
                      className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Dosya Seç
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">{formData.identityDocument.name}</span>
                  </div>
                )}
                
                {uploadProgress.identityDocument !== undefined && uploadProgress.identityDocument < 100 && (
                  <div className="mt-4">
                    <div className="bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress.identityDocument}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Adres Belgesi */}
              <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-400" />
                  Adres Belgesi *
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  Son 3 ay içinde alınmış fatura (elektrik, su, gaz, telefon) veya banka ekstresi
                </p>
                
                {!formData.addressDocument ? (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Dosyayı sürükleyin veya seçin</p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('addressDocument', e.target.files[0])}
                      className="hidden"
                      id="address-upload"
                    />
                    <label
                      htmlFor="address-upload"
                      className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Dosya Seç
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">{formData.addressDocument.name}</span>
                  </div>
                )}
              </div>

              {/* Gelir Belgesi (İsteğe Bağlı) */}
              <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-yellow-400" />
                  Gelir Belgesi (İsteğe Bağlı)
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  Maaş bordrosu, SGK hizmet dökümü veya gelir beyannamesi
                </p>
                
                {!formData.incomeDocument ? (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('incomeDocument', e.target.files[0])}
                      className="hidden"
                      id="income-upload"
                    />
                    <label
                      htmlFor="income-upload"
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm"
                    >
                      Dosya Seç
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">{formData.incomeDocument.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-blue-400 font-medium mb-1">Güvenlik Bilgilendirmesi</h4>
                  <ul className="text-blue-300 text-sm space-y-1">
                    <li>• Belgeleriniz 256-bit SSL şifreleme ile korunur</li>
                    <li>• Sadece yetkili personel tarafından incelenir</li>
                    <li>• KVK Kanunu kapsamında işlenir ve saklanır</li>
                    <li>• Maksimum dosya boyutu: 5MB</li>
                    <li>• Kabul edilen formatlar: JPG, PNG, PDF</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Onaylar ve KVK Bildirimi</h3>
            
            <div className="space-y-6">
              {/* KVK Onayı */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
                <h4 className="text-purple-400 font-medium mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Kişisel Verilerin Korunması (KVK) Onayı
                </h4>
                <div className="bg-gray-800/50 rounded-lg p-4 max-h-40 overflow-y-auto text-sm text-gray-300 mb-4">
                  <p className="mb-3">
                    <strong>CryptoArb Technologies Ltd.</strong> olarak, 6698 sayılı Kişisel Verilerin 
                    Korunması Kanunu uyarınca kişisel verilerinizi aşağıdaki amaçlarla işleyeceğiz:
                  </p>
                  <ul className="list-disc list-inside space-y-1 mb-3">
                    <li>Müşteri kimlik doğrulama ve hesap açma işlemleri</li>
                    <li>MASAK mevzuatı gereği AML/KYC yükümlülüklerinin yerine getirilmesi</li>
                    <li>Finansal hizmetlerin sunulması ve risk yönetimi</li>
                    <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                    <li>Müşteri destek hizmetlerinin sağlanması</li>
                  </ul>
                  <p>
                    Verileriniz Seychelles ve Türkiye veri koruma mevzuatı çerçevesinde işlenecek, 
                    üçüncü kişilerle paylaşılmayacak ve yasal saklama süreleri boyunca güvenli 
                    şekilde saklanacaktır.
                  </p>
                </div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.kvkConsent}
                    onChange={(e) => setFormData({...formData, kvkConsent: e.target.checked})}
                    className="mt-1 w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-300 text-sm">
                    Kişisel verilerimin yukarıda belirtilen amaçlarla işlenmesini kabul ediyorum. *
                  </span>
                </label>
              </div>

              {/* Kullanım Şartları */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h4 className="text-blue-400 font-medium mb-4">Kullanım Şartları ve Hizmet Sözleşmesi</h4>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                    className="mt-1 w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300 text-sm">
                    <a href="#terms" className="text-blue-400 hover:text-blue-300">Kullanım Şartları ve Hizmet Sözleşmesi</a>'ni 
                    okudum, anladım ve kabul ediyorum. *
                  </span>
                </label>
              </div>

              {/* Risk Bildirimi */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <h4 className="text-red-400 font-medium mb-4">Risk Bildirimi</h4>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.riskDisclosure}
                    onChange={(e) => setFormData({...formData, riskDisclosure: e.target.checked})}
                    className="mt-1 w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
                  />
                  <span className="text-gray-300 text-sm">
                    <a href="#risk" className="text-red-400 hover:text-red-300">Risk Bildirimi</a>'ni okudum, 
                    kripto para yatırımlarının risklerini anlıyorum ve kabul ediyorum. *
                  </span>
                </label>
              </div>

              {/* FATCA Beyanı */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h4 className="text-green-400 font-medium mb-4">FATCA Beyanı</h4>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.fatcaDeclaration}
                    onChange={(e) => setFormData({...formData, fatcaDeclaration: e.target.checked})}
                    className="mt-1 w-4 h-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                  />
                  <span className="text-gray-300 text-sm">
                    ABD vergi mükellefi olmadığımı ve FATCA kapsamında beyan yükümlülüğüm 
                    bulunmadığını beyan ederim. *
                  </span>
                </label>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-yellow-400 font-medium mb-1">Önemli Bilgilendirme</h4>
                  <p className="text-yellow-300 text-sm">
                    KYC başvurunuz 24-48 saat içinde incelenecektir. Eksik veya hatalı bilgi 
                    durumunda size e-posta ile bilgi verilecektir. Onay sonrası platform 
                    özelliklerine tam erişim sağlayabileceksiniz.
                  </p>
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
              <span>Geri Dön</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">KYC Kimlik Doğrulama</h1>
            <p className="text-gray-300">
              Güvenli yatırım için kimlik doğrulama işlemini tamamlayın
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    currentStep >= step.id 
                      ? 'bg-purple-500 border-purple-500 text-white' 
                      : 'border-gray-600 text-gray-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 transition-colors ${
                      currentStep > step.id ? 'bg-purple-500' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              {steps.map((step) => (
                <span key={step.id} className={`transition-colors ${
                  currentStep >= step.id ? 'text-purple-400' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Önceki
            </button>
            
            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Sonraki
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
              >
                KYC Başvurusunu Gönder
              </button>
            )}
          </div>

          {/* Legal Notice */}
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm text-center">
              Bu form 6698 sayılı Kişisel Verilerin Korunması Kanunu ve MASAK mevzuatı 
              uyarınca hazırlanmıştır. Bilgileriniz güvenli şekilde saklanır ve işlenir.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KYCPage;