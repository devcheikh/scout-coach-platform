-- SCRIPT DE MISE À JOUR SCOUT COACH PLATFORM
-- À copier-coller dans l'onglet "SQL Editor" de votre tableau de bord Supabase

-- 1. Mise à jour de la table 'coaches'
ALTER TABLE coaches 
ADD COLUMN IF NOT EXISTS views BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'theme-gold',
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS agency_name TEXT,
ADD COLUMN IF NOT EXISTS agency_logo TEXT,
ADD COLUMN IF NOT EXISTS cv_url TEXT;

-- 2. Configuration des permissions (RLS) - Si non déjà fait
-- Permettre à tout le monde de voir les profils publiés
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles are viewable by everyone') THEN
        CREATE POLICY "Public profiles are viewable by everyone" ON coaches FOR SELECT USING (status = 'published');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own talent profiles') THEN
        CREATE POLICY "Users can manage their own talent profiles" ON coaches FOR ALL USING (auth.uid() = uid);
    END IF;
END $$;

-- 3. Note sur le Stockage (Storage)
-- Allez dans l'onglet "Storage" et créez les Buckets suivants en mode PUBLIC :
-- 1. coach-photos
-- 2. coach-cvs
-- 3. agency-logos
