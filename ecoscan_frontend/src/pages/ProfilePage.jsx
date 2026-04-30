import { useEffect, useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

/**
 * Advanced Profile Page
 *
 * - Avatar upload (stored in localStorage per user email)
 * - Editable fields: fullName, phone, organization
 * - Role is shown as a read-only badge (user cannot change role)
 * - Shows createdAt and updatedAt (read-only)
 * - Save / Cancel with change detection and validation
 * - Logout confirmation
 *
 * Note: Avatar and password-change are stored client-side here. If you
 * want server-side storage for avatars or password changes, add endpoints
 * to the backend and I can wire them up.
 */

function formatDateTime(dt) {
  if (!dt) return "—";
  try {
    const d = new Date(dt);
    return isNaN(d.getTime()) ? dt : d.toLocaleString();
  } catch {
    return dt;
  }
}

function initialsFromName(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function phoneIsValid(phone) {
  if (!phone) return true; // optional
  // simple validation: digits, spaces, +, -, parentheses
  return /^[0-9+\-\s()]{6,20}$/.test(phone);
}

export default function ProfilePage() {
  const { user, refreshProfile, updateProfile, logout } = useAuth();
  const [form, setForm] = useState(null);
  const [initialForm, setInitialForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [avatarDataUrl, setAvatarDataUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setForm(null);
      setInitialForm(null);
      setAvatarDataUrl(null);
      return;
    }

    const profile = {
      id: user.id,
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      organization: user.organization || "",
      role: user.role || "USER",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    setForm(profile);
    setInitialForm(profile);

    // load avatar from localStorage for this user (client-side only)
    try {
      const key = `ecoscan_avatar_${user.email}`;
      const data = localStorage.getItem(key);
      if (data) setAvatarDataUrl(data);
      else setAvatarDataUrl(null);
    } catch {
      setAvatarDataUrl(null);
    }
  }, [user]);

  if (!user) {
    return (
      <section className="page-section">
        <h2>Not logged in</h2>
        <p className="lead">Please login to view your profile.</p>
      </section>
    );
  }

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const hasChanges = () => {
    if (!form || !initialForm) return false;
    return (
      form.fullName !== initialForm.fullName ||
      form.phone !== initialForm.phone ||
      form.organization !== initialForm.organization
    );
  };

  const handleSave = async () => {
    setError("");
    setMessage("");
    if (!form.fullName || form.fullName.trim().length < 2) {
      setError("Please provide a valid full name (at least 2 characters).");
      return;
    }
    if (!phoneIsValid(form.phone)) {
      setError("Please provide a valid phone number.");
      return;
    }

    setSaving(true);
    try {
      // Build payload that matches backend expectation for updateProfile
      const payload = {
        id: form.id,
        fullName: form.fullName.trim(),
        email: form.email,
        phone: form.phone ? form.phone.trim() : null,
        organization: form.organization ? form.organization.trim() : null,
        role: form.role, // backend will ignore role changes if you prefer, here it's included but UI doesn't allow editing
      };

      const updated = await updateProfile(payload);
      setForm({
        id: updated.id,
        fullName: updated.fullName,
        email: updated.email,
        phone: updated.phone || "",
        organization: updated.organization || "",
        role: updated.role || "USER",
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      });
      setInitialForm({
        id: updated.id,
        fullName: updated.fullName,
        email: updated.email,
        phone: updated.phone || "",
        organization: updated.organization || "",
        role: updated.role || "USER",
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      });
      setMessage("Profile updated");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setError("");
    setMessage("");
  };

  const handleAvatarPick = async (file) => {
    setError("");
    setMessage("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file for avatar.");
      return;
    }

    // Limit file size to 1.5MB
    const maxBytes = 1_500_000;
    if (file.size > maxBytes) {
      setError("Avatar image is too large (max 1.5MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setAvatarDataUrl(dataUrl);
      try {
        const key = `ecoscan_avatar_${user.email}`;
        localStorage.setItem(key, dataUrl);
        setMessage("Avatar updated (stored locally).");
      } catch {
        setError("Unable to save avatar locally.");
      }
    };
    reader.onerror = () => setError("Failed to read avatar file.");
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarRemove = () => {
    try {
      const key = `ecoscan_avatar_${user.email}`;
      localStorage.removeItem(key);
      setAvatarDataUrl(null);
      setMessage("Avatar removed.");
    } catch {
      setError("Failed to remove avatar.");
    }
  };

  const handleLogout = () => {
    const ok = window.confirm("Do you really want to log out?");
    if (!ok) return;
    logout();
  };

  return (
    <section className="page-section">
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 18 }}>
        <div style={{ minWidth: 220 }}>
          <span className="eyebrow">Account</span>
          <h1 style={{ marginTop: 8 }}>Profile</h1>

          <div className="card" style={{ marginTop: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 16,
                  background: avatarDataUrl ? `url(${avatarDataUrl}) center/cover` : "var(--surface-2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 800,
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
                title="Avatar"
              >
                {!avatarDataUrl && <span>{initialsFromName(form?.fullName)}</span>}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: "var(--text)", fontSize: 16 }}>
                  {form?.fullName || form?.email}
                </div>
                <div style={{ color: "var(--text-soft)", marginTop: 6 }}>{form?.email}</div>

                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  <button className="btn btn-secondary" type="button" onClick={handleAvatarClick}>
                    Change avatar
                  </button>
                  <button className="btn btn-ghost" type="button" onClick={handleAvatarRemove}>
                    Remove
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleAvatarPick(e.target.files?.[0])}
                />
              </div>
            </div>

            <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span className="badge" style={{ background: "var(--accent-soft)", color: "var(--accent-2)", padding: "6px 10px", borderRadius: 999 }}>
                  Role: {form?.role}
                </span>
              </div>

              <div style={{ marginLeft: 8, color: "var(--text-soft)" }}>
                <div>Joined: {formatDateTime(form?.createdAt)}</div>
                <div>Updated: {formatDateTime(form?.updatedAt)}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div className="card">
            <div className="card-header">
              <h2>Account Details</h2>
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label>
                Full name
                <input name="fullName" value={form?.fullName ?? ""} onChange={(e) => setField("fullName", e.target.value)} />
              </label>

              <label>
                Email (readonly)
                <input name="email" value={form?.email ?? ""} disabled />
              </label>

              <label>
                Phone
                <input name="phone" value={form?.phone ?? ""} onChange={(e) => setField("phone", e.target.value)} />
              </label>

              <label>
                Organization
                <input name="organization" value={form?.organization ?? ""} onChange={(e) => setField("organization", e.target.value)} />
              </label>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || !hasChanges()}>
                {saving ? "Saving..." : "Save changes"}
              </button>

              <button className="btn btn-ghost" onClick={handleCancel} disabled={!hasChanges()}>
                Cancel
              </button>

              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button className="btn btn-ghost" onClick={refreshProfile}>Refresh</button>
                <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
              </div>
            </div>

            {message && <div style={{ marginTop: 12, color: "var(--accent-2)" }}>{message}</div>}
            {error && <div style={{ marginTop: 12 }} className="alert error">{error}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}