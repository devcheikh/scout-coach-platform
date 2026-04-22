import { supabase } from './supabase-config.js';
import { getMockUser } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const form = document.getElementById('dashboard-form');
  const imageInput = document.getElementById('image-input');
  const uploadArea = document.getElementById('upload-area');
  const previewImg = document.getElementById('preview-img');
  const uploadContent = document.getElementById('upload-content');
  
  const displayName = document.getElementById('display-name');
  const displayClub = document.getElementById('display-club');
  
  const inputNom = document.getElementById('nom');
  const inputClub = document.getElementById('club');
  
  inputNom.addEventListener('input', (e) => displayName.textContent = e.target.value || "Coach Name");
  inputClub.addEventListener('input', (e) => displayClub.textContent = e.target.value || "Club/Agency");

  let selectedImage = null;
  const user = getMockUser();

  // Remove loading screen
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => loadingScreen.style.display = 'none', 500);
    }
  }, 500);

  // Image Upload Logic
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      selectedImage = file;
      const url = URL.createObjectURL(file);
      previewImg.src = url;
      previewImg.style.display = 'block';
      uploadContent.style.display = 'none';
      uploadArea.classList.add('has-image');
    }
  });

  // Form Submit Logic
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const btnDefault = document.getElementById('btn-content-default');
    const btnLoading = document.getElementById('btn-content-loading');
    
    btn.disabled = true;
    btnDefault.style.display = 'none';
    btnLoading.style.display = 'flex';

    try {
      let photoURL = null;

      // 1. Upload Photo to Supabase Storage
      if (selectedImage) {
        console.log("Uploading image to Supabase...");
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${user.uid}-${Math.random()}.${fileExt}`;
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

      // 2. Save Data to Supabase Table
      console.log("Saving to Supabase Table...");
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

      const { error: upsertError } = await supabase
        .from('coaches')
        .upsert(coachData);

      if (upsertError) throw upsertError;
      
      // Redirect
      window.location.href = `portfolio.html?id=${user.uid}`;
    } catch (error) {
      console.error(error);
      alert("Une erreur Supabase est survenue: " + error.message + "\n\nAssurez-vous que la table 'coaches' et le bucket 'coaches' existent.");
      btn.disabled = false;
      btnDefault.style.display = 'flex';
      btnLoading.style.display = 'none';
    }
  });
});
