CREATE OR REPLACE FUNCTION public.claim_daily_admin_credits()
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  is_admin boolean;
  already boolean;
  new_balance numeric;
BEGIN
  IF uid IS NULL THEN RETURN NULL; END IF;

  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = uid AND role IN ('super_admin','admin'))
    INTO is_admin;
  IF NOT is_admin THEN
    RETURN (SELECT balance FROM public.credit_accounts WHERE user_id = uid);
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.credit_transactions
     WHERE user_id = uid
       AND reference_type = 'daily_admin'
       AND created_at >= date_trunc('day', now())
  ) INTO already;

  IF already THEN
    RETURN (SELECT balance FROM public.credit_accounts WHERE user_id = uid);
  END IF;

  INSERT INTO public.credit_accounts (user_id, balance)
  VALUES (uid, 0) ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.credit_accounts
     SET balance = balance + 1000, updated_at = now()
   WHERE user_id = uid
  RETURNING balance INTO new_balance;

  INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, reference_type, description)
  VALUES (uid, 'bonus', 1000, new_balance, 'daily_admin', 'Renouvellement quotidien administrateur (+1000, cumulable)');

  RETURN new_balance;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_daily_admin_credits() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.claim_daily_admin_credits() TO authenticated, service_role;