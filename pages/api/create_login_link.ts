import { NextApiRequest, NextApiResponse } from 'next';
import { createLoginLink } from '../../lib/ops';
import { ErrorResponse } from '../../lib/typedefs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return;
  }
  const params = JSON.parse(req.body);
  const secretKey = params.secret_key;
  const accountId = params.account_id;
  try {
    const response = await createLoginLink(secretKey, accountId);
    return res.json(response.data);
  } catch (e) {
    const response: ErrorResponse = {
      errorCode: 'op_error',
      errorMessage: e.message,
      httpStatus: 500,
    };
    return res.status(response.httpStatus).json(response);
  }
};
