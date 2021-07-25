import { NextApiRequest, NextApiResponse } from 'next';
import { createAccountLink } from '../../lib/ops';
import { ErrorResponse } from '../../lib/typedefs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return;
  }
  const params = JSON.parse(req.body);
  const secretKey = params.secret_key;
  const accountId = params.account_id;

  const response = await createAccountLink(secretKey, accountId);
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
