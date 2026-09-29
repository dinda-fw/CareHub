'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Baby, Heart, PawPrint, Home, Building2, Calendar, Clock,
  MapPin, ShieldCheck, Sparkles, Plus, Trash2, CheckCircle2,
  AlertTriangle, ArrowRight, ArrowLeft, Camera, Check,
  LocateFixed, Navigation, User, FileText, CheckCircle, Lock, X, ShieldAlert
} from 'lucide-react';
import { useCareNest } from '@/lib/CareNestContext';
import { ServiceCategory, FulfillmentType, PackageType } from '@/lib/types';
import { INDONESIA_CITIES, findClosestCity } from '@/lib/indonesiaCities';
import Link from 'next/link';
import { PaymentModal } from '@/components/PaymentModal';

function BookingWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    currentUser, recipients, facilities, caregivers, createBooking,
    loginAs, isLoggedIn, registerCustomer, loginCustomerDirect
  } = useCareNest();

  // URL query params pre-fill
  const initialCategory = (searchParams.get('category') as ServiceCategory) || 'elderly';
  const initialFacilityId = searchParams.get('facilityId') || '';
  const initialCaregiverId = searchParams.get('caregiverId') || '';
  const initialPackage = (searchParams.get('package') as PackageType) || 'daily';

  // Wizard Steps: 1: Kebutuhan & Penerima, 2: Jadwal & Paket, 3: Custom Care Tasks, 4: Ringkasan & Escrow
  const [currentStep, setCurrentStep] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showJobPublishedModal, setShowJobPublishedModal] = useState(false);
  const [publishedOrderId, setPublishedOrderId] = useState<string | null>(null);
  const [createdOrderInfo, setCreatedOrderInfo] = useState<{ id: string; number: string; amount: number } | null>(null);

  // Form State - Category & Fulfillment
  const [category, setCategory] = useState<ServiceCategory>(initialCategory);
  const [fulfillment, setFulfillment] = useState<FulfillmentType>(initialFacilityId ? 'partner_facility' : 'home_visit');

  // CUSTOM RECIPIENT DATA (Customer fills their own data)
  const defaultRecipientPresets: Record<ServiceCategory, { name: string; age: string; genderOrBreed: string; needs: string; criteria: string }> = {
    elderly: {
      name: 'Ibu Ratna Hendrawan',
      age: '71 Tahun',
      genderOrBreed: 'Perempuan',
      needs: 'Pendampingan jalan santai di teras (menggunakan tongkat), pemantauan jadwal minum obat tensi pukul 13:00 WIB, dan ukur tensi darah siang.',
      criteria: 'Diutamakan Ners / perawat lulusan D3/S1 Keperawatan, sabar, telaten, ramah lansia, dan tidak merokok.',
    },
    child: {
      name: 'Adik Alvaro Putra',
      age: '3.5 Tahun',
      genderOrBreed: 'Laki-laki',
      needs: 'Pendampingan stimulasi bermain edukatif (puzzle/mewarnai), jadwal makan siang & minum susu tepat waktu, tidur siang pukul 12:30 WIB.',
      criteria: 'Pernah mengajar PAUD / telaten menangani balita aktif, ceria, memiliki sertifikat First Aid anak.',
    },
    pet: {
      name: 'Milo ',
      age: '2 Tahun',
      genderOrBreed: 'Anjing Golden Retriever',
      needs: 'Pemberian pakan kering premium 250gr + air mineral bersih, jalan santai keliling komplek 20 menit dengan tali kekang, sisir bulu halus.',
      criteria: 'Pecinta anjing ras besar, memahami handling anjing aktif, tidak takut anjing, mahasiswa/alumni Kedokteran Hewan diutamakan.',
    },
  };

  const [recipientName, setRecipientName] = useState<string>(defaultRecipientPresets[initialCategory].name);
  const [recipientAge, setRecipientAge] = useState<string>(defaultRecipientPresets[initialCategory].age);
  const [recipientGenderOrBreed, setRecipientGenderOrBreed] = useState<string>(defaultRecipientPresets[initialCategory].genderOrBreed);
  const [recipientNeeds, setRecipientNeeds] = useState<string>(defaultRecipientPresets[initialCategory].needs);
  const [caregiverCriteria, setCaregiverCriteria] = useState<string>(defaultRecipientPresets[initialCategory].criteria);

  // LOCATION & GPS STATE (All Indonesian Cities + Real-Time Device GPS)
  const [city, setCity] = useState<string>('Kota Surabaya');
  const [district, setDistrict] = useState<string>(currentUser?.district || 'Kecamatan Wonocolo');
  const [address, setAddress] = useState<string>(currentUser?.address || 'Jl. Raya sidosermo No. 45');
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(
    currentUser?.latitude && currentUser?.longitude
      ? { lat: currentUser.latitude, lng: currentUser.longitude, accuracy: 10 }
      : { lat: -7.2575, lng: 112.7521, accuracy: 12 }
  );
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  // Auto-sync address if user logs in later
  useEffect(() => {
    if (currentUser?.district) setDistrict(currentUser.district);
    if (currentUser?.address) setAddress(currentUser.address);
    if (currentUser?.latitude && currentUser?.longitude) {
      setGpsCoords({ lat: currentUser.latitude, lng: currentUser.longitude, accuracy: 10 });
    }
  }, [currentUser]);

  // Real-Time GPS Detection function
  const handleDetectGps = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      alert('Fitur Geolocation tidak didukung di browser ini.');
      return;
    }

    setIsDetectingGps(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(5));
        const lng = Number(position.coords.longitude.toFixed(5));
        const accuracy = Math.round(position.coords.accuracy);

        setGpsCoords({ lat, lng, accuracy });

        // Match closest city across Indonesia
        const closest = findClosestCity(lat, lng);
        if (closest && closest.distanceKm < 80) {
          setCity(closest.city.name);
          setGpsMessage(
            `GPS Berhasil Terkunci: Koordinat (${lat}, ${lng}) dengan akurasi ±${accuracy}m. Terdekat dengan ${closest.city.name} (${closest.distanceKm} km).`
          );
        } else {
          setGpsMessage(
            `GPS Berhasil Terkunci: Koordinat (${lat}, ${lng}) dengan akurasi ±${accuracy}m.`
          );
        }
        setIsDetectingGps(false);
      },
      (error) => {
        setIsDetectingGps(false);
        setGpsMessage(
          `GPS tidak dapat diakses otomatis (${error.message}). Anda tetap dapat memilih kota dan menuliskan alamat secara mandiri.`
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Schedule (H-1 minimum rule & Min 5 Hours)
  const defaultDate = new Date(Date.now() + 26 * 3600 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState<string>(defaultDate);
  const [startTime, setStartTime] = useState<string>('08:30');
  const [durationHours, setDurationHours] = useState<number>(5);
  const [packageType, setPackageType] = useState<PackageType>(initialPackage);

  // Selected Mitra or Caregiver
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(initialFacilityId);
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string>(initialCaregiverId);

  // Custom Tasks List
  const defaultTaskTemplates: Record<ServiceCategory, { title: string; desc: string; time: string }[]> = {
    elderly: [
      { title: 'Pendampingan Jalan Pagi & Peregangan', desc: 'Dampingi jalan di teras 15 menit dengan tongkat', time: '09:00 WIB' },
      { title: 'Sajikan Makan Siang Sehat & Cek Tensi', desc: 'Sup hangat rendah garam dan ukur tensi darah', time: '11:30 WIB' },
      { title: 'Pemberian Obat Rutin & Istirahat Siang', desc: 'Pastikan obat tensi diminum tepat waktu', time: '13:00 WIB' },
    ],
    child: [
      { title: 'Penyambutan & Sarapan Bergizi', desc: 'Sarapan susu dan sereal sehat bersama anak', time: '08:30 WIB' },
      { title: 'Aktivitas Belajar & Stimulasi Kreatif', desc: 'Bermain puzzle atau mewarnai buku gambar', time: '10:00 WIB' },
      { title: 'Makan Siang & Waktu Tidur Siang', desc: 'Tidur siang 1-2 jam di ruangan yang hening', time: '12:30 WIB' },
    ],
    pet: [
      { title: 'Pemberian Pakan Basah & Air Segar', desc: 'Wet food 1 kaleng dan ganti mangkok air minum', time: '09:00 WIB' },
      { title: 'Jalan Santai / Dog Walking di Taman', desc: 'Jalan santai 15-20 menit dengan tali kekang', time: '10:30 WIB' },
      { title: 'Sisir Bulu & Bersihkan Litter Box', desc: 'Pastikan kotak pasir bersih dan bulu disisir rapi', time: '13:00 WIB' },
    ]
  };

  const [tasks, setTasks] = useState<{ title: string; description: string; scheduled_time: string; is_required_photo: boolean }[]>(
    defaultTaskTemplates[category].map(t => ({
      title: t.title,
      description: t.desc,
      scheduled_time: t.time,
      is_required_photo: true,
    }))
  );

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('14:00 WIB');
  const [h1Error, setH1Error] = useState<string | null>(null);
  const [step1Error, setStep1Error] = useState<string | null>(null);

  // Handle category change -> update presets
  const handleCategoryChange = (newCat: ServiceCategory) => {
    setCategory(newCat);
    setRecipientName(defaultRecipientPresets[newCat].name);
    setRecipientAge(defaultRecipientPresets[newCat].age);
    setRecipientGenderOrBreed(defaultRecipientPresets[newCat].genderOrBreed);
    setRecipientNeeds(defaultRecipientPresets[newCat].needs);
    setCaregiverCriteria(defaultRecipientPresets[newCat].criteria);
    setTasks(
      defaultTaskTemplates[newCat].map(t => ({
        title: t.title,
        description: t.desc,
        scheduled_time: t.time,
        is_required_photo: true,
      }))
    );
  };

  // Add custom task
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks([
      ...tasks,
      {
        title: newTaskTitle.trim(),
        description: newTaskDesc.trim() || 'Tugas khusus sesuai instruksi keluarga',
        scheduled_time: newTaskTime,
        is_required_photo: true,
      }
    ]);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  // Remove task
  const handleRemoveTask = (idx: number) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  // Calculation of pricing
  let daysCount = 1;
  let discountRate = 0;
  if (packageType === 'weekly') {
    daysCount = 7;
    discountRate = 0.05; // 5% discount
  } else if (packageType === 'monthly') {
    daysCount = 30;
    discountRate = 0.15; // 15% discount
  }

  // Base rate calculation
  let ratePerHour = 50000;
  if (fulfillment === 'partner_facility' && selectedFacilityId) {
    const fac = facilities.find(f => f.id === selectedFacilityId);
    if (fac) ratePerHour = fac.hourly_rate;
  } else if (selectedCaregiverId) {
    const cg = caregivers.find(c => c.id === selectedCaregiverId || c.user_id === selectedCaregiverId);
    if (cg) ratePerHour = cg.hourly_rate;
  }

  const baseSubtotal = ratePerHour * durationHours * daysCount;
  const isFacility = fulfillment === 'partner_facility';
  // Biaya tambahan tempat fasilitas: 20% jika memilih mitra fasilitas, jika di rumah lebih murah (Rp 0)
  const facilityFee = isFacility ? Math.round(baseSubtotal * 0.20) : 0;
  const subtotalBeforeDiscount = baseSubtotal + facilityFee;

  const discountAmount = Math.round(subtotalBeforeDiscount * discountRate);
  const priceAfterDiscount = subtotalBeforeDiscount - discountAmount;
  // Biaya admin MVP / penggunaan jasa platform: 10%
  const platformFee = Math.round(priceAfterDiscount * 0.10);
  const totalAmount = priceAfterDiscount + platformFee;

  // Validate H-1 lead time before proceeding
  const validateH1 = (): boolean => {
    const selectedDatetime = new Date(`${startDate}T${startTime}:00`).getTime();
    const now = Date.now();
    const hoursLeadTime = (selectedDatetime - now) / (1000 * 3600);

    if (hoursLeadTime < 23.5) {
      setH1Error(
        'PERINGATAN ATURAN (BR-01): Booking wajib dibuat minimal H-1 (24 jam sebelum jadwal mulai). Mohon pilih tanggal/jam yang lebih lama agar pengasuh & care plan dapat dipersiapkan dengan aman.'
      );
      return false;
    }

    if (durationHours < 5) {
      setH1Error(
        'Ketentuan CareHub: Minimal durasi pemesanan adalah 5 jam (bukan per jam singkat atau 1 hari penuh) demi kualitas pendampingan optimal.'
      );
      return false;
    }
    setH1Error(null);
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!recipientName.trim()) {
        setStep1Error('Mohon masukkan nama penerima asuhan yang akan didampingi.');
        return;
      }
      if (!recipientNeeds.trim()) {
        setStep1Error('Mohon jelaskan kebutuhan atau kondisi penerima asuhan.');
        return;
      }
      if (!address.trim()) {
        setStep1Error('Mohon isi alamat lengkap layanan tempat pengasuh akan hadir.');
        return;
      }
      setStep1Error(null);
    }

    if (currentStep === 2) {
      if (!validateH1()) return;
    }
    setCurrentStep(prev => prev + 1);
  };

  // ANTI-ORDERAN FIKTIF SECURITY STATE
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [authIdentifier, setAuthIdentifier] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authFullName, setAuthFullName] = useState<string>('');
  const [authPhone, setAuthPhone] = useState<string>('');
  const [authNikKtp, setAuthNikKtp] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authLegalAgreed, setAuthLegalAgreed] = useState<boolean>(false);
  const [authModalError, setAuthModalError] = useState<string | null>(null);

  const handleAuthModalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authIdentifier.trim()) {
      setAuthModalError('Mohon isi Email atau Nomor WhatsApp terdaftar Anda.');
      return;
    }
    const res = loginCustomerDirect(authIdentifier);
    if (res.success) {
      setShowAuthModal(false);
      setAuthModalError(null);
    } else {
      setAuthModalError(res.error || 'Gagal masuk akun.');
    }
  };

  const handle1ClickCustomerDemo = () => {
    loginAs('customer');
    setShowAuthModal(false);
    setAuthModalError(null);
  };

  const handleAuthModalRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authFullName.trim()) {
      setAuthModalError('Mohon isi Nama Lengkap sesuai KTP.');
      return;
    }
    if (!authPhone.trim() || authPhone.replace(/[^0-9]/g, '').length < 9) {
      setAuthModalError('Mohon isi Nomor WhatsApp / Handphone aktif yang valid (min 9 digit).');
      return;
    }
    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthModalError('Mohon masukkan alamat email yang valid.');
      return;
    }
    if (!authNikKtp.trim() || authNikKtp.replace(/[^0-9]/g, '').length !== 16) {
      setAuthModalError('NIK KTP wajib 16 digit angka resmi kependudukan (Dukcapil).');
      return;
    }
    if (!authLegalAgreed) {
      setAuthModalError('Anda wajib mencentang persetujuan pertanggungjawaban hukum anti-orderan fiktif.');
      return;
    }

    const res = registerCustomer({
      fullName: authFullName,
      email: authEmail,
      phone: authPhone,
      nikKtp: authNikKtp,
      city: city,
      district: district,
      address: address,
      password: authPassword,
    });

    if (res.success) {
      setShowAuthModal(false);
      setAuthModalError(null);
    } else {
      setAuthModalError(res.error || 'Gagal mendaftar akun customer.');
    }
  };

  // Submit Booking (Strict Anti-Fraud Verification)
  const handleConfirmOrder = () => {
    if (!validateH1()) return;

    // WAJIB LOGIN / DAFTAR: Tolak jika belum login sebagai customer terverifikasi!
    if (!isLoggedIn || currentUser?.role !== 'customer') {
      setShowAuthModal(true);
      return;
    }

    const scheduledStartISO = new Date(`${startDate}T${startTime}:00`).toISOString();
    const scheduledEndISO = new Date(new Date(`${startDate}T${startTime}:00`).getTime() + durationHours * 3600 * 1000).toISOString();

    const result = createBooking({
      customRecipient: {
        name: recipientName.trim() || 'Penerima Asuhan',
        age_or_details: recipientAge.trim() || 'Sesuai data',
        gender_or_breed: recipientGenderOrBreed.trim() || '-',
        special_needs: recipientNeeds.trim() || 'Pendampingan sesuai care plan keluarga',
        caregiver_criteria: caregiverCriteria.trim() || undefined,
      },
      caregiverCriteria: caregiverCriteria.trim() || undefined,
      fulfillmentType: fulfillment,
      serviceCategory: category,
      packageType: packageType,
      durationHours: durationHours,
      daysCount: daysCount,
      scheduledStart: scheduledStartISO,
      scheduledEnd: scheduledEndISO,
      serviceAddress: address,
      city: city,
      district: district,
      latitude: gpsCoords?.lat,
      longitude: gpsCoords?.lng,
      notes: `Care plan ${city} (${district}) untuk ${recipientName}. Kriteria talent: ${caregiverCriteria}`,
      tasks: tasks,
      facilityId: fulfillment === 'partner_facility' ? selectedFacilityId : undefined,
      selectedCaregiverId: fulfillment === 'home_visit' ? selectedCaregiverId : undefined,
    });

    if (result.success && result.orderId) {
      const orderNum = `CN-SBY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setCreatedOrderInfo({
        id: result.orderId,
        number: orderNum,
        amount: totalAmount,
      });

      // Jika open job home visit (belum pilih pengasuh spesifik), arahkan ke seleksi pelamar HRD terlebih dahulu!
      if (fulfillment === 'home_visit' && !selectedCaregiverId) {
        setPublishedOrderId(result.orderId);
        setShowJobPublishedModal(true);
      } else {
        // Jika pre-selected fasilitas mitra atau langsung pengasuh tertentu
        setShowPaymentModal(true);
      }
    } else {
      alert(result.error || 'Gagal memproses pesanan.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header Wizard */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Wizard Pemesanan CareHub Terjadwal (H-1 • Min. 5 Jam)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Buat Care Request & Custom Care Plan
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
          Tentukan profil penerima asuhan, kriteria pengasuh yang dicari, dan titik lokasi GPS akurat di seluruh Indonesia.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        {[
          { num: 1, label: 'Kebutuhan & Lokasi' },
          { num: 2, label: 'Jadwal & Paket' },
          { num: 3, label: 'Custom Tasks' },
          { num: 4, label: 'Rancangan & Publikasi' },
        ].map(step => (
          <div key={step.num} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all ${currentStep === step.num ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : currentStep > step.num ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}
            >
              {currentStep > step.num ? <Check className="w-4 h-4" /> : step.num}
            </div>
            <span className={`text-[11px] font-semibold ${currentStep === step.num ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1: KEBUTUHAN, DATA PENERIMA ASUHAN (CUSTOMER ISI SENDIRI) & LOKASI GPS SELURUH INDONESIA */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 animate-in fade-in">

          {step1Error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{step1Error}</span>
            </div>
          )}

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">1. Pilih Kategori & Jalur Layanan</h2>
            <p className="text-xs text-gray-500">Tentukan kategori penerima asuhan dan model kedatangan pengasuh:</p>
          </div>

          {/* Category Tabs */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'elderly', title: 'Lansia', desc: 'Perawat Geriatri & Fisioterapi', icon: Heart, color: 'text-teal-600 bg-teal-50 border-teal-200' },
              { id: 'child', title: 'Anak', desc: 'Daycare & Pendidik Balita', icon: Baby, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
              { id: 'pet', title: 'Hewan', desc: 'Pet Sitter & Medis Hewan', icon: PawPrint, color: 'text-amber-600 bg-amber-50 border-amber-200' },
            ].map(item => {
              const Icon = item.icon;
              const isSelected = category === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleCategoryChange(item.id as ServiceCategory)}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${isSelected ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/40 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm text-gray-900">{item.title}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">{item.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Fulfillment mode: Home Visit vs Partner Facility */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-700">Pilih Tempat / Lokasi Layanan:</h3>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Pilih di Rumah Lebih Hemat
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillment('home_visit')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all relative ${fulfillment === 'home_visit' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/50 shadow-xs' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <h4 className="font-bold text-sm text-gray-900">Home Visit (Di Rumah)</h4>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-emerald-600 text-white rounded-full">
                      LEBIH MURAH (HEMAT)
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Pengasuh terverifikasi hadir langsung ke rumah Anda. Tarif lebih terjangkau tanpa biaya operasional gedung fasilitas (Hemat 20%).
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillment('partner_facility')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all relative ${fulfillment === 'partner_facility' ? 'ring-2 ring-purple-500 border-purple-500 bg-purple-50/40 shadow-xs' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <h4 className="font-bold text-sm text-gray-900">Tempat Fasilitas Mitra</h4>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-purple-600 text-white rounded-full">
                      +20% BIAYA FASILITAS
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Penerima asuhan dititipkan di daycare/klinik berizin resmi. Dikenakan biaya tambahan 20% untuk sarana prasarana, ruang AC & utilitas.
                  </p>
                </div>
              </button>
            </div>

            {/* Kebijakan Harga Banner */}
            <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-purple-50 border border-emerald-200/80 text-[11px] text-gray-700 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-emerald-950 block">Kebijakan Pemilihan Lokasi & Biaya:</span>
                <p className="text-gray-600 leading-relaxed">
                  Layanan <strong>di rumah lebih murah</strong> karena tanpa biaya sewa tempat (bebas surcharge 0%). Pemilihan <strong>Tempat Fasilitas</strong> dikenakan biaya tambahan <strong>20%</strong> untuk operasional & utilitas sarana mitra, serta <strong>Biaya Admin MVP 10%</strong> untuk proteksi garansi Escrow 100%.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION: DATA PENERIMA ASUHAN (CUSTOMER ISI SENDIRI) */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Informasi Lengkap Penerima Asuhan</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tuliskan data anggota keluarga / hewan yang diasuh agar pengasuh memahami kondisinya.
                </p>
              </div>

              {/* Saved Profiles Quick Fill Shortcuts */}
              {recipients.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-gray-400">Contoh Cepat:</span>
                  {recipients.filter(r => r.type === category).map(rec => (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => {
                        setRecipientName(rec.name);
                        setRecipientAge(rec.age_or_details);
                        setRecipientGenderOrBreed(rec.gender_or_breed);
                        setRecipientNeeds(rec.special_needs);
                        setStep1Error(null);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-800 transition-colors border border-gray-200"
                    >
                      {rec.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Form Fields: Name, Age, Gender/Breed */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama yang Diasuh: *
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => { setRecipientName(e.target.value); setStep1Error(null); }}
                  placeholder={category === 'elderly' ? 'Contoh: Ibu Ratna Hendrawan' : category === 'child' ? 'Contoh: Alvaro Putra' : 'Contoh: Milo the Dog'}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Usia / Umur: *
                </label>
                <input
                  type="text"
                  value={recipientAge}
                  onChange={(e) => { setRecipientAge(e.target.value); setStep1Error(null); }}
                  placeholder={category === 'elderly' ? 'Contoh: 71 Tahun' : category === 'child' ? 'Contoh: 3.5 Tahun' : 'Contoh: 2 Tahun'}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {category === 'pet' ? 'Ras / Jenis Hewan:' : 'Jenis Kelamin:'}
                </label>
                <input
                  type="text"
                  value={recipientGenderOrBreed}
                  onChange={(e) => setRecipientGenderOrBreed(e.target.value)}
                  placeholder={category === 'pet' ? 'Contoh: Golden Retriever / Kucing Persia' : 'Contoh: Perempuan / Laki-laki'}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            {/* Special Needs & Health Instructions */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Kebutuhan Khusus / Kondisi Kesehatan / Rutinitas: *
              </label>
              <textarea
                rows={2}
                value={recipientNeeds}
                onChange={(e) => { setRecipientNeeds(e.target.value); setStep1Error(null); }}
                placeholder={
                  category === 'elderly'
                    ? 'Tuliskan kebutuhan lansia: misal pasca stroke, jalan harus dibantu tongkat, kontrol jadwal obat tensi pukul 13:00, diet rendah garam...'
                    : category === 'child'
                      ? 'Tuliskan kebutuhan anak: misal alergi susu sapi, waktu tidur siang pukul 12:30, kebiasaan sebelum tidur, mainan yang disukai...'
                      : 'Tuliskan kebutuhan hewan: porsi pakan wet food, jadwal dog walking dengan leash di taman, obat/vitamin yang harus diberikan...'
                }
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white leading-relaxed"
              />
            </div>

            {/* Caregiver Criteria Requested */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                <span>Kriteria Pengasuh / Talent yang Dicari:</span>
                <span className="text-[10px] text-emerald-700 font-normal">Akan dicantumkan pada bursa lowongan kerja</span>
              </label>
              <textarea
                rows={2}
                value={caregiverCriteria}
                onChange={(e) => setCaregiverCriteria(e.target.value)}
                placeholder="Contoh: Diutamakan lulusan Ners Keperawatan / PG-PAUD, sabar, tidak merokok, komunikatif, berpengalaman menangani lansia/balita..."
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white leading-relaxed"
              />
            </div>
          </div>

          {/* SECTION: LOKASI & GPS SELURUH INDONESIA */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Titik GPS & Alamat Layanan (Seluruh Indonesia)</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Deteksi titik koordinat otomatis dengan GPS perangkat atau pilih kota dan isi alamat lengkap secara mandiri.
                </p>
              </div>

              {/* Real-Time GPS Detection Button */}
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer disabled:opacity-50"
              >
                <LocateFixed className={`w-4 h-4 ${isDetectingGps ? 'animate-spin' : ''}`} />
                <span>{isDetectingGps ? 'Mendeteksi GPS...' : '📍 Deteksi Lokasi Saya via GPS'}</span>
              </button>
            </div>

            {/* GPS Feedback Banner */}
            {gpsMessage && (
              <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${gpsCoords ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-amber-50 text-amber-900 border-amber-200'}`}>
                <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="leading-snug">{gpsMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* City Selection from Entire Indonesia */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Pilih Kota / Kabupaten di Indonesia:
                </label>
                <select
                  value={city}
                  onChange={(e) => {
                    const selected = INDONESIA_CITIES.find(c => c.name === e.target.value);
                    setCity(e.target.value);
                    if (selected) {
                      setGpsCoords({ lat: selected.lat, lng: selected.lng, accuracy: 50 });
                    }
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                >
                  <optgroup label="⭐ Kota-Kota Populer">
                    {INDONESIA_CITIES.filter(c => c.popular).map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.province})</option>
                    ))}
                  </optgroup>
                  <optgroup label="🇮🇩 Seluruh Kota / Kabupaten Lainnya">
                    {INDONESIA_CITIES.filter(c => !c.popular).map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.province})</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* District / Area (Free Customer Input) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Kecamatan / Wilayah:
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Ketik kecamatan (contoh: Sukolilo, Gubeng, Menteng, Kebayoran, Dago...)"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            {/* Complete Address & Landmarks */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Alamat Lengkap & Patokan Rumah: *
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => { setAddress(e.target.value); setStep1Error(null); }}
                placeholder="Nama jalan, nomor rumah, RT/RW, lantai/unit, dan patokan (misal: seberang masjid, rumah pagar hitam dekat pos satpam)..."
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              />
            </div>

            {/* GPS Coordinate Display Badge */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between text-[11px] text-gray-600 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-semibold text-gray-800">Koordinat GPS Terkunci:</span>
                <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {gpsCoords ? `${gpsCoords.lat.toFixed(5)}, ${gpsCoords.lng.toFixed(5)}` : '-7.25750, 112.75210'}
                </span>
                {gpsCoords?.accuracy && (
                  <span className="text-gray-400 font-mono">
                    (±{gpsCoords.accuracy}m)
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-500">
                🔒 Koordinat ini akan divalidasi dengan GPS talent saat kedatangan di lokasi.
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5 transition-all"
            >
              <span>Lanjut ke Jadwal & Paket</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: JADWAL (H-1 STRICT) & PAKET HARGA HEMAT */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">2. Atur Jadwal & Pilih Paket Hemat</h2>
            <p className="text-xs text-gray-500">
              Patuhi aturan PRD: Jadwal booking minimal 24 jam sebelum waktu mulai (H-1) untuk persiapan pengasuh.
            </p>
          </div>

          {/* H-1 Warning Banner */}
          {h1Error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>{h1Error}</div>
            </div>
          )}

          {/* Date & Time Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Tanggal Mulai (Min H-1):
              </label>
              <input
                type="date"
                value={startDate}
                min={new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0]}
                onChange={(e) => { setStartDate(e.target.value); setH1Error(null); }}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-emerald-700 mt-1 block">✓ Memenuhi syarat H-1</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Jam Mulai:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => { setStartTime(e.target.value); setH1Error(null); }}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">Durasi per Hari: *</label>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Minimal 5 Jam
                </span>
              </div>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Math.max(5, Number(e.target.value)))}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value={5}>5 Jam (Minimal Pemesanan CareHub)</option>
                <option value={6}>6 Jam (Standar Sesi)</option>
                <option value={7}>7 Jam</option>
                <option value={8}>8 Jam (Full Day Care)</option>
                <option value={10}>10 Jam (Layanan Penuh)</option>
                <option value={12}>12 Jam (Setengah Hari Penuh)</option>
              </select>
            </div>
          </div>

          {/* Paket Pilihan Durasi (Gojek / Shopee Style) */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700 mb-2">Pilih Paket Durasi Hemat:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <button
                type="button"
                onClick={() => setPackageType('daily')}
                className={`p-4 rounded-2xl border text-left transition-all ${packageType === 'daily' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-gray-800">Paket Sesi Fleksibel</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">Min. 5 Jam</span>
                </div>
                <p className="text-[11px] text-gray-500">Pemesanan fleksibel dengan durasi minimal 5 jam per sesi kedatangan.</p>
                <p className="text-xs font-bold text-emerald-700 mt-2">Tarif Reguler</p>
              </button>

              <button
                type="button"
                onClick={() => setPackageType('weekly')}
                className={`p-4 rounded-2xl border text-left transition-all relative ${packageType === 'weekly' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 text-[9px] font-extrabold bg-emerald-600 text-white rounded-full">
                  HEMAT 5%
                </span>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-emerald-950">Paket Mingguan</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">7 Hari</span>
                </div>
                <p className="text-[11px] text-gray-500">Hemat 5% dari total biaya reguler.</p>
                <p className="text-xs font-bold text-emerald-700 mt-2">Diskon 5% Langsung</p>
              </button>

              <button
                type="button"
                onClick={() => setPackageType('monthly')}
                className={`p-4 rounded-2xl border text-left transition-all relative ${packageType === 'monthly' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 text-[9px] font-extrabold bg-amber-500 text-gray-950 rounded-full">
                  HEMAT 15%
                </span>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-amber-950">Paket Bulanan</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">30 Hari</span>
                </div>
                <p className="text-[11px] text-gray-500">Prioritas pengasuh tetap & repeat contract.</p>
                <p className="text-xs font-bold text-amber-700 mt-2">Diskon 15% Super Saver</p>
              </button>

            </div>
          </div>

          {/* Conditional Selection: If Mitra Facility, choose facility */}
          {fulfillment === 'partner_facility' && (
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Pilih Mitra Fasilitas Terdekat:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {facilities.map(fac => (
                  <div
                    key={fac.id}
                    onClick={() => setSelectedFacilityId(fac.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${selectedFacilityId === fac.id ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <img src={fac.photos[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-gray-900 truncate">{fac.name}</h4>
                      <p className="text-[11px] text-gray-500">{fac.district} • Rp {fac.daily_rate.toLocaleString('id-ID')}/hari</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">Sisa {fac.slots_available} slot</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conditional Selection: If Home Visit, choose talent or open job */}
          {fulfillment === 'home_visit' && (
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Pilih Pengasuh (Opsional):</h3>
              <p className="text-xs text-gray-500">Pilih langsung talent favorit atau biarkan caregiver lain melamar di bursa lowongan kerja:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setSelectedCaregiverId('')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${!selectedCaregiverId ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <h4 className="font-bold text-xs text-gray-900">Buka ke Bursa Lowongan Kerja (Open Bidding)</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Caregiver terverifikasi akan mengirimkan penawaran sesuai kriteria Anda untuk Anda pilih.</p>
                </div>

                {caregivers.slice(0, 3).map(cg => (
                  <div
                    key={cg.id}
                    onClick={() => setSelectedCaregiverId(cg.user_id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${selectedCaregiverId === cg.user_id ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <img src={cg.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">{cg.name}</h4>
                      <p className="text-[11px] text-gray-500">{cg.education} • {cg.rating}⭐</p>
                      <p className="text-[10px] text-emerald-700 font-bold">Rp {cg.hourly_rate.toLocaleString('id-ID')}/jam</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Price Estimation Preview */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white border border-emerald-200 text-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Estimasi Biaya Sementara (Live Preview):</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {packageType === 'weekly' ? 'Paket Mingguan (Diskon 5%)' : packageType === 'monthly' ? 'Paket Bulanan (Diskon 15%)' : 'Paket Harian (Reguler)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
              <div className="flex justify-between items-center bg-white/80 p-2.5 rounded-xl border border-emerald-100/70">
                <span className="text-gray-600">Tarif Dasar ({durationHours} jam × {daysCount} hari):</span>
                <span className="font-semibold text-gray-900">Rp {baseSubtotal.toLocaleString('id-ID')}</span>
              </div>

              <div className={`flex justify-between items-center p-2.5 rounded-xl border ${fulfillment === 'home_visit' ? 'bg-emerald-100/50 border-emerald-200 text-emerald-950' : 'bg-purple-50 border-purple-200 text-purple-950'}`}>
                <div>
                  <span className="font-medium">{fulfillment === 'home_visit' ? 'Di Rumah (Home Visit):' : 'Tempat Fasilitas Mitra:'}</span>
                  <span className="text-[10px] text-gray-500 block">{fulfillment === 'home_visit' ? 'Lebih Murah (Bebas Biaya)' : 'Biaya Sarana & Operasional'}</span>
                </div>
                <span className="font-bold">
                  {fulfillment === 'home_visit' ? 'Rp 0 (Hemat)' : `+ Rp ${facilityFee.toLocaleString('id-ID')} (+20%)`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-gray-600 pt-1 text-[11px] px-1">
              <span>Biaya Admin MVP / Penggunaan Jasa Platform (10%):</span>
              <span className="font-semibold text-gray-900">+ Rp {platformFee.toLocaleString('id-ID')}</span>
            </div>

            <div className="pt-2 border-t border-emerald-200 flex justify-between items-center text-sm font-bold text-emerald-950 px-1">
              <span>Estimasi Total Rancangan:</span>
              <span className="text-base text-emerald-700 font-extrabold">Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Nav buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              ← Kembali
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5"
            >
              <span>Lanjut ke Custom Tasks</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CUSTOM CARE TASKS & DYNAMIC PLAN BUILDER */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">3. Susun Custom Care Plan & Task Checklist</h2>
            <p className="text-xs text-gray-500">
              Setiap tugas akan dipantau saat pelaksanaan dengan bukti foto dan pencatatan lokasi GPS di {city}.
            </p>
          </div>

          {/* Reference Card: Recipient & Desired Criteria */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                <span>Penerima: {recipientName} ({recipientAge})</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                {category === 'elderly' ? 'Lansia' : category === 'child' ? 'Anak' : 'Hewan'}
              </span>
            </div>
            <p className="text-gray-700"><strong>Kebutuhan:</strong> {recipientNeeds}</p>
            {caregiverCriteria && (
              <p className="text-gray-700"><strong>Kriteria Talent:</strong> {caregiverCriteria}</p>
            )}
          </div>

          {/* Existing Tasks List */}
          <div className="space-y-2.5">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs text-gray-900">{task.title}</span>
                      <span className="px-2 py-0.2 text-[10px] font-medium bg-gray-200 text-gray-700 rounded-full">
                        {task.scheduled_time}
                      </span>
                      {task.is_required_photo && (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded flex items-center gap-0.5">
                          <Camera className="w-2.5 h-2.5" /> Wajib Foto + GPS
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">{task.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveTask(idx)}
                  className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                  title="Hapus tugas"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Custom Task Builder */}
          <div className="p-4 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/30 space-y-3">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Tambah Tugas Tambahan / Instruksi Khusus:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Judul tugas (contoh: Berikan obat tensi pukul 14:00)..."
                className="sm:col-span-2 text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <input
                type="text"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                placeholder="14:00 WIB"
                className="text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
            <input
              type="text"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              placeholder="Detail instruksi pengerjaan (contoh: 1 tablet setelah makan, pastikan diminum bersama air hangat)..."
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
            <button
              type="button"
              onClick={handleAddTask}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Masukkan ke Care Plan</span>
            </button>
          </div>

          {/* Nav buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              ← Kembali
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5"
            >
              <span>Lanjut ke Ringkasan Biaya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RINGKASAN BIAYA & SIMULASI ESCROW */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">4. Rancangan Biaya (Nomine) & Publikasi Lowongan</h2>
            <p className="text-xs text-gray-500">
              Periksa estimasi rancangan biaya yang akan dibayar. Lowongan akan dipublikasikan ke bursa caregiver, Anda menyeleksi pelamar seperti HRD, dan pembayaran baru dilakukan (di-hold ke Escrow) setelah Anda deal dengan pengasuh pilihan.
            </p>
          </div>

          {/* Order Snapshot Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Penerima & Lokasi Asuhan</span>
              <p className="font-bold text-sm text-gray-900">
                {recipientName} ({recipientAge}) • {category === 'elderly' ? '👵 Lansia' : category === 'child' ? '👶 Anak' : '🐾 Hewan'}
              </p>
              <p className="text-gray-600">Model: <span className="font-semibold text-gray-800">{fulfillment === 'home_visit' ? 'Home Visit (Rumah)' : 'Mitra Fasilitas'}</span></p>
              <p className="text-gray-600">Paket: <span className="font-semibold text-gray-800 uppercase">{packageType} ({daysCount} Hari x {durationHours} Jam)</span></p>
              <p className="text-gray-600">Jadwal: <span className="font-semibold text-emerald-800">{startDate} pk {startTime} WIB</span></p>
              <p className="text-gray-600">Lokasi: <span className="font-semibold text-gray-800">{district}, {city}</span></p>
              <p className="text-gray-600 line-clamp-1">Alamat: <span className="font-semibold text-gray-800">{address}</span></p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Care Plan & Proteksi</span>
              <p className="font-bold text-sm text-gray-900">{tasks.length} Tugas Terjadwal</p>
              <p className="text-gray-600">Kriteria Talent: <span className="font-semibold text-gray-800">{caregiverCriteria || 'Sesuai kompetensi terverifikasi'}</span></p>
              <p className="text-gray-600">GPS Status: <span className="font-mono text-emerald-700 font-semibold">{gpsCoords ? `${gpsCoords.lat.toFixed(5)}, ${gpsCoords.lng.toFixed(5)}` : 'Aktif'}</span></p>
              <p className="text-gray-600">Garansi: <span className="font-semibold text-gray-800">100% Proteksi Dana Escrow</span></p>
              <p className="text-gray-600">Lead time: <span className="font-semibold text-emerald-700">Terjadwal H-1 Sesuai PRD</span></p>
            </div>
          </div>

          {/* Pricing Breakdown (Shopee / Gojek Style Calculator) */}
          <div className="p-5 sm:p-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white space-y-3.5 text-xs shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
              <h4 className="font-extrabold text-emerald-950 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Rincian Pembayaran Terstruktur:</span>
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Transparan & Proteksi Escrow 100%
              </span>
            </div>

            {/* 1. Tarif Dasar Layanan */}
            <div className="flex justify-between items-center text-gray-700">
              <div>
                <span className="font-semibold text-gray-900">Tarif Dasar Layanan</span>
                <span className="text-[11px] text-gray-500 block">
                  Rp {ratePerHour.toLocaleString('id-ID')}/jam × {durationHours} jam × {daysCount} hari
                </span>
              </div>
              <span className="font-bold text-gray-900 text-sm">Rp {baseSubtotal.toLocaleString('id-ID')}</span>
            </div>

            {/* 2. Biaya Lokasi / Tempat (Di Rumah Hemat vs Tempat Fasilitas +20%) */}
            {fulfillment === 'home_visit' ? (
              <div className="p-3 rounded-xl bg-emerald-100/70 border border-emerald-300 flex justify-between items-center text-emerald-950">
                <div className="pr-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <Home className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Layanan Datang ke Rumah (Home Visit)</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-emerald-700 text-white rounded font-extrabold">LEBIH HEMAT</span>
                  </div>
                  <span className="text-[10px] text-emerald-800 block mt-0.5">
                    Biaya lebih murah tanpa biaya tempat / sewa gedung fasilitas (Hemat 20%)
                  </span>
                </div>
                <span className="font-extrabold text-xs text-emerald-700 whitespace-nowrap">Rp 0 (Bebas Biaya)</span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex justify-between items-center text-purple-950">
                <div className="pr-2">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900">
                    <Building2 className="w-4 h-4 text-purple-700 shrink-0" />
                    <span>Biaya Tambahan Tempat Fasilitas Mitra (+20%)</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-purple-700 text-white rounded font-extrabold">+20%</span>
                  </div>
                  <span className="text-[10px] text-purple-800 block mt-0.5">
                    Mencakup penggunaan ruang ber-AC, pengawasan CCTV, sarana & utilitas mitra resmi berizin
                  </span>
                </div>
                <span className="font-extrabold text-xs text-purple-700 whitespace-nowrap">+ Rp {facilityFee.toLocaleString('id-ID')}</span>
              </div>
            )}

            {/* Subtotal Layanan */}
            <div className="flex justify-between items-center text-gray-600 pt-1 text-[11px] px-1">
              <span>Subtotal Layanan {fulfillment === 'partner_facility' ? '(Dasar + Fasilitas 20%)' : '(Dasar di Rumah)'}</span>
              <span className="font-semibold text-gray-800">Rp {subtotalBeforeDiscount.toLocaleString('id-ID')}</span>
            </div>

            {/* 3. Diskon Paket jika ada */}
            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-emerald-700 font-semibold bg-emerald-100/50 px-2.5 py-2 rounded-xl border border-emerald-200">
                <div>
                  <span className="font-bold">Diskon Paket {packageType === 'weekly' ? 'Mingguan (5%)' : 'Bulanan (15%)'}</span>
                  <span className="text-[10px] text-emerald-600 block">Potongan langsung bundling hari</span>
                </div>
                <span className="font-bold text-xs">- Rp {discountAmount.toLocaleString('id-ID')}</span>
              </div>
            )}

            {/* 4. Biaya Admin MVP / Penggunaan Jasa Platform (10%) */}
            <div className="flex justify-between items-center text-gray-700 pt-2 border-t border-emerald-100">
              <div>
                <span className="font-semibold text-gray-900">Biaya Admin MVP / Penggunaan Jasa Platform (10%)</span>
                <span className="text-[10px] text-gray-500 block">
                  Pemeliharaan sistem proteksi Escrow 100%, verifikasi KTP/SKCK & pelacakan GPS live
                </span>
              </div>
              <span className="font-bold text-gray-900 whitespace-nowrap text-xs">+ Rp {platformFee.toLocaleString('id-ID')}</span>
            </div>

            {/* 5. Total Pembayaran / Total Rancangan Biaya */}
            <div className="pt-3 border-t-2 border-emerald-300 flex justify-between items-center text-base font-bold text-emerald-950">
              <div>
                <span className="block text-xs uppercase tracking-wider text-emerald-800 font-extrabold">Total Rancangan Biaya (Nomine):</span>
                <span className="text-[10px] font-normal text-gray-500">Nominal yang akan di-hold aman di Escrow saat deal</span>
              </div>
              <span className="text-xl font-extrabold text-emerald-700">Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>

            {/* Transparency Note */}
            <div className="p-3 rounded-xl bg-white border border-emerald-200 text-[11px] text-gray-600 space-y-1 mt-2">
              <span className="font-bold text-emerald-900 block">💡 Transparansi Struktur Biaya CareHub:</span>
              <p>• <strong>Layanan di Rumah:</strong> Lebih hemat karena tidak ada biaya operasional sewa gedung (+Rp 0).</p>
              <p>• <strong>Tempat Fasilitas Mitra:</strong> Dikenakan biaya tambahan <strong>20%</strong> untuk menjamin ketersediaan ruang, utilitas, dan sarana berizin.</p>
              <p>• <strong>Biaya Admin MVP Platform:</strong> Dikenakan <strong>10%</strong> untuk menjamin keamanan dana di rekening bersama (Escrow) dan verifikasi identitas resmi.</p>
            </div>

            {/* Step-by-step workflow callout */}
            <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-xs space-y-2 mt-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Alur Seleksi & Pembayaran Tanpa Bayar di Awal:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] text-gray-600">
                <div className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <span className="font-bold text-emerald-800 block mb-0.5">1. Upload Lowongan</span>
                  Tugas & kriteria dipublikasikan ke bursa pengasuh.
                </div>
                <div className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <span className="font-bold text-emerald-800 block mb-0.5">2. Pengasuh Melamar</span>
                  Caregiver mengirimkan profil, STR, SKCK & penawaran.
                </div>
                <div className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <span className="font-bold text-emerald-800 block mb-0.5">3. Seleksi ala HRD</span>
                  Customer memilih pelamar terbaik sesuai profil lengkap.
                </div>
                <div className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <span className="font-bold text-emerald-800 block mb-0.5">4. Deal & Bayar Escrow</span>
                  Setelah deal, baru bayar & dana di-HOLD aman di CareHub.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sistem Escrow: Tidak ada pemotongan saldo saat ini. Pembayaran baru dilakukan setelah kesepakatan kandidat.</span>
            </div>
          </div>

          {/* ANTI-ORDERAN FIKTIF SECURITY VERIFICATION CALLOUT */}
          {!isLoggedIn || currentUser?.role !== 'customer' ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-500/10 via-red-500/5 to-amber-500/10 border-2 border-red-400 text-xs text-red-950 space-y-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-red-900">
                    Verifikasi Akun Customer Wajib (Proteksi Anti-Orderan Fiktif)
                  </h4>
                  <p className="text-[11px] text-red-800/90 mt-0.5">
                    Demi keselamatan mitra pengasuh dan pencegahan pesanan fiktif, Anda <strong>wajib Masuk atau Mendaftar sebagai Customer Terverifikasi (KTP & No. WhatsApp Aktif)</strong> sebelum pesanan dapat dikonfirmasi.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                <span className="text-[11px] text-gray-500 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-red-600" />
                  <span>Sistem memblokir pemesanan anonim demi keselamatan kedua pihak.</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setShowAuthModal(true);
                  }}
                  className="px-5 py-2.5 rounded-xl font-extrabold text-xs bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Daftar / Masuk Customer Sekarang</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-900">
                    Akun Pemesan Terverifikasi: {currentUser.full_name}
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    WhatsApp: <strong>{currentUser.phone}</strong> • Identitas Sah (Bebas Orderan Fiktif)
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-200 text-emerald-900 rounded-full font-extrabold text-[10px] self-start sm:self-auto">
                Terverifikasi Aman ✓
              </span>
            </div>
          )}

          {/* Navigation & Submit */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              ← Kembali
            </button>

            <button
              type="button"
              onClick={handleConfirmOrder}
              className={`px-8 py-3 rounded-xl text-xs font-bold text-white shadow-lg flex items-center gap-2 transition-all cursor-pointer ${(!isLoggedIn || currentUser?.role !== 'customer') ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/25' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'}`}
            >
              {(!isLoggedIn || currentUser?.role !== 'customer') ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Verifikasi Diri & Publikasikan Lowongan</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publikasikan Lowongan & Cari Pengasuh</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MODAL SUKSES PUBLIKASI LOWONGAN & ARAHAN SELEKSI PELAMAR (HRD VIEW) */}
      {showJobPublishedModal && publishedOrderId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-emerald-200 shadow-2xl relative">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
            </div>

            <div className="text-center space-y-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Lowongan Berhasil Diunggah!
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                Care Request Dipublikasikan ke Bursa Talent
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Permintaan asuhan untuk <strong>{recipientName}</strong> telah aktif. Beberapa pengasuh terverifikasi di Surabaya telah mengirimkan lamaran mereka!
              </p>
            </div>

            {/* Nominasi Biaya Info */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/70 border border-emerald-200 space-y-2 text-xs">
              <div className="flex justify-between items-center text-gray-700">
                <span className="font-medium">Rancangan Biaya (Nomine):</span>
                <span className="font-extrabold text-sm text-emerald-900">Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-emerald-100 text-[10px]">
                <span className={`px-2 py-0.5 rounded-full font-bold ${fulfillment === 'home_visit' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'}`}>
                  {fulfillment === 'home_visit' ? '🏠 Home Visit (Lebih Murah • Hemat)' : '🏢 Tempat Fasilitas (+20%)'}
                </span>
                <span className="px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700">
                  Admin Platform MVP: 10%
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed pt-1">
                💡 <strong>Belum Ada Pembayaran yang Ditagihkan!</strong> Anda baru melakukan pembayaran (di-HOLD di Escrow CareHub) setelah Anda menyeleksi profil, latar belakang & deal dengan pengasuh pilihan Anda.
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => router.push(`/customer/order/${publishedOrderId}`)}
                className="w-full py-3.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Lihat & Seleksi Pelamar Sekarang (HR View)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => router.push('/customer')}
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Ke Dashboard Customer Nanti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANTI-ORDERAN FIKTIF CUSTOMER AUTHENTICATION MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 my-8">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white p-5 relative">
              <button
                type="button"
                onClick={() => { setShowAuthModal(false); setAuthModalError(null); }}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-5 h-5 text-amber-300" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-200">
                  Verifikasi Wajib Anti-Orderan Fiktif
                </span>
              </div>
              <h3 className="text-lg font-bold">
                Masuk atau Daftarkan Akun Customer Anda
              </h3>
              <p className="text-xs text-red-100 mt-1 leading-relaxed">
                Demi keselamatan mitra pengasuh di lapangan dan validitas transaksi escrow, pemesanan wajib terhubung dengan identitas Customer terverifikasi (KTP & No. WhatsApp aktif).
              </p>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthModalError(null); }}
                className={`flex-1 py-3 text-center border-b-2 transition-all ${authMode === 'register' ? 'border-red-600 text-red-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                Daftar Akun Baru (KTP & HP)
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthModalError(null); }}
                className={`flex-1 py-3 text-center border-b-2 transition-all ${authMode === 'login' ? 'border-red-600 text-red-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                Sudah Punya Akun (Masuk)
              </button>
            </div>

            {/* Error Message */}
            {authModalError && (
              <div className="p-3 mx-5 mt-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{authModalError}</span>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 space-y-4">

              {/* TAB REGISTER */}
              {authMode === 'register' && (
                <form onSubmit={handleAuthModalRegister} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Nama Lengkap (Sesuai KTP): *
                    </label>
                    <input
                      type="text"
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        No. WhatsApp / HP Aktif: *
                      </label>
                      <input
                        type="tel"
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
                        required
                      />
                      <span className="text-[10px] text-gray-500">Wajib aktif untuk koordinasi darurat</span>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">
                        NIK KTP (16 Digit): *
                      </label>
                      <input
                        type="text"
                        maxLength={16}
                        value={authNikKtp}
                        onChange={(e) => setAuthNikKtp(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="357801xxxxxxxxxx"
                        className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
                        required
                      />
                      <span className="text-[10px] text-gray-500">KTP resmi untuk audit anti-fiktif</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Alamat Email: *
                    </label>
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Buat Kata Sandi:
                    </label>
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Anti-Orderan Fiktif Legal Statement Checkbox */}
                  <div className="p-3 bg-red-50/80 rounded-xl border border-red-200">
                    <label className="flex items-start gap-2 cursor-pointer text-[11px] text-red-950">
                      <input
                        type="checkbox"
                        checked={authLegalAgreed}
                        onChange={(e) => setAuthLegalAgreed(e.target.checked)}
                        className="mt-0.5 rounded text-red-600 focus:ring-red-500 h-4 w-4"
                        required
                      />
                      <span>
                        <strong>Pernyataan Hukum Anti-Orderan Fiktif:</strong> Saya menyatakan bahwa data ini benar milik saya, pemesanan ini riil, dan saya bersedia menerima sanksi hukum (Pasal 378 KUHP & UU ITE) serta pemblokiran NIK permanen apabila membuat pesanan fiktif.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Daftar Akun Terverifikasi & Lanjutkan Pesanan</span>
                  </button>
                </form>
              )}

              {/* TAB LOGIN */}
              {authMode === 'login' && (
                <form onSubmit={handleAuthModalLogin} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Email atau Nomor WhatsApp Terdaftar:
                    </label>
                    <input
                      type="text"
                      value={authIdentifier}
                      onChange={(e) => setAuthIdentifier(e.target.value)}
                      placeholder="budi@carenest.id atau 0812-3456-7890"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Kata Sandi:
                    </label>
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Masuk Akun & Konfirmasi Pesanan</span>
                  </button>

                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[11px] text-gray-400 block mb-2 text-center">Atau gunakan akun terverifikasi demo:</span>
                    <button
                      type="button"
                      onClick={handle1ClickCustomerDemo}
                      className="w-full py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-emerald-50 text-gray-800 hover:text-emerald-900 border border-gray-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>Masuk Cepat: Budi Santoso (Customer Terverifikasi)</span>
                    </button>
                  </div>
                </form>
              )}

            </div>

          </div>
        </div>
      )}

      {/* REAL PAYMENT GATEWAY & ESCROW MODAL */}
      {showPaymentModal && createdOrderInfo && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            router.push(`/customer/order/${createdOrderInfo.id}`);
          }}
          orderId={createdOrderInfo.id}
          orderNumber={createdOrderInfo.number}
          totalAmount={createdOrderInfo.amount}
          customerName={currentUser?.full_name || 'Customer CareHub'}
          customerEmail={currentUser?.email || 'customer@carehub.id'}
          customerPhone={currentUser?.phone || '081234567890'}
          serviceCategory={category === 'elderly' ? 'Lansia' : category === 'child' ? 'Anak' : 'Hewan Peliharaan'}
          onPaymentSuccess={() => {
            setShowPaymentModal(false);
            router.push(`/customer/order/${createdOrderInfo.id}`);
          }}
        />
      )}

    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-16 text-center text-xs text-gray-500 font-medium">Memuat Formulir Pemesanan CareNest...</div>}>
      <BookingWizardContent />
    </Suspense>
  );
}
