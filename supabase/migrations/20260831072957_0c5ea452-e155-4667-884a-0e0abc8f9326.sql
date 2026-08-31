-- 1. Move the role-check helper out of the API-exposed schema
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP POLICY IF EXISTS "audit admin read" ON public.audit_logs;
CREATE POLICY "audit admin read" ON public.audit_logs
FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'super_admin') OR private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "pricing admin write" ON public.pricing_rules;
CREATE POLICY "pricing admin write" ON public.pricing_rules
FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'super_admin') OR private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'finance'))
WITH CHECK (private.has_role(auth.uid(), 'super_admin') OR private.has_role(auth.uid(), 'admin') OR private.has_role(auth.uid(), 'finance'));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- 2. Explicitly forbid any client-side writes on financial and job tables
REVOKE INSERT, UPDATE, DELETE ON public.credit_accounts FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.credit_transactions FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.generation_jobs FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.video_sequences FROM anon, authenticated;

CREATE POLICY "credit_accounts no client insert" ON public.credit_accounts AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "credit_accounts no client update" ON public.credit_accounts AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "credit_accounts no client delete" ON public.credit_accounts AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);

CREATE POLICY "credit_transactions no client insert" ON public.credit_transactions AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "credit_transactions no client update" ON public.credit_transactions AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "credit_transactions no client delete" ON public.credit_transactions AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);

CREATE POLICY "generation_jobs no client insert" ON public.generation_jobs AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "generation_jobs no client update" ON public.generation_jobs AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "generation_jobs no client delete" ON public.generation_jobs AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);

CREATE POLICY "video_sequences no client insert" ON public.video_sequences AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "video_sequences no client update" ON public.video_sequences AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "video_sequences no client delete" ON public.video_sequences AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);