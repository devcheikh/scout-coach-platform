import { useState } from 'react';
import { db, auth, storage } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [form, setForm] = useState({
    nom: '',
    specialite: '',
    tactique: '4-3-3',
    bio: '',
    club: '',
    diplomes: '',
    experience: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = auth.currentUser;

    let photoURL = user.photoURL;

    if (image) {
      const storageRef = ref(storage, `coaches/${user.uid}/profile.jpg`);
      await uploadBytes(storageRef, image);
      photoURL = await getDownloadURL(storageRef);
    }

    await setDoc(doc(db, "coaches", user.uid), {
      ...form,
      uid: user.uid,
      photo: photoURL,
      email: user.email,
      updatedAt: new Date().toISOString()
    });

    setLoading(false);
    router.push(`/portfolio/${user.uid}`);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-grid-pattern relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-scout-accent/10 blur-[120px] rounded-full mix-blend-screen animate-float-slow"></div>
      </div>
      <div className="max-w-2xl mx-auto glass-card p-8 md:p-10 card-glow">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white text-center">
          VOTRE <span className="text-scout-neon">PROFIL COACH</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-8">
            <label className="cursor-pointer group relative">
              <div className="w-32 h-32 rounded-full bg-scout-dark border-2 border-dashed border-scout-muted flex items-center justify-center overflow-hidden group-hover:border-scout-neon group-hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all duration-300">
                {image ? (
                  <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 mx-auto text-scout-neon mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    <span className="text-scout-muted text-xs block">PHOTO</span>
                  </div>
                )}
              </div>
              <input type="file" className="hidden" onChange={e => setImage(e.target.files[0])} accept="image/*" />
            </label>
            <p className="text-xs text-scout-neon mt-3 tracking-widest uppercase opacity-80">Modifier la photo</p>
          </div>

          <div className="space-y-4">
            <input placeholder="Nom complet" className="input-premium"
              onChange={e => setForm({ ...form, nom: e.target.value })} required />

            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Club actuel" className="input-premium"
                onChange={e => setForm({ ...form, club: e.target.value })} />

              <input placeholder="Diplômes (ex: UEFA A)" className="input-premium"
                onChange={e => setForm({ ...form, diplomes: e.target.value })} />
            </div>

            <input placeholder="Spécialité (ex: Formation, Elite, Gardiens)" className="input-premium"
              onChange={e => setForm({ ...form, specialite: e.target.value })} />

            <div className="relative">
              <select className="input-premium appearance-none cursor-pointer" onChange={e => setForm({ ...form, tactique: e.target.value })}>
                <option value="4-3-3">Système : 4-3-3</option>
                <option value="4-4-2">Système : 4-4-2</option>
                <option value="3-5-2">Système : 3-5-2</option>
                <option value="Autre">Autre Système</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-scout-neon">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <textarea placeholder="Parcours & Expériences..." className="input-premium h-32 resize-none"
              onChange={e => setForm({ ...form, experience: e.target.value })}></textarea>

            <textarea placeholder="Vision du jeu & Management..." className="input-premium h-32 resize-none"
              onChange={e => setForm({ ...form, bio: e.target.value })}></textarea>
          </div>

          <button
            disabled={loading}
            className="w-full btn-neon mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-scout-dark border-t-transparent rounded-full animate-spin"></div>
                <span>Génération...</span>
              </div>
            ) : 'Générer Mon Portfolio'}
          </button>
        </form>
      </div>
    </div>
  );
}