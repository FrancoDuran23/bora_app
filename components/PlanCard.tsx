"use client";

import { type PlanWithParticipants, PLAN_CATEGORIES } from "@/lib/supabaseClient";
import { formatTime, formatRelativeTime } from "@/lib/timeFilters";

interface PlanCardProps {
  plan: PlanWithParticipants;
  currentGuestId?: string;
  onJoin?: (planId: string) => void;
  isJoining?: boolean;
  variant?: "default" | "featured" | "tv";
}

export default function PlanCard({
  plan,
  currentGuestId,
  onJoin,
  isJoining,
  variant = "default",
}: PlanCardProps) {
  const category = PLAN_CATEGORIES[plan.category] || PLAN_CATEGORIES.other;
  const isJoined = plan.participants.some((p) => p.guest_id === currentGuestId);
  const time = formatTime(plan.start_at);
  const relativeTime = formatRelativeTime(plan.start_at);

  const baseStyles = "rounded-2xl p-4 transition-all duration-200";
  const variants = {
    default: "bg-white border border-gray-200 hover:shadow-md",
    featured: "bg-pink-light border-2 border-pink shadow-lg",
    tv: "bg-white border border-gray-200 p-5",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]}`}>
      {variant === "featured" && (
        <div className="flex items-center gap-1 mb-2">
          <span className="text-xs font-bold text-pink uppercase tracking-wide">
            Destacado
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <span className={variant === "tv" ? "text-4xl" : "text-3xl"}>
          {category.emoji}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3
                className={`font-bold text-gray-900 truncate ${
                  variant === "tv" ? "text-xl" : "text-base"
                }`}
              >
                {plan.title}
              </h3>
              {plan.location_text && (
                <p className="text-sm text-gray-500 truncate">
                  📍 {plan.location_text}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className={`font-bold text-pink ${variant === "tv" ? "text-xl" : "text-sm"}`}>
                {time}
              </p>
              {variant !== "tv" && (
                <p className="text-xs text-gray-400">{relativeTime}</p>
              )}
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              {plan.participants.slice(0, 5).map((p) => (
                <span
                  key={p.id}
                  className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full text-sm"
                  title={p.display_name}
                >
                  {p.emoji}
                </span>
              ))}
              {plan.participant_count > 5 && (
                <span className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full text-xs font-medium">
                  +{plan.participant_count - 5}
                </span>
              )}
              {plan.participant_count === 0 && (
                <span className="text-xs text-gray-400">Sin participantes aún</span>
              )}
            </div>

            {/* Join button (only for default and featured) */}
            {variant !== "tv" && onJoin && (
              <button
                onClick={() => !isJoined && !isJoining && onJoin(plan.id)}
                disabled={isJoined || isJoining}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  isJoined
                    ? "bg-cyan-light text-cyan cursor-default"
                    : isJoining
                    ? "bg-gray-100 text-gray-400 cursor-wait"
                    : "bg-pink text-white hover:brightness-110 active:scale-95"
                }`}
              >
                {isJoined ? "Ya estás ✓" : isJoining ? "..." : "Sumarme"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
