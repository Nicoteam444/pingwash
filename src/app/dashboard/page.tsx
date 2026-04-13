"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import type { Booking } from "@/lib/supabase/types";

const STATUS_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-700", icon: "⏳" },
  confirmed: { label: "Confirmé", color: "bg-blue-100 text-blue-700", icon: "✓" },
  in_progress: { label: "En cours", color: "bg-pingwash-green/10 text-pingwash-green", icon: "🧽" },
  completed: { label: "Terminé", color: "bg-gray-100 text-gray-600", icon: "✨" },
  cancelled: { label: "Annulé", color: "bg-red-100 text-red-600", icon: "✕" },
};

const FORFAIT_LABELS: Record<string, string> = {
  essentiel: "Essentiel",
  premium: "Premium",
  royal: "Royal",
};

export default function DashboardPage() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/connexion?redirect=/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        const { data } = await supabase
          .from("bookings")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        setBookings((data as Booking[]) || []);
        setIsLoading(false);
      };
      fetchBookings();
    }
  }, [user, supabase]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-pingwash-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-pingwash-navy">
                Bonjour {profile?.first_name || ""}
              </h1>
              <p className="text-gray-500 text-sm">Gérez vos lavages et votre compte</p>
            </div>
            <Link
              href="/#reserver"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-xl transition-all"
            >
              + Nouveau lavage
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Lavages", value: bookings.length, icon: "🚗" },
              { label: "En cours", value: bookings.filter((b) => b.status === "pending" || b.status === "confirmed" || b.status === "in_progress").length, icon: "⏳" },
              { label: "Eau économisée", value: `${bookings.filter((b) => b.status === "completed").length * 195}L`, icon: "🌍" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-black text-pingwash-navy">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Bookings */}
          <h2 className="text-lg font-bold text-pingwash-navy mb-4">Mes lavages</h2>

          {isLoading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-pingwash-blue rounded-full animate-spin mx-auto" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="text-4xl mb-3">🐧</div>
              <h3 className="text-lg font-bold text-pingwash-navy mb-2">Aucun lavage pour le moment</h3>
              <p className="text-gray-500 text-sm mb-6">Réservez votre premier lavage écologique !</p>
              <Link
                href="/#reserver"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-xl transition-all"
              >
                Réserver un lavage
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => {
                const status = STATUS_LABELS[booking.status] || STATUS_LABELS.pending;
                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{status.icon}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-pingwash-navy text-sm">
                              {FORFAIT_LABELS[booking.forfait] || booking.forfait}
                            </h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            📍 {booking.address}, {booking.city}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(booking.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-lg font-black text-pingwash-navy">
                        {booking.total_price}€
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
