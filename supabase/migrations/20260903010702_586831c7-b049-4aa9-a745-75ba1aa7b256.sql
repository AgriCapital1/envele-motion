DROP POLICY IF EXISTS "pricing public read" ON public.pricing_rules;
REVOKE SELECT ON public.pricing_rules FROM anon;

CREATE OR REPLACE VIEW public.pricing_public AS
SELECT model_key, duration_seconds, label, price_fcfa, credits
FROM public.pricing_rules
WHERE active = true;

GRANT SELECT ON public.pricing_public TO anon, authenticated;