import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Portfolio() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (id) {
      getDoc(doc(db, "coaches", id)).then(snap => snap.exists() && setData(snap.data()));
    }
  }, [id]);

  if (!data) return <div className="p-20 text-center font-mono">CHARGEMENT DU PROFIL...</div>;

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto border-8 border-black p-6 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start border-b-8 border-black pb-8 mb-8 gap-6">
          <div className="flex-1">
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-none mb-4">{data.nom}</h1>
            <div className="flex flex-wrap gap-3 items-center">
              <p className="text-xl font-bold bg-black text-white px-4 py-1 uppercase">{data.specialite}</p>
              {data.club && <p className="text-xl font-bold border-4 border-black px-4 py-1 uppercase">{data.club}</p>}
            </div>
            {data.diplomes && <p className="mt-4 text-lg font-mono font-bold text-gray-500 uppercase">Diplômes: {data.diplomes}</p>}
          </div>
          <div className="relative">
            <img src={data.photo} className="w-32 h-32 md:w-56 md:h-56 border-8 border-black object-cover bg-gray-100 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]" />
            <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-2 border-4 border-black font-black text-xs">CERTIFIED</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-black mb-6 uppercase bg-black text-white p-2 text-center">Identité Tactique</h3>
            <div className="flex flex-col items-center">
              <p className="text-8xl font-black text-blue-600 mb-2">{data.tactique}</p>
              <p className="font-mono text-sm font-bold text-center">SYSTÈME PRÉFÉRENTIEL</p>
            </div>
          </div>

          <div className="md:col-span-1 pt-8 md:pt-0 md:pl-8">
            <h3 className="text-2xl font-black mb-6 uppercase underline decoration-4">Expérience</h3>
            <div className="prose prose-slate">
              <p className="text-lg leading-tight font-medium whitespace-pre-line">{data.experience || "Aucune expérience renseignée."}</p>
            </div>
          </div>

          <div className="md:col-span-1 pt-8 md:pt-0 md:pl-8">
            <h3 className="text-2xl font-black mb-6 uppercase underline decoration-4">Vision du jeu</h3>
            <p className="text-lg leading-relaxed text-gray-700 italic border-l-4 border-blue-500 pl-4">
              "{data.bio || "Le coach n'a pas encore partagé sa vision du management."}"
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t-4 border-black flex justify-between items-center">
          <p className="font-bold text-sm">PROFIL CERTIFIÉ SCOUTING COACH</p>
          <button onClick={() => window.print()} className="bg-black text-white px-6 py-2 font-bold hover:invert">EXPORTER PDF</button>
        </div>
      </div>
    </div>
  );
}