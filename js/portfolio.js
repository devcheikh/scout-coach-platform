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
      .eq('id', id)
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
      
      // CV Link
      if (data.cv_url) {
        document.getElementById('display-cv').href = data.cv_url;
        document.getElementById('cv-section').style.display = 'block';
      }

      // Video Section
      if (data.video_url) {
        let videoId = '';
        if (data.video_url.includes('v=')) videoId = data.video_url.split('v=')[1].split('&')[0];
        else if (data.video_url.includes('youtu.be/')) videoId = data.video_url.split('youtu.be/')[1].split('?')[0];
        
        if (videoId) {
            document.getElementById('display-video').src = `https://www.youtube.com/embed/${videoId}`;
            document.getElementById('video-section').style.display = 'block';
        }
      }

      // Agency Branding
      if (data.agency_name) {
          document.getElementById('display-agency-name').textContent = data.agency_name;
          if (data.agency_logo) document.getElementById('display-agency-logo').src = data.agency_logo;
          else document.getElementById('display-agency-logo').style.display = 'none';
          document.getElementById('agency-badge').style.display = 'flex';
      }

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
