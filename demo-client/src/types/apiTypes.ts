export type SuccessEnvelope<T> = {
  ok: true;
  requestId?: string;
  data: T;
};

export type ErrorEnvelope = {
  ok: false;
  requestId?: string;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type Envelope<T> = SuccessEnvelope<T> | ErrorEnvelope;

export function isSuccessEnvelope<T>(v: unknown): v is SuccessEnvelope<T> {
  if (!v || typeof v !== "object") return false;
  const o = v as any;
  return o.ok === true && "data" in o;
}

export function isErrorEnvelope(v: unknown): v is ErrorEnvelope {
  if (!v || typeof v !== "object") return false;
  const o = v as any;
  return o.ok === false && !!o.error && typeof o.error.code === "string";
}
