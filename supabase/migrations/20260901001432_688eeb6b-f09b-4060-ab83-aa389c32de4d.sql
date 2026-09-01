-- 1. referrals: explicit deny-write for clients
REVOKE INSERT, UPDATE, DELETE ON public.referrals FROM anon, authenticated;
GRANT SELECT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;

DROP POLICY IF EXISTS "referrals no client insert" ON public.referrals;
DROP POLICY IF EXISTS "referrals no client update" ON public.referrals;
DROP POLICY IF EXISTS "referrals no client delete" ON public.referrals;

CREATE POLICY "referrals no client insert" ON public.referrals
  AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "referrals no client update" ON public.referrals
  AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "referrals no client delete" ON public.referrals
  AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);

-- 2. projects: protect backend-controlled fields from client updates
CREATE OR REPLACE FUNCTION public.guard_projects_backend_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF current_setting('role', true) = 'service_role'
     OR current_user IN ('postgres', 'supabase_admin', 'service_role') THEN
    RETURN NEW;
  END IF;

  NEW.status := OLD.status;
  NEW.credits_spent := OLD.credits_spent;
  NEW.quality_score := OLD.quality_score;
  NEW.bible := OLD.bible;
  NEW.production_plan := OLD.production_plan;
  NEW.version := OLD.version;
  NEW.user_id := OLD.user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_projects_guard_backend_fields ON public.projects;
CREATE TRIGGER trg_projects_guard_backend_fields
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.guard_projects_backend_fields();

-- 3. characters: protect system-controlled fields from client updates
CREATE OR REPLACE FUNCTION public.guard_characters_backend_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF current_setting('role', true) = 'service_role'
     OR current_user IN ('postgres', 'supabase_admin', 'service_role') THEN
    RETURN NEW;
  END IF;

  NEW.locked_traits := OLD.locked_traits;
  NEW.reference_images := OLD.reference_images;
  NEW.user_id := OLD.user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_characters_guard_backend_fields ON public.characters;
CREATE TRIGGER trg_characters_guard_backend_fields
  BEFORE UPDATE ON public.characters
  FOR EACH ROW EXECUTE FUNCTION public.guard_characters_backend_fields();