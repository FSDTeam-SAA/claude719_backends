import axios from 'axios';
import config from '../config';

const PAYPAL_BASE_URL =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

const getAccessToken = async () => {
  const { data } = await axios.post(
    `${PAYPAL_BASE_URL}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      auth: {
        username: config.paypal.clientId!,
        password: config.paypal.clientSecret!,
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
  );

  return data.access_token;
};

export const createPaypalOrder = async (amount: number, metadata?: any) => {
  try {
    const token = await getAccessToken();

    const { data } = await axios.post(
      `${PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount.toFixed(2),
            },
            custom_id: JSON.stringify(metadata || {}),
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { success: true, data: data, orderId: data.id };
  } catch (error: any) {
    console.error(
      'Error creating PayPal order:',
      error.response?.data || error.message,
    );
    return { success: false, error: error.response?.data || error.message };
  }
};

export const capturePaypalOrder = async (orderId: string) => {
  try {
    const token = await getAccessToken();

    const { data } = await axios.post(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // PayPal capture response typically has id, status, etc.
    // The capture ID is usually in purchase_units[0].payments.captures[0].id or data.id depending on structure
    // But assuming data.id is the main resource ID.
    // For capture endpoint, if successful, it returns the capture object.

    // Sometimes it returns the Order object if not fully captured?
    // But v2/checkout/orders/:id/capture returns a captured payment or order?
    // Actually it returns the captured payment details.

    const captureId =
      data.purchase_units?.[0]?.payments?.captures?.[0]?.id || data.id;

    return { success: true, data: data, captureId: captureId };
  } catch (error: any) {
    console.error(
      'Error capturing PayPal order:',
      error.response?.data || error.message,
    );
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getOrderDetails = async (orderId: string) => {
  try {
    const token = await getAccessToken();

    const { data } = await axios.get(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { success: true, data: data };
  } catch (error: any) {
    console.error(
      'Error getting PayPal order details:',
      error.response?.data || error.message,
    );
    return {
      success: false,
      error: error.response?.data || error.message,
      data: null,
    };
  }
};
