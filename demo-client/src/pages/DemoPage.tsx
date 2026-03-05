import React from "react";
import { AuthProvider } from "../auth/AuthContext";
import { SplitLayout } from "../components/SplitLayout";
import { AdminPanel } from "../panels/AdminPanel";
import { UserPanel } from "../panels/UserPanel";

export function DemoPage() {
  return (
    <SplitLayout
      left={
        <AuthProvider sessionKey="admin">
          <AdminPanel />
        </AuthProvider>
      }
      right={
        <AuthProvider sessionKey="user">
          <UserPanel />
        </AuthProvider>
      }
    />
  );
}
