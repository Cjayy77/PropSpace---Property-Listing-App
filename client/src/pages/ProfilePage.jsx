import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMe, changePassword } from '../api/users';
import InputField from '../components/InputField';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.username?.[0]?.toUpperCase() ?? '?';

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '', phone: user?.phone || '', avatarUrl: user?.avatarUrl || '',
  });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfileChange = (e) =>
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg(''); setProfileError(''); setProfileLoading(true);
    try {
      const res = await updateMe(profileForm);
      updateUser(res.data.user);
      setProfileMsg('Profile updated successfully.');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Update failed.');
    } finally {
      setProfileLoading(false);
    }
  };

  const validatePw = () => {
    const e = {};
    if (!pwForm.oldPassword) e.oldPassword = 'Current password is required';
    if (!pwForm.newPassword) e.newPassword = 'New password is required';
    else if (pwForm.newPassword.length < 6) e.newPassword = 'At least 6 characters';
    return e;
  };

  const handlePwChange = (e) =>
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    const e2 = validatePw();
    if (Object.keys(e2).length) { setPwErrors(e2); return; }
    setPwErrors({}); setPwMsg(''); setPwError(''); setPwLoading(true);
    try {
      await changePassword(pwForm);
      setPwMsg('Password changed successfully.');
      setPwForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setPwError(err.response?.data?.message || 'Password change failed.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="profile-page">
        <div className="profile-header">
          <h2>My Profile</h2>
          <p>Manage your account information and security settings.</p>
        </div>

        <div className="profile-grid">
          <aside>
            <div className="profile-section">
              <div className="profile-avatar-block">
                <div className="profile-avatar-lg">{initials}</div>
                <div>
                  <div className="profile-avatar-name">{user?.name || user?.username}</div>
                  <div className="profile-avatar-email">{user?.email}</div>
                </div>
              </div>
              <h3>Account Info</h3>
              <div className="profile-info-row">
                <span className="profile-info-label">Username</span>
                <span className="profile-info-value">@{user?.username}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-value" style={{ fontSize: '0.85rem' }}>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="profile-info-row">
                  <span className="profile-info-label">Phone</span>
                  <span className="profile-info-value">{user.phone}</span>
                </div>
              )}
            </div>
          </aside>

          <div className="profile-tabs">
            <div className="profile-section">
              <h3>Edit Profile</h3>
              {profileMsg && <p className="success-banner" role="status">{profileMsg}</p>}
              {profileError && <p className="error-banner" role="alert">{profileError}</p>}
              <form onSubmit={handleProfileSubmit} noValidate>
                <InputField label="Display Name" id="name" name="name" value={profileForm.name}
                  onChange={handleProfileChange} placeholder="Your full name" />
                <InputField label="Phone" id="phone" name="phone" type="tel"
                  value={profileForm.phone} onChange={handleProfileChange}
                  placeholder="+1 555 000 0000" />
                <InputField label="Avatar URL" id="avatarUrl" name="avatarUrl"
                  value={profileForm.avatarUrl} onChange={handleProfileChange}
                  placeholder="https://…" />
                <button type="submit" className="btn-primary" disabled={profileLoading}
                  style={{ marginTop: '0.25rem' }}>
                  {profileLoading ? 'Saving…' : 'Save Changes'}
                </button>
              </form>
            </div>

            <div className="profile-section">
              <h3>Change Password</h3>
              {pwMsg && <p className="success-banner" role="status">{pwMsg}</p>}
              {pwError && <p className="error-banner" role="alert">{pwError}</p>}
              <form onSubmit={handlePwSubmit} noValidate>
                <InputField label="Current Password" id="oldPassword" name="oldPassword"
                  type="password" value={pwForm.oldPassword} onChange={handlePwChange}
                  error={pwErrors.oldPassword} autoComplete="current-password"
                  placeholder="••••••••" />
                <InputField label="New Password" id="newPassword" name="newPassword"
                  type="password" value={pwForm.newPassword} onChange={handlePwChange}
                  error={pwErrors.newPassword} autoComplete="new-password"
                  placeholder="Min. 6 characters" />
                <button type="submit" className="btn-primary" disabled={pwLoading}
                  style={{ marginTop: '0.25rem' }}>
                  {pwLoading ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
