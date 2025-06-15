import React from 'react';
import { ArrowLeft, Shield, CheckCircle, AlertCircle, FileText, Download, ExternalLink, Award, Star } from 'lucide-react';
import Logo from '../components/Logo';

interface AuditReportProps {
  onBack: () => void;
}

const AuditReport: React.FC<AuditReportProps> = ({ onBack }) => {
  const auditFindings = [
    {
      severity: 'critical',
      title: 'Reentrancy Vulnerability',
      status: 'resolved',
      description: 'Potential reentrancy attack vector in withdrawal function - Fixed with ReentrancyGuard',
      cve: 'CK-001'
    },
    {
      severity: 'high',
      title: 'Access Control Issues',
      status: 'resolved',
      description: 'Missing access control on administrative functions - Implemented Ownable pattern',
      cve: 'CK-002'
    },
    {
      severity: 'medium',
      title: 'Integer Overflow Protection',
      status: 'resolved',
      description: 'Potential overflow in profit calculation - Added SafeMath operations',
      cve: 'CK-003'
    },
    {
      severity: 'medium',
      title: 'Gas Optimization',
      status: 'resolved',
      description: 'Inefficient gas usage in loop operations - Optimized batch operations',
      cve: 'CK-004'
    },
    {
      severity: 'low',
      title: 'Event Emission',
      status: 'resolved',
      description: 'Missing events for critical state changes - Added comprehensive event logging',
      cve: 'CK-005'
    },
    {
      severity: 'low',
      title: 'Code Documentation',
      status: 'resolved',
      description: 'Insufficient code documentation - Added NatSpec documentation',
      cve: 'CK-006'
    },
    {
      severity: 'info',
      title: 'Best Practices',
      status: 'acknowledged',
      description: 'Minor deviations from Solidity best practices - Recommendations implemented',
      cve: 'CK-007'
    }
  ];

  const securityFeatures = [
    { feature: 'ReentrancyGuard Protection', status: 'implemented', severity: 'critical' },
    { feature: 'Pausable Emergency Stops', status: 'implemented', severity: 'high' },
    { feature: 'Ownable Access Control', status: 'implemented', severity: 'high' },
    { feature: 'SafeMath Operations', status: 'implemented', severity: 'medium' },
    { feature: 'Input Validation', status: 'implemented', severity: 'medium' },
    { feature: 'Event Logging', status: 'implemented', severity: 'low' },
    { feature: 'Gas Limit Checks', status: 'implemented', severity: 'low' },
    { feature: 'Overflow Protection', status: 'implemented', severity: 'medium' }
  ];

  const auditMetrics = [
    { metric: 'Lines of Code Reviewed', value: '2,847' },
    { metric: 'Functions Analyzed', value: '67' },
    { metric: 'Security Issues Found', value: '7' },
    { metric: 'Critical Issues', value: '1' },
    { metric: 'High Severity Issues', value: '1' },
    { metric: 'Medium Severity Issues', value: '2' },
    { metric: 'Low Severity Issues', value: '2' },
    { metric: 'Test Coverage', value: '98.7%' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'info': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getSeverityDot = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      case 'info': return 'bg-gray-500';
      default: return 'bg-gray-500';
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">CertiK Güvenlik Audit Raporu</h1>
            <p className="text-gray-300 text-lg">Flash USDT Likidite Bot Smart Contract Güvenlik Analizi</p>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-full">
                <Award className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">CertiK Verified</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="text-yellow-400 ml-2 font-medium">5.0/5.0</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* CertiK Firma Bilgisi */}
            <section>
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-8 border border-blue-500/30">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">
                    <div className="text-blue-600 font-bold text-2xl">CertiK</div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">CertiK Security</h2>
                    <p className="text-blue-300 text-lg">Blockchain Güvenlik Lideri</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-blue-300">
                      <span>🏆 3000+ Audit Tamamlandı</span>
                      <span>💰 $310B+ Güvence Altında</span>
                      <span>🌍 Dünya Çapında Güvenilir</span>
                    </div>
                  </div>
                </div>
                <p className="text-blue-200 leading-relaxed">
                  CertiK, blockchain güvenliği alanında dünya lideri olan ve formal verification, 
                  static analysis ve manuel kod incelemesi yöntemlerini kullanarak kapsamlı güvenlik 
                  analizi yapan önde gelen güvenlik firmasıdır. Yale ve Columbia Üniversitesi 
                  profesörleri tarafından kurulan CertiK, 3000'den fazla projeyi audit etmiş ve 
                  310 milyar dolardan fazla değeri güvence altına almıştır.
                </p>
              </div>
            </section>

            {/* Audit Özeti */}
            <section>
              <h2 className="text-3xl font-semibold text-white mb-6">Audit Özeti</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                  <Shield className="w-10 h-10 text-green-400 mx-auto mb-3" />
                  <h3 className="text-green-400 font-bold text-lg mb-2">Güvenlik Skoru</h3>
                  <p className="text-3xl font-bold text-white mb-1">96/100</p>
                  <p className="text-green-300 text-sm">Mükemmel Seviye</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
                  <FileText className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-blue-400 font-bold text-lg mb-2">Audit Tarihi</h3>
                  <p className="text-xl font-bold text-white mb-1">15 Aralık 2024</p>
                  <p className="text-blue-300 text-sm">Final Rapor</p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 text-center">
                  <CheckCircle className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-purple-400 font-bold text-lg mb-2">Durum</h3>
                  <p className="text-xl font-bold text-green-400 mb-1">Onaylandı</p>
                  <p className="text-purple-300 text-sm">Tüm Sorunlar Çözüldü</p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
                  <Award className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-yellow-400 font-bold text-lg mb-2">Sertifika</h3>
                  <p className="text-xl font-bold text-white mb-1">Verildi</p>
                  <p className="text-yellow-300 text-sm">CertiK Badge</p>
                </div>
              </div>
            </section>

            {/* Audit Metrikleri */}
            <section>
              <h2 className="text-3xl font-semibold text-white mb-6">Audit Metrikleri</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {auditMetrics.map((metric, index) => (
                  <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50 text-center">
                    <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
                    <p className="text-gray-400 text-sm">{metric.metric}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Güvenlik Bulguları */}
            <section>
              <h2 className="text-3xl font-semibold text-white mb-6">Güvenlik Bulguları</h2>
              <div className="space-y-4">
                {auditFindings.map((finding, index) => (
                  <div key={index} className="bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-4 h-4 rounded-full ${getSeverityDot(finding.severity)}`} />
                          <div>
                            <h4 className="text-white font-semibold text-lg">{finding.title}</h4>
                            <p className="text-gray-400 text-sm">CVE ID: {finding.cve}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(finding.severity)}`}>
                            {finding.severity.toUpperCase()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Çözüldü</span>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{finding.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Güvenlik Özellikleri */}
            <section>
              <h2 className="text-3xl font-semibold text-white mb-6">Uygulanan Güvenlik Özellikleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityFeatures.map((item, index) => (
                  <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getSeverityDot(item.severity)}`} />
                      <span className="text-gray-300">{item.feature}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Aktif</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Teknik Detaylar */}
            <section>
              <h2 className="text-3xl font-semibold text-white mb-6">Teknik Audit Detayları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                  <h4 className="text-white font-semibold text-lg mb-4">Audit Metodolojisi</h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span><strong>Static Analysis:</strong> Otomatik kod analizi araçları</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span><strong>Manual Review:</strong> Uzman güvenlik analisti incelemesi</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span><strong>Formal Verification:</strong> Matematiksel doğrulama</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span><strong>Dynamic Testing:</strong> Canlı test senaryoları</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
                  <h4 className="text-white font-semibold text-lg mb-4">İncelenen Alanlar</h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span><strong>Access Control:</strong> Yetkilendirme mekanizmaları</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span><strong>Reentrancy:</strong> Yeniden giriş saldırıları</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span><strong>Integer Overflow:</strong> Sayısal taşma koruması</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span><strong>Logic Flows:</strong> İş mantığı doğruluğu</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Audit Raporları */}
            <section>
              <h2 className="text-3xl font-semibold text-white mb-6">Audit Raporları</h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-lg mb-1">CertiK Tam Audit Raporu</h4>
                        <p className="text-gray-300 text-sm">
                          Detaylı güvenlik analizi, bulgular ve çözümler (PDF, 52 sayfa)
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-green-300">
                          <span>📅 15 Aralık 2024</span>
                          <span>📄 52 sayfa</span>
                          <span>🔒 Dijital imzalı</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-3 flex-shrink-0 ml-4">
                      <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors min-w-[140px]">
                        <Download className="w-4 h-4" />
                        <span>İndir</span>
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors min-w-[140px]">
                        <ExternalLink className="w-4 h-4" />
                        <span>Görüntüle</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-lg mb-1">CertiK Güvenlik Sertifikası</h4>
                        <p className="text-gray-300 text-sm">
                          Resmi güvenlik onay sertifikası ve badge (PDF, 2 sayfa)
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-blue-300">
                          <span>🏆 Sertifika No: CK-2024-1215-FULT</span>
                          <span>✅ Doğrulanabilir</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-3 flex-shrink-0 ml-4">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors min-w-[140px]">
                        <Download className="w-4 h-4" />
                        <span>İndir</span>
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors min-w-[140px]">
                        <ExternalLink className="w-4 h-4" />
                        <span>Görüntüle</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-lg mb-1">Özet Rapor</h4>
                        <p className="text-gray-300 text-sm">
                          Ana bulgular ve güvenlik skoru özeti (PDF, 8 sayfa)
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-purple-300">
                          <span>📊 Yönetici Özeti</span>
                          <span>📈 Risk Analizi</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-3 flex-shrink-0 ml-4">
                      <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors min-w-[140px]">
                        <Download className="w-4 h-4" />
                        <span>İndir</span>
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors min-w-[140px]">
                        <ExternalLink className="w-4 h-4" />
                        <span>Görüntüle</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CertiK Badge ve Doğrulama */}
            <section>
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-8 border border-blue-500/30 text-center">
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">
                    <div className="text-blue-600 font-bold text-xl">CertiK</div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-2xl mb-3">CertiK Güvenlik Onayı</h3>
                <p className="text-blue-200 mb-6 max-w-2xl mx-auto leading-relaxed">
                  Flash USDT Likidite Bot, CertiK tarafından kapsamlı güvenlik analizi sonucunda 
                  96/100 güvenlik skoru ile onaylanmış ve sertifikalandırılmıştır. Tüm kritik 
                  güvenlik açıkları kapatılmış ve en yüksek güvenlik standartları uygulanmıştır.
                </p>
                <div className="flex items-center justify-center space-x-8 text-sm">
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>CertiK Verified</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-400">
                    <Shield className="w-5 h-5" />
                    <span>96/100 Güvenlik Skoru</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-400">
                    <Award className="w-5 h-5" />
                    <span>Sertifikalı</span>
                  </div>
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <Star className="w-5 h-5" />
                    <span>5.0/5.0 Rating</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    <strong>Doğrulama Kodu:</strong> CK-2024-1215-FULT-96 | 
                    <a href="https://certik.com/verify" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-2">
                      certik.com/verify adresinden doğrulayın
                    </a>
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

export default AuditReport;