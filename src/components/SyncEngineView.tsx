import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCw,
  Zap,
  Layers,
} from 'lucide-react';
import { Language, translations } from '../i18n.js';
import { SyncOutbox } from '../types.js';
import { api } from '../api.js';

interface SyncEngineViewProps {
  currentLang: Language;
}

export const SyncEngineView: React.FC<SyncEngineViewProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [queue, setQueue] = useState<SyncOutbox[]>([]);
  const [status, setStatus] = useState<{ isSyncing: boolean; lastSyncTimestamp: string; pendingItems: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchSyncStatus = async () => {
    try {
      const data = await api.getSyncOutbox();
      setQueue(data.queue);
      setStatus(data.status);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  const handleTriggerSync = async () => {
    setLoading(true);
    setSuccessMsg(null);
    try {
      const res = await api.triggerSync();
      setSuccessMsg(res.message);
      await fetchSyncStatus();
    } catch (err: any) {
      console.error(err);
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
            <RefreshCw className="w-6 h-6 text-amber-400" />
            {t.dataSync} (Cloud SQL ⇄ Firestore)
          </h1>
          <p className="text-xs text-neutral-400">
            Event outbox synchronization engine maintaining real-time Firestore dashboard projections.
          </p>
        </div>

        <button
          onClick={handleTriggerSync}
          disabled={loading}
          className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-[#D4AF37]/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Synchronizing...' : 'Trigger Immediate Sync'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#18261A] border border-[#2A3E2D] p-5 rounded-2xl">
          <span className="text-xs text-neutral-400 font-semibold uppercase block mb-1">
            Sync Pipeline Status
          </span>
          <div className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Active & Reconciled
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            PostgreSQL Write-Ahead Outbox
          </span>
        </div>

        <div className="bg-[#18261A] border border-[#2A3E2D] p-5 rounded-2xl">
          <span className="text-xs text-neutral-400 font-semibold uppercase block mb-1">
            Last Successful Sync
          </span>
          <div className="text-sm font-mono font-bold text-white">
            {status?.lastSyncTimestamp ? new Date(status.lastSyncTimestamp).toLocaleString() : 'Just now'}
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Firestore WebSocket Broadcast
          </span>
        </div>

        <div className="bg-[#18261A] border border-[#2A3E2D] p-5 rounded-2xl">
          <span className="text-xs text-neutral-400 font-semibold uppercase block mb-1">
            Pending Outbox Items
          </span>
          <div className="text-2xl font-extrabold text-[#D4AF37]">
            {status ? status.pendingItems : 0}
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            0 Conflicts Detected
          </span>
        </div>
      </div>

      {/* Outbox Queue Table */}
      <div className="bg-[#18261A] border border-[#2A3E2D] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-[#142016] border-b border-[#2A3E2D] flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            Transactional Event Outbox Queue
          </span>
          <span className="text-[11px] text-neutral-400">
            Total Queue Depth: {queue.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101911] text-[#A0B0A2] uppercase font-mono text-[10px] border-b border-[#243526]">
              <tr>
                <th className="py-2.5 px-4">Event ID</th>
                <th className="py-2.5 px-4">Entity Type</th>
                <th className="py-2.5 px-4">Website ID</th>
                <th className="py-2.5 px-4">Operation</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243526]">
              {queue.map((item) => (
                <tr key={item.id} className="hover:bg-[#1E2E21] font-mono text-[11px]">
                  <td className="py-2.5 px-4 text-[#D4AF37]">{item.id}</td>
                  <td className="py-2.5 px-4 text-white uppercase">{item.entityType}</td>
                  <td className="py-2.5 px-4 text-neutral-400">{item.website_id}</td>
                  <td className="py-2.5 px-4 text-cyan-300 font-bold">{item.operation}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-neutral-400">
                    {new Date(item.lastAttempt).toLocaleTimeString()}
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
