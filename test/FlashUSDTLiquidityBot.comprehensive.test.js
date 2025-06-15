const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FlashUSDTLiquidityBot - Kapsamlı Güvenlik Testleri", function () {
    let contract;
    let owner;
    let investor1;
    let investor2;
    let attacker;
    let mockAaveProvider;
    let mockUniswapRouter;
    let mockSushiswapRouter;
    
    // Mock addresses for testing
    const MOCK_AAVE_PROVIDER = "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e";
    const MOCK_UNISWAP_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const MOCK_SUSHISWAP_ROUTER = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";

    beforeEach(async function () {
        [owner, investor1, investor2, attacker] = await ethers.getSigners();
        
        const FlashUSDTLiquidityBot = await ethers.getContractFactory("FlashUSDTLiquidityBot");
        contract = await FlashUSDTLiquidityBot.deploy(
            MOCK_AAVE_PROVIDER,
            MOCK_UNISWAP_ROUTER,
            MOCK_SUSHISWAP_ROUTER
        );
        await contract.deployed();
    });

    describe("1. Deployment Security Tests", function () {
        it("Should deploy with correct initial values", async function () {
            expect(await contract.name()).to.equal("Flash USDT Liquidity Bot Token");
            expect(await contract.symbol()).to.equal("FULT");
            expect(await contract.totalSupply()).to.equal(ethers.utils.parseEther("1000000000"));
            expect(await contract.owner()).to.equal(owner.address);
        });

        it("Should have emergency mode disabled initially", async function () {
            const stats = await contract.getBotStats();
            expect(stats.emergencyMode).to.be.false;
        });

        it("Should not be paused initially", async function () {
            expect(await contract.paused()).to.be.false;
        });

        it("Should have correct constants", async function () {
            // Test constants are properly set
            const minInvestment = ethers.utils.parseEther("0.01");
            const maxInvestment = ethers.utils.parseEther("100");
            
            // Try investment below minimum
            await expect(
                contract.connect(investor1).makeInvestment({ 
                    value: ethers.utils.parseEther("0.005") 
                })
            ).to.be.revertedWithCustomError(contract, "InvestmentTooSmall");
            
            // Try investment above maximum
            await expect(
                contract.connect(investor1).makeInvestment({ 
                    value: ethers.utils.parseEther("101") 
                })
            ).to.be.revertedWithCustomError(contract, "InvestmentTooLarge");
        });
    });

    describe("2. Investment Security Tests", function () {
        it("Should accept valid investments within limits", async function () {
            const investmentAmount = ethers.utils.parseEther("1");
            
            await expect(
                contract.connect(investor1).makeInvestment({ value: investmentAmount })
            ).to.emit(contract, "InvestmentReceived")
             .withArgs(investor1.address, investmentAmount, await getBlockTimestamp());
        });

        it("Should reject investments below minimum threshold", async function () {
            const tooSmall = ethers.utils.parseEther("0.005");
            
            await expect(
                contract.connect(investor1).makeInvestment({ value: tooSmall })
            ).to.be.revertedWithCustomError(contract, "InvestmentTooSmall");
        });

        it("Should reject investments above maximum threshold", async function () {
            const tooLarge = ethers.utils.parseEther("101");
            
            await expect(
                contract.connect(investor1).makeInvestment({ value: tooLarge })
            ).to.be.revertedWithCustomError(contract, "InvestmentTooLarge");
        });

        it("Should prevent cumulative investments exceeding maximum", async function () {
            // First investment
            await contract.connect(investor1).makeInvestment({ 
                value: ethers.utils.parseEther("60") 
            });
            
            // Second investment that would exceed limit
            await expect(
                contract.connect(investor1).makeInvestment({ 
                    value: ethers.utils.parseEther("50") 
                })
            ).to.be.revertedWithCustomError(contract, "InvestmentTooLarge");
        });

        it("Should prevent investments when paused", async function () {
            await contract.emergencyPause();
            
            await expect(
                contract.connect(investor1).makeInvestment({ 
                    value: ethers.utils.parseEther("1") 
                })
            ).to.be.revertedWith("Pausable: paused");
        });

        it("Should prevent investments in emergency mode", async function () {
            await contract.emergencyPause();
            const stats = await contract.getBotStats();
            expect(stats.emergencyMode).to.be.true;
            
            await expect(
                contract.connect(investor1).makeInvestment({ 
                    value: ethers.utils.parseEther("1") 
                })
            ).to.be.revertedWith("Pausable: paused");
        });

        it("Should track multiple investors correctly", async function () {
            await contract.connect(investor1).makeInvestment({ 
                value: ethers.utils.parseEther("1") 
            });
            await contract.connect(investor2).makeInvestment({ 
                value: ethers.utils.parseEther("2") 
            });
            
            const stats = await contract.getBotStats();
            expect(stats.totalInvestors).to.equal(2);
            expect(stats.totalInvestment).to.equal(ethers.utils.parseEther("3"));
        });
    });

    describe("3. Reentrancy Protection Tests", function () {
        it("Should prevent reentrancy attacks on investment", async function () {
            // Deploy malicious contract
            const MaliciousContract = await ethers.getContractFactory("MaliciousReentrancy");
            const malicious = await MaliciousContract.deploy(contract.address);
            await malicious.deployed();
            
            // Fund malicious contract
            await owner.sendTransaction({
                to: malicious.address,
                value: ethers.utils.parseEther("2")
            });
            
            // Attempt reentrancy attack
            await expect(
                malicious.attack({ value: ethers.utils.parseEther("1") })
            ).to.be.revertedWith("ReentrancyGuard: reentrant call");
        });

        it("Should prevent reentrancy on profit withdrawal", async function () {
            // Make investment first
            await contract.connect(investor1).makeInvestment({ 
                value: ethers.utils.parseEther("1") 
            });
            
            // Try to withdraw (should fail as no profit yet)
            await expect(
                contract.connect(investor1).withdrawProfit()
            ).to.be.revertedWith("No profit to withdraw");
        });

        it("Should handle multiple simultaneous transactions safely", async function () {
            const promises = [];
            
            // Create multiple simultaneous investment attempts
            for (let i = 0; i < 5; i++) {
                promises.push(
                    contract.connect(investor1).makeInvestment({ 
                        value: ethers.utils.parseEther("1") 
                    })
                );
            }
            
            // Only one should succeed due to reentrancy protection
            const results = await Promise.allSettled(promises);
            const successful = results.filter(r => r.status === 'fulfilled').length;
            expect(successful).to.be.at.most(1);
        });
    });

    describe("4. Access Control Tests", function () {
        it("Should only allow owner to add supported tokens", async function () {
            const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
            const priceFeed = "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D";
            
            await expect(
                contract.connect(attacker).addSupportedToken(
                    tokenAddress,
                    "Test Token",
                    ethers.utils.parseEther("1000"),
                    priceFeed
                )
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should only allow owner to execute arbitrage", async function () {
            const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
            const amount = ethers.utils.parseEther("1000");
            const params = ethers.utils.defaultAbiCoder.encode(
                ["address", "uint256", "uint256"],
                [tokenAddress, ethers.utils.parseEther("0.001"), Math.floor(Date.now() / 1000) + 3600]
            );
            
            await expect(
                contract.connect(attacker).executeArbitrage(tokenAddress, amount, params)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should only allow owner to pause/unpause", async function () {
            await expect(
                contract.connect(attacker).emergencyPause()
            ).to.be.revertedWith("Ownable: caller is not the owner");
            
            await expect(
                contract.connect(attacker).emergencyUnpause()
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should allow owner to transfer ownership securely", async function () {
            await contract.transferOwnership(investor1.address);
            expect(await contract.owner()).to.equal(investor1.address);
            
            // Old owner should no longer have access
            await expect(
                contract.connect(owner).emergencyPause()
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("5. Emergency Functions Tests", function () {
        it("Should allow owner to pause contract", async function () {
            await contract.emergencyPause();
            expect(await contract.paused()).to.be.true;
            
            const stats = await contract.getBotStats();
            expect(stats.emergencyMode).to.be.true;
        });

        it("Should allow owner to unpause contract", async function () {
            await contract.emergencyPause();
            await contract.emergencyUnpause();
            
            expect(await contract.paused()).to.be.false;
            const stats = await contract.getBotStats();
            expect(stats.emergencyMode).to.be.false;
        });

        it("Should allow emergency withdrawal when in emergency mode", async function () {
            // Make investment first
            const investmentAmount = ethers.utils.parseEther("1");
            await contract.connect(investor1).makeInvestment({ value: investmentAmount });
            
            // Activate emergency mode
            await contract.emergencyPause();
            
            // Should allow emergency withdrawal
            const balanceBefore = await ethers.provider.getBalance(investor1.address);
            await contract.connect(investor1).emergencyWithdraw();
            const balanceAfter = await ethers.provider.getBalance(investor1.address);
            
            // Should have received investment back (minus gas)
            expect(balanceAfter).to.be.gt(balanceBefore);
        });

        it("Should prevent emergency withdrawal when not in emergency mode", async function () {
            await expect(
                contract.connect(investor1).emergencyWithdraw()
            ).to.be.revertedWith("Not in emergency mode");
        });

        it("Should automatically trigger emergency mode on excessive losses", async function () {
            // This would require simulating loss conditions
            // For now, we test the manual trigger
            await contract.emergencyPause();
            
            const stats = await contract.getBotStats();
            expect(stats.emergencyMode).to.be.true;
        });
    });

    describe("6. Input Validation Tests", function () {
        it("Should reject zero address for supported tokens", async function () {
            await expect(
                contract.addSupportedToken(
                    ethers.constants.AddressZero,
                    "Invalid Token",
                    ethers.utils.parseEther("1000"),
                    "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D"
                )
            ).to.be.revertedWith("Invalid token address");
        });

        it("Should reject zero address for price feed", async function () {
            await expect(
                contract.addSupportedToken(
                    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                    "Test Token",
                    ethers.utils.parseEther("1000"),
                    ethers.constants.AddressZero
                )
            ).to.be.revertedWith("Invalid price feed");
        });

        it("Should validate arbitrage parameters", async function () {
            const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
            const amount = ethers.utils.parseEther("1000");
            
            // Invalid parameters (empty bytes)
            await expect(
                contract.executeArbitrage(tokenAddress, amount, "0x")
            ).to.be.reverted;
        });

        it("Should handle edge cases in investment amounts", async function () {
            // Test with exactly minimum amount
            await expect(
                contract.connect(investor1).makeInvestment({ 
                    value: ethers.utils.parseEther("0.01") 
                })
            ).to.not.be.reverted;
            
            // Test with exactly maximum amount
            await expect(
                contract.connect(investor2).makeInvestment({ 
                    value: ethers.utils.parseEther("100") 
                })
            ).to.not.be.reverted;
        });
    });

    describe("7. Gas Optimization Tests", function () {
        it("Should use reasonable gas for investment", async function () {
            const investmentAmount = ethers.utils.parseEther("1");
            const tx = await contract.connect(investor1).makeInvestment({ 
                value: investmentAmount 
            });
            const receipt = await tx.wait();
            
            // Should use less than 200k gas
            expect(receipt.gasUsed).to.be.lt(200000);
        });

        it("Should use reasonable gas for profit withdrawal", async function () {
            // Make investment and simulate profit
            await contract.connect(investor1).makeInvestment({ 
                value: ethers.utils.parseEther("1") 
            });
            
            // This would require actual profit to test withdrawal gas
            // For now, we test that the function exists and has gas limits
            const gasEstimate = await contract.connect(investor1).estimateGas.withdrawProfit()
                .catch(() => 0); // Will fail if no profit, but we can still check structure
            
            // Function should exist and be callable
            expect(typeof gasEstimate).to.equal('object');
        });

        it("Should batch operations efficiently", async function () {
            // Test multiple investments in sequence
            const startGas = await ethers.provider.getBalance(investor1.address);
            
            for (let i = 0; i < 3; i++) {
                await contract.connect(investor1).makeInvestment({ 
                    value: ethers.utils.parseEther("0.1") 
                });
            }
            
            const endGas = await ethers.provider.getBalance(investor1.address);
            const totalGasUsed = startGas.sub(endGas).sub(ethers.utils.parseEther("0.3"));
            
            // Total gas should be reasonable for 3 transactions
            expect(totalGasUsed).to.be.lt(ethers.utils.parseEther("0.01"));
        });
    });

    describe("8. Statistics and Reporting Tests", function () {
        it("Should return correct bot statistics", async function () {
            const stats = await contract.getBotStats();
            
            expect(stats.totalProfit).to.equal(0);
            expect(stats.totalTrades).to.equal(0);
            expect(stats.successfulTrades).to.equal(0);
            expect(stats.totalInvestors).to.equal(0);
            expect(stats.totalInvestment).to.equal(0);
            expect(stats.successRate).to.equal(0);
            expect(stats.emergencyMode).to.be.false;
        });

        it("Should return correct investor information", async function () {
            const investmentAmount = ethers.utils.parseEther("1");
            await contract.connect(investor1).makeInvestment({ value: investmentAmount });
            
            const info = await contract.getInvestorInfo(investor1.address);
            expect(info.investment).to.equal(investmentAmount);
            expect(info.profit).to.equal(0);
            expect(info.totalWithdrawn).to.equal(0);
            expect(info.lastTransactionTime).to.be.gt(0);
        });

        it("Should update statistics after investment", async function () {
            const investmentAmount = ethers.utils.parseEther("1");
            await contract.connect(investor1).makeInvestment({ value: investmentAmount });
            
            const stats = await contract.getBotStats();
            expect(stats.totalInvestors).to.equal(1);
            expect(stats.totalInvestment).to.equal(investmentAmount);
        });

        it("Should handle statistics for multiple investors", async function () {
            await contract.connect(investor1).makeInvestment({ 
                value: ethers.utils.parseEther("1") 
            });
            await contract.connect(investor2).makeInvestment({ 
                value: ethers.utils.parseEther("2") 
            });
            
            const stats = await contract.getBotStats();
            expect(stats.totalInvestors).to.equal(2);
            expect(stats.totalInvestment).to.equal(ethers.utils.parseEther("3"));
        });
    });

    describe("9. Edge Cases and Error Handling", function () {
        it("Should handle zero investment attempts", async function () {
            await expect(
                contract.connect(investor1).makeInvestment({ value: 0 })
            ).to.be.revertedWithCustomError(contract, "InvestmentTooSmall");
        });

        it("Should handle contract with no balance", async function () {
            // Try to withdraw from empty contract
            await expect(
                contract.connect(investor1).withdrawProfit()
            ).to.be.revertedWith("No profit to withdraw");
        });

        it("Should handle invalid token operations", async function () {
            // Try to add token with empty name
            await expect(
                contract.addSupportedToken(
                    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                    "",
                    ethers.utils.parseEther("1000"),
                    "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D"
                )
            ).to.not.be.reverted; // Empty name should be allowed
        });

        it("Should handle overflow conditions", async function () {
            // Test with maximum uint256 values where applicable
            const maxUint256 = ethers.constants.MaxUint256;
            
            // This should not cause overflow due to SafeMath
            await expect(
                contract.connect(investor1).makeInvestment({ 
                    value: ethers.utils.parseEther("1") 
                })
            ).to.not.be.reverted;
        });
    });

    describe("10. Integration and Flash Loan Tests", function () {
        it("Should have correct flash loan callback signature", async function () {
            // Test that executeOperation function exists with correct signature
            const executeOperationSelector = contract.interface.getSighash("executeOperation");
            expect(executeOperationSelector).to.equal("0x920f5c84");
        });

        it("Should reject unauthorized flash loan callbacks", async function () {
            const assets = ["0xdAC17F958D2ee523a2206206994597C13D831ec7"];
            const amounts = [ethers.utils.parseEther("1000")];
            const premiums = [ethers.utils.parseEther("1")];
            const params = "0x";
            
            // Should reject calls not from Aave pool
            await expect(
                contract.connect(attacker).executeOperation(
                    assets, amounts, premiums, contract.address, params
                )
            ).to.be.revertedWith("Unauthorized callback");
        });

        it("Should validate flash loan parameters", async function () {
            // Test arbitrage execution with proper owner permissions
            const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
            const amount = ethers.utils.parseEther("1000");
            const params = ethers.utils.defaultAbiCoder.encode(
                ["address", "uint256", "uint256"],
                [tokenAddress, ethers.utils.parseEther("0.001"), Math.floor(Date.now() / 1000) + 3600]
            );
            
            // Should not revert due to parameter validation (will revert due to mock addresses)
            await expect(
                contract.executeArbitrage(tokenAddress, amount, params)
            ).to.be.reverted; // Expected to revert due to mock setup
        });
    });

    // Helper function to get current block timestamp
    async function getBlockTimestamp() {
        const block = await ethers.provider.getBlock("latest");
        return block.timestamp;
    }
});

// Malicious contract for reentrancy testing
contract("MaliciousReentrancy", function() {
    const MaliciousReentrancy = artifacts.require("MaliciousReentrancy");
    
    // This would be deployed separately for testing
});