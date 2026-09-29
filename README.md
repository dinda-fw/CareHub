# CareHub Indonesia — Trusted Scheduled Care Platform (Surabaya)
> **PRD Implementation**: Next.js 14 (App Router) + Supabase + Tailwind CSS (Gojek / Shopee Style UX)

CareHub adalah platform marketplace layanan pengasuhan terjadwal untuk **Anak (Child Care & Daycare)**, **Lansia (Elderly Care & Fisioterapi)**, dan **Hewan (Pet Care, Grooming & Pet Hotel)** di Kota Surabaya.

---

## 🌟 Fitur Utama & Ketentuan Layanan

1. **Dual Fulfillment Router**:
   - **Home Visit**: Caregiver terverifikasi KTP & SKCK Polda Jatim datang ke rumah di Surabaya.
   - **Mitra Facility**: Menitipkan penerima asuhan di Daycare resmi, Pet Hotel ber-AC, atau Klinik/Senior Day Center terdekat.
2. **Aturan Wajib H-1 & Minimal Pemesanan 5 Jam**:
   - Form booking secara otomatis memvalidasi waktu mulai minimal 24 jam sebelum pelaksanaan (Lead Time ≥ 24 Jam).
   - **Minimal Durasi Pemesanan adalah 5 Jam** per sesi kedatangan pengasuh (bukan harus 1 hari penuh).
3. **Paket Harga & Promo Durasi**:
   - **Paket Sesi Fleksibel (Minimal 5 Jam)**: Fleksibel tarif reguler per jam.
   - **Paket Mingguan (7 Hari x 5+ Jam)**: Diskon 5% langsung.
   - **Paket Bulanan (30 Hari x 5+ Jam)**: Diskon 15% Super Saver + jaminan caregiver pengganti.
   - **Platform Fee Transparan**: 10% CareHub fee dihitung otomatis.
4. **Custom Care Plan & Dynamic Task Builder**:
   - Customer menentukan daftar checklist tugas khusus (misal: "Cek Tensi & Minum Obat 13:00", "Jalan Santai Teras", "Beri Wet Food & Sisir Bulu").
   - Menghasilkan **Dynamic Progress Bar** (0% ➔ 33% ➔ 67% ➔ 100%) yang ter-update secara real-time.
5. **Pemantauan GPS Wajib & Upload Foto Bukti (Surabaya Area)**:
   - **Strict Guardrail**: Sesuai PRD (BR-04), pengasuh wajib mengaktifkan GPS saat mengerjakan tugas. Jika GPS dimatikan, pengerjaan task dijeda untuk mencegah kabur dan penipuan.
   - Pengasuh mengunggah foto bukti pekerjaan yang langsung dicap dengan **koordinat GPS Surabaya aktual/simulasi akurat, timestamp, dan alamat snapshot**.
6. **Garansi 100% Escrow Protection**:
   - Dana customer ditahan aman di sistem (*held in escrow*).
   - Pembayaran baru dicairkan (*released*) ke dompet pengasuh setelah customer mengonfirmasi hasil pekerjaan selesai.
7. **Pusat Mitra Terdekat di Surabaya**:
   - LittleNest Premium Daycare (Tegalsari / Basuki Rahmat)
   - Paws & Tails Surabaya Pet Hotel & Daycare (Rungkut / MERR)
   - Griya Asih Senior Day Center (Wonokromo / Raya Darmo)
   - HappyPaws Pet Clinic & Boarding (Gubeng / Dharmahusada)
   - Taman Bintang Montessori Daycare (Sukolilo / Manyar)

---

## 👥 Multi-Role & Akun Demo Surabaya

Tersedia **1-Click Role Switcher** di navigasi kanan atas atau halaman `/login`:

| Peran | Nama Akun | Wilayah Surabaya | Fungsi Utama |
|---|---|---|---|
| **Customer** | Budi Santoso | Gubeng, Surabaya | Pesan care H-1, custom care plan, pantau live progress bar, konfirmasi selesai & lepas dana escrow. |
| **Caregiver / Talent** | Dinda Ayu, S.Kep | Sukolilo, Surabaya | Mahasiswa Keperawatan UNAIR, SKCK verified, ambil order, upload foto bukti & GPS, lihat saldo dompet. |
| **Mitra Fasilitas** | LittleNest Daycare | Tegalsari, Surabaya | Kelola kuota/slot anak, check-in/check-out kehadiran, checklist SOP harian. |
| **Admin Platform** | Trust & Safety Team | Surabaya Hub | Audit verifikasi KTP/SKCK, audit trail GPS lokasi pengasuh, monitoring transaksi escrow GMV. |

---

## 🚀 Cara Menjalankan Proyek

### 1. Prasyarat
- Node.js versi 18 atau lebih baru.
- npm atau pnpm.

### 2. Instalasi & Menjalankan Development Server
```bash
# Masuk ke folder proyek
cd carenest

# Instal dependensi (jika belum)
npm install

# Jalankan server Next.js
npm run dev
```

Buka browser di `http://localhost:3000`.

### 3. Build Produksi
```bash
npm run build
npm run start
```

---

## 🗄️ Database Supabase & Dummy Data Surabaya

File SQL skema database dan seed data lengkap telah disediakan:

- **`supabase/schema.sql`**: Struktur tabel PostgreSQL lengkap (`profiles`, `caregiver_profiles`, `facilities`, `care_recipients`, `orders`, `order_tasks`, `task_evidences`, `job_bids`, `reviews`, `audit_logs`).
- **`supabase/seed.sql`**: Data dummy realistis Kota Surabaya (Mitra Daycare Gubeng, Tegalsari, Rungkut, Darmo, Sukolilo, Wiyung; Caregiver UNAIR terverifikasi; active order dengan foto dan koordinat GPS Surabaya).

### Cara Import ke Supabase Pribadi:
1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka menu **SQL Editor**.
3. Salin dan jalankan seluruh isi file `supabase/schema.sql`.
4. Salin dan jalankan seluruh isi file `supabase/seed.sql`.
5. Masukkan URL dan Anon Key proyek Anda ke file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
*(Catatan: Aplikasi ini juga sudah dilengkapi **Local Demo Engine** sehingga langsung dapat dicoba 100% interaktif tanpa konfigurasi Supabase awal!)*

---

## 🧭 Alur Skenario Demo Cepat

1. **Uji Aturan H-1 & Booking**:
   - Buka `/customer/booking`. Coba pilih tanggal hari ini (akan ditolak sistem sesuai PRD). Pilih tanggal besok/lusa.
   - Pilih paket Mingguan (diskon 5%) atau Bulanan (diskon 15%).
   - Susun custom task lalu klik **Konfirmasi & Simpan ke Escrow**.
2. **Uji Layar Pengasuh (Upload Foto + GPS Surabaya)**:
   - Ganti peran ke **Caregiver (Dinda Ayu)** melalui tombol switcher kanan atas.
   - Buka menu **Pengerjaan Task & GPS**.
   - Coba tombol **Simulasi Matikan GPS** ➔ sistem akan langsung menampilkan peringatan merah dan menjeda pelaporan task.
   - Nyalakan GPS kembali ➔ klik **Mulai & Upload** pada task yang belum selesai.
   - Pilih/unggah foto bukti, periksa watermark koordinat Surabaya `-7.2692, 112.7531`, dan simpan.
   - Perhatikan **Progress Bar** yang langsung bertambah hingga 100%!
3. **Uji Konfirmasi Customer & Pencairan Escrow**:
   - Ganti peran kembali ke **Customer (Budi Santoso)**.
   - Buka pesanan aktif. Setelah progress 100%, klik **Konfirmasi Selesai & Lepas Dana**.
   - Dana escrow aman langsung dicairkan ke dompet saldo pengasuh Dinda!
   - Berikan ulasan bintang 5 ⭐.

---
© 2026 CareNest Indonesia. Sesuai PRD v2.0 Proposal.
