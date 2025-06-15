-- Flash USDT Liquidity Bot Database Schema
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    name VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    tc_kimlik VARCHAR(11),
    birth_date DATE,
    birth_place VARCHAR(100),
    nationality VARCHAR(50) DEFAULT 'Türkiye',
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(50) DEFAULT 'Türkiye',
    occupation VARCHAR(100),
    monthly_income VARCHAR(50),
    source_of_funds VARCHAR(100),
    investment_experience VARCHAR(50),
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'submitted', 'approved', 'rejected')),
    kyc_submitted_at TIMESTAMP,
    kyc_approved_at TIMESTAMP,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- KYC submissions table for manual review
CREATE TABLE kyc_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES users(id),
    review_reason TEXT,
    submitted_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP
);

-- Investments table
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    investment_amount DECIMAL(18, 8) NOT NULL,
    profit_amount DECIMAL(18, 8) DEFAULT 0,
    transaction_hash VARCHAR(66) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'emergency_withdrawn')),
    blockchain_confirmed BOOLEAN DEFAULT false,
    block_number BIGINT,
    block_timestamp TIMESTAMP,
    last_profit_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Profit distributions table
CREATE TABLE profit_distributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(18, 8) NOT NULL,
    distribution_date TIMESTAMP DEFAULT NOW(),
    transaction_hash VARCHAR(66),
    status VARCHAR(20) DEFAULT 'distributed' CHECK (status IN ('distributed', 'withdrawn'))
);

-- Arbitrage transactions table
CREATE TABLE arbitrage_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_a VARCHAR(42) NOT NULL,
    token_b VARCHAR(42) NOT NULL,
    profit_amount DECIMAL(18, 8) NOT NULL,
    gas_used BIGINT NOT NULL,
    transaction_hash VARCHAR(66) UNIQUE NOT NULL,
    block_number BIGINT NOT NULL,
    block_timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to UUID REFERENCES users(id),
    response TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- System settings table
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit log table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- API keys table
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    permissions JSONB DEFAULT '[]',
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Bot statistics cache table
CREATE TABLE bot_stats_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total_profit DECIMAL(18, 8) DEFAULT 0,
    total_trades BIGINT DEFAULT 0,
    successful_trades BIGINT DEFAULT 0,
    total_investors BIGINT DEFAULT 0,
    total_investment DECIMAL(18, 8) DEFAULT 0,
    success_rate DECIMAL(5, 2) DEFAULT 0,
    emergency_mode BOOLEAN DEFAULT false,
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_investments_transaction_hash ON investments(transaction_hash);
CREATE INDEX idx_profit_distributions_user_id ON profit_distributions(user_id);
CREATE INDEX idx_arbitrage_transactions_block_number ON arbitrage_transactions(block_number);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
('min_investment', '0.01', 'Minimum investment amount in ETH'),
('max_investment', '100', 'Maximum investment amount in ETH'),
('investor_profit_share', '70', 'Percentage of profits distributed to investors'),
('team_profit_share', '20', 'Percentage of profits for team'),
('operations_profit_share', '10', 'Percentage of profits for operations'),
('emergency_loss_threshold', '5', 'Daily loss percentage that triggers emergency mode'),
('kyc_auto_approval', 'false', 'Whether to auto-approve KYC submissions'),
('maintenance_mode', 'false', 'Whether the system is in maintenance mode');

-- Insert initial bot stats cache
INSERT INTO bot_stats_cache (
    total_profit, total_trades, successful_trades, 
    total_investors, total_investment, success_rate, 
    emergency_mode, last_updated
) VALUES (0, 0, 0, 0, 0, 0, false, NOW());

-- Create admin user (password: admin123 - CHANGE IN PRODUCTION!)
INSERT INTO users (
    email, password_hash, wallet_address, name, first_name, last_name,
    kyc_status, role, created_at
) VALUES (
    'admin@flashusdt.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', -- admin123
    '0x0000000000000000000000000000000000000000',
    'System Administrator',
    'System',
    'Administrator',
    'approved',
    'admin',
    NOW()
);

-- Create views for common queries
CREATE VIEW user_investment_summary AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.wallet_address,
    u.kyc_status,
    COALESCE(SUM(i.investment_amount), 0) as total_investment,
    COALESCE(SUM(i.profit_amount), 0) as total_profit,
    COUNT(i.id) as investment_count,
    MAX(i.created_at) as last_investment_date
FROM users u
LEFT JOIN investments i ON u.id = i.user_id AND i.status = 'active'
GROUP BY u.id, u.email, u.first_name, u.last_name, u.wallet_address, u.kyc_status;

CREATE VIEW daily_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as new_users,
    COUNT(CASE WHEN kyc_status = 'approved' THEN 1 END) as approved_users,
    COALESCE(SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END), 0) as regular_users
FROM users
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE VIEW investment_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as investment_count,
    SUM(investment_amount) as total_amount,
    AVG(investment_amount) as avg_amount,
    MIN(investment_amount) as min_amount,
    MAX(investment_amount) as max_amount
FROM investments
WHERE status = 'active'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Create function to update bot stats cache
CREATE OR REPLACE FUNCTION update_bot_stats_cache()
RETURNS void AS $$
BEGIN
    UPDATE bot_stats_cache SET
        total_investors = (SELECT COUNT(DISTINCT user_id) FROM investments WHERE status = 'active'),
        total_investment = (SELECT COALESCE(SUM(investment_amount), 0) FROM investments WHERE status = 'active'),
        last_updated = NOW()
    WHERE id = (SELECT id FROM bot_stats_cache LIMIT 1);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update stats when investments change
CREATE OR REPLACE FUNCTION trigger_update_bot_stats()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_bot_stats_cache();
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bot_stats_on_investment_change
    AFTER INSERT OR UPDATE OR DELETE ON investments
    FOR EACH ROW EXECUTE FUNCTION trigger_update_bot_stats();

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO flashusdt_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO flashusdt_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO flashusdt_user;

COMMENT ON TABLE users IS 'User accounts and KYC information';
COMMENT ON TABLE kyc_submissions IS 'KYC submissions for manual review';
COMMENT ON TABLE investments IS 'User investments and profits';
COMMENT ON TABLE profit_distributions IS 'Profit distribution history';
COMMENT ON TABLE arbitrage_transactions IS 'Blockchain arbitrage transaction records';
COMMENT ON TABLE contact_messages IS 'Customer support messages';
COMMENT ON TABLE system_settings IS 'System configuration settings';
COMMENT ON TABLE audit_logs IS 'System audit trail';
COMMENT ON TABLE api_keys IS 'API access keys for users';
COMMENT ON TABLE notifications IS 'User notifications';
COMMENT ON TABLE bot_stats_cache IS 'Cached bot statistics for performance';