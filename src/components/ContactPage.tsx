@@ .. @@
               <div className="mt-8 bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
                 <h3 className="text-white font-semibold mb-4">Hızlı Linkler</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
-                  <a href="#api" className="text-purple-400 hover:text-purple-300 transition-colors">
+                  <a href="#api" onClick={() => { window.location.hash = 'api'; window.scrollTo(0, 0); }} className="text-purple-400 hover:text-purple-300 transition-colors">
                     API Dokümantasyonu
                   </a>
-                  <a href="#privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
+                  <a href="#privacy" onClick={() => { window.location.hash = 'privacy'; window.scrollTo(0, 0); }} className="text-purple-400 hover:text-purple-300 transition-colors">
                     Gizlilik Politikası
                   </a>
-                  <a href="#terms" className="text-purple-400 hover:text-purple-300 transition-colors">
+                  <a href="#terms" onClick={() => { window.location.hash = 'terms'; window.scrollTo(0, 0); }} className="text-purple-400 hover:text-purple-300 transition-colors">
                     Kullanım Şartları
                   </a>
-                  <a href="#audit" className="text-purple-400 hover:text-purple-300 transition-colors">
+                  <a href="#audit" onClick={() => { window.location.hash = 'audit'; window.scrollTo(0, 0); }} className="text-purple-400 hover:text-purple-300 transition-colors">
                     Audit Raporu
                   </a>
                 </div>
               </div>