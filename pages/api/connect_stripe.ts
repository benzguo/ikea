import { NextApiRequest, NextApiResponse } from 'next';
import { connectStripeAccount } from '../../lib/ops';
import { ErrorResponse } from '../../lib/typedefs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return;
  }
  const response = await connectStripeAccount();
  if (response.errored) {
    const errorResponse: ErrorResponse = {
      errorCode: 'op_error',
      errorMessage: response.data['errorMessage'],
      httpStatus: 500,
    };
    return res.status(errorResponse.httpStatus).json(errorResponse);
  }
  return res.json(response.data);
};
