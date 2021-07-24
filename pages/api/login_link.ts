import { NextApiRequest, NextApiResponse } from 'next';
import { createLoginLink } from '../../lib/ops';
import { ErrorResponse } from '../../lib/typedefs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return;
  }
  try {
    const response = await createLoginLink();
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
