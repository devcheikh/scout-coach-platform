import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  const loadingScreen = document.getElementById('loading-screen');
  const errorScreen = document.getElementById('error-screen');
  const contentScreen = document.getElementById('content-screen');

  if (!id) {
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (errorScreen) errorScreen.style.display = 'flex';
    return;
  }

  try {
    // Fetch from Supabase
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('uid', id)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      // Populate DOM
      document.getElementById('display-nom').textContent = data.nom || "Coach Name";
      document.getElementById('display-spec').textContent = data.specialite || "Head Coach";
      
      if (data.club) {
        document.getElementById('display-club').textContent = data.club;
        document.getElementById('display-club').style.display = 'inline-block';
      }
      
      if (data.diplomes) {
        document.getElementById('display-licence').textContent = data.diplomes;
        document.getElementById('display-licence-container').style.display = 'flex';
      }

      if (data.photo) {
        const img = document.getElementById('display-photo');
        img.src = data.photo;
        img.style.display = 'block';
        document.getElementById('photo-placeholder').style.display = 'none';
      }

      document.getElementById('display-tactique').textContent = data.tactique || "N/A";
      document.getElementById('display-experience').textContent = data.experience || "Aucune expérience renseignée.";
      document.getElementById('display-bio').textContent = data.bio || "Le coach n'a pas encore partagé sa vision du management.";

      // Contact Info
      if (data.email) {
        document.getElementById('contact-email').href = `mailto:${data.email}`;
      }
      if (data.telephone) {
        const cleanPhone = data.telephone.replace(/\s+/g, '').replace('+', '');
        document.getElementById('contact-whatsapp').href = `https://wa.me/${cleanPhone}`;
        document.getElementById('contact-whatsapp').parentElement.style.display = 'flex';
      } else {
        document.getElementById('contact-whatsapp').style.display = 'none';
      }

      // Show content
      if (loadingScreen) loadingScreen.style.display = 'none';
      if (contentScreen) contentScreen.style.display = 'block';
    } else {
      if (loadingScreen) loadingScreen.style.display = 'none';
      if (errorScreen) errorScreen.style.display = 'flex';
    }
  } catch (error) {
    console.error("Error fetching from Supabase:", error);
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (errorScreen) errorScreen.style.display = 'flex';
  }
});
