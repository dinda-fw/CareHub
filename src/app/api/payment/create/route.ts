import { NextResponse } from 'next/server';
import { createMidtransSnapTransaction } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      orderId, 
      amount, 
      customerName, 
      customerEmail, 
      customerPhone, 
      serviceName,
      address,
      city 
    } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'orderId dan amount wajib diisi' },
        { status: 400 }
      );
    }

    const snapResult = await createMidtransSnapTransaction({
      orderId: orderId,
      grossAmount: amount,
      customerDetails: {
        first_name: customerName || 'Customer CareNest',
        email: customerEmail || 'customer@carenest.id',
        phone: customerPhone || '081234567890',
        billing_address: {
          address: address || 'Jl. Raya Gubeng No. 45',
          city: city || 'Surabaya',
          country_code: 'IDN',
        },
      },
      itemDetails: [
        {
          id: orderId,
          price: amount,
          quantity: 1,
          name: serviceName || 'Layanan Asuhan Terjadwal CareNest',
        },
      ],
    });

    return NextResponse.json(snapResult);
  } catch (error: any) {
    console.error('Error generating payment transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error saat menyiapkan pembayaran' },
      { status: 500 }
    );
  }
}
