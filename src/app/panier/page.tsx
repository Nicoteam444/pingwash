"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import PingwashLogo from "@/components/PingwashLogo";

const VEHICLE_LABELS: Record<string, string> = {
  voiture: "🚗 Voiture",
  moto: "🏍️ Moto",
  velo: "🚲 Vélo",
};

const FORFAIT_LABELS: Record<string, string> = {
  essentiel: "Essentiel",
  premium: "Premium",
  royal: "Royal",
};

const OPTION_LABELS: Record<string, string> = {
  desodorisant: "🌸 Désodorisant",
  cuir: "💺 Traitement cuir",
  phares: "💡 Rénovation phares",
  "anti-pluie": "🌧️ Anti-pluie",
  "jantes-premium": "✨ Polissage jantes",
  stickers: "🏷️ Retrait autocollants",
};

export default function PanierPage() {
  const router = useRouter();
  const { items, removeItem, clearCart, totalPrice, itemCount } = useCart();
  const { user, refreshProfile } = useAuth();
  const supabase = createClient();

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleValidate = async () => {
    setError("");
    setIsLoading(true);

    try {
      let currentUser = user;

      // Sign up if not logged in
      if (!currentUser) {
        if (!signupEmail || !signupPassword || !signupFirstName || !signupLastName) {
          setError("Veuillez remplir tous les champs obligatoires.");
          setIsLoading(false);
          return;
        }
        if (signupPassword.length < 6) {
          setError("Le mot de passe doit contenir au moins 6 caractères.");
          setIsLoading(false);
          return;
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: signupEmail,
          password: signupPassword,
          options: {
            data: {
              first_name: signupFirstName,
              last_name: signupLastName,
              phone: signupPhone,
              role: "client",
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          setIsLoading(false);
          return;
        }

        currentUser = signUpData.user;
        if (refreshProfile) await refreshProfile();
        await new Promise((r) => setTimeout(r, 1000));
      }

      if (!currentUser) {
        setError("Erreur de création de compte.");
        setIsLoading(false);
        return;
      }

      // Create bookings for each cart item
      for (const item of items) {
        // Create vehicle
        const { data: vehicle, error: vErr } = await supabase
          .from("vehicles")
          .insert({
            user_id: currentUser.id,
            type: item.vehicleType,
          })
          .select()
          .single();

        if (vErr) throw vErr;

        // Build scheduled_at
        let scheduledAt = null;
        if (item.scheduleType === "planned" && item.scheduledDate && item.scheduledTime) {
          scheduledAt = new Date(`${item.scheduledDate}T${item.scheduledTime}:00`).toISOString();
        }

        // Create booking
        const { error: bErr } = await supabase.from("bookings").insert({
          user_id: currentUser.id,
          vehicle_id: vehicle.id,
          location_type: item.locationType || "domicile",
          address: item.address,
          postal_code: item.postalCode,
          city: item.city,
          schedule_type: item.scheduleType || "immediate",
          scheduled_at: scheduledAt,
          forfait: item.forfait,
          options: item.options,
          total_price: item.total,
        });

        if (bErr) throw bErr;
      }

      clearCart();
      router.push("/confirmation");
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Erreur lors de la validation. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=/panier`,
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="flex items-center px-6 py-4 border-b border-gray-100">
          <Link href="/"><PingwashLogo className="h-8" /></Link>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🐧</div>
            <h1 className="text-3xl font-black text-pingwash-navy mb-3">Réservation confirmée !</h1>
            <p className="text-gray-500 mb-8">
              Votre laveur sera bientôt en route. Vous recevrez une confirmation par email.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-xl transition-all"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Link href="/"><PingwashLogo className="h-8" /></Link>
        <Link href="/" className="text-sm text-gray-500 hover:text-pingwash-blue transition-colors">
          ← Continuer mes achats
        </Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-black text-pingwash-navy mb-6">
          🛒 Mon panier {itemCount > 0 && <span className="text-gray-400 font-normal text-lg">({itemCount} lavage{itemCount > 1 ? "s" : ""})</span>}
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-4">🐧</div>
            <h2 className="text-xl font-bold text-pingwash-navy mb-2">Votre panier est vide</h2>
            <p className="text-gray-500 mb-6">Ajoutez un lavage pour commencer !</p>
            <Link
              href="/#reserver"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-xl transition-all"
            >
              Réserver un lavage
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 transition-all hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{VEHICLE_LABELS[item.vehicleType]?.split(" ")[0] || "🚗"}</span>
                      <div>
                        <h3 className="font-bold text-pingwash-navy">
                          {FORFAIT_LABELS[item.forfait] || item.forfait} — {VEHICLE_LABELS[item.vehicleType]?.split(" ")[1] || item.vehicleType}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          📍 {item.address || "Adresse non renseignée"}
                          {item.city && `, ${item.city}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.scheduleType === "immediate" ? "⚡ Dès que possible" : `📅 ${item.scheduledDate} à ${item.scheduledTime}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1"
                      title="Supprimer"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {item.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.options.map((optId) => (
                        <span key={optId} className="text-xs bg-pingwash-ice text-pingwash-blue px-2 py-1 rounded-lg">
                          {OPTION_LABELS[optId] || optId}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Forfait {item.forfaitPrice}€
                      {item.optionsTotal > 0 && ` + options ${item.optionsTotal}€`}
                    </span>
                    <span className="text-lg font-black text-pingwash-navy">{item.total}€</span>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-sm text-gray-400 hover:text-red-400 transition-colors"
              >
                Vider le panier
              </button>
            </div>

            {/* Sidebar — Total + Auth + Validate */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-8">
                {/* Total */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-gray-600">Total</span>
                  <span className="text-3xl font-black text-pingwash-navy">{totalPrice}€</span>
                </div>

                {/* Eco */}
                <div className="flex items-center gap-2 p-3 bg-pingwash-green/5 rounded-xl mb-6">
                  <span>🌍</span>
                  <span className="text-xs text-pingwash-green font-medium">
                    ~{itemCount * 195}L d&apos;eau économisés
                  </span>
                </div>

                {user ? (
                  <>
                    {/* Connected — show user + validate */}
                    <div className="flex items-center gap-3 p-3 bg-pingwash-ice rounded-xl mb-4">
                      <div className="w-8 h-8 rounded-full bg-pingwash-blue text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-pingwash-navy">Connecté</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleValidate}
                      disabled={isLoading}
                      className="w-full py-4 bg-pingwash-blue text-white font-bold text-base rounded-xl hover:bg-pingwash-blue-dark transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-pingwash-blue/20"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </span>
                      ) : (
                        "Valider la commande"
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Not connected — signup form */}
                    <p className="text-sm font-bold text-pingwash-navy mb-3">
                      Créez votre compte pour valider
                    </p>

                    {/* Google */}
                    <button
                      onClick={handleGoogleSignup}
                      className="flex items-center w-full py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors mb-3"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span className="flex-1 text-center text-sm font-medium text-black">
                        Continuer avec Google
                      </span>
                    </button>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400">ou</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={signupFirstName}
                          onChange={(e) => setSignupFirstName(e.target.value)}
                          placeholder="Prénom"
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30"
                        />
                        <input
                          type="text"
                          value={signupLastName}
                          onChange={(e) => setSignupLastName(e.target.value)}
                          placeholder="Nom"
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30"
                        />
                      </div>
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30"
                      />
                      <input
                        type="tel"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        placeholder="Téléphone (optionnel)"
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30"
                      />
                      <input
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Mot de passe (min. 6 car.)"
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30"
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-xs mt-2">{error}</p>
                    )}

                    <button
                      onClick={handleValidate}
                      disabled={isLoading}
                      className="w-full mt-4 py-4 bg-pingwash-blue text-white font-bold text-base rounded-xl hover:bg-pingwash-blue-dark transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-pingwash-blue/20"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </span>
                      ) : (
                        "Créer mon compte et valider"
                      )}
                    </button>

                    <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                      En validant, vous acceptez les Conditions d&apos;utilisation et la Politique de confidentialité.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
