import { ErrorResponse, AnyResponse } from './typedefs';

export const createAccount = async (secretKey: string): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(secretKey);

  try {
    console.log('Creating Stripe account');
    const account = await stripe.accounts.create({
      type: 'express',
      business_type: 'individual',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
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
  const stripe = require('stripe')(secretKey);

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

export const getCheckoutSession = async (secretKey: string, sessionId: string): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(secretKey);

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

export const createCheckoutSession = async (secretKey: string, accountId: string, amount: number, message: string | null, flow: string): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(secretKey);

  console.log("🌊 flow", flow)
  let returnUrl = `https://lightbulb.express`;
  if (process.env.NODE_ENV === 'development') {
    returnUrl = `http://127.0.0.1:3000`;
  }
  try {
    console.log('Creating account link ' + returnUrl);
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
      console.log("params", checkoutParams);
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
      console.log("params", checkoutParams);
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
      console.log("params", checkoutParams);
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
      console.log("params", checkoutParams);
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
  const stripe = require('stripe')(secretKey);

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
  const stripe = require('stripe')(secretKey);
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
