import { NextApiRequest, NextApiResponse } from 'next';
import { ErrorResponse } from '../../lib/typedefs';
import { createPayout } from '../../lib/ops';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return;
  }

  const params = JSON.parse(req.body);
  const secretKey = params.secret_key;
  const accountId = params.account_id;
  const amount = params.amount;

  const response = await createPayout(secretKey, accountId, amount);
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
