import { supabase } from './supabase-config.js';
import { checkAuth, isAdmin } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = await checkAuth();
    if (!user || !isAdmin(user.email)) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loadingScreen = document.getElementById('loading-screen');
    const tableBody = document.getElementById('admin-talents-body');

    const fetchAllCoaches = async () => {
        try {
            const { data, error } = await supabase
                .from('coaches')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            renderCoaches(data || []);
        } catch (err) {
            console.error(err);
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:40px;">Erreur de chargement.</td></tr>`;
        }
    };

    const renderCoaches = (coaches) => {
        if (coaches.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:40px;">Aucun CV à modérer.</td></tr>`;
            return;
        }

        tableBody.innerHTML = coaches.map(coach => `
            <tr class="admin-row">
                <td style="display:flex; align-items:center; gap:12px;">
                    <img src="${coach.photo || 'assets/images/default-avatar.png'}" class="talent-thumb">
                    <div>
                        <div style="font-weight:700;">${coach.nom}</div>
                        <div style="font-size:10px; color:var(--color-scout-silver);">${coach.club || ''}</div>
                    </div>
                </td>
                <td style="font-size:11px; opacity:0.6;">${coach.email || 'Anonyme'}</td>
                <td>
                    <span class="status-badge ${coach.status === 'published' ? 'status-published' : 'status-pending'}">
                        ${coach.status === 'published' ? 'Publié' : 'En attente'}
                    </span>
                </td>
                <td style="text-align:right;">
                    ${coach.status === 'published' ? 
                        `<button class="btn-status btn-hide" data-id="${coach.id}" data-action="pending">Masquer</button>` : 
                        `<button class="btn-status btn-approve" data-id="${coach.id}" data-action="published">Mettre en ligne</button>`
                    }
                    <button class="btn-status btn-delete" data-id="${coach.id}">Supprimer</button>
                </td>
            </tr>
        `).join('');

        // Actions
        document.querySelectorAll('.btn-status').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const newStatus = btn.dataset.action;
                const { error } = await supabase.from('coaches').update({ status: newStatus }).eq('id', id);
                if (!error) fetchAllCoaches();
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                if(confirm("Supprimer ce CV définitivement ?")) {
                    const id = btn.dataset.id;
                    const { error } = await supabase.from('coaches').delete().eq('id', id);
                    if (!error) fetchAllCoaches();
                }
            });
        });
    };

    // Initial Fetch
    await fetchAllCoaches();

    // Hide Loading
    setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.style.opacity = '0';
          setTimeout(() => loadingScreen.style.display = 'none', 500);
        }
    }, 500);
});
