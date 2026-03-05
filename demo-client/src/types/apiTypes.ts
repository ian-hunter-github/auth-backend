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

type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

export function isSuccessEnvelope<T>(v: unknown): v is SuccessEnvelope<T> {
  if (!isRecord(v)) return false;
  return v.ok === true && "data" in v;
}

export function isErrorEnvelope(v: unknown): v is ErrorEnvelope {
  if (!isRecord(v)) return false;

  const ok = v.ok;
  const err = v.error;

  if (ok !== false) return false;
  if (!isRecord(err)) return false;

  const code = err.code;
  const message = err.message;

  return typeof code === "string" && typeof message === "string";
}
