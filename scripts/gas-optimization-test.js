const { ethers } = require("hardhat");

async function main() {
    console.log("🔧 Gas Optimization Test Script");
    
    const [deployer, investor1, investor2] = await ethers.getSigners();
    
    // Deploy contract
    const FlashUSDTLiquidityBot = await ethers.getContractFactory("FlashUSDTLiquidityBot");
    const contract = await FlashUSDTLiquidityBot.deploy(
        "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e", // Mock Aave
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Uniswap
        "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F"  // SushiSwap
    );
    await contract.deployed();
    
    console.log("📍 Contract deployed at:", contract.address);
    
    // Test gas usage for different operations
    const operations = [
        {
            name: "Investment (0.1 ETH)",
            operation: () => contract.connect(investor1).makeInvestment({ 
                value: ethers.utils.parseEther("0.1") 
            })
        },
        {
            name: "Investment (1 ETH)",
            operation: () => contract.connect(investor2).makeInvestment({ 
                value: ethers.utils.parseEther("1") 
            })
        },
        {
            name: "Get Bot Stats",
            operation: () => contract.getBotStats()
        },
        {
            name: "Get Investor Info",
            operation: () => contract.getInvestorInfo(investor1.address)
        },
        {
            name: "Emergency Pause",
            operation: () => contract.emergencyPause()
        },
        {
            name: "Emergency Unpause",
            operation: () => contract.emergencyUnpause()
        }
    ];
    
    console.log("\n📊 Gas Usage Analysis:");
    console.log("=" * 50);
    
    for (const op of operations) {
        try {
            const tx = await op.operation();
            const receipt = await tx.wait();
            
            const gasUsed = receipt.gasUsed.toNumber();
            const gasPrice = tx.gasPrice.toNumber();
            const cost = (gasUsed * gasPrice) / 1e18;
            
            console.log(`${op.name}:`);
            console.log(`  Gas Used: ${gasUsed.toLocaleString()}`);
            console.log(`  Gas Price: ${(gasPrice / 1e9).toFixed(2)} Gwei`);
            console.log(`  Cost: ${cost.toFixed(6)} ETH`);
            
            // Check if gas usage is within acceptable limits
            const limits = {
                "Investment": 200000,
                "Get Bot Stats": 50000,
                "Get Investor Info": 30000,
                "Emergency": 100000
            };
            
            const category = Object.keys(limits).find(key => op.name.includes(key));
            if (category && gasUsed > limits[category]) {
                console.log(`  ⚠️  WARNING: Gas usage exceeds limit (${limits[category]})`);
            } else {
                console.log(`  ✅ Gas usage within acceptable limits`);
            }
            
            console.log("");
            
        } catch (error) {
            console.log(`${op.name}: ❌ Failed - ${error.message}`);
        }
    }
    
    // Test batch operations
    console.log("🔄 Testing Batch Operations:");
    
    const batchSize = 5;
    const startTime = Date.now();
    
    for (let i = 0; i < batchSize; i++) {
        await contract.connect(investor1).makeInvestment({ 
            value: ethers.utils.parseEther("0.01") 
        });
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log(`Batch of ${batchSize} investments completed in ${totalTime}ms`);
    console.log(`Average time per transaction: ${(totalTime / batchSize).toFixed(2)}ms`);
    
    // Final statistics
    const stats = await contract.getBotStats();
    console.log("\n📈 Final Contract Statistics:");
    console.log(`Total Investors: ${stats.totalInvestors}`);
    console.log(`Total Investment: ${ethers.utils.formatEther(stats.totalInvestment)} ETH`);
    console.log(`Emergency Mode: ${stats.emergencyMode}`);
    
    console.log("\n✅ Gas optimization test completed!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });