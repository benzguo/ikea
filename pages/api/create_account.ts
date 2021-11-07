import { NextApiRequest, NextApiResponse } from 'next';
import { createAccount } from '../../lib/ops';
import { ErrorResponse } from '../../lib/typedefs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return;
  }
  const params = JSON.parse(req.body);
  const secretKey = params.secret_key;
  const bizType = params.biz_type;
  const xpType = params.xp_type;
  const capabilities = params.capabilities;

  const response = await createAccount(secretKey);
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
