import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { verifyMidtransSignature } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = payload;

    if (!order_id) {
      return NextResponse.json({ error: 'order_id not provided' }, { status: 400 });
    }

    // Verify signature key if provided
    if (signature_key && status_code && gross_amount) {
      const isValid = verifyMidtransSignature(order_id, status_code, gross_amount, signature_key);
      if (!isValid) {
        console.warn(`[Webhook Warning] Invalid signature for order ${order_id}`);
        return NextResponse.json({ error: 'Invalid signature key' }, { status: 403 });
      }
    }

    console.log(`[Midtrans Webhook Received] Order: ${order_id}, Status: ${transaction_status}, Type: ${payment_type}`);

    let newEscrowStatus = 'held';
    let newOrderStatus = 'confirmed';
    let isSuccess = false;

    if (transaction_status === 'capture') {
      if (fraud_status === 'challenge') {
        newEscrowStatus = 'pending';
        newOrderStatus = 'draft';
      } else if (fraud_status === 'accept') {
        newEscrowStatus = 'held';
        newOrderStatus = 'confirmed';
        isSuccess = true;
      }
    } else if (transaction_status === 'settlement') {
      // Payment successful (QRIS, GoPay, ShopeePay, Virtual Account, etc.)
      newEscrowStatus = 'held';
      newOrderStatus = 'confirmed';
      isSuccess = true;
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      newEscrowStatus = 'refunded';
      newOrderStatus = 'cancelled';
    } else if (transaction_status === 'pending') {
      newEscrowStatus = 'pending';
      newOrderStatus = 'awaiting_applicants';
    }

    // Update in Supabase if database connection is active
    if (isSupabaseConfigured()) {
      try {
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            escrow_status: newEscrowStatus,
            order_status: newOrderStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', order_id);

        if (updateError) {
          console.error('[Supabase Webhook Error]', updateError);
        } else {
          // Log to audit log
          await supabase.from('admin_audit_logs').insert({
            admin_name: 'System Payment Gateway',
            action: isSuccess ? 'ESCROW_DEPOSIT_CONFIRMED' : `PAYMENT_${transaction_status.toUpperCase()}`,
            target: `Order ${order_id}`,
            details: `Notifikasi pembayaran via ${payment_type || 'Gateway'}. Status: ${transaction_status}. Dana Rp ${gross_amount} sekarang status escrow: ${newEscrowStatus}.`,
          });
        }
      } catch (dbErr) {
        console.error('[Supabase Webhook Exception]', dbErr);
      }
    }

    return NextResponse.json({
      status: 'success',
      order_id,
      escrow_status: newEscrowStatus,
      order_status: newOrderStatus,
      message: 'Notifikasi pembayaran berhasil diproses.',
    });
  } catch (error: any) {
    console.error('[Webhook Exception]', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error processing webhook' },
      { status: 500 }
    );
  }
}
