import { NextApiRequest, NextApiResponse } from 'next';
import { getCheckoutSession } from '../../../lib/ops';
import { ErrorResponse } from '../../../lib/typedefs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return;
  }
  const {
    query: { params },
  } = req;
  const secretKey = params[0] as string;
  const sessionId = params[1] as string;

  const response = await getCheckoutSession(secretKey, sessionId);
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
