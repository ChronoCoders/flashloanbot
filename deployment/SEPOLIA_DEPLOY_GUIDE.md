# 🚀 Sepolia Testnet Deploy Rehberi

## 📋 Sepolia Testnet'e Deploy İçin Hazırlık

### 1. Gerekli Hesaplar ve API Keys

#### 🔑 Infura Hesabı
1. [Infura.io](https://infura.io) hesabı oluşturun
2. Yeni proje oluşturun
3. Project ID'yi kopyalayın
4. **Sepolia endpoint'ini aktif edin**

#### 🔍 Etherscan API Key
1. [Etherscan.io](https://etherscan.io) hesabı oluşturun
2. API Keys bölümünden yeni key oluşturun
3. API key'i kopyalayın

#### 💰 Test Cüzdanı Hazırlığı
1. MetaMask'ta yeni test cüzdanı oluşturun
2. Private key'i export edin
3. **Sepolia test ETH alın** (ücretsiz)

### 2. Sepolia Test ETH Alma

#### Faucet Siteleri:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet)

**Gerekli Miktar:** En az 0.05 ETH (deploy için yeterli)

### 3. Environment Kurulumu

```bash
# .env dosyası oluşturun
cp .env.example .env
```

**.env dosyasını düzenleyin:**
```env
# Sepolia için gerekli bilgiler
PRIVATE_KEY=your_sepolia_test_wallet_private_key
INFURA_PROJECT_ID=your_infura_project_id
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
ETHERSCAN_API_KEY=your_etherscan_api_key

# Frontend için
VITE_SEPOLIA_CONTRACT_ADDRESS=
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
```

## 🛠️ Sepolia Deploy İşlemi

### Adım 1: Dependencies Kurulumu
```bash
npm install
```

### Adım 2: Contract Compile
```bash
npm run compile
```

### Adım 3: Sepolia Network Kontrolü
```bash
# Hardhat console ile network test
npx hardhat console --network sepolia
```

### Adım 4: Sepolia'ya Deploy
```bash
# 🚀 Sepolia testnet'e deploy
npm run deploy:sepolia
```

## 📊 Deploy Sonrası Kontroller

### 1. Deploy Bilgilerini Kontrol Edin
Deploy sonrası `deployment/sepolia-deployment.json` dosyası oluşacak:

```json
{
  "contractAddress": "0x...",
  "deployerAddress": "0x...",
  "transactionHash": "0x...",
  "network": "sepolia",
  "deployTime": "2025-01-XX"
}
```

### 2. Contract Verification
```bash
# Sepolia Etherscan'de verify et
npx hardhat verify --network sepolia CONTRACT_ADDRESS "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
```

### 3. Contract Test İşlemleri
```bash
# Hardhat console ile test
npx hardhat console --network sepolia

# Console'da test komutları:
const contract = await ethers.getContractAt("FlashUSDTLikiditeBot", "CONTRACT_ADDRESS");
const stats = await contract.botIstatistikleri();
console.log("Bot Stats:", stats);
```

## 🎯 Sepolia'da Test Senaryoları

### 1. Yatırım Testi
```javascript
// 0.01 ETH yatırım testi
await contract.yatirimYap({ value: ethers.utils.parseEther("0.01") });
```

### 2. Kar Dağıtım Testi
```javascript
// Sahip olarak kar dağıtımı test et
await contract.likiditeArbitrajYap(USDT_ADDRESS, ethers.utils.parseEther("0.005"));
```

### 3. Kar Çekme Testi
```javascript
// Kar çekme test
await contract.karCek();
```

## 🔧 Frontend'i Sepolia'ya Bağlama

### 1. Contract Adresini Güncelle
`.env` dosyasında:
```env
VITE_SEPOLIA_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
```

### 2. MetaMask'ta Sepolia Network Ekle
- Network Name: Sepolia Test Network
- RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
- Chain ID: 11155111
- Currency Symbol: ETH
- Block Explorer: https://sepolia.etherscan.io

### 3. Frontend'i Başlat
```bash
npm run dev
```

## 📈 Sepolia Test Verileri

### Test Token Adresleri (Sepolia):
- **USDT**: `0x7169D38820dfd117C3FA1f22a697dBA58d90BA06`
- **USDC**: `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8`
- **DAI**: `0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357`
- **WETH**: `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14`

### Uniswap V2 Router (Sepolia):
`0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D`

## 🚨 Sepolia Test Uyarıları

### ✅ Güvenli Test Ortamı
- Sepolia'da gerçek para harcanmaz
- Tüm ETH test ETH'dir
- Hataları güvenle test edebilirsiniz

### ⚠️ Test Sınırlamaları
- Faucet'lerden günlük limit var
- Network bazen yavaş olabilir
- Test token'ları gerçek değeri yok

## 🔍 Sepolia Deploy Sorun Giderme

### Yaygın Hatalar:

#### 1. "Insufficient funds for gas"
```bash
# Çözüm: Daha fazla Sepolia ETH alın
# Faucet'lerden 0.1 ETH alın
```

#### 2. "Network connection error"
```bash
# Çözüm: RPC URL'yi kontrol edin
# Infura project ID'nin doğru olduğundan emin olun
```

#### 3. "Contract verification failed"
```bash
# Çözüm: Constructor parametrelerini kontrol edin
# Compiler version'ın aynı olduğundan emin olun
```

## 📊 Sepolia Deploy Maliyeti

| İşlem | Tahmini Gas | Maliyet (Test ETH) |
|-------|-------------|-------------------|
| Contract Deploy | ~2,500,000 | ~0.025 ETH |
| Initial Setup | ~500,000 | ~0.005 ETH |
| Token Pool Add | ~100,000 | ~0.001 ETH |
| **TOPLAM** | **~3,100,000** | **~0.031 ETH** |

## 🎉 Başarılı Deploy Sonrası

Deploy başarılı olduktan sonra:

1. ✅ Contract adresi kaydedildi
2. ✅ Etherscan'de verify edildi
3. ✅ Frontend bağlantısı hazır
4. ✅ Test işlemleri yapılabilir
5. ✅ Mainnet deploy için hazır

## 📞 Destek

Sepolia deploy sırasında sorun yaşarsanız:
1. Deploy log'larını kontrol edin
2. Etherscan'de transaction'ı inceleyin
3. Gas limit'i artırmayı deneyin
4. RPC endpoint'ini değiştirin

---

**🚀 Sepolia Deploy Komutu:**
```bash
npm run deploy:sepolia
```

**📍 Sepolia Etherscan:** https://sepolia.etherscan.io
**🔗 Sepolia Faucet:** https://sepoliafaucet.com

---

**✅ HAZIR:** Sepolia testnet deploy sistemi tamamen operasyonel!