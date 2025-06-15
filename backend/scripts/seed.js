const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Create admin user if not exists
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
    
    await pool.query(`
      INSERT INTO users (
        email, password_hash, wallet_address, name, first_name, last_name,
        kyc_status, role, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, NOW()
      ) ON CONFLICT (email) DO NOTHING
    `, [
      'admin@flashusdt.com',
      adminPassword,
      '0x0000000000000000000000000000000000000000',
      'System Administrator',
      'System',
      'Administrator',
      'approved',
      'admin'
    ]);
    
    // Insert sample system settings
    const settings = [
      ['min_investment', '0.01', 'Minimum investment amount in ETH'],
      ['max_investment', '100', 'Maximum investment amount in ETH'],
      ['investor_profit_share', '70', 'Percentage of profits distributed to investors'],
      ['team_profit_share', '20', 'Percentage of profits for team'],
      ['operations_profit_share', '10', 'Percentage of profits for operations'],
      ['emergency_loss_threshold', '5', 'Daily loss percentage that triggers emergency mode'],
      ['kyc_auto_approval', 'false', 'Whether to auto-approve KYC submissions'],
      ['maintenance_mode', 'false', 'Whether the system is in maintenance mode']
    ];
    
    for (const [key, value, description] of settings) {
      await pool.query(`
        INSERT INTO system_settings (key, value, description, created_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (key) DO UPDATE SET
          value = EXCLUDED.value,
          description = EXCLUDED.description,
          updated_at = NOW()
      `, [key, value, description]);
    }
    
    // Initialize bot stats cache
    await pool.query(`
      INSERT INTO bot_stats_cache (
        total_profit, total_trades, successful_trades, 
        total_investors, total_investment, success_rate, 
        emergency_mode, last_updated
      ) VALUES (0, 0, 0, 0, 0, 0, false, NOW())
      ON CONFLICT (id) DO NOTHING
    `);
    
    // Create sample test users (only in development)
    if (process.env.NODE_ENV === 'development') {
      const testUsers = [
        {
          email: 'investor1@test.com',
          password: 'test123',
          wallet: '0x1111111111111111111111111111111111111111',
          name: 'Test Investor 1',
          firstName: 'Test',
          lastName: 'Investor1'
        },
        {
          email: 'investor2@test.com',
          password: 'test123',
          wallet: '0x2222222222222222222222222222222222222222',
          name: 'Test Investor 2',
          firstName: 'Test',
          lastName: 'Investor2'
        }
      ];
      
      for (const user of testUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        
        await pool.query(`
          INSERT INTO users (
            email, password_hash, wallet_address, name, first_name, last_name,
            kyc_status, role, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, 'approved', 'user', NOW()
          ) ON CONFLICT (email) DO NOTHING
        `, [
          user.email,
          hashedPassword,
          user.wallet,
          user.name,
          user.firstName,
          user.lastName
        ]);
      }
      
      console.log('👥 Created test users for development');
    }
    
    console.log('✅ Database seeding completed successfully!');
    
    // Show summary
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const settingsCount = await pool.query('SELECT COUNT(*) FROM system_settings');
    
    console.log('📊 Seeding Summary:');
    console.log(`  - Users: ${userCount.rows[0].count}`);
    console.log(`  - System Settings: ${settingsCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();