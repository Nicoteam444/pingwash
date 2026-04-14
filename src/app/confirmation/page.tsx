"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STEPS = [
  { label: "Confirmé", icon: "✓", active: true },
  { label: "Laveur assigné", icon: "🐧", active: false },
  { label: "En route", icon: "🚗", active: false },
  { label: "En cours", icon: "🧽", active: false },
  { label: "Terminé", icon: "✨", active: false },
];

export default function ConfirmationPage() {
  const [currentStep] = useState(0);
  const orderNumber = `PW-${Date.now().toString(36).toUpperCase()}`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-pingwash-ice to-white">
        <div className="max-w-2xl mx-auto px-4">
          {/* Success header */}
          <div className="text-center mb-10">
            <img
              src="/penguin-hero.png"
              alt="Pingouin PINGWASH"
              className="w-40 mx-auto mb-6 drop-shadow-lg"
            />
            <h1 className="text-3xl font-black text-pingwash-navy mb-2">
              Réservation confirmée !
            </h1>
            <p className="text-gray-500">
              Commande <span className="font-mono font-bold text-pingwash-blue">{orderNumber}</span>
            </p>
          </div>

          {/* Progress tracker */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="text-sm font-bold text-pingwash-navy mb-6">Suivi de votre lavage</h2>
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-pingwash-green transition-all duration-500"
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              />

              {STEPS.map((step, i) => (
                <div key={step.label} className="relative flex flex-col items-center z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      i <= currentStep
                        ? "bg-pingwash-green text-white shadow-md"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`text-[10px] mt-2 font-medium ${
                      i <= currentStep ? "text-pingwash-green" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Info cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="text-sm font-bold text-pingwash-navy mb-3">Prochaine étape</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pingwash-blue/10 rounded-full flex items-center justify-center">
                  <span className="text-lg">🐧</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-pingwash-navy">Attribution du laveur</p>
                  <p className="text-xs text-gray-500">Un laveur sera assigné sous quelques minutes</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="text-sm font-bold text-pingwash-navy mb-3">Estimation</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pingwash-green/10 rounded-full flex items-center justify-center">
                  <span className="text-lg">⏱️</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-pingwash-navy">Sous 30 minutes</p>
                  <p className="text-xs text-gray-500">Temps moyen d&apos;arrivée du laveur</p>
                </div>
              </div>
            </div>
          </div>

          {/* Eco impact */}
          <div className="bg-pingwash-green/5 rounded-2xl border border-pingwash-green/20 p-5 mb-8 flex items-center gap-4">
            <span className="text-3xl">🌍</span>
            <div>
              <p className="text-sm font-bold text-pingwash-green">Impact écologique</p>
              <p className="text-xs text-gray-600">
                Ce lavage économisera ~195L d&apos;eau par rapport à un lavage classique.
                Merci de protéger la banquise avec PINGWASH !
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard"
              className="flex-1 inline-flex items-center justify-center px-6 py-4 text-sm font-bold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-xl transition-all"
            >
              Mes réservations
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center px-6 py-4 text-sm font-bold text-pingwash-navy bg-white border border-gray-200 hover:border-pingwash-blue rounded-xl transition-all"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
