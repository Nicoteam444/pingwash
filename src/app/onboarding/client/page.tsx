"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MultiStepForm from "@/components/MultiStepForm";
import StepCard from "@/components/StepCard";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import type { AddressDetails } from "@/components/AddressAutocomplete";

const VEHICLE_TYPES = [
  { id: "voiture", icon: "🚗", label: "Voiture" },
  { id: "moto", icon: "🏍️", label: "Moto" },
  { id: "velo", icon: "🚲", label: "Vélo" },
];

const LOCATION_TYPES = [
  { id: "domicile", icon: "🏠", label: "Domicile" },
  { id: "entreprise", icon: "🏢", label: "Entreprise" },
];

const FORFAITS = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: 99,
    color: "pingwash-blue",
    features: ["Lavage extérieur complet", "Jantes & pneus", "Vitres & rétroviseurs", "Produits 100% éco"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 149,
    color: "pingwash-green",
    popular: true,
    features: [
      "Tout l'Essentiel +",
      "Intérieur complet",
      "Aspiration & dépoussiérage",
      "Tableau de bord & plastiques",
      "Parfum longue durée",
    ],
  },
  {
    id: "royal",
    name: "Royal",
    price: 199,
    color: "pingwash-orange",
    features: [
      "Tout le Premium +",
      "Shampooing sièges",
      "Rénovation plastiques",
      "Traitement hydrophobe",
      "Nettoyage moteur",
      "Check-list IA 50 points",
    ],
  },
];

const OPTIONS = [
  { id: "desodorisant", label: "Désodorisant premium", price: 12, icon: "🌸" },
  { id: "cuir", label: "Traitement cuir", price: 37, icon: "💺" },
  { id: "phares", label: "Rénovation phares", price: 62, icon: "💡" },
  { id: "anti-pluie", label: "Traitement anti-pluie vitres", price: 25, icon: "🌧️" },
  { id: "jantes-premium", label: "Polissage jantes", price: 30, icon: "✨" },
  { id: "stickers", label: "Retrait autocollants", price: 20, icon: "🏷️" },
];

const STEPS = [
  { title: "Véhicule", icon: "🚗" },
  { title: "Adresse", icon: "📍" },
  { title: "Créneau", icon: "📅" },
  { title: "Forfait", icon: "🧴" },
  { title: "Options", icon: "✨" },
  { title: "Récap", icon: "✓" },
];

export default function OnboardingClient() {
  const router = useRouter();
  const supabase = createClient();
  const { user, refreshProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Inline signup fields (shown at recap if not logged in)
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");

  const [vehicleType, setVehicleType] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");

  const [locationType, setLocationType] = useState("");
  const [address, setAddress] = useState("");
  const [addressComplement, setAddressComplement] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Pre-fill address from sessionStorage (coming from homepage/connexion)
  useEffect(() => {
    const storedAddress = sessionStorage.getItem("pingwash_address");
    const storedDetails = sessionStorage.getItem("pingwash_address_details");
    if (storedAddress) setAddress(storedAddress);
    if (storedDetails) {
      try {
        const details = JSON.parse(storedDetails);
        if (details.postcode) setPostalCode(details.postcode);
        if (details.city) setCity(details.city);
      } catch { /* ignore */ }
    }
  }, []);

  const [scheduleType, setScheduleType] = useState<"immediate" | "planned" | "">("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [selectedForfait, setSelectedForfait] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  function toggleOption(id: string) {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  }

  const forfait = FORFAITS.find((f) => f.id === selectedForfait);
  const optionsTotal = OPTIONS.filter((o) => selectedOptions.includes(o.id)).reduce(
    (sum, o) => sum + o.price,
    0
  );
  const total = (forfait?.price ?? 0) + optionsTotal;

  return (
    <MultiStepForm
      steps={STEPS}
      accentColor="blue"
      onComplete={async () => {
        setIsSaving(true);
        setSaveError("");

        try {
          let currentUser = user;

          // If not logged in, sign up first
          if (!currentUser) {
            if (!signupEmail || !signupPassword || !signupFirstName || !signupLastName) {
              setSaveError("Veuillez remplir tous les champs du compte pour confirmer.");
              setIsSaving(false);
              return;
            }
            if (signupPassword.length < 6) {
              setSaveError("Le mot de passe doit contenir au moins 6 caractères.");
              setIsSaving(false);
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
              setSaveError(signUpError.message);
              setIsSaving(false);
              return;
            }

            currentUser = signUpData.user;
            if (refreshProfile) await refreshProfile();

            // Small delay for the trigger to create the profile
            await new Promise((r) => setTimeout(r, 1000));
          }

          if (!currentUser) {
            setSaveError("Erreur de création de compte. Veuillez réessayer.");
            setIsSaving(false);
            return;
          }

          // 1. Create vehicle
          const { data: vehicle, error: vehicleError } = await supabase
            .from("vehicles")
            .insert({
              user_id: currentUser.id,
              type: vehicleType,
              brand: vehicleBrand || null,
              model: vehicleModel || null,
            })
            .select()
            .single();

          if (vehicleError) throw vehicleError;

          // 2. Build scheduled_at if planned
          let scheduledAt = null;
          if (scheduleType === "planned" && selectedDate && selectedTime) {
            scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
          }

          // 3. Create booking
          const { error: bookingError } = await supabase.from("bookings").insert({
            user_id: currentUser.id,
            vehicle_id: vehicle.id,
            location_type: locationType || null,
            address,
            address_complement: addressComplement || null,
            postal_code: postalCode,
            city,
            schedule_type: scheduleType || null,
            scheduled_at: scheduledAt,
            forfait: selectedForfait,
            options: selectedOptions,
            total_price: total,
          });

          if (bookingError) throw bookingError;

          // Clear stored address
          sessionStorage.removeItem("pingwash_address");
          sessionStorage.removeItem("pingwash_address_details");

          router.push("/");
        } catch (err) {
          console.error("Booking save error:", err);
          setSaveError("Erreur lors de la sauvegarde. Veuillez réessayer.");
        } finally {
          setIsSaving(false);
        }
      }}
    >
      {/* Étape 1 — Type de véhicule */}
      <StepCard
        title="Quel véhicule ?"
        subtitle="Sélectionnez le type de véhicule à laver."
      >
        <div className="grid grid-cols-3 gap-4">
          {VEHICLE_TYPES.map((v) => (
            <button
              key={v.id}
              onClick={() => setVehicleType(v.id)}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                vehicleType === v.id
                  ? "border-pingwash-blue bg-pingwash-blue/5 scale-[1.02]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-4xl">{v.icon}</span>
              <span className="text-sm font-semibold text-pingwash-navy">{v.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Marque <span className="text-gray-400">(optionnel)</span>
            </label>
            <input
              type="text"
              value={vehicleBrand}
              onChange={(e) => setVehicleBrand(e.target.value)}
              placeholder="Ex: Peugeot"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Modèle <span className="text-gray-400">(optionnel)</span>
            </label>
            <input
              type="text"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              placeholder="Ex: 308"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all"
            />
          </div>
        </div>
      </StepCard>

      {/* Étape 2 — Adresse */}
      <StepCard
        title="Où se trouve le véhicule ?"
        subtitle="Indiquez l'adresse du lavage."
      >
        <div className="flex gap-4 mb-6">
          {LOCATION_TYPES.map((l) => (
            <button
              key={l.id}
              onClick={() => setLocationType(l.id)}
              className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                locationType === l.id
                  ? "border-pingwash-blue bg-pingwash-blue/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl">{l.icon}</span>
              <span className="text-sm font-semibold text-pingwash-navy">{l.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Adresse</label>
            <AddressAutocomplete
              value={address}
              onChange={(displayName: string, details: AddressDetails | null) => {
                setAddress(displayName);
                if (details) {
                  if (details.postcode) setPostalCode(details.postcode);
                  if (details.city) setCity(details.city);
                }
              }}
              placeholder="12 rue de la Paix"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Complément <span className="text-gray-400">(optionnel)</span>
            </label>
            <input
              type="text"
              value={addressComplement}
              onChange={(e) => setAddressComplement(e.target.value)}
              placeholder="Bât. A, parking souterrain..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Code postal</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="75001"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Ville</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Paris"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all"
              />
            </div>
          </div>
        </div>
      </StepCard>

      {/* Étape 3 — Créneau */}
      <StepCard
        title="Quand ?"
        subtitle="Tout de suite ou planifiez votre lavage."
      >
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setScheduleType("immediate")}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
              scheduleType === "immediate"
                ? "border-pingwash-blue bg-pingwash-blue/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="text-3xl">⚡</span>
            <span className="text-sm font-bold text-pingwash-navy">Maintenant</span>
            <span className="text-xs text-gray-500">Laveur disponible sous 30 min</span>
          </button>
          <button
            onClick={() => setScheduleType("planned")}
            className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
              scheduleType === "planned"
                ? "border-pingwash-blue bg-pingwash-blue/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="text-3xl">📅</span>
            <span className="text-sm font-bold text-pingwash-navy">Planifier</span>
            <span className="text-xs text-gray-500">Choisissez date et heure</span>
          </button>
        </div>

        {scheduleType === "planned" && (
          <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Heure</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all bg-white"
              >
                <option value="">Choisir un créneau</option>
                {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        )}

        {scheduleType === "immediate" && (
          <div className="flex items-center gap-3 p-4 bg-pingwash-blue/5 rounded-xl animate-fade-in-up">
            <span className="text-2xl">🐧</span>
            <div>
              <p className="text-sm font-semibold text-pingwash-navy">
                Un laveur sera chez vous sous 30 minutes
              </p>
              <p className="text-xs text-gray-500">Selon la disponibilité dans votre zone</p>
            </div>
          </div>
        )}
      </StepCard>

      {/* Étape 4 — Forfait */}
      <StepCard
        title="Choisissez votre forfait"
        subtitle="Notre IA vous recommande le Premium pour un résultat optimal."
      >
        <div className="space-y-4">
          {FORFAITS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedForfait(f.id)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                selectedForfait === f.id
                  ? `border-${f.color} bg-${f.color}/5 scale-[1.01]`
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-pingwash-navy">{f.name}</h3>
                  {f.popular && (
                    <span className="px-2 py-0.5 bg-pingwash-green text-white text-xs font-bold rounded-full">
                      Recommandé
                    </span>
                  )}
                </div>
                <span className="text-2xl font-black text-pingwash-navy">{f.price}€</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {f.features.map((feat) => (
                  <span
                    key={feat}
                    className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg"
                  >
                    <span className="text-pingwash-green">✓</span> {feat}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </StepCard>

      {/* Étape 5 — Options */}
      <StepCard
        title="Des extras ?"
        subtitle="Ajoutez des options pour un résultat encore meilleur."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OPTIONS.map((opt) => {
            const active = selectedOptions.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  active
                    ? "border-pingwash-blue bg-pingwash-blue/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-pingwash-navy block">
                    {opt.label}
                  </span>
                  <span className="text-xs text-gray-500">+{opt.price}€</span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    active
                      ? "bg-pingwash-blue border-pingwash-blue text-white"
                      : "border-gray-300"
                  }`}
                >
                  {active && <span className="text-xs">✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        {selectedOptions.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedOptions.length} option{selectedOptions.length > 1 ? "s" : ""} sélectionnée{selectedOptions.length > 1 ? "s" : ""}
            </span>
            <span className="text-sm font-bold text-pingwash-navy">+{optionsTotal}€</span>
          </div>
        )}
      </StepCard>

      {/* Étape 6 — Récap */}
      <StepCard title="Récapitulatif" subtitle="Vérifiez votre commande avant de confirmer.">
        <div className="space-y-4">
          {/* Véhicule */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {VEHICLE_TYPES.find((v) => v.id === vehicleType)?.icon ?? "🚗"}
              </span>
              <div>
                <p className="text-sm font-semibold text-pingwash-navy">
                  {VEHICLE_TYPES.find((v) => v.id === vehicleType)?.label ?? "Véhicule"}
                </p>
                {vehicleBrand && (
                  <p className="text-xs text-gray-500">
                    {vehicleBrand} {vehicleModel}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {LOCATION_TYPES.find((l) => l.id === locationType)?.icon ?? "📍"}
              </span>
              <div>
                <p className="text-sm font-semibold text-pingwash-navy">
                  {address || "Adresse non renseignée"}
                </p>
                <p className="text-xs text-gray-500">
                  {postalCode} {city}
                </p>
              </div>
            </div>
          </div>

          {/* Créneau */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{scheduleType === "immediate" ? "⚡" : "📅"}</span>
              <div>
                <p className="text-sm font-semibold text-pingwash-navy">
                  {scheduleType === "immediate"
                    ? "Dès que possible"
                    : selectedDate
                    ? `Le ${selectedDate} à ${selectedTime}`
                    : "Créneau non sélectionné"}
                </p>
              </div>
            </div>
          </div>

          {/* Forfait + Options */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            {forfait && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Forfait {forfait.name}</span>
                <span className="text-sm font-bold text-pingwash-navy">{forfait.price}€</span>
              </div>
            )}
            {OPTIONS.filter((o) => selectedOptions.includes(o.id)).map((o) => (
              <div key={o.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {o.icon} {o.label}
                </span>
                <span className="text-sm font-bold text-pingwash-navy">+{o.price}€</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
              <span className="text-base font-bold text-pingwash-navy">Total</span>
              <span className="text-2xl font-black text-pingwash-blue">{total}€</span>
            </div>
          </div>

          {/* Eco badge */}
          <div className="flex items-center gap-3 p-4 bg-pingwash-green/5 rounded-xl mt-4">
            <span className="text-2xl">🌍</span>
            <div>
              <p className="text-sm font-semibold text-pingwash-green">
                Lavage écologique
              </p>
              <p className="text-xs text-gray-500">
                Ce lavage économisera ~195L d&apos;eau par rapport à un lavage classique.
              </p>
            </div>
          </div>

          {/* Inline signup if not logged in */}
          {!user && (
            <div className="mt-6 p-5 bg-pingwash-ice rounded-2xl border border-pingwash-blue/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-pingwash-blue/10 flex items-center justify-center">
                  <span className="text-lg">🐧</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-pingwash-navy">Créez votre compte pour confirmer</h3>
                  <p className="text-xs text-gray-500">Rapide — 30 secondes</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={signupFirstName}
                    onChange={(e) => setSignupFirstName(e.target.value)}
                    placeholder="Prénom"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all bg-white"
                  />
                  <input
                    type="text"
                    value={signupLastName}
                    onChange={(e) => setSignupLastName(e.target.value)}
                    placeholder="Nom"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all bg-white"
                  />
                </div>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all bg-white"
                />
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder="Téléphone (optionnel)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all bg-white"
                />
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Mot de passe (min. 6 caractères)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 focus:border-pingwash-blue transition-all bg-white"
                />
              </div>
              <p className="text-xs text-gray-400 mt-3">
                En confirmant, vous acceptez les{" "}
                <a href="#" className="underline">Conditions d&apos;utilisation</a> et la{" "}
                <a href="#" className="underline">Politique de confidentialité</a>.
              </p>
            </div>
          )}

          {user && (
            <div className="mt-6 p-4 bg-pingwash-ice rounded-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-pingwash-blue text-white flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <div>
                <p className="text-sm font-semibold text-pingwash-navy">Connecté</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          )}

          {saveError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">
              {saveError}
            </div>
          )}

          {isSaving && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="w-4 h-4 border-2 border-gray-300 border-t-pingwash-blue rounded-full animate-spin" />
              Enregistrement en cours...
            </div>
          )}
        </div>
      </StepCard>
    </MultiStepForm>
  );
}
