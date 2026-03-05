import React from "react";
import { AuthProvider } from "../auth/AuthContext";
import { SplitLayout } from "../components/SplitLayout";
import { AdminPanel } from "../panels/AdminPanel";
import { UserPanel } from "../panels/UserPanel";
import { DebugProvider } from "../debug/DebugContext";

export function DemoPage() {
  return (
    <SplitLayout
      left={
        <DebugProvider sessionKey="admin">
          <AuthProvider sessionKey="admin">
            <AdminPanel />
          </AuthProvider>
        </DebugProvider>
      }
      right={
        <DebugProvider sessionKey="user">
          <AuthProvider sessionKey="user">
            <UserPanel />
          </AuthProvider>
        </DebugProvider>
      }
    />
  );
}
