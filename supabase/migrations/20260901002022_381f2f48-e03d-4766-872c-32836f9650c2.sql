CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE gen_code TEXT;
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.credit_accounts (user_id, balance)
  VALUES (NEW.id, 20) ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, description)
  VALUES (NEW.id, 'bonus', 20, 20, 'Crédits de bienvenue E''nvlé Motion');

  gen_code := upper(substr(replace(NEW.id::text,'-',''), 1, 8));
  INSERT INTO public.referrals (user_id, code) VALUES (NEW.id, gen_code)
  ON CONFLICT (user_id) DO NOTHING;

  IF lower(trim(NEW.email)) = 'innocentkoffi1@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END; $function$;

-- Rattrapage pour le compte super-admin s'il existe déjà
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::app_role FROM auth.users
WHERE lower(trim(email)) = 'innocentkoffi1@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;