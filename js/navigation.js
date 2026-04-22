export const initNavigation = (activePage) => {
    const sidebarHtml = `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-logo">
          <div class="sidebar-logo-icon">
             <i data-lucide="trophy" style="width: 20px; height: 20px; color: #05070a;"></i>
          </div>
          <h2 style="font-size: 1.25rem; font-family: var(--font-heading);">SCOUT<span class="text-gold-gradient">.COACH</span></h2>
        </div>
        
        <nav class="sidebar-nav">
          <a href="browse.html" class="sidebar-item ${activePage === 'explorer' ? 'active' : ''}">
            <i data-lucide="search"></i> Explorer
          </a>
          <a href="dashboard.html" class="sidebar-item ${activePage === 'profil' ? 'active' : ''}">
            <i data-lucide="user"></i> Mes Talents
          </a>
          <a href="admin.html" class="sidebar-item ${activePage === 'admin' ? 'active' : ''}">
            <i data-lucide="shield-check"></i> Admin
          </a>
          <a href="index.html" class="sidebar-item">
            <i data-lucide="home"></i> Accueil
          </a>
        </nav>

        <div class="sidebar-footer">
          <p style="font-size: 10px; color: rgba(148, 163, 184, 0.3); text-transform: uppercase; letter-spacing: 0.1em; text-align: center;">
            Official Agent Hub v2.0
          </p>
        </div>
      </aside>
      <div class="sidebar-overlay" id="sidebar-overlay"></div>
      
      <header class="mobile-header">
        <button class="nav-toggle" id="nav-toggle">
          <i data-lucide="menu"></i>
        </button>
        <div style="margin-left: 15px; font-weight: 800; font-size: 14px; letter-spacing: 0.05em;">
          SCOUT<span class="text-gold-gradient">.COACH</span>
        </div>
      </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', sidebarHtml);

    if (window.lucide) {
        window.lucide.createIcons();
    }

    const toggle = document.getElementById('nav-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (toggle && sidebar && overlay) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            if (window.lucide) window.lucide.createIcons();
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
        
        const items = sidebar.querySelectorAll('.sidebar-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                sidebar.classList.remove('open');
            });
        });
    }
};
