import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ApiDocs from './pages/ApiDocs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import RiskDisclosure from './pages/RiskDisclosure';
import AuditReport from './pages/AuditReport';
import HelpCenter from './pages/HelpCenter';
import ContactPage from './pages/ContactPage';
import Documentation from './pages/Documentation';
import toast, { Toaster } from 'react-hot-toast';

type AppState = 'landing' | 'auth' | 'dashboard' | 'api' | 'privacy' | 'terms' | 'risk' | 'audit' | 'help' | 'contact' | 'docs';

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('landing');
  const [user, setUser] = useState<any>(null);

  // URL hash değişikliklerini dinle
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (['api', 'privacy', 'terms', 'risk', 'audit', 'help', 'contact', 'docs'].includes(hash)) {
        setCurrentPage(hash as AppState);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // İlk yüklemede kontrol et

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleGetStarted = () => {
    setCurrentPage('auth');
    window.location.hash = '';
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    window.location.hash = '';
  };

  const handleConnect = (method: string) => {
    if (method === 'kyc-completed') {
      // KYC tamamlandıktan sonra dashboard'a yönlendir
      setUser({ 
        address: '0x1234...5678', 
        method: 'kyc-verified',
        balance: '2.5 ETH',
        kycStatus: 'verified'
      });
      setCurrentPage('dashboard');
      
      toast.success('KYC doğrulama tamamlandı! Dashboard\'a yönlendiriliyorsunuz...', {
        duration: 4000,
        position: 'top-right',
      });
    } else {
      // Diğer bağlantı yöntemleri için KYC gerekli uyarısı
      toast.error('Önce KYC doğrulama işlemini tamamlamanız gerekiyor!', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
    window.location.hash = '';
    toast.success('Başarıyla çıkış yapıldı!');
  };

  return (
    <div>
      <Toaster />
      {currentPage === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      {currentPage === 'auth' && (
        <AuthPage 
          onBack={handleBackToLanding} 
          onConnect={handleConnect}
        />
      )}
      {currentPage === 'dashboard' && user && (
        <Dashboard 
          user={user} 
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'api' && (
        <ApiDocs onBack={handleBackToLanding} />
      )}
      {currentPage === 'privacy' && (
        <PrivacyPolicy onBack={handleBackToLanding} />
      )}
      {currentPage === 'terms' && (
        <TermsOfService onBack={handleBackToLanding} />
      )}
      {currentPage === 'risk' && (
        <RiskDisclosure onBack={handleBackToLanding} />
      )}
      {currentPage === 'audit' && (
        <AuditReport onBack={handleBackToLanding} />
      )}
      {currentPage === 'help' && (
        <HelpCenter onBack={handleBackToLanding} />
      )}
      {currentPage === 'contact' && (
        <ContactPage onBack={handleBackToLanding} />
      )}
      {currentPage === 'docs' && (
        <Documentation onBack={handleBackToLanding} />
      )}
    </div>
  );
}

export default App;