import React from 'react';
import {
  Server,
  Cloud,
  Database,
  Lock,
  Layers,
  Key,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Language, translations } from '../i18n.js';

interface SettingsViewProps {
  currentLang: Language;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Server className="w-6 h-6 text-emerald-400" />
          {t.systemSettings} & Google Cloud Topology
        </h1>
        <p className="text-xs text-neutral-400">
          Enterprise hybrid architecture connecting Google Cloud Run, Cloud SQL, Cloud Firestore, and Vercel.
        </p>
      </div>

      {/* Cloud Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Google Cloud Run */}
        <div className="bg-[#18261A] border border-[#2A3E2D] p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2">
              <Cloud className="w-4 h-4 text-cyan-400" />
              Zaitoon Core API (Google Cloud Run)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
              OPERATIONAL
            </span>
          </div>
          <p className="text-neutral-300 leading-relaxed">
            Stateless microservice auto-scaling across Asia-East1 region. Handles versioned REST API traffic from all 9 Vercel frontends.
          </p>
          <div className="p-3 bg-[#121C14] rounded-xl font-mono text-[11px] text-neutral-400 space-y-1">
            <div>Region: <span className="text-white">asia-east1 (Taiwan)</span></div>
            <div>Min Instances: <span className="text-white">1 (Zero-cold-start)</span></div>
            <div>Max Instances: <span className="text-white">100 (Auto-scaling)</span></div>
          </div>
        </div>

        {/* Google Cloud SQL PostgreSQL */}
        <div className="bg-[#18261A] border border-[#2A3E2D] p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Zaitoon Central Database (Cloud SQL)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
              CONNECTED
            </span>
          </div>
          <p className="text-neutral-300 leading-relaxed">
            Primary authoritative system of record. Enforces multi-tenant Row-Level Security, automated backups, and encryption at rest.
          </p>
          <div className="p-3 bg-[#121C14] rounded-xl font-mono text-[11px] text-neutral-400 space-y-1">
            <div>Engine: <span className="text-white">PostgreSQL 16.2</span></div>
            <div>High Availability: <span className="text-white">Regional Failover</span></div>
            <div>Connection Pool: <span className="text-white">pgBouncer Active</span></div>
          </div>
        </div>

        {/* Cloud Firestore Projections */}
        <div className="bg-[#18261A] border border-[#2A3E2D] p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Cloud Firestore Projections
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
              SYNCHRONIZED
            </span>
          </div>
          <p className="text-neutral-300 leading-relaxed">
            Real-time NoSQL cache for live dashboard streaming and client notifications fed by the PostgreSQL outbox queue.
          </p>
          <div className="p-3 bg-[#121C14] rounded-xl font-mono text-[11px] text-neutral-400 space-y-1">
            <div>Mode: <span className="text-white">Firestore Native</span></div>
            <div>Real-Time Listeners: <span className="text-white">Active</span></div>
          </div>
        </div>

        {/* Firebase Authentication & Google Secret Manager */}
        <div className="bg-[#18261A] border border-[#2A3E2D] p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              Security & Google Secret Manager
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
              SECURED
            </span>
          </div>
          <p className="text-neutral-300 leading-relaxed">
            Automated credential rotation and server-side secret injection. All private keys and database passwords reside strictly on the server.
          </p>
          <div className="p-3 bg-[#121C14] rounded-xl font-mono text-[11px] text-neutral-400 space-y-1">
            <div>Auth: <span className="text-white">Firebase Auth (OAuth & Passwords)</span></div>
            <div>Zero-Trust: <span className="text-white">Strict CORS & CSP Enforced</span></div>
          </div>
        </div>
      </div>

      {/* Deployment & Vercel Instructions */}
      <div className="bg-[#18261A] border border-[#2A3E2D] p-6 rounded-2xl space-y-3 text-xs">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
          Production Deployment Architecture (Vercel + Cloud Run)
        </h2>
        <div className="space-y-2 text-neutral-300 leading-relaxed">
          <p>
            1. <strong>All 9 Frontend Websites:</strong> Remain hosted on Vercel with zero downtime. Connect to Zaitoon Core API using the Client Integration SDK.
          </p>
          <p>
            2. <strong>Zaitoon Master Admin:</strong> Deployed as a dedicated high-security portal on Vercel or Cloud Run.
          </p>
          <p>
            3. <strong>Zaitoon Core API:</strong> Running on Google Cloud Run with unified CORS headers allowing all 9 verified domains.
          </p>
        </div>
      </div>
    </div>
  );
};
