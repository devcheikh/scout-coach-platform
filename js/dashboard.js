import { supabase } from './supabase-config.js';
import { checkAuth, isAdmin } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = await checkAuth();
    if (!user) return;

    const loadingScreen = document.getElementById('loading-screen');
    const tabMyTalents = document.getElementById('tab-my-talents');
    const sectionMyTalents = document.getElementById('section-my-talents');

    const talentsOwnerList = document.getElementById('talents-owner-list');
    const form = document.getElementById('dashboard-form');
    const viewList = document.getElementById('view-list');
    const viewForm = document.getElementById('view-form');
    
    // UI Logic: Tabs (Simplified)
    tabMyTalents.onclick = () => {
        fetchUserCoaches();
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
                    <div style="display:flex; gap:8px; align-items:center;">
                        <span class="status-badge ${coach.status === 'published' ? 'status-published' : 'status-pending'}">
                            ${coach.status === 'published' ? 'En Ligne' : 'En Attente'}
                        </span>
                        <span style="font-size:9px; color:rgba(255,255,255,0.4); font-weight:700;"><i data-lucide="eye" style="width:10px; height:10px; vertical-align:middle;"></i> ${coach.views || 0} vues</span>
                    </div>
                </div>
                <div style="display:flex; gap:12px; align-items:center;">
                    <button class="preview-btn" data-id="${coach.id}" title="Voir le Portfolio Public" style="background:none; border:none; color:var(--color-scout-silver); cursor:pointer;"><i data-lucide="eye" style="width:16px;"></i></button>
                    <button class="edit-btn" data-id="${coach.id}" title="Modifier" style="background:none; border:none; color:var(--color-scout-gold); cursor:pointer;"><i data-lucide="edit-2" style="width:14px;"></i></button>
                    <button class="del-btn" data-id="${coach.id}" title="Supprimer" style="background:none; border:none; color:#ff4444; cursor:pointer;"><i data-lucide="trash-2" style="width:14px;"></i></button>
                </div>
            </div>
        `).join('');
        if(window.lucide) lucide.createIcons();
        attachAgentEvents();
    };

    const attachAgentEvents = () => {
        document.querySelectorAll('.preview-btn').forEach(btn => btn.onclick = () => window.open(`portfolio.html?id=${btn.dataset.id}`, '_blank'));
        document.querySelectorAll('.edit-btn').forEach(btn => btn.onclick = () => editCoach(btn.dataset.id));
        document.querySelectorAll('.del-btn').forEach(btn => btn.onclick = () => deleteCoach(btn.dataset.id));
    };


    const attachAdminEvents = () => {
        document.querySelectorAll('.btn-action').forEach(btn => {
            btn.onclick = async () => {
                await supabase.from('coaches').update({ status: btn.dataset.action }).eq('id', btn.dataset.id);
                fetchAdminCoaches();
            };
        });
    };

    // Handle Image Preview
    const imageInput = document.getElementById('image-input');
    const previewImg = document.getElementById('preview-img');
    const uploadContent = document.getElementById('upload-content');

    imageInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (re) => {
                previewImg.src = re.target.result;
                previewImg.style.display = 'block';
                uploadContent.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle CV Status
    const cvInput = document.getElementById('cv-input');
    const cvStatus = document.getElementById('cv-status');
    cvInput.onchange = () => {
        if (cvInput.files.length > 0) cvStatus.style.display = 'block';
    };

    const uploadFile = async (file, bucket) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}_${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage.from(bucket).upload(fileName, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
        return publicUrl;
    };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const cid = document.getElementById('coach-id').value;
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'CHARGEMENT...';

        try {
            let photoUrl = previewImg.src.startsWith('http') ? previewImg.src : null;
            let cvUrl = null;
            let agencyLogoUrl = null;

            // Upload photo if new
            if (imageInput.files[0]) {
                photoUrl = await uploadFile(imageInput.files[0], 'coach-photos');
            }

            // Upload CV if new
            if (cvInput.files[0]) {
                cvUrl = await uploadFile(cvInput.files[0], 'coach-cvs');
            }

            // Upload Agency Logo if new
            const agencyLogoInput = document.getElementById('agency-logo-input');
            if (agencyLogoInput.files[0]) {
                agencyLogoUrl = await uploadFile(agencyLogoInput.files[0], 'agency-logos');
            }

            const coachData = {
                uid: user.id,
                email: user.email,
                nom: document.getElementById('nom').value,
                club: document.getElementById('club').value,
                specialite: document.getElementById('specialite').value,
                telephone: document.getElementById('telephone').value,
                diplomes: document.getElementById('diplomes').value,
                tactique: document.getElementById('tactique').value,
                experience: document.getElementById('experience').value,
                bio: document.getElementById('bio').value,
                video_url: document.getElementById('video-url').value,
                agency_name: document.getElementById('agency-name').value,
                theme: document.getElementById('theme-select').value,
                photo: photoUrl,
                cv_url: cvUrl,
                updated_at: new Date().toISOString()
            };

            if (agencyLogoUrl) coachData.agency_logo = agencyLogoUrl;

            // If updating, don't overwrite CV or Logo if no new one provided
            if (cid && !cvUrl) delete coachData.cv_url;
            // Note: agency_logo is handled by check above (only set if uploaded)

            let res;
            if (cid) res = await supabase.from('coaches').update(coachData).eq('id', cid);
            else {
                coachData.status = 'pending';
                res = await supabase.from('coaches').insert([coachData]);
            }

            if (res.error) throw res.error;

            // --- NOTIFICATION EMAIL ---
            notifyAdminByEmail(coachData.nom, user.email);

            // Retour automatique à la liste (Page ferme)
            viewList.style.display = 'block';
            viewForm.style.display = 'none';
            fetchUserCoaches();

            alert("Votre dossier a été envoyé avec succès ! Il est maintenant en attente de validation par l'administration.");
        } catch (err) {
            console.error("Error saving coach:", err);
            alert("Erreur lors de l'enregistrement : " + err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'ENREGISTRER';
        }
    };

    const editCoach = async (id) => {
        const { data, error } = await supabase.from('coaches').select('*').eq('id', id).single();
        if (error) return;

        viewList.style.display = 'none';
        viewForm.style.display = 'block';
        form.reset();

        document.getElementById('coach-id').value = data.id;
        document.getElementById('nom').value = data.nom || '';
        document.getElementById('club').value = data.club || '';
        document.getElementById('specialite').value = data.specialite || '';
        document.getElementById('telephone').value = data.telephone || '';
        document.getElementById('diplomes').value = data.diplomes || '';
        document.getElementById('tactique').value = data.tactique || '4-3-3';
        document.getElementById('experience').value = data.experience || '';
        document.getElementById('bio').value = data.bio || '';
        document.getElementById('video-url').value = data.video_url || '';
        document.getElementById('agency-name').value = data.agency_name || '';
        document.getElementById('theme-select').value = data.theme || 'theme-gold';
        document.getElementById('agency-logo-input').value = '';

        if (data.photo) {
            previewImg.src = data.photo;
            previewImg.style.display = 'block';
            uploadContent.style.display = 'none';
        } else {
            previewImg.style.display = 'none';
            uploadContent.style.display = 'block';
        }
    };

    const deleteCoach = async (id) => {
        if (confirm('Voulez-vous vraiment supprimer ce dossier ?')) {
            await supabase.from('coaches').delete().eq('id', id);
            fetchUserCoaches();
        }
    };

    // Initial load
    fetchUserCoaches();
    setTimeout(() => { 
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.style.display = 'none', 500);
        }
    }, 500);
});
