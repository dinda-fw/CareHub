-- ============================================================================
-- CareNest Indonesia - Dummy Database Seed Data (Surabaya Context)
-- ============================================================================

-- 1. USERS & PROFILES
INSERT INTO public.profiles (id, email, full_name, role, phone, avatar_url, city, district, address, latitude, longitude, wallet_balance)
VALUES
-- Customer 1
('c1000000-0000-0000-0000-000000000001', 'customer.budi@carenest.id', 'Budi Santoso', 'customer', '081234567890', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', 'Surabaya', 'Gubeng', 'Jl. Raya Gubeng No. 45, Surabaya', -7.2692, 112.7531, 1500000.00),
-- Customer 2
('c1000000-0000-0000-0000-000000000002', 'customer.siti@carenest.id', 'Siti Rahmawati', 'customer', '081298765432', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'Surabaya', 'Rungkut', 'Perum Rungkut Asri Timur No. 12, Surabaya', -7.3183, 112.7794, 750000.00),

-- Caregiver 1 (Dinda - Keperawatan UNAIR, Lansia & Anak)
('c2000000-0000-0000-0000-000000000001', 'dinda.caregiver@carenest.id', 'Dinda Ayu, S.Kep', 'caregiver', '082155667788', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Surabaya', 'Sukolilo', 'Jl. Gebang Wetan No. 18, Sukolilo, Surabaya', -7.2891, 112.7932, 850000.00),
-- Caregiver 2 (Sari - Eks Guru PAUD Surabaya)
('c2000000-0000-0000-0000-000000000002', 'sari.paud@carenest.id', 'Sari Wahyuni, S.Pd', 'caregiver', '085711223344', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'Surabaya', 'Wonokromo', 'Jl. Wonokromo Indah II No. 7, Surabaya', -7.3012, 112.7381, 620000.00),
-- Caregiver 3 (Fajar - Kedokteran Hewan UNAIR)
('c2000000-0000-0000-0000-000000000003', 'fajar.vet@carenest.id', 'Fajar Pratama, S.KH', 'caregiver', '087899001122', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Surabaya', 'Mulyorejo', 'Jl. Mulyorejo Baru No. 22, Surabaya', -7.2654, 112.7877, 450000.00),
-- Caregiver 4 (Rian - Fisioterapis Lansia)
('c2000000-0000-0000-0000-000000000004', 'rian.fisio@carenest.id', 'Rian Hidayat, A.Md.Fis', 'caregiver', '081344556677', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Surabaya', 'Wiyung', 'Perum Graha Famili Blok D-8, Surabaya', -7.3105, 112.6953, 1100000.00),

-- Facility Mitra Owner 1 (LittleNest)
('c3000000-0000-0000-0000-000000000001', 'mitra.littlenest@carenest.id', 'Admin LittleNest Daycare', 'facility', '08113200900', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', 'Surabaya', 'Tegalsari', 'Jl. Basuki Rahmat No. 88, Surabaya', -7.2678, 112.7423, 4200000.00),
-- Admin Platform
('c4000000-0000-0000-0000-000000000001', 'admin@carenest.id', 'Admin Trust & Safety Surabaya', 'admin', '08119999000', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'Surabaya', 'Gubeng', 'CareNest Hub Surabaya, Jl. Sumatra No. 10', -7.2711, 112.7495, 0.00)
ON CONFLICT (id) DO NOTHING;

-- 2. CAREGIVER PROFILES
INSERT INTO public.caregiver_profiles (id, user_id, bio, education, experience_years, hourly_rate, rating, total_reviews, total_orders_completed, verified_ktp, verified_skck, badges, service_categories, service_areas, is_available)
VALUES
('cg000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 
'Lulusan Ners Keperawatan UNAIR Surabaya. Berpengalaman 3 tahun mendampingi lansia geriatri pasca stroke, kontrol obat teratur, cek tensi/gula darah, dan pendampingan anak.', 
'S1 Ners Keperawatan Universitas Airlangga', 3, 50000.00, 4.95, 48, 52, true, true, 
'{"Perawat Terverifikasi", "Elderly Care", "First Aid Bersertifikat", "Child Care"}', 
'{"elderly", "child"}', 
'{"Surabaya Pusat", "Surabaya Timur", "Surabaya Selatan"}', true),

('cg000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002', 
'Eks Pendidik PAUD & Playgroup Surabaya selama 5 tahun. Spesialis mendampingi balita (1-5 tahun), stimulasi sensori motorik, potty training, dan jadwal nutrisi teratur.', 
'S1 PG-PAUD Universitas Negeri Surabaya', 5, 45000.00, 4.88, 36, 40, true, true, 
'{"Pendidik PAUD", "Child Care Spesialis", "Stimulasi Sensorik", "SKCK Polda Jatim"}', 
'{"child"}', 
'{"Surabaya Selatan", "Surabaya Pusat", "Surabaya Barat"}', true),

('cg000000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000003', 
'Mahasiswa Profesi Dokter Hewan (FKH UNAIR). Terbiasa merawat anjing ras besar/kecil, kucing persia/domestik, pemberian obat, grooming dasar, serta dog walking rutin.', 
'S1 Kedokteran Hewan UNAIR', 2, 40000.00, 5.00, 24, 28, true, true, 
'{"Medis Hewan UNAIR", "Pet Handling", "First Aid Hewan"}', 
'{"pet"}', 
'{"Surabaya Timur", "Surabaya Pusat"}', true),

('cg000000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000004', 
'Fisioterapis berlisensi STR. Khusus pendampingan mobilisasi fisik lansia, latihan jalan santai, latihan keseimbangan dan pencegahan resiko jatuh di rumah.', 
'D3 Fisioterapi Poltekkes Kemenkes Surabaya', 4, 65000.00, 4.92, 19, 21, true, true, 
'{"Fisioterapis STR", "Elderly Mobility", "Rehabilitasi Medik"}', 
'{"elderly"}', 
'{"Surabaya Barat", "Surabaya Selatan"}', true)
ON CONFLICT (user_id) DO NOTHING;

-- 3. MITRA FACILITIES (SURABAYA)
INSERT INTO public.facilities (id, owner_user_id, name, category, city, district, address, latitude, longitude, daily_rate, hourly_rate, capacity, slots_available, rating, review_count, amenities, photos, phone, is_verified, operating_hours)
VALUES
('fac00000-0000-0000-0000-000000000001', 'c3000000-0000-0000-0000-000000000001',
'LittleNest Premium Daycare & Preschool', 'child_daycare', 'Surabaya', 'Tegalsari', 'Jl. Basuki Rahmat No. 88, Tegalsari, Surabaya', -7.2678, 112.7423, 120000.00, 25000.00, 20, 6, 4.94, 84,
'{"CCTV 24 Jam via Web", "Dokter Anak Visit 2x/Bulan", "Ruang Bermain Ber-AC", "Makan Siang & Snack Sehat", "Tidur Siang Nyaman"}',
'{"https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600"}', '031-5312345', true, '07:00 - 18:00 WIB'),

('fac00000-0000-0000-0000-000000000002', NULL,
'Paws & Tails Surabaya Pet Hotel & Daycare', 'pet_hotel_care', 'Surabaya', 'Rungkut', 'Jl. Rungkut Madya No. 42 (Dekat MERR), Surabaya', -7.3245, 112.7845, 85000.00, 15000.00, 25, 8, 4.89, 112,
'{"Kandang AC Individual", "Playground Luas Rumput Sintetis", "Dokter Hewan Standby", "Update Video WhatsApp/Web", "Grooming Gratis Paket Mingguan"}',
'{"https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600"}', '031-8721122', true, '08:00 - 20:00 WIB'),

('fac00000-0000-0000-0000-000000000003', NULL,
'Griya Asih Senior Day Center Darmo', 'elderly_daycare', 'Surabaya', 'Wonokromo', 'Jl. Raya Darmo Permai Selatan No. 15, Surabaya', -7.2915, 112.7354, 150000.00, 30000.00, 15, 4, 4.96, 45,
'{"Perawat Lansia Standby 24 Jam", "Senam Otak & Fisioterapi Ringan", "Ruang Istirahat Medis", "Menu Diet Khusus Hipertensi/Diabetes"}',
'{"https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600"}', '031-5619988', true, '07:30 - 17:30 WIB'),

('fac00000-0000-0000-0000-000000000004', NULL,
'HappyPaws Surabaya Pet Clinic & Boarding', 'pet_hotel_care', 'Surabaya', 'Gubeng', 'Jl. Dharmahusada Indah Timur No. 34, Surabaya', -7.2688, 112.7712, 90000.00, 18000.00, 18, 5, 4.85, 67,
'{"Klinik Terintegrasi UGD Hewan", "Ruang Khusus Kucing & Anjing Terpisah", "Diet Khusus Hewan Sakit", "Layanan Antar Jemput Surabaya"}',
'{"https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600"}', '031-5993344', true, '08:00 - 21:00 WIB'),

('fac00000-0000-0000-0000-000000000005', NULL,
'Taman Bintang Montessori Daycare Sukolilo', 'child_daycare', 'Surabaya', 'Sukolilo', 'Jl. Manyar Kertoarjo V No. 9, Sukolilo, Surabaya', -7.2812, 112.7689, 115000.00, 22000.00, 16, 3, 4.91, 52,
'{"Kurikulum Montessori", "Mainan Kayu Standar SNI", "Pencatatan Nutrisi Digital", "Ruang Laktasi & Tidur Hening"}',
'{"https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600"}', '031-5947788', true, '07:00 - 17:00 WIB')
ON CONFLICT (id) DO NOTHING;

-- 4. CARE RECIPIENTS
INSERT INTO public.care_recipients (id, customer_id, name, type, age_or_details, gender_or_breed, special_needs, allergies, emergency_contact)
VALUES
('rc000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Eyang Broto', 'elderly', '73 Tahun', 'Laki-laki', 'Pendampingan mobilisasi jalan tongkat, kontrol jadwal obat tensi pukul 13:00', 'Alergi kacang dan udang', '081234567890 (Budi)'),
('rc000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Kenzo Pratama', 'child', '4 Tahun', 'Laki-laki', 'Suka bermain lego dan menggambar, perlu diawasi saat makan buah', 'Alergi telur mentah', '081234567890 (Budi)'),
('rc000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'Milo (Kucing Persia)', 'pet', '2 Tahun', 'Kucing Persia Medium (Jantan)', 'Beri wet food pukul 12:00, sisir bulu halus setelah bermain, bersihkan litter box', 'Tidak boleh produk susu sapi', '081298765432 (Siti)')
ON CONFLICT (id) DO NOTHING;

-- 5. SAMPLE ORDERS WITH TASKS & PROGRESS
INSERT INTO public.orders (
    id, order_number, customer_id, caregiver_id, facility_id, recipient_id, 
    fulfillment_type, service_category, package_type, duration_hours, days_count, 
    scheduled_start, scheduled_end, service_address, district, latitude, longitude, 
    base_price, discount_amount, platform_fee, total_amount, escrow_status, order_status, progress_percentage, notes
)
VALUES
-- Order 1: Active In-Progress Home Visit in Gubeng Surabaya (Caregiver: Dinda, Recipient: Eyang Broto)
('ord00000-0000-0000-0000-000000000001', 'CN-SBY-2026-0901', 'c1000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', NULL, 'rc000000-0000-0000-0000-000000000001',
'home_visit', 'elderly', 'daily', 5, 1, 
NOW() - INTERVAL '2 hours', NOW() + INTERVAL '3 hours', 'Jl. Raya Gubeng No. 45, Surabaya', 'Gubeng', -7.2692, 112.7531,
250000.00, 0.00, 25000.00, 275000.00, 'held', 'in_progress', 66, 'Tolong dampingi eyang jalan pagi, minum obat tensi tepat waktu, dan cek tensi.');

-- Tasks for Order 1
INSERT INTO public.order_tasks (id, order_id, title, description, scheduled_time, is_required_photo, is_required_gps, status, completed_at, completed_by)
VALUES
('tsk00000-0000-0000-0000-000000000001', 'ord00000-0000-0000-0000-000000000001', 
'Dampingi Jalan Santai di Teras', 'Bantu eyang berdiri dengan tongkat dan temani peregangan ringan 15 menit', '09:00 WIB', true, true, 'completed', NOW() - INTERVAL '1 hour 40 minutes', 'c2000000-0000-0000-0000-000000000001'),

('tsk00000-0000-0000-0000-000000000002', 'ord00000-0000-0000-0000-000000000001', 
'Siapkan Makan Siang & Cek Tensi', 'Sajikan sup ayam hangat rendah garam, lalu ukur tekanan darah eyang Broto', '11:30 WIB', true, true, 'completed', NOW() - INTERVAL '30 minutes', 'c2000000-0000-0000-0000-000000000001'),

('tsk00000-0000-0000-0000-000000000003', 'ord00000-0000-0000-0000-000000000001', 
'Pemberian Obat Tensi & Istirahat Siang', 'Berikan Amlodipine 5mg sesuai resep dokter, rapikan tempat tidur', '13:00 WIB', true, true, 'in_progress', NULL, NULL);

-- Evidences for Order 1 with Surabaya GPS Snapshots
INSERT INTO public.task_evidences (id, task_id, order_id, photo_url, notes, latitude, longitude, address_snapshot, submitted_at)
VALUES
('evd00000-0000-0000-0000-000000000001', 'tsk00000-0000-0000-0000-000000000001', 'ord00000-0000-0000-0000-000000000001',
'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=500', 
'Eyang Broto sudah jalan santai di teras 20 menit, kondisi segar dan ceria.', -7.2692, 112.7531, 'Jl. Raya Gubeng No. 45, Surabaya (Akurasi GPS 4m)', NOW() - INTERVAL '1 hour 40 minutes'),

('evd00000-0000-0000-0000-000000000002', 'tsk00000-0000-0000-0000-000000000002', 'ord00000-0000-0000-0000-000000000001',
'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=500', 
'Makan siang sup sayur habis 1 porsi. Hasil tensi darah: 124/82 mmHg (Normal stabil).', -7.2693, 112.7532, 'Jl. Raya Gubeng No. 45, Surabaya (Akurasi GPS 3m)', NOW() - INTERVAL '30 minutes');
