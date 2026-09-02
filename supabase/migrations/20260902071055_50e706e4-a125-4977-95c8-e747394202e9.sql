ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS voice_id text,
  ADD COLUMN IF NOT EXISTS reference_images jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.characters
  ADD COLUMN IF NOT EXISTS avatar_url text;

DO $$
DECLARE
  v_user uuid;
  v_balance numeric;
BEGIN
  SELECT id INTO v_user FROM auth.users WHERE lower(email) = 'innocentkoffi1@gmail.com' LIMIT 1;
  IF v_user IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user, 'super_admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.credit_accounts (user_id, balance, lifetime_purchased)
  VALUES (v_user, 1000, 1000)
  ON CONFLICT (user_id) DO UPDATE
    SET balance = public.credit_accounts.balance + 1000,
        lifetime_purchased = public.credit_accounts.lifetime_purchased + 1000,
        updated_at = now();

  SELECT balance INTO v_balance FROM public.credit_accounts WHERE user_id = v_user;

  INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, description)
  VALUES (v_user, 'bonus', 1000, v_balance, 'Dotation administrateur');
END $$;