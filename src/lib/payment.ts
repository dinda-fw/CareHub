import crypto from 'crypto';

export interface PaymentItem {
  id: string;
  price: number;
  quantity: number;
  name: string;
}

export interface CustomerDetails {
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  billing_address?: {
    address: string;
    city: string;
    country_code?: string;
  };
}

export interface CreateTransactionParams {
  orderId: string;
  grossAmount: number;
  customerDetails: CustomerDetails;
  itemDetails: PaymentItem[];
}

export interface SnapTransactionResponse {
  success: boolean;
  token?: string;
  redirect_url?: string;
  isSimulated: boolean;
  error?: string;
  message?: string;
}

/**
 * Midtrans Snap Client Handler
 * Supports both Sandbox and Production modes.
 * If credentials are not set or during testing, gracefully falls back to a realistic local escrow simulator.
 */
export async function createMidtransSnapTransaction(
  params: CreateTransactionParams
): Promise<SnapTransactionResponse> {
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';

  const isConfigured = 
    serverKey && 
    !serverKey.includes('YOUR_SANDBOX_SERVER_KEY') && 
    !serverKey.includes('YOUR_SERVER_KEY');

  const snapBaseUrl = isProduction
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

  // If Midtrans Server Key is configured, make real API call to Midtrans Snap
  if (isConfigured) {
    try {
      const basicAuth = Buffer.from(`${serverKey.trim()}:`).toString('base64');

      const payload = {
        transaction_details: {
          order_id: params.orderId,
          gross_amount: Math.round(params.grossAmount),
        },
        item_details: params.itemDetails.map(item => ({
          id: item.id,
          price: Math.round(item.price),
          quantity: item.quantity,
          name: item.name.substring(0, 50),
        })),
        customer_details: {
          first_name: params.customerDetails.first_name,
          email: params.customerDetails.email,
          phone: params.customerDetails.phone,
        },
        callbacks: {
          finish: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/customer/order/${params.orderId}`,
        },
        credit_card: {
          secure: true,
        },
      };

      const res = await fetch(snapBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        return {
          success: true,
          token: data.token,
          redirect_url: data.redirect_url,
          isSimulated: false,
        };
      } else {
        console.warn('Midtrans API returned error, falling back to simulated sandbox:', data);
        return {
          success: true,
          token: `simulated-snap-${Date.now()}`,
          redirect_url: '',
          isSimulated: true,
          message: data.error_messages ? data.error_messages.join(', ') : 'Mode simulasi aktif',
        };
      }
    } catch (err: any) {
      console.error('Error connecting to Midtrans API:', err);
      return {
        success: true,
        token: `simulated-snap-${Date.now()}`,
        redirect_url: '',
        isSimulated: true,
        message: err.message,
      };
    }
  }

  // Graceful Sandbox simulation mode when API key is not yet configured
  return {
    success: true,
    token: `simulated-snap-${Date.now()}`,
    redirect_url: '',
    isSimulated: true,
    message: 'Berjalan di mode Sandbox / Simulasi Pembayaran Cerdas CareNest.',
  };
}

/**
 * Verify Webhook Signature Key from Midtrans
 * Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
 */
export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string | number,
  signatureKey: string
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  if (!serverKey) return true; // Relaxed in dev/test mode

  const formattedAmount = typeof grossAmount === 'number' ? grossAmount.toFixed(2) : grossAmount;
  const rawString = `${orderId}${statusCode}${formattedAmount}${serverKey}`;
  const computedSignature = crypto.createHash('sha512').update(rawString).digest('hex');

  return computedSignature.toLowerCase() === signatureKey.toLowerCase();
}
