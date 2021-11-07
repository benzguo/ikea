import { NextApiRequest, NextApiResponse } from 'next';
import { ErrorResponse } from '../../lib/typedefs';
import { createCharge } from '../../lib/ops';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return;
  }

  const params = JSON.parse(req.body);
  const secretKey = params.secret_key;
  const accountId = params.account_id;
  const amount = params.amount;
  const description = params.description;

  const response = await createCharge(secretKey, accountId, amount, description);
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
