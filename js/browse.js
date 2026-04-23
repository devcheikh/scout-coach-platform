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
            talentsList.innerHTML = `<div class="empty-state"><i data-lucide="search-x" style="width:48px; height:48px;"></i><p style="font-size:16px; font-weight:700; margin-bottom:8px;">Aucun talent trouvé</p><p style="font-size:13px; opacity:0.6;">Essayez de modifier vos filtres ou votre recherche.</p></div>`;
            document.getElementById('results-count').textContent = '0';
            return;
        }
        document.getElementById('results-count').textContent = filtered.length;

        talentsList.innerHTML = filtered.map(coach => `
            <div class="talent-card animate-fade-in" onclick="window.location.href='portfolio.html?id=${coach.id}'">
                <span class="talent-tag">${coach.specialite || 'Coach'}</span>
                
                <div class="talent-image-box">
                    ${coach.photo ? `<img src="${coach.photo}" class="talent-img" alt="${coach.nom}">` : `
                        <div style="width:100%; height:100%; background:linear-gradient(135deg, #05070a, #1a1f26); display:flex; align-items:center; justify-content:center; color:rgba(212,175,55,0.2);">
                            <i data-lucide="user" style="width: 60px; height: 60px;"></i>
                        </div>
                    `}
                    <div style="position:absolute; bottom:0; left:0; width:100%; height:60%; background:linear-gradient(to top, rgba(5,7,10,1) 0%, transparent 100%); z-index:2;"></div>
                </div>

                <div class="talent-info" style="position:relative; z-index:3; margin-top:-40px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:8px;">
                        <h3 class="talent-name">${coach.nom}</h3>
                        ${coach.agency_logo ? `<img src="${coach.agency_logo}" style="width:24px; height:24px; object-fit:contain; border-radius:4px; background:rgba(255,255,255,0.05); padding:2px;">` : ''}
                    </div>
                    
                    <div class="talent-club" style="display:flex; align-items:center; gap:8px;">
                        <i data-lucide="map-pin" style="width:12px; color:var(--color-scout-gold);"></i>
                        ${coach.club || 'Agent Libre'}
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.05);">
                        <div style="font-size:11px; font-weight:700; color:var(--color-scout-gold); display:flex; align-items:center; gap:5px;">
                            <i data-lucide="layout" style="width:12px;"></i> ${coach.tactique}
                        </div>
                        <div style="font-size:10px; color:rgba(255,255,255,0.4); font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">
                            ${coach.diplomes || 'N/A'}
                        </div>
                    </div>
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
