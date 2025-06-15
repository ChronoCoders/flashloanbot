-import { useState, useEffect } from 'react';
+import { useState, useEffect, useCallback } from 'react';
+import { web3Service } from '../services/web3Service';
+import { priceService } from '../services/priceService';
+import toast from 'react-hot-toast';

export const useRealTimeData = (userAddress?: string) => {
  const [botStats, setBotStats] = useState({
    toplamKar: 2847.92,
    toplamIslem: 47832,
    toplamYatirimci: 3247,
    toplamYatirim: 18456.7,
    botYasi: 127,
    successRate: 0,
    emergencyMode: false
  });

  const [userStats, setUserStats] = useState({
    yatirim: 12.5,
    kar: 3.47,
    sonIslem: 0,
    totalWithdrawn: 0
  });

  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [tokenPrices, setTokenPrices] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBotStats = useCallback(async () => {
    try {
      const stats = await web3Service.getSecureBotStats();
      setBotStats(stats);
      
      // Check for emergency conditions
      if (stats.emergencyMode) {
        toast.error('⚠️ Emergency mode activated! Please check your investments.');
      }
    } catch (err) {
      console.error('Error fetching bot stats:', err);
      setError('Failed to fetch bot statistics');
    }
  }, []);

  const fetchUserStats = useCallback(async () => {
    if (!userAddress) return;
    
    try {
      const stats = await web3Service.getSecureInvestorInfo(userAddress);
      setUserStats(stats);
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  }, [userAddress]);

  const fetchTransactionHistory = useCallback(async () => {
    if (!userAddress) return;
    
    try {
      const transactions = await web3Service.getTransactionHistory(userAddress);
      setRecentTransactions(transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  }, [userAddress]);

  const fetchTokenPrices = useCallback(async () => {
    try {
      const prices = await priceService.getTokenPrices();
      if (prices) {
        setTokenPrices(prices);
      }
    } catch (err) {
      console.error('Error fetching token prices:', err);
    }
  }, []);

  const initializeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await web3Service.initialize();
      await Promise.all([
        fetchBotStats(),
        fetchUserStats(),
        fetchTransactionHistory(),
        fetchTokenPrices()
      ]);
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to initialize blockchain connection');
      toast.error('Blockchain connection failed. Please check your wallet connection.');
    } finally {
      setLoading(false);
    }
  }, [fetchBotStats, fetchUserStats, fetchTransactionHistory, fetchTokenPrices]);

  const makeInvestment = useCallback(async (amount: string) => {
    try {
      setLoading(true);
      
      // Validate investment amount
      const amountNum = parseFloat(amount);
      if (amountNum < 0.01) {
        throw new Error('Minimum investment is 0.01 ETH');
      }
      if (amountNum > 100) {
        throw new Error('Maximum investment is 100 ETH per wallet');
      }
      
      const tx = await web3Service.makeSecureInvestment(amount);
      toast.success(`Investment of ${amount} ETH successful!`);
      
      // Refresh data after successful investment
      await Promise.all([fetchBotStats(), fetchUserStats()]);
      
      return tx;
    } catch (err: any) {
      console.error('Investment error:', err);
      toast.error(err.message || 'Investment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBotStats, fetchUserStats]);

  const withdrawProfit = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check if user has profits to withdraw
      if (userStats.kar <= 0) {
        throw new Error('No profits available to withdraw');
      }
      
      const tx = await web3Service.withdrawSecureProfit();
      toast.success('Profit withdrawal successful!');
      
      // Refresh data after successful withdrawal
      await Promise.all([fetchBotStats(), fetchUserStats()]);
      
      return tx;
    } catch (err: any) {
      console.error('Withdrawal error:', err);
      toast.error(err.message || 'Withdrawal failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBotStats, fetchUserStats]);

  const emergencyWithdraw = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!botStats.emergencyMode) {
        throw new Error('Emergency withdrawal only available in emergency mode');
      }
      
      const tx = await web3Service.emergencyWithdraw();
      toast.success('Emergency withdrawal successful!');
      
      // Refresh data after emergency withdrawal
      await Promise.all([fetchBotStats(), fetchUserStats()]);
      
      return tx;
    } catch (err: any) {
      console.error('Emergency withdrawal error:', err);
      toast.error(err.message || 'Emergency withdrawal failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [botStats.emergencyMode, fetchBotStats, fetchUserStats]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Set up auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        Promise.all([
          fetchBotStats(),
          fetchUserStats(),
          fetchTokenPrices()
        ]).catch(console.error);
      }
    }, 30000); // 30 seconds for production

    return () => clearInterval(interval);
  }, [loading, fetchBotStats, fetchUserStats, fetchTokenPrices]);

  return {
    botStats,
    userStats,
    recentTransactions,
    tokenPrices,
    loading,
    error,
    makeInvestment,
    withdrawProfit,
    emergencyWithdraw,
    refreshData: initializeData
  };
};