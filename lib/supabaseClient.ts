import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Hostel {
  id: string;
  name: string;
  city: string;
  join_code: string;
  staff_pin: string;
}

export interface Plan {
  id: string;
  hostel_id: string;
  title: string;
  category: string;
  start_at: string;
  location_text: string | null;
  is_featured: boolean;
  created_by_guest_id: string;
  created_at: string;
}

export interface PlanParticipant {
  id: string;
  plan_id: string;
  guest_id: string;
  display_name: string;
  emoji: string;
  joined_at: string;
}

export interface PlanWithParticipants extends Plan {
  participants: PlanParticipant[];
  participant_count: number;
}

export interface BoraSession {
  guest_id: string;
  display_name: string;
  emoji: string;
  hostel_id: string;
  hostel_name: string;
  hostel_city: string;
  join_code: string;
  created_at: string;
}

// Category config
export const PLAN_CATEGORIES: Record<string, { emoji: string; label: string }> = {
  beach: { emoji: "🏖️", label: "Playa" },
  dinner: { emoji: "🍽️", label: "Cena" },
  bar: { emoji: "🍻", label: "Bar" },
  surf: { emoji: "🏄", label: "Surf" },
  hike: { emoji: "🥾", label: "Caminata" },
  party: { emoji: "🎉", label: "Fiesta" },
  tour: { emoji: "🚐", label: "Tour" },
  other: { emoji: "✨", label: "Otro" },
};
