// Fix profiles using service role key - bypasses RLS
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qybtrornhzbxvicyuouf.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5YnRyb3JuaHpieHZpY3l1b3VmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIxMjUyNywiZXhwIjoyMDkwNzg4NTI3fQ.JjoTkSg0Xs86xi6PF191kZwJTdft7yAY9hrncipHMO8';

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixProfiles() {
  console.log('🔧 Correction des profils...\n');
  
  try {
    // Get all users
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Erreur auth:', authError);
      return;
    }
    
    console.log(`📊 ${users?.length || 0} utilisateurs trouvés`);
    
    // Get existing profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id');
    
    if (profileError) {
      console.error('❌ Erreur profiles:', profileError);
      return;
    }
    
    const existingIds = new Set((profiles || []).map(p => p.id));
    console.log(`📊 ${existingIds.size} profils existants`);
    
    // Find users without profiles
    const missingProfiles = users.filter(u => !existingIds.has(u.id));
    console.log(`🔍 ${missingProfiles.length} profils manquants\n`);
    
    if (missingProfiles.length === 0) {
      console.log('✅ Tous les profils sont OK !');
      return;
    }
    
    // Create missing profiles
    for (const user of missingProfiles) {
      console.log(`➕ Création profil: ${user.email}`);
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          created_at: user.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error(`  ❌ Erreur pour ${user.email}:`, insertError.message);
      } else {
        console.log(`  ✅ Profil créé: ${user.email}`);
      }
    }
    
    console.log('\n🎉 Correction terminée !');
    
  } catch (err) {
    console.error('❌ Erreur:', err);
  }
}

fixProfiles();
