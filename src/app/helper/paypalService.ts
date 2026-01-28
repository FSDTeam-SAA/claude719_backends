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

  console.log(data);

  return data.access_token;
};

export const createPaypalOrder = async (amount: number, metadata?: any) => {
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

  return data;
};

export const capturePaypalOrder = async (orderId: string) => {
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

  return data;
};
