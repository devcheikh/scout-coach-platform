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
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden bg-scout-dark">
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: "linear-gradient(30deg, #0B0E14 12%, transparent 12.5%, transparent 87%, #0B0E14 87.5%, #0B0E14), linear-gradient(150deg, #0B0E14 12%, transparent 12.5%, transparent 87%, #0B0E14 87.5%, #0B0E14), linear-gradient(30deg, #0B0E14 12%, transparent 12.5%, transparent 87%, #0B0E14 87.5%, #0B0E14), linear-gradient(150deg, #0B0E14 12%, transparent 12.5%, transparent 87%, #0B0E14 87.5%, #0B0E14), linear-gradient(60deg, #151B25 25%, transparent 25.5%, transparent 75%, #151B25 75%, #151B25), linear-gradient(60deg, #151B25 25%, transparent 25.5%, transparent 75%, #151B25 75%, #151B25)" }}></div>

      <div className="max-w-2xl mx-auto agent-card p-10 z-10 relative">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white text-center font-display tracking-wide">
          OFFICIAL <span className="text-gold-gradient">AGENT PROFILE</span>
        </h2>
        <div className="h-1 w-24 bg-scout-gold mx-auto mb-8"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-8">
            <label className="cursor-pointer group relative">
              <div className="w-32 h-32 bg-scout-surface border-2 border-scout-gold/50 flex items-center justify-center overflow-hidden group-hover:border-scout-gold group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300">
                {image ? (
                  <img src={URL.createObjectURL(image)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <div className="text-center group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-10 h-10 mx-auto text-scout-gold mb-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span className="text-scout-silver text-xs block tracking-widest uppercase">ID PHOTO</span>
                  </div>
                )}
              </div>
              <input type="file" className="hidden" onChange={e => setImage(e.target.files[0])} accept="image/*" />
            </label>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-scout-gold uppercase tracking-widest pl-1">Full Name</label>
              <input placeholder="Ex: Jean-Marc Furlan" className="input-gold"
                onChange={e => setForm({ ...form, nom: e.target.value })} required />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-scout-gold uppercase tracking-widest pl-1">Club</label>
                <input placeholder="Current Club" className="input-gold"
                  onChange={e => setForm({ ...form, club: e.target.value })} />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-scout-gold uppercase tracking-widest pl-1">License</label>
                <input placeholder="UEFA Pro / A" className="input-gold"
                  onChange={e => setForm({ ...form, diplomes: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-scout-gold uppercase tracking-widest pl-1">Spezialitation</label>
              <input placeholder="Tactical Analysis, Youth Development..." className="input-gold"
                onChange={e => setForm({ ...form, specialite: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-scout-gold uppercase tracking-widest pl-1">Preferred System</label>
              <div className="relative">
                <select className="input-gold appearance-none cursor-pointer" onChange={e => setForm({ ...form, tactique: e.target.value })}>
                  <option value="4-3-3">4-3-3 (Possession)</option>
                  <option value="4-4-2">4-4-2 (Classic)</option>
                  <option value="3-5-2">3-5-2 (Dynamic)</option>
                  <option value="Autre">Custom System</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-scout-gold">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <textarea placeholder="Professional Experience & Achievements..." className="input-gold h-32 resize-none"
              onChange={e => setForm({ ...form, experience: e.target.value })}></textarea>

            <textarea placeholder="Philosophy & Management Style..." className="input-gold h-32 resize-none"
              onChange={e => setForm({ ...form, bio: e.target.value })}></textarea>
          </div>

          <button
            disabled={loading}
            className="w-full btn-gold mt-10 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>PROCESSING...</span>
              </div>
            ) : (
              <span className="group-hover:tracking-[0.2em] transition-all duration-300">GENERATE PORTFOLIO</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}