import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err) {
      console.error("Erreur de connexion", err);
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

          {/* Action Button */}
          <div className="animation-delay-200 animate-fade-in-up">
            <button
              onClick={handleLogin}
              className="btn-gold w-full flex items-center justify-center gap-4 group"
            >
              <div className="bg-white/20 p-1.5 rounded-full transition-transform group-hover:scale-110">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-4 h-4 backdrop-brightness-200" />
              </div>
              <span className="tracking-[0.15em]">Commencer</span>
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