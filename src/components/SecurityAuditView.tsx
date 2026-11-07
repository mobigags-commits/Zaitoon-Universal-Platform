import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  AlertTriangle,
  Lock,
  Globe,
  Terminal,
} from 'lucide-react';
import { Language, translations } from '../i18n.js';
import { AuditLog } from '../types.js';
import { api } from '../api.js';

interface SecurityAuditViewProps {
  currentLang: Language;
}

export const SecurityAuditView: React.FC<SecurityAuditViewProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    api.getAuditLogs({ severity: severityFilter }).then((res) => {
      setLogs(res.logs);
    });
  }, [severityFilter]);

  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.actorEmail.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.resource.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            {t.auditLogs} & Cybersecurity Telemetry
          </h1>
          <p className="text-xs text-neutral-400">
            Immutable, append-only security ledger tracking all administrative actions and API interactions.
          </p>
        </div>

        {/* Severity filter */}
        <div className="flex items-center gap-2 bg-[#18261A] border border-[#2A3E2D] p-1 rounded-xl text-xs">
          {['all', 'info', 'warn', 'security'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[11px] transition-all cursor-pointer ${
                severityFilter === sev
                  ? 'bg-[#283E2D] text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Security Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#18261A] border border-[#2A3E2D] p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-neutral-400 uppercase font-bold">PostgreSQL Tenant Isolation</span>
          <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 100% Isolated Across 9 Sites
          </div>
        </div>

        <div className="bg-[#18261A] border border-[#2A3E2D] p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-neutral-400 uppercase font-bold">API Rate Limiting</span>
          <div className="text-[#D4AF37] font-bold text-sm flex items-center gap-1.5">
            <Lock className="w-4 h-4" /> 1,200 req/min per Website API Key
          </div>
        </div>

        <div className="bg-[#18261A] border border-[#2A3E2D] p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-neutral-400 uppercase font-bold">Secret Manager</span>
          <div className="text-cyan-400 font-bold text-sm flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Zero Client-Side Leaks
          </div>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="bg-[#18261A] border border-[#2A3E2D] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#142016] text-[#A0B0A2] uppercase tracking-wider font-semibold border-b border-[#2A3E2D] text-[10px]">
              <tr>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Resource Target</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">IP / Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243526]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#1E2E21]/60 transition-colors">
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        log.severity === 'security'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : log.severity === 'warn'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {log.action}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-neutral-200">{log.actorEmail}</div>
                    <div className="text-[10px] text-[#D4AF37] uppercase">{log.actorRole}</div>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-cyan-300">
                    {log.resource}
                  </td>

                  <td className="py-3 px-4 text-neutral-300 max-w-sm truncate">
                    {log.details}
                  </td>

                  <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">
                    <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                    <div className="text-[10px] text-neutral-500">{log.ipAddress}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
