"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import PingwashLogo from "./PingwashLogo";

interface Step {
  title: string;
  icon: string;
}

interface MultiStepFormProps {
  steps: Step[];
  children: ReactNode[];
  accentColor: "blue" | "green";
  onComplete: () => void;
  /** Validate current step — return true if OK */
  validate?: (stepIndex: number) => boolean;
}

export default function MultiStepForm({
  steps,
  children,
  accentColor,
  onComplete,
  validate,
}: MultiStepFormProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const isLast = current === steps.length - 1;
  const accent = accentColor === "green" ? "pingwash-green" : "pingwash-blue";
  const accentDark =
    accentColor === "green" ? "pingwash-green-dark" : "pingwash-blue-dark";

  function next() {
    if (validate && !validate(current)) return;
    if (isLast) {
      onComplete();
      return;
    }
    setDirection("forward");
    setCurrent((s) => s + 1);
  }

  function prev() {
    if (current === 0) return;
    setDirection("backward");
    setCurrent((s) => s - 1);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pingwash-ice/40 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <PingwashLogo className="h-8" />
          </Link>
          <span className="text-xs text-gray-400 font-medium">
            Étape {current + 1} / {steps.length}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-8">
        <div className="flex items-center gap-1">
          {steps.map((step, i) => (
            <div key={step.title} className="flex-1 flex flex-col items-center gap-2">
              {/* Dot + connector */}
              <div className="w-full flex items-center">
                {i > 0 && (
                  <div
                    className={`flex-1 h-0.5 transition-colors duration-300 ${
                      i <= current ? `bg-${accent}` : "bg-gray-200"
                    }`}
                  />
                )}
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    i < current
                      ? `bg-${accent} text-white`
                      : i === current
                      ? `bg-${accent} text-white ring-4 ring-${accent}/20 scale-110`
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {i < current ? "✓" : step.icon}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 transition-colors duration-300 ${
                      i < current ? `bg-${accent}` : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              {/* Label */}
              <span
                className={`text-xs font-medium text-center hidden sm:block transition-colors ${
                  i <= current ? "text-pingwash-navy" : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div
          key={current}
          className={`${
            direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left"
          }`}
        >
          {children[current]}
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={current === 0}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
              current === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            ← Retour
          </button>

          <button
            onClick={next}
            className={`px-8 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.03] shadow-lg bg-${accent} hover:bg-${accentDark} shadow-${accent}/30`}
          >
            {isLast ? "Confirmer ✓" : "Continuer →"}
          </button>
        </div>
      </div>
    </div>
  );
}
