import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const talentsList = document.getElementById('talents-list');
    const searchInput = document.getElementById('search-input');
    const filterChips = document.querySelectorAll('.filter-chip');
    
    let allCoaches = [];
    let currentFilter = 'all';
    let searchQuery = '';

    // Fetch coaches
    const fetchCoaches = async () => {
        try {
            const { data, error } = await supabase
                .from('coaches')
                .select('*')
                .eq('status', 'published')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            allCoaches = data || [];
            renderCoaches();
        } catch (error) {
            console.error("Error fetching coaches:", error);
            talentsList.innerHTML = `<div class="empty-state">Une erreur est survenue lors de la récupération des talents.</div>`;
        }
    };

    const renderCoaches = () => {
        const filtered = allCoaches.filter(c => {
            const matchesFilter = currentFilter === 'all' || c.tactique === currentFilter;
            const matchesSearch = !searchQuery || 
                (c.nom && c.nom.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c.club && c.club.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c.specialite && c.specialite.toLowerCase().includes(searchQuery.toLowerCase()));
            
            return matchesFilter && matchesSearch;
        });

        if (filtered.length === 0) {
            talentsList.innerHTML = `<div class="empty-state">Aucun coach ne correspond à votre recherche.</div>`;
            return;
        }

        talentsList.innerHTML = filtered.map(coach => `
            <div class="agent-card talent-card animate-fade-in" onclick="window.location.href='portfolio.html?id=${coach.id}'">
                <div class="talent-image-box">
                    ${coach.photo ? `<img src="${coach.photo}" class="talent-img" alt="${coach.nom}">` : `
                        <div style="width:100%; height:100%; background:#05070a; display:flex; align-items:center; justify-content:center; color:rgba(212,175,55,0.1);">
                            <i data-lucide="user" style="width: 48px; height: 48px;"></i>
                        </div>
                    `}
                    <div style="position:absolute; bottom:0; padding:20px; width:100%; background:linear-gradient(to top, rgba(0,0,0,0.8), transparent);">
                        <span class="talent-tag">${coach.specialite || 'Coach'}</span>
                    </div>
                </div>
                <div class="talent-info">
                    <h3 class="talent-name">${coach.nom}</h3>
                    <p class="talent-club">${coach.club || 'Agent Libre'} • <span style="color:var(--color-scout-gold);">${coach.tactique}</span></p>
                    <p style="font-size:11px; color:rgba(148,163,184,0.5); margin-top:10px; text-transform:uppercase; letter-spacing:0.05em; display:flex; align-items:center; gap:8px;">
                        Voir le profil complet <i data-lucide="arrow-right" style="width:12px; height:12px;"></i>
                    </p>
                </div>
            </div>
        `).join('');

        if (window.lucide) {
            window.lucide.createIcons();
        }
    };

    // Filter Logic
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.getAttribute('data-filter');
            renderCoaches();
        });
    });

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderCoaches();
    });

    // Initial Fetch
    fetchCoaches();
});
