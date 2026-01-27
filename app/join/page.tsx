"use client";

/**
 * ============================================
 * TIPOGRAFÍA "Gv. time" - REFERENCIAS
 * ============================================
 *
 * La fuente está configurada localmente via @font-face en globals.css.
 * Si necesitás un fallback online, usá UNA de estas opciones:
 *
 * OPCIÓN 1 - @import en CSS:
 * @import url("https://db.onlinewebfonts.com/c/1ba31c8c0034ef90a129f0a1763d5f0c?family=Gv.+time");
 *
 * OPCIÓN 2 - <link> en <head>:
 * <link href="https://db.onlinewebfonts.com/c/1ba31c8c0034ef90a129f0a1763d5f0c?family=Gv.+time" rel="stylesheet">
 *
 * ============================================
 */

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, type Hostel, type BoraSession } from "@/lib/supabaseClient";

const EMOJIS = ["😀", "😎", "🏄", "🍹", "🧉", "✨", "🔥", "🌴", "🌊"];

const fontFamily = '"Gv. time", sans-serif';

// UUID generator
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Star sparkle (4-point star)
function Star({ size, color, className }: { size: number; color: string; className?: string }) {
  return (
    <svg
      className={`absolute ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
    </svg>
  );
}

// Circle dot
function Dot({ size, color, className }: { size: number; color: string; className?: string }) {
  return (
    <div
      className={`absolute rounded-full ${className}`}
      style={{ width: size, height: size, backgroundColor: color }}
    />
  );
}

// Cross sparkle
function Cross({ size, color, className }: { size: number; color: string; className?: string }) {
  return (
    <svg
      className={`absolute ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <path d="M10 0H14V10H24V14H14V24H10V14H0V10H10V0Z" />
    </svg>
  );
}

// Sticker Logo Component
function StickerLogo() {
  return (
    <div className="relative flex items-center justify-center mb-8" style={{ height: 160 }}>
      {/* Sparkles */}
      <Star size={18} color="#F50CA0" className="-top-2 left-6 opacity-80" />
      <Star size={12} color="#43DDE2" className="top-4 -left-2 opacity-70" />
      <Star size={22} color="#F9F940" className="-top-4 right-4 opacity-90" />
      <Star size={14} color="#F50CA0" className="top-8 right-0 opacity-60" />
      <Dot size={8} color="#43DDE2" className="top-16 -left-4 opacity-50" />
      <Dot size={6} color="#F50CA0" className="bottom-8 left-4 opacity-60" />
      <Cross size={10} color="#43DDE2" className="-top-2 left-1/4 opacity-50" />
      <Star size={10} color="#43DDE2" className="bottom-4 right-8 opacity-70" />
      <Dot size={8} color="#F9F940" className="top-2 right-16 opacity-60" />
      <Cross size={8} color="#F50CA0" className="bottom-12 -right-2 opacity-50" />

      {/* Stacked card layers with rotation */}
      <div className="relative" style={{ width: 260, height: 90 }}>
        {/* Layer 3 - Yellow (back, rotated right) */}
        <div
          className="absolute shadow-sm"
          style={{
            width: 260,
            height: 90,
            backgroundColor: "#F9F940",
            borderRadius: 26,
            transform: "rotate(6deg) translateY(8px)",
            transformOrigin: "center center",
          }}
        />
        {/* Layer 2 - Cyan (middle, rotated left slightly) */}
        <div
          className="absolute shadow-sm"
          style={{
            width: 260,
            height: 90,
            backgroundColor: "#43DDE2",
            borderRadius: 26,
            transform: "rotate(-3deg) translateY(4px)",
            transformOrigin: "center center",
          }}
        />
        {/* Layer 1 - Pink (front, slight rotation) */}
        <div
          className="absolute flex items-center justify-center shadow-lg"
          style={{
            width: 260,
            height: 90,
            backgroundColor: "#F50CA0",
            borderRadius: 26,
            transform: "rotate(-1deg)",
            transformOrigin: "center center",
          }}
        >
          {/* Bora! text - clean and bold */}
          <span
            className="font-black select-none tracking-tight"
            style={{
              fontFamily,
              fontSize: "3.2rem",
              color: "#ffffff",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            Bora!
          </span>
        </div>
      </div>
    </div>
  );
}

// Hostel Pill Component
function HostelPill({
  hostel,
  loading,
  error,
}: {
  hostel: Hostel | null;
  loading: boolean;
  error: boolean;
}) {
  if (loading) {
    return (
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-full border mb-8 mx-auto"
        style={{
          backgroundColor: "rgba(67, 221, 226, 0.15)",
          borderColor: "rgba(67, 221, 226, 0.4)",
          maxWidth: "fit-content",
        }}
      >
        <div
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ backgroundColor: "#F9F940" }}
        />
        <div className="space-y-1.5">
          <div className="h-4 w-32 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-3 w-20 bg-slate-200 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-full border mb-8 mx-auto"
        style={{
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderColor: "rgba(239, 68, 68, 0.3)",
          maxWidth: "fit-content",
          fontFamily,
        }}
      >
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <span className="text-red-600 font-medium text-sm">
          Código inválido
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-3 px-5 py-3 rounded-full border mb-8 mx-auto"
      style={{
        backgroundColor: "rgba(67, 221, 226, 0.15)",
        borderColor: "rgba(67, 221, 226, 0.4)",
        maxWidth: "fit-content",
        fontFamily,
      }}
    >
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: "#F9F940" }}
      />
      <div className="text-left">
        <p className="font-extrabold text-slate-800 leading-tight">
          {hostel.name}
        </p>
        <p className="text-sm text-slate-500">{hostel.city}</p>
      </div>
    </div>
  );
}

// Main Join Content
function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [apodo, setApodo] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("😎");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Fetch hostel
  useEffect(() => {
    async function fetchHostel() {
      if (!code) {
        setError(true);
        setLoading(false);
        return;
      }

      const { data, error: err } = await supabase
        .from("hostels")
        .select("id, name, city, join_code")
        .eq("join_code", code)
        .single();

      if (err || !data) {
        setError(true);
      } else {
        setHostel(data as Hostel);
      }
      setLoading(false);
    }

    fetchHostel();
  }, [code]);

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (apodo.trim().length < 2) {
      setValidationError("El apodo debe tener al menos 2 caracteres");
      return;
    }

    if (!hostel || !code) return;

    setSubmitting(true);

    const session: BoraSession = {
      guest_id: generateUUID(),
      display_name: apodo.trim(),
      emoji: selectedEmoji,
      hostel_id: hostel.id,
      hostel_name: hostel.name,
      hostel_city: hostel.city,
      join_code: code,
      created_at: new Date().toISOString(),
    };

    localStorage.setItem("bora_session", JSON.stringify(session));
    router.push(`/board?code=${code}`);
  };

  // Error state (invalid code)
  if (!loading && error) {
    return (
      <main
        className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10"
        style={{ fontFamily }}
      >
        <StickerLogo />

        <div
          className="w-full max-w-md border border-slate-100 shadow-sm p-6"
          style={{ borderRadius: 28 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">😕</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 mb-2">
              Código inválido o hostel no encontrado.
            </h2>
            <p className="text-slate-500 text-sm mb-4">
              Verificá que el código sea correcto e intentá de nuevo.
            </p>
            <p className="text-xs text-slate-400 font-mono bg-slate-50 px-3 py-2 rounded-xl">
              Probá /join?code=ABC123
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  if (loading) {
    return (
      <main
        className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10"
        style={{ fontFamily }}
      >
        <StickerLogo />
        <HostelPill hostel={null} loading={true} error={false} />
        <p className="text-slate-400 text-sm">Cargando hostel…</p>
      </main>
    );
  }

  // Main form
  return (
    <main
      className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10"
      style={{ fontFamily }}
    >
      <StickerLogo />

      <HostelPill hostel={hostel} loading={false} error={false} />

      {/* Form Card */}
      <div
        className="w-full max-w-md border border-slate-100 shadow-sm p-6"
        style={{ borderRadius: 28 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-800 mb-1">
            Entrá al tablero
          </h1>
          <p className="text-slate-500 text-sm">
            Sumate a planes en segundos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Validation error */}
          {validationError && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">
              {validationError}
            </div>
          )}

          {/* Apodo input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Apodo
            </label>
            <input
              type="text"
              value={apodo}
              onChange={(e) => setApodo(e.target.value)}
              placeholder="Ej: Franco"
              maxLength={20}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
              style={{ borderRadius: 20, fontFamily }}
              autoComplete="off"
            />
          </div>

          {/* Emoji selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Elegí un emoji
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className="flex items-center justify-center transition-all duration-150"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 18,
                    fontSize: "1.5rem",
                    backgroundColor:
                      selectedEmoji === emoji ? "#F9F940" : "#ffffff",
                    border:
                      selectedEmoji === emoji
                        ? "2px solid #F9F940"
                        : "1px solid #e2e8f0",
                    transform:
                      selectedEmoji === emoji ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Submit button with depth effect */}
          <div
            className="relative w-full transition-transform duration-150 active:scale-[0.98]"
            style={{ height: 54 }}
          >
            {/* Shadow/depth layer */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                backgroundColor: "#c4087f",
                transform: "translateY(4px)",
              }}
            />
            {/* Main button */}
            <button
              type="submit"
              disabled={submitting}
              className="absolute inset-0 w-full rounded-2xl flex items-center justify-center gap-2 transition-transform duration-150 hover:translate-y-[2px] active:translate-y-[3px] disabled:opacity-60 disabled:hover:translate-y-0"
              style={{
                backgroundColor: "#F50CA0",
              }}
            >
              <span className="text-lg">🚀</span>
              <span
                className="text-white font-bold text-lg"
                style={{ fontFamily }}
              >
                {submitting ? "Entrando…" : "Entrar"}
              </span>
            </button>
          </div>
        </form>

        {/* Footer code */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Código del hostel:{" "}
            <code
              className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600"
              style={{ fontFamily: "monospace" }}
            >
              {code}
            </code>
          </p>
        </div>
      </div>
    </main>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div
      className="min-h-screen bg-white flex items-center justify-center"
      style={{ fontFamily }}
    >
      <div
        className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "#F50CA0", borderTopColor: "transparent" }}
      />
    </div>
  );
}

// Export
export default function JoinPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <JoinContent />
    </Suspense>
  );
}
