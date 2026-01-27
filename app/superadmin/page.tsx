"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, type Hostel } from "@/lib/supabaseClient";

// Super admin password from env vars
const SUPER_ADMIN_PIN = process.env.NEXT_PUBLIC_SUPER_ADMIN_PIN || "bora2024";

const COLORS = {
  pink: "#F50CA0",
  cyan: "#43DDE2",
  yellow: "#F9F940",
};

function generateCode(length: number = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function SuperAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  // New hostel form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    join_code: "",
    staff_pin: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Stats
  const [stats, setStats] = useState<{
    totalPlans: number;
    totalParticipants: number;
  }>({ totalPlans: 0, totalParticipants: 0 });

  const fetchHostels = useCallback(async () => {
    const { data } = await supabase
      .from("hostels")
      .select("*")
      .order("name", { ascending: true });

    setHostels(data || []);
    setLoading(false);
  }, []);

  const fetchStats = useCallback(async () => {
    const { count: plansCount } = await supabase
      .from("plans")
      .select("*", { count: "exact", head: true });

    const { count: participantsCount } = await supabase
      .from("plan_participants")
      .select("*", { count: "exact", head: true });

    setStats({
      totalPlans: plansCount || 0,
      totalParticipants: participantsCount || 0,
    });
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchHostels();
      fetchStats();
    }
  }, [authenticated, fetchHostels, fetchStats]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === SUPER_ADMIN_PIN) {
      setAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const openNewHostelForm = () => {
    setFormData({
      name: "",
      city: "",
      join_code: generateCode(),
      staff_pin: generatePin(),
    });
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (hostel: Hostel) => {
    setFormData({
      name: hostel.name,
      city: hostel.city,
      join_code: hostel.join_code,
      staff_pin: hostel.staff_pin,
    });
    setEditingId(hostel.id);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.city) return;

    setSaving(true);

    if (editingId) {
      // Update existing
      await supabase
        .from("hostels")
        .update({
          name: formData.name,
          city: formData.city,
          join_code: formData.join_code,
          staff_pin: formData.staff_pin,
        })
        .eq("id", editingId);
    } else {
      // Create new
      await supabase.from("hostels").insert({
        name: formData.name,
        city: formData.city,
        join_code: formData.join_code,
        staff_pin: formData.staff_pin,
      });
    }

    setSaving(false);
    setShowForm(false);
    fetchHostels();
  };

  const handleDelete = async (hostel: Hostel) => {
    if (!confirm(`¿Eliminar ${hostel.name}? Esto eliminará todos sus planes.`)) return;

    // Delete all related data
    const { data: plans } = await supabase
      .from("plans")
      .select("id")
      .eq("hostel_id", hostel.id);

    if (plans && plans.length > 0) {
      const planIds = plans.map((p) => p.id);
      await supabase.from("plan_participants").delete().in("plan_id", planIds);
      await supabase.from("plans").delete().eq("hostel_id", hostel.id);
    }

    await supabase.from("hostels").delete().eq("id", hostel.id);
    fetchHostels();
    fetchStats();
  };

  const regenerateCode = () => {
    setFormData((prev) => ({ ...prev, join_code: generateCode() }));
  };

  const regeneratePin = () => {
    setFormData((prev) => ({ ...prev, staff_pin: generatePin() }));
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: COLORS.pink }}
            >
              <span className="text-4xl">👑</span>
            </div>
            <h1 className="text-2xl font-black">Super Admin</h1>
            <p className="text-gray-500">Bora! Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Contraseña"
              className={`w-full px-4 py-3 text-center text-xl border-2 rounded-xl focus:outline-none transition-colors ${
                pinError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-pink-500"
              }`}
              autoFocus
            />
            {pinError && <p className="text-red-500 text-sm text-center">Contraseña incorrecta</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: COLORS.pink }}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="sticky top-0 z-20 px-6 py-4 shadow-sm"
        style={{ backgroundColor: COLORS.pink }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div>
              <h1 className="text-white font-black text-xl">Super Admin</h1>
              <p className="text-white/70 text-sm">Bora! Management</p>
            </div>
          </div>
          <button
            onClick={openNewHostelForm}
            className="px-4 py-2 rounded-xl font-bold transition-transform hover:scale-105"
            style={{ backgroundColor: COLORS.yellow }}
          >
            + Nuevo Hostel
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Hostels</p>
            <p className="text-3xl font-black" style={{ color: COLORS.pink }}>
              {hostels.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Planes totales</p>
            <p className="text-3xl font-black" style={{ color: COLORS.cyan }}>
              {stats.totalPlans}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-gray-500 text-sm mb-1">Participaciones</p>
            <p className="text-3xl font-black" style={{ color: COLORS.yellow }}>
              {stats.totalParticipants}
            </p>
          </div>
        </div>

        {/* Hostels list */}
        <h2 className="font-bold text-gray-900 text-lg mb-4">Hostels registrados</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div
              className="w-10 h-10 border-4 rounded-full animate-spin"
              style={{ borderColor: COLORS.pink, borderTopColor: "transparent" }}
            />
          </div>
        ) : hostels.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-4xl mb-3">🏨</p>
            <p className="text-gray-500">No hay hostels registrados</p>
            <button
              onClick={openNewHostelForm}
              className="mt-4 px-6 py-2 rounded-xl font-bold text-white"
              style={{ backgroundColor: COLORS.pink }}
            >
              Agregar el primero
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hostels.map((hostel) => (
              <div key={hostel.id} className="bg-white rounded-2xl p-5 shadow-sm flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-lg text-gray-900 truncate">{hostel.name}</h3>
                    <p className="text-gray-500 text-sm">{hostel.city}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => openEditForm(hostel)}
                      className="p-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(hostel)}
                      className="p-2 rounded-lg text-sm bg-red-50 hover:bg-red-100 transition-colors"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Credentials */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Código</p>
                    <p className="font-mono font-bold" style={{ color: COLORS.cyan }}>
                      {hostel.join_code}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">PIN</p>
                    <p className="font-mono font-bold" style={{ color: COLORS.pink }}>
                      {hostel.staff_pin}
                    </p>
                  </div>
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-2 gap-2 mt-auto text-xs">
                  <a
                    href={`/board?code=${hostel.join_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg font-medium text-white text-center"
                    style={{ backgroundColor: COLORS.pink }}
                  >
                    Board
                  </a>
                  <a
                    href={`/tv?code=${hostel.join_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg font-medium text-center"
                    style={{ backgroundColor: COLORS.yellow }}
                  >
                    TV
                  </a>
                  <a
                    href={`/join?code=${hostel.join_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg font-medium text-white text-center"
                    style={{ backgroundColor: COLORS.cyan }}
                  >
                    Join
                  </a>
                  <a
                    href={`/admin?code=${hostel.join_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg font-medium bg-gray-200 hover:bg-gray-300 text-center"
                  >
                    Admin
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">
              {editingId ? "Editar hostel" : "Nuevo hostel"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del hostel
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Selina Floripa"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad / País</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  placeholder="Ej: Florianópolis, Brasil"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de unión (para huéspedes)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.join_code}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, join_code: e.target.value.toUpperCase() }))
                    }
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-mono focus:outline-none focus:border-pink-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={regenerateCode}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                  >
                    🔄
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN de staff (para admin hostel)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.staff_pin}
                    onChange={(e) => setFormData((prev) => ({ ...prev, staff_pin: e.target.value }))}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-mono focus:outline-none focus:border-pink-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={regeneratePin}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                  >
                    🔄
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl font-bold bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
                  style={{ backgroundColor: COLORS.pink }}
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
