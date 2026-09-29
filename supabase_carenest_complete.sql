-- ============================================================================
-- CareNest Indonesia - COMPLETE SUPABASE DATABASE (SCHEMA + SEED DATA)
-- Platform Scheduled Care Marketplace: Anak, Lansia, Hewan (Surabaya & Nasional)
-- Versi: PRD v2.0 Terverifikasi (KTP, SKCK Polda Jatim, GPS & Escrow)
-- ============================================================================
-- PANDUAN PENGGUNAAN DI SUPABASE:
-- 1. Buka dashboard proyek Supabase Anda: https://supabase.com/dashboard
-- 2. Pilih menu "SQL Editor" pada sidebar kiri.
-- 3. Klik "New Query".
-- 4. Copy-paste seluruh isi file ini, lalu klik tombol "RUN" (Ctrl + Enter).
-- 5. Seluruh tabel, relasi, RLS policies, dan data dummy siap pakai seketika!
-- ============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. BERSIHKAN TABEL SEBELUMNYA JIKA SUDAH ADA (IDEMPOTENT RESET)
DROP TABLE IF EXISTS public.admin_audit_logs CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.job_bids CASCADE;
DROP TABLE IF EXISTS public.task_evidence CASCADE;
DROP TABLE IF EXISTS public.order_tasks CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.care_recipients CASCADE;
DROP TABLE IF EXISTS public.facilities CASCADE;
DROP TABLE IF EXISTS public.caregiver_profiles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. TABEL PROFILES (Akun Pengguna: Customer, Caregiver, Mitra Fasilitas, Admin)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('customer', 'caregiver', 'facility', 'admin')),
    phone TEXT NOT NULL,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    city TEXT DEFAULT 'Kota Surabaya',
    district TEXT DEFAULT 'Gubeng',
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION DEFAULT -7.2575,
    longitude DOUBLE PRECISION DEFAULT 112.7521,
    wallet_balance NUMERIC(14, 2) DEFAULT 0.00,
    nik_ktp TEXT, -- Wajib 16 digit untuk verifikasi anti-orderan fiktif
    is_verified BOOLEAN DEFAULT TRUE,
    password_hash TEXT DEFAULT 'carenest2026', -- Default password untuk uji coba
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL CAREGIVER PROFILES (Mitra Talent Pengasuh: UNAIR Ners, PAUD, FKH, dll)
CREATE TABLE public.caregiver_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    bio TEXT,
    education TEXT,
    experience_years INT DEFAULT 1,
    hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 45000.00,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    total_reviews INT DEFAULT 0,
    total_orders_completed INT DEFAULT 0,
    verified_ktp BOOLEAN DEFAULT TRUE,
    verified_skck BOOLEAN DEFAULT TRUE, -- Validasi SKCK Kepolisian (Polda Jatim)
    badges TEXT[] DEFAULT '{}',
    service_categories TEXT[] DEFAULT '{}', -- child, elderly, pet
    service_areas TEXT[] DEFAULT '{"Surabaya Pusat", "Surabaya Timur", "Surabaya Selatan"}',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL FACILITIES (Mitra Daycare Anak, Pet Hotel & Klinik di Surabaya)
CREATE TABLE public.facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('child_daycare', 'pet_hotel_care', 'elderly_daycare', 'clinic_care')),
    city TEXT DEFAULT 'Kota Surabaya',
    district TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    daily_rate NUMERIC(12, 2) NOT NULL,
    hourly_rate NUMERIC(12, 2) NOT NULL,
    capacity INT DEFAULT 15,
    slots_available INT DEFAULT 5,
    rating NUMERIC(3, 2) DEFAULT 4.90,
    review_count INT DEFAULT 0,
    amenities TEXT[] DEFAULT '{}',
    photos TEXT[] DEFAULT '{}',
    phone TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    operating_hours TEXT DEFAULT '07:00 - 18:00 WIB',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL CARE RECIPIENTS (Penerima Asuhan: Anak, Lansia, Hewan Peliharaan)
CREATE TABLE public.care_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('child', 'elderly', 'pet')),
    age_or_details TEXT NOT NULL,
    gender_or_breed TEXT,
    special_needs TEXT,
    allergies TEXT,
    emergency_contact TEXT,
    caregiver_criteria TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL ORDERS (Transaksi Pesanan Layanan Terjadwal H-1)
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    caregiver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    caregiver_name TEXT,
    facility_id UUID REFERENCES public.facilities(id) ON DELETE SET NULL,
    facility_name TEXT,
    recipient_id UUID REFERENCES public.care_recipients(id) ON DELETE RESTRICT NOT NULL,
    recipient_name TEXT NOT NULL,
    fulfillment_type TEXT NOT NULL CHECK (fulfillment_type IN ('home_visit', 'partner_facility')),
    service_category TEXT NOT NULL CHECK (service_category IN ('child', 'elderly', 'pet')),
    package_type TEXT NOT NULL CHECK (package_type IN ('daily', 'weekly', 'monthly')),
    duration_hours INT DEFAULT 4,
    days_count INT DEFAULT 1,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    service_address TEXT NOT NULL,
    city TEXT DEFAULT 'Kota Surabaya',
    district TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    base_price NUMERIC(12, 2) NOT NULL,
    discount_amount NUMERIC(12, 2) DEFAULT 0.00,
    platform_fee NUMERIC(12, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    escrow_status TEXT NOT NULL DEFAULT 'held' CHECK (escrow_status IN ('pending', 'held', 'released', 'refunded')),
    order_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (order_status IN ('draft', 'awaiting_applicants', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    notes TEXT,
    caregiver_criteria TEXT,
    reviewed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL ORDER TASKS (Daftar Tugas Pengasuh dengan Target Waktu)
CREATE TABLE public.order_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_time TEXT,
    is_required_photo BOOLEAN DEFAULT TRUE,
    is_required_gps BOOLEAN DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 8. TABEL TASK EVIDENCE (Bukti Foto Selesai Tugas + Koordinat GPS Real-time)
CREATE TABLE public.task_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.order_tasks(id) ON DELETE CASCADE UNIQUE NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    photo_url TEXT NOT NULL,
    notes TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address_snapshot TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABEL JOB BIDS (Lamaran Talent untuk Pesanan Terbuka)
CREATE TABLE public.job_bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    caregiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    proposed_rate NUMERIC(10, 2) NOT NULL,
    proposal_note TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABEL REVIEWS (Ulasan Bintang & Reputasi)
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    target_id UUID NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('caregiver', 'facility')),
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABEL ADMIN AUDIT LOGS (Pencatatan Tindakan Administratif & Keamanan)
CREATE TABLE public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    admin_name TEXT NOT NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES UNTUK PERFORMA QUERY CEPAT
-- ============================================================================
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_orders_customer ON public.orders(customer_id);
CREATE INDEX idx_orders_caregiver ON public.orders(caregiver_id);
CREATE INDEX idx_orders_status ON public.orders(order_status);
CREATE INDEX idx_orders_escrow ON public.orders(escrow_status);
CREATE INDEX idx_order_tasks_order ON public.order_tasks(order_id);
CREATE INDEX idx_task_evidence_task ON public.task_evidence(task_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses Bebas untuk Pengembangan & Testing (CRUD Penuh)
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Public delete profiles" ON public.profiles FOR DELETE USING (true);

CREATE POLICY "Public read caregivers" ON public.caregiver_profiles FOR SELECT USING (true);
CREATE POLICY "Public insert caregivers" ON public.caregiver_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update caregivers" ON public.caregiver_profiles FOR UPDATE USING (true);

CREATE POLICY "Public read facilities" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Public read care_recipients" ON public.care_recipients FOR SELECT USING (true);
CREATE POLICY "Public insert care_recipients" ON public.care_recipients FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Public delete orders" ON public.orders FOR DELETE USING (true);

CREATE POLICY "Public read tasks" ON public.order_tasks FOR SELECT USING (true);
CREATE POLICY "Public update tasks" ON public.order_tasks FOR UPDATE USING (true);
CREATE POLICY "Public insert tasks" ON public.order_tasks FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read evidence" ON public.task_evidence FOR SELECT USING (true);
CREATE POLICY "Public insert evidence" ON public.task_evidence FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read audit_logs" ON public.admin_audit_logs FOR SELECT USING (true);
CREATE POLICY "Public insert audit_logs" ON public.admin_audit_logs FOR INSERT WITH CHECK (true);


-- ============================================================================
-- SEED DATA LENGKAP (DATA DUMMY RESMI CARENEST)
-- ============================================================================

-- 1. INSERT USERS (PROFILES)
INSERT INTO public.profiles (id, email, full_name, role, phone, avatar_url, city, district, address, latitude, longitude, wallet_balance, nik_ktp, is_verified, password_hash)
VALUES
-- Customer 1: Budi Santoso (KTP Terverifikasi, Anti-Orderan Fiktif)
('c1000000-0000-0000-0000-000000000001', 'customer.budi@carenest.id', 'Budi Santoso', 'customer', '0812-3456-7890', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', 'Kota Surabaya', 'Gubeng', 'Jl. Raya Gubeng No. 45, Surabaya', -7.2692, 112.7531, 1500000.00, '3578012345670001', true, 'customer123'),

-- Customer 2: Siti Rahmawati
('c1000000-0000-0000-0000-000000000002', 'customer.siti@carenest.id', 'Siti Rahmawati', 'customer', '0812-9876-5432', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'Kota Surabaya', 'Rungkut', 'Perum Rungkut Asri Timur No. 12, Surabaya', -7.3183, 112.7794, 850000.00, '3578023456780002', true, 'customer123'),

-- Caregiver 1: Dinda Ayu, S.Kep (Mahasiswa Profesi Ners UNAIR, SKCK Polda Jatim)
('c2000000-0000-0000-0000-000000000001', 'dinda.caregiver@carenest.id', 'Dinda Ayu, S.Kep', 'caregiver', '0821-5566-7788', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Kota Surabaya', 'Sukolilo', 'Jl. Gebang Wetan No. 18, Sukolilo, Surabaya (Dekat UNAIR Kampus C)', -7.2891, 112.7932, 850000.00, '3578034567890003', true, 'caregiver123'),

-- Mitra Fasilitas: LittleNest Daycare Surabaya
('c3000000-0000-0000-0000-000000000001', 'mitra.littlenest@carenest.id', 'Admin LittleNest Daycare', 'facility', '0811-3200-900', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', 'Kota Surabaya', 'Tegalsari', 'Jl. Basuki Rahmat No. 88, Tegalsari, Surabaya', -7.2678, 112.7423, 4200000.00, '3578045678900004', true, 'facility123'),

-- Administrator: Admin Trust & Safety Surabaya
('c4000000-0000-0000-0000-000000000001', 'admin@carenest.id', 'Admin Trust & Safety Surabaya', 'admin', '0811-9999-000', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'Kota Surabaya', 'Gubeng', 'CareNest Operations Hub, Jl. Sumatra No. 10 Surabaya', -7.2711, 112.7495, 0.00, '3578010101900001', true, 'admin123')
ON CONFLICT (id) DO NOTHING;

-- 2. INSERT CAREGIVER PROFILES
INSERT INTO public.caregiver_profiles (id, user_id, bio, education, experience_years, hourly_rate, rating, total_reviews, total_orders_completed, verified_ktp, verified_skck, badges, service_categories, service_areas, is_available)
VALUES
('c9000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001',
'Lulusan Ners Keperawatan UNAIR Surabaya. Berpengalaman 3 tahun mendampingi lansia geriatri pasca stroke, kontrol jadwal obat rutin, cek tensi & gula darah, serta pendampingan stimulasi anak.',
'S1 Ners Keperawatan Univ. Airlangga (UNAIR)', 3, 50000.00, 4.95, 48, 52, true, true,
'{"Perawat Terverifikasi", "SKCK Polda Jatim Valid", "First Aid Bersertifikat", "Elderly Care"}',
'{"elderly", "child"}',
'{"Surabaya Pusat", "Surabaya Timur", "Surabaya Selatan"}', true)
ON CONFLICT (user_id) DO NOTHING;

-- 3. INSERT FACILITIES
INSERT INTO public.facilities (id, owner_user_id, name, category, city, district, address, latitude, longitude, daily_rate, hourly_rate, capacity, slots_available, rating, review_count, amenities, photos, phone, is_verified, operating_hours)
VALUES
('fac00000-0000-0000-0000-000000000001', 'c3000000-0000-0000-0000-000000000001',
'LittleNest Premium Daycare & Preschool', 'child_daycare', 'Kota Surabaya', 'Tegalsari', 'Jl. Basuki Rahmat No. 88, Tegalsari, Surabaya', -7.2678, 112.7423, 120000.00, 25000.00, 20, 6, 4.94, 84,
'{"CCTV 24 Jam via Web", "Dokter Anak Visit 2x/Bulan", "Ruang Bermain Ber-AC", "Makan Siang & Snack Sehat"}',
'{"https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600"}', '031-5312345', true, '07:00 - 18:00 WIB'),

('fac00000-0000-0000-0000-000000000002', NULL,
'Paws & Tails Surabaya Pet Hotel & Daycare', 'pet_hotel_care', 'Kota Surabaya', 'Rungkut', 'Jl. Rungkut Madya No. 42 (Dekat MERR), Surabaya', -7.3245, 112.7845, 85000.00, 15000.00, 25, 8, 4.89, 112,
'{"Kandang AC Individual", "Playground Luas Rumput Sintetis", "Dokter Hewan Standby", "Update Video WhatsApp"}',
'{"https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600"}', '031-8721122', true, '08:00 - 20:00 WIB'),

('fac00000-0000-0000-0000-000000000003', NULL,
'Griya Asih Senior Day Center Darmo', 'elderly_daycare', 'Kota Surabaya', 'Wonokromo', 'Jl. Raya Darmo Permai Selatan No. 15, Surabaya', -7.2915, 112.7354, 150000.00, 30000.00, 15, 4, 4.96, 45,
'{"Perawat Lansia Standby 24 Jam", "Senam Otak & Fisioterapi Ringan", "Ruang Istirahat Medis", "Menu Diet Khusus"}',
'{"https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600"}', '031-5619988', true, '07:30 - 17:30 WIB'),

('fac00000-0000-0000-0000-000000000004', NULL,
'HappyPaws Surabaya Pet Clinic & Boarding', 'pet_hotel_care', 'Kota Surabaya', 'Gubeng', 'Jl. Dharmahusada Indah Timur No. 34, Surabaya', -7.2688, 112.7712, 90000.00, 18000.00, 18, 5, 4.85, 67,
'{"Klinik Terintegrasi UGD Hewan", "Ruang Kucing & Anjing Terpisah", "Diet Khusus Hewan Sakit"}',
'{"https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600"}', '031-5993344', true, '08:00 - 21:00 WIB'),

('fac00000-0000-0000-0000-000000000005', NULL,
'Taman Bintang Montessori Daycare Sukolilo', 'child_daycare', 'Kota Surabaya', 'Sukolilo', 'Jl. Manyar Kertoarjo V No. 9, Sukolilo, Surabaya', -7.2812, 112.7689, 115000.00, 22000.00, 16, 3, 4.91, 52,
'{"Kurikulum Montessori", "Mainan Kayu Standar SNI", "Pencatatan Nutrisi Digital"}',
'{"https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600"}', '031-5947788', true, '07:00 - 17:00 WIB')
ON CONFLICT (id) DO NOTHING;

-- 4. INSERT CARE RECIPIENTS
INSERT INTO public.care_recipients (id, customer_id, name, type, age_or_details, gender_or_breed, special_needs, allergies, emergency_contact, caregiver_criteria)
VALUES
('ec000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Eyang Broto', 'elderly', '73 Tahun', 'Laki-laki', 'Pendampingan mobilisasi jalan tongkat, kontrol jadwal obat tensi pukul 13:00', 'Alergi kacang dan udang', '0812-3456-7890 (Budi)', 'Perawat bersertifikat STR, sabar & teliti tensi'),
('ec000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Kenzo Pratama', 'child', '4 Tahun', 'Laki-laki', 'Suka bermain lego & menggambar, diawasi saat makan buah', 'Alergi telur mentah', '0812-3456-7890 (Budi)', 'Lulusan PAUD / sabar mengasuh balita'),
('ec000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'Milo (Kucing Persia)', 'pet', '2 Tahun', 'Kucing Persia Medium (Jantan)', 'Beri wet food pukul 12:00, sisir bulu halus setelah bermain', 'Tidak boleh susu sapi', '0812-9876-5432 (Siti)', 'Mahasiswa FKH UNAIR / penyayang kucing')
ON CONFLICT (id) DO NOTHING;

-- 5. INSERT ORDERS
INSERT INTO public.orders (
    id, order_number, customer_id, customer_name, customer_phone, caregiver_id, caregiver_name, facility_id, facility_name,
    recipient_id, recipient_name, fulfillment_type, service_category, package_type, duration_hours, days_count,
    scheduled_start, scheduled_end, service_address, city, district, latitude, longitude,
    base_price, discount_amount, platform_fee, total_amount, escrow_status, order_status, progress_percentage, notes, caregiver_criteria
)
VALUES
-- Order 1: Sedang Berjalan (In Progress - Eyang Broto dengan Dinda Ayu Ners UNAIR)
('0ed00000-0000-0000-0000-000000000001', 'CN-2026-001', 'c1000000-0000-0000-0000-000000000001', 'Budi Santoso', '0812-3456-7890',
 'c2000000-0000-0000-0000-000000000001', 'Dinda Ayu, S.Kep', NULL, NULL,
 'ec000000-0000-0000-0000-000000000001', 'Eyang Broto', 'home_visit', 'elderly', 'daily', 4, 1,
 NOW() - INTERVAL '2 hours', NOW() + INTERVAL '2 hours',
 'Jl. Raya Gubeng No. 45, Surabaya', 'Kota Surabaya', 'Gubeng', -7.2692, 112.7531,
 200000.00, 0.00, 20000.00, 220000.00, 'held', 'in_progress', 60,
 'Tolong tensi dicatat di buku kontrol harian ya Mba Dinda', 'Ners Keperawatan UNAIR, cek tensi rutin'),

-- Order 2: Terkonfirmasi Fasilitas (Daycare Kenzo di LittleNest)
('0ed00000-0000-0000-0000-000000000002', 'CN-2026-002', 'c1000000-0000-0000-0000-000000000001', 'Budi Santoso', '0812-3456-7890',
 NULL, NULL, 'fac00000-0000-0000-0000-000000000001', 'LittleNest Premium Daycare & Preschool',
 'ec000000-0000-0000-0000-000000000002', 'Kenzo Pratama', 'partner_facility', 'child', 'daily', 8, 1,
 NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 8 hours',
 'Jl. Basuki Rahmat No. 88, Tegalsari, Surabaya', 'Kota Surabaya', 'Tegalsari', -7.2678, 112.7423,
 120000.00, 0.00, 12000.00, 132000.00, 'held', 'confirmed', 0,
 'Kenzo bawa bekal buah potong sendiri ya bu guru.', 'Daycare ber-AC & ada dokter anak'),

-- Order 3: Selesai Sempurna (Kenzo dengan Sari Wahyuni, Dana Escrow Released)
('0ed00000-0000-0000-0000-000000000003', 'CN-2026-004', 'c1000000-0000-0000-0000-000000000001', 'Budi Santoso', '0812-3456-7890',
 'c2000000-0000-0000-0000-000000000001', 'Dinda Ayu, S.Kep', NULL, NULL,
 'ec000000-0000-0000-0000-000000000002', 'Kenzo Pratama', 'home_visit', 'child', 'daily', 4, 1,
 NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '4 hours',
 'Jl. Raya Gubeng No. 45, Surabaya', 'Kota Surabaya', 'Gubeng', -7.2692, 112.7531,
 200000.00, 0.00, 20000.00, 220000.00, 'released', 'completed', 100,
 'Pendampingan anak selesai sempurna dengan bukti foto lengkap.', 'Pengasuh ramah & sabar')
ON CONFLICT (id) DO NOTHING;

-- 6. INSERT ORDER TASKS (Tugas Pengasuh untuk Order 1)
INSERT INTO public.order_tasks (id, order_id, title, description, scheduled_time, is_required_photo, is_required_gps, status, completed_at, completed_by)
VALUES
('75400000-0000-0000-0000-000000000001', '0ed00000-0000-0000-0000-000000000001', 'Pemeriksaan Tanda Vital & Tensi', 'Cek tekanan darah dan saturasi oksigen saat tiba di rumah Gubeng', '10:00 WIB', true, true, 'completed', NOW() - INTERVAL '1 hour 45 minutes', 'c2000000-0000-0000-0000-000000000001'),
('75400000-0000-0000-0000-000000000002', '0ed00000-0000-0000-0000-000000000001', 'Pemberian Obat Siang & Nutrisi', 'Dampingi makan siang rendah garam dan minum obat tensi (Amlodipine 5mg)', '12:00 WIB', true, true, 'completed', NOW() - INTERVAL '45 minutes', 'c2000000-0000-0000-0000-000000000001'),
('75400000-0000-0000-0000-000000000003', '0ed00000-0000-0000-0000-000000000001', 'Fisioterapi Ringan & Mobilisasi', 'Latihan jalan santai di teras rumah dan latihan peregangan sendi kaki', '13:00 WIB', true, true, 'completed', NOW() - INTERVAL '10 minutes', 'c2000000-0000-0000-0000-000000000001'),
('75400000-0000-0000-0000-000000000004', '0ed00000-0000-0000-0000-000000000001', 'Istirahat Siang & Relaksasi', 'Mendampingi istirahat siang di kamar dengan pendingin udara sejuk', '13:30 WIB', false, true, 'in_progress', NULL, NULL),
('75400000-0000-0000-0000-000000000005', '0ed00000-0000-0000-0000-000000000001', 'Laporan Pulang & Cek Akhir', 'Catat hasil kontrol di aplikasi, kemasi peralatan medis, dan pamit keluarga', '14:00 WIB', true, true, 'pending', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- 7. INSERT TASK EVIDENCE (Foto Bukti Pengerjaan + Koordinat GPS Real)
INSERT INTO public.task_evidence (id, task_id, order_id, photo_url, notes, latitude, longitude, address_snapshot, submitted_at)
VALUES
('eed00000-0000-0000-0000-000000000001', '75400000-0000-0000-0000-000000000001', '0ed00000-0000-0000-0000-000000000001',
 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
 'Tensi Eyang Broto: 125/82 mmHg, HR 76x/m. Kondisi stabil dan segar.',
 -7.2692, 112.7531, 'Jl. Raya Gubeng No. 45, Surabaya (Terverifikasi GPS)', NOW() - INTERVAL '1 hour 45 minutes'),

('eed00000-0000-0000-0000-000000000002', '75400000-0000-0000-0000-000000000002', '0ed00000-0000-0000-0000-000000000001',
 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
 'Makan siang bubur ayam habis 1 porsi, obat Amlodipine diminum tepat waktu.',
 -7.2692, 112.7531, 'Jl. Raya Gubeng No. 45, Surabaya (Terverifikasi GPS)', NOW() - INTERVAL '45 minutes'),

('eed00000-0000-0000-0000-000000000003', '75400000-0000-0000-0000-000000000003', '0ed00000-0000-0000-0000-000000000001',
 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600',
 'Latihan jalan 15 menit di teras lancar tanpa keluhan pusing.',
 -7.2692, 112.7531, 'Jl. Raya Gubeng No. 45, Surabaya (Terverifikasi GPS)', NOW() - INTERVAL '10 minutes')
ON CONFLICT (id) DO NOTHING;

-- 8. INSERT REVIEWS
INSERT INTO public.reviews (id, order_id, author_id, target_id, target_type, rating, comment, created_at)
VALUES
('4e700000-0000-0000-0000-000000000001', '0ed00000-0000-0000-0000-000000000003',
 'c1000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001',
 'caregiver', 5,
 'Mba Dinda sangat teliti dan profesional! Eyang senang sekali diajak latihan jalan santai. Update foto dan GPS selalu tepat waktu.',
 NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 9. INSERT ADMIN AUDIT LOGS
INSERT INTO public.admin_audit_logs (id, admin_id, admin_name, action, target, details, created_at)
VALUES
('10600000-0000-0000-0000-000000000001', 'c4000000-0000-0000-0000-000000000001', 'Admin Trust & Safety', 'VERIFIKASI_SKCK', 'Dinda Ayu, S.Kep (Caregiver)', 'Verifikasi berkas SKCK Polda Jatim No. SKCK/YANMAS/IX/2026 dan STR Keperawatan UNAIR disetujui resmi.', NOW() - INTERVAL '2 days'),
('10600000-0000-0000-0000-000000000002', 'c4000000-0000-0000-0000-000000000001', 'Admin Trust & Safety', 'VERIFIKASI_KTP', 'Budi Santoso (Customer)', 'Validasi NIK KTP 3578012345670001 dan verifikasi nomor WhatsApp aktif anti-orderan fiktif.', NOW() - INTERVAL '1 day'),
('10600000-0000-0000-0000-000000000003', 'c4000000-0000-0000-0000-000000000001', 'Admin Trust & Safety', 'ESCROW_RELEASE', 'Order #CN-2026-004', 'Audit selesai tugas: foto tensimeter & GPS sesuai lokasi Gubeng. Dana escrow Rp 220.000 dilepas ke caregiver.', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- SELESAI! Seluruh tabel dan data dummy berhasil dibuat dan siap dipakai di Supabase.
