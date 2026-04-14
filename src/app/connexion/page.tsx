"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PingwashLogo from "@/components/PingwashLogo";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import type { AddressDetails } from "@/components/AddressAutocomplete";

type Step = "home" | "email" | "login" | "signup";
type Role = "client" | "laveur";

const CITIES = [
  { name: "Paris", postalCode: "75000" },
  { name: "Lyon", postalCode: "69000" },
  { name: "Marseille", postalCode: "13000" },
  { name: "Toulouse", postalCode: "31000" },
  { name: "Bordeaux", postalCode: "33000" },
  { name: "Nantes", postalCode: "44000" },
  { name: "Lille", postalCode: "59000" },
  { name: "Nice", postalCode: "06000" },
  { name: "Strasbourg", postalCode: "67000" },
  { name: "Montpellier", postalCode: "34000" },
  { name: "Rennes", postalCode: "35000" },
  { name: "Grenoble", postalCode: "38000" },
];

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
  const supabase = createClient();

  // If address already in sessionStorage (coming from homepage), skip to auth
  const hasStoredAddress = typeof window !== "undefined" && sessionStorage.getItem("pingwash_address");
  const [step, setStep] = useState<Step>(hasStoredAddress ? "email" : "home");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("client");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirect = searchParams.get("redirect") || "/onboarding/client";

  useEffect(() => {
    if (!authLoading && user) {
      router.push(redirect);
    }
  }, [user, authLoading, router, redirect]);

  useEffect(() => {
    // Load stored address
    const stored = sessionStorage.getItem("pingwash_address");
    if (stored) setAddress(stored);
  }, []);

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
    }
  }, [searchParams]);

  const handleAddressChange = (displayName: string, details: AddressDetails | null) => {
    setAddress(displayName);
    if (details) {
      sessionStorage.setItem("pingwash_address", displayName);
      sessionStorage.setItem("pingwash_address_details", JSON.stringify(details));
    }
  };

  const handleAddressSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      sessionStorage.setItem("pingwash_address", address);
    }
    setStep("email");
  };

  const handleCityClick = (city: string) => {
    setAddress(city);
    sessionStorage.setItem("pingwash_address", city);
    setStep("email");
  };

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Veuillez entrer votre email.");
      return;
    }

    setIsLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: "__check_existence__",
    });
    setIsLoading(false);

    if (signInError?.message === "Invalid login credentials") {
      setStep("login");
    } else {
      setStep("signup");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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

    if (!firstName.trim() || !lastName.trim()) {
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
        data: {
          first_name: firstName,
          last_name: lastName,
          phone,
          role,
        },
      },
    });

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push(role === "laveur" ? "/onboarding/laveur" : "/onboarding/client");
  };

  const handleGoogleLogin = async () => {
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
    }
  };

  const handleBack = () => {
    if (step === "email") {
      setStep("home");
    } else {
      setStep("email");
    }
    setPassword("");
    setError("");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-pingwash-navy rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Link href="/">
          <PingwashLogo className="h-8" />
        </Link>
        {step === "home" && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep("email")}
              className="px-5 py-2.5 text-sm font-semibold text-black hover:bg-gray-100 rounded-full transition-colors"
            >
              Connexion
            </button>
            <button
              onClick={() => setStep("signup")}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-full transition-colors"
            >
              Inscription
            </button>
          </div>
        )}
      </header>

      {/* ===== STEP: HOME — Hero + Address bar + Cities ===== */}
      {step === "home" && (
        <>
          {/* Hero */}
          <section className="relative bg-gradient-to-b from-pingwash-ice to-white overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-10 right-10 w-72 h-72 bg-pingwash-blue/10 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-56 h-56 bg-pingwash-green/8 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-pingwash-navy leading-tight max-w-2xl">
                Propreté véhicule & bureau.{" "}
                <span className="text-gradient">Où que vous soyez.</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-lg">
                Lavage auto & ménage de bureaux — réservez un professionnel en 30 secondes.
              </p>

              {/* Address search bar */}
              <form
                onSubmit={handleAddressSearch}
                className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl"
              >
                <AddressAutocomplete
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Saisissez votre adresse"
                  className="flex-1"
                />
                <div className="flex gap-3">
                  <div className="relative">
                    <select className="appearance-none bg-white rounded-xl px-4 py-4 pr-10 text-[15px] text-black font-medium focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 border border-gray-200 shadow-sm cursor-pointer">
                      <option>Maintenant</option>
                      <option>Planifier</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-pingwash-blue text-white font-bold text-[15px] rounded-xl hover:bg-pingwash-blue-dark transition-colors shadow-sm whitespace-nowrap"
                  >
                    Réserver
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Cities grid */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="text-xl font-bold text-black mb-6">
              Villes disponibles
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleCityClick(city.name)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-pingwash-blue hover:bg-pingwash-blue/5 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-pingwash-blue/10 flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-pingwash-blue transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">{city.name}</p>
                    <p className="text-xs text-gray-400">{city.postalCode}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* How it works mini section */}
          <section className="border-t border-gray-100 bg-pingwash-ice/50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
              <div className="grid sm:grid-cols-3 gap-8 text-center">
                {[
                  { icon: "📍", title: "Entrez votre adresse", desc: "Domicile, bureau ou parking" },
                  { icon: "🐧", title: "Un laveur arrive", desc: "Professionnel formé, sous 30 min" },
                  { icon: "✨", title: "Véhicule impeccable", desc: "Écologique — 99% d'eau économisée" },
                ].map((s) => (
                  <div key={s.title}>
                    <div className="text-3xl mb-3">{s.icon}</div>
                    <h3 className="text-base font-bold text-black">{s.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ===== AUTH STEPS (email / login / signup) ===== */}
      {step !== "home" && (
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-[400px]">
            {/* Step: Email */}
            {step === "email" && (
              <>
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors mb-6"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Retour
                </button>

                <h1 className="text-[28px] font-bold text-black leading-tight mb-6">
                  Connectez-vous ou inscrivez-vous
                </h1>

                <form onSubmit={handleEmailContinue} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez votre email"
                    autoFocus
                    className="w-full px-4 py-[14px] bg-[#F3F3F3] rounded-lg text-[15px] text-black placeholder-[#5E5E5E] focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                  />

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-[14px] bg-pingwash-blue text-white font-medium text-[15px] rounded-lg hover:bg-pingwash-blue-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Chargement...
                      </span>
                    ) : (
                      "Continuer"
                    )}
                  </button>
                </form>

                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-[#5E5E5E]">ou</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleGoogleLogin}
                    className="flex items-center w-full py-[14px] px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="flex-1 text-center text-[15px] font-medium text-black">
                      Continuer avec Google
                    </span>
                  </button>

                  <button
                    disabled
                    className="flex items-center w-full py-[14px] px-4 rounded-lg border border-gray-300 opacity-50 cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <span className="flex-1 text-center text-[15px] font-medium text-gray-400">
                      Continuer avec Apple
                    </span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1 mt-6">
                  <span className="text-sm text-[#5E5E5E]">Pas encore de compte ?</span>
                  <button
                    onClick={() => setStep("signup")}
                    className="text-sm font-semibold text-pingwash-blue hover:underline"
                  >
                    S&apos;inscrire
                  </button>
                </div>

                <p className="text-xs text-[#5E5E5E] mt-6 leading-relaxed">
                  En continuant, vous acceptez les{" "}
                  <a href="#" className="underline">Conditions d&apos;utilisation</a> et la{" "}
                  <a href="#" className="underline">Politique de confidentialité</a> de PINGWASH.
                </p>
              </>
            )}

            {/* Step: Login */}
            {step === "login" && (
              <>
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors mb-6"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Retour
                </button>

                <h1 className="text-[28px] font-bold text-black leading-tight mb-2">
                  Bon retour !
                </h1>
                <p className="text-[15px] text-[#5E5E5E] mb-6">{email}</p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    autoFocus
                    className="w-full px-4 py-[14px] bg-[#F3F3F3] rounded-lg text-[15px] text-black placeholder-[#5E5E5E] focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                  />

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-[14px] bg-pingwash-blue text-white font-medium text-[15px] rounded-lg hover:bg-pingwash-blue-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </span>
                    ) : (
                      "Se connecter"
                    )}
                  </button>

                  <button
                    type="button"
                    className="w-full text-center text-sm text-[#5E5E5E] hover:text-black transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                </form>
              </>
            )}

            {/* Step: Signup */}
            {step === "signup" && (
              <>
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors mb-6"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Retour
                </button>

                <h1 className="text-[28px] font-bold text-black leading-tight mb-2">
                  Créez votre compte
                </h1>
                <p className="text-[15px] text-[#5E5E5E] mb-4">
                  {email || "Inscrivez-vous pour réserver votre lavage"}
                </p>

                {/* Google signup */}
                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center w-full py-[14px] px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors mb-4"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="flex-1 text-center text-[15px] font-medium text-black">
                    S&apos;inscrire avec Google
                  </span>
                </button>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-[#5E5E5E]">ou par email</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("client")}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all text-left ${
                        role === "client"
                          ? "border-pingwash-blue bg-pingwash-ice"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div className="text-base mb-0.5">🚗</div>
                      <div className="font-semibold text-sm text-black">Client</div>
                      <div className="text-xs text-[#5E5E5E]">Faire laver mon véhicule</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("laveur")}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all text-left ${
                        role === "laveur"
                          ? "border-pingwash-blue bg-pingwash-ice"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div className="text-base mb-0.5">🐧</div>
                      <div className="font-semibold text-sm text-black">Laveur</div>
                      <div className="text-xs text-[#5E5E5E]">Rejoindre l&apos;équipe</div>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Prénom"
                      autoFocus
                      className="w-full px-4 py-[14px] bg-[#F3F3F3] rounded-lg text-[15px] text-black placeholder-[#5E5E5E] focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                    />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nom"
                      className="w-full px-4 py-[14px] bg-[#F3F3F3] rounded-lg text-[15px] text-black placeholder-[#5E5E5E] focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                    />
                  </div>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Téléphone (optionnel)"
                    className="w-full px-4 py-[14px] bg-[#F3F3F3] rounded-lg text-[15px] text-black placeholder-[#5E5E5E] focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Créer un mot de passe"
                    className="w-full px-4 py-[14px] bg-[#F3F3F3] rounded-lg text-[15px] text-black placeholder-[#5E5E5E] focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                  />

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-[14px] bg-pingwash-blue text-white font-medium text-[15px] rounded-lg hover:bg-pingwash-blue-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </span>
                    ) : (
                      "Créer mon compte"
                    )}
                  </button>

                  <p className="text-xs text-[#5E5E5E] leading-relaxed">
                    En vous inscrivant, vous acceptez les{" "}
                    <a href="#" className="underline">Conditions d&apos;utilisation</a> et la{" "}
                    <a href="#" className="underline">Politique de confidentialité</a> de PINGWASH.
                  </p>
                </form>

                <div className="flex items-center justify-center gap-1 mt-6">
                  <span className="text-sm text-[#5E5E5E]">Déjà un compte ?</span>
                  <button
                    onClick={() => setStep("email")}
                    className="text-sm font-semibold text-pingwash-blue hover:underline"
                  >
                    Se connecter
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
