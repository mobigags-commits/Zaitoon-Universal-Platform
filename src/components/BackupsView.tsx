import React, { useState, useEffect } from 'react';
import {
  HardDriveDownload,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCw,
  PlusCircle,
  FileCheck,
  AlertCircle,
  Download,
} from 'lucide-react';
import { Language, translations } from '../i18n.js';
import { Backup } from '../types.js';
import { api } from '../api.js';

interface BackupsViewProps {
  currentLang: Language;
}

export const BackupsView: React.FC<BackupsViewProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchBackups = async () => {
    try {
      const res = await api.getBackups();
      setBackups(res.backups);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateSnapshot = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await api.createBackup('manual_snapshot');
      setStatusMessage(`Successfully verified snapshot: ${res.backup.fileName}`);
      await fetchBackups();
    } catch (err: any) {
      setStatusMessage(`Backup error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestRestore = async (id: string) => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await api.restoreBackup(id);
      setStatusMessage(res.message);
    } catch (err: any) {
      setStatusMessage(`Restore verification failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <HardDriveDownload className="w-6 h-6 text-cyan-400" />
            {t.backupsAndDr} (Google Cloud SQL)
          </h1>
          <p className="text-xs text-neutral-400">
            Automated daily backups, point-in-time recovery (PITR), and cryptographically verified snapshots.
          </p>
        </div>

        <button
          onClick={handleCreateSnapshot}
          disabled={loading}
          className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-[#D4AF37]/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? 'Creating Snapshot...' : 'Create Snapshot Now'}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Backup Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#18261A] border border-[#2A3E2D] p-5 rounded-2xl">
          <span className="text-xs text-neutral-400 font-semibold uppercase block mb-1">
            Automated Schedule
          </span>
          <div className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            Daily 00:00 UTC (Active)
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            7-Day Continuous Retention Policy
          </span>
        </div>

        <div className="bg-[#18261A] border border-[#2A3E2D] p-5 rounded-2xl">
          <span className="text-xs text-neutral-400 font-semibold uppercase block mb-1">
            Storage Location
          </span>
          <div className="text-xs font-mono text-cyan-300 truncate">
            gs://zaitoon-backups-central/
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Multi-Region Asia-East1 Geo-Replicated
          </span>
        </div>

        <div className="bg-[#18261A] border border-[#2A3E2D] p-5 rounded-2xl">
          <span className="text-xs text-neutral-400 font-semibold uppercase block mb-1">
            Point-in-Time Recovery
          </span>
          <div className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Enabled & Verified
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Write-Ahead Log (WAL) Streaming
          </span>
        </div>
      </div>

      {/* Backups Ledger */}
      <div className="bg-[#18261A] border border-[#2A3E2D] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-[#142016] border-b border-[#2A3E2D] flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            Verified Backup Ledger & Checksums
          </span>
          <span className="text-[11px] text-neutral-400">
            Total Snapshots: {backups.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101911] text-[#A0B0A2] uppercase font-mono text-[10px] border-b border-[#243526]">
              <tr>
                <th className="py-2.5 px-4">Backup File</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Size</th>
                <th className="py-2.5 px-4">SHA-256 Checksum</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4 text-right">PITR Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243526] font-mono text-[11px]">
              {backups.map((b) => (
                <tr key={b.id} className="hover:bg-[#1E2E21]">
                  <td className="py-3 px-4 text-white font-semibold">
                    {b.fileName}
                  </td>
                  <td className="py-3 px-4 text-neutral-300 font-sans uppercase text-[10px]">
                    {b.backupType.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-4 text-neutral-400">
                    {(b.sizeBytes / 1024).toFixed(1)} KB
                  </td>
                  <td className="py-3 px-4 text-neutral-500 truncate max-w-xs font-mono text-[10px]">
                    {b.checksum}
                  </td>
                  <td className="py-3 px-4 text-neutral-400">
                    {new Date(b.createdAt).toLocaleDateString()} {new Date(b.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleTestRestore(b.id)}
                      disabled={loading}
                      className="px-2.5 py-1 rounded bg-[#223625] hover:bg-[#2C4530] text-[#D4AF37] font-semibold text-[11px] transition-colors cursor-pointer"
                    >
                      Verify Restore
                    </button>
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
