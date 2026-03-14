import { useEffect, useState } from "react";
import type { ApiError } from "../api/apiClient";
import type { MeResponse, UpdateMeRequest } from "../lib/identity-client";
import { useIdentityFacade } from "./useIdentityFacade";

export function useUserPanelModel() {
  const { auth, client, toPanelError } = useIdentityFacade();

  const [loginOpen, setLoginOpen] = useState(false);
  const [me, setMe] = useState<MeResponse | undefined>(undefined);
  const [panelError, setPanelError] = useState<ApiError | undefined>(undefined);

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileError, setProfileError] = useState<ApiError | undefined>(undefined);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      setMe(undefined);
      setPanelError(undefined);
    }
  }, [auth.isLoggedIn]);

  async function doLogin(username: string, password: string) {
    await auth.login(username, password);
    setLoginOpen(false);
  }

  async function fetchMe() {
    setPanelError(undefined);
    try {
      const res = await client.getMe();
      setMe(res);
    } catch (err) {
      setPanelError(toPanelError(err));
      setMe(undefined);
    }
  }

  async function doUpdateMe(req: UpdateMeRequest) {
    setProfileError(undefined);
    try {
      const res = await client.updateMe(req);
      setMe(res);
      setEditProfileOpen(false);
    } catch (err) {
      const apiError = toPanelError(err);
      setProfileError(apiError);
      throw apiError;
    }
  }

  return {
    auth,
    loginOpen,
    setLoginOpen,
    me,
    panelError,
    editProfileOpen,
    setEditProfileOpen,
    profileError,
    setProfileError,
    doLogin,
    fetchMe,
    doUpdateMe
  };
}
