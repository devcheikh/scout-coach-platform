import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import Head from 'next/head';
import { useState } from "react";


export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err) {
      console.error("Erreur de connexion", err);
      let message = "Une erreur est survenue lors de la connexion.";
      if (err.code === 'auth/popup-closed-by-user') {
        message = "La fenêtre de connexion a été fermée avant la fin.";
      } else if (err.code === 'auth/network-request-failed') {
        message = "Problème de connexion réseau.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-scout-dark">
      <Head>
        <title>Scout Coach - Official Agent Platform</title>
      </Head>

      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        {/* Deep dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0E14] via-[#11161F] to-[#080A0F]" />

        {/* Stadium Light Effect */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#1E40AF] opacity-20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37] opacity-10 blur-[100px] rounded-full mix-blend-screen" />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Glass Card */}
        <div className="agent-card p-10 md:p-12 text-center">

          {/* Logo / Icon Area */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 relative flex items-center justify-center">
              <div className="absolute inset-0 border border-scout-gold/30 rounded-full animate-spin-slow" />
              <div className="absolute inset-2 border border-scout-gold/10 rounded-full" />
              <div className="bg-gradient-to-tr from-scout-gold to-[#F4D03F] w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                <span className="text-2xl filter drop-shadow-md">⚽</span>
              </div>
            </div>
          </div>

          {/* Typography */}
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tighter text-white font-heading">
            SCOUT<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4D03F] to-[#B8860B]">.COACH</span>
          </h1>

          <div className="flex items-center justify-center gap-3 mb-8 opacity-80">
            <div className="h-[1px] w-8 bg-scout-gold/50" />
            <p className="text-scout-silver text-xs uppercase tracking-[0.3em] font-medium">
              Official Agent Portal
            </p>
            <div className="h-[1px] w-8 bg-scout-gold/50" />
          </div>

          <p className="text-scout-silver/80 mb-10 leading-relaxed text-sm px-4">
            Connectez-vous pour accéder à votre tableau de bord exclusif et gérer votre carrière professionnelle.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm animate-pulse">
              {error}
            </div>
          )}

          {/* Action Button */}
          <div className="animation-delay-200 animate-fade-in-up">
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`btn-gold w-full flex items-center justify-center gap-4 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <div className="bg-white p-1.5 rounded-full transition-transform group-hover:scale-110 flex items-center justify-center">
                {/* Inline Google SVG for perfect sizing and no loading issues */}
                {loading ? (
                  <div className="w-[18px] h-[18px] border-2 border-scout-gold border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="border-0">
                    <path d="M17.64 9.2045c0-.63818-.05727-1.25182-.16364-1.84091H9v3.48136h4.84364c-.20864 1.125-.84273 2.07818-1.79591 2.71636v2.25818h2.90864C16.65818 14.2425 17.64 11.885 17.64 9.2045z" fill="#4285F4" />
                    <path d="M9 18c2.43 0 4.46727-.80591 5.95636-2.18045l-2.90864-2.25818c-.80591.54-1.83682.85909-3.04773.85909-2.34409 0-4.32818-1.58318-5.03591-3.71045H.95864v2.33182C2.43818 15.98318 5.48182 18 9 18z" fill="#34A853" />
                    <path d="M3.96409 10.71c-.17727-.53182-.27955-1.09841-.27955-1.71s.10227-1.17818.27955-1.71V4.95818H.95864C.34773 6.17318 0 7.54773 0 9s.34773 2.82682.95864 4.04182l3.00545-2.33182z" fill="#FBBC05" />
                    <path d="M9 3.57955c1.32136 0 2.50773.45409 3.44045 1.34591l2.58136-2.58136C13.46318.89182 11.42591 0 9 0 5.48182 0 2.43818 2.01682.95864 4.95818L3.96409 7.275C4.67182 5.14773 6.65591 3.57955 9 3.57955z" fill="#EA4335" />
                  </svg>
                )}
              </div>
              <span className="tracking-[0.15em] font-medium text-sm">
                {loading ? 'CHARGEMENT...' : 'CONTINUER AVEC GOOGLE'}
              </span>
            </button>
          </div>


          {/* Footer / Trust Indicators */}
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col gap-2">
            <p className="text-[10px] text-scout-silver/40 uppercase tracking-widest">Powered by</p>
            <div className="flex justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Just placeholder dots/icons for 'Partners' visual feel */}
              <div className="h-2 w-2 rounded-full bg-white" />
              <div className="h-2 w-2 rounded-full bg-white" />
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}