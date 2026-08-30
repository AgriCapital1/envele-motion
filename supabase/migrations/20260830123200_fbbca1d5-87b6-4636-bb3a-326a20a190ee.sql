CREATE OR REPLACE FUNCTION public.spend_credits(
  _user_id UUID, _amount NUMERIC, _ref_type TEXT, _ref_id UUID, _description TEXT
) RETURNS NUMERIC LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_balance NUMERIC;
BEGIN
  UPDATE public.credit_accounts
     SET balance = balance - _amount,
         lifetime_used = lifetime_used + _amount,
         updated_at = now()
   WHERE user_id = _user_id AND balance >= _amount
  RETURNING balance INTO new_balance;

  IF new_balance IS NULL THEN
    RAISE EXCEPTION 'INSUFFICIENT_CREDITS';
  END IF;

  INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, reference_type, reference_id, description)
  VALUES (_user_id, 'usage', -_amount, new_balance, _ref_type, _ref_id, _description);

  RETURN new_balance;
END; $$;

REVOKE EXECUTE ON FUNCTION public.spend_credits(uuid, numeric, text, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.spend_credits(uuid, numeric, text, uuid, text) TO service_role;

CREATE OR REPLACE FUNCTION public.refund_credits(
  _user_id UUID, _amount NUMERIC, _ref_type TEXT, _ref_id UUID, _description TEXT
) RETURNS NUMERIC LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_balance NUMERIC;
BEGIN
  UPDATE public.credit_accounts
     SET balance = balance + _amount, lifetime_used = greatest(lifetime_used - _amount, 0), updated_at = now()
   WHERE user_id = _user_id
  RETURNING balance INTO new_balance;

  INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, reference_type, reference_id, description)
  VALUES (_user_id, 'refund', _amount, new_balance, _ref_type, _ref_id, _description);

  RETURN new_balance;
END; $$;

REVOKE EXECUTE ON FUNCTION public.refund_credits(uuid, numeric, text, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refund_credits(uuid, numeric, text, uuid, text) TO service_role;