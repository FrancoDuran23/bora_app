"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  supabase,
  type Hostel,
  type PlanWithParticipants,
  PLAN_CATEGORIES,
} from "@/lib/supabaseClient";
import { formatTime } from "@/lib/timeFilters";
import Header from "@/components/Header";
import Button from "@/components/Button";

function AdminContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";

  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [plans, setPlans] = useState<PlanWithParticipants[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch hostel
  useEffect(() => {
    async function fetchHostel() {
      if (!code) return;

      const { data } = await supabase
        .from("hostels")
        .select("*")
        .eq("join_code", code)
        .single();

      if (data) {
        setHostel(data);
      }
      setLoading(false);
    }
    fetchHostel();
  }, [code]);

  // Fetch plans
  const fetchPlans = useCallback(async () => {
    if (!hostel?.id) return;

    const { data: plansData } = await supabase
      .from("plans")
      .select("*")
      .eq("hostel_id", hostel.id)
      .order("start_at", { ascending: true });

    if (!plansData) {
      setPlans([]);
      return;
    }

    const planIds = plansData.map((p) => p.id);
    const { data: participantsData } = await supabase
      .from("plan_participants")
      .select("*")
      .in("plan_id", planIds);

    const participants = participantsData || [];

    const plansWithParticipants: PlanWithParticipants[] = plansData.map((plan) => {
      const planParticipants = participants.filter((p) => p.plan_id === plan.id);
      return {
        ...plan,
        participants: planParticipants,
        participant_count: planParticipants.length,
      };
    });

    setPlans(plansWithParticipants);
  }, [hostel?.id]);

  useEffect(() => {
    if (authenticated && hostel) {
      fetchPlans();
    }
  }, [authenticated, hostel, fetchPlans]);

  // PIN validation
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hostel && pin === hostel.staff_pin) {
      setAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Admin actions
  const handleToggleFeatured = async (planId: string, current: boolean) => {
    await supabase
      .from("plans")
      .update({ is_featured: !current })
      .eq("id", planId);
    fetchPlans();
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("¿Eliminar este plan?")) return;

    // Delete participants first (if no cascade)
    await supabase.from("plan_participants").delete().eq("plan_id", planId);
    await supabase.from("plans").delete().eq("id", planId);
    fetchPlans();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen bg-white">
        <Header showBack />
        <main className="max-w-md mx-auto px-6 py-16 text-center">
          <p className="text-4xl mb-4">😕</p>
          <h1 className="text-2xl font-bold mb-2">Hostel no encontrado</h1>
          <p className="text-gray-500">Verificá el código e intentá de nuevo.</p>
        </main>
      </div>
    );
  }

  // PIN screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header showBack />
        <main className="max-w-md mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-light rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Admin - {hostel.name}</h1>
            <p className="text-gray-500">Ingresá el PIN de staff</p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              className={`w-full px-4 py-3 text-center text-2xl tracking-widest border-2 rounded-xl focus:outline-none transition-colors ${
                pinError
                  ? "border-pink bg-pink-light"
                  : "border-gray-200 focus:border-pink"
              }`}
              maxLength={10}
              autoFocus
            />
            {pinError && (
              <p className="text-pink text-sm text-center">PIN incorrecto</p>
            )}
            <Button type="submit" variant="pink" size="lg" className="w-full">
              Entrar
            </Button>
          </form>
        </main>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        showBack
        title="Admin"
        hostelName={hostel.name}
        hostelCity={hostel.city}
      />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">{hostel.name}</h2>
              <p className="text-sm text-gray-500">{hostel.city}</p>
            </div>
            <span className="px-3 py-1 bg-cyan-light text-cyan rounded-full text-sm font-bold">
              {plans.length} planes
            </span>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 mb-3">Gestionar planes</h3>

        {plans.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-400">No hay planes todavía</p>
          </div>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => {
              const category =
                PLAN_CATEGORIES[plan.category] || PLAN_CATEGORIES.other;
              const isPast = new Date(plan.start_at) < new Date();

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl p-4 ${
                    isPast ? "opacity-50" : ""
                  } ${plan.is_featured ? "border-2 border-pink" : "border border-gray-200"}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{category.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 truncate">
                          {plan.title}
                        </h4>
                        {plan.is_featured && (
                          <span className="text-xs bg-pink text-white px-2 py-0.5 rounded-full">
                            Destacado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatTime(plan.start_at)} · {plan.participant_count}{" "}
                        participantes
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() =>
                        handleToggleFeatured(plan.id, plan.is_featured)
                      }
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        plan.is_featured
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-yellow-light text-yellow hover:brightness-95"
                      }`}
                    >
                      {plan.is_featured ? "Quitar destacado" : "Destacar"}
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-pink-light text-pink hover:brightness-95 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-pink border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminContent />
    </Suspense>
  );
}
