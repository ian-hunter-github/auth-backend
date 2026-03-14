import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import type { ApiError } from "../api/apiClient";
import type { AuthUserProfile, UpdateMeRequest } from "../lib/identity-client";

export function EditProfileModal(props: {
  open: boolean;
  initialUser?: AuthUserProfile;
  onClose: () => void;
  onSave: (req: UpdateMeRequest) => Promise<void>;
  busy?: boolean;
  error?: ApiError;
}) {
  const [displayName, setDisplayName] = useState("");
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [locale, setLocale] = useState("");
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    if (!props.open) return;
    const u = props.initialUser;
    setDisplayName(u?.displayName || "");
    setGivenName(u?.givenName || "");
    setFamilyName(u?.familyName || "");
    setAvatarUrl(u?.avatarUrl || "");
    setBio(u?.bio || "");
    setPhoneNumber(u?.phoneNumber || "");
    setLocale(u?.locale || "");
    setTimezone(u?.timezone || "");
  }, [props.open, props.initialUser]);

  async function submit() {
    await props.onSave({
      ...(displayName.trim() ? { displayName: displayName.trim() } : {}),
      ...(givenName.trim() ? { givenName: givenName.trim() } : {}),
      ...(familyName.trim() ? { familyName: familyName.trim() } : {}),
      ...(avatarUrl.trim() ? { avatarUrl: avatarUrl.trim() } : {}),
      ...(bio.trim() ? { bio: bio.trim() } : {}),
      ...(phoneNumber.trim() ? { phoneNumber: phoneNumber.trim() } : {}),
      ...(locale.trim() ? { locale: locale.trim() } : {}),
      ...(timezone.trim() ? { timezone: timezone.trim() } : {})
    });
  }

  return (
    <Dialog open={props.open} onClose={props.busy ? undefined : props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
          {props.error ? <Alert severity="error">{`${props.error.code}: ${props.error.message}`}</Alert> : null}

          <TextField
            label="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={!!props.busy}
            fullWidth
          />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Given name"
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
              disabled={!!props.busy}
              fullWidth
            />
            <TextField
              label="Family name"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              disabled={!!props.busy}
              fullWidth
            />
          </Box>

          <TextField
            label="Avatar URL"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            disabled={!!props.busy}
            fullWidth
          />

          <TextField
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={!!props.busy}
            fullWidth
            multiline
            rows={2}
          />

          <TextField
            label="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={!!props.busy}
            fullWidth
          />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Locale"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              disabled={!!props.busy}
              fullWidth
              helperText="e.g. en, fr, de"
            />
            <TextField
              label="Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              disabled={!!props.busy}
              fullWidth
              helperText="e.g. UTC, Europe/London"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} disabled={!!props.busy}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => void submit()} disabled={!!props.busy}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
