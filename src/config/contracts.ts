// Contract Configuration
export const CONTRACT_CONFIG = {
  mainnet: {
    address: process.env.VITE_MAINNET_CONTRACT_ADDRESS || '', // Will be updated after deployment
    chainId: 1,
    rpcUrl: process.env.VITE_MAINNET_RPC_URL || '',
    name: 'Ethereum Mainnet'
  },
  sepolia: {
    address: process.env.VITE_SEPOLIA_CONTRACT_ADDRESS || '', // Will be updated after deployment
    chainId: 11155111,
    rpcUrl: process.env.VITE_SEPOLIA_RPC_URL || '',
    name: 'Sepolia Testnet'
  }
};

// Supported tokens with their addresses and price feeds
export const SUPPORTED_TOKENS = {
  mainnet: {
    USDT: {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      priceFeed: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
      name: 'Tether USD'
    },
    USDC: {
      address: '0xA0b86a33E6441b8C4505B4afDcA7FBf074d9c0b1',
      priceFeed: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
      name: 'USD Coin'
    },
    DAI: {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      priceFeed: '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9',
      name: 'Dai Stablecoin'
    },
    WETH: {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      priceFeed: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
      name: 'Wrapped Ether'
    }
  },
  sepolia: {
    // Testnet addresses (mock for testing)
    USDT: {
      address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
      priceFeed: '0x0000000000000000000000000000000000000000', // Mock
      name: 'Test Tether USD'
    }
  }
};

// Security constants
export const SECURITY_CONFIG = {
  MIN_INVESTMENT: '0.01', // ETH
  MAX_INVESTMENT: '100', // ETH
  EMERGENCY_LOSS_THRESHOLD: 5, // 5% daily loss triggers emergency
  MAX_SLIPPAGE: 3, // 3% maximum slippage
  MIN_PROFIT_THRESHOLD: 0.3, // 0.3% minimum profit
  GAS_LIMIT: {
    INVESTMENT: 150000,
    WITHDRAWAL: 100000,
    EMERGENCY: 150000
  }
};

[
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
  {
    "inputs": [{"internalType": "address", "name": "yatirimci", "type": "address"}],
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
  // Investment Function - Updated for secure contract
  {
    "inputs": [],
    "name": "makeInvestment",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  // Profit Withdrawal - Updated for secure contract
  {
    "inputs": [],
    "name": "withdrawProfit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Emergency Withdrawal - New security feature
  {
    "inputs": [],
    "name": "emergencyWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Pausable Check - Security feature
  {
    "inputs": [],
    "name": "paused",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Events for monitoring
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "investor", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "InvestmentReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "tokenA", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "tokenB", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "profit", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "gasUsed", "type": "uint256"},
      {"indexed": true, "internalType": "bytes32", "name": "txHash", "type": "bytes32"}
    ],
    "name": "RealArbitrageExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "string", "name": "reason", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "EmergencyActivated",
    "type": "event"
  }
]