import { logout } from './auth.js';
import { supabase } from './supabase-config.js';

export const initNavigation = (activePage) => {
    supabase.auth.getUser().then(({ data: { user } }) => {
        const sidebarHtml = `
          <aside class="sidebar" id="sidebar">
            <a href="index.html" class="sidebar-logo" style="cursor:pointer; text-decoration:none;">
              <div class="sidebar-logo-icon"><i data-lucide="trophy" style="width:20px; height:20px; color:#05070a;"></i></div>
              <h2 style="font-size:1.25rem; font-family:var(--font-heading);">SCOUT<span class="text-gold-gradient">.COACH</span></h2>
            </a>
            
            <nav class="sidebar-nav">
              <a href="index.html" class="sidebar-item ${activePage === 'accueil' ? 'active' : ''}"><i data-lucide="home"></i> Accueil</a>
              <a href="browse.html" class="sidebar-item ${activePage === 'explorer' ? 'active' : ''}"><i data-lucide="search"></i> Explorer</a>
              ${user ? 
                `<a href="dashboard.html" class="sidebar-item ${activePage === 'profil' ? 'active' : ''}"><i data-lucide="layout"></i> Mon Espace</a>` : 
                `<a href="login.html" class="sidebar-item"><i data-lucide="log-in"></i> Connexion</a>`
              }
            </nav>

            <div class="sidebar-footer">
              ${user ? 
                `<button id="btn-logout" class="sidebar-item" style="width:100%; background:none; border:none; cursor:pointer;"><i data-lucide="log-out"></i> Déconnexion</button>` : 
                `<p style="font-size:10px; opacity:0.3; text-align:center;">v2.0 Beta</p>`
              }
            </div>
          </aside>
          <div class="sidebar-overlay" id="sidebar-overlay"></div>
          
          <header class="mobile-header">
            <button class="nav-toggle" id="nav-toggle"><i data-lucide="menu"></i></button>
            <a href="index.html" style="margin-left:15px; font-weight:800; font-size:14px; text-decoration:none; color:white;">SCOUT<span class="text-gold-gradient">.COACH</span></a>
          </header>
        `;

        document.body.insertAdjacentHTML('afterbegin', sidebarHtml);
        if (window.lucide) window.lucide.createIcons();

        // Toggle Logic
        const toggle = document.getElementById('nav-toggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const logoutBtn = document.getElementById('btn-logout');

        if (toggle && sidebar && overlay) {
            toggle.onclick = () => { sidebar.classList.toggle('open'); if (window.lucide) window.lucide.createIcons(); };
            overlay.onclick = () => sidebar.classList.remove('open');
        }

        if (logoutBtn) logoutBtn.onclick = () => logout();
    });
};
