export interface IndonesiaCity {
  id: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
  popular?: boolean;
}

export const INDONESIA_CITIES: IndonesiaCity[] = [
  // Jawa Timur
  { id: 'sby', name: 'Kota Surabaya', province: 'Jawa Timur', lat: -7.2575, lng: 112.7521, popular: true },
  { id: 'sda', name: 'Kab. Sidoarjo', province: 'Jawa Timur', lat: -7.4478, lng: 112.7183, popular: true },
  { id: 'grs', name: 'Kab. Gresik', province: 'Jawa Timur', lat: -7.1566, lng: 112.6555, popular: true },
  { id: 'mlg', name: 'Kota Malang', province: 'Jawa Timur', lat: -7.9797, lng: 112.6304, popular: true },
  { id: 'kbt', name: 'Kota Batu', province: 'Jawa Timur', lat: -7.8671, lng: 112.5239 },
  { id: 'kdr', name: 'Kota Kediri', province: 'Jawa Timur', lat: -7.8228, lng: 112.0119 },
  { id: 'jmb', name: 'Kab. Jember', province: 'Jawa Timur', lat: -8.1724, lng: 113.6995 },
  { id: 'byw', name: 'Kab. Banyuwangi', province: 'Jawa Timur', lat: -8.2192, lng: 114.3692 },
  { id: 'mdn-jt', name: 'Kota Madiun', province: 'Jawa Timur', lat: -7.6298, lng: 111.5239 },
  { id: 'psr', name: 'Kota Pasuruan', province: 'Jawa Timur', lat: -7.6453, lng: 112.9075 },
  { id: 'prb', name: 'Kota Probolinggo', province: 'Jawa Timur', lat: -7.7543, lng: 113.2159 },
  { id: 'mjk', name: 'Kota Mojokerto', province: 'Jawa Timur', lat: -7.4726, lng: 112.4385 },
  { id: 'tbn', name: 'Kab. Tuban', province: 'Jawa Timur', lat: -6.8976, lng: 112.0649 },
  { id: 'lmg', name: 'Kab. Lamongan', province: 'Jawa Timur', lat: -7.1219, lng: 112.4154 },
  { id: 'bjn', name: 'Kab. Bojonegoro', province: 'Jawa Timur', lat: -7.1502, lng: 111.8818 },
  { id: 'blt', name: 'Kota Blitar', province: 'Jawa Timur', lat: -8.0983, lng: 112.1681 },

  // DKI Jakarta
  { id: 'jkt-pst', name: 'Kota Jakarta Pusat', province: 'DKI Jakarta', lat: -6.1805, lng: 106.8284, popular: true },
  { id: 'jkt-sel', name: 'Kota Jakarta Selatan', province: 'DKI Jakarta', lat: -6.2615, lng: 106.8106, popular: true },
  { id: 'jkt-bar', name: 'Kota Jakarta Barat', province: 'DKI Jakarta', lat: -6.1683, lng: 106.7589, popular: true },
  { id: 'jkt-tim', name: 'Kota Jakarta Timur', province: 'DKI Jakarta', lat: -6.2250, lng: 106.9004, popular: true },
  { id: 'jkt-utr', name: 'Kota Jakarta Utara', province: 'DKI Jakarta', lat: -6.1384, lng: 106.8640, popular: true },

  // Jawa Barat
  { id: 'bdg', name: 'Kota Bandung', province: 'Jawa Barat', lat: -6.9175, lng: 107.6191, popular: true },
  { id: 'bks-kt', name: 'Kota Bekasi', province: 'Jawa Barat', lat: -6.2383, lng: 106.9756, popular: true },
  { id: 'dpk', name: 'Kota Depok', province: 'Jawa Barat', lat: -6.4025, lng: 106.7942, popular: true },
  { id: 'bgr-kt', name: 'Kota Bogor', province: 'Jawa Barat', lat: -6.5971, lng: 106.8060, popular: true },
  { id: 'bgr-kb', name: 'Kab. Bogor (Cibinong)', province: 'Jawa Barat', lat: -6.4816, lng: 106.8534 },
  { id: 'cmh', name: 'Kota Cimahi', province: 'Jawa Barat', lat: -6.8723, lng: 107.5422 },
  { id: 'crb', name: 'Kota Cirebon', province: 'Jawa Barat', lat: -6.7320, lng: 108.5523 },
  { id: 'skb', name: 'Kota Sukabumi', province: 'Jawa Barat', lat: -6.9277, lng: 106.9300 },
  { id: 'tsm', name: 'Kota Tasikmalaya', province: 'Jawa Barat', lat: -7.3274, lng: 108.2207 },
  { id: 'krw', name: 'Kab. Karawang', province: 'Jawa Barat', lat: -6.3042, lng: 107.3075 },

  // Banten
  { id: 'tgr-kt', name: 'Kota Tangerang', province: 'Banten', lat: -6.1783, lng: 106.6319, popular: true },
  { id: 'tgr-sel', name: 'Kota Tangerang Selatan (BSD/Bintaro)', province: 'Banten', lat: -6.2888, lng: 106.7179, popular: true },
  { id: 'srn', name: 'Kota Serang', province: 'Banten', lat: -6.1200, lng: 106.1503 },
  { id: 'clg', name: 'Kota Cilegon', province: 'Banten', lat: -6.0024, lng: 106.0125 },

  // Jawa Tengah & DI Yogyakarta
  { id: 'smg', name: 'Kota Semarang', province: 'Jawa Tengah', lat: -6.9667, lng: 110.4167, popular: true },
  { id: 'slo', name: 'Kota Surakarta (Solo)', province: 'Jawa Tengah', lat: -7.5755, lng: 110.8243, popular: true },
  { id: 'mgl', name: 'Kota Magelang', province: 'Jawa Tengah', lat: -7.4706, lng: 110.2178 },
  { id: 'slt', name: 'Kota Salatiga', province: 'Jawa Tengah', lat: -7.3305, lng: 110.5084 },
  { id: 'pkl', name: 'Kota Pekalongan', province: 'Jawa Tengah', lat: -6.8886, lng: 109.6753 },
  { id: 'tgl', name: 'Kota Tegal', province: 'Jawa Tengah', lat: -6.8694, lng: 109.1402 },
  { id: 'pwt', name: 'Kab. Banyumas (Purwokerto)', province: 'Jawa Tengah', lat: -7.4243, lng: 109.2302 },
  { id: 'kds', name: 'Kab. Kudus', province: 'Jawa Tengah', lat: -6.8048, lng: 110.8405 },
  { id: 'ygy', name: 'Kota Yogyakarta', province: 'DI Yogyakarta', lat: -7.7956, lng: 110.3695, popular: true },
  { id: 'slm', name: 'Kab. Sleman', province: 'DI Yogyakarta', lat: -7.7156, lng: 110.3556 },
  { id: 'btl', name: 'Kab. Bantul', province: 'DI Yogyakarta', lat: -7.8938, lng: 110.3342 },

  // Bali & Nusa Tenggara
  { id: 'dps', name: 'Kota Denpasar', province: 'Bali', lat: -8.6705, lng: 115.2126, popular: true },
  { id: 'bdg-bali', name: 'Kab. Badung (Kuta/Canggu/Seminyak)', province: 'Bali', lat: -8.5833, lng: 115.1833, popular: true },
  { id: 'gny', name: 'Kab. Gianyar (Ubud)', province: 'Bali', lat: -8.5412, lng: 115.3262 },
  { id: 'tbn-bali', name: 'Kab. Tabanan', province: 'Bali', lat: -8.5410, lng: 115.1245 },
  { id: 'mtr', name: 'Kota Mataram (Lombok)', province: 'Nusa Tenggara Barat', lat: -8.5833, lng: 116.1167 },
  { id: 'kpg', name: 'Kota Kupang', province: 'Nusa Tenggara Timur', lat: -10.1772, lng: 123.6070 },

  // Sumatera
  { id: 'mdn', name: 'Kota Medan', province: 'Sumatera Utara', lat: 3.5952, lng: 98.6722, popular: true },
  { id: 'btm', name: 'Kota Batam', province: 'Kepulauan Riau', lat: 1.1301, lng: 104.0529, popular: true },
  { id: 'plb', name: 'Kota Palembang', province: 'Sumatera Selatan', lat: -2.9761, lng: 104.7754, popular: true },
  { id: 'pku', name: 'Kota Pekanbaru', province: 'Riau', lat: 0.5071, lng: 101.4478 },
  { id: 'pdg', name: 'Kota Padang', province: 'Sumatera Barat', lat: -0.9471, lng: 100.4172 },
  { id: 'bdl', name: 'Kota Bandar Lampung', province: 'Lampung', lat: -5.3971, lng: 105.2668 },
  { id: 'jmb-sum', name: 'Kota Jambi', province: 'Jambi', lat: -1.6101, lng: 103.6131 },
  { id: 'bgl', name: 'Kota Bengkulu', province: 'Bengkulu', lat: -3.8004, lng: 102.2655 },
  { id: 'bna', name: 'Kota Banda Aceh', province: 'Aceh', lat: 5.5483, lng: 95.3238 },
  { id: 'pkp', name: 'Kota Pangkal Pinang', province: 'Bangka Belitung', lat: -2.1333, lng: 106.1167 },

  // Kalimantan
  { id: 'bpn', name: 'Kota Balikpapan', province: 'Kalimantan Timur', lat: -1.2379, lng: 116.8529, popular: true },
  { id: 'smd', name: 'Kota Samarinda', province: 'Kalimantan Timur', lat: -0.5021, lng: 117.1537, popular: true },
  { id: 'bjm', name: 'Kota Banjarmasin', province: 'Kalimantan Selatan', lat: -3.3167, lng: 114.5900 },
  { id: 'ptk', name: 'Kota Pontianak', province: 'Kalimantan Barat', lat: -0.0263, lng: 109.3425 },
  { id: 'plk', name: 'Kota Palangka Raya', province: 'Kalimantan Tengah', lat: -2.2077, lng: 113.9165 },
  { id: 'trk', name: 'Kota Tarakan', province: 'Kalimantan Utara', lat: 3.3271, lng: 117.5937 },

  // Sulawesi & Indonesia Timur
  { id: 'mks', name: 'Kota Makassar', province: 'Sulawesi Selatan', lat: -5.1477, lng: 119.4327, popular: true },
  { id: 'mnd', name: 'Kota Manado', province: 'Sulawesi Utara', lat: 1.4748, lng: 124.8428 },
  { id: 'pal', name: 'Kota Palu', province: 'Sulawesi Tengah', lat: -0.9003, lng: 119.8779 },
  { id: 'kdi', name: 'Kota Kendari', province: 'Sulawesi Tenggara', lat: -3.9985, lng: 122.5126 },
  { id: 'gto', name: 'Kota Gorontalo', province: 'Gorontalo', lat: 0.5401, lng: 123.0595 },
  { id: 'amb', name: 'Kota Ambon', province: 'Maluku', lat: -3.6554, lng: 128.1908 },
  { id: 'jpr', name: 'Kota Jayapura', province: 'Papua', lat: -2.5916, lng: 140.6690 },
  { id: 'srg', name: 'Kota Sorong', province: 'Papua Barat Daya', lat: -0.8762, lng: 131.2558 },
];

/**
 * Calculates distance in kilometers between two geo coordinates using Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

/**
 * Finds the closest Indonesian city from given GPS coordinates
 */
export function findClosestCity(lat: number, lng: number): { city: IndonesiaCity; distanceKm: number } {
  let closest = INDONESIA_CITIES[0];
  let minDistance = calculateDistanceKm(lat, lng, closest.lat, closest.lng);

  for (let i = 1; i < INDONESIA_CITIES.length; i++) {
    const d = calculateDistanceKm(lat, lng, INDONESIA_CITIES[i].lat, INDONESIA_CITIES[i].lng);
    if (d < minDistance) {
      minDistance = d;
      closest = INDONESIA_CITIES[i];
    }
  }

  return { city: closest, distanceKm: minDistance };
}
