import { ErrorResponse, AnyResponse } from './typedefs';
require('dotenv').config();

export const createAccount = async (
  secretKey: string,
  bizType: string,
  xpType: string,
  capabilities: string,
  email: string | null,
): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(secretKey, { host: process.env.HOST });
  let caps: object = {
    card_payments: { requested: true },
    transfers: { requested: true },
  };
  if (capabilities === 'transfers_only') {
    caps = {
      transfers: { requested: true },
    };
  }
  try {
    console.log('Creating Stripe account');
    const params = {
      type: xpType,
      business_type: bizType,
      email: email,
      settings: { payouts: { schedule: { interval: 'manual' } } },
      business_profile: { product_description: 'lightbulb marketplace' },
    };
    if (xpType !== 'standard') {
      params['capabilities'] = caps;
    }
    const account = await stripe.accounts.create(params);
    dataResponse = { account_id: account.id };
  } catch (e) {
    errorResponse = {
      httpStatus: 500,
      errorMessage: e.message,
      errorCode: 'stripe_exception',
    };
  }
  const response = {
    errored: errorResponse != null,
    data: errorResponse ? errorResponse : dataResponse,
  };
  console.log('response', response);
  return response;
};

export const getAccount = async (secretKey: string, accountId: string | null): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(secretKey, { host: process.env.HOST });

  try {
    let account = null;
    if (accountId) {
      account = await stripe.accounts.retrieve(accountId);
    } else {
      account = await stripe.accounts.retrieve();
    }
    dataResponse = { account: account };
  } catch (e) {
    errorResponse = {
      httpStatus: 500,
      errorMessage: e.message,
      errorCode: 'stripe_exception',
    };
  }
  const response = {
    errored: errorResponse != null,
    data: errorResponse ? errorResponse : dataResponse,
  };
  console.log('response', response);
  return response;
};

export const getBalance = async (secretKey: string, accountId: string | null): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(secretKey, { host: process.env.HOST });

  try {
    let balance = null;
    if (accountId) {
      balance = await stripe.balance.retrieve({ stripeAccount: accountId });
    } else {
      throw 'account id is null';
    }
    dataResponse = { balance: balance };
  } catch (e) {
    errorResponse = {
      httpStatus: 500,
      errorMessage: e.message,
      errorCode: 'stripe_exception',
    };
  }
  const response = {
    errored: errorResponse != null,
    data: errorResponse ? errorResponse : dataResponse,
  };
  console.log('response', response);
  return response;
};

export const getCheckoutSession = async (secretKey: string, sessionId: string): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(secretKey, { host: process.env.HOST });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent'] });
    dataResponse = { session: session };
  } catch (e) {
    errorResponse = {
      httpStatus: 500,
      errorMessage: e.message,
      errorCode: 'stripe_exception',
    };
  }
  const response = {
    errored: errorResponse != null,
    data: errorResponse ? errorResponse : dataResponse,
  };
  console.log('response', response);
  return response;
};

export const createCheckoutSession = async (
  secretKey: string,
  accountId: string,
  amount: number,
  message: string | null,
  flow: string,
): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(secretKey, { host: process.env.HOST });

  console.log('🌊 flow', flow);
  let returnUrl = `https://lightbulb.express`;
  if (process.env.NODE_ENV === 'development') {
    returnUrl = `http://127.0.0.1:3000`;
  }
  try {
    console.log('Creating checkout session ' + returnUrl);
    const productData = { name: 'tip' };
    if (message) {
      productData['description'] = message;
    }
    var checkoutSession = null;
    if (flow === 'direct') {
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
          application_fee_amount: 10,
          description: message,
        },
        success_url: returnUrl,
        cancel_url: returnUrl,
        submit_type: 'donate',
      };
      console.log('params', checkoutParams);
      checkoutSession = await stripe.checkout.sessions.create(checkoutParams, {
        stripeAccount: accountId,
      });
    } else if (flow === 'destination') {
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
          application_fee_amount: 10,
          description: message,
          transfer_data: {
            destination: accountId,
          },
        },
        success_url: returnUrl,
        cancel_url: returnUrl,
        submit_type: 'donate',
      };
      console.log('params', checkoutParams);
      checkoutSession = await stripe.checkout.sessions.create(checkoutParams);
    } else if (flow === 'destination_obo') {
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
          application_fee_amount: 10,
          description: message,
          on_behalf_of: accountId,
          transfer_data: {
            destination: accountId,
          },
        },
        success_url: returnUrl,
        cancel_url: returnUrl,
        submit_type: 'donate',
      };
      console.log('params', checkoutParams);
      checkoutSession = await stripe.checkout.sessions.create(checkoutParams);
    } else if (flow === 'sct') {
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
      console.log('params', checkoutParams);
      checkoutSession = await stripe.checkout.sessions.create(checkoutParams);
    }
    const checkoutSessionId = checkoutSession.id;
    dataResponse = { id: checkoutSessionId, url: checkoutSession.url };
  } catch (e) {
    errorResponse = {
      httpStatus: 500,
      errorMessage: e.message,
      errorCode: 'stripe_exception',
    };
  }
  const response = {
    errored: errorResponse != null,
    data: errorResponse ? errorResponse : dataResponse,
  };
  console.log('response', response);
  return response;
};

export const createAccountLink = async (secretKey: string, accountId: string): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(secretKey, { host: process.env.HOST });

  let returnUrl = `https://lightbulb.express`;
  if (process.env.NODE_ENV === 'development') {
    returnUrl = `http://127.0.0.1:3000`;
  }
  try {
    console.log('Creating account link ' + returnUrl);
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      return_url: returnUrl,
      refresh_url: returnUrl,
      type: 'account_onboarding',
    });
    dataResponse = { url: accountLink.url };
  } catch (e) {
    errorResponse = {
      httpStatus: 500,
      errorMessage: e.message,
      errorCode: 'stripe_exception',
    };
  }
  const response = {
    errored: errorResponse != null,
    data: errorResponse ? errorResponse : dataResponse,
  };
  console.log('response', response);
  return response;
};

export const createLoginLink = async (secretKey: string, accountId: string): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(secretKey, { host: process.env.HOST });
  try {
    console.log('Creating login link');
    const link = await stripe.accounts.createLoginLink(accountId);
    dataResponse = { url: link.url };
  } catch (e) {
    errorResponse = {
      httpStatus: 500,
      errorMessage: e.message,
      errorCode: 'stripe_exception',
    };
  }
  const response = {
    errored: errorResponse != null,
    data: errorResponse ? errorResponse : dataResponse,
  };
  return response;
};

export const sendFunds = async (secretKey: string, accountId: string, amount: number): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(secretKey, { host: process.env.HOST });
  try {
    const params = {
      amount: ~~(amount * 100),
      currency: 'usd',
      destination: accountId,
    };
    console.log('Creating transfer ' + JSON.stringify(params, null, 2));
    const transfer = await stripe.transfers.create(params);
    dataResponse = { transfer: transfer.id };
  } catch (e) {
    errorResponse = {
      httpStatus: 500,
      errorMessage: e.message,
      errorCode: 'stripe_exception',
    };
  }
  const response = {
    errored: errorResponse != null,
    data: errorResponse ? errorResponse : dataResponse,
  };
  return response;
};

export const createPayout = async (secretKey: string, accountId: string, amount: number): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(secretKey, { host: process.env.HOST });
  try {
    console.log('Creating payout ');
    const payout = await stripe.payouts.create(
      {
        amount: ~~(amount * 100),
        currency: 'usd',
        destination: 'tok_visa_debit_us_transferSuccess',
      },
      {
        stripeAccount: accountId,
      },
    );
    dataResponse = { payout: payout.id };
  } catch (e) {
    errorResponse = {
      httpStatus: 500,
      errorMessage: e.message,
      errorCode: 'stripe_exception',
    };
  }
  const response = {
    errored: errorResponse != null,
    data: errorResponse ? errorResponse : dataResponse,
  };
  return response;
};

export const createCharge = async (
  secretKey: string,
  accountId: string,
  amount: number,
  description: string,
): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(secretKey, { host: process.env.HOST });
  try {
    console.log('Creating charge ');
    const charge = await stripe.charges.create({
      amount: ~~(amount * 100),
      currency: 'usd',
      description: description,
      application_fee_amount: 10,
      source: 'tok_visa',
      transfer_data: {
        destination: accountId,
      },
    });
    if (description && description.length > 0) {
      const transferId = charge.transfer;
      const transfer = await stripe.transfers.retrieve(transferId);
      const chargeId = transfer.destination_payment;
      console.log('updating charge');
      const updatedCharge = await stripe.charges.update(
        chargeId,
        { description: description },
        { stripe_account: accountId },
      );
      dataResponse = { charge: updatedCharge.id };
    } else {
      dataResponse = { charge: charge.id };
    }
  } catch (e) {
    errorResponse = {
      httpStatus: 500,
      errorMessage: e.message,
      errorCode: 'stripe_exception',
    };
  }
  const response = {
    errored: errorResponse != null,
    data: errorResponse ? errorResponse : dataResponse,
  };
  return response;
};
