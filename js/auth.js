import { supabase } from './supabase-config.js';

/**
 * Récupère l'utilisateur actuellement connecté via Supabase Auth.
 * Redirige vers la page de login si aucun utilisateur n'est trouvé.
 */
export const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
};

/**
 * Déconnexion de l'utilisateur
 */
export const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
};

/**
 * Vérifie si l'utilisateur est un administrateur.
 * Note: Dans un vrai système, cela se ferait via une table 'profiles' ou des 'claims'.
 * Pour l'instant, on utilise une liste blanche d'emails.
 */
export const isAdmin = (email) => {
    const admins = ['coach@scout.com', 'admin@scout-coach.com']; 
    return admins.includes(email);
};

// Legacy support (to be removed once fully migrated)
export const getMockUser = () => {
  return {
    uid: "mock-id",
    email: "test@example.com"
  };
};
