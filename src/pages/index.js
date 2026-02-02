import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-scout-neon/20 blur-[120px] rounded-full mix-blend-screen animate-float"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-scout-accent/20 blur-[120px] rounded-full mix-blend-screen animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="glass-card p-12 max-w-sm w-full text-center border-t border-white/20">
        <h1 className="text-5xl md:text-6xl font-black italic mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-scout-muted">
          SCOUT<span className="text-scout-neon">.</span>COACH
        </h1>
        <p className="text-scout-neon text-lg mb-8 font-mono tracking-widest uppercase opacity-80">
          Scouting Intelligence
        </p>

        <p className="text-scout-muted mb-10 leading-relaxed">
          La plateforme ultime pour créer, gérer et partager votre portfolio de coach professionnel.
        </p>

        <button
          onClick={handleLogin}
          className="btn-neon w-full group flex items-center justify-center gap-3"
        >
          <div className="bg-white p-1 rounded-full group-hover:scale-110 transition-transform">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-4 h-4" />
          </div>
          <span>Commencer</span>
        </button>
      </div>
    </div>
  );
}