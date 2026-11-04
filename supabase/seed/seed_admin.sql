-- Seed initial Admin profile for local or production setup
-- Note: Replace UUID with the actual auth.users ID created via Supabase Dashboard or API

-- Example setup statement to assign admin role to an email
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@noventra.edu';
