import { ErrorResponse, AnyResponse } from './typedefs';

export const connectStripeAccount = async (session: any): Promise<AnyResponse> => {
  let dataResponse: object | null = null;
  let errorResponse: ErrorResponse | null = null;
  const stripe = require('stripe')(process.env.LOCAL_STRIPE_SECRET_KEY);

  let stripeAccountId = process.env.LOCAL_CONNECTED_ACCOUNT_ID;
  console.log('stripe_account_id: ' + stripeAccountId);
  const username = session.user.username;
  const email = process.env.CONNECTED_ACCOUNT_EMAIL;
  const twitterUrl = `https://twitter.com/${username}`;
  const bizName = `tray.club/@${username}`;
  try {
    console.log('Creating Stripe account');
    const account = await stripe.accounts.create({
      type: 'express',
      business_type: 'individual',
      email: email,
      individual: { email: email },
      settings: {
        payments: {
          statement_descriptor: 'fill your home',
        },
      },
      business_profile: {
        name: bizName,
        mcc: '5192',
        product_description:
          'A Better Everyday Life Means You Need A Better Everyday Home, And You Deserve Both. Find Great Additions To Large Homes, Small Apartments, And Anywhere In-Between.',
        url: twitterUrl,
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
    let returnUrl = `https://tray.club/@${username}`;
    if (process.env.NODE_ENV === 'development') {
      returnUrl = `http://127.0.0.1:3000/@${username}`;
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
  const stripe = require('stripe')(process.env.LOCAL_STRIPE_SECRET_KEY);
  let stripeAccountId = process.env.LOCAL_CONNECTED_ACCOUNT_ID;
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
