import { useEffect, useMemo, useState } from "react";
import type { ApiError } from "../api/apiClient";
import {
  type AdminCreateUserRequest,
  type AdminUpdateUserRequest,
  type AuthUserProfile
} from "../lib/identity-client";
import { useIdentityFacade } from "./useIdentityFacade";

export function useAdminPanelModel() {
  const { auth, client, toPanelError } = useIdentityFacade();

  const [loginOpen, setLoginOpen] = useState(false);
  const [users, setUsers] = useState<AuthUserProfile[]>([]);
  const [panelError, setPanelError] = useState<ApiError | undefined>(undefined);

  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<AuthUserProfile | undefined>(undefined);
  const [formError, setFormError] = useState<ApiError | undefined>(undefined);

  const isAdmin = useMemo(() => (auth.user?.roles || []).includes("admin"), [auth.user?.roles]);

  async function loadUsers() {
    setPanelError(undefined);
    try {
      const nextUsers = await client.listUsers();
      setUsers(nextUsers);
    } catch (err) {
      setPanelError(toPanelError(err));
      setUsers([]);
    }
  }

  useEffect(() => {
    if (auth.isLoggedIn) void loadUsers();
    if (!auth.isLoggedIn) setUsers([]);
  }, [auth.isLoggedIn]);

  async function doLogin(username: string, password: string) {
    await auth.login(username, password);
    setLoginOpen(false);
  }

  async function doCreate(req: AdminCreateUserRequest) {
    setFormError(undefined);
    try {
      await client.createUser(req);
      setCreateOpen(false);
      await loadUsers();
    } catch (err) {
      const apiError = toPanelError(err);
      setFormError(apiError);
      throw apiError;
    }
  }

  async function doUpdate(req: AdminUpdateUserRequest) {
    if (!editUser) return;
    setFormError(undefined);
    try {
      await client.updateUser(editUser.id, req);
      setEditUser(undefined);
      await loadUsers();
    } catch (err) {
      const apiError = toPanelError(err);
      setFormError(apiError);
      throw apiError;
    }
  }

  async function doDelete(u: AuthUserProfile) {
    const ok = window.confirm(`Delete user?\n\n${u.username}\n${u.id}`);
    if (!ok) return;

    setPanelError(undefined);
    try {
      await client.deleteUser(u.id);
      await loadUsers();
    } catch (err) {
      setPanelError(toPanelError(err));
    }
  }

  async function doRevokeSession(u: AuthUserProfile) {
    const ok = window.confirm(`Revoke all sessions for user?\n\n${u.username}\n${u.id}`);
    if (!ok) return;

    setPanelError(undefined);
    try {
      await client.revokeUserSessions(u.id);
    } catch (err) {
      setPanelError(toPanelError(err));
    }
  }

  async function doDisable(u: AuthUserProfile) {
    const ok = window.confirm(`Disable user? They will be unable to log in.\n\n${u.username}\n${u.id}`);
    if (!ok) return;

    setPanelError(undefined);
    try {
      await client.disableUser(u.id);
      await loadUsers();
    } catch (err) {
      setPanelError(toPanelError(err));
    }
  }

  async function doEnable(u: AuthUserProfile) {
    setPanelError(undefined);
    try {
      await client.enableUser(u.id);
      await loadUsers();
    } catch (err) {
      setPanelError(toPanelError(err));
    }
  }

  return {
    auth,
    loginOpen,
    setLoginOpen,
    users,
    panelError,
    createOpen,
    setCreateOpen,
    editUser,
    setEditUser,
    formError,
    setFormError,
    isAdmin,
    loadUsers,
    doLogin,
    doCreate,
    doUpdate,
    doDelete,
    doRevokeSession,
    doDisable,
    doEnable
  };
}
