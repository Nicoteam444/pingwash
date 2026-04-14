"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PingwashLogo from "./PingwashLogo";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/context/CartProvider";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, profile, isLoading, signOut } = useAuth();
  const { itemCount } = useCart();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    try {
      await signOut();
    } catch {
      // ignore
    }
    // Server-side signout to clear cookies properly
    window.location.href = "/auth/signout";
  };

  const initials = profile
    ? `${(profile.first_name || "")[0] || ""}${(profile.last_name || "")[0] || ""}`.toUpperCase() || "?"
    : "?";

  const isLaveur = profile?.role === "laveur";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <PingwashLogo className="h-9" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#comment-ca-marche" className="text-sm font-medium text-gray-600 hover:text-pingwash-blue transition-colors">
              Comment ça marche
            </a>
            <a href="#forfaits" className="text-sm font-medium text-gray-600 hover:text-pingwash-blue transition-colors">
              Forfaits
            </a>
            <a href="#eco" className="text-sm font-medium text-gray-600 hover:text-pingwash-blue transition-colors">
              Notre engagement
            </a>
            {!isLaveur && (
              <Link
                href="/devenir-laveur"
                className="text-sm font-medium text-pingwash-green hover:text-pingwash-green-dark transition-colors"
              >
                Devenir laveur
              </Link>
            )}

            {/* Cart icon */}
            <Link href="/panier" className="relative p-2 text-gray-600 hover:text-pingwash-blue transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-pingwash-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isLoading ? (
              <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
            ) : user && profile ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-pingwash-navy text-white flex items-center justify-center text-sm font-bold">
                    {initials}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in-up z-[60]">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-pingwash-navy">
                        {profile.first_name} {profile.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-pingwash-navy hover:bg-pingwash-ice transition-colors"
                    >
                      Mon compte
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/connexion"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-full transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <a href="#comment-ca-marche" className="text-sm font-medium text-gray-600 px-2 py-1" onClick={() => setMenuOpen(false)}>
              Comment ça marche
            </a>
            <a href="#forfaits" className="text-sm font-medium text-gray-600 px-2 py-1" onClick={() => setMenuOpen(false)}>
              Forfaits
            </a>
            <a href="#eco" className="text-sm font-medium text-gray-600 px-2 py-1" onClick={() => setMenuOpen(false)}>
              Notre engagement
            </a>
            {!isLaveur && (
              <Link href="/devenir-laveur" className="text-sm font-medium text-pingwash-green px-2 py-1" onClick={() => setMenuOpen(false)}>
                Devenir laveur
              </Link>
            )}

            {user && profile ? (
              <>
                <div className="border-t border-gray-100 mt-2 pt-3 px-2">
                  <p className="text-sm font-semibold text-pingwash-navy">
                    {profile.first_name} {profile.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-pingwash-blue px-2 py-1"
                >
                  Mon compte
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-red-600 px-2 py-1 text-left"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <Link
                href="/connexion"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-pingwash-blue rounded-full w-full"
                onClick={() => setMenuOpen(false)}
              >
                Connexion
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
