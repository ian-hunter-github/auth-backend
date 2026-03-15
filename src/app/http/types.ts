export type AppHttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "HEAD";

export type AppHttpHeaders = Record<string, string | undefined>;

export type AppHttpRequest = {
  method: AppHttpMethod;
  path: string;
  headers: AppHttpHeaders;
  query: Record<string, string | string[] | undefined>;
  body: string | null | undefined;
  requestId: string;
  ip?: string;
  userAgent?: string;
};

export type AppHttpResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

export type AppHttpHandler = (
  request: AppHttpRequest
) => Promise<AppHttpResponse> | AppHttpResponse;
