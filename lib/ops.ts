import { ErrorResponse, AnyResponse } from './typedefs';

export const connectStripeAccount = async (): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(process.env.SECRET_KEY);

  let stripeAccountId = process.env.ACCOUNT_ID;
  console.log('stripe_account_id: ' + stripeAccountId);
  try {
    console.log('Creating Stripe account');
    const account = await stripe.accounts.create({
      type: 'express',
      business_type: 'individual',
      settings: {
        payments: {
          statement_descriptor: 'fill your home',
        },
      },
      business_profile: {
        mcc: '5192',
      },
    });
    stripeAccountId = account.id;
  } catch (e) {
    errorResponse = {
      httpStatus: 500,
      errorMessage: e.message,
      errorCode: 'stripe_exception',
    };
  }
  const account = await stripe.accounts.retrieve(stripeAccountId);
  // create an account link if charges aren't enabled
  if (!account.charges_enabled) {
    let returnUrl = `http://lit.lighting`;
    if (process.env.NODE_ENV === 'development') {
      returnUrl = `http://127.0.0.1:3000`;
    }
    try {
      console.log('Creating account link ' + returnUrl);
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        return_url: returnUrl,
        // TODO: handle refreshes with a different url for smoother onboarding
        refresh_url: returnUrl,
        type: 'account_onboarding',
      });
      console.log('accountLink', accountLink);
      dataResponse = { url: accountLink.url };
    } catch (e) {
      errorResponse = {
        httpStatus: 500,
        errorMessage: e.message,
        errorCode: 'stripe_exception',
      };
    }
  } else {
    dataResponse = { account: account };
  }
  const response = {
    errored: errorResponse != null,
    data: errorResponse ? errorResponse : dataResponse,
  };
  console.log('response', response);
  return response;
};

export const createLoginLink = async (): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(process.env.SECRET_KEY);
  let stripeAccountId = process.env.ACCOUNT_ID;
  const account = await stripe.accounts.retrieve(stripeAccountId);
  try {
    console.log('Creating login link');
    const link = await stripe.accounts.createLoginLink(stripeAccountId);
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
