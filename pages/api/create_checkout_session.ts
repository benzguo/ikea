import { NextApiRequest, NextApiResponse } from 'next';
import { ErrorResponse } from '../../lib/typedefs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return;
  }

  const params = JSON.parse(req.body);
  const secretKey = params.secret_key;
  const accountId = params.account_id;
  const amount = params.amount;
  const message = params.message;

  const returnUrl = req.headers.referer;

  const stripe = require('stripe')(secretKey);

  const productData = { name: 'tip' };
  if (message) {
    productData['description'] = message;
  }

  // create checkout session
  const checkoutParams = {
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: productData,
          unit_amount: ~~(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    payment_intent_data: {
      description: message,
    },
    success_url: returnUrl,
    cancel_url: returnUrl,
    submit_type: 'donate',
  };

  try {
    const checkoutSession = await stripe.checkout.sessions.create(checkoutParams, {
      stripeAccount: accountId,
    });
    const checkoutSessionId = checkoutSession.id;
    res.json({ id: checkoutSessionId, url: checkoutSession.url });
  } catch (e) {
    const response: ErrorResponse = {
      errorCode: 'stripe_error',
      errorMessage: e.message,
      httpStatus: 500,
    };
    res.status(response.httpStatus).json(response);
  }
};
