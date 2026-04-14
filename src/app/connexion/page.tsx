"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PingwashLogo from "@/components/PingwashLogo";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthProvider";

type Tab = "connexion" | "inscription";

export default function ConnexionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-pingwash-blue rounded-full animate-spin" />
      </div>
    }>
      <ConnexionContent />
    </Suspense>
  );
}

function ConnexionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const [supabase] = useState(() => createClient());

  const [tab, setTab] = useState<Tab>("connexion");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (!authLoading && user) {
      router.push(redirect);
    }
  }, [user, authLoading, router, redirect]);

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
    if (searchParams.get("tab") === "inscription") {
      setTab("inscription");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setIsLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);

    if (signInError) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    router.push(redirect);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setIsLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, phone, role: "client" },
      },
    });
    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push(redirect);
  };

  const handleGoogleLogin = async () => {
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) setError(oauthError.message);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-pingwash-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pingwash-ice to-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/">
          <PingwashLogo className="h-8" />
        </Link>
        <Link href="/" className="text-sm text-gray-500 hover:text-pingwash-blue transition-colors">
          ← Retour
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px]">
          {/* Penguin SVG */}
          <div className="flex justify-center mb-6">
            <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
              <circle cx="40" cy="40" r="38" fill="#e0f2fe" />
              <ellipse cx="40" cy="45" rx="16" ry="22" fill="#0c1e2c" />
              <ellipse cx="40" cy="49" rx="10" ry="15" fill="white" />
              <circle cx="40" cy="28" r="13" fill="#0c1e2c" />
              <circle cx="36" cy="26" r="3.5" fill="white" />
              <circle cx="44" cy="26" r="3.5" fill="white" />
              <circle cx="36.5" cy="25.5" r="1.8" fill="#0c1e2c" />
              <circle cx="44.5" cy="25.5" r="1.8" fill="#0c1e2c" />
              <ellipse cx="40" cy="31" rx="2.5" ry="1.5" fill="#f97316" />
              <path d="M35 34 Q40 38 45 34" fill="none" stroke="#0c1e2c" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>

          {/* Tabs */}
          <div className="flex bg-white rounded-full p-1 mb-6 shadow-sm border border-gray-100">
            <button
              onClick={() => { setTab("connexion"); setError(""); }}
              className={`flex-1 py-3 text-sm font-bold rounded-full transition-all ${
                tab === "connexion"
                  ? "bg-pingwash-blue text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => { setTab("inscription"); setError(""); }}
              className={`flex-1 py-3 text-sm font-bold rounded-full transition-all ${
                tab === "inscription"
                  ? "bg-pingwash-blue text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Google button — always visible */}
            <button
              onClick={handleGoogleLogin}
              className="flex items-center w-full py-3.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="flex-1 text-center text-sm font-medium text-black">
                {tab === "connexion" ? "Se connecter avec Google" : "S'inscrire avec Google"}
              </span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">ou par email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* LOGIN FORM */}
            {tab === "connexion" && (
              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  autoFocus
                  className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 border border-gray-200 transition-all"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 border border-gray-200 transition-all"
                />

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-pingwash-blue text-white font-bold text-sm rounded-xl hover:bg-pingwash-blue-dark transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md shadow-pingwash-blue/20"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </span>
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </form>
            )}

            {/* SIGNUP FORM */}
            {tab === "inscription" && (
              <form onSubmit={handleSignup} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Prénom"
                    autoFocus
                    className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 border border-gray-200 transition-all"
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nom"
                    className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 border border-gray-200 transition-all"
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 border border-gray-200 transition-all"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Téléphone (optionnel)"
                  className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 border border-gray-200 transition-all"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe (min. 6 caractères)"
                  className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 border border-gray-200 transition-all"
                />

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-pingwash-blue text-white font-bold text-sm rounded-xl hover:bg-pingwash-blue-dark transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md shadow-pingwash-blue/20"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </span>
                  ) : (
                    "Créer mon compte"
                  )}
                </button>

                <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                  En vous inscrivant, vous acceptez les{" "}
                  <a href="#" className="underline">CGU</a> et la{" "}
                  <a href="#" className="underline">Politique de confidentialité</a>.
                </p>
              </form>
            )}
          </div>

          {/* Switch tab */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {tab === "connexion" ? (
              <>
                Pas encore de compte ?{" "}
                <button onClick={() => { setTab("inscription"); setError(""); }} className="text-pingwash-blue font-bold hover:underline">
                  S&apos;inscrire
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{" "}
                <button onClick={() => { setTab("connexion"); setError(""); }} className="text-pingwash-blue font-bold hover:underline">
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}
