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
    <section className="profile-page page-section">
      <div className="profile-heading">
        <div>
          <span className="eyebrow">Account center</span>
          <h1>Profile</h1>
          <p>Manage your identity and the details connected to your EcoScan account.</p>
        </div>
        <span className="profile-status"><span /> Account active</span>
      </div>

      <div className="profile-layout">
        <aside className="profile-summary card">
          <div className="profile-summary-top">
              <div
                className="profile-avatar"
                style={{ background: avatarDataUrl ? `url(${avatarDataUrl}) center/cover` : undefined }}
                title="Avatar"
              >
                {!avatarDataUrl && <span>{initialsFromName(form?.fullName)}</span>}
              </div>

              <div className="profile-identity">
                <div className="profile-name">
                  {form?.fullName || form?.email}
                </div>
                <div className="profile-email">{form?.email}</div>

                <div className="profile-avatar-actions">
                  <button className="btn btn-secondary btn-sm" type="button" onClick={handleAvatarClick}>
                    Change photo
                  </button>
                  <button className="btn btn-ghost btn-sm" type="button" onClick={handleAvatarRemove}>
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

          <div className="profile-meta">
            <span className="profile-role">Role: {form?.role}</span>
            <dl>
              <div><dt>Joined</dt><dd>{formatDateTime(form?.createdAt)}</dd></div>
              <div><dt>Updated</dt><dd>{formatDateTime(form?.updatedAt)}</dd></div>
            </dl>
          </div>
        </aside>

        <div className="profile-editor card">
          <div className="card-header profile-card-header">
            <div>
              <span className="section-tag">Personal details</span>
              <h2>Account details</h2>
            </div>
            <span className="profile-readonly-note">Email is read-only</span>
          </div>

          <div className="form-grid profile-form">
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

          <div className="profile-actions">
            <div className="profile-primary-actions">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || !hasChanges()}>
                {saving ? "Saving..." : "Save changes"}
              </button>

              <button className="btn btn-ghost" onClick={handleCancel} disabled={!hasChanges()}>
                Cancel
              </button>
            </div>

            <div className="profile-secondary-actions">
              <button className="btn btn-ghost" onClick={refreshProfile}>Refresh</button>
              <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
            </div>
          </div>

          {message && <div className="profile-message">{message}</div>}
          {error && <div className="alert error profile-error">{error}</div>}
        </div>
      </div>
    </section>
  );
}