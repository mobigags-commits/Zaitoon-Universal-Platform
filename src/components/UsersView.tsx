import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Smartphone,
  Globe,
} from 'lucide-react';
import { Language, translations } from '../i18n.js';
import { User, Website } from '../types.js';

interface UsersViewProps {
  currentLang: Language;
  users: User[];
  websites: Website[];
  onCreateUser: (user: Partial<User>) => Promise<void>;
  onUpdateUser: (id: string, user: Partial<User>) => Promise<void>;
}

export const UsersView: React.FC<UsersViewProps> = ({
  currentLang,
  users,
  websites,
  onCreateUser,
  onUpdateUser,
}) => {
  const t = translations[currentLang];
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<User['role']>('website_admin');
  const [assignedWebsite, setAssignedWebsite] = useState<string>(websites[0]?.id || '*');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) return;

    await onCreateUser({
      email,
      fullName,
      role,
      assignedWebsites: role === 'super_admin' || role === 'auditor' ? ['*'] : [assignedWebsite],
    });

    setIsInviteOpen(false);
    setEmail('');
    setFullName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#D4AF37]" />
            {t.userManagement} (Firebase Auth & RBAC)
          </h1>
          <p className="text-xs text-neutral-400">
            Enforce role-based access control, multi-factor authentication, and website scope permissions.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-[#D4AF37]/20 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-[#18261A] border border-[#2A3E2D] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#142016] text-[#A0B0A2] uppercase tracking-wider font-semibold border-b border-[#2A3E2D] text-[10px]">
              <tr>
                <th className="py-3 px-4">User Identity</th>
                <th className="py-3 px-4">Security Role</th>
                <th className="py-3 px-4">Website Permissions Scope</th>
                <th className="py-3 px-4">MFA Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243526]">
              {users.map((u) => {
                const isSuper = u.role === 'super_admin';
                return (
                  <tr key={u.id} className="hover:bg-[#1E2E21]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        {u.fullName}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        {u.email}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1 ${
                          u.role === 'super_admin'
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                            : u.role === 'website_admin'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {u.role.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {isSuper || u.assignedWebsites.includes('*') ? (
                        <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                          <Globe className="w-3 h-3" /> All 9+ Network Websites
                        </span>
                      ) : (
                        <span className="text-neutral-300 font-mono text-[11px]">
                          {u.assignedWebsites.join(', ')}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          u.mfaEnabled
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {u.mfaEnabled ? 'MFA Enforced' : 'Password Only'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">
                      {u.lastLogin}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[10px] font-bold uppercase text-emerald-400">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18261A] border border-[#2D4532] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#2C412F]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#D4AF37]" />
                Provision System User
              </h3>
              <button onClick={() => setIsInviteOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@zaitoon.org"
                  className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">System Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white"
                >
                  <option value="website_admin">Website Admin (Single Site)</option>
                  <option value="moderator">Moderator (Review Submissions)</option>
                  <option value="auditor">Auditor (Read-Only Compliance)</option>
                  <option value="super_admin">Super Admin (Full Platform Control)</option>
                </select>
              </div>

              {role === 'website_admin' && (
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Assigned Website</label>
                  <select
                    value={assignedWebsite}
                    onChange={(e) => setAssignedWebsite(e.target.value)}
                    className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white"
                  >
                    {websites.map((w) => (
                      <option key={w.id} value={w.id} className="bg-[#18261A]">
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-[#2C412F]">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-neutral-950 font-bold"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
