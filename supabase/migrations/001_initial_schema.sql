-- CREAVO Database Schema
-- Version: 1.0.0
-- Description: Initial schema for CREAVO UGC platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    plan TEXT NOT NULL DEFAULT 'start' CHECK (plan IN ('start', 'pro', 'business', 'enterprise')),
    credits_balance INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, avatar_url, plan, credits_balance)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'avatar_url',
        'start',
        50  -- Free credits for new users
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- PROJECTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'video' CHECK (type IN ('image', 'video')),
    canvas_data JSONB,
    thumbnail_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'done', 'failed')),
    credits_used INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user projects
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- RLS for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own projects"
    ON projects FOR ALL
    USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- GENERATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    provider TEXT NOT NULL CHECK (provider IN ('kling', 'dalle', 'flux', 'gemini')),
    prompt TEXT NOT NULL,
    input_url TEXT,
    output_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'done', 'failed')),
    credits_cost INTEGER NOT NULL DEFAULT 1,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for generations
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);
CREATE INDEX IF NOT EXISTS idx_generations_project_id ON generations(project_id);

-- RLS for generations
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own generations"
    ON generations FOR ALL
    USING (auth.uid() = user_id);

-- =============================================
-- TEMPLATES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    thumbnail_url TEXT,
    canvas_data JSONB,
    prompt_template TEXT,
    recommended_settings JSONB,
    usage_count INTEGER NOT NULL DEFAULT 0,
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for templates
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);

-- RLS for templates (public read)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view templates"
    ON templates FOR SELECT
    USING (true);

CREATE POLICY "Users can view premium templates if they have pro plan"
    ON templates FOR SELECT
    USING (
        is_premium = FALSE 
        OR (auth.uid() IN (SELECT id FROM profiles WHERE plan IN ('pro', 'business', 'enterprise')))
    );

-- Insert some default templates
INSERT INTO templates (name, category, prompt_template, is_premium) VALUES
    ('Talking Head', 'ugc', 'Create a talking head video of a person presenting a product', FALSE),
    ('Product Showcase', 'ugc', 'Create a rotating product showcase video', FALSE),
    ('Before/After', 'ugc', 'Create a transformation comparison video', FALSE),
    ('Testimonial', 'ugc', 'Create a customer testimonial style video', FALSE),
    ('Tutorial', 'ugc', 'Create a how-to tutorial video', FALSE);

-- =============================================
-- TRANSACTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'refund', 'expiry')),
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description TEXT,
    payment_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- RLS for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert transactions"
    ON transactions FOR INSERT
    WITH CHECK (true);

-- =============================================
-- API KEYS TABLE (Enterprise)
-- =============================================
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for api_keys
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- RLS for api_keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own API keys"
    ON api_keys FOR ALL
    USING (auth.uid() = user_id);

-- =============================================
-- STORAGE BUCKETS
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('inputs', 'inputs', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('outputs', 'outputs', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can upload to inputs bucket"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'inputs');

CREATE POLICY "Anyone can view inputs bucket"
    ON storage.objects FOR SELECT
    WHERE bucket_id = 'inputs';

CREATE POLICY "Authenticated users can upload to outputs bucket"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'outputs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view own outputs"
    ON storage.objects FOR SELECT
    WHERE bucket_id = 'outputs' AND auth.uid()::text = (storage.foldername(name))[1];

CREATE POLICY "Users can upload thumbnails"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view thumbnails"
    ON storage.objects FOR SELECT
    WHERE bucket_id = 'thumbnails';

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to deduct credits
CREATE OR REPLACE FUNCTION deduct_credits(
    p_user_id UUID,
    p_amount INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_balance INTEGER;
BEGIN
    SELECT credits_balance INTO v_current_balance
    FROM profiles
    WHERE id = p_user_id
    FOR UPDATE;

    IF v_current_balance >= p_amount THEN
        UPDATE profiles
        SET credits_balance = credits_balance - p_amount
        WHERE id = p_user_id;

        INSERT INTO transactions (user_id, type, amount, balance_after, description)
        VALUES (p_user_id, 'usage', -p_amount, v_current_balance - p_amount, 'Generation');

        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits (on purchase)
CREATE OR REPLACE FUNCTION add_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_payment_id TEXT,
    p_description TEXT
)
RETURNS VOID AS $$
DECLARE
    v_current_balance INTEGER;
BEGIN
    SELECT credits_balance INTO v_current_balance
    FROM profiles
    WHERE id = p_user_id
    FOR UPDATE;

    UPDATE profiles
    SET credits_balance = credits_balance + p_amount
    WHERE id = p_user_id;

    INSERT INTO transactions (user_id, type, amount, balance_after, payment_id, description)
    VALUES (p_user_id, 'purchase', p_amount, v_current_balance + p_amount, p_payment_id, COALESCE(p_description, 'Credit purchase'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
