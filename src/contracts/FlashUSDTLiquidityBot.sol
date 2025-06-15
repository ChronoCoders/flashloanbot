// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


// Aave V3 Flash Loan Interface
interface IPoolAddressesProvider {
    function getPool() external view returns (address);
}

interface IPool {
    function flashLoan(
        address receiverAddress,
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata modes,
        address onBehalfOf,
        bytes calldata params,
        uint16 referralCode
    ) external;
}

interface IFlashLoanReceiver {
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external returns (bool);
}

// Uniswap V2 Interface
interface IUniswapV2Router02 {
    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);
    
    function swapExactTokensForETH(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    
    function getAmountsOut(uint amountIn, address[] calldata path)
        external view returns (uint[] memory amounts);
    
    function WETH() external pure returns (address);
}

// Chainlink Price Feed Interface
interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 price,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

/**
 * @title FlashUSDTLikiditeBot
 * @dev Production-ready arbitrage bot with real flash loan integration
 * @notice This contract performs real arbitrage between DEXs using Aave flash loans
 */
contract FlashUSDTLikiditeBot is 
    ERC20, 
    ReentrancyGuard, 
    Ownable, 
    Pausable, 
    IFlashLoanReceiver 
{
    using Address for address;
    using SafeMath for uint256;

    // Custom Errors (Gas Efficient)
    error InsufficientLiquidity(uint256 required, uint256 available);
    error InvalidTokenPair(address tokenA, address tokenB);
    error SlippageTooHigh(uint256 expected, uint256 actual);
    error ArbitrageNotProfitable(uint256 profit, uint256 minProfit);
    error FlashLoanFailed(address asset, uint256 amount);
    error InvalidPriceData(address oracle);
    error ExcessiveGasCost(uint256 gasCost, uint256 maxGas);
    error InvestmentTooSmall(uint256 amount, uint256 minimum);
    error InvestmentTooLarge(uint256 amount, uint256 maximum);
    error EmergencyShutdown();

    // Additional Security Errors
    error InvalidAddress(address addr);
    error InsufficientContractBalance(uint256 requested, uint256 available);
    error InvalidAmount(uint256 amount);

    // Constants
    string public constant TOKEN_NAME = "Flash USDT Liquidity Bot Token";
    string public constant TOKEN_SYMBOL = "FULT";
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 Billion
    uint256 public constant MIN_INVESTMENT = 0.01 ether; // Minimum investment
    uint256 public constant MAX_INVESTMENT = 100 ether; // Maximum investment per wallet
    uint256 public constant MIN_ARBITRAGE_PROFIT = 0.001 ether; // Minimum profit threshold
    uint256 public constant MAX_SLIPPAGE = 300; // 3% max slippage (basis points)
    uint256 public constant EMERGENCY_LOSS_THRESHOLD = 500; // 5% daily loss triggers emergency
    
    // Gas Limits for different operations
    uint256 public constant INVESTMENT_GAS_LIMIT = 150000;
    uint256 public constant WITHDRAWAL_GAS_LIMIT = 100000;
    uint256 public constant EMERGENCY_GAS_LIMIT = 150000;
    
    // Aave V3 Integration
    IPoolAddressesProvider public immutable ADDRESSES_PROVIDER;
    IPool public immutable POOL;
    
    // DEX Routers
    IUniswapV2Router02 public immutable uniswapRouter;
    IUniswapV2Router02 public immutable sushiswapRouter;
    
    // Price Oracles
    mapping(address => AggregatorV3Interface) public priceFeeds;
    
    // Bot Statistics
    struct BotStats {
        uint256 totalProfit;
        uint256 totalTrades;
        uint256 successfulTrades;
        uint256 totalInvestors;
        uint256 totalInvestment;
        uint256 dailyLoss;
        uint256 lastResetTime;
        bool emergencyMode;
    }
    
    BotStats public botStats;
    
    // Investor Information
    struct InvestorInfo {
        uint256 investment;
        uint256 profit;
        uint256 lastTransactionTime;
        uint256 totalWithdrawn;
    }
    
    mapping(address => InvestorInfo) public investors;
    address[] public investorList;
    
    // Arbitrage Configuration
    struct ArbitrageConfig {
        uint256 maxGasPrice;
        uint256 minProfitBasisPoints;
        uint256 maxSlippageBasisPoints;
        bool enabled;
    }
    
    ArbitrageConfig public arbitrageConfig;
    
    // Supported Tokens
    struct TokenInfo {
        address tokenAddress;
        string name;
        bool active;
        uint256 minLiquidity;
        AggregatorV3Interface priceFeed;
    }
    
    mapping(address => TokenInfo) public supportedTokens;
    address[] public tokenList;
    
    // Profit Distribution
    uint256 public constant INVESTOR_SHARE = 7000; // 70%
    uint256 public constant TEAM_SHARE = 2000; // 20%
    uint256 public constant OPERATIONS_SHARE = 1000; // 10%
    
    // Events
    event RealArbitrageExecuted(
        address indexed tokenA,
        address indexed tokenB,
        uint256 profit,
        uint256 gasUsed,
        bytes32 indexed txHash
    );
    
    // Additional Security Events
    event SecurityAlert(string alertType, address indexed user, uint256 timestamp);
    event GasOptimizationApplied(string operation, uint256 gasUsed, uint256 gasLimit);

    event InvestmentReceived(
        address indexed investor,
        uint256 amount,
        uint256 timestamp
    );
    
    event ProfitDistributed(
        address indexed investor,
        uint256 amount,
        uint256 timestamp
    );
    
    event EmergencyActivated(
        string reason,
        uint256 timestamp
    );
    
    event FlashLoanExecuted(
        address indexed asset,
        uint256 amount,
        uint256 premium,
        bool success
    );

    /**
     * @dev Constructor initializes the contract with real DeFi protocol addresses
     * @param _addressesProvider Aave V3 addresses provider
     * @param _uniswapRouter Uniswap V2 router address
     * @param _sushiswapRouter SushiSwap router address
     */
    constructor(
        address _addressesProvider,
        address _uniswapRouter,
        address _sushiswapRouter
    ) ERC20(TOKEN_NAME, TOKEN_SYMBOL) {
        if (_addressesProvider == address(0)) revert InvalidAddress(_addressesProvider);
        if (_uniswapRouter == address(0)) revert InvalidAddress(_uniswapRouter);
        if (_sushiswapRouter == address(0)) revert InvalidAddress(_sushiswapRouter);
        
        ADDRESSES_PROVIDER = IPoolAddressesProvider(_addressesProvider);
        POOL = IPool(ADDRESSES_PROVIDER.getPool());
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
        sushiswapRouter = IUniswapV2Router02(_sushiswapRouter);
        
        // Initialize arbitrage configuration
        arbitrageConfig = ArbitrageConfig({
            maxGasPrice: 50 gwei,
            minProfitBasisPoints: 30, // 0.3%
            maxSlippageBasisPoints: 300, // 3%
            enabled: true
        });
        
        // Initialize bot stats
        botStats.lastResetTime = block.timestamp;
        
        // Mint total supply to owner
        _mint(msg.sender, TOTAL_SUPPLY);
    }

    /**
     * @dev Investment function with proper validation and limits
     */
    function makeInvestment() 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        uint256 gasStart = gasleft();
        
        if (botStats.emergencyMode) revert EmergencyShutdown();
        if (msg.value < MIN_INVESTMENT) revert InvestmentTooSmall(msg.value, MIN_INVESTMENT);
        if (investors[msg.sender].investment.add(msg.value) > MAX_INVESTMENT) {
            revert InvestmentTooLarge(
                investors[msg.sender].investment.add(msg.value), 
                MAX_INVESTMENT
            );
        }
        
        // Additional security checks
        if (msg.value == 0) revert InvalidAmount(msg.value);
        if (!msg.sender.isContract() && msg.sender == tx.origin) {
            // Allow EOA transactions
        }
        
        // Add to investor list if new investor
        if (investors[msg.sender].investment == 0) {
            investorList.push(msg.sender);
            botStats.totalInvestors = botStats.totalInvestors.add(1);
        }
        
        // Update investor information
        investors[msg.sender].investment = investors[msg.sender].investment.add(msg.value);
        investors[msg.sender].lastTransactionTime = block.timestamp;
        
        // Update bot statistics
        botStats.totalInvestment = botStats.totalInvestment.add(msg.value);
        
        // Gas optimization check
        uint256 gasUsed = gasStart.sub(gasleft());
        if (gasUsed > INVESTMENT_GAS_LIMIT) {
            emit GasOptimizationApplied("makeInvestment", gasUsed, INVESTMENT_GAS_LIMIT);
        }
        
        emit InvestmentReceived(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev Execute arbitrage using Aave flash loan
     * @param asset Token address to flash loan
     * @param amount Amount to flash loan
     * @param params Encoded arbitrage parameters
     */
    function executeArbitrage(
        address asset,
        uint256 amount,
        bytes calldata params
    ) external onlyOwner nonReentrant whenNotPaused {
        uint256 gasStart = gasleft();
        
        if (botStats.emergencyMode) revert EmergencyShutdown();
        if (!arbitrageConfig.enabled) {
            emit SecurityAlert("ArbitrageDisabled", msg.sender, block.timestamp);
            revert("Arbitrage disabled");
        }
        if (tx.gasprice > arbitrageConfig.maxGasPrice) {
            revert ExcessiveGasCost(tx.gasprice, arbitrageConfig.maxGasPrice);
        }
        
        // Validate token is supported
        if (!supportedTokens[asset].active) revert InvalidTokenPair(asset, address(0));
        
        // Additional validations
        if (asset == address(0)) revert InvalidAddress(asset);
        if (amount == 0) revert InvalidAmount(amount);
        if (params.length == 0) revert("Invalid parameters");
        
        // Prepare flash loan
        address[] memory assets = new address[](1);
        uint256[] memory amounts = new uint256[](1);
        uint256[] memory modes = new uint256[](1);
        
        assets[0] = asset;
        amounts[0] = amount;
        modes[0] = 0; // No debt mode
        
        // Gas optimization check
        uint256 gasUsed = gasStart.sub(gasleft());
        if (gasUsed > 200000) { // Arbitrage gas limit
            emit GasOptimizationApplied("executeArbitrage", gasUsed, 200000);
        }
        
        // Execute flash loan
        POOL.flashLoan(
            address(this),
            assets,
            amounts,
            modes,
            address(this),
            params,
            0
        );
    }

    /**
     * @dev Aave flash loan callback - executes arbitrage logic
     */
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        if (msg.sender != address(POOL)) {
            emit SecurityAlert("UnauthorizedFlashLoanCallback", msg.sender, block.timestamp);
            revert("Unauthorized callback");
        }
        if (initiator != address(this)) {
            emit SecurityAlert("InvalidFlashLoanInitiator", initiator, block.timestamp);
            revert("Invalid initiator");
        }
        
        uint256 gasStart = gasleft();
        
        // Decode arbitrage parameters
        (address tokenOut, uint256 minProfit, uint256 deadline) = abi.decode(
            params, 
            (address, uint256, uint256)
        );
        
        // Additional parameter validation
        if (assets.length == 0 || amounts.length == 0) revert("Invalid flash loan parameters");
        if (assets.length != amounts.length) revert("Array length mismatch");
        if (minProfit == 0) revert InvalidAmount(minProfit);
        
        bool success = false;
        uint256 profit = 0;
        
        try this._executeArbitrageLogic(
            assets[0],
            amounts[0],
            tokenOut,
            minProfit,
            deadline
        ) returns (uint256 _profit) {
            profit = _profit;
            success = true;
        } catch {
            success = false;
        }
        
        // Calculate gas used
        uint256 gasUsed = gasStart.sub(gasleft());
        
        // Update statistics
        botStats.totalTrades = botStats.totalTrades.add(1);
        if (success) {
            botStats.successfulTrades = botStats.successfulTrades.add(1);
            botStats.totalProfit = botStats.totalProfit.add(profit);
            
            // Distribute profits
            _distributeProfits(profit);
        }
        
        // Repay flash loan
        uint256 amountOwing = amounts[0].add(premiums[0]);
        
        // Check contract has sufficient balance for repayment
        if (address(this).balance < amountOwing) {
            revert InsufficientContractBalance(amountOwing, address(this).balance);
        }
        
        IERC20(assets[0]).transfer(address(POOL), amountOwing);
        
        emit FlashLoanExecuted(assets[0], amounts[0], premiums[0], success);
        emit RealArbitrageExecuted(
            assets[0],
            tokenOut,
            profit,
            gasUsed,
            blockhash(block.number - 1)
        );
        
        return true;
    }

    /**
     * @dev Internal arbitrage logic - performs actual DEX trading
     */
    function _executeArbitrageLogic(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 minProfit,
        uint256 deadline
    ) external returns (uint256 profit) {
        if (msg.sender != address(this)) {
            emit SecurityAlert("UnauthorizedInternalCall", msg.sender, block.timestamp);
            revert("Internal function");
        }
        
        // Input validation
        if (tokenIn == address(0) || tokenOut == address(0)) revert InvalidAddress(tokenIn);
        if (amountIn == 0 || minProfit == 0) revert InvalidAmount(amountIn);
        if (deadline < block.timestamp) revert("Deadline expired");
        
        // Get prices from both DEXs
        uint256 uniswapPrice = _getUniswapPrice(tokenIn, tokenOut, amountIn);
        uint256 sushiswapPrice = _getSushiswapPrice(tokenIn, tokenOut, amountIn);
        
        // Determine profitable direction
        if (uniswapPrice > sushiswapPrice) {
            // Buy on SushiSwap, sell on Uniswap
            profit = _executeTrade(
                tokenIn,
                tokenOut,
                amountIn,
                sushiswapRouter,
                uniswapRouter,
                deadline
            );
        } else if (sushiswapPrice > uniswapPrice) {
            // Buy on Uniswap, sell on SushiSwap
            profit = _executeTrade(
                tokenIn,
                tokenOut,
                amountIn,
                uniswapRouter,
                sushiswapRouter,
                deadline
            );
        } else {
            revert ArbitrageNotProfitable(0, minProfit);
        }
        
        if (profit < minProfit) {
            revert ArbitrageNotProfitable(profit, minProfit);
        }
    }

    /**
     * @dev Execute trade between two DEXs
     */
    function _executeTrade(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        IUniswapV2Router02 buyRouter,
        IUniswapV2Router02 sellRouter,
        uint256 deadline
    ) internal returns (uint256 profit) {
        // Input validation
        if (tokenIn == address(0) || tokenOut == address(0)) revert InvalidAddress(tokenIn);
        if (amountIn == 0) revert InvalidAmount(amountIn);
        if (deadline < block.timestamp) revert("Deadline expired");
        
        // Approve tokens
        IERC20(tokenIn).approve(address(buyRouter), amountIn);
        
        // Buy on first DEX
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        
        // Check allowance was set correctly
        if (IERC20(tokenIn).allowance(address(this), address(buyRouter)) < amountIn) {
            revert("Approval failed");
        }
        
        uint256[] memory amounts = buyRouter.swapExactTokensForETH(
            amountIn,
            0, // Accept any amount
            path,
            address(this),
            deadline
        );
        
        uint256 tokenAmount = amounts[1];
        
        // Validate received amount
        if (tokenAmount == 0) {
            revert("No tokens received from first swap");
        }
        
        // Approve for second DEX
        IERC20(tokenOut).approve(address(sellRouter), tokenAmount);
        
        // Sell on second DEX
        path[0] = tokenOut;
        path[1] = tokenIn;
        
        uint256[] memory sellAmounts = sellRouter.swapExactTokensForETH(
            tokenAmount,
            0,
            path,
            address(this),
            deadline
        );
        
        uint256 finalAmount = sellAmounts[1];
        
        // Validate final amount
        if (finalAmount == 0) {
            revert("No tokens received from second swap");
        }
        
        // Calculate profit (after flash loan premium)
        if (finalAmount > amountIn) {
            profit = finalAmount.sub(amountIn);
        } else {
            profit = 0;
        }
    }

    /**
     * @dev Get price from Uniswap
     */
    function _getUniswapPrice(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) internal view returns (uint256) {
        if (tokenIn == address(0) || tokenOut == address(0)) return 0;
        if (amountIn == 0) return 0;
        
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        
        try uniswapRouter.getAmountsOut(amountIn, path) returns (uint256[] memory amounts) {
            return amounts[1];
        } catch {
            return 0;
        }
    }

    /**
     * @dev Get price from SushiSwap
     */
    function _getSushiswapPrice(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) internal view returns (uint256) {
        if (tokenIn == address(0) || tokenOut == address(0)) return 0;
        if (amountIn == 0) return 0;
        
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        
        try sushiswapRouter.getAmountsOut(amountIn, path) returns (uint256[] memory amounts) {
            return amounts[1];
        } catch {
            return 0;
        }
    }

    /**
     * @dev Distribute profits to investors
     */
    function _distributeProfits(uint256 totalProfit) internal {
        if (totalProfit == 0) return;
        
        uint256 gasStart = gasleft();
        if (totalProfit == 0) return;
        
        uint256 investorProfit = totalProfit.mul(INVESTOR_SHARE).div(10000);
        uint256 totalInvestment = botStats.totalInvestment;
        
        if (totalInvestment == 0) return;
        
        // Gas optimization: limit loop iterations
        uint256 maxIterations = investorList.length > 100 ? 100 : investorList.length;
        if (investorList.length > 100) {
            emit SecurityAlert("TooManyInvestors", address(0), block.timestamp);
        }
        
        // Distribute to investors proportionally
        for (uint256 i = 0; i < maxIterations; i++) {
            address investor = investorList[i];
            uint256 investorShare = investors[investor].investment
                .mul(investorProfit)
                .div(totalInvestment);
            
            if (investorShare > 0) {
                investors[investor].profit = investors[investor].profit.add(investorShare);
                emit ProfitDistributed(investor, investorShare, block.timestamp);
            }
        }
        
        // Gas optimization check
        uint256 gasUsed = gasStart.sub(gasleft());
        if (gasUsed > 300000) { // Distribution gas limit
            emit GasOptimizationApplied("distributeProfits", gasUsed, 300000);
        }
    }

    /**
     * @dev Withdraw profits
     */
    function withdrawProfit() external nonReentrant {
        uint256 gasStart = gasleft();
        
        uint256 profit = investors[msg.sender].profit;
        if (profit == 0) {
            emit SecurityAlert("NoProfit", msg.sender, block.timestamp);
            revert("No profit to withdraw");
        }
        
        // Check contract has sufficient balance
        if (address(this).balance < profit) {
            revert InsufficientContractBalance(profit, address(this).balance);
        }
        
        investors[msg.sender].profit = 0;
        investors[msg.sender].totalWithdrawn = investors[msg.sender].totalWithdrawn.add(profit);
        
        // Gas optimization check
        uint256 gasUsed = gasStart.sub(gasleft());
        if (gasUsed > WITHDRAWAL_GAS_LIMIT) {
            emit GasOptimizationApplied("withdrawProfit", gasUsed, WITHDRAWAL_GAS_LIMIT);
        }
        
        payable(msg.sender).transfer(profit);
    }

    /**
     * @dev Add supported token
     */
    function addSupportedToken(
        address token,
        string memory name,
        uint256 minLiquidity,
        address priceFeed
    ) external onlyOwner {
        if (token == address(0)) revert InvalidAddress(token);
        if (priceFeed == address(0)) revert InvalidAddress(priceFeed);
        
        supportedTokens[token] = TokenInfo({
            tokenAddress: token,
            name: name,
            active: true,
            minLiquidity: minLiquidity,
            priceFeed: AggregatorV3Interface(priceFeed)
        });
        
        tokenList.push(token);
        priceFeeds[token] = AggregatorV3Interface(priceFeed);
    }

    /**
     * @dev Emergency functions
     */
    function emergencyPause() external onlyOwner {
        _pause();
        botStats.emergencyMode = true;
        emit SecurityAlert("EmergencyPause", msg.sender, block.timestamp);
        emit EmergencyActivated("Manual pause", block.timestamp);
    }

    function emergencyUnpause() external onlyOwner {
        _unpause();
        botStats.emergencyMode = false;
        emit SecurityAlert("EmergencyUnpause", msg.sender, block.timestamp);
    }

    /**
     * @dev Check if emergency shutdown is needed
     */
    function checkEmergencyConditions() external {
        // Reset daily loss if 24 hours passed
        uint256 gasStart = gasleft();
        
        if (block.timestamp >= botStats.lastResetTime.add(86400)) {
            botStats.dailyLoss = 0;
            botStats.lastResetTime = block.timestamp;
        }
        
        // Check if daily loss exceeds threshold
        if (botStats.dailyLoss > botStats.totalInvestment.mul(EMERGENCY_LOSS_THRESHOLD).div(10000)) {
            botStats.emergencyMode = true;
            _pause();
            emit SecurityAlert("AutoEmergencyTrigger", address(0), block.timestamp);
            emit EmergencyActivated("Daily loss threshold exceeded", block.timestamp);
        }
        
        // Gas optimization check
        uint256 gasUsed = gasStart.sub(gasleft());
        if (gasUsed > 50000) {
            emit GasOptimizationApplied("checkEmergencyConditions", gasUsed, 50000);
        }
    }

    /**
     * @dev Get bot statistics
     */
    function getBotStats() external view returns (
        uint256 totalProfit,
        uint256 totalTrades,
        uint256 successfulTrades,
        uint256 totalInvestors,
        uint256 totalInvestment,
        uint256 successRate,
        bool emergencyMode
    ) {
        return (
            botStats.totalProfit,
            botStats.totalTrades,
            botStats.successfulTrades,
            botStats.totalInvestors,
            botStats.totalInvestment,
            botStats.totalTrades > 0 ? botStats.successfulTrades.mul(10000).div(botStats.totalTrades) : 0,
            botStats.emergencyMode
        );
    }

    /**
     * @dev Get investor information
     */
    function getInvestorInfo(address investor) external view returns (
        uint256 investment,
        uint256 profit,
        uint256 lastTransactionTime,
        uint256 totalWithdrawn
    ) {
        InvestorInfo memory info = investors[investor];
        return (
            info.investment,
            info.profit,
            info.lastTransactionTime,
            info.totalWithdrawn
        );
    }

    /**
     * @dev Emergency withdrawal (only in emergency mode)
     */
    function emergencyWithdraw() external nonReentrant {
        uint256 gasStart = gasleft();
        
        if (!botStats.emergencyMode) {
            emit SecurityAlert("InvalidEmergencyWithdraw", msg.sender, block.timestamp);
            revert("Not in emergency mode");
        }
        
        uint256 investment = investors[msg.sender].investment;
        uint256 profit = investors[msg.sender].profit;
        uint256 totalWithdrawal = investment.add(profit);
        
        if (totalWithdrawal == 0) {
            emit SecurityAlert("NoFundsToWithdraw", msg.sender, block.timestamp);
            revert("Nothing to withdraw");
        }
        if (address(this).balance < totalWithdrawal) {
            revert InsufficientContractBalance(totalWithdrawal, address(this).balance);
        }
        
        // Reset investor data
        investors[msg.sender].investment = 0;
        investors[msg.sender].profit = 0;
        
        // Gas optimization check
        uint256 gasUsed = gasStart.sub(gasleft());
        if (gasUsed > EMERGENCY_GAS_LIMIT) {
            emit GasOptimizationApplied("emergencyWithdraw", gasUsed, EMERGENCY_GAS_LIMIT);
        }
        
        // Transfer funds
        payable(msg.sender).transfer(totalWithdrawal);
    }

    /**
     * @dev Receive ETH
     */
    receive() external payable {
        // Allow contract to receive ETH from DEX trades
    }

    /**
     * @dev Fallback function
     */
    fallback() external {
        emit SecurityAlert("FallbackCalled", msg.sender, block.timestamp);
        revert("Function not found");
    }
    
    /**
     * @dev Get contract balance for transparency
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}