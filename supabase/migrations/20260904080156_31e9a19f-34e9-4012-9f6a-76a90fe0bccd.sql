DROP FUNCTION IF EXISTS public.claim_daily_admin_credits();

CREATE OR REPLACE FUNCTION public.claim_daily_admin_credits(_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
  already boolean;
  new_balance numeric;
BEGIN
  IF _user_id IS NULL THEN RETURN NULL; END IF;

  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','admin'))
    INTO is_admin;
  IF NOT is_admin THEN
    RETURN (SELECT balance FROM public.credit_accounts WHERE user_id = _user_id);
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.credit_transactions
     WHERE user_id = _user_id
       AND reference_type = 'daily_admin'
       AND created_at >= date_trunc('day', now())
  ) INTO already;

  IF already THEN
    RETURN (SELECT balance FROM public.credit_accounts WHERE user_id = _user_id);
  END IF;

  INSERT INTO public.credit_accounts (user_id, balance)
  VALUES (_user_id, 0) ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.credit_accounts
     SET balance = balance + 1000, updated_at = now()
   WHERE user_id = _user_id
  RETURNING balance INTO new_balance;

  INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, reference_type, description)
  VALUES (_user_id, 'bonus', 1000, new_balance, 'daily_admin', 'Renouvellement quotidien administrateur (+1000, cumulable)');

  RETURN new_balance;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_daily_admin_credits(uuid) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_daily_admin_credits(uuid) TO service_role;