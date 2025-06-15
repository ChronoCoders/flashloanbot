import { ethers } from 'ethers';
import { CONTRACT_CONFIG, CONTRACT_ABI } from '../config/contracts';

// Updated ABI for secure contract
const SECURE_CONTRACT_ABI = [
  // Bot Statistics
  {
    "inputs": [],
    "name": "getBotStats",
    "outputs": [
      {"internalType": "uint256", "name": "totalProfit", "type": "uint256"},
      {"internalType": "uint256", "name": "totalTrades", "type": "uint256"},
      {"internalType": "uint256", "name": "successfulTrades", "type": "uint256"},
      {"internalType": "uint256", "name": "totalInvestors", "type": "uint256"},
      {"internalType": "uint256", "name": "totalInvestment", "type": "uint256"},
      {"internalType": "uint256", "name": "successRate", "type": "uint256"},
      {"internalType": "bool", "name": "emergencyMode", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Investor Information
  {
    "inputs": [{"internalType": "address", "name": "investor", "type": "address"}],
    "name": "getInvestorInfo",
    "outputs": [
      {"internalType": "uint256", "name": "investment", "type": "uint256"},
      {"internalType": "uint256", "name": "profit", "type": "uint256"},
      {"internalType": "uint256", "name": "lastTransactionTime", "type": "uint256"},
      {"internalType": "uint256", "name": "totalWithdrawn", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Investment Function
  {
    "inputs": [],
    "name": "makeInvestment",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  // Profit Withdrawal
  {
    "inputs": [],
    "name": "withdrawProfit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Emergency Withdrawal
  {
    "inputs": [],
    "name": "emergencyWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Pausable Functions
  {
    "inputs": [],
    "name": "paused",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];
class Web3Service {
  private provider: ethers.providers.Web3Provider | null = null;
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;

  async initialize() {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      await this.provider.send("eth_requestAccounts", []);
      this.signer = this.provider.getSigner();
      
      const network = await this.provider.getNetwork();
      const config = network.chainId === 1 ? CONTRACT_CONFIG.mainnet : CONTRACT_CONFIG.sepolia;
      
      if (config.address) {
        this.contract = new ethers.Contract(config.address, SECURE_CONTRACT_ABI, this.signer);
      }
    }
  }

  async connectWallet(): Promise<string> {
    if (!this.provider) await this.initialize();
    if (!this.signer) throw new Error('No signer available');
    
    return await this.signer.getAddress();
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const balance = await this.provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  async getSecureBotStats() {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const stats = await this.contract.getBotStats();
    return {
      toplamKar: parseFloat(ethers.utils.formatEther(stats.totalProfit)),
      toplamIslem: stats.totalTrades.toNumber(),
      toplamYatirimci: stats.totalInvestors.toNumber(),
      toplamYatirim: parseFloat(ethers.utils.formatEther(stats.totalInvestment)),
      successRate: stats.successRate.toNumber() / 100, // Convert from basis points
      emergencyMode: stats.emergencyMode,
      botYasi: Math.floor((Date.now() / 1000) - 1640995200) // Approximate age since 2022
    };
  }

  async getSecureInvestorInfo(address: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const info = await this.contract.getInvestorInfo(address);
    return {
      yatirim: parseFloat(ethers.utils.formatEther(info.investment)),
      kar: parseFloat(ethers.utils.formatEther(info.profit)),
      sonIslem: info.lastTransactionTime.toNumber(),
      totalWithdrawn: parseFloat(ethers.utils.formatEther(info.totalWithdrawn))
    };
  }

  async makeSecureInvestment(amount: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    // Validate amount
    const amountNum = parseFloat(amount);
    if (amountNum < 0.01) {
      throw new Error('Minimum investment is 0.01 ETH');
    }
    if (amountNum > 100) {
      throw new Error('Maximum investment is 100 ETH per wallet');
    }
    
    // Check if contract is paused
    const isPaused = await this.contract.paused();
    if (isPaused) {
      throw new Error('Contract is currently paused');
    }
    
    const tx = await this.contract.makeInvestment({
      value: ethers.utils.parseEther(amount),
      gasLimit: 150000 // Set reasonable gas limit
    });
    
    return await tx.wait();
  }

  async withdrawSecureProfit() {
    if (!this.contract) throw new Error('Contract not initialized');
    
    // Check if user has profits
    const signer = await this.signer?.getAddress();
    if (signer) {
      const info = await this.getSecureInvestorInfo(signer);
      if (info.kar <= 0) {
        throw new Error('No profits available to withdraw');
      }
    }
    
    const tx = await this.contract.withdrawProfit({
      gasLimit: 100000
    });
    return await tx.wait();
  }

  async emergencyWithdraw() {
    if (!this.contract) throw new Error('Contract not initialized');
    
    // Check if emergency mode is active
    const stats = await this.getSecureBotStats();
    if (!stats.emergencyMode) {
      throw new Error('Emergency withdrawal only available in emergency mode');
    }
    
    const tx = await this.contract.emergencyWithdraw({
      gasLimit: 150000
    });
    return await tx.wait();
  }

  async checkContractSecurity() {
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      // Verify contract is not paused
      const isPaused = await this.contract.paused();
      
      // Get current stats
      const stats = await this.getSecureBotStats();
      
      return {
        isPaused,
        emergencyMode: stats.emergencyMode,
        successRate: stats.successRate,
        isHealthy: !isPaused && !stats.emergencyMode && stats.successRate > 50
      };
    } catch (error) {
      console.error('Security check failed:', error);
      return {
        isPaused: true,
        emergencyMode: true,
        successRate: 0,
        isHealthy: false
      };
    }
  }

  async getTransactionHistory(address: string) {
    if (!this.provider) throw new Error('Provider not initialized');
    
    // Get recent transactions for the address
    const latestBlock = await this.provider.getBlockNumber();
    const fromBlock = Math.max(0, latestBlock - 10000); // Last ~10k blocks
    
    const filter = {
      address: this.contract?.address,
      fromBlock,
      toBlock: 'latest'
    };
    
    try {
      const logs = await this.provider.getLogs(filter);
      return logs.slice(-10); // Return last 10 transactions
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
      return [];
    }
  }
}

export const web3Service = new Web3Service();