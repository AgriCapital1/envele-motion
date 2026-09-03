-- Column-level read of safe pricing columns only (cost/margin stay hidden)
GRANT SELECT (duration_seconds, label, price_fcfa, credits, active) ON public.pricing_rules TO anon;
GRANT SELECT (duration_seconds, label, price_fcfa, credits, active) ON public.pricing_rules TO authenticated;

-- Row-level: only active rules are visible through these grants
CREATE POLICY "pricing public read active"
ON public.pricing_rules FOR SELECT TO anon, authenticated
USING (active = true);