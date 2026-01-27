"use client";

import type React from "react";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase, type PlanWithParticipants } from "@/lib/supabaseClient";
import { getSession, type BoraSession } from "@/lib/session";
import { filterPlansByTimeRange } from "@/lib/timeFilters";
import { useLanguage, LanguageSelector } from "@/lib/LanguageContext";
import { CATEGORY_ICONS, getCategoryLabel } from "@/lib/i18n";

const fontFamily = '"Gv. time", system-ui, sans-serif';

const COLORS = {
  pink: "#F50CA0",
  cyan: "#43DDE2",
  yellow: "#F9F940",
  text: "#1e293b",
};

// ============ SPARKLE DECORATIONS ============
function Sparkles() {
  return (
    <>
      <div className="absolute w-3 h-3 rotate-45" style={{ top: -8, left: 20, backgroundColor: COLORS.cyan }} />
      <div className="absolute w-2 h-2 rotate-12" style={{ top: 5, left: -5, backgroundColor: COLORS.pink }} />
      <div className="absolute w-2.5 h-2.5 rotate-45" style={{ top: -10, right: 15, backgroundColor: COLORS.yellow }} />
      <div className="absolute w-2 h-2 rounded-full" style={{ top: 20, right: -8, backgroundColor: COLORS.cyan }} />
      <div className="absolute w-1.5 h-1.5 rotate-45" style={{ bottom: 5, left: 5, backgroundColor: COLORS.yellow }} />
      <div className="absolute w-2 h-2 rounded-full" style={{ bottom: -5, right: 30, backgroundColor: COLORS.pink }} />
    </>
  );
}

// ============ LOGO STICKER ============
function LogoSticker({ size = "normal" }: { size?: "normal" | "large" }) {
  const isLarge = size === "large";
  const w = isLarge ? 160 : 120;
  const h = isLarge ? 64 : 48;
  const fontSize = isLarge ? "text-3xl" : "text-2xl";

  return (
    <div className="relative flex items-center justify-center" style={{ width: w + 20, height: h + 22 }}>
      <Sparkles />
      <div className="relative" style={{ width: w, height: h }}>
        <div
          className="absolute rounded-2xl"
          style={{
            width: w,
            height: h,
            backgroundColor: COLORS.yellow,
            transform: "rotate(5deg)",
            top: 4,
            left: 2,
          }}
        />
        <div
          className="absolute rounded-2xl"
          style={{
            width: w,
            height: h,
            backgroundColor: COLORS.cyan,
            transform: "rotate(-2deg)",
            top: 2,
            left: 0,
          }}
        />
        <div
          className="absolute rounded-2xl flex items-center justify-center"
          style={{
            width: w,
            height: h,
            backgroundColor: COLORS.pink,
          }}
        >
          <span className={`text-white font-black ${fontSize}`} style={{ fontFamily }}>
            Bora!
          </span>
        </div>
      </div>
    </div>
  );
}

// ============ HOSTEL PILL ============
function HostelPill({ name, city }: { name: string; city: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full"
      style={{ backgroundColor: "#E8F8F9", border: "1px solid #B8EEF0" }}
    >
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS.yellow }} />
      <div className="text-left">
        <p className="font-bold text-sm leading-tight" style={{ fontFamily, color: COLORS.text }}>
          {name}
        </p>
        <p className="text-xs text-gray-500">{city}</p>
      </div>
      <svg className="w-4 h-4 text-gray-400 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

// ============ TAB PILLS ============
function TabPills({
  activeTab,
  onTabChange,
  t,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  t: (key: string) => string;
}) {
  const tabs = [
    { id: "now", labelKey: "tabs.now", color: COLORS.cyan, icon: "⚡" },
    { id: "today", labelKey: "tabs.today", color: COLORS.pink, icon: "☀️" },
    { id: "tomorrow", labelKey: "tabs.tomorrow", color: COLORS.yellow, icon: "🌅" },
  ];

  return (
    <div className="flex gap-2 md:gap-3">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isYellow = tab.color === COLORS.yellow;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="px-3 md:px-5 py-2 md:py-2.5 rounded-full font-bold text-sm md:text-base transition-all shadow-sm flex items-center gap-1.5"
            style={{
              fontFamily,
              backgroundColor: tab.color,
              color: isYellow ? COLORS.text : "white",
              opacity: isActive ? 1 : 0.6,
              transform: isActive ? "scale(1.05)" : "scale(1)",
            }}
          >
            <span>{tab.icon}</span>
            <span>{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}

// ============ ILLUSTRATIONS ============
function SurfIllustration() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <ellipse cx="15" cy="20" rx="10" ry="5" fill="white" opacity="0.8" />
      <ellipse cx="60" cy="15" rx="8" ry="4" fill="white" opacity="0.6" />
      <path d="M0 55 Q20 45 40 55 T80 55 L80 80 L0 80 Z" fill="#0EA5E9" opacity="0.5" />
      <path d="M0 62 Q25 52 50 62 T80 62 L80 80 L0 80 Z" fill="#0EA5E9" opacity="0.3" />
      <ellipse cx="55" cy="45" rx="6" ry="25" fill="white" transform="rotate(20 55 45)" />
      <ellipse cx="55" cy="45" rx="3" ry="20" fill={COLORS.cyan} opacity="0.5" transform="rotate(20 55 45)" />
    </svg>
  );
}

function BeachIllustration() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <line x1="30" y1="30" x2="30" y2="70" stroke="#8B5CF6" strokeWidth="3" />
      <path d="M10 32 Q30 5 50 32 Z" fill={COLORS.pink} />
      <path d="M10 32 Q20 15 30 32" fill="#F472B6" />
      <path d="M30 32 Q40 15 50 32" fill={COLORS.pink} />
      <path d="M55 30 L70 30 L65 50 L60 50 Z" fill="white" />
      <path d="M58 33 L67 33 L64 47 L61 47 Z" fill="#FDBA74" opacity="0.7" />
      <circle cx="66" cy="32" r="5" fill="#FB923C" />
      <rect x="60" y="50" width="5" height="8" fill="white" />
      <ellipse cx="62.5" cy="60" rx="8" ry="3" fill="white" />
    </svg>
  );
}

function DinnerIllustration() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <ellipse cx="30" cy="45" rx="22" ry="8" fill="white" opacity="0.9" />
      <ellipse cx="30" cy="42" rx="18" ry="6" fill="#F3F4F6" />
      <circle cx="25" cy="38" r="6" fill="#FCD34D" />
      <circle cx="35" cy="38" r="5" fill="#F87171" />
      <rect x="10" y="20" width="2" height="25" fill="white" opacity="0.8" />
      <rect x="8" y="18" width="2" height="8" fill="white" opacity="0.8" />
      <rect x="12" y="18" width="2" height="8" fill="white" opacity="0.8" />
    </svg>
  );
}

function HikeIllustration() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <path d="M10 45 L45 45 L45 35 L40 35 L40 20 Q40 12 32 12 L22 12 Q14 12 14 20 L14 35 L10 35 Z" fill="#F59E0B" />
      <rect x="14" y="35" width="31" height="5" fill="#B45309" />
      <rect x="18" y="16" width="18" height="4" rx="2" fill="#92400E" />
      <line x1="22" y1="22" x2="32" y2="22" stroke="white" strokeWidth="2" />
      <line x1="22" y1="28" x2="32" y2="28" stroke="white" strokeWidth="2" />
      <rect x="8" y="45" width="40" height="6" rx="2" fill="#78350F" />
    </svg>
  );
}

function BarIllustration() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <path d="M20 15 L40 15 L33 35 L27 35 Z" fill="white" />
      <path d="M23 18 L37 18 L32 32 L28 32 Z" fill="#67E8F9" opacity="0.6" />
      <rect x="27" y="35" width="6" height="10" fill="white" />
      <ellipse cx="30" cy="48" rx="10" ry="4" fill="white" />
      <circle cx="35" cy="18" r="5" fill="#FBBF24" />
      <circle cx="28" cy="25" r="2" fill="white" opacity="0.6" />
      <circle cx="32" cy="22" r="1.5" fill="white" opacity="0.5" />
    </svg>
  );
}

function PartyIllustration() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <rect x="10" y="10" width="6" height="6" fill="#FBBF24" transform="rotate(15 10 10)" />
      <rect x="45" y="15" width="5" height="5" fill="white" transform="rotate(-20 45 15)" />
      <rect x="8" y="40" width="4" height="4" fill={COLORS.pink} transform="rotate(30 8 40)" />
      <rect x="48" y="42" width="4" height="4" fill={COLORS.cyan} transform="rotate(-15 48 42)" />
      <polygon points="30,5 33,18 46,18 36,26 40,39 30,31 20,39 24,26 14,18 27,18" fill="white" />
    </svg>
  );
}

function TourIllustration() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <rect x="12" y="20" width="36" height="28" rx="4" fill="white" />
      <circle cx="30" cy="34" r="10" fill="#374151" />
      <circle cx="30" cy="34" r="7" fill="#6B7280" />
      <circle cx="30" cy="34" r="3" fill="#9CA3AF" />
      <rect x="38" y="15" width="8" height="5" rx="1" fill="#E5E7EB" />
      <rect x="20" y="14" width="8" height="5" rx="1" fill="#9CA3AF" />
    </svg>
  );
}

function OtherIllustration() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <path d="M30 8 L33 22 L48 25 L33 28 L30 42 L27 28 L12 25 L27 22 Z" fill="white" />
      <circle cx="15" cy="12" r="3" fill="white" opacity="0.6" />
      <circle cx="48" cy="40" r="2.5" fill="white" opacity="0.5" />
      <circle cx="12" cy="45" r="2" fill="white" opacity="0.4" />
    </svg>
  );
}

const Illustrations: Record<string, () => React.ReactElement> = {
  surf: SurfIllustration,
  beach: BeachIllustration,
  dinner: DinnerIllustration,
  bar: BarIllustration,
  hike: HikeIllustration,
  tour: TourIllustration,
  party: PartyIllustration,
  other: OtherIllustration,
};

// ============ PLAN CARD ============
function PlanCard({
  plan,
  timeSection,
  currentGuestId,
  onJoin,
  onLeave,
  isJoining,
  t,
  language,
}: {
  plan: PlanWithParticipants;
  timeSection: "now" | "today" | "tomorrow";
  currentGuestId?: string;
  onJoin: (planId: string) => void;
  onLeave: (planId: string) => void;
  isJoining: boolean;
  t: (key: string) => string;
  language: string;
}) {
  const categoryLabel = getCategoryLabel(plan.category, language as "es" | "pt" | "en");
  const categoryIcon = CATEGORY_ICONS[plan.category] || CATEGORY_ICONS.other;
  const Illustration = Illustrations[plan.category] || Illustrations.other;

  const gradients = {
    now: "linear-gradient(135deg, #5DE8EC 0%, #43DDE2 100%)",
    today: "linear-gradient(135deg, #FF4DB8 0%, #F50CA0 100%)",
    tomorrow: "linear-gradient(135deg, #FCFC5A 0%, #F9F940 100%)",
  };

  const isYellow = timeSection === "tomorrow";
  const textColor = isYellow ? COLORS.text : "white";
  const count = plan.participant_count;
  const countText = count === 1 ? `1 ${t("card.person")}` : `${count} ${t("card.people")}`;
  const location = plan.location_text || "";
  const alreadyJoined = plan.participants.some((p) => p.guest_id === currentGuestId);

  return (
    <div className="rounded-3xl overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
      {/* Gradient top section */}
      <div
        className="relative p-4 flex justify-between items-start"
        style={{ background: gradients[timeSection], minHeight: 100 }}
      >
        <div className="flex-1 z-10">
          <h3
            className="font-black text-xl md:text-2xl leading-tight flex items-center gap-2"
            style={{ fontFamily, color: textColor, fontStyle: "italic" }}
          >
            <span>{categoryIcon}</span>
            <span>{categoryLabel}</span>
          </h3>
          {plan.is_featured && (
            <span
              className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: COLORS.yellow, color: COLORS.text }}
            >
              ⭐ {t("card.featured")}
            </span>
          )}
        </div>
        <div className="w-16 h-16 md:w-20 md:h-20" style={{ marginTop: -8 }}>
          <Illustration />
        </div>
      </div>

      {/* White bottom section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          {/* Avatars */}
          <div className="flex -space-x-2">
            {plan.participants.slice(0, 4).map((p, i) => (
              <div
                key={p.id}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm shadow-sm"
                style={{
                  backgroundColor: [COLORS.cyan, COLORS.pink, COLORS.yellow, "#A78BFA"][i % 4],
                  zIndex: 10 - i,
                }}
              >
                {p.emoji}
              </div>
            ))}
            {count > 4 && (
              <div
                className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold"
                style={{ zIndex: 0, color: COLORS.text }}
              >
                +{count - 4}
              </div>
            )}
          </div>

          {/* Join/Leave button */}
          {!alreadyJoined && (
            <button
              onClick={() => onJoin(plan.id)}
              disabled={isJoining}
              className="px-4 py-2 rounded-full text-sm font-bold text-white transition-all disabled:opacity-50 hover:opacity-90 flex items-center gap-1.5"
              style={{ backgroundColor: COLORS.pink, fontFamily }}
            >
              <span>👋</span>
              <span>{isJoining ? "..." : t("card.join")}</span>
            </button>
          )}
          {alreadyJoined && (
            <button
              onClick={() => onLeave(plan.id)}
              disabled={isJoining}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              {isJoining ? "..." : `✓ ${t("card.joined")}`}
            </button>
          )}
        </div>

        {/* Info */}
        <p className="text-sm text-gray-500" style={{ fontFamily }}>
          {countText}
          {location ? ` - ${location}` : ""}
        </p>
      </div>
    </div>
  );
}

// ============ EMPTY STATE ============
function EmptyState({ t }: { t: (key: string) => string }) {
  return (
    <div className="text-center py-16 col-span-full">
      <span className="text-6xl block mb-4">🌴</span>
      <p className="text-gray-500 font-bold text-lg" style={{ fontFamily }}>
        {t("empty.noPlans")}
      </p>
      <p className="text-gray-400 text-sm mt-1">{t("empty.createFirst")}</p>
    </div>
  );
}

// ============ SIDEBAR (Desktop) ============
function Sidebar({ code, session, t }: { code: string; session: BoraSession; t: (key: string) => string }) {
  return (
    <div className="hidden lg:block w-80 flex-shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Hostel info card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: COLORS.cyan }}>
              <span className="text-2xl">🏨</span>
            </div>
            <div>
              <p className="font-bold" style={{ fontFamily, color: COLORS.text }}>{session.hostel_name}</p>
              <p className="text-sm text-gray-500">{session.hostel_city}</p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400 mb-2">{t("join.hostelCode")}</p>
            <code className="text-sm font-mono bg-gray-100 px-3 py-1.5 rounded-lg text-gray-600">
              {code}
            </code>
          </div>
        </div>

        {/* QR + CTA */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-20 h-20 bg-white border border-gray-200 rounded-xl p-2 flex-shrink-0">
              <svg viewBox="0 0 50 50" className="w-full h-full" fill="#374151">
                <rect x="2" y="2" width="14" height="14" />
                <rect x="5" y="5" width="8" height="8" fill="white" />
                <rect x="7" y="7" width="4" height="4" />
                <rect x="34" y="2" width="14" height="14" />
                <rect x="37" y="5" width="8" height="8" fill="white" />
                <rect x="39" y="7" width="4" height="4" />
                <rect x="2" y="34" width="14" height="14" />
                <rect x="5" y="37" width="8" height="8" fill="white" />
                <rect x="7" y="39" width="4" height="4" />
                <rect x="20" y="2" width="4" height="4" />
                <rect x="20" y="20" width="4" height="4" />
                <rect x="34" y="34" width="4" height="4" />
                <rect x="42" y="42" width="6" height="6" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-base leading-snug" style={{ fontFamily, color: COLORS.text }}>
                {t("bottom.joinOrCreate")} 🎉
              </p>
              <p className="text-sm text-gray-500 mt-1">{t("bottom.scanQR")}</p>
            </div>
          </div>

          <Link href={`/new-plan?code=${code}`} className="block">
            <button
              className="w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-opacity"
              style={{ backgroundColor: COLORS.pink, fontFamily }}
            >
              <span className="text-xl">➕</span> {t("bottom.newPlan")}
            </button>
          </Link>
        </div>

        {/* User info */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: COLORS.yellow }}
            >
              {session.emoji}
            </div>
            <div>
              <p className="font-bold" style={{ fontFamily, color: COLORS.text }}>{session.display_name}</p>
              <p className="text-sm text-gray-500">{t("nav.profile")}</p>
            </div>
          </div>
        </div>

        {/* Language selector */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-xs text-gray-400 mb-3">{t("language")} 🌐</p>
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
}

// ============ MOBILE BOTTOM SECTION ============
function MobileBottomSection({ code, t }: { code: string; t: (key: string) => string }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-20">
      <div className="flex items-center gap-3">
        {/* QR mini */}
        <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg p-1 flex-shrink-0">
          <svg viewBox="0 0 50 50" className="w-full h-full" fill="#374151">
            <rect x="2" y="2" width="14" height="14" />
            <rect x="5" y="5" width="8" height="8" fill="white" />
            <rect x="7" y="7" width="4" height="4" />
            <rect x="34" y="2" width="14" height="14" />
            <rect x="37" y="5" width="8" height="8" fill="white" />
            <rect x="39" y="7" width="4" height="4" />
            <rect x="2" y="34" width="14" height="14" />
            <rect x="5" y="37" width="8" height="8" fill="white" />
            <rect x="7" y="39" width="4" height="4" />
          </svg>
        </div>

        {/* CTA */}
        <Link href={`/new-plan?code=${code}`} className="flex-1">
          <button
            className="w-full py-3 rounded-full font-bold text-white flex items-center justify-center gap-2 shadow-md"
            style={{ backgroundColor: COLORS.pink, fontFamily }}
          >
            <span className="text-lg">➕</span> {t("bottom.newPlan")}
          </button>
        </Link>
      </div>
    </div>
  );
}

// ============ MAIN CONTENT ============
function BoardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const { language, t, setLanguageFromLocation } = useLanguage();

  const [session, setSessionState] = useState<BoraSession | null>(null);
  const [plans, setPlans] = useState<PlanWithParticipants[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningPlanId, setJoiningPlanId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("now");

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.push(code ? `/join?code=${code}` : "/");
      return;
    }
    setSessionState(s);
    // Auto-detect language from hostel location
    setLanguageFromLocation(s.hostel_city);
  }, [code, router, setLanguageFromLocation]);

  const fetchPlans = useCallback(async () => {
    if (!session?.hostel_id) return;

    const { data: plansData } = await supabase
      .from("plans")
      .select("*")
      .eq("hostel_id", session.hostel_id)
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
  }, [session?.hostel_id]);

  useEffect(() => {
    if (session) fetchPlans();
  }, [session, fetchPlans]);

  useEffect(() => {
    if (!session?.hostel_id) return;
    const channel = supabase
      .channel("board")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "plans", filter: `hostel_id=eq.${session.hostel_id}` },
        fetchPlans
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "plan_participants" }, fetchPlans)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.hostel_id, fetchPlans]);

  const handleJoinPlan = async (planId: string) => {
    if (!session) return;
    setJoiningPlanId(planId);
    const { error } = await supabase.from("plan_participants").insert({
      plan_id: planId,
      guest_id: session.guest_id,
      display_name: session.display_name,
      emoji: session.emoji,
    });
    if (error) {
      console.error("Error joining plan:", error);
    }
    setJoiningPlanId(null);
    fetchPlans();
  };

  const handleLeavePlan = async (planId: string) => {
    if (!session) return;
    setJoiningPlanId(planId);
    const { error } = await supabase
      .from("plan_participants")
      .delete()
      .eq("plan_id", planId)
      .eq("guest_id", session.guest_id);
    if (error) {
      console.error("Error leaving plan:", error);
    }
    setJoiningPlanId(null);
    fetchPlans();
  };

  const nowPlans = filterPlansByTimeRange(plans, "now");
  const todayPlans = filterPlansByTimeRange(plans, "today");
  const tomorrowPlans = filterPlansByTimeRange(plans, "tomorrow");

  const getPlansForTab = () => {
    const sortFn = (arr: PlanWithParticipants[]) =>
      [...arr].sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));

    if (activeTab === "now") return { plans: sortFn(nowPlans), section: "now" as const };
    if (activeTab === "today") return { plans: sortFn(todayPlans), section: "today" as const };
    return { plans: sortFn(tomorrowPlans), section: "tomorrow" as const };
  };

  const { plans: filteredPlans, section } = getPlansForTab();

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div
          className="w-10 h-10 border-4 rounded-full animate-spin"
          style={{ borderColor: COLORS.pink, borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily }}>
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <LogoSticker size="normal" />

            {/* Hostel pill - hidden on mobile, shown on tablet+ */}
            <div className="hidden md:block lg:hidden">
              <HostelPill name={session.hostel_name} city={session.hostel_city} />
            </div>

            {/* Tabs - centered on desktop */}
            <div className="hidden md:flex flex-1 justify-center">
              <TabPills activeTab={activeTab} onTabChange={setActiveTab} t={t} />
            </div>

            {/* Language + User avatar */}
            <div className="flex items-center gap-2">
              <LanguageSelector className="hidden sm:flex" />
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: COLORS.yellow }}
              >
                {session.emoji}
              </div>
            </div>
          </div>

          {/* Mobile: Hostel pill + Tabs + Language */}
          <div className="md:hidden mt-4 space-y-4">
            <div className="flex justify-center">
              <HostelPill name={session.hostel_name} city={session.hostel_city} />
            </div>
            <div className="flex justify-center">
              <TabPills activeTab={activeTab} onTabChange={setActiveTab} t={t} />
            </div>
            <div className="flex justify-center sm:hidden">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 lg:pb-6">
        <div className="flex gap-8">
          {/* Plans grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    timeSection={section}
                    currentGuestId={session.guest_id}
                    onJoin={handleJoinPlan}
                    onLeave={handleLeavePlan}
                    isJoining={joiningPlanId === plan.id}
                    t={t}
                    language={language}
                  />
                ))
              ) : (
                <EmptyState t={t} />
              )}
            </div>
          </div>

          {/* Desktop sidebar */}
          <Sidebar code={code} session={session} t={t} />
        </div>
      </main>

      {/* Mobile bottom section */}
      <MobileBottomSection code={code} t={t} />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div
        className="w-10 h-10 border-4 rounded-full animate-spin"
        style={{ borderColor: "#F50CA0", borderTopColor: "transparent" }}
      />
    </div>
  );
}

export default function BoardPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BoardContent />
    </Suspense>
  );
}
