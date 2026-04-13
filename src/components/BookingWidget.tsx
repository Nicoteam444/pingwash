"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartProvider";
import AddressAutocomplete from "./AddressAutocomplete";
import type { AddressDetails } from "./AddressAutocomplete";

const VEHICLE_TYPES = [
  { id: "voiture", icon: "🚗", label: "Voiture" },
  { id: "moto", icon: "🏍️", label: "Moto" },
  { id: "velo", icon: "🚲", label: "Vélo" },
];

const FORFAITS = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: 99,
    color: "pingwash-blue",
    features: ["Lavage extérieur", "Jantes & pneus", "Vitres", "Produits éco"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 149,
    color: "pingwash-green",
    popular: true,
    features: ["Tout Essentiel +", "Intérieur complet", "Aspiration", "Parfum"],
  },
  {
    id: "royal",
    name: "Royal",
    price: 199,
    color: "pingwash-orange",
    features: ["Tout Premium +", "Sièges", "Hydrophobe", "Moteur", "IA 50 pts"],
  },
];

const OPTIONS = [
  { id: "desodorisant", label: "Désodorisant premium", price: 12, icon: "🌸" },
  { id: "cuir", label: "Traitement cuir", price: 37, icon: "💺" },
  { id: "phares", label: "Rénovation phares", price: 62, icon: "💡" },
  { id: "anti-pluie", label: "Anti-pluie vitres", price: 25, icon: "🌧️" },
  { id: "jantes-premium", label: "Polissage jantes", price: 30, icon: "✨" },
  { id: "stickers", label: "Retrait autocollants", price: 20, icon: "🏷️" },
];

export default function BookingWidget() {
  const { addItem, itemCount } = useCart();

  const [address, setAddress] = useState("");
  const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(null);
  const [vehicleType, setVehicleType] = useState("");
  const [selectedForfait, setSelectedForfait] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState("immediate");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Pre-fill address from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("pingwash_address");
    const storedDetails = sessionStorage.getItem("pingwash_address_details");
    const storedSchedule = sessionStorage.getItem("pingwash_schedule");
    if (stored) setAddress(stored);
    if (storedDetails) {
      try { setAddressDetails(JSON.parse(storedDetails)); } catch { /* */ }
    }
    if (storedSchedule === "planned") setScheduleType("planned");
  }, []);

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

  const canAdd = vehicleType && selectedForfait && address.trim();

  const handleAddToCart = () => {
    if (!canAdd) return;

    addItem({
      vehicleType,
      address,
      postalCode: addressDetails?.postcode || "",
      city: addressDetails?.city || "",
      locationType: "domicile",
      scheduleType,
      scheduledDate: scheduleType === "planned" ? selectedDate : undefined,
      scheduledTime: scheduleType === "planned" ? selectedTime : undefined,
      forfait: selectedForfait,
      forfaitPrice: forfait?.price ?? 0,
      options: selectedOptions,
      optionsTotal,
      total,
    });

    // Reset form
    setVehicleType("");
    setSelectedForfait("");
    setSelectedOptions([]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <section id="reserver" className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-pingwash-navy">
            Composez votre <span className="text-gradient">lavage</span>
          </h2>
          <p className="mt-3 text-gray-500 text-lg">
            Choisissez votre véhicule, votre forfait et ajoutez au panier.
          </p>
        </div>

        <div className="bg-gradient-to-b from-pingwash-ice/50 to-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm">
          {/* Address */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-pingwash-navy mb-2">
              📍 Adresse du lavage
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <AddressAutocomplete
                value={address}
                onChange={(displayName, details) => {
                  setAddress(displayName);
                  setAddressDetails(details);
                }}
                placeholder="Saisissez votre adresse"
                className="flex-1"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setScheduleType("immediate")}
                  className={`flex-1 sm:flex-none px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    scheduleType === "immediate"
                      ? "bg-pingwash-blue text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  ⚡ Maintenant
                </button>
                <button
                  onClick={() => setScheduleType("planned")}
                  className={`flex-1 sm:flex-none px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    scheduleType === "planned"
                      ? "bg-pingwash-blue text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  📅 Planifier
                </button>
              </div>
            </div>
            {scheduleType === "planned" && (
              <div className="grid grid-cols-2 gap-3 mt-3 animate-fade-in-up">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30"
                />
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 bg-white"
                >
                  <option value="">Créneau</option>
                  {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"].map(
                    (t) => <option key={t} value={t}>{t}</option>
                  )}
                </select>
              </div>
            )}
          </div>

          {/* Vehicle type */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-pingwash-navy mb-3">
              🚗 Type de véhicule
            </label>
            <div className="grid grid-cols-3 gap-3">
              {VEHICLE_TYPES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVehicleType(v.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    vehicleType === v.id
                      ? "border-pingwash-blue bg-pingwash-blue/5 scale-[1.02]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-3xl">{v.icon}</span>
                  <span className="text-sm font-semibold text-pingwash-navy">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Forfait */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-pingwash-navy mb-3">
              🧴 Choisissez votre forfait
            </label>
            <div className="grid sm:grid-cols-3 gap-4">
              {FORFAITS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedForfait(f.id)}
                  className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                    selectedForfait === f.id
                      ? "border-pingwash-blue bg-pingwash-blue/5 shadow-md scale-[1.02]"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {f.popular && (
                    <span className="absolute -top-3 right-4 px-2.5 py-0.5 bg-pingwash-green text-white text-xs font-bold rounded-full">
                      Populaire
                    </span>
                  )}
                  <div className="text-2xl font-black text-pingwash-navy">{f.price}€</div>
                  <div className="text-base font-bold text-pingwash-navy mt-1">{f.name}</div>
                  <div className="mt-3 space-y-1">
                    {f.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="text-pingwash-green">✓</span> {feat}
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-pingwash-navy mb-3">
              ✨ Options <span className="font-normal text-gray-400">(facultatif)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {OPTIONS.map((opt) => {
                const active = selectedOptions.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                      active
                        ? "border-pingwash-blue bg-pingwash-blue/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-pingwash-navy block truncate">
                        {opt.label}
                      </span>
                      <span className="text-xs text-gray-500">+{opt.price}€</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        active
                          ? "bg-pingwash-blue border-pingwash-blue text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {active && <span className="text-[10px]">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total + Add to cart */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div>
              {forfait ? (
                <div className="text-center sm:text-left">
                  <span className="text-sm text-gray-500">Total :</span>
                  <span className="ml-2 text-3xl font-black text-pingwash-navy">{total}€</span>
                  {optionsTotal > 0 && (
                    <span className="text-sm text-gray-400 ml-2">
                      ({forfait.price}€ + {optionsTotal}€ d&apos;options)
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm text-gray-400">Sélectionnez un forfait pour voir le prix</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!canAdd}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-xl transition-all ${
                canAdd
                  ? "bg-pingwash-blue text-white hover:bg-pingwash-blue-dark shadow-lg shadow-pingwash-blue/30 hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              🛒 Ajouter au panier
              {itemCount > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Success notification */}
          {showSuccess && (
            <div className="mt-4 p-4 bg-pingwash-green/10 text-pingwash-green rounded-xl text-sm font-medium text-center animate-fade-in-up">
              ✓ Lavage ajouté au panier ! <a href="/panier" className="underline font-bold">Voir le panier</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
