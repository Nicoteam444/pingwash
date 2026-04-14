"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AddressAutocomplete from "./AddressAutocomplete";
import type { AddressDetails } from "./AddressAutocomplete";
import { useAuth } from "@/context/AuthProvider";

export default function HeroSearch() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [address, setAddress] = useState("");
  const [schedule, setSchedule] = useState("now");

  const handleAddressChange = (displayName: string, details: AddressDetails | null) => {
    setAddress(displayName);
    if (details) {
      sessionStorage.setItem("pingwash_address", displayName);
      sessionStorage.setItem("pingwash_address_details", JSON.stringify(details));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      sessionStorage.setItem("pingwash_address", address);
    }
    sessionStorage.setItem("pingwash_schedule", schedule);
    const el = document.getElementById("reserver");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/onboarding/client");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
        <AddressAutocomplete
          value={address}
          onChange={handleAddressChange}
          placeholder="Saisissez votre adresse"
          className="flex-1"
        />
        <div className="relative">
          <select
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="appearance-none bg-white rounded-xl px-4 py-4 pr-10 text-[15px] text-black font-medium focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 border border-gray-200 shadow-sm cursor-pointer h-full"
          >
            <option value="now">Maintenant</option>
            <option value="planned">Planifier</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-xl transition-all shadow-sm whitespace-nowrap"
        >
          Réserver
        </button>
      </form>

      {/* Big signup button for non-connected users */}
      {!isLoading && !user && (
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link
            href="/connexion"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-pingwash-green hover:bg-pingwash-green-dark rounded-xl transition-all shadow-lg shadow-pingwash-green/30 hover:scale-105"
          >
            🐧 Créer mon compte gratuitement
          </Link>
          <span className="text-sm text-gray-500">
            Déjà inscrit ?{" "}
            <Link href="/connexion" className="text-pingwash-blue font-semibold hover:underline">
              Se connecter
            </Link>
          </span>
        </div>
      )}

      <div className="mt-4">
        <Link
          href="/devenir-laveur"
          className="text-sm font-medium text-pingwash-green hover:text-pingwash-green-dark transition-colors"
        >
          Devenir laveur →
        </Link>
      </div>
    </>
  );
}
