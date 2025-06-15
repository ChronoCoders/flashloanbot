const { ethers } = require("hardhat");

async function main() {
    console.log("🧪 Edge Case Security Tests");
    
    const [deployer, investor1, investor2, attacker] = await ethers.getSigners();
    
    // Deploy contract
    const FlashUSDTLiquidityBot = await ethers.getContractFactory("FlashUSDTLiquidityBot");
    const contract = await FlashUSDTLiquidityBot.deploy(
        "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e",
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F"
    );
    await contract.deployed();
    
    console.log("📍 Contract deployed at:", contract.address);
    
    const tests = [
        {
            name: "Zero Investment Attack",
            test: async () => {
                try {
                    await contract.connect(attacker).makeInvestment({ value: 0 });
                    return "❌ FAILED - Zero investment accepted";
                } catch (error) {
                    return "✅ PASSED - Zero investment rejected";
                }
            }
        },
        {
            name: "Maximum Investment Boundary",
            test: async () => {
                try {
                    await contract.connect(investor1).makeInvestment({ 
                        value: ethers.utils.parseEther("100") 
                    });
                    return "✅ PASSED - Maximum investment accepted";
                } catch (error) {
                    return "❌ FAILED - Maximum investment rejected: " + error.message;
                }
            }
        },
        {
            name: "Over Maximum Investment Attack",
            test: async () => {
                try {
                    await contract.connect(attacker).makeInvestment({ 
                        value: ethers.utils.parseEther("101") 
                    });
                    return "❌ FAILED - Over-maximum investment accepted";
                } catch (error) {
                    return "✅ PASSED - Over-maximum investment rejected";
                }
            }
        },
        {
            name: "Minimum Investment Boundary",
            test: async () => {
                try {
                    await contract.connect(investor2).makeInvestment({ 
                        value: ethers.utils.parseEther("0.01") 
                    });
                    return "✅ PASSED - Minimum investment accepted";
                } catch (error) {
                    return "❌ FAILED - Minimum investment rejected: " + error.message;
                }
            }
        },
        {
            name: "Under Minimum Investment Attack",
            test: async () => {
                try {
                    await contract.connect(attacker).makeInvestment({ 
                        value: ethers.utils.parseEther("0.005") 
                    });
                    return "❌ FAILED - Under-minimum investment accepted";
                } catch (error) {
                    return "✅ PASSED - Under-minimum investment rejected";
                }
            }
        },
        {
            name: "Unauthorized Pause Attack",
            test: async () => {
                try {
                    await contract.connect(attacker).emergencyPause();
                    return "❌ FAILED - Unauthorized pause succeeded";
                } catch (error) {
                    return "✅ PASSED - Unauthorized pause rejected";
                }
            }
        },
        {
            name: "Unauthorized Token Addition Attack",
            test: async () => {
                try {
                    await contract.connect(attacker).addSupportedToken(
                        "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                        "Malicious Token",
                        ethers.utils.parseEther("1000"),
                        "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D"
                    );
                    return "❌ FAILED - Unauthorized token addition succeeded";
                } catch (error) {
                    return "✅ PASSED - Unauthorized token addition rejected";
                }
            }
        },
        {
            name: "Invalid Address Token Addition",
            test: async () => {
                try {
                    await contract.addSupportedToken(
                        ethers.constants.AddressZero,
                        "Invalid Token",
                        ethers.utils.parseEther("1000"),
                        "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D"
                    );
                    return "❌ FAILED - Invalid address token accepted";
                } catch (error) {
                    return "✅ PASSED - Invalid address token rejected";
                }
            }
        },
        {
            name: "Invalid Price Feed Addition",
            test: async () => {
                try {
                    await contract.addSupportedToken(
                        "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                        "Test Token",
                        ethers.utils.parseEther("1000"),
                        ethers.constants.AddressZero
                    );
                    return "❌ FAILED - Invalid price feed accepted";
                } catch (error) {
                    return "✅ PASSED - Invalid price feed rejected";
                }
            }
        },
        {
            name: "Profit Withdrawal Without Profit",
            test: async () => {
                try {
                    await contract.connect(investor1).withdrawProfit();
                    return "❌ FAILED - Withdrawal without profit succeeded";
                } catch (error) {
                    return "✅ PASSED - Withdrawal without profit rejected";
                }
            }
        },
        {
            name: "Emergency Withdrawal Without Emergency",
            test: async () => {
                try {
                    await contract.connect(investor1).emergencyWithdraw();
                    return "❌ FAILED - Emergency withdrawal without emergency succeeded";
                } catch (error) {
                    return "✅ PASSED - Emergency withdrawal without emergency rejected";
                }
            }
        },
        {
            name: "Unauthorized Flash Loan Callback",
            test: async () => {
                try {
                    await contract.connect(attacker).executeOperation(
                        ["0xdAC17F958D2ee523a2206206994597C13D831ec7"],
                        [ethers.utils.parseEther("1000")],
                        [ethers.utils.parseEther("1")],
                        contract.address,
                        "0x"
                    );
                    return "❌ FAILED - Unauthorized flash loan callback succeeded";
                } catch (error) {
                    return "✅ PASSED - Unauthorized flash loan callback rejected";
                }
            }
        },
        {
            name: "Contract Balance Check",
            test: async () => {
                try {
                    const balance = await contract.getContractBalance();
                    return `✅ PASSED - Contract balance: ${ethers.utils.formatEther(balance)} ETH`;
                } catch (error) {
                    return "❌ FAILED - Contract balance check failed: " + error.message;
                }
            }
        },
        {
            name: "Statistics Integrity Check",
            test: async () => {
                try {
                    const stats = await contract.getBotStats();
                    const expectedInvestors = 2; // investor1 and investor2 made investments
                    const expectedInvestment = ethers.utils.parseEther("100.01"); // 100 + 0.01
                    
                    if (stats.totalInvestors.eq(expectedInvestors) && 
                        stats.totalInvestment.eq(expectedInvestment)) {
                        return "✅ PASSED - Statistics are accurate";
                    } else {
                        return `❌ FAILED - Statistics mismatch. Expected: ${expectedInvestors} investors, ${ethers.utils.formatEther(expectedInvestment)} ETH. Got: ${stats.totalInvestors} investors, ${ethers.utils.formatEther(stats.totalInvestment)} ETH`;
                    }
                } catch (error) {
                    return "❌ FAILED - Statistics check failed: " + error.message;
                }
            }
        },
        {
            name: "Emergency Mode Activation",
            test: async () => {
                try {
                    await contract.emergencyPause();
                    const stats = await contract.getBotStats();
                    const isPaused = await contract.paused();
                    
                    if (stats.emergencyMode && isPaused) {
                        return "✅ PASSED - Emergency mode activated correctly";
                    } else {
                        return "❌ FAILED - Emergency mode not activated properly";
                    }
                } catch (error) {
                    return "❌ FAILED - Emergency mode activation failed: " + error.message;
                }
            }
        },
        {
            name: "Investment During Emergency",
            test: async () => {
                try {
                    await contract.connect(attacker).makeInvestment({ 
                        value: ethers.utils.parseEther("1") 
                    });
                    return "❌ FAILED - Investment during emergency succeeded";
                } catch (error) {
                    return "✅ PASSED - Investment during emergency rejected";
                }
            }
        }
    ];
    
    console.log("\n🔍 Running Edge Case Tests:");
    console.log("=" * 60);
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        console.log(`\nTesting: ${test.name}`);
        const result = await test.test();
        console.log(`Result: ${result}`);
        
        if (result.includes("✅ PASSED")) {
            passed++;
        } else {
            failed++;
        }
    }
    
    console.log("\n" + "=" * 60);
    console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
    console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(2)}%`);
    
    if (failed === 0) {
        console.log("🎉 All edge case tests passed! Contract is secure.");
    } else {
        console.log("⚠️  Some tests failed. Review security implementation.");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Edge case tests failed:", error);
        process.exit(1);
    });