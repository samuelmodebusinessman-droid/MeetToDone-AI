const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qybtrornhzbxvicyuouf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5YnRyb3JuaHpieHZpY3l1b3VmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIxMjUyNywiZXhwIjoyMDkwNzg4NTI3fQ.JjoTkSg0Xs86xi6PF191kZwJTdft7yAY9hrncipHMO8';

const supabase = createClient(supabaseUrl, supabaseKey);

const sql = `
-- 1. Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create trigger on auth.users to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill: Create profiles for existing auth users that don't have one
INSERT INTO public.profiles (id, email, created_at, updated_at)
SELECT id, email, created_at, NOW()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
`;

async function runMigration() {
  console.log('🚀 Exécution de la migration SQL...');
  
  try {
    // Execute SQL via RPC
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('❌ Erreur:', error);
      process.exit(1);
    }
    
    console.log('✅ Migration exécutée avec succès !');
    console.log('Résultat:', data);
  } catch (err) {
    console.error('❌ Erreur inattendue:', err);
    process.exit(1);
  }
}

runMigration();
