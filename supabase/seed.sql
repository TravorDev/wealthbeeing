-- Seed a single user
INSERT INTO users (id, email, full_name, phone_number, date_of_birth, employment_status, annual_income, risk_profile)
VALUES (
    '98f4b776-b613-4616-a025-8ad2eff73356',
    'john.doe@example.com',
    'John Doe',
    '+1234567890',
    '1985-06-15',
    'employed',
    85000.00,
    'moderate'
);

-- Seed financial goals
INSERT INTO financial_goals (user_id, goal_type, target_amount, current_amount, target_date, priority, status)
VALUES (
    '98f4b776-b613-4616-a025-8ad2eff73356',
    'retirement',
    1000000.00,
    250000.00,
    '2045-06-15',
    1,
    'active'
);

-- Seed investment portfolio
INSERT INTO investment_portfolios (id, user_id, portfolio_type, risk_level, target_allocation, current_allocation, total_value, last_rebalanced_at)
VALUES (
    'b5f4b776-c613-4616-a025-8ad2eff73356',
    '98f4b776-b613-4616-a025-8ad2eff73356',
    'balanced',
    'medium',
    '{"stocks": 60, "bonds": 30, "cash": 10}'::jsonb,
    '{"stocks": 62, "bonds": 28, "cash": 10}'::jsonb,
    275000.00,
    NOW()
);

-- Seed financial assessment
INSERT INTO financial_assessments (user_id, monthly_income, monthly_expenses, total_assets, total_liabilities, emergency_fund, debt_to_income_ratio, next_review_date)
VALUES (
    '98f4b776-b613-4616-a025-8ad2eff73356',
    7083.33,
    4500.00,
    350000.00,
    180000.00,
    25000.00,
    0.28,
    NOW() + INTERVAL '6 months'
);

-- Seed advisory session
INSERT INTO advisory_sessions (user_id, session_type, session_status, session_date, duration, advisor_notes, follow_up_actions)
VALUES (
    '98f4b776-b613-4616-a025-8ad2eff73356',
    'initial_consultation',
    'completed',
    NOW() - INTERVAL '1 week',
    60,
    'Client interested in retirement planning and home purchase. Conservative approach to risk.',
    ARRAY['Create retirement projection', 'Research mortgage options']
);

-- Seed transaction
INSERT INTO transactions (user_id, transaction_type, amount, description, portfolio_id, status)
VALUES (
    '98f4b776-b613-4616-a025-8ad2eff73356',
    'deposit',
    5000.00,
    'Monthly investment contribution',
    'b5f4b776-c613-4616-a025-8ad2eff73356',
    'completed'
);

-- Seed notification
INSERT INTO notifications (user_id, title, message, notification_type, read)
VALUES (
    '98f4b776-b613-4616-a025-8ad2eff73356',
    'Portfolio Rebalancing Due',
    'Your portfolio is due for quarterly rebalancing',
    'portfolio_alert',
    false
); 