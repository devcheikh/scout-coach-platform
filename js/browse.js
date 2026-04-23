import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const talentsList = document.getElementById('talents-list');
    const searchInput = document.getElementById('search-input');
    const filterChips = document.querySelectorAll('.filter-chip');
    
    let allCoaches = [];
    let currentTactique = 'all';
    let currentDiplome = 'all';
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
            const matchesTactique = currentTactique === 'all' || c.tactique === currentTactique;
            const matchesDiplome = currentDiplome === 'all' || (c.diplomes && c.diplomes.includes(currentDiplome));
            const matchesSearch = !searchQuery || 
                (c.nom && c.nom.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c.club && c.club.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c.specialite && c.specialite.toLowerCase().includes(searchQuery.toLowerCase()));
            
            return matchesTactique && matchesDiplome && matchesSearch;
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
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <h3 class="talent-name">${coach.nom}</h3>
                        ${coach.agency_logo ? `<img src="${coach.agency_logo}" style="width:14px; height:14px; object-fit:contain; opacity:0.6;">` : ''}
                    </div>
                    <p class="talent-club">${coach.club || 'Agent Libre'} • <span style="color:var(--color-scout-gold);">${coach.tactique}</span></p>
                    <p style="font-size:10px; color:rgba(255,255,255,0.4); margin-top:5px;">${coach.diplomes || ''}</p>
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
            const type = chip.getAttribute('data-type');
            const val = chip.getAttribute('data-filter');
            
            // Only deactivate siblings of the same type
            document.querySelectorAll(`.filter-chip[data-type="${type}"]`).forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            if (type === 'tactique') currentTactique = val;
            if (type === 'diplome') currentDiplome = val;
            
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
