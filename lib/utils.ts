export const getAccountId = (): string | null => {
  if (process.env.ACCOUNT_ID) {
    return process.env.ACCOUNT_ID;
  } else {
    return localStorage.getItem('ACCOUNT_ID');
  }
};

export const getSecretKey = (): string | null => {
  if (process.env.SECRET_KEY) {
    return process.env.SECRET_KEY;
  }
  return localStorage.getItem('SECRET_KEY');
};
