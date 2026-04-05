-- Migration: Créer une fonction pour s'assurer que le profil existe
-- Cette fonction est appelée avant chaque insertion dans saved_analyses

-- Fonction pour créer le profil automatiquement s'il n'existe pas
CREATE OR REPLACE FUNCTION ensure_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Insérer le profil s'il n'existe pas (IGNORE si conflit)
    INSERT INTO profiles (id, email, updated_at)
    VALUES (NEW.user_id, (SELECT email FROM auth.users WHERE id = NEW.user_id), NOW())
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS trg_ensure_profile_before_save ON saved_analyses;

-- Créer le trigger qui s'exécute avant chaque insertion
CREATE TRIGGER trg_ensure_profile_before_save
    BEFORE INSERT ON saved_analyses
    FOR EACH ROW
    EXECUTE FUNCTION ensure_user_profile();

-- Alternative: Fonction RPC exposée pour créer le profil manuellement
CREATE OR REPLACE FUNCTION create_profile_if_not_exists(user_id UUID, user_email TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO profiles (id, email, updated_at)
    VALUES (user_id, user_email, NOW())
    ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
