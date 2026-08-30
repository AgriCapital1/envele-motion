-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('super_admin','admin','ai_manager','voice_manager','lingua_manager','moderator','finance','support');
CREATE TYPE public.job_status AS ENUM ('QUEUED','PLANNED','ANALYZING','GENERATING','QUALITY_CHECK','REGENERATING','COMPOSITING','FINALIZING','COMPLETED','FAILED','CANCELLED','PAUSED');
CREATE TYPE public.credit_tx_type AS ENUM ('purchase','usage','reserve','refund','bonus','referral','promo');

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  country TEXT,
  phone TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'fr',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- ============ CREDITS ============
CREATE TABLE public.credit_accounts (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance NUMERIC(14,2) NOT NULL DEFAULT 0,
  reserved NUMERIC(14,2) NOT NULL DEFAULT 0,
  lifetime_purchased NUMERIC(14,2) NOT NULL DEFAULT 0,
  lifetime_used NUMERIC(14,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.credit_accounts TO authenticated;
GRANT ALL ON public.credit_accounts TO service_role;
ALTER TABLE public.credit_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own credits" ON public.credit_accounts FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.credit_tx_type NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  balance_after NUMERIC(14,2),
  reference_type TEXT,
  reference_id UUID,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.credit_transactions TO authenticated;
GRANT ALL ON public.credit_transactions TO service_role;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own tx" ON public.credit_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX idx_credit_tx_user ON public.credit_transactions(user_id, created_at DESC);

-- ============ PRICING ============
CREATE TABLE public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_key TEXT NOT NULL,
  duration_seconds INT NOT NULL,
  label TEXT NOT NULL,
  price_fcfa NUMERIC(12,2) NOT NULL,
  credits NUMERIC(10,2) NOT NULL,
  estimated_cost_fcfa NUMERIC(12,2) NOT NULL DEFAULT 0,
  target_margin NUMERIC(5,4) NOT NULL DEFAULT 0.18,
  safety_coefficient NUMERIC(5,4) NOT NULL DEFAULT 1.15,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (model_key, duration_seconds)
);
GRANT SELECT ON public.pricing_rules TO authenticated, anon;
GRANT ALL ON public.pricing_rules TO service_role;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pricing public read" ON public.pricing_rules FOR SELECT TO authenticated, anon USING (active = true);
CREATE POLICY "pricing admin write" ON public.pricing_rules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'finance'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'finance'));
CREATE TRIGGER trg_pricing_updated BEFORE UPDATE ON public.pricing_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.pricing_rules (model_key, duration_seconds, label, price_fcfa, credits, estimated_cost_fcfa) VALUES
('gemini-omni', 15, '15 secondes', 2000, 20, 1600),
('gemini-omni', 30, '30 secondes', 3500, 35, 2800),
('gemini-omni', 45, '45 secondes', 5000, 50, 4000),
('gemini-omni', 60, '1 minute', 6500, 65, 5200),
('gemini-omni', 90, '1 min 30', 9500, 95, 7700),
('gemini-omni', 120, '2 minutes', 12500, 125, 10200),
('gemini-omni', 180, '3 minutes', 18000, 180, 14700),
('gemini-omni', 300, '5 minutes', 29000, 290, 23800);

-- ============ PROJECTS ============
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Nouvelle production',
  brief TEXT NOT NULL,
  duration_seconds INT NOT NULL DEFAULT 15,
  aspect_ratio TEXT NOT NULL DEFAULT '16:9',
  style TEXT NOT NULL DEFAULT 'realiste',
  language TEXT NOT NULL DEFAULT 'fr',
  model_key TEXT NOT NULL DEFAULT 'auto',
  status public.job_status NOT NULL DEFAULT 'QUEUED',
  bible JSONB NOT NULL DEFAULT '{}'::jsonb,
  production_plan JSONB NOT NULL DEFAULT '{}'::jsonb,
  on_screen_text TEXT,
  quality_score INT,
  credits_spent NUMERIC(10,2) NOT NULL DEFAULT 0,
  version INT NOT NULL DEFAULT 1,
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own projects" ON public.projects FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_projects_user ON public.projects(user_id, created_at DESC);

-- ============ CHARACTERS ============
CREATE TABLE public.characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  apparent_age TEXT,
  gender TEXT,
  appearance JSONB NOT NULL DEFAULT '{}'::jsonb,
  wardrobe JSONB NOT NULL DEFAULT '{}'::jsonb,
  voice JSONB NOT NULL DEFAULT '{}'::jsonb,
  locked_traits JSONB NOT NULL DEFAULT '{}'::jsonb,
  reference_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.characters TO authenticated;
GRANT ALL ON public.characters TO service_role;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own characters" ON public.characters FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_characters_updated BEFORE UPDATE ON public.characters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ GENERATION JOBS ============
CREATE TABLE public.generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'production',
  status public.job_status NOT NULL DEFAULT 'QUEUED',
  progress INT NOT NULL DEFAULT 0,
  provider TEXT,
  model TEXT,
  provider_job_id TEXT,
  params JSONB NOT NULL DEFAULT '{}'::jsonb,
  estimated_cost_fcfa NUMERIC(12,2),
  actual_cost_fcfa NUMERIC(12,2),
  credits_charged NUMERIC(10,2) NOT NULL DEFAULT 0,
  attempts INT NOT NULL DEFAULT 0,
  error TEXT,
  quality_score INT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.generation_jobs TO authenticated;
GRANT ALL ON public.generation_jobs TO service_role;
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own jobs" ON public.generation_jobs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER trg_jobs_updated BEFORE UPDATE ON public.generation_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_jobs_project ON public.generation_jobs(project_id, created_at DESC);

-- ============ VIDEO SEQUENCES ============
CREATE TABLE public.video_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.generation_jobs(id) ON DELETE SET NULL,
  sequence_index INT NOT NULL DEFAULT 0,
  start_second INT NOT NULL DEFAULT 0,
  duration_seconds INT NOT NULL DEFAULT 8,
  prompt TEXT,
  storage_path TEXT,
  status public.job_status NOT NULL DEFAULT 'QUEUED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.video_sequences TO authenticated;
GRANT ALL ON public.video_sequences TO service_role;
ALTER TABLE public.video_sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own sequences" ON public.video_sequences FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX idx_seq_project ON public.video_sequences(project_id, sequence_index);

-- ============ REFERRALS ============
CREATE TABLE public.referrals (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  clicks INT NOT NULL DEFAULT 0,
  signups INT NOT NULL DEFAULT 0,
  conversions INT NOT NULL DEFAULT 0,
  credits_earned NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own referral" ON public.referrals FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ============ AUDIT LOG ============
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit admin read" ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'admin'));

-- ============ SIGNUP TRIGGER ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE gen_code TEXT;
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.credit_accounts (user_id, balance)
  VALUES (NEW.id, 20) ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, description)
  VALUES (NEW.id, 'bonus', 20, 20, 'Crédits de bienvenue E''nvlé Motion');

  gen_code := upper(substr(replace(NEW.id::text,'-',''), 1, 8));
  INSERT INTO public.referrals (user_id, code) VALUES (NEW.id, gen_code)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();