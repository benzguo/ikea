export interface ErrorResponse {
  errorCode: string;
  errorMessage: string;
  httpStatus: number;
}

export interface AnyResponse {
  errored: boolean;
  data: object | ErrorResponse;
}
