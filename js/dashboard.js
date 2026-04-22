import { supabase } from './supabase-config.js';
import { getMockUser } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const viewList = document.getElementById('view-list');
  const viewForm = document.getElementById('view-form');
  const talentsOwnerList = document.getElementById('talents-owner-list');
  
  const form = document.getElementById('dashboard-form');
  const coachIdInput = document.getElementById('coach-id');
  const imageInput = document.getElementById('image-input');
  const uploadArea = document.getElementById('upload-area');
  const previewImg = document.getElementById('preview-img');
  const uploadContent = document.getElementById('upload-content');
  
  const displayName = document.getElementById('display-name');
  const displayClub = document.getElementById('display-club');
  
  const inputNom = document.getElementById('nom');
  const inputClub = document.getElementById('club');
  
  const user = getMockUser();
  let allUserCoaches = [];
  let selectedImage = null;

  // Navigation Logic
  document.getElementById('btn-add-new').addEventListener('click', () => showForm());
  document.getElementById('btn-back').addEventListener('click', () => showList());

  const showForm = (coach = null) => {
    viewList.style.display = 'none';
    viewForm.style.display = 'block';
    form.reset();
    selectedImage = null;
    
    if (coach) {
      coachIdInput.value = coach.id;
      inputNom.value = coach.nom;
      inputClub.value = coach.club;
      document.getElementById('specialite').value = coach.specialite || '';
      document.getElementById('telephone').value = coach.telephone || '';
      document.getElementById('diplomes').value = coach.diplomes || '';
      document.getElementById('tactique').value = coach.tactique || '4-3-3';
      document.getElementById('experience').value = coach.experience || '';
      document.getElementById('bio').value = coach.bio || '';
      
      displayName.textContent = coach.nom;
      displayClub.textContent = coach.club;
      
      if (coach.photo) {
        previewImg.src = coach.photo;
        previewImg.style.display = 'block';
        uploadContent.style.display = 'none';
        uploadArea.classList.add('has-image');
      } else {
        resetPhotoArea();
      }
    } else {
      coachIdInput.value = '';
      displayName.textContent = "Nom du Coach";
      displayClub.textContent = "Club / Agence";
      resetPhotoArea();
    }
    if(window.lucide) lucide.createIcons();
  };

  const resetPhotoArea = () => {
    previewImg.style.display = 'none';
    uploadContent.style.display = 'block';
    uploadArea.classList.remove('has-image');
  };

  const showList = () => {
    viewList.style.display = 'block';
    viewForm.style.display = 'none';
    fetchUserCoaches();
  };

  // Fetch Coaches
  const fetchUserCoaches = async () => {
    try {
      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .eq('uid', user.uid)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      allUserCoaches = data || [];
      renderUserCoaches();
    } catch (err) {
      console.error(err);
      talentsOwnerList.innerHTML = `<p style="color:red; font-size:12px;">Erreur de chargement des talents.</p>`;
    }
  };

  const renderUserCoaches = () => {
    if (allUserCoaches.length === 0) {
      talentsOwnerList.innerHTML = `
        <div style="text-align:center; padding:40px; border:1px dashed rgba(255,255,255,0.1); border-radius:20px;">
          <p style="color:var(--color-scout-silver); font-size:14px;">Aucun coach enregistré.</p>
        </div>
      `;
      return;
    }

    talentsOwnerList.innerHTML = allUserCoaches.map(coach => `
      <div class="talent-item">
        <img src="${coach.photo || 'assets/images/default-avatar.png'}" class="talent-item-img">
        <div style="flex:1;">
          <h4 style="font-size:14px;">${coach.nom}</h4>
          <p style="font-size:11px; color:var(--color-scout-silver);">${coach.club || 'Sans Club'}</p>
        </div>
        <div style="text-align:right;">
          <span class="status-badge ${coach.status === 'published' ? 'status-published' : 'status-pending'}">
            ${coach.status === 'published' ? 'En Ligne' : 'En Attente'}
          </span>
          <div style="margin-top:8px; display:flex; gap:10px; justify-content:flex-end;">
            <button class="edit-btn" data-id="${coach.id}" style="background:none; border:none; color:var(--color-scout-gold); cursor:pointer;"><i data-lucide="edit-2" style="width:14px;"></i></button>
            <button class="delete-btn" data-id="${coach.id}" style="background:none; border:none; color:#ff4444; cursor:pointer;"><i data-lucide="trash-2" style="width:14px;"></i></button>
          </div>
        </div>
      </div>
    `).join('');

    if(window.lucide) lucide.createIcons();

    // Attach event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const coach = allUserCoaches.find(c => c.id === btn.dataset.id);
        if (coach) showForm(coach);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
       btn.addEventListener('click', async () => {
         if(confirm("Supprimer ce profil définitivement ?")) {
           const { error } = await supabase.from('coaches').delete().eq('id', btn.dataset.id);
           if (!error) fetchUserCoaches();
         }
       });
    });
  };

  // Profile Preview Logic
  inputNom.addEventListener('input', (e) => displayName.textContent = e.target.value || "Nom du Coach");
  inputClub.addEventListener('input', (e) => displayClub.textContent = e.target.value || "Club / Agence");

  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      selectedImage = file;
      previewImg.src = URL.createObjectURL(file);
      previewImg.style.display = 'block';
      uploadContent.style.display = 'none';
      uploadArea.classList.add('has-image');
    }
  });

  // Submit Logic
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const btnDefault = document.getElementById('btn-content-default');
    const btnLoading = document.getElementById('btn-content-loading');
    
    btn.disabled = true;
    btnDefault.style.display = 'none';
    btnLoading.style.display = 'flex';

    try {
      let photoURL = previewImg.src.startsWith('http') ? previewImg.src : null;

      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${user.uid}-${Date.now()}.${fileExt}`;
        const filePath = `profiles/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('coaches')
          .upload(filePath, selectedImage);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('coaches')
          .getPublicUrl(filePath);
        
        photoURL = publicUrlData.publicUrl;
      }

      const coachData = {
        uid: user.uid,
        nom: inputNom.value,
        club: inputClub.value,
        diplomes: document.getElementById('diplomes').value,
        specialite: document.getElementById('specialite').value,
        tactique: document.getElementById('tactique').value,
        experience: document.getElementById('experience').value,
        bio: document.getElementById('bio').value,
        telephone: document.getElementById('telephone').value,
        photo: photoURL,
        email: user.email,
        updated_at: new Date().toISOString()
      };

      const coachId = coachIdInput.value;
      let res;
      if (coachId) {
        res = await supabase.from('coaches').update(coachData).eq('id', coachId);
      } else {
        res = await supabase.from('coaches').insert([coachData]);
      }

      if (res.error) throw res.error;
      
      showList();
    } catch (error) {
      console.error(error);
      alert("Erreur: " + error.message);
    } finally {
      btn.disabled = false;
      btnDefault.style.display = 'flex';
      btnLoading.style.display = 'none';
    }
  });

  // Initial Fetch & Remove Loading
  fetchUserCoaches();
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => loadingScreen.style.display = 'none', 500);
    }
  }, 500);
});
