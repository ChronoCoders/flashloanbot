# 🚀 Mainnet Deploy Rehberi

## 📋 Ön Hazırlık

### 1. Gerekli Hesaplar ve API Keys

#### 🔑 Infura Hesabı
1. [Infura.io](https://infura.io) hesabı oluşturun
2. Yeni proje oluşturun
3. Project ID'yi kopyalayın

#### 🔍 Etherscan API Key
1. [Etherscan.io](https://etherscan.io) hesabı oluşturun
2. API Keys bölümünden yeni key oluşturun
3. API key'i kopyalayın

#### 💰 Deploy Cüzdanı
1. MetaMask'ta yeni cüzdan oluşturun (güvenlik için)
2. Private key'i export edin
3. **EN AZ 0.15 ETH** yükleyin (gas fees için)

### 2. Environment Setup

```bash
# .env dosyası oluşturun
cp .env.example .env

# Gerekli bilgileri doldurun:
PRIVATE_KEY=your_private_key_here
INFURA_PROJECT_ID=your_infura_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 🛠️ Deploy İşlemi

### 1. Dependencies Kurulumu
```bash
npm install
```

### 2. Contract Compile
```bash
npm run compile
```

### 3. Testnet'te Test (Önerilen)
```bash
# Sepolia testnet'e deploy
npm run deploy:sepolia
```

### 4. Mainnet Deploy
```bash
# ⚠️ DİKKAT: Bu gerçek para harcar!
npm run deploy:mainnet
```

## 📊 Deploy Maliyeti Tahmini

| Network | Gas Price | Tahmini Maliyet |
|---------|-----------|-----------------|
| Ethereum Mainnet | 20 Gwei | ~0.06-0.1 ETH |
| Polygon | 30 Gwei | ~$2-5 |
| BSC | 5 Gwei | ~$1-3 |

## ✅ Deploy Sonrası Kontroller

### 1. Contract Verification
```bash
# Etherscan'de verify et
npx hardhat verify --network mainnet CONTRACT_ADDRESS "UNISWAP_ROUTER_ADDRESS"
```

### 2. Contract Test
```bash
# Contract fonksiyonlarını test et
npx hardhat console --network mainnet
```

### 3. Frontend Bağlantısı
```javascript
// src/config/contracts.js
export const CONTRACT_ADDRESS = "0x..."; // Deploy edilen adres
export const CONTRACT_ABI = [...]; // Contract ABI
```

## 🔐 Güvenlik Kontrolleri

### ✅ Kontrol Listesi
- [ ] Private key güvenli mi?
- [ ] Contract verified mi?
- [ ] Owner adresi doğru mu?
- [ ] Initial setup tamamlandı mı?
- [ ] Test işlemleri başarılı mı?

### 🚨 Güvenlik Uyarıları
- Private key'i ASLA paylaşmayın
- Deploy cüzdanını sadece deploy için kullanın
- Contract ownership'i güvenli cüzdana transfer edin
- Multi-sig wallet kullanmayı düşünün

## 📈 Lansmanı Hazırlık

### 1. Marketing Materyalleri
- [ ] Website hazır
- [ ] Whitepaper tamamlandı
- [ ] Social media hesapları
- [ ] Community kanalları

### 2. Likidite Hazırlığı
- [ ] DEX listing için token rezervi
- [ ] Initial liquidity hazır
- [ ] Price discovery stratejisi

### 3. Legal Compliance
- [ ] Legal inceleme tamamlandı
- [ ] Regulatory compliance
- [ ] Terms of service

## 🎯 Deploy Sonrası Adımlar

### 1. İlk Konfigürasyon
```javascript
// Contract'a ilk token'ları ekle
await contract.likiditeHavuzuEkle(USDT_ADDRESS, "Tether USD");
await contract.likiditeHavuzuEkle(USDC_ADDRESS, "USD Coin");
await contract.likiditeHavuzuEkle(DAI_ADDRESS, "Dai Stablecoin");
```

### 2. Monitoring Setup
- Contract events monitoring
- Gas price tracking
- Performance metrics
- Error logging

### 3. Community Launch
- Announcement posts
- Demo video
- Tutorial content
- Community engagement

## 🆘 Sorun Giderme

### Deploy Hataları
```bash
# Gas limit yetersiz
Error: Transaction ran out of gas
# Çözüm: Gas limit artırın

# Insufficient funds
Error: Insufficient funds for gas
# Çözüm: Daha fazla ETH ekleyin

# Nonce too low
Error: Nonce too low
# Çözüm: Hardhat cache temizleyin
```

### Verification Hataları
```bash
# Constructor arguments mismatch
# Çözüm: Constructor parametrelerini kontrol edin

# Source code mismatch
# Çözüm: Exact compiler version kullanın
```

## 📞 Destek

Deploy sırasında sorun yaşarsanız:
1. Hardhat documentation kontrol edin
2. Etherscan support ile iletişime geçin
3. Community forumlarından yardım alın

---

**⚠️ UYARI:** Mainnet deploy gerçek para harcar. Test işlemlerini mutlaka testnet'te yapın!