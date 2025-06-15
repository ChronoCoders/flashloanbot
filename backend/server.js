const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ethers } = require('ethers');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// SendGrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Blockchain setup
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  require('./abi/FlashUSDTLiquidityBot.json'),
  provider
);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    
    if (user.rows.length === 0) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    req.user = user.rows[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, walletAddress, name } = req.body;
    
    // Validate input
    if (!email || !password || !walletAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR wallet_address = $2',
      [email, walletAddress]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const newUser = await pool.query(
      `INSERT INTO users (email, password_hash, wallet_address, name, kyc_status, created_at) 
       VALUES ($1, $2, $3, $4, 'pending', NOW()) RETURNING id, email, wallet_address, name, kyc_status`,
      [email, hashedPassword, walletAddress, name]
    );
    
    // Generate JWT
    const token = jwt.sign(
      { userId: newUser.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Send welcome email
    await sendWelcomeEmail(email, name);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: newUser.rows[0]
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const { password_hash, ...userWithoutPassword } = user.rows[0];
    
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// KYC routes
app.post('/api/kyc/submit', authenticateToken, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      tcKimlik,
      birthDate,
      birthPlace,
      nationality,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      occupation,
      monthlyIncome,
      sourceOfFunds,
      investmentExperience
    } = req.body;
    
    // Update user KYC data
    await pool.query(
      `UPDATE users SET 
       first_name = $1, last_name = $2, tc_kimlik = $3, birth_date = $4,
       birth_place = $5, nationality = $6, phone = $7, address = $8,
       city = $9, postal_code = $10, country = $11, occupation = $12,
       monthly_income = $13, source_of_funds = $14, investment_experience = $15,
       kyc_status = 'submitted', kyc_submitted_at = NOW()
       WHERE id = $16`,
      [firstName, lastName, tcKimlik, birthDate, birthPlace, nationality,
       phone, address, city, postalCode, country, occupation, monthlyIncome,
       sourceOfFunds, investmentExperience, req.user.id]
    );
    
    // Create KYC record for manual review
    await pool.query(
      `INSERT INTO kyc_submissions (user_id, data, status, submitted_at)
       VALUES ($1, $2, 'pending_review', NOW())`,
      [req.user.id, JSON.stringify(req.body)]
    );
    
    // Send notification to admin
    await sendKYCNotificationToAdmin(req.user.email, `${firstName} ${lastName}`);
    
    // Send confirmation to user
    await sendKYCConfirmationEmail(req.user.email, firstName);
    
    res.json({ message: 'KYC submission successful. Review will be completed within 24-48 hours.' });
    
  } catch (error) {
    console.error('KYC submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/kyc/status', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT kyc_status, kyc_submitted_at, kyc_approved_at FROM users WHERE id = $1',
      [req.user.id]
    );
    
    res.json(user.rows[0]);
  } catch (error) {
    console.error('KYC status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin route to approve/reject KYC
app.post('/api/admin/kyc/:userId/approve', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { userId } = req.params;
    const { approved, reason } = req.body;
    
    const status = approved ? 'approved' : 'rejected';
    
    await pool.query(
      `UPDATE users SET kyc_status = $1, kyc_approved_at = NOW() WHERE id = $2`,
      [status, userId]
    );
    
    await pool.query(
      `UPDATE kyc_submissions SET status = $1, reviewed_by = $2, review_reason = $3, reviewed_at = NOW()
       WHERE user_id = $4`,
      [status, req.user.id, reason, userId]
    );
    
    // Get user email for notification
    const user = await pool.query('SELECT email, first_name FROM users WHERE id = $1', [userId]);
    
    if (approved) {
      await sendKYCApprovalEmail(user.rows[0].email, user.rows[0].first_name);
    } else {
      await sendKYCRejectionEmail(user.rows[0].email, user.rows[0].first_name, reason);
    }
    
    res.json({ message: `KYC ${status} successfully` });
    
  } catch (error) {
    console.error('KYC approval error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bot statistics
app.get('/api/bot/stats', async (req, res) => {
  try {
    // Get stats from database
    const dbStats = await pool.query(`
      SELECT 
        COALESCE(SUM(profit_amount), 0) as total_profit,
        COUNT(DISTINCT user_id) as total_investors,
        COALESCE(SUM(investment_amount), 0) as total_investment,
        COUNT(*) as total_transactions
      FROM investments WHERE status = 'active'
    `);
    
    // Get blockchain stats
    let blockchainStats;
    try {
      blockchainStats = await contract.getBotStats();
    } catch (error) {
      console.error('Blockchain stats error:', error);
      blockchainStats = {
        totalProfit: ethers.BigNumber.from(0),
        totalTrades: ethers.BigNumber.from(0),
        successfulTrades: ethers.BigNumber.from(0),
        emergencyMode: false
      };
    }
    
    const stats = {
      totalProfit: parseFloat(ethers.utils.formatEther(blockchainStats.totalProfit || 0)),
      totalTrades: blockchainStats.totalTrades?.toNumber() || 0,
      successfulTrades: blockchainStats.successfulTrades?.toNumber() || 0,
      totalInvestors: parseInt(dbStats.rows[0].total_investors) || 0,
      totalInvestment: parseFloat(dbStats.rows[0].total_investment) || 0,
      successRate: blockchainStats.totalTrades?.toNumber() > 0 
        ? (blockchainStats.successfulTrades?.toNumber() / blockchainStats.totalTrades?.toNumber()) * 100 
        : 0,
      emergencyMode: blockchainStats.emergencyMode || false,
      lastUpdated: new Date().toISOString()
    };
    
    res.json(stats);
    
  } catch (error) {
    console.error('Bot stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Investment routes
app.post('/api/investments', authenticateToken, async (req, res) => {
  try {
    const { amount, transactionHash } = req.body;
    
    // Validate KYC status
    if (req.user.kyc_status !== 'approved') {
      return res.status(403).json({ error: 'KYC approval required for investments' });
    }
    
    // Validate amount
    if (!amount || parseFloat(amount) < 0.01 || parseFloat(amount) > 100) {
      return res.status(400).json({ error: 'Invalid investment amount' });
    }
    
    // Check if transaction hash already exists
    const existingTx = await pool.query(
      'SELECT * FROM investments WHERE transaction_hash = $1',
      [transactionHash]
    );
    
    if (existingTx.rows.length > 0) {
      return res.status(400).json({ error: 'Transaction already processed' });
    }
    
    // Verify transaction on blockchain
    try {
      const tx = await provider.getTransaction(transactionHash);
      if (!tx || tx.to.toLowerCase() !== process.env.CONTRACT_ADDRESS.toLowerCase()) {
        return res.status(400).json({ error: 'Invalid transaction' });
      }
    } catch (error) {
      return res.status(400).json({ error: 'Transaction verification failed' });
    }
    
    // Record investment
    const investment = await pool.query(
      `INSERT INTO investments (user_id, investment_amount, transaction_hash, status, created_at)
       VALUES ($1, $2, $3, 'active', NOW()) RETURNING *`,
      [req.user.id, amount, transactionHash]
    );
    
    // Send confirmation email
    await sendInvestmentConfirmationEmail(req.user.email, req.user.first_name, amount);
    
    res.status(201).json({
      message: 'Investment recorded successfully',
      investment: investment.rows[0]
    });
    
  } catch (error) {
    console.error('Investment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/investments/user', authenticateToken, async (req, res) => {
  try {
    const investments = await pool.query(
      `SELECT * FROM investments WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    
    res.json(investments.rows);
  } catch (error) {
    console.error('User investments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact and support
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message, category } = req.body;
    
    // Save to database
    await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message, category, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [name, email, subject, message, category]
    );
    
    // Send notification to support team
    await sendContactNotificationToSupport(name, email, subject, message, category);
    
    // Send confirmation to user
    await sendContactConfirmationEmail(email, name);
    
    res.json({ message: 'Message sent successfully. We will respond within 24 hours.' });
    
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Email service functions
async function sendWelcomeEmail(email, name) {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: 'Flash USDT Bot\'a Hoş Geldiniz!',
    html: `
      <h2>Merhaba ${name}!</h2>
      <p>Flash USDT Likidite Bot platformuna hoş geldiniz.</p>
      <p>Yatırım yapmaya başlamak için KYC doğrulama işlemini tamamlamanız gerekmektedir.</p>
      <p>Herhangi bir sorunuz varsa destek ekibimizle iletişime geçebilirsiniz.</p>
      <br>
      <p>Saygılarımızla,<br>Flash USDT Bot Ekibi</p>
    `
  };
  
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Welcome email error:', error);
  }
}

async function sendKYCConfirmationEmail(email, name) {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: 'KYC Başvurunuz Alındı',
    html: `
      <h2>Merhaba ${name}!</h2>
      <p>KYC doğrulama başvurunuz başarıyla alınmıştır.</p>
      <p>Başvurunuz 24-48 saat içinde incelenecek ve sonuç e-posta ile bildirilecektir.</p>
      <p>Bu süre zarfında platformun diğer özelliklerini inceleyebilirsiniz.</p>
      <br>
      <p>Saygılarımızla,<br>Flash USDT Bot Ekibi</p>
    `
  };
  
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('KYC confirmation email error:', error);
  }
}

async function sendKYCApprovalEmail(email, name) {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: 'KYC Doğrulama Onaylandı! 🎉',
    html: `
      <h2>Tebrikler ${name}!</h2>
      <p>KYC doğrulama işleminiz başarıyla tamamlanmıştır.</p>
      <p>Artık platform üzerinde yatırım yapabilir ve tüm özelliklerden yararlanabilirsiniz.</p>
      <p>Yatırım yapmaya başlamak için dashboard'unuza giriş yapabilirsiniz.</p>
      <br>
      <p>Saygılarımızla,<br>Flash USDT Bot Ekibi</p>
    `
  };
  
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('KYC approval email error:', error);
  }
}

async function sendKYCRejectionEmail(email, name, reason) {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: 'KYC Başvurunuz Hakkında',
    html: `
      <h2>Merhaba ${name},</h2>
      <p>Maalesef KYC doğrulama başvurunuz onaylanamamıştır.</p>
      <p><strong>Sebep:</strong> ${reason}</p>
      <p>Eksiklikleri tamamlayarak tekrar başvuru yapabilirsiniz.</p>
      <p>Sorularınız için destek ekibimizle iletişime geçebilirsiniz.</p>
      <br>
      <p>Saygılarımızla,<br>Flash USDT Bot Ekibi</p>
    `
  };
  
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('KYC rejection email error:', error);
  }
}

async function sendInvestmentConfirmationEmail(email, name, amount) {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: 'Yatırım Onayı',
    html: `
      <h2>Merhaba ${name}!</h2>
      <p>Yatırımınız başarıyla kaydedilmiştir.</p>
      <p><strong>Yatırım Miktarı:</strong> ${amount} ETH</p>
      <p>Bot otomatik olarak arbitraj işlemlerine başlayacak ve karlar hesabınıza dağıtılacaktır.</p>
      <p>Dashboard'unuzdan yatırım durumunuzu takip edebilirsiniz.</p>
      <br>
      <p>Saygılarımızla,<br>Flash USDT Bot Ekibi</p>
    `
  };
  
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Investment confirmation email error:', error);
  }
}

async function sendKYCNotificationToAdmin(userEmail, userName) {
  const msg = {
    to: process.env.ADMIN_EMAIL,
    from: process.env.FROM_EMAIL,
    subject: 'Yeni KYC Başvurusu',
    html: `
      <h2>Yeni KYC Başvurusu</h2>
      <p><strong>Kullanıcı:</strong> ${userName}</p>
      <p><strong>E-posta:</strong> ${userEmail}</p>
      <p>Admin panelinden inceleyebilirsiniz.</p>
    `
  };
  
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('KYC admin notification error:', error);
  }
}

async function sendContactNotificationToSupport(name, email, subject, message, category) {
  const msg = {
    to: process.env.SUPPORT_EMAIL,
    from: process.env.FROM_EMAIL,
    subject: `Yeni Destek Talebi: ${subject}`,
    html: `
      <h2>Yeni Destek Talebi</h2>
      <p><strong>Ad:</strong> ${name}</p>
      <p><strong>E-posta:</strong> ${email}</p>
      <p><strong>Kategori:</strong> ${category}</p>
      <p><strong>Konu:</strong> ${subject}</p>
      <p><strong>Mesaj:</strong></p>
      <p>${message}</p>
    `
  };
  
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Contact notification error:', error);
  }
}

async function sendContactConfirmationEmail(email, name) {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: 'Mesajınız Alındı',
    html: `
      <h2>Merhaba ${name}!</h2>
      <p>Mesajınız başarıyla alınmıştır.</p>
      <p>Destek ekibimiz 24 saat içinde size geri dönüş yapacaktır.</p>
      <br>
      <p>Saygılarımızla,<br>Flash USDT Bot Destek Ekibi</p>
    `
  };
  
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Contact confirmation email error:', error);
  }
}

// Blockchain event listeners
function setupBlockchainListeners() {
  // Listen for investment events
  contract.on('InvestmentReceived', async (investor, amount, timestamp, event) => {
    try {
      console.log('Investment received:', { investor, amount: ethers.utils.formatEther(amount), timestamp });
      
      // Update database with real blockchain data
      await pool.query(
        `UPDATE investments SET 
         blockchain_confirmed = true, 
         block_number = $1, 
         block_timestamp = to_timestamp($2)
         WHERE transaction_hash = $3`,
        [event.blockNumber, timestamp.toNumber(), event.transactionHash]
      );
      
      // Send notification email
      const user = await pool.query('SELECT email, first_name FROM users WHERE wallet_address = $1', [investor]);
      if (user.rows.length > 0) {
        await sendInvestmentConfirmationEmail(
          user.rows[0].email, 
          user.rows[0].first_name, 
          ethers.utils.formatEther(amount)
        );
      }
      
    } catch (error) {
      console.error('Investment event processing error:', error);
    }
  });
  
  // Listen for arbitrage events
  contract.on('RealArbitrageExecuted', async (tokenA, tokenB, profit, gasUsed, txHash, event) => {
    try {
      console.log('Arbitrage executed:', { 
        tokenA, 
        tokenB, 
        profit: ethers.utils.formatEther(profit), 
        gasUsed: gasUsed.toString() 
      });
      
      // Record arbitrage transaction
      await pool.query(
        `INSERT INTO arbitrage_transactions (
          token_a, token_b, profit_amount, gas_used, transaction_hash, 
          block_number, block_timestamp, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, to_timestamp($7), NOW())`,
        [
          tokenA, 
          tokenB, 
          ethers.utils.formatEther(profit), 
          gasUsed.toString(), 
          txHash, 
          event.blockNumber,
          (await provider.getBlock(event.blockNumber)).timestamp
        ]
      );
      
      // Distribute profits to investors
      await distributeProfitsToInvestors(profit);
      
    } catch (error) {
      console.error('Arbitrage event processing error:', error);
    }
  });
  
  // Listen for emergency events
  contract.on('EmergencyActivated', async (reason, timestamp, event) => {
    try {
      console.log('Emergency activated:', { reason, timestamp });
      
      // Send emergency notifications to all users
      const users = await pool.query('SELECT email, first_name FROM users WHERE kyc_status = $1', ['approved']);
      
      for (const user of users.rows) {
        await sendEmergencyNotificationEmail(user.email, user.first_name, reason);
      }
      
      // Send alert to admin
      await sendEmergencyAlertToAdmin(reason);
      
    } catch (error) {
      console.error('Emergency event processing error:', error);
    }
  });
}

async function distributeProfitsToInvestors(totalProfit) {
  try {
    // Get all active investments
    const investments = await pool.query(`
      SELECT user_id, investment_amount, 
             (investment_amount / SUM(investment_amount) OVER()) as share
      FROM investments 
      WHERE status = 'active'
    `);
    
    const profitAmount = parseFloat(ethers.utils.formatEther(totalProfit));
    const investorShare = profitAmount * 0.7; // 70% to investors
    
    for (const investment of investments.rows) {
      const userProfit = investorShare * investment.share;
      
      // Update user profit
      await pool.query(
        `UPDATE investments SET 
         profit_amount = COALESCE(profit_amount, 0) + $1,
         last_profit_date = NOW()
         WHERE user_id = $2 AND status = 'active'`,
        [userProfit, investment.user_id]
      );
      
      // Record profit distribution
      await pool.query(
        `INSERT INTO profit_distributions (user_id, amount, distribution_date)
         VALUES ($1, $2, NOW())`,
        [investment.user_id, userProfit]
      );
    }
    
  } catch (error) {
    console.error('Profit distribution error:', error);
  }
}

async function sendEmergencyNotificationEmail(email, name, reason) {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: '🚨 Acil Durum Bildirimi - Flash USDT Bot',
    html: `
      <h2>Acil Durum Bildirimi</h2>
      <p>Merhaba ${name},</p>
      <p>Flash USDT Bot sisteminde acil durum modu aktif edilmiştir.</p>
      <p><strong>Sebep:</strong> ${reason}</p>
      <p>Yatırımlarınız güvende ve acil çekim işlemi yapabilirsiniz.</p>
      <p>Detaylı bilgi için dashboard'unuzu kontrol edin.</p>
      <br>
      <p>Flash USDT Bot Ekibi</p>
    `
  };
  
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Emergency notification email error:', error);
  }
}

async function sendEmergencyAlertToAdmin(reason) {
  const msg = {
    to: process.env.ADMIN_EMAIL,
    from: process.env.FROM_EMAIL,
    subject: '🚨 EMERGENCY ALERT - Flash USDT Bot',
    html: `
      <h2>EMERGENCY ALERT</h2>
      <p>Emergency mode has been activated.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>Immediate action may be required.</p>
    `
  };
  
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Emergency alert email error:', error);
  }
}

// Start server and setup blockchain listeners
setupBlockchainListeners();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});