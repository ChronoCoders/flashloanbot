const { ethers } = require('hardhat');
const fs = require('fs');

async function main() {
    console.log("🚀 Flash USDT Likidite Bot Mainnet'e Deploy Ediliyor...");
    
    // Deployer hesabını al
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploy Eden Hesap:", deployer.address);
    
    // Hesap bakiyesini kontrol et
    const balance = await deployer.getBalance();
    console.log("💰 Hesap Bakiyesi:", ethers.utils.formatEther(balance), "ETH");
    
    if (balance.lt(ethers.utils.parseEther("0.1"))) {
        throw new Error("❌ Yetersiz ETH bakiyesi! En az 0.1 ETH gerekli.");
    }
    
    // Uniswap V2 Router adresi (Mainnet)
    const UNISWAP_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    
    console.log("📋 Contract parametreleri:");
    console.log("- Uniswap Router:", UNISWAP_ROUTER);
    console.log("- Token Adı: Flash USDT Likidite Bot Token");
    console.log("- Token Sembolü: FULT");
    console.log("- Toplam Arz: 1,000,000,000 FULT");
    
    // Contract'ı deploy et
    const FlashUSDTLikiditeBot = await ethers.getContractFactory("FlashUSDTLikiditeBot");
    
    console.log("⏳ Contract deploy ediliyor...");
    const contract = await FlashUSDTLikiditeBot.deploy(UNISWAP_ROUTER, {
        gasLimit: 3000000, // Gas limit
        gasPrice: ethers.utils.parseUnits('20', 'gwei') // 20 Gwei
    });
    
    console.log("⏳ Transaction onayı bekleniyor...");
    await contract.deployed();
    
    console.log("✅ Contract başarıyla deploy edildi!");
    console.log("📍 Contract Adresi:", contract.address);
    console.log("🔗 Etherscan:", `https://etherscan.io/address/${contract.address}`);
    
    // Deploy bilgilerini kaydet
    const deployInfo = {
        contractAddress: contract.address,
        deployerAddress: deployer.address,
        transactionHash: contract.deployTransaction.hash,
        blockNumber: contract.deployTransaction.blockNumber,
        gasUsed: contract.deployTransaction.gasLimit.toString(),
        gasPrice: contract.deployTransaction.gasPrice.toString(),
        deployTime: new Date().toISOString(),
        network: "mainnet",
        uniswapRouter: UNISWAP_ROUTER
    };
    
    // JSON dosyasına kaydet
    fs.writeFileSync(
        'deployment/mainnet-deployment.json',
        JSON.stringify(deployInfo, null, 2)
    );
    
    console.log("💾 Deploy bilgileri kaydedildi: deployment/mainnet-deployment.json");
    
    // Contract'ı verify et (Etherscan)
    console.log("🔍 Contract verification için komut:");
    console.log(`npx hardhat verify --network mainnet ${contract.address} "${UNISWAP_ROUTER}"`);
    
    // İlk setup işlemleri
    console.log("⚙️ İlk setup işlemleri yapılıyor...");
    
    try {
        // USDT havuzunu ekle
        const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
        await contract.likiditeHavuzuEkle(usdtAddress, "Tether USD");
        console.log("✅ USDT havuzu eklendi");
        
        // USDC havuzunu ekle
        const usdcAddress = "0xA0b86a33E6441b8C4505B4afDcA7FBf074d9c0b1";
        await contract.likiditeHavuzuEkle(usdcAddress, "USD Coin");
        console.log("✅ USDC havuzu eklendi");
        
        // DAI havuzunu ekle
        const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
        await contract.likiditeHavuzuEkle(daiAddress, "Dai Stablecoin");
        console.log("✅ DAI havuzu eklendi");
        
    } catch (error) {
        console.log("⚠️ Setup işlemlerinde hata:", error.message);
    }
    
    console.log("\n🎉 DEPLOY TAMAMLANDI!");
    console.log("📋 Sonraki Adımlar:");
    console.log("1. Contract'ı Etherscan'de verify edin");
    console.log("2. Frontend'i contract adresine bağlayın");
    console.log("3. Liquidity pool'ları test edin");
    console.log("4. Marketing ve lansmanı başlatın");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deploy hatası:", error);
        process.exit(1);
    });