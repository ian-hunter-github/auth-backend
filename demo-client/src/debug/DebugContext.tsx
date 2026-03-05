import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";

export type DebugLogEntry = {
  id: string;
  atIso: string;
  method: string;
  path: string;
  url: string;
  status: number;
  ms: number;
  ok: boolean;
  requestBody?: unknown;
  responseBody?: unknown;
  errorMessage?: string;
};

export type DebugState = {
  sessionKey: string;
  enabled: boolean;
  setEnabled: (v: boolean) => void;

  logs: DebugLogEntry[];
  clear: () => void;

  log: (e: Omit<DebugLogEntry, "id" | "atIso">) => void;
};

const DebugContext = createContext<DebugState | null>(null);

function key(sessionKey: string): string {
  return `debug.${sessionKey}.enabled`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function randomId(): string {
  // deterministic enough for UI keys; avoids adding deps
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function DebugProvider(props: { sessionKey: string; children: React.ReactNode }) {
  const { sessionKey } = props;

  const [enabled, setEnabledState] = useState(false);
  const [logs, setLogs] = useState<DebugLogEntry[]>([]);

  const maxLogsRef = useRef(200);

  useEffect(() => {
    const raw = localStorage.getItem(key(sessionKey));
    setEnabledState(raw === "1");
  }, [sessionKey]);

  const setEnabled = useCallback(
    (v: boolean) => {
      setEnabledState(v);
      localStorage.setItem(key(sessionKey), v ? "1" : "0");
    },
    [sessionKey]
  );

  const clear = useCallback(() => {
    setLogs([]);
  }, []);

  const log = useCallback((e: Omit<DebugLogEntry, "id" | "atIso">) => {
    setLogs((prev) => {
      const next: DebugLogEntry[] = [
        {
          id: randomId(),
          atIso: nowIso(),
          ...e
        },
        ...prev
      ];
      return next.slice(0, maxLogsRef.current);
    });
  }, []);

  const value: DebugState = useMemo(
    () => ({
      sessionKey,
      enabled,
      setEnabled,
      logs,
      clear,
      log
    }),
    [sessionKey, enabled, setEnabled, logs, clear, log]
  );

  return <DebugContext.Provider value={value}>{props.children}</DebugContext.Provider>;
}

export function useDebug(): DebugState {
  const v = React.useContext(DebugContext);
  if (!v) throw new Error("useDebug must be used within DebugProvider");
  return v;
}
