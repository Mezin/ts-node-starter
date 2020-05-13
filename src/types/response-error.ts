export interface ResponseError extends Error {
  status?: number;
  statusCode?: number;
}
