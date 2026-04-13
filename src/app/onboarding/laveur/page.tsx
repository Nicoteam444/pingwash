"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import MultiStepForm from "@/components/MultiStepForm";
import StepCard from "@/components/StepCard";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthProvider";

const DAYS = [
  { id: "lun", label: "Lun" },
  { id: "mar", label: "Mar" },
  { id: "mer", label: "Mer" },
  { id: "jeu", label: "Jeu" },
  { id: "ven", label: "Ven" },
  { id: "sam", label: "Sam" },
  { id: "dim", label: "Dim" },
];

const SLOTS = [
  { id: "matin", label: "Matin", hours: "8h–12h", icon: "🌅" },
  { id: "aprem", label: "Après-midi", hours: "12h–17h", icon: "☀️" },
  { id: "soir", label: "Soirée", hours: "17h–20h", icon: "🌇" },
];

const STATUTS = [
  { id: "auto-entrepreneur", label: "Auto-entrepreneur" },
  { id: "micro-entreprise", label: "Micro-entreprise" },
  { id: "en-creation", label: "En cours de création" },
  { id: "salarie", label: "Salarié (recherche complément)" },
  { id: "autre", label: "Autre" },
];

const EXPERIENCE_LEVELS = [
  { id: "aucune", label: "Aucune expérience", desc: "C'est ma première fois dans le lavage" },
  { id: "debutant", label: "Débutant", desc: "Moins d'1 an d'expérience" },
  { id: "intermediaire", label: "Intermédiaire", desc: "1 à 3 ans d'expérience" },
  { id: "expert", label: "Expert", desc: "Plus de 3 ans d'expérience" },
];

const STEPS = [
  { title: "Identité", icon: "👤" },
  { title: "Expérience", icon: "🎓" },
  { title: "Disponibilités", icon: "📅" },
  { title: "Zone", icon: "📍" },
  { title: "Motivation", icon: "💬" },
  { title: "Documents", icon: "📄" },
];

export default function OnboardingLaveur() {
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // File refs
  const idFileRef = useRef<HTMLInputElement>(null);
  const permisFileRef = useRef<HTMLInputElement>(null);
  const ribFileRef = useRef<HTMLInputElement>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [permisFile, setPermisFile] = useState<File | null>(null);
  const [ribFile, setRibFile] = useState<File | null>(null);

  // Étape 1 — Identité
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [personalAddress, setPersonalAddress] = useState("");
  const [personalCity, setPersonalCity] = useState("");
  const [personalPostalCode, setPersonalPostalCode] = useState("");

  // Étape 2 — Expérience
  const [experience, setExperience] = useState("");
  const [statut, setStatut] = useState("");
  const [hasSiret, setHasSiret] = useState(false);
  const [siret, setSiret] = useState("");

  // Étape 3 — Disponibilités
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string[]>>({});

  function toggleSlot(day: string, slot: string) {
    setSelectedSlots((prev) => {
      const daySlots = prev[day] ?? [];
      const updated = daySlots.includes(slot)
        ? daySlots.filter((s) => s !== slot)
        : [...daySlots, slot];
      return { ...prev, [day]: updated };
    });
  }

  // Étape 4 — Zone
  const [zoneCity, setZoneCity] = useState("");
  const [zonePostalCode, setZonePostalCode] = useState("");
  const [zoneRadius, setZoneRadius] = useState("10");

  // Étape 5 — Motivation
  const [motivation, setMotivation] = useState("");

  // Étape 6 — Documents (real file tracking via idFile/permisFile/ribFile)
  const idUploaded = !!idFile;
  const permisUploaded = !!permisFile;
  const ribUploaded = !!ribFile;

  const totalSlots = Object.values(selectedSlots).reduce((sum, s) => sum + s.length, 0);

  return (
    <MultiStepForm
      steps={STEPS}
      accentColor="green"
      onComplete={async () => {
        if (!user) {
          router.push("/connexion?redirect=/onboarding/laveur");
          return;
        }

        setIsSaving(true);
        setSaveError("");

        try {
          // 1. Upload documents to Supabase Storage
          const uploadFile = async (file: File | null, name: string) => {
            if (!file) return null;
            const path = `${user.id}/${name}-${Date.now()}.${file.name.split(".").pop()}`;
            const { error } = await supabase.storage
              .from("laveur-documents")
              .upload(path, file);
            if (error) throw error;
            return path;
          };

          const [idDocPath, permisDocPath, ribDocPath] = await Promise.all([
            uploadFile(idFile, "id"),
            uploadFile(permisFile, "permis"),
            uploadFile(ribFile, "rib"),
          ]);

          // 2. Create laveur profile
          const { data: laveurProfile, error: profileError } = await supabase
            .from("laveur_profiles")
            .insert({
              user_id: user.id,
              experience: experience || null,
              statut: statut || null,
              has_siret: hasSiret,
              siret: siret || null,
              birth_date: birthDate || null,
              personal_address: personalAddress || null,
              personal_city: personalCity || null,
              personal_postal_code: personalPostalCode || null,
              zone_city: zoneCity || null,
              zone_postal_code: zonePostalCode || null,
              zone_radius_km: parseInt(zoneRadius),
              motivation: motivation || null,
              id_document_url: idDocPath,
              permis_document_url: permisDocPath,
              rib_document_url: ribDocPath,
            })
            .select()
            .single();

          if (profileError) throw profileError;

          // 3. Insert availability slots
          const slots = Object.entries(selectedSlots).flatMap(([day, daySlots]) =>
            daySlots.map((timeSlot) => ({
              laveur_id: laveurProfile.id,
              day,
              time_slot: timeSlot,
            }))
          );

          if (slots.length > 0) {
            const { error: slotsError } = await supabase
              .from("laveur_availability")
              .insert(slots);
            if (slotsError) throw slotsError;
          }

          // 4. Update profile name/phone if provided
          await supabase
            .from("profiles")
            .update({
              first_name: firstName || undefined,
              last_name: lastName || undefined,
              phone: phone || undefined,
            })
            .eq("id", user.id);

          router.push("/");
        } catch (err) {
          console.error("Laveur save error:", err);
          setSaveError("Erreur lors de la sauvegarde. Veuillez réessayer.");
        } finally {
          setIsSaving(false);
        }
      }}
    >
      {/* Étape 1 — Infos personnelles */}
      <StepCard title="Vos informations" subtitle="Dites-nous qui vous êtes.">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Prénom</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jean"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-green/30 focus:border-pingwash-green transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Dupont"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-green/30 focus:border-pingwash-green transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Date de naissance</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-green/30 focus:border-pingwash-green transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 12 34 56 78"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-green/30 focus:border-pingwash-green transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Adresse</label>
            <input
              type="text"
              value={personalAddress}
              onChange={(e) => setPersonalAddress(e.target.value)}
              placeholder="12 rue de la Paix"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-green/30 focus:border-pingwash-green transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Code postal</label>
              <input
                type="text"
                value={personalPostalCode}
                onChange={(e) => setPersonalPostalCode(e.target.value)}
                placeholder="75001"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-green/30 focus:border-pingwash-green transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Ville</label>
              <input
                type="text"
                value={personalCity}
                onChange={(e) => setPersonalCity(e.target.value)}
                placeholder="Paris"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-green/30 focus:border-pingwash-green transition-all"
              />
            </div>
          </div>
        </div>
      </StepCard>

      {/* Étape 2 — Expérience */}
      <StepCard title="Votre expérience" subtitle="Aucune expérience requise — on vous forme !">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-3">
              Niveau d&apos;expérience en lavage auto
            </label>
            <div className="space-y-2">
              {EXPERIENCE_LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setExperience(lvl.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    experience === lvl.id
                      ? "border-pingwash-green bg-pingwash-green/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-sm font-semibold text-pingwash-navy">{lvl.label}</span>
                  <span className="text-xs text-gray-500 block mt-0.5">{lvl.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-3">Statut professionnel</label>
            <div className="flex flex-wrap gap-2">
              {STATUTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStatut(s.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    statut === s.id
                      ? "bg-pingwash-green text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={hasSiret}
                onChange={(e) => setHasSiret(e.target.checked)}
                className="rounded"
              />
              J&apos;ai déjà un numéro SIRET
            </label>
            {hasSiret && (
              <input
                type="text"
                value={siret}
                onChange={(e) => setSiret(e.target.value)}
                placeholder="Numéro SIRET"
                className="mt-3 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-green/30 focus:border-pingwash-green transition-all"
              />
            )}
          </div>
        </div>
      </StepCard>

      {/* Étape 3 — Disponibilités */}
      <StepCard
        title="Vos disponibilités"
        subtitle="Sélectionnez vos créneaux préférés. Vous pourrez les modifier plus tard."
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-20" />
                {DAYS.map((d) => (
                  <th key={d.id} className="text-xs font-semibold text-gray-500 pb-3 text-center">
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map((slot) => (
                <tr key={slot.id}>
                  <td className="py-1.5 pr-2">
                    <div className="text-xs font-medium text-pingwash-navy">{slot.icon} {slot.label}</div>
                    <div className="text-xs text-gray-400">{slot.hours}</div>
                  </td>
                  {DAYS.map((day) => {
                    const active = selectedSlots[day.id]?.includes(slot.id);
                    return (
                      <td key={day.id} className="text-center py-1.5 px-1">
                        <button
                          onClick={() => toggleSlot(day.id, slot.id)}
                          className={`w-10 h-10 rounded-lg transition-all ${
                            active
                              ? "bg-pingwash-green text-white shadow-sm"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          {active ? "✓" : ""}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalSlots > 0 && (
          <div className="mt-4 p-3 bg-pingwash-green/5 rounded-xl text-sm text-pingwash-green font-medium">
            {totalSlots} créneau{totalSlots > 1 ? "x" : ""} sélectionné{totalSlots > 1 ? "s" : ""}
          </div>
        )}
      </StepCard>

      {/* Étape 4 — Zone géographique */}
      <StepCard
        title="Votre zone d'intervention"
        subtitle="Où souhaitez-vous exercer ?"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Code postal</label>
              <input
                type="text"
                value={zonePostalCode}
                onChange={(e) => setZonePostalCode(e.target.value)}
                placeholder="75001"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-green/30 focus:border-pingwash-green transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Ville</label>
              <input
                type="text"
                value={zoneCity}
                onChange={(e) => setZoneCity(e.target.value)}
                placeholder="Paris"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-green/30 focus:border-pingwash-green transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-3">
              Rayon d&apos;intervention : <span className="font-bold text-pingwash-green">{zoneRadius} km</span>
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={zoneRadius}
              onChange={(e) => setZoneRadius(e.target.value)}
              className="w-full accent-[#10b981]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5 km</span>
              <span>15 km</span>
              <span>30 km</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              📍 Vous recevrez les demandes de lavage dans un rayon de{" "}
              <span className="font-bold text-pingwash-navy">{zoneRadius} km</span> autour de{" "}
              <span className="font-bold text-pingwash-navy">
                {zoneCity || zonePostalCode || "votre zone"}
              </span>
              .
            </p>
          </div>
        </div>
      </StepCard>

      {/* Étape 5 — Motivation */}
      <StepCard
        title="Pourquoi PINGWASH ?"
        subtitle="Dites-nous ce qui vous motive à rejoindre l'équipe."
      >
        <div className="space-y-4">
          <textarea
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            placeholder="J'aimerais rejoindre PINGWASH parce que..."
            rows={6}
            maxLength={1000}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pingwash-green/30 focus:border-pingwash-green transition-all resize-none"
          />
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{motivation.length} / 1000 caractères</span>
            {motivation.length > 50 && (
              <span className="text-pingwash-green font-medium">Merci pour votre message !</span>
            )}
          </div>

          <div className="p-4 bg-pingwash-green/5 rounded-xl">
            <p className="text-sm text-gray-600">
              💡 <span className="font-medium">Astuce :</span> Parlez de votre passion pour l&apos;automobile,
              votre engagement écologique, ou votre envie d&apos;indépendance.
            </p>
          </div>
        </div>
      </StepCard>

      {/* Étape 6 — Documents */}
      <StepCard
        title="Vos documents"
        subtitle="Uploadez les documents nécessaires à votre inscription."
      >
        <div className="space-y-4">
          {/* Hidden file inputs */}
          <input
            type="file"
            ref={idFileRef}
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => setIdFile(e.target.files?.[0] ?? null)}
          />
          <input
            type="file"
            ref={permisFileRef}
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => setPermisFile(e.target.files?.[0] ?? null)}
          />
          <input
            type="file"
            ref={ribFileRef}
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => setRibFile(e.target.files?.[0] ?? null)}
          />

          {[
            {
              id: "id",
              label: "Pièce d'identité",
              desc: "CNI ou passeport en cours de validité",
              icon: "🪪",
              uploaded: idUploaded,
              fileName: idFile?.name,
              onClick: () => idFileRef.current?.click(),
            },
            {
              id: "permis",
              label: "Permis de conduire",
              desc: "Permis B en cours de validité",
              icon: "🚗",
              uploaded: permisUploaded,
              fileName: permisFile?.name,
              onClick: () => permisFileRef.current?.click(),
            },
            {
              id: "rib",
              label: "RIB",
              desc: "Pour recevoir vos paiements chaque semaine",
              icon: "🏦",
              uploaded: ribUploaded,
              fileName: ribFile?.name,
              onClick: () => ribFileRef.current?.click(),
            },
          ].map((doc) => (
            <div
              key={doc.id}
              className={`p-5 rounded-xl border-2 border-dashed transition-all ${
                doc.uploaded
                  ? "border-pingwash-green bg-pingwash-green/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{doc.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-pingwash-navy">{doc.label}</p>
                    <p className="text-xs text-gray-500">
                      {doc.uploaded ? doc.fileName : doc.desc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={doc.onClick}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    doc.uploaded
                      ? "bg-pingwash-green text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {doc.uploaded ? "✓ Uploadé" : "Choisir un fichier"}
                </button>
              </div>
            </div>
          ))}

          <div className="p-4 bg-gray-50 rounded-xl text-xs text-gray-500">
            🔒 Vos documents sont chiffrés et stockés de manière sécurisée.
            Ils ne seront utilisés que pour vérifier votre identité.
          </div>

          {idUploaded && permisUploaded && ribUploaded && (
            <div className="p-4 bg-pingwash-green/10 rounded-xl text-sm font-medium text-pingwash-green text-center">
              ✓ Tous les documents sont uploadés. Vous pouvez confirmer !
            </div>
          )}

          {saveError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">
              {saveError}
            </div>
          )}

          {isSaving && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="w-4 h-4 border-2 border-gray-300 border-t-pingwash-green rounded-full animate-spin" />
              Enregistrement en cours...
            </div>
          )}
        </div>
      </StepCard>
    </MultiStepForm>
  );
}
