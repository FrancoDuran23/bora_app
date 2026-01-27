"use client";

import type React from "react";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  supabase,
  type PlanWithParticipants,
  type Hostel,
  PLAN_CATEGORIES,
} from "@/lib/supabaseClient";
import { filterPlansByTimeRange } from "@/lib/timeFilters";

const fontFamily = '"Gv. time", system-ui, sans-serif';

const COLORS = {
  pink: "#F50CA0",
  cyan: "#43DDE2",
  yellow: "#F9F940",
  text: "#1e293b",
};

// ============ ILLUSTRATIONS ============
function SurfIllustration() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Waves */}
      <path d="M0 55 Q15 45 30 55 T60 55 T90 55 L100 55 L100 80 L0 80 Z" fill="#3B82F6" opacity="0.6" />
      <path d="M0 62 Q20 52 40 62 T80 62 L100 62 L100 80 L0 80 Z" fill="#3B82F6" opacity="0.4" />
      {/* Clouds */}
      <ellipse cx="20" cy="20" rx="12" ry="6" fill="white" opacity="0.8" />
      <ellipse cx="75" cy="15" rx="10" ry="5" fill="white" opacity="0.6" />
      {/* Surfboard */}
      <ellipse cx="65" cy="45" rx="6" ry="28" fill="white" transform="rotate(15 65 45)" />
      <ellipse cx="65" cy="45" rx="3" ry="24" fill="#06B6D4" opacity="0.4" transform="rotate(15 65 45)" />
    </svg>
  );
}

function BeachIllustration() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Sun/sky gradient */}
      <circle cx="80" cy="25" r="15" fill="#FBBF24" opacity="0.8" />
      {/* Sand */}
      <ellipse cx="50" cy="70" rx="50" ry="15" fill="#FCD34D" opacity="0.5" />
      {/* Umbrella */}
      <rect x="35" y="30" width="3" height="45" fill="#8B5CF6" />
      <path d="M15 32 Q38 5 60 32 Z" fill="#EC4899" />
      <path d="M15 32 Q27 15 38 32" fill="#F472B6" />
      <path d="M38 32 Q49 15 60 32" fill="#EC4899" />
      {/* Cocktail */}
      <path d="M70 45 L85 45 L80 65 L75 65 Z" fill="white" opacity="0.9" />
      <ellipse cx="77.5" cy="68" rx="6" ry="2" fill="white" opacity="0.9" />
      <circle cx="82" cy="50" r="4" fill="#FB923C" />
    </svg>
  );
}

function DinnerIllustration() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Cocktail glass */}
      <path d="M55 15 L85 15 L75 50 L65 50 Z" fill="white" opacity="0.95" />
      <rect x="67" y="50" width="6" height="12" fill="white" opacity="0.95" />
      <ellipse cx="70" cy="65" rx="12" ry="4" fill="white" opacity="0.95" />
      {/* Drink inside */}
      <path d="M58 20 L82 20 L74 45 L66 45 Z" fill="#F472B6" opacity="0.6" />
      {/* Orange slice */}
      <circle cx="78" cy="22" r="8" fill="#FB923C" />
      <circle cx="78" cy="22" r="5" fill="#FDBA74" />
      {/* Straw */}
      <rect x="60" y="8" width="3" height="30" fill="#FBBF24" transform="rotate(-10 60 8)" />
      {/* Sparkles */}
      <circle cx="45" cy="25" r="2" fill="white" />
      <circle cx="40" cy="40" r="1.5" fill="white" />
      <circle cx="90" cy="35" r="2" fill="white" />
    </svg>
  );
}

function BarIllustration() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Martini glass */}
      <path d="M50 20 L80 20 L68 50 L62 50 Z" fill="white" opacity="0.9" />
      <rect x="62" y="50" width="6" height="10" fill="white" opacity="0.9" />
      <ellipse cx="65" cy="63" rx="10" ry="3" fill="white" opacity="0.9" />
      {/* Drink */}
      <path d="M54 25 L76 25 L68 45 L62 45 Z" fill="#67E8F9" opacity="0.5" />
      {/* Lemon */}
      <circle cx="72" cy="25" r="6" fill="#FBBF24" />
      {/* Music notes */}
      <text x="25" y="35" fill="white" fontSize="18" opacity="0.8">♪</text>
      <text x="35" y="55" fill="white" fontSize="14" opacity="0.6">♫</text>
      {/* Stars */}
      <circle cx="85" cy="30" r="2" fill="white" opacity="0.7" />
      <circle cx="20" cy="45" r="1.5" fill="white" opacity="0.5" />
    </svg>
  );
}

function HikeIllustration() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Boot */}
      <path d="M25 70 L75 70 L75 50 L65 50 L65 35 Q65 25 55 25 L45 25 Q35 25 35 35 L35 50 L25 50 Z" fill="#F59E0B" />
      {/* Boot detail */}
      <rect x="40" y="30" width="20" height="20" rx="3" fill="#92400E" opacity="0.6" />
      {/* Laces */}
      <line x1="45" y1="35" x2="55" y2="35" stroke="white" strokeWidth="2" />
      <line x1="45" y1="42" x2="55" y2="42" stroke="white" strokeWidth="2" />
      {/* Sole */}
      <rect x="25" y="66" width="50" height="6" rx="2" fill="#78350F" />
      {/* Some grass/nature */}
      <circle cx="85" cy="60" r="8" fill="#22C55E" opacity="0.4" />
      <circle cx="15" cy="55" r="6" fill="#22C55E" opacity="0.3" />
    </svg>
  );
}

function TourIllustration() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Camera body */}
      <rect x="30" y="25" width="45" height="35" rx="6" fill="white" opacity="0.95" />
      {/* Lens */}
      <circle cx="52" cy="42" r="12" fill="#374151" />
      <circle cx="52" cy="42" r="8" fill="#6B7280" />
      <circle cx="52" cy="42" r="4" fill="#9CA3AF" />
      {/* Flash */}
      <rect x="60" y="20" width="12" height="6" rx="2" fill="#E5E7EB" />
      {/* Viewfinder */}
      <rect x="40" y="18" width="10" height="6" rx="2" fill="#9CA3AF" />
      {/* Strap */}
      <path d="M25 35 Q15 35 15 45 Q15 55 25 55" fill="none" stroke="white" strokeWidth="4" opacity="0.8" />
      {/* Decorative elements */}
      <circle cx="85" cy="25" r="3" fill="white" opacity="0.5" />
      <circle cx="20" cy="65" r="2" fill="white" opacity="0.4" />
    </svg>
  );
}

function PartyIllustration() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Confetti */}
      <rect x="20" y="15" width="8" height="8" fill="#FBBF24" transform="rotate(15 20 15)" />
      <rect x="75" y="20" width="6" height="6" fill="white" transform="rotate(-20 75 20)" />
      <rect x="15" y="50" width="5" height="5" fill="#F472B6" transform="rotate(30 15 50)" />
      <rect x="80" y="55" width="4" height="4" fill="#67E8F9" transform="rotate(-15 80 55)" />
      {/* Star */}
      <polygon points="50,10 53,22 66,22 56,30 60,42 50,34 40,42 44,30 34,22 47,22" fill="white" />
      {/* More confetti */}
      <circle cx="30" cy="35" r="3" fill="white" opacity="0.8" />
      <circle cx="70" cy="45" r="2" fill="#FBBF24" opacity="0.8" />
      <circle cx="45" cy="60" r="2.5" fill="#F472B6" opacity="0.7" />
    </svg>
  );
}

function OtherIllustration() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {/* Sparkle star */}
      <path d="M50 10 L53 30 L73 33 L53 36 L50 56 L47 36 L27 33 L47 30 Z" fill="white" opacity="0.9" />
      {/* Small stars */}
      <circle cx="25" cy="20" r="3" fill="white" opacity="0.6" />
      <circle cx="75" cy="55" r="2.5" fill="white" opacity="0.5" />
      <circle cx="20" cy="60" r="2" fill="white" opacity="0.4" />
      <circle cx="80" cy="25" r="2" fill="white" opacity="0.5" />
    </svg>
  );
}

const CategoryIllustrations: Record<string, () => React.ReactElement> = {
  surf: SurfIllustration,
  beach: BeachIllustration,
  dinner: DinnerIllustration,
  bar: BarIllustration,
  hike: HikeIllustration,
  tour: TourIllustration,
  party: PartyIllustration,
  other: OtherIllustration,
};

// ============ LOGO ============
function LogoSticker() {
  return (
    <div className="relative" style={{ width: 150, height: 60 }}>
      <div
        className="absolute rounded-2xl"
        style={{
          width: 130,
          height: 48,
          backgroundColor: COLORS.yellow,
          top: 8,
          left: 12,
          transform: "rotate(4deg)",
        }}
      />
      <div
        className="absolute rounded-2xl"
        style={{
          width: 130,
          height: 48,
          backgroundColor: COLORS.cyan,
          top: 4,
          left: 6,
          transform: "rotate(-2deg)",
        }}
      />
      <div
        className="absolute rounded-2xl flex items-center justify-center"
        style={{
          width: 130,
          height: 48,
          backgroundColor: COLORS.pink,
        }}
      >
        <span className="text-white font-black italic" style={{ fontFamily, fontSize: "1.8rem" }}>
          Bora!
        </span>
      </div>
    </div>
  );
}

// ============ HOSTEL PILL ============
function HostelPill({ hostel }: { hostel: Hostel }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-2 rounded-full"
      style={{ backgroundColor: "rgba(67,221,226,0.15)", border: "1px solid rgba(67,221,226,0.3)" }}
    >
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.yellow }} />
      <div>
        <p className="font-bold text-base" style={{ fontFamily, color: COLORS.text }}>{hostel.name}</p>
        <p className="text-sm text-gray-500">{hostel.city}</p>
      </div>
    </div>
  );
}

// ============ TAB PILLS ============
function TabPills() {
  return (
    <div className="flex gap-2">
      <div className="px-6 py-2 rounded-full" style={{ backgroundColor: COLORS.cyan }}>
        <span className="font-bold text-white" style={{ fontFamily }}>Ahora</span>
      </div>
      <div className="px-6 py-2 rounded-full" style={{ backgroundColor: COLORS.pink }}>
        <span className="font-bold text-white" style={{ fontFamily }}>Hoy</span>
      </div>
      <div className="px-6 py-2 rounded-full" style={{ backgroundColor: COLORS.yellow }}>
        <span className="font-bold" style={{ fontFamily, color: COLORS.text }}>Mañana</span>
      </div>
    </div>
  );
}

// ============ PLAN CARD ============
function PlanCard({
  plan,
  timeSection,
}: {
  plan: PlanWithParticipants;
  timeSection: "now" | "today" | "tomorrow";
}) {
  const category = PLAN_CATEGORIES[plan.category] || PLAN_CATEGORIES.other;
  const Illustration = CategoryIllustrations[plan.category] || CategoryIllustrations.other;

  // Gradient colors based on section
  const gradients = {
    now: "linear-gradient(135deg, #43DDE2 0%, #06B6D4 50%, #0891B2 100%)",
    today: "linear-gradient(135deg, #F50CA0 0%, #EC4899 50%, #DB2777 100%)",
    tomorrow: "linear-gradient(135deg, #F9F940 0%, #FACC15 50%, #EAB308 100%)",
  };

  const isYellow = timeSection === "tomorrow";
  const textColor = isYellow ? COLORS.text : "white";

  const count = plan.participant_count;
  const countText = count === 1 ? "1 persona" : `${count} personas`;
  const location = plan.location_text || "";

  // Format time
  const planTime = new Date(plan.start_at);
  const timeStr = planTime.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="rounded-3xl overflow-hidden shadow-lg" style={{ backgroundColor: "white" }}>
      {/* Gradient header with illustration */}
      <div
        className="relative p-4 flex justify-between items-start"
        style={{ background: gradients[timeSection], minHeight: 110 }}
      >
        {/* Left side - Title + Time */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{category.emoji}</span>
            <h3
              className="font-black italic text-2xl leading-tight"
              style={{ fontFamily, color: textColor }}
            >
              {category.label}
            </h3>
          </div>
          {/* Time badge */}
          <span
            className="inline-block px-3 py-1 rounded-full text-sm font-bold"
            style={{
              backgroundColor: "rgba(255,255,255,0.3)",
              color: textColor,
              backdropFilter: "blur(4px)"
            }}
          >
            🕐 {timeStr}
          </span>
          {/* Featured badge */}
          {plan.is_featured && (
            <span
              className="inline-block ml-2 px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: COLORS.yellow, color: COLORS.text }}
            >
              ⭐ Destacado
            </span>
          )}
        </div>

        {/* Right side - Illustration */}
        <div className="w-24 h-20 flex-shrink-0">
          <Illustration />
        </div>
      </div>

      {/* White footer */}
      <div className="p-4 bg-white">
        {/* Title if different from category */}
        {plan.title && plan.title !== category.label && (
          <p className="font-bold text-base mb-2" style={{ fontFamily, color: COLORS.text }}>
            {plan.title}
          </p>
        )}

        {/* Avatars */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex -space-x-2">
            {plan.participants.slice(0, 5).map((p, i) => (
              <div
                key={p.id}
                className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-sm shadow-sm"
                style={{
                  backgroundColor: [COLORS.cyan, COLORS.pink, COLORS.yellow, "#A78BFA", "#34D399"][i % 5],
                  zIndex: 10 - i,
                }}
              >
                {p.emoji}
              </div>
            ))}
            {count > 5 && (
              <div
                className="w-9 h-9 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold shadow-sm"
                style={{ zIndex: 0, color: COLORS.text }}
              >
                +{count - 5}
              </div>
            )}
          </div>
        </div>

        {/* Info text */}
        <p className="text-sm font-medium text-gray-600" style={{ fontFamily }}>
          👥 {countText}{location ? ` · 📍 ${location}` : ""}
        </p>
      </div>
    </div>
  );
}

// ============ EMPTY CARD ============
function EmptyCard({ section }: { section: "now" | "today" | "tomorrow" }) {
  const colors = {
    now: COLORS.cyan,
    today: COLORS.pink,
    tomorrow: COLORS.yellow,
  };
  const labels = { now: "Ahora", today: "Hoy", tomorrow: "Mañana" };

  return (
    <div
      className="rounded-3xl p-6 flex flex-col items-center justify-center opacity-50"
      style={{ backgroundColor: colors[section], minHeight: 140 }}
    >
      <span className="text-3xl mb-2">🌴</span>
      <p className="text-white font-medium text-center" style={{ fontFamily, color: section === "tomorrow" ? COLORS.text : "white" }}>
        Sin planes {labels[section].toLowerCase()}
      </p>
    </div>
  );
}

// ============ BOTTOM BAR ============
function BottomBar({ code }: { code: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bora-app-s42l.vercel.app";
  const joinUrl = `${baseUrl}/join?code=${code}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(joinUrl)}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg px-6 py-4 flex items-center gap-5">
      {/* QR - Real generated QR code */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-white p-1 border border-gray-200">
        <img
          src={qrUrl}
          alt={`QR code para ${joinUrl}`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Text */}
      <div className="flex-1">
        <p className="text-xl font-bold" style={{ fontFamily, color: COLORS.text }}>
          Escaneá el QR para sumarte <span className="text-2xl">📱</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">{joinUrl}</p>
      </div>

      {/* Code display */}
      <div
        className="px-8 py-4 rounded-2xl font-bold text-white text-2xl"
        style={{ backgroundColor: COLORS.pink, fontFamily }}
      >
        {code}
      </div>
    </div>
  );
}

// ============ MAIN ============
function TVContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "ABC123";

  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [plans, setPlans] = useState<PlanWithParticipants[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHostel() {
      const { data } = await supabase
        .from("hostels")
        .select("*")
        .eq("join_code", code)
        .single();
      setHostel(data || { id: "demo", name: "Hostel Demo", city: "Ciudad", join_code: code, staff_pin: "" });
    }
    fetchHostel();
  }, [code]);

  const fetchPlans = useCallback(async () => {
    if (!hostel?.id || hostel.id === "demo") {
      setPlans([]);
      setLoading(false);
      return;
    }

    const { data: plansData } = await supabase
      .from("plans")
      .select("*")
      .eq("hostel_id", hostel.id)
      .gte("start_at", new Date().toISOString())
      .order("start_at", { ascending: true });

    if (!plansData) {
      setPlans([]);
      setLoading(false);
      return;
    }

    const planIds = plansData.map((p) => p.id);
    const { data: participantsData } = await supabase
      .from("plan_participants")
      .select("*")
      .in("plan_id", planIds);

    const participants = participantsData || [];
    const result: PlanWithParticipants[] = plansData.map((plan) => {
      const pp = participants.filter((p) => p.plan_id === plan.id);
      return { ...plan, participants: pp, participant_count: pp.length };
    });

    setPlans(result);
    setLoading(false);
  }, [hostel?.id]);

  useEffect(() => {
    if (hostel) {
      fetchPlans();
      const interval = setInterval(fetchPlans, 10000);
      return () => clearInterval(interval);
    }
  }, [hostel, fetchPlans]);

  useEffect(() => {
    if (!hostel?.id || hostel.id === "demo") return;
    const channel = supabase
      .channel("tv")
      .on("postgres_changes", { event: "*", schema: "public", table: "plans", filter: `hostel_id=eq.${hostel.id}` }, fetchPlans)
      .on("postgres_changes", { event: "*", schema: "public", table: "plan_participants" }, fetchPlans)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [hostel?.id, fetchPlans]);

  const nowPlans = filterPlansByTimeRange(plans, "now");
  const todayPlans = filterPlansByTimeRange(plans, "today");
  const tomorrowPlans = filterPlansByTimeRange(plans, "tomorrow");

  if (loading && !hostel) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: COLORS.pink, borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-28" style={{ fontFamily }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <LogoSticker />
        {hostel && <HostelPill hostel={hostel} />}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <TabPills />
      </div>

      {/* Section Headers + Cards */}
      <div className="space-y-6">
        {/* AHORA Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚡</span>
            <h2 className="text-xl font-bold" style={{ fontFamily, color: COLORS.text }}>Ahora</h2>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: COLORS.cyan, color: "white" }}>
              {nowPlans.length} planes
            </span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {nowPlans.length > 0 ? (
              nowPlans.slice(0, 4).map((plan) => (
                <PlanCard key={`now-${plan.id}`} plan={plan} timeSection="now" />
              ))
            ) : (
              <EmptyCard section="now" />
            )}
          </div>
        </div>

        {/* HOY Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">☀️</span>
            <h2 className="text-xl font-bold" style={{ fontFamily, color: COLORS.text }}>Hoy</h2>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: COLORS.pink, color: "white" }}>
              {todayPlans.length} planes
            </span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {todayPlans.length > 0 ? (
              todayPlans.slice(0, 4).map((plan) => (
                <PlanCard key={`today-${plan.id}`} plan={plan} timeSection="today" />
              ))
            ) : (
              <EmptyCard section="today" />
            )}
          </div>
        </div>

        {/* MAÑANA Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🌅</span>
            <h2 className="text-xl font-bold" style={{ fontFamily, color: COLORS.text }}>Mañana</h2>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: COLORS.yellow, color: COLORS.text }}>
              {tomorrowPlans.length} planes
            </span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {tomorrowPlans.length > 0 ? (
              tomorrowPlans.slice(0, 4).map((plan) => (
                <PlanCard key={`tomorrow-${plan.id}`} plan={plan} timeSection="tomorrow" />
              ))
            ) : (
              <EmptyCard section="tomorrow" />
            )}
          </div>
        </div>
      </div>

      <BottomBar code={code} />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: COLORS.pink, borderTopColor: "transparent" }} />
    </div>
  );
}

export default function TVPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TVContent />
    </Suspense>
  );
}
