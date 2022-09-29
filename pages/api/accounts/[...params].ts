import { NextApiRequest, NextApiResponse } from 'next';
import { getAccount } from '../../../lib/ops';
import { ErrorResponse } from '../../../lib/typedefs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return;
  }
  const {
    query: { params },
  } = req;
  const secretKey = params[0] as string;
  const accountId = params[1] as string;

  const accountResponse = await getAccount(secretKey, accountId);
  if (accountResponse.errored) {
    const errorResponse: ErrorResponse = {
      errorCode: 'op_error',
      errorMessage: accountResponse.data['errorMessage'],
      httpStatus: 500,
    };
    return res.status(errorResponse.httpStatus).json(errorResponse);
  }
  const sessionResponse = await getAccount(secretKey, accountId);
  if (sessionResponse.errored) {
    const errorResponse: ErrorResponse = {
      errorCode: 'op_error',
      errorMessage: sessionResponse.data['errorMessage'],
      httpStatus: 500,
    };
    return res.status(errorResponse.httpStatus).json(errorResponse);
  }
  const response = {
    ...accountResponse.data,
    ...sessionResponse.data
  }

  return res.json(response);
};
