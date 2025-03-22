-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    date_of_birth DATE,
    employment_status TEXT CHECK (employment_status IN ('employed', 'self_employed', 'unemployed', 'retired')),
    annual_income DECIMAL(15,2),
    risk_profile TEXT CHECK (risk_profile IN ('conservative', 'moderate', 'aggressive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create financial_goals table
CREATE TABLE financial_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    goal_type TEXT CHECK (goal_type IN ('retirement', 'investment', 'savings', 'debt_repayment', 'major_purchase')),
    target_amount DECIMAL(15,2),
    current_amount DECIMAL(15,2),
    target_date DATE,
    priority INTEGER CHECK (priority BETWEEN 1 AND 5),
    status TEXT CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create investment_portfolios table
CREATE TABLE investment_portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    portfolio_type TEXT CHECK (portfolio_type IN ('retirement', 'growth', 'income', 'balanced')),
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
    target_allocation JSONB,
    current_allocation JSONB,
    total_value DECIMAL(15,2),
    last_rebalanced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create financial_assessments table
CREATE TABLE financial_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    monthly_income DECIMAL(15,2),
    monthly_expenses DECIMAL(15,2),
    total_assets DECIMAL(15,2),
    total_liabilities DECIMAL(15,2),
    emergency_fund DECIMAL(15,2),
    debt_to_income_ratio DECIMAL(5,2),
    assessment_date TIMESTAMPTZ DEFAULT NOW(),
    next_review_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create advisory_sessions table
CREATE TABLE advisory_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    advisor_notes TEXT,
    session_type TEXT CHECK (session_type IN ('initial_consultation', 'portfolio_review', 'financial_planning', 'retirement_planning')),
    session_status TEXT CHECK (session_status IN ('scheduled', 'completed', 'cancelled')),
    session_date TIMESTAMPTZ,
    duration INTEGER, -- in minutes
    follow_up_actions TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_type TEXT CHECK (transaction_type IN ('deposit', 'withdrawal', 'investment', 'fee', 'dividend')),
    amount DECIMAL(15,2),
    description TEXT,
    portfolio_id UUID REFERENCES investment_portfolios(id) ON DELETE SET NULL,
    transaction_date TIMESTAMPTZ DEFAULT NOW(),
    status TEXT CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT CHECK (notification_type IN ('goal_update', 'portfolio_alert', 'session_reminder', 'market_update')),
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_financial_goals_user ON financial_goals(user_id);
CREATE INDEX idx_investment_portfolios_user ON investment_portfolios(user_id);
CREATE INDEX idx_financial_assessments_user ON financial_assessments(user_id);
CREATE INDEX idx_advisory_sessions_user ON advisory_sessions(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_portfolio ON transactions(portfolio_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_goals_updated_at
    BEFORE UPDATE ON financial_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_portfolios_updated_at
    BEFORE UPDATE ON investment_portfolios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_assessments_updated_at
    BEFORE UPDATE ON financial_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advisory_sessions_updated_at
    BEFORE UPDATE ON advisory_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
