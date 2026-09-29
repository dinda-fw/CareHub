import { 
  Profile, CaregiverProfile, Facility, CareRecipient, Order, OrderTask, TaskEvidence, JobBid, Review, AdminAuditLog 
} from './types';

// Default Accounts in Surabaya
export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    email: 'customer.budi@carenest.id',
    full_name: 'Budi Santoso',
    role: 'customer',
    phone: '0812-3456-7890',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    city: 'Surabaya',
    district: 'Gubeng',
    address: 'Jl. Raya Gubeng No. 45, Surabaya',
    latitude: -7.2692,
    longitude: 112.7531,
    wallet_balance: 1500000,
    nik_ktp: '3578012345670001',
    is_verified: true,
    password: 'customer123',
  },
  {
    id: 'c2000000-0000-0000-0000-000000000001',
    email: 'dinda.caregiver@carenest.id',
    full_name: 'Dinda Ayu, S.Kep',
    role: 'caregiver',
    phone: '0821-5566-7788',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    city: 'Surabaya',
    district: 'Sukolilo',
    address: 'Jl. Gebang Wetan No. 18, Sukolilo, Surabaya (Dekat Kampus UNAIR/ITS)',
    latitude: -7.2891,
    longitude: 112.7932,
    wallet_balance: 850000,
    nik_ktp: '3578023456780002',
    is_verified: true,
    password: 'caregiver123',
  },
  {
    id: 'c3000000-0000-0000-0000-000000000001',
    email: 'mitra.littlenest@carenest.id',
    full_name: 'Admin LittleNest Daycare',
    role: 'facility',
    phone: '0811-3200-900',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    city: 'Surabaya',
    district: 'Tegalsari',
    address: 'Jl. Basuki Rahmat No. 88, Surabaya',
    latitude: -7.2678,
    longitude: 112.7423,
    wallet_balance: 4200000,
    nik_ktp: '3578034567890003',
    is_verified: true,
    password: 'facility123',
  },
  {
    id: 'c4000000-0000-0000-0000-000000000001',
    email: 'admin@carenest.id',
    full_name: 'Admin Trust & Safety Surabaya',
    role: 'admin',
    phone: '0811-9999-000',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    city: 'Surabaya',
    district: 'Gubeng',
    address: 'CareNest Operations Hub Surabaya, Jl. Sumatra No. 10',
    latitude: -7.2711,
    longitude: 112.7495,
    wallet_balance: 0,
    nik_ktp: '3578010101900001',
    is_verified: true,
    password: 'admin123',
  }
];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-001',
    admin_name: 'Admin Trust & Safety',
    action: 'VERIFIKASI_SKCK',
    target: 'Dinda Ayu, S.Kep (Caregiver)',
    details: 'Verifikasi berkas SKCK Polda Jatim No. SKCK/YANMAS/IX/2026 dan STR Keperawatan UNAIR disetujui.',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'log-002',
    admin_name: 'Admin Trust & Safety',
    action: 'VERIFIKASI_KTP',
    target: 'Budi Santoso (Customer)',
    details: 'Validasi NIK KTP 3578012345670001 dan verifikasi nomor WhatsApp aktif anti-orderan fiktif.',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'log-003',
    admin_name: 'Admin Trust & Safety',
    action: 'ESCROW_AUDIT',
    target: 'Order #CN-2026-004',
    details: 'Audit selesai tugas: foto tensimeter & GPS sesuai lokasi Gubeng. Dana escrow Rp 360.000 dilepas ke caregiver.',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  }
];

// Surabaya Caregiver / Talent Profiles
export const INITIAL_CAREGIVERS: CaregiverProfile[] = [
  {
    id: 'cg000000-0000-0000-0000-000000000001',
    user_id: 'c2000000-0000-0000-0000-000000000001',
    name: 'Dinda Ayu, S.Kep',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    bio: 'Lulusan Ners Keperawatan UNAIR Surabaya. Berpengalaman 3 tahun mendampingi lansia geriatri pasca stroke, kontrol jadwal obat rutin, cek tensi & gula darah, serta pendampingan anak.',
    education: 'S1 Ners Keperawatan Univ. Airlangga',
    experience_years: 3,
    hourly_rate: 50000,
    rating: 4.95,
    total_reviews: 48,
    total_orders_completed: 52,
    verified_ktp: true,
    verified_skck: true,
    badges: ['Perawat Terverifikasi', 'Elderly Care', 'First Aid Bersertifikat', 'Child Care'],
    service_categories: ['elderly', 'child'],
    service_areas: ['Surabaya Pusat', 'Surabaya Timur', 'Surabaya Selatan'],
    is_available: true,
    district: 'Sukolilo',
    latitude: -7.2891,
    longitude: 112.7932,
  },
  {
    id: 'cg000000-0000-0000-0000-000000000002',
    user_id: 'c2000000-0000-0000-0000-000000000002',
    name: 'Sari Wahyuni, S.Pd',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
    bio: 'Eks Pendidik PAUD & Playgroup Surabaya selama 5 tahun. Spesialis mendampingi balita (1-5 tahun), stimulasi sensori motorik, potty training, dan jadwal nutrisi teratur.',
    education: 'S1 PG-PAUD Univ. Negeri Surabaya',
    experience_years: 5,
    hourly_rate: 45000,
    rating: 4.88,
    total_reviews: 36,
    total_orders_completed: 40,
    verified_ktp: true,
    verified_skck: true,
    badges: ['Pendidik PAUD', 'Child Care Spesialis', 'Stimulasi Sensorik', 'SKCK Polda Jatim'],
    service_categories: ['child'],
    service_areas: ['Surabaya Selatan', 'Surabaya Pusat', 'Surabaya Barat'],
    is_available: true,
    district: 'Wonokromo',
    latitude: -7.3012,
    longitude: 112.7381,
  },
  {
    id: 'cg000000-0000-0000-0000-000000000003',
    user_id: 'c2000000-0000-0000-0000-000000000003',
    name: 'Fajar Pratama, S.KH',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    bio: 'Alumni Kedokteran Hewan (FKH UNAIR). Terbiasa merawat anjing ras besar/kecil, kucing persia/domestik, pemberian obat, grooming dasar, serta dog walking rutin.',
    education: 'S1 Kedokteran Hewan UNAIR',
    experience_years: 2,
    hourly_rate: 40000,
    rating: 5.0,
    total_reviews: 24,
    total_orders_completed: 28,
    verified_ktp: true,
    verified_skck: true,
    badges: ['Medis Hewan UNAIR', 'Pet Handling', 'First Aid Hewan'],
    service_categories: ['pet'],
    service_areas: ['Surabaya Timur', 'Surabaya Pusat'],
    is_available: true,
    district: 'Mulyorejo',
    latitude: -7.2654,
    longitude: 112.7877,
  },
  {
    id: 'cg000000-0000-0000-0000-000000000004',
    user_id: 'c2000000-0000-0000-0000-000000000004',
    name: 'Rian Hidayat, A.Md.Fis',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    bio: 'Fisioterapis berlisensi STR. Khusus pendampingan mobilisasi fisik lansia, latihan jalan santai pasca stroke, latihan keseimbangan dan pencegahan resiko jatuh di rumah.',
    education: 'D3 Fisioterapi Poltekkes Surabaya',
    experience_years: 4,
    hourly_rate: 65000,
    rating: 4.92,
    total_reviews: 19,
    total_orders_completed: 21,
    verified_ktp: true,
    verified_skck: true,
    badges: ['Fisioterapis STR', 'Elderly Mobility', 'Rehabilitasi Medik'],
    service_categories: ['elderly'],
    service_areas: ['Surabaya Barat', 'Surabaya Selatan'],
    is_available: true,
    district: 'Wiyung',
    latitude: -7.3105,
    longitude: 112.6953,
  }
];

// Surabaya Mitra Facilities (Daycare, Petcare/Pet Hotel, Klinik & Senior Center)
export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac00000-0000-0000-0000-000000000001',
    name: 'LittleNest Premium Daycare & Preschool',
    category: 'child_daycare',
    category_label: 'Daycare Anak Terakreditasi',
    city: 'Surabaya',
    district: 'Tegalsari',
    address: 'Jl. Basuki Rahmat No. 88, Tegalsari, Surabaya',
    latitude: -7.2678,
    longitude: 112.7423,
    daily_rate: 120000,
    hourly_rate: 25000,
    capacity: 20,
    slots_available: 6,
    rating: 4.94,
    review_count: 84,
    amenities: ['CCTV 24 Jam via Web', 'Dokter Anak Visit 2x/Bulan', 'Ruang Bermain Ber-AC', 'Makan Siang & Snack Sehat', 'Tidur Siang Nyaman'],
    photos: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600'],
    phone: '031-5312345',
    is_verified: true,
    operating_hours: '07:00 - 18:00 WIB',
  },
  {
    id: 'fac00000-0000-0000-0000-000000000002',
    name: 'Paws & Tails Surabaya Pet Hotel & Daycare',
    category: 'pet_hotel_care',
    category_label: 'Pet Hotel & Daycare Hewan',
    city: 'Surabaya',
    district: 'Rungkut',
    address: 'Jl. Rungkut Madya No. 42 (Dekat MERR), Surabaya',
    latitude: -7.3245,
    longitude: 112.7845,
    daily_rate: 85000,
    hourly_rate: 15000,
    capacity: 25,
    slots_available: 8,
    rating: 4.89,
    review_count: 112,
    amenities: ['Kandang AC Individual', 'Playground Luas Rumput Sintetis', 'Dokter Hewan Standby', 'Update Video WhatsApp/Web', 'Grooming Gratis Paket Mingguan'],
    photos: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600'],
    phone: '031-8721122',
    is_verified: true,
    operating_hours: '08:00 - 20:00 WIB',
  },
  {
    id: 'fac00000-0000-0000-0000-000000000003',
    name: 'Griya Asih Senior Day Center Darmo',
    category: 'elderly_daycare',
    category_label: 'Daycare & Senior Activity Center',
    city: 'Surabaya',
    district: 'Wonokromo',
    address: 'Jl. Raya Darmo Permai Selatan No. 15, Surabaya',
    latitude: -7.2915,
    longitude: 112.7354,
    daily_rate: 150000,
    hourly_rate: 30000,
    capacity: 15,
    slots_available: 4,
    rating: 4.96,
    review_count: 45,
    amenities: ['Perawat Lansia Standby 24 Jam', 'Senam Otak & Fisioterapi Ringan', 'Ruang Istirahat Medis', 'Menu Diet Khusus Hipertensi/Diabetes'],
    photos: ['https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600'],
    phone: '031-5619988',
    is_verified: true,
    operating_hours: '07:30 - 17:30 WIB',
  },
  {
    id: 'fac00000-0000-0000-0000-000000000004',
    name: 'HappyPaws Surabaya Pet Clinic & Boarding',
    category: 'clinic_care',
    category_label: 'Klinik & Rawat Inap Hewan',
    city: 'Surabaya',
    district: 'Gubeng',
    address: 'Jl. Dharmahusada Indah Timur No. 34, Surabaya',
    latitude: -7.2688,
    longitude: 112.7712,
    daily_rate: 90000,
    hourly_rate: 18000,
    capacity: 18,
    slots_available: 5,
    rating: 4.85,
    review_count: 67,
    amenities: ['Klinik Terintegrasi UGD Hewan', 'Ruang Kucing & Anjing Terpisah', 'Diet Khusus Hewan Sakit', 'Layanan Antar Jemput Surabaya'],
    photos: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600'],
    phone: '031-5993344',
    is_verified: true,
    operating_hours: '08:00 - 21:00 WIB',
  },
  {
    id: 'fac00000-0000-0000-0000-000000000005',
    name: 'Taman Bintang Montessori Daycare Sukolilo',
    category: 'child_daycare',
    category_label: 'Montessori Child Daycare',
    city: 'Surabaya',
    district: 'Sukolilo',
    address: 'Jl. Manyar Kertoarjo V No. 9, Sukolilo, Surabaya',
    latitude: -7.2812,
    longitude: 112.7689,
    daily_rate: 115000,
    hourly_rate: 22000,
    capacity: 16,
    slots_available: 3,
    rating: 4.91,
    review_count: 52,
    amenities: ['Kurikulum Montessori', 'Mainan Standar Edukasi SNI', 'Pencatatan Nutrisi Digital', 'Ruang Laktasi & Tidur Hening'],
    photos: ['https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600'],
    phone: '031-5947788',
    is_verified: true,
    operating_hours: '07:00 - 17:00 WIB',
  }
];

// Surabaya Care Recipients
export const INITIAL_RECIPIENTS: CareRecipient[] = [
  {
    id: 'rc000000-0000-0000-0000-000000000001',
    customer_id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Eyang Broto',
    type: 'elderly',
    age_or_details: '73 Tahun',
    gender_or_breed: 'Laki-laki',
    special_needs: 'Pendampingan mobilisasi jalan tongkat, kontrol jadwal obat tensi pukul 13:00',
    allergies: 'Alergi kacang dan udang',
    emergency_contact: '0812-3456-7890 (Budi - Anak)',
  },
  {
    id: 'rc000000-0000-0000-0000-000000000002',
    customer_id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Kenzo Pratama',
    type: 'child',
    age_or_details: '4 Tahun',
    gender_or_breed: 'Laki-laki',
    special_needs: 'Suka bermain lego & membaca buku cerita, butuh pengawasan saat makan',
    allergies: 'Alergi telur mentah',
    emergency_contact: '0812-3456-7890 (Budi - Ayah)',
  },
  {
    id: 'rc000000-0000-0000-0000-000000000003',
    customer_id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Milo (Kucing Persia)',
    type: 'pet',
    age_or_details: '2 Tahun',
    gender_or_breed: 'Kucing Persia Medium (Jantan)',
    special_needs: 'Beri wet food pukul 12:00, sisir bulu halus setelah bermain, bersihkan litter box',
    allergies: 'Tidak boleh produk susu sapi',
    emergency_contact: '0812-3456-7890 (Budi)',
  }
];

// Initial Orders with tasks, real Surabaya GPS snapshots, and progressive status
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord00000-0000-0000-0000-000000000001',
    order_number: 'CN-SBY-2026-0901',
    customer_id: 'c1000000-0000-0000-0000-000000000001',
    customer_name: 'Budi Santoso',
    customer_phone: '0812-3456-7890',
    caregiver_id: 'c2000000-0000-0000-0000-000000000001',
    caregiver_name: 'Dinda Ayu, S.Kep',
    caregiver_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    caregiver_phone: '0821-5566-7788',
    recipient_id: 'rc000000-0000-0000-0000-000000000001',
    recipient_name: 'Eyang Broto (73 Th)',
    recipient_type: 'elderly',
    recipient_details: 'Pendampingan Lansia di Rumah Gubeng Surabaya',
    fulfillment_type: 'home_visit',
    service_category: 'elderly',
    package_type: 'daily',
    duration_hours: 5,
    days_count: 1,
    scheduled_start: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    scheduled_end: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    service_address: 'Jl. Raya Gubeng No. 45, Surabaya',
    district: 'Gubeng',
    latitude: -7.2692,
    longitude: 112.7531,
    base_price: 250000,
    facility_fee: 0,
    discount_amount: 0,
    platform_fee: 25000,
    total_amount: 275000,
    escrow_status: 'held',
    order_status: 'in_progress',
    progress_percentage: 67,
    notes: 'Tolong dampingi eyang jalan santai, pastikan obat tensi diminum tepat waktu dan dicatat tensi darahnya.',
    created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    tasks: [
      {
        id: 'tsk00000-0000-0000-0000-000000000001',
        order_id: 'ord00000-0000-0000-0000-000000000001',
        title: 'Dampingi Jalan Santai di Teras',
        description: 'Bantu eyang berdiri dengan tongkat dan temani peregangan ringan 15 menit',
        scheduled_time: '09:00 WIB',
        is_required_photo: true,
        is_required_gps: true,
        status: 'completed',
        completed_at: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
        evidence: {
          id: 'evd00000-0000-0000-0000-000000000001',
          task_id: 'tsk00000-0000-0000-0000-000000000001',
          order_id: 'ord00000-0000-0000-0000-000000000001',
          photo_url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=500',
          notes: 'Eyang Broto sudah jalan santai di teras 20 menit, kondisi segar dan ceria.',
          latitude: -7.2692,
          longitude: 112.7531,
          address_snapshot: 'Jl. Raya Gubeng No. 45, Surabaya (Akurasi GPS 4m)',
          submitted_at: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
        }
      },
      {
        id: 'tsk00000-0000-0000-0000-000000000002',
        order_id: 'ord00000-0000-0000-0000-000000000001',
        title: 'Siapkan Makan Siang & Cek Tensi',
        description: 'Sajikan sup ayam hangat rendah garam, lalu ukur tekanan darah eyang Broto',
        scheduled_time: '11:30 WIB',
        is_required_photo: true,
        is_required_gps: true,
        status: 'completed',
        completed_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        evidence: {
          id: 'evd00000-0000-0000-0000-000000000002',
          task_id: 'tsk00000-0000-0000-0000-000000000002',
          order_id: 'ord00000-0000-0000-0000-000000000001',
          photo_url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=500',
          notes: 'Makan siang sup sayur habis 1 porsi. Hasil tensi darah: 124/82 mmHg (Normal stabil).',
          latitude: -7.2693,
          longitude: 112.7532,
          address_snapshot: 'Jl. Raya Gubeng No. 45, Surabaya (Akurasi GPS 3m)',
          submitted_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        }
      },
      {
        id: 'tsk00000-0000-0000-0000-000000000003',
        order_id: 'ord00000-0000-0000-0000-000000000001',
        title: 'Pemberian Obat Tensi & Istirahat Siang',
        description: 'Berikan Amlodipine 5mg sesuai resep dokter, rapikan tempat tidur eyang',
        scheduled_time: '13:00 WIB',
        is_required_photo: true,
        is_required_gps: true,
        status: 'in_progress',
      }
    ]
  },
  {
    id: 'ord00000-0000-0000-0000-000000000002',
    order_number: 'CN-SBY-2026-0902',
    customer_id: 'c1000000-0000-0000-0000-000000000001',
    customer_name: 'Budi Santoso',
    customer_phone: '0812-3456-7890',
    facility_id: 'fac00000-0000-0000-0000-000000000001',
    facility_name: 'LittleNest Premium Daycare & Preschool',
    facility_address: 'Jl. Basuki Rahmat No. 88, Tegalsari, Surabaya',
    recipient_id: 'rc000000-0000-0000-0000-000000000002',
    recipient_name: 'Kenzo Pratama (4 Th)',
    recipient_type: 'child',
    recipient_details: 'Penitipan Daycare Anak Full Day di Tegalsari Surabaya',
    fulfillment_type: 'partner_facility',
    service_category: 'child',
    package_type: 'weekly',
    duration_hours: 8,
    days_count: 5,
    scheduled_start: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
    scheduled_end: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    service_address: 'Jl. Basuki Rahmat No. 88, Surabaya',
    district: 'Tegalsari',
    latitude: -7.2678,
    longitude: 112.7423,
    base_price: 600000,
    facility_fee: 120000,
    discount_amount: 36000, // 5% off weekly
    platform_fee: 68400,
    total_amount: 752400,
    escrow_status: 'held',
    order_status: 'confirmed',
    progress_percentage: 0,
    notes: 'Kenzo diantar pukul 07:30 dan dijemput pukul 16:30.',
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    tasks: [
      {
        id: 'tsk00000-0000-0000-0000-000000000004',
        order_id: 'ord00000-0000-0000-0000-000000000002',
        title: 'Check-in & Pemeriksaan Suhu Tubuh',
        description: 'Penyambutan Kenzo di lobi daycare, cek suhu tubuh awal & simpan tas',
        scheduled_time: '07:30 WIB',
        is_required_photo: true,
        is_required_gps: false,
        status: 'pending',
      },
      {
        id: 'tsk00000-0000-0000-0000-000000000005',
        order_id: 'ord00000-0000-0000-0000-000000000002',
        title: 'Aktivitas Sensori & Bermain Bersama',
        description: 'Sesi puzzle dan mewarnai bersama kelompok usia 4 tahun',
        scheduled_time: '10:00 WIB',
        is_required_photo: true,
        is_required_gps: false,
        status: 'pending',
      }
    ]
  },
  {
    id: 'ord00000-0000-0000-0000-000000000003',
    order_number: 'CN-SBY-2026-0903',
    customer_id: 'c1000000-0000-0000-0000-000000000001',
    customer_name: 'Budi Santoso',
    customer_phone: '0812-3456-7890',
    recipient_id: 'rc000000-0000-0000-0000-000000000002',
    recipient_name: 'Kenzo Pratama (4 Th)',
    recipient_type: 'child',
    recipient_details: 'Pendampingan Belajar, Mewarnai & Bermain di Rumah Surabaya',
    fulfillment_type: 'home_visit',
    service_category: 'child',
    package_type: 'daily',
    duration_hours: 4,
    days_count: 1,
    scheduled_start: new Date(Date.now() + 28 * 3600 * 1000).toISOString(),
    scheduled_end: new Date(Date.now() + 32 * 3600 * 1000).toISOString(),
    service_address: 'Perum Rungkut Asri Timur Blok B No. 8, Surabaya',
    district: 'Rungkut',
    latitude: -7.3183,
    longitude: 112.7794,
    base_price: 200000,
    facility_fee: 0,
    discount_amount: 0,
    platform_fee: 20000,
    total_amount: 220000,
    escrow_status: 'pending',
    order_status: 'awaiting_applicants',
    progress_percentage: 0,
    notes: 'Kenzo sangat aktif, mohon ditemani belajar mewarnai, membaca buku cerita, dan tidur siang pk 13:00.',
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    tasks: [
      {
        id: 'tsk00000-0000-0000-0000-000000000006',
        order_id: 'ord00000-0000-0000-0000-000000000003',
        title: 'Mendampingi Sarapan & Minum Susu',
        description: 'Sajikan sereal dan susu hangat, dampingi makan di meja makan',
        scheduled_time: '09:00 WIB',
        is_required_photo: true,
        is_required_gps: true,
        status: 'pending',
      },
      {
        id: 'tsk00000-0000-0000-0000-000000000007',
        order_id: 'ord00000-0000-0000-0000-000000000003',
        title: 'Stimulasi Belajar Mewarnai & Puzzle',
        description: 'Ajak menyelesaikan puzzle 24 keping dan mewarnai buku bergambar hewan',
        scheduled_time: '10:30 WIB',
        is_required_photo: true,
        is_required_gps: true,
        status: 'pending',
      },
      {
        id: 'tsk00000-0000-0000-0000-000000000008',
        order_id: 'ord00000-0000-0000-0000-000000000003',
        title: 'Makan Siang & Menemani Tidur Siang',
        description: 'Beri makan siang sup sayur, rapikan mainan, dan temani tidur siang',
        scheduled_time: '12:30 WIB',
        is_required_photo: true,
        is_required_gps: true,
        status: 'pending',
      }
    ]
  }
];

// Open Job Bids (for Home Visit marketplace matching)
export const INITIAL_BIDS: JobBid[] = [
  {
    id: 'bid00000-0000-0000-0000-000000000001',
    order_id: 'ord00000-0000-0000-0000-000000000001',
    caregiver_id: 'c2000000-0000-0000-0000-000000000001',
    caregiver_name: 'Dinda Ayu, S.Kep',
    caregiver_rating: 4.95,
    caregiver_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    proposed_rate: 50000,
    proposal_note: 'Halo Bapak Budi, saya siap mendampingi Eyang Broto dengan protokol keperawatan lengkap. Lokasi saya di Sukolilo sangat dekat dengan Gubeng.',
    status: 'accepted',
    created_at: new Date(Date.now() - 25 * 3600 * 1000).toISOString(),
    education: 'S1 Ners Keperawatan Univ. Airlangga',
    experience_years: 3,
    verified_skck: true,
    verified_ktp: true,
    badges: ['STR Perawat Aktif', 'SKCK Polda Jatim', 'First Aid Certified'],
    bio: 'Lulusan Ners Keperawatan UNAIR Surabaya. Berpengalaman 3 tahun mendampingi lansia geriatri dan anak.',
  },
  {
    id: 'bid00000-0000-0000-0000-000000000002',
    order_id: 'ord00000-0000-0000-0000-000000000003',
    caregiver_id: 'c2000000-0000-0000-0000-000000000002',
    caregiver_name: 'Sari Wahyuni, S.Pd',
    caregiver_rating: 4.88,
    caregiver_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
    proposed_rate: 45000,
    proposal_note: 'Halo Bapak/Ibu! Saya alumni PG-PAUD UNESA dengan pengalaman 5 tahun di daycare Surabaya. Sangat antusias mendampingi adik Kenzo belajar mewarnai, bermain puzzle, dan memastikan jam makan serta tidur siangnya tepat waktu.',
    status: 'submitted',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    education: 'S1 PG-PAUD Univ. Negeri Surabaya',
    experience_years: 5,
    verified_skck: true,
    verified_ktp: true,
    badges: ['Pendidik PAUD', 'Child Care Spesialis', 'Stimulasi Sensorik', 'SKCK Polda Jatim'],
    bio: 'Eks Pendidik PAUD & Playgroup Surabaya selama 5 tahun. Spesialis mendampingi balita aktif, stimulasi sensori motorik, dan toilet training.',
    phone: '0813-9876-5432',
  },
  {
    id: 'bid00000-0000-0000-0000-000000000003',
    order_id: 'ord00000-0000-0000-0000-000000000003',
    caregiver_id: 'c2000000-0000-0000-0000-000000000001',
    caregiver_name: 'Dinda Ayu, S.Kep',
    caregiver_rating: 4.95,
    caregiver_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    proposed_rate: 50000,
    proposal_note: 'Halo, saya perawat berlisensi STR dengan sertifikat Pediatric First Aid & Life Support. Saya terbiasa menjaga anak balita dengan standar higienis medis, cek suhu tubuh berkala, dan penanganan ramah anak.',
    status: 'submitted',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    education: 'S1 Ners Keperawatan Univ. Airlangga',
    experience_years: 3,
    verified_skck: true,
    verified_ktp: true,
    badges: ['STR Perawat Aktif', 'Pediatric First Aid', 'SKCK Polda Jatim'],
    bio: 'Ners Keperawatan UNAIR berpengalaman pendampingan medis keluarga, anak balita, dan lansia.',
    phone: '0821-5566-7788',
  },
  {
    id: 'bid00000-0000-0000-0000-000000000004',
    order_id: 'ord00000-0000-0000-0000-000000000003',
    caregiver_id: 'c2000000-0000-0000-0000-000000000004',
    caregiver_name: 'Rian Hidayat, A.Md.Fis',
    caregiver_rating: 4.92,
    caregiver_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    proposed_rate: 50000,
    proposal_note: 'Halo Bapak/Ibu, siap mendampingi adik Kenzo dengan aktivitas stimulasi motorik kasar yang aktif, ceria, dan aman. Lokasi saya di Surabaya siap hadir tepat waktu.',
    status: 'submitted',
    created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    education: 'D3 Fisioterapi Poltekkes Kemenkes Surabaya',
    experience_years: 4,
    verified_skck: true,
    verified_ktp: true,
    badges: ['Fisioterapis STR', 'Stimulasi Gerak Aktif', 'SKCK Polda Jatim'],
    bio: 'Tenaga Fisioterapi berlisensi STR Kemenkes dengan fokus stimulasi gerak aktif dan pencegahan cidera.',
    phone: '0857-1122-3344',
  }
];

// Distance calculator helper between two lat/lng coordinates in KM
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

// Local Storage Manager for in-browser state synchronization
const STORAGE_KEY = 'carenest_app_state_v3';

interface AppState {
  currentUserId: string | null;
  profiles: Profile[];
  caregivers: CaregiverProfile[];
  facilities: Facility[];
  recipients: CareRecipient[];
  orders: Order[];
  bids: JobBid[];
  auditLogs: AdminAuditLog[];
}

export function loadAppState(): AppState {
  if (typeof window === 'undefined') {
    return {
      currentUserId: null,
      profiles: INITIAL_PROFILES,
      caregivers: INITIAL_CAREGIVERS,
      facilities: INITIAL_FACILITIES,
      recipients: INITIAL_RECIPIENTS,
      orders: INITIAL_ORDERS,
      bids: INITIAL_BIDS,
      auditLogs: INITIAL_AUDIT_LOGS,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const state: AppState = {
        currentUserId: null, // Default Belum Login (Guest)
        profiles: INITIAL_PROFILES,
        caregivers: INITIAL_CAREGIVERS,
        facilities: INITIAL_FACILITIES,
        recipients: INITIAL_RECIPIENTS,
        orders: INITIAL_ORDERS,
        bids: INITIAL_BIDS,
        auditLogs: INITIAL_AUDIT_LOGS,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return state;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.auditLogs) {
      parsed.auditLogs = INITIAL_AUDIT_LOGS;
    }
    return parsed;
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
    return {
      currentUserId: null,
      profiles: INITIAL_PROFILES,
      caregivers: INITIAL_CAREGIVERS,
      facilities: INITIAL_FACILITIES,
      recipients: INITIAL_RECIPIENTS,
      orders: INITIAL_ORDERS,
      bids: INITIAL_BIDS,
      auditLogs: INITIAL_AUDIT_LOGS,
    };
  }
}

export function saveAppState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('carenest_state_change'));
  } catch (e) {
    console.error('Error saving state to localStorage:', e);
  }
}
