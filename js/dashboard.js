import { supabase } from './supabase-config.js';
import { checkAuth, isAdmin } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = await checkAuth();
    if (!user) return;

    const loadingScreen = document.getElementById('loading-screen');
    const tabMyTalents = document.getElementById('tab-my-talents');
    const tabAdmin = document.getElementById('tab-admin');
    const sectionMyTalents = document.getElementById('section-my-talents');
    const sectionAdmin = document.getElementById('section-admin');

    const talentsOwnerList = document.getElementById('talents-owner-list');
    const adminTableBody = document.getElementById('admin-table-body');
    const form = document.getElementById('dashboard-form');
    const viewList = document.getElementById('view-list');
    const viewForm = document.getElementById('view-form');
    
    // UI Logic: Tabs
    if (isAdmin(user.email)) {
        tabAdmin.style.display = 'block';
    }

    tabMyTalents.onclick = () => {
        tabMyTalents.classList.add('active');
        tabAdmin.classList.remove('active');
        sectionMyTalents.style.display = 'block';
        sectionAdmin.style.display = 'none';
        fetchUserCoaches();
    };

    tabAdmin.onclick = () => {
        tabAdmin.classList.add('active');
        tabMyTalents.classList.remove('active');
        sectionAdmin.style.display = 'block';
        sectionMyTalents.style.display = 'none';
        fetchAdminCoaches();
    };

    // --- LOGIQUE AGENT (MES TALENTS) ---
    document.getElementById('btn-add-new').onclick = () => {
        viewList.style.display = 'none';
        viewForm.style.display = 'block';
        form.reset();
        document.getElementById('coach-id').value = '';
        document.getElementById('preview-img').style.display = 'none';
        document.getElementById('upload-content').style.display = 'block';
    };

    document.getElementById('btn-back').onclick = () => {
        viewList.style.display = 'block';
        viewForm.style.display = 'none';
        fetchUserCoaches();
    };

    const fetchUserCoaches = async () => {
        const { data, error } = await supabase.from('coaches').select('*').eq('uid', user.id).order('updated_at', { ascending: false });
        if (!error) renderUserCoaches(data);
    };

    const renderUserCoaches = (coaches) => {
        talentsOwnerList.innerHTML = coaches.map(coach => `
            <div class="talent-item">
                <img src="${coach.photo || ''}" class="talent-item-img" onerror="this.src='https://via.placeholder.com/50'">
                <div style="flex:1;">
                    <h4 style="font-size:14px;">${coach.nom}</h4>
                    <span class="status-badge ${coach.status === 'published' ? 'status-published' : 'status-pending'}">
                        ${coach.status === 'published' ? 'En Ligne' : 'En Attente'}
                    </span>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="edit-btn" data-id="${coach.id}" style="background:none; border:none; color:var(--color-scout-gold); cursor:pointer;"><i data-lucide="edit-2" style="width:14px;"></i></button>
                    <button class="del-btn" data-id="${coach.id}" style="background:none; border:none; color:#ff4444; cursor:pointer;"><i data-lucide="trash-2" style="width:14px;"></i></button>
                </div>
            </div>
        `).join('');
        if(window.lucide) lucide.createIcons();
        attachAgentEvents();
    };

    const attachAgentEvents = () => {
        document.querySelectorAll('.edit-btn').forEach(btn => btn.onclick = () => editCoach(btn.dataset.id));
        document.querySelectorAll('.del-btn').forEach(btn => btn.onclick = () => deleteCoach(btn.dataset.id));
    };

    // --- LOGIQUE ADMIN ---
    const fetchAdminCoaches = async () => {
        const { data, error } = await supabase.from('coaches').select('*').order('updated_at', { ascending: false });
        if (!error) renderAdminCoaches(data);
    };

    const renderAdminCoaches = (coaches) => {
        adminTableBody.innerHTML = coaches.map(coach => `
            <tr>
                <td><div style="display:flex; align-items:center; gap:10px;"><img src="${coach.photo || ''}" style="width:30px; height:30px; border-radius:50%; object-fit:cover;"> ${coach.nom}</div></td>
                <td style="font-size:11px; opacity:0.6;">${coach.email || 'N/A'}</td>
                <td><span class="status-badge ${coach.status === 'published' ? 'status-published' : 'status-pending'}">${coach.status}</span></td>
                <td style="text-align:right;">
                    ${coach.status === 'published' ? 
                        `<button class="btn-action btn-reject" data-id="${coach.id}" data-action="pending">Masquer</button>` : 
                        `<button class="btn-action btn-approve" data-id="${coach.id}" data-action="published">Publier</button>`
                    }
                </td>
            </tr>
        `).join('');
        attachAdminEvents();
    };

    const attachAdminEvents = () => {
        document.querySelectorAll('.btn-action').forEach(btn => {
            btn.onclick = async () => {
                await supabase.from('coaches').update({ status: btn.dataset.action }).eq('id', btn.dataset.id);
                fetchAdminCoaches();
            };
        });
    };

    // Form Handling Logic (Simplified for brevity)
    form.onsubmit = async (e) => {
        e.preventDefault();
        const cid = document.getElementById('coach-id').value;
        const coachData = {
            uid: user.id,
            email: user.email,
            nom: document.getElementById('nom').value,
            club: document.getElementById('club').value,
            // ... (Add all fields from DOM)
            updated_at: new Date().toISOString()
        };

        let res;
        if (cid) res = await supabase.from('coaches').update(coachData).eq('id', cid);
        else res = await supabase.from('coaches').insert([coachData]);

        if (!res.error) {
            viewList.style.display = 'block';
            viewForm.style.display = 'none';
            fetchUserCoaches();
        }
    };

    // Initial load
    fetchUserCoaches();
    setTimeout(() => { if (loadingScreen) loadingScreen.style.opacity = '0'; }, 500);
});
