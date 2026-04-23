-- ==========================================
-- SCRIPT DE MISE À JOUR SCOUT COACH PLATFORM
-- Version 2.0 - Sécurité et Dynamisme
-- ==========================================

-- 1. MISE À JOUR DE LA STRUCTURE DE LA TABLE
ALTER TABLE coaches 
ADD COLUMN IF NOT EXISTS views BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'theme-gold',
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS agency_name TEXT,
ADD COLUMN IF NOT EXISTS agency_logo TEXT,
ADD COLUMN IF NOT EXISTS cv_url TEXT;

-- 2. ACTIVATION DE LA SÉCURITÉ (RLS)
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;

-- 3. NETTOYAGE DES ANCIENNES RÈGLES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON coaches;
DROP POLICY IF EXISTS "Users can manage their own talent profiles" ON coaches;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON coaches;
DROP POLICY IF EXISTS "Allow individual update" ON coaches;
DROP POLICY IF EXISTS "Allow individual delete" ON coaches;
DROP POLICY IF EXISTS "Public access" ON coaches;

-- 4. NOUVELLES RÈGLES DE SÉCURITÉ ROBUSTES

-- LECTURE : Tout le monde peut voir les dossiers
CREATE POLICY "Public access" ON coaches 
FOR SELECT USING (true);

-- INSERTION : Tout utilisateur connecté peut créer un dossier
CREATE POLICY "Allow insert for authenticated users" ON coaches
FOR INSERT TO authenticated WITH CHECK (true);

-- MODIFICATION : Seul le propriétaire peut modifier son dossier (avec conversion de type UUID/TEXT)
CREATE POLICY "Allow individual update" ON coaches
FOR UPDATE TO authenticated USING (auth.uid()::text = uid::text);

-- SUPPRESSION : Seul le propriétaire peut supprimer son dossier
CREATE POLICY "Allow individual delete" ON coaches
FOR DELETE TO authenticated USING (auth.uid()::text = uid::text);

-- 5. RAPPEL POUR LE STOCKAGE (STORAGE)
-- Allez dans l'onglet "Storage" et créez les Buckets suivants en mode PUBLIC :
-- 1. coach-photos
-- 2. coach-cvs
-- 3. agency-logos
