"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/Toast";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import type { AddressDetails } from "@/components/AddressAutocomplete";
import type { Booking, Vehicle } from "@/lib/supabase/types";
import PingwashLogo from "@/components/PingwashLogo";

type Tab = "commande" | "lavages" | "paiement" | "adresses" | "vehicules" | "parametres";

const PENGUIN_AVATARS = ["🐧", "🐾", "❄️", "🧊", "🌊", "🐳", "🦭", "⛄"];
function getPenguinAvatar(userId: string) {
  const index = userId.charCodeAt(0) % PENGUIN_AVATARS.length;
  return PENGUIN_AVATARS[index];
}

const PENGUIN_COLORS = [
  "from-blue-400 to-cyan-300",
  "from-teal-400 to-emerald-300",
  "from-sky-400 to-blue-300",
  "from-indigo-400 to-blue-300",
  "from-cyan-400 to-teal-300",
];
function getPenguinColor(userId: string) {
  const index = userId.charCodeAt(1) % PENGUIN_COLORS.length;
  return PENGUIN_COLORS[index];
}

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  complement: string | null;
  postal_code: string;
  city: string;
  is_default: boolean;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "commande", label: "Nouvelle commande", icon: "➕" },
  { id: "lavages", label: "Mes lavages", icon: "🧽" },
  { id: "paiement", label: "Paiement", icon: "💳" },
  { id: "adresses", label: "Mes adresses", icon: "📍" },
  { id: "vehicules", label: "Mes véhicules", icon: "🚗" },
  { id: "parametres", label: "Paramètres", icon: "⚙️" },
];

const STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-700", icon: "⏳" },
  confirmed: { label: "Confirmé", color: "bg-blue-100 text-blue-700", icon: "✓" },
  in_progress: { label: "En cours", color: "bg-pingwash-green/10 text-pingwash-green", icon: "🧽" },
  completed: { label: "Terminé", color: "bg-gray-100 text-gray-600", icon: "✨" },
  cancelled: { label: "Annulé", color: "bg-red-100 text-red-600", icon: "✕" },
};

const FORFAIT_MAP: Record<string, string> = { essentiel: "Essentiel", premium: "Premium", royal: "Royal" };
const VEHICLE_MAP: Record<string, string> = { voiture: "🚗 Voiture", moto: "🏍️ Moto", velo: "🚲 Vélo" };

export default function DashboardPage() {
  const { user, profile, isLoading: authLoading, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const [tab, setTab] = useState<Tab>("lavages");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Forms
  const [statusFilter, setStatusFilter] = useState("all");
  // New order form
  const [orderVehicle, setOrderVehicle] = useState("voiture");
  const [orderAddress, setOrderAddress] = useState("");
  const [orderAddressDetails, setOrderAddressDetails] = useState<AddressDetails | null>(null);
  const [orderSchedule, setOrderSchedule] = useState("immediate");
  const [orderDate, setOrderDate] = useState("");
  const [orderTime, setOrderTime] = useState("");
  const [orderForfait, setOrderForfait] = useState("premium");
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicleType, setNewVehicleType] = useState("voiture");
  const [newVehicleBrand, setNewVehicleBrand] = useState("");
  const [newVehicleModel, setNewVehicleModel] = useState("");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newAddressDetails, setNewAddressDetails] = useState<AddressDetails | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/connexion?redirect=/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setEditFirstName(profile.first_name || "");
      setEditLastName(profile.last_name || "");
      setEditPhone(profile.phone || "");
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [bRes, vRes, aRes] = await Promise.all([
        supabase.from("bookings").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("vehicles").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("saved_addresses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setBookings((bRes.data as Booking[]) || []);
      setVehicles((vRes.data as Vehicle[]) || []);
      setAddresses((aRes.data as SavedAddress[]) || []);
      setIsLoading(false);
    };
    load();
  }, [user, supabase]);

  // Actions
  const addVehicle = async () => {
    if (!user) return;
    const { error } = await supabase.from("vehicles").insert({ user_id: user.id, type: newVehicleType, brand: newVehicleBrand || null, model: newVehicleModel || null });
    if (error) { toast(error.message, "error"); return; }
    toast("Véhicule ajouté !");
    setShowAddVehicle(false); setNewVehicleBrand(""); setNewVehicleModel("");
    const { data } = await supabase.from("vehicles").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setVehicles((data as Vehicle[]) || []);
  };

  const deleteVehicle = async (id: string) => {
    await supabase.from("vehicles").delete().eq("id", id);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    toast("Véhicule supprimé");
  };

  const addAddress = async () => {
    if (!user || !newAddress || !newAddressLabel) return;
    const { error } = await supabase.from("saved_addresses").insert({
      user_id: user.id, label: newAddressLabel, address: newAddress,
      postal_code: newAddressDetails?.postcode || "", city: newAddressDetails?.city || "",
    });
    if (error) { toast(error.message, "error"); return; }
    toast("Adresse ajoutée !");
    setShowAddAddress(false); setNewAddressLabel(""); setNewAddress(""); setNewAddressDetails(null);
    const { data } = await supabase.from("saved_addresses").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setAddresses((data as SavedAddress[]) || []);
  };

  const deleteAddress = async (id: string) => {
    await supabase.from("saved_addresses").delete().eq("id", id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast("Adresse supprimée");
  };

  const saveProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ first_name: editFirstName, last_name: editLastName, phone: editPhone }).eq("id", user.id);
    if (error) { toast(error.message, "error"); return; }
    toast("Profil mis à jour !");
    if (refreshProfile) await refreshProfile();
  };

  const submitOrder = async () => {
    if (!user || !orderAddress) { toast("Veuillez renseigner une adresse", "error"); return; }
    setOrderSubmitting(true);
    try {
      const prices: Record<string, number> = { essentiel: 99, premium: 149, royal: 199 };
      const { data: vehicle, error: vErr } = await supabase.from("vehicles").insert({ user_id: user.id, type: orderVehicle }).select().single();
      if (vErr) throw vErr;
      let scheduledAt = null;
      if (orderSchedule === "planned" && orderDate && orderTime) scheduledAt = new Date(`${orderDate}T${orderTime}:00`).toISOString();
      const { error: bErr } = await supabase.from("bookings").insert({
        user_id: user.id, vehicle_id: vehicle.id, location_type: "domicile",
        address: orderAddress, postal_code: orderAddressDetails?.postcode || "", city: orderAddressDetails?.city || "",
        schedule_type: orderSchedule, scheduled_at: scheduledAt,
        forfait: orderForfait, options: [], total_price: prices[orderForfait] || 149,
      });
      if (bErr) throw bErr;
      toast("Commande créée !");
      setTab("lavages");
      setOrderAddress(""); setOrderAddressDetails(null);
      // Refresh bookings
      const { data } = await supabase.from("bookings").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setBookings((data as Booking[]) || []);
    } catch (err) {
      console.error(err);
      toast("Erreur lors de la commande", "error");
    } finally {
      setOrderSubmitting(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", bookingId);
    if (error) { toast(error.message, "error"); return; }
    setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: newStatus as Booking["status"] } : b));
    toast(`Statut mis à jour : ${STATUS_MAP[newStatus]?.label || newStatus}`);
  };

  const handleSignOut = async () => {
    try { await signOut(); } catch { /* ignore */ }
    window.location.href = "/auth/signout";
  };

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-2 border-gray-200 border-t-pingwash-blue rounded-full animate-spin" /></div>;
  }

  const filteredBookings = statusFilter === "all" ? bookings : bookings.filter((b) => b.status === statusFilter);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/"><PingwashLogo className="h-8" /></Link>
        <div className="flex items-center gap-3">
          <button onClick={() => { setTab("commande"); setMobileMenuOpen(false); }} className="hidden sm:inline-flex items-center gap-1 px-4 py-2 text-sm font-bold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-xl transition-all">
            + Nouveau lavage
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors group"
              title="Se déconnecter"
            >
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getPenguinColor(user.id)} flex items-center justify-center text-lg shadow-sm`}>
                {getPenguinAvatar(user.id)}
              </div>
              <span className="text-sm font-medium text-pingwash-navy group-hover:text-red-600 transition-colors">{profile?.first_name || "Mon compte"}</span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`${mobileMenuOpen ? "block" : "hidden"} sm:block w-full sm:w-64 bg-white border-r border-gray-100 sm:sticky sm:top-[57px] sm:h-[calc(100vh-57px)] overflow-y-auto`}>
          {/* Profile card */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getPenguinColor(user.id)} flex items-center justify-center text-2xl shadow-sm`}>
                {getPenguinAvatar(user.id)}
              </div>
              <div>
                <p className="text-sm font-bold text-pingwash-navy">{profile?.first_name} {profile?.last_name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  tab === t.id ? "bg-pingwash-blue/10 text-pingwash-blue" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>

          {/* Eco stats */}
          <div className="mx-4 mt-4 p-4 bg-pingwash-green/5 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <span>🌍</span>
              <span className="text-xs font-bold text-pingwash-green">Impact éco</span>
            </div>
            <p className="text-xs text-gray-500">{bookings.filter(b => b.status === "completed").length * 195}L d&apos;eau économisés</p>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-4xl">
          {/* ===== NOUVELLE COMMANDE ===== */}
          {tab === "commande" && (
            <>
              <h1 className="text-2xl font-black text-pingwash-navy mb-6">Nouvelle commande</h1>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                {/* Véhicule */}
                <div>
                  <label className="block text-sm font-semibold text-pingwash-navy mb-3">🚗 Véhicule</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["voiture", "moto", "velo"] as const).map((t) => (
                      <button key={t} onClick={() => setOrderVehicle(t)} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${orderVehicle === t ? "border-pingwash-blue bg-pingwash-blue/5" : "border-gray-200 hover:border-gray-300"}`}>
                        <span className="text-2xl">{VEHICLE_MAP[t]?.split(" ")[0]}</span>
                        <span className="text-xs font-semibold">{VEHICLE_MAP[t]?.split(" ")[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-semibold text-pingwash-navy mb-3">📍 Adresse</label>
                  {addresses.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {addresses.map((a) => (
                        <button key={a.id} onClick={() => { setOrderAddress(a.address); setOrderAddressDetails({ display_name: a.address, postcode: a.postal_code, city: a.city }); }}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all ${orderAddress === a.address ? "border-pingwash-blue bg-pingwash-blue/5 text-pingwash-blue font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <AddressAutocomplete value={orderAddress} onChange={(d, details) => { setOrderAddress(d); setOrderAddressDetails(details); }} placeholder="Ou saisissez une nouvelle adresse" />
                </div>

                {/* Créneau */}
                <div>
                  <label className="block text-sm font-semibold text-pingwash-navy mb-3">📅 Quand</label>
                  <div className="flex gap-3">
                    <button onClick={() => setOrderSchedule("immediate")} className={`flex-1 p-3 rounded-xl text-sm font-medium transition-all ${orderSchedule === "immediate" ? "bg-pingwash-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      ⚡ Maintenant
                    </button>
                    <button onClick={() => setOrderSchedule("planned")} className={`flex-1 p-3 rounded-xl text-sm font-medium transition-all ${orderSchedule === "planned" ? "bg-pingwash-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      📅 Planifier
                    </button>
                  </div>
                  {orderSchedule === "planned" && (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30" />
                      <select value={orderTime} onChange={(e) => setOrderTime(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30">
                        <option value="">Créneau</option>
                        {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                {/* Forfait */}
                <div>
                  <label className="block text-sm font-semibold text-pingwash-navy mb-3">🧴 Forfait</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "essentiel", name: "Essentiel", price: 99 },
                      { id: "premium", name: "Premium", price: 149, popular: true },
                      { id: "royal", name: "Royal", price: 199 },
                    ].map((f) => (
                      <button key={f.id} onClick={() => setOrderForfait(f.id)} className={`relative p-4 rounded-xl border-2 text-center transition-all ${orderForfait === f.id ? "border-pingwash-blue bg-pingwash-blue/5" : "border-gray-200 hover:border-gray-300"}`}>
                        {f.popular && <span className="absolute -top-2 right-2 text-[10px] bg-pingwash-green text-white px-2 py-0.5 rounded-full font-bold">Top</span>}
                        <div className="text-xl font-black text-pingwash-navy">{f.price}€</div>
                        <div className="text-xs font-semibold text-gray-600">{f.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button onClick={submitOrder} disabled={orderSubmitting || !orderAddress}
                  className="w-full py-4 bg-pingwash-blue text-white font-bold text-base rounded-xl hover:bg-pingwash-blue-dark transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-pingwash-blue/20">
                  {orderSubmitting ? (
                    <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /></span>
                  ) : (
                    "Commander — " + ({ essentiel: 99, premium: 149, royal: 199 }[orderForfait] || 149) + "€"
                  )}
                </button>
              </div>
            </>
          )}

          {/* ===== LAVAGES ===== */}
          {tab === "lavages" && (
            <>
              <h1 className="text-2xl font-black text-pingwash-navy mb-6">Mes lavages</h1>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { id: "all", label: "Tous" },
                  { id: "pending", label: "En attente" },
                  { id: "completed", label: "Terminés" },
                  { id: "cancelled", label: "Annulés" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      statusFilter === f.id ? "bg-pingwash-blue text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-pingwash-blue"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="bg-white rounded-2xl p-12 text-center"><div className="w-8 h-8 border-2 border-gray-200 border-t-pingwash-blue rounded-full animate-spin mx-auto" /></div>
              ) : filteredBookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <div className="text-4xl mb-3">🐧</div>
                  <h3 className="text-lg font-bold text-pingwash-navy mb-2">Aucun lavage</h3>
                  <button onClick={() => setTab("commande")} className="text-sm text-pingwash-blue hover:underline font-medium">Réserver un lavage</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((b) => {
                    const st = STATUS_MAP[b.status] || STATUS_MAP.pending;
                    return (
                      <div key={b.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{st.icon}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-pingwash-navy text-sm">{FORFAIT_MAP[b.forfait] || b.forfait}</h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${st.color}`}>{st.label}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">📍 {b.address}{b.city ? `, ${b.city}` : ""}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{new Date(b.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                            </div>
                          </div>
                          <div className="text-lg font-black text-pingwash-navy">{b.total_price}€</div>
                        </div>
                        {b.options && b.options.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {b.options.map((o) => <span key={o} className="text-xs bg-pingwash-ice text-pingwash-blue px-2 py-0.5 rounded-lg">{o}</span>)}
                          </div>
                        )}
                        {/* Status actions */}
                        {b.status !== "completed" && b.status !== "cancelled" && (
                          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                            {b.status === "pending" && (
                              <>
                                <button onClick={() => updateBookingStatus(b.id, "confirmed")} className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all">✓ Valider</button>
                                <button onClick={() => updateBookingStatus(b.id, "cancelled")} className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all">✕ Annuler</button>
                              </>
                            )}
                            {b.status === "confirmed" && (
                              <>
                                <button onClick={() => updateBookingStatus(b.id, "in_progress")} className="px-3 py-1.5 text-xs font-semibold bg-pingwash-green/10 text-pingwash-green rounded-lg hover:bg-pingwash-green/20 transition-all">🧽 En cours</button>
                                <button onClick={() => updateBookingStatus(b.id, "cancelled")} className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all">✕ Annuler</button>
                              </>
                            )}
                            {b.status === "in_progress" && (
                              <button onClick={() => updateBookingStatus(b.id, "completed")} className="px-3 py-1.5 text-xs font-semibold bg-pingwash-green/10 text-pingwash-green rounded-lg hover:bg-pingwash-green/20 transition-all">✨ Terminé</button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ===== PAIEMENT ===== */}
          {tab === "paiement" && (
            <>
              <h1 className="text-2xl font-black text-pingwash-navy mb-6">Moyens de paiement</h1>
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-lg font-bold text-pingwash-navy mb-2">Bientôt disponible</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Le paiement en ligne par carte bancaire sera disponible très prochainement. En attendant, le paiement se fait directement avec le laveur.
                </p>
              </div>
            </>
          )}

          {/* ===== ADRESSES ===== */}
          {tab === "adresses" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-black text-pingwash-navy">Mes adresses</h1>
                <button onClick={() => setShowAddAddress(!showAddAddress)} className="px-4 py-2 text-sm font-bold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-xl transition-all">
                  + Ajouter
                </button>
              </div>

              {showAddAddress && (
                <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 space-y-3">
                  <input type="text" value={newAddressLabel} onChange={(e) => setNewAddressLabel(e.target.value)} placeholder="Nom (ex: Maison, Bureau)" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30" />
                  <AddressAutocomplete value={newAddress} onChange={(d, details) => { setNewAddress(d); setNewAddressDetails(details); }} placeholder="Adresse complète" />
                  <div className="flex gap-2">
                    <button onClick={addAddress} className="px-5 py-2.5 text-sm font-bold text-white bg-pingwash-blue rounded-xl hover:bg-pingwash-blue-dark transition-all">Enregistrer</button>
                    <button onClick={() => setShowAddAddress(false)} className="px-5 py-2.5 text-sm text-gray-500 hover:text-gray-700">Annuler</button>
                  </div>
                </div>
              )}

              {addresses.length === 0 && !showAddAddress ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <div className="text-4xl mb-3">📍</div>
                  <h3 className="text-lg font-bold text-pingwash-navy mb-2">Aucune adresse sauvegardée</h3>
                  <p className="text-sm text-gray-500">Ajoutez vos adresses pour réserver plus rapidement.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((a) => (
                    <div key={a.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pingwash-ice flex items-center justify-center text-lg">📍</div>
                        <div>
                          <h3 className="text-sm font-bold text-pingwash-navy">{a.label}</h3>
                          <p className="text-xs text-gray-500">{a.address}{a.city ? `, ${a.postal_code} ${a.city}` : ""}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteAddress(a.id)} className="text-gray-300 hover:text-red-400 transition-colors p-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ===== VEHICULES ===== */}
          {tab === "vehicules" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-black text-pingwash-navy">Mes véhicules</h1>
                <button onClick={() => setShowAddVehicle(!showAddVehicle)} className="px-4 py-2 text-sm font-bold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-xl transition-all">
                  + Ajouter
                </button>
              </div>

              {showAddVehicle && (
                <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {(["voiture", "moto", "velo"] as const).map((t) => (
                      <button key={t} onClick={() => setNewVehicleType(t)} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${newVehicleType === t ? "border-pingwash-blue bg-pingwash-blue/5" : "border-gray-200"}`}>
                        <span className="text-2xl">{VEHICLE_MAP[t]?.split(" ")[0]}</span>
                        <span className="text-xs font-semibold">{VEHICLE_MAP[t]?.split(" ")[1]}</span>
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={newVehicleBrand} onChange={(e) => setNewVehicleBrand(e.target.value)} placeholder="Marque (optionnel)" className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30" />
                    <input type="text" value={newVehicleModel} onChange={(e) => setNewVehicleModel(e.target.value)} placeholder="Modèle (optionnel)" className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addVehicle} className="px-5 py-2.5 text-sm font-bold text-white bg-pingwash-blue rounded-xl hover:bg-pingwash-blue-dark transition-all">Enregistrer</button>
                    <button onClick={() => setShowAddVehicle(false)} className="px-5 py-2.5 text-sm text-gray-500 hover:text-gray-700">Annuler</button>
                  </div>
                </div>
              )}

              {vehicles.length === 0 && !showAddVehicle ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <div className="text-4xl mb-3">🚗</div>
                  <h3 className="text-lg font-bold text-pingwash-navy mb-2">Aucun véhicule</h3>
                  <p className="text-sm text-gray-500">Ajoutez vos véhicules pour réserver plus vite.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vehicles.map((v) => (
                    <div key={v.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pingwash-ice flex items-center justify-center text-lg">
                          {VEHICLE_MAP[v.type]?.split(" ")[0] || "🚗"}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-pingwash-navy">
                            {VEHICLE_MAP[v.type]?.split(" ")[1] || v.type}
                            {v.brand && ` — ${v.brand}`}
                            {v.model && ` ${v.model}`}
                          </h3>
                          <p className="text-xs text-gray-400">Ajouté le {new Date(v.created_at).toLocaleDateString("fr-FR")}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteVehicle(v.id)} className="text-gray-300 hover:text-red-400 transition-colors p-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ===== PARAMETRES ===== */}
          {tab === "parametres" && (
            <>
              <h1 className="text-2xl font-black text-pingwash-navy mb-6">Paramètres</h1>

              {/* Profile */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="text-sm font-bold text-pingwash-navy mb-4">Informations personnelles</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Prénom</label>
                      <input type="text" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Nom</label>
                      <input type="text" value={editLastName} onChange={(e) => setEditLastName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                    <input type="email" value={user.email || ""} disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Téléphone</label>
                    <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="06 12 34 56 78" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30" />
                  </div>
                  <button onClick={saveProfile} className="px-6 py-2.5 text-sm font-bold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-xl transition-all">
                    Enregistrer
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-sm font-bold text-pingwash-navy mb-4">Compte</h2>
                <div className="space-y-3">
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
                    Se déconnecter
                  </button>
                  <button disabled className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-400 cursor-not-allowed">
                    Supprimer mon compte (bientôt)
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
