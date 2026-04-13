-- ============================================
-- PINGWASH — Initial Database Schema
-- ============================================

-- ===================
-- 1. PROFILES
-- ===================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'laveur', 'admin')),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, first_name, last_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===================
-- 2. VEHICLES
-- ===================
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('voiture', 'moto', 'velo')),
  brand TEXT,
  model TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own vehicles"
  ON public.vehicles FOR ALL
  USING (auth.uid() = user_id);

-- ===================
-- 3. BOOKINGS
-- ===================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id),
  laveur_id UUID REFERENCES public.profiles(id),
  location_type TEXT CHECK (location_type IN ('domicile', 'entreprise')),
  address TEXT NOT NULL,
  address_complement TEXT,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  schedule_type TEXT CHECK (schedule_type IN ('immediate', 'planned')),
  scheduled_at TIMESTAMPTZ,
  forfait TEXT NOT NULL CHECK (forfait IN ('essentiel', 'premium', 'royal')),
  options TEXT[] DEFAULT '{}',
  total_price INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Clients can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Laveurs can view assigned bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = laveur_id);

-- ===================
-- 4. LAVEUR PROFILES
-- ===================
CREATE TABLE public.laveur_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  experience TEXT,
  statut TEXT,
  has_siret BOOLEAN DEFAULT false,
  siret TEXT,
  birth_date DATE,
  personal_address TEXT,
  personal_city TEXT,
  personal_postal_code TEXT,
  zone_city TEXT,
  zone_postal_code TEXT,
  zone_radius_km INTEGER DEFAULT 10,
  motivation TEXT,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  id_document_url TEXT,
  permis_document_url TEXT,
  rib_document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.laveur_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Laveurs can view own profile"
  ON public.laveur_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Laveurs can insert own profile"
  ON public.laveur_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Laveurs can update own profile"
  ON public.laveur_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- ===================
-- 5. LAVEUR AVAILABILITY
-- ===================
CREATE TABLE public.laveur_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  laveur_id UUID REFERENCES public.laveur_profiles(id) ON DELETE CASCADE NOT NULL,
  day TEXT NOT NULL CHECK (day IN ('lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim')),
  time_slot TEXT NOT NULL CHECK (time_slot IN ('matin', 'aprem', 'soir')),
  UNIQUE(laveur_id, day, time_slot)
);

ALTER TABLE public.laveur_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Laveurs can CRUD own availability"
  ON public.laveur_availability FOR ALL
  USING (
    laveur_id IN (
      SELECT id FROM public.laveur_profiles WHERE user_id = auth.uid()
    )
  );

-- ===================
-- 6. REVIEWS
-- ===================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE NOT NULL,
  client_id UUID REFERENCES public.profiles(id) NOT NULL,
  laveur_id UUID REFERENCES public.profiles(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Clients can create reviews for their bookings"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = client_id
    AND booking_id IN (
      SELECT id FROM public.bookings WHERE user_id = auth.uid() AND status = 'completed'
    )
  );

-- ===================
-- STORAGE BUCKET
-- ===================
INSERT INTO storage.buckets (id, name, public)
VALUES ('laveur-documents', 'laveur-documents', false);

CREATE POLICY "Laveurs can upload own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'laveur-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Laveurs can view own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'laveur-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
