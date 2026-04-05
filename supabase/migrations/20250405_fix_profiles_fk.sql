-- Migration: Fix foreign key constraint error on saved_analyses
-- Automatically create profile when user signs up

-- 1. Enable the pg_trgm extension for text search (if needed)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger on auth.users to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. Create RPC function for app to ensure profile exists (backup method)
CREATE OR REPLACE FUNCTION public.ensure_user_profile(user_id UUID, user_email TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.profiles (id, email, created_at, updated_at)
    VALUES (user_id, user_email, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Backfill: Create profiles for existing auth users that don't have one
INSERT INTO public.profiles (id, email, created_at, updated_at)
SELECT id, email, created_at, NOW()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- 6. Update RLS policy to allow users to create their own profile if needed
DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;

CREATE POLICY "Users can create own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 7. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.ensure_user_profile(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_user_profile(UUID, TEXT) TO anon;
