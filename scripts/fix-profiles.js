// Script to fix profiles - insert missing profiles directly
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qybtrornhzbxvicyuouf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5YnRyb3JuaHpieHZpY3l1b3VmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIxMjUyNywiZXhwIjoyMDkwNzg4NTI3fQ.JjoTkSg0Xs86xi6PF191kZwJTdft7yAY9hrncipHMO8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixProfiles() {
  console.log('🔧 Correction des profils manquants...');
  
  try {
    // Step 1: Get all users from auth.users using admin API
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', authError);
      return;
    }
    
    console.log(`📊 ${users?.length || 0} utilisateurs trouvés`);
    
    if (!users || users.length === 0) {
      console.log('⚠️ Aucun utilisateur à traiter');
      return;
    }
    
    // Step 2: Get existing profiles
    const { data: existingProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('id');
    
    if (profileError) {
      console.error('❌ Erreur lors de la récupération des profils:', profileError);
      return;
    }
    
    const existingProfileIds = new Set((existingProfiles || []).map(p => p.id));
    console.log(`📊 ${existingProfileIds.size} profils existants`);
    
    // Step 3: Find users without profiles
    const usersWithoutProfiles = users.filter(u => !existingProfileIds.has(u.id));
    console.log(`🔍 ${usersWithoutProfiles.length} utilisateurs sans profil`);
    
    if (usersWithoutProfiles.length === 0) {
      console.log('✅ Tous les utilisateurs ont un profil !');
      return;
    }
    
    // Step 4: Create missing profiles
    const profilesToInsert = usersWithoutProfiles.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    const { data: inserted, error: insertError } = await supabase
      .from('profiles')
      .upsert(profilesToInsert, { onConflict: 'id' })
      .select();
    
    if (insertError) {
      console.error('❌ Erreur lors de la création des profils:', insertError);
      return;
    }
    
    console.log(`✅ ${inserted?.length || 0} profils créés avec succès !`);
    console.log('Profils créés:', inserted?.map(p => p.email).join(', '));
    
  } catch (err) {
    console.error('❌ Erreur inattendue:', err);
  }
}

fixProfiles();
