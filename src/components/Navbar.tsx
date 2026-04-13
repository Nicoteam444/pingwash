"use client";

import { useState } from "react";
import Link from "next/link";
import PingwashLogo from "./PingwashLogo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
            <Link
              href="/devenir-laveur"
              className="text-sm font-medium text-pingwash-green hover:text-pingwash-green-dark transition-colors"
            >
              Devenir laveur
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-full transition-colors"
            >
              Connexion
            </Link>
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
            <Link href="/devenir-laveur" className="text-sm font-medium text-pingwash-green px-2 py-1" onClick={() => setMenuOpen(false)}>
              Devenir laveur
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-pingwash-blue rounded-full w-full"
              onClick={() => setMenuOpen(false)}
            >
              Connexion
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
