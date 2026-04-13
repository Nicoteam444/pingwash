"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AddressAutocomplete from "./AddressAutocomplete";
import type { AddressDetails } from "./AddressAutocomplete";

export default function HeroSearch() {
  const router = useRouter();
  const [address, setAddress] = useState("");

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
    router.push("/connexion?redirect=/onboarding/client");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
        <AddressAutocomplete
          value={address}
          onChange={handleAddressChange}
          placeholder="Saisissez votre adresse"
          className="flex-1"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-xl transition-all shadow-sm whitespace-nowrap"
        >
          Réserver
        </button>
      </form>

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
