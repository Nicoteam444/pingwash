export type UserRole = "client" | "laveur" | "admin";

export interface Profile {
  id: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  user_id: string;
  type: "voiture" | "moto" | "velo";
  brand: string | null;
  model: string | null;
  created_at: string;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type Forfait = "essentiel" | "premium" | "royal";

export interface Booking {
  id: string;
  user_id: string;
  vehicle_id: string | null;
  laveur_id: string | null;
  location_type: "domicile" | "entreprise" | null;
  address: string;
  address_complement: string | null;
  postal_code: string;
  city: string;
  schedule_type: "immediate" | "planned" | null;
  scheduled_at: string | null;
  forfait: Forfait;
  options: string[];
  total_price: number;
  status: BookingStatus;
  created_at: string;
}

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface LaveurProfile {
  id: string;
  user_id: string;
  experience: string | null;
  statut: string | null;
  has_siret: boolean;
  siret: string | null;
  birth_date: string | null;
  personal_address: string | null;
  personal_city: string | null;
  personal_postal_code: string | null;
  zone_city: string | null;
  zone_postal_code: string | null;
  zone_radius_km: number;
  motivation: string | null;
  approval_status: ApprovalStatus;
  id_document_url: string | null;
  permis_document_url: string | null;
  rib_document_url: string | null;
  created_at: string;
}

export interface LaveurAvailability {
  id: string;
  laveur_id: string;
  day: "lun" | "mar" | "mer" | "jeu" | "ven" | "sam" | "dim";
  time_slot: "matin" | "aprem" | "soir";
}

export interface Review {
  id: string;
  booking_id: string;
  client_id: string;
  laveur_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}
