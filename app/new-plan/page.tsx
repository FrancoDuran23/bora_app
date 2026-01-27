"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, PLAN_CATEGORIES } from "@/lib/supabaseClient";
import { getSession, type BoraSession } from "@/lib/session";
import { getQuickTimes } from "@/lib/timeFilters";
import Header from "@/components/Header";
import Button from "@/components/Button";

const TEMPLATES = [
  { category: "beach", title: "Playa", emoji: "🏖️" },
  { category: "dinner", title: "Cena", emoji: "🍽️" },
  { category: "bar", title: "Bar", emoji: "🍻" },
  { category: "surf", title: "Surf", emoji: "🏄" },
  { category: "hike", title: "Caminata", emoji: "🥾" },
  { category: "party", title: "Fiesta", emoji: "🎉" },
  { category: "tour", title: "Tour", emoji: "🚐" },
  { category: "other", title: "Otro", emoji: "✨" },
];

function NewPlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [session, setSessionState] = useState<BoraSession | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("other");
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [locationText, setLocationText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");

  const quickTimes = getQuickTimes();

  // Get min date (today) for date picker
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  // Get max date (7 days from now)
  const maxDateObj = new Date(today);
  maxDateObj.setDate(maxDateObj.getDate() + 7);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.push(code ? `/join?code=${code}` : "/");
      return;
    }
    setSessionState(s);
  }, [code, router]);

  const handleTemplateClick = (template: (typeof TEMPLATES)[0]) => {
    setCategory(template.category);
    if (!title || TEMPLATES.some((t) => t.title === title)) {
      setTitle(template.title);
    }
  };

  const handleTimeClick = (time: Date) => {
    setSelectedTime(time);
    setUseCustomTime(false);
    setCustomDate("");
    setCustomTime("");
  };

  const handleCustomTimeToggle = () => {
    setUseCustomTime(true);
    // Set default to today at 18:00
    setCustomDate(minDate);
    setCustomTime("18:00");
    // Also set selectedTime
    const defaultDate = new Date(minDate);
    defaultDate.setHours(18, 0, 0, 0);
    setSelectedTime(defaultDate);
  };

  const handleCustomDateChange = (date: string) => {
    setCustomDate(date);
    if (date && customTime) {
      const [hours, minutes] = customTime.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);
      setSelectedTime(newDate);
    }
  };

  const handleCustomTimeChange = (time: string) => {
    setCustomTime(time);
    if (customDate && time) {
      const [hours, minutes] = time.split(":").map(Number);
      const newDate = new Date(customDate);
      newDate.setHours(hours, minutes, 0, 0);
      setSelectedTime(newDate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Ingresá un título");
      return;
    }
    if (!selectedTime) {
      setError("Elegí una hora");
      return;
    }
    if (!session) return;

    setSubmitting(true);
    setError(null);

    const { data: newPlan, error: insertError } = await supabase.from("plans").insert({
      hostel_id: session.hostel_id,
      title: title.trim(),
      category,
      start_at: selectedTime.toISOString(),
      location_text: locationText.trim() || null,
      is_featured: false,
      created_by_guest_id: session.guest_id,
    }).select().single();

    if (insertError) {
      console.error("Error creating plan:", insertError);
      setError(`Error al crear el plan: ${insertError.message}`);
      setSubmitting(false);
      return;
    }

    // Auto-join the creator to the plan
    if (newPlan) {
      await supabase.from("plan_participants").insert({
        plan_id: newPlan.id,
        guest_id: session.guest_id,
        display_name: session.display_name,
        emoji: session.emoji,
      });
    }

    router.push(`/board?code=${code}`);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header showBack backHref={`/board?code=${code}`} title="Nuevo plan" />

      <main className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de plan
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.category}
                  type="button"
                  onClick={() => handleTemplateClick(t)}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                    category === t.category
                      ? "bg-pink-light border-2 border-pink"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-2xl mb-1">{t.emoji}</span>
                  <span className="text-xs font-medium text-gray-700">
                    {t.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Título del plan
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Pizza en la terraza"
              maxLength={50}
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-pink focus:outline-none transition-colors"
            />
          </div>

          {/* Quick times */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ¿Cuándo?
            </label>
            <div className="flex flex-wrap gap-2">
              {quickTimes.map((qt) => (
                <button
                  key={qt.label}
                  type="button"
                  onClick={() => handleTimeClick(qt.value)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    !useCustomTime && selectedTime?.getTime() === qt.value.getTime()
                      ? "bg-cyan text-gray-900"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {qt.label}
                </button>
              ))}
              {/* Custom time button */}
              <button
                type="button"
                onClick={handleCustomTimeToggle}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  useCustomTime
                    ? "bg-pink text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📅 Elegir fecha
              </button>
            </div>

            {/* Custom date/time inputs */}
            {useCustomTime && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => handleCustomDateChange(e.target.value)}
                      min={minDate}
                      max={maxDate}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-pink focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Hora
                    </label>
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => handleCustomTimeChange(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-pink focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedTime && (
              <p className="mt-3 text-sm text-gray-500">
                📆{" "}
                {selectedTime.toLocaleDateString("es-AR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                a las{" "}
                {selectedTime.toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Lugar (opcional)
            </label>
            <input
              type="text"
              id="location"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="Ej: Terraza del hostel, Playa Norte..."
              maxLength={100}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink focus:outline-none transition-colors"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-pink-light rounded-xl">
              <p className="text-sm text-pink font-medium">{error}</p>
            </div>
          )}

          {/* Preview */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-2 font-medium uppercase">
              Preview
            </p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {PLAN_CATEGORIES[category]?.emoji || "✨"}
              </span>
              <div>
                <p className="font-bold text-gray-900">
                  {title || "Título del plan"}
                </p>
                {locationText && (
                  <p className="text-sm text-gray-500">📍 {locationText}</p>
                )}
                {selectedTime && (
                  <p className="text-sm text-pink font-medium">
                    {selectedTime.toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="pink"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Creando..." : "Crear plan"}
          </Button>
        </form>
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

export default function NewPlanPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewPlanContent />
    </Suspense>
  );
}
