export class IdentityClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly requestId?: string;

  constructor(args: {
    message: string;
    status: number;
    code?: string;
    details?: unknown;
    requestId?: string;
  }) {
    super(args.message);
    this.name = "IdentityClientError";
    this.status = args.status;
    this.details = args.details;

    if (args.code !== undefined) {
      this.code = args.code;
    }

    if (args.requestId !== undefined) {
      this.requestId = args.requestId;
    }
  }
}
