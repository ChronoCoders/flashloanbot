# 🧪 Sepolia Test Senaryoları

## 🎯 Kapsamlı Test Planı

### 1. 📋 Temel Contract Testleri

#### A. Deploy Sonrası Kontroller
```javascript
// Contract'ın doğru deploy edildiğini kontrol et
const contract = await ethers.getContractAt("FlashUSDTLikiditeBot", CONTRACT_ADDRESS);

// Token bilgilerini kontrol et
const name = await contract.name();
const symbol = await contract.symbol();
const totalSupply = await contract.totalSupply();

console.log("Token Adı:", name);
console.log("Token Sembolü:", symbol);
console.log("Toplam Arz:", ethers.utils.formatEther(totalSupply));
```

#### B. Bot İstatistikleri Testi
```javascript
// Bot istatistiklerini al
const stats = await contract.botIstatistikleri();
console.log("Toplam Kar:", ethers.utils.formatEther(stats._toplamKar));
console.log("Toplam İşlem:", stats._toplamIslem.toString());
console.log("Toplam Yatırımcı:", stats._toplamYatirimci.toString());
```

### 2. 💰 Yatırım Fonksiyonu Testleri

#### A. Küçük Yatırım Testi (0.01 ETH)
```javascript
// Test yatırımı yap
const investmentAmount = ethers.utils.parseEther("0.01");
const tx = await contract.yatirimYap({ value: investmentAmount });
await tx.wait();

console.log("✅ 0.01 ETH yatırım başarılı");
```

#### B. Orta Yatırım Testi (0.1 ETH)
```javascript
const investmentAmount = ethers.utils.parseEther("0.1");
const tx = await contract.yatirimYap({ value: investmentAmount });
await tx.wait();

console.log("✅ 0.1 ETH yatırım başarılı");
```

#### C. Yatırımcı Bilgileri Kontrolü
```javascript
const [deployer] = await ethers.getSigners();
const investorInfo = await contract.yatirimciBilgileri(deployer.address);

console.log("Yatırım:", ethers.utils.formatEther(investorInfo.yatirim));
console.log("Kar:", ethers.utils.formatEther(investorInfo.kar));
```

### 3. 🔄 Arbitraj Sistemi Testleri

#### A. USDT Arbitraj Testi
```javascript
// USDT havuzunu ekle (sadece owner)
const usdtAddress = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06"; // Sepolia USDT
await contract.likiditeHavuzuEkle(usdtAddress, "Tether USD");

// Arbitraj işlemi test et
const arbitrageAmount = ethers.utils.parseEther("0.01");
const tx = await contract.likiditeArbitrajYap(usdtAddress, arbitrageAmount);
await tx.wait();

console.log("✅ USDT arbitraj testi başarılı");
```

#### B. Çoklu Token Arbitraj Testi
```javascript
// Birden fazla token için arbitraj test et
const tokens = [
  { address: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06", name: "Tether USD" },
  { address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8", name: "USD Coin" },
  { address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357", name: "Dai Stablecoin" }
];

for (const token of tokens) {
  await contract.likiditeHavuzuEkle(token.address, token.name);
  await contract.likiditeArbitrajYap(token.address, ethers.utils.parseEther("0.005"));
  console.log(`✅ ${token.name} arbitraj testi başarılı`);
}
```

### 4. 💸 Kar Dağıtım Testleri

#### A. Kar Dağıtımı Sonrası Kontrol
```javascript
// Arbitraj sonrası yatırımcı karını kontrol et
const investorInfo = await contract.yatirimciBilgileri(deployer.address);
const profit = parseFloat(ethers.utils.formatEther(investorInfo.kar));

if (profit > 0) {
  console.log("✅ Kar dağıtımı başarılı:", profit, "ETH");
} else {
  console.log("❌ Kar dağıtımı başarısız");
}
```

#### B. Kar Çekme Testi
```javascript
// Kar çekme işlemi test et
const balanceBefore = await ethers.provider.getBalance(deployer.address);
const tx = await contract.karCek();
await tx.wait();
const balanceAfter = await ethers.provider.getBalance(deployer.address);

const difference = balanceAfter.sub(balanceBefore);
console.log("Çekilen kar:", ethers.utils.formatEther(difference), "ETH");
```

### 5. 🛡️ Güvenlik Testleri

#### A. Pausable Test
```javascript
// Contract'ı durdur
await contract.botDurdur();
console.log("✅ Bot durduruldu");

// Durdurulmuş durumda yatırım yapmaya çalış (başarısız olmalı)
try {
  await contract.yatirimYap({ value: ethers.utils.parseEther("0.01") });
  console.log("❌ Güvenlik testi başarısız - durdurulmuş bot yatırım kabul etti");
} catch (error) {
  console.log("✅ Güvenlik testi başarılı - durdurulmuş bot yatırım kabul etmedi");
}

// Bot'u yeniden başlat
await contract.botBaslat();
console.log("✅ Bot yeniden başlatıldı");
```

#### B. Reentrancy Test
```javascript
// Reentrancy saldırısı simülasyonu
// (Bu test sadece güvenlik kontrolü için)
try {
  // Aynı anda birden fazla kar çekme denemesi
  const promises = [
    contract.karCek(),
    contract.karCek(),
    contract.karCek()
  ];
  
  await Promise.all(promises);
  console.log("❌ Reentrancy koruması başarısız");
} catch (error) {
  console.log("✅ Reentrancy koruması başarılı");
}
```

### 6. 📊 Performance Testleri

#### A. Gas Kullanım Testi
```javascript
// Farklı işlemler için gas kullanımını ölç
const operations = [
  { name: "Yatırım", func: () => contract.yatirimYap({ value: ethers.utils.parseEther("0.01") }) },
  { name: "Kar Çekme", func: () => contract.karCek() },
  { name: "İstatistik Okuma", func: () => contract.botIstatistikleri() }
];

for (const op of operations) {
  const tx = await op.func();
  if (tx.wait) {
    const receipt = await tx.wait();
    console.log(`${op.name} Gas Kullanımı:`, receipt.gasUsed.toString());
  }
}
```

#### B. Çoklu Kullanıcı Testi
```javascript
// Birden fazla hesaptan yatırım simülasyonu
const accounts = await ethers.getSigners();

for (let i = 1; i < Math.min(5, accounts.length); i++) {
  const userContract = contract.connect(accounts[i]);
  await userContract.yatirimYap({ value: ethers.utils.parseEther("0.01") });
  console.log(`✅ Kullanıcı ${i} yatırım yaptı`);
}

// Toplam yatırımcı sayısını kontrol et
const stats = await contract.botIstatistikleri();
console.log("Toplam Yatırımcı:", stats._toplamYatirimci.toString());
```

### 7. 🔍 Event Testleri

#### A. Event Listener Kurulumu
```javascript
// Contract event'lerini dinle
contract.on("YatirimAlindi", (yatirimci, miktar, event) => {
  console.log("🎉 Yeni Yatırım:", {
    yatirimci,
    miktar: ethers.utils.formatEther(miktar),
    blockNumber: event.blockNumber
  });
});

contract.on("KarUretildi", (miktar, token, zaman, event) => {
  console.log("💰 Kar Üretildi:", {
    miktar: ethers.utils.formatEther(miktar),
    token,
    zaman: new Date(zaman * 1000).toLocaleString()
  });
});
```

### 8. 🌐 Frontend Entegrasyon Testleri

#### A. Web3 Bağlantı Testi
```javascript
// Frontend'den contract'a bağlanma testi
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

// Kullanıcı bilgilerini al
const address = await signer.getAddress();
const balance = await provider.getBalance(address);
const investorInfo = await contract.yatirimciBilgileri(address);

console.log("Kullanıcı Adresi:", address);
console.log("ETH Bakiyesi:", ethers.utils.formatEther(balance));
console.log("Yatırım Miktarı:", ethers.utils.formatEther(investorInfo.yatirim));
```

## 📋 Test Checklist

### ✅ Temel Fonksiyonlar
- [ ] Contract deploy edildi
- [ ] Token bilgileri doğru
- [ ] Bot istatistikleri çalışıyor
- [ ] Yatırım fonksiyonu çalışıyor
- [ ] Kar çekme fonksiyonu çalışıyor

### ✅ Arbitraj Sistemi
- [ ] Likidite havuzu ekleme çalışıyor
- [ ] Arbitraj işlemi çalışıyor
- [ ] Kar hesaplama doğru
- [ ] Kar dağıtımı çalışıyor

### ✅ Güvenlik
- [ ] Pausable fonksiyonu çalışıyor
- [ ] Reentrancy koruması aktif
- [ ] Owner kontrolü çalışıyor
- [ ] Input validasyonu çalışıyor

### ✅ Performance
- [ ] Gas kullanımı makul
- [ ] Çoklu kullanıcı desteği
- [ ] Event'ler doğru çalışıyor
- [ ] Frontend entegrasyonu başarılı

## 🚀 Test Komutları

```bash
# Tüm testleri çalıştır
npm run test

# Sepolia'da manuel test
npx hardhat console --network sepolia

# Gas raporu al
npm run test -- --reporter gas

# Coverage raporu
npm run coverage
```

---

**🎯 Test Hedefi:** %100 fonksiyon coverage ve sıfır kritik hata
**⏱️ Test Süresi:** Yaklaşık 30-45 dakika
**💰 Test Maliyeti:** ~0.1 Sepolia ETH