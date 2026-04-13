"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PingwashLogo from "@/components/PingwashLogo";

type Tab = "connexion" | "inscription";
type Role = "client" | "laveur";

export default function ConnexionPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("connexion");
  const [role, setRole] = useState<Role>("client");

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pingwash-navy to-pingwash-blue-dark relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-pingwash-blue/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-pingwash-green/20 rounded-full blur-3xl" />
        </div>

        <div className="relative text-white text-center max-w-md">
          <svg viewBox="0 0 200 200" className="w-40 h-40 mx-auto mb-8 animate-float">
            <ellipse cx="100" cy="110" rx="40" ry="60" fill="white" opacity="0.15" />
            <ellipse cx="100" cy="100" rx="35" ry="52" fill="#0c1e2c" />
            <ellipse cx="100" cy="110" rx="23" ry="35" fill="white" />
            <circle cx="90" cy="85" r="6" fill="#0ea5e9" />
            <circle cx="110" cy="85" r="6" fill="#0ea5e9" />
            <ellipse cx="100" cy="95" rx="5" ry="3" fill="#f97316" />
            {/* Crown / sparkle */}
            <text x="80" y="65" fontSize="20" fill="#fbbf24">✦</text>
            <text x="115" y="72" fontSize="14" fill="#10b981">✦</text>
          </svg>

          <h1 className="text-3xl font-black">PINGWASH</h1>
          <p className="mt-2 text-lg text-blue-200">Le laveur qui protège la banquise</p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: "30s", label: "pour réserver" },
              { value: "4.9★", label: "satisfaction" },
              { value: "99%", label: "eau économisée" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-xs text-blue-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden mb-8">
            <Link href="/">
              <PingwashLogo className="h-9 mx-auto" />
            </Link>
          </div>

          {/* Back to home */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-pingwash-blue transition-colors mb-8"
          >
            ← Retour à l&apos;accueil
          </Link>

          {/* Tab toggle */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-8">
            <button
              onClick={() => setTab("connexion")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all ${
                tab === "connexion"
                  ? "bg-white text-pingwash-navy shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setTab("inscription")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all ${
                tab === "inscription"
                  ? "bg-white text-pingwash-navy shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Role selector (inscription only) */}
          {tab === "inscription" && (
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setRole("client")}
                className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${
                  role === "client"
                    ? "border-pingwash-blue bg-pingwash-blue/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-lg mb-1">🚗</div>
                <div className="font-semibold text-sm text-pingwash-navy">Client</div>
                <div className="text-xs text-gray-500">Je veux faire laver mon véhicule</div>
              </button>
              <button
                onClick={() => setRole("laveur")}
                className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${
                  role === "laveur"
                    ? "border-pingwash-green bg-pingwash-green/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-lg mb-1">🐧</div>
                <div className="font-semibold text-sm text-pingwash-navy">Laveur</div>
                <div className="text-xs text-gray-500">Je veux rejoindre l&apos;équipe</div>
              </button>
            </div>
          )}

          <h2 className="text-2xl font-black text-pingwash-navy mb-2">
            {tab === "connexion" ? "Bon retour !" : "Bienvenue chez PINGWASH"}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {tab === "connexion"
              ? "Connectez-vous pour gérer vos lavages."
              : role === "client"
              ? "Créez votre compte et réservez votre premier lavage."
              : "Rejoignez notre équipe de laveurs indépendants."}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (tab === "inscription") {
                router.push(role === "laveur" ? "/onboarding/laveur" : "/onboarding/client");
              } else {
                router.push("/");
              }
            }}
            className="space-y-4"
          >
            {tab === "inscription" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="prenom" className="block text-xs font-medium text-gray-700 mb-1.5">
                    Prénom
                  </label>
                  <input
                    id="prenom"
                    type="text"
                    placeholder="Jean"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="nom" className="block text-xs font-medium text-gray-700 mb-1.5">
                    Nom
                  </label>
                  <input
                    id="nom"
                    type="text"
                    placeholder="Dupont"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="jean@exemple.fr"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all"
              />
            </div>

            {tab === "inscription" && (
              <div>
                <label htmlFor="telephone" className="block text-xs font-medium text-gray-700 mb-1.5">
                  Téléphone
                </label>
                <input
                  id="telephone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all"
              />
            </div>

            {tab === "connexion" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-gray-500">
                  <input type="checkbox" className="rounded" />
                  Se souvenir de moi
                </label>
                <a href="#" className="text-xs text-pingwash-blue hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3.5 rounded-full font-bold text-sm text-white transition-all hover:scale-[1.02] shadow-lg ${
                tab === "inscription" && role === "laveur"
                  ? "bg-pingwash-green hover:bg-pingwash-green-dark shadow-pingwash-green/30"
                  : "bg-pingwash-blue hover:bg-pingwash-blue-dark shadow-pingwash-blue/30"
              }`}
            >
              {tab === "connexion"
                ? "Se connecter"
                : role === "client"
                ? "Créer mon compte"
                : "Postuler comme laveur"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social login */}
          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continuer avec Google
            </button>
            <button className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Continuer avec Apple
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            {tab === "connexion" ? (
              <>
                Pas encore de compte ?{" "}
                <button onClick={() => setTab("inscription")} className="text-pingwash-blue hover:underline font-medium">
                  S&apos;inscrire
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{" "}
                <button onClick={() => setTab("connexion")} className="text-pingwash-blue hover:underline font-medium">
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
