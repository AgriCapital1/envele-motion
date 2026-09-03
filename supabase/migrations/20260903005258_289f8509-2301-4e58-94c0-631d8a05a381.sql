-- audit_logs: interdire toute écriture client
REVOKE INSERT, UPDATE, DELETE ON public.audit_logs FROM anon, authenticated;

CREATE POLICY "audit_logs no client insert"
ON public.audit_logs AS RESTRICTIVE FOR INSERT TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "audit_logs no client update"
ON public.audit_logs AS RESTRICTIVE FOR UPDATE TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "audit_logs no client delete"
ON public.audit_logs AS RESTRICTIVE FOR DELETE TO anon, authenticated
USING (false);

-- user_roles: interdire toute écriture client
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon, authenticated;

CREATE POLICY "user_roles no client insert"
ON public.user_roles AS RESTRICTIVE FOR INSERT TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "user_roles no client update"
ON public.user_roles AS RESTRICTIVE FOR UPDATE TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "user_roles no client delete"
ON public.user_roles AS RESTRICTIVE FOR DELETE TO anon, authenticated
USING (false);