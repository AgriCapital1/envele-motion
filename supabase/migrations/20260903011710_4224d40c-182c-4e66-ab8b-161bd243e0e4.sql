-- 1. Recreate pricing_public as a security_invoker view (fixes security definer view lint)
DROP VIEW IF EXISTS public.pricing_public;
CREATE VIEW public.pricing_public
WITH (security_invoker = true) AS
SELECT duration_seconds, label, price_fcfa, credits
FROM public.pricing_rules
WHERE active = true;

GRANT SELECT ON public.pricing_public TO anon;
GRANT SELECT ON public.pricing_public TO authenticated;

-- 2. Ownership-scoped write policies for the productions bucket
CREATE POLICY "productions owner insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'productions' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "productions owner update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'productions' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'productions' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "productions owner delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'productions' AND (storage.foldername(name))[1] = auth.uid()::text);