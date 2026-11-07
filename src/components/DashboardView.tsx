import React from 'react';
import {
  Globe,
  FileText,
  ShoppingBag,
  Database,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  Zap,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Language, translations } from '../i18n.js';
import { Website, FormSubmission, DashboardMetrics, AuditLog } from '../types.js';

interface DashboardViewProps {
  currentLang: Language;
  metrics: DashboardMetrics | null;
  websites: Website[];
  submissions: FormSubmission[];
  recentActivity: AuditLog[];
  onSelectTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onPingAll: () => void;
  isPinging: boolean;
  onTriggerSync: () => void;
  onSelectWebsite: (websiteId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentLang,
  metrics,
  websites,
  submissions,
  recentActivity,
  onSelectTab,
  onOpenAddModal,
  onPingAll,
  isPinging,
  onTriggerSync,
  onSelectWebsite,
}) => {
  const t = translations[currentLang];
  const activeCount = websites.filter((w) => w.status === 'active').length;
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Welcome & Command Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E2E21] via-[#243A28] to-[#1B291D] border border-[#2D4532] p-6 lg:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Enterprise Network Central Hub
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                9 Vercel Frontends Attached
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {t.controlCenter}
            </h1>
            <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed">
              Zaitoon Universal Platform connects and orchestrates all 9 production Vercel web applications with central PostgreSQL persistence, Cloud Firestore real-time projections, and automated multi-tenant isolation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onPingAll}
              disabled={isPinging}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#283E2D] hover:bg-[#33503A] border border-[#3D6146] text-xs font-semibold text-emerald-300 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <Activity className={`w-4 h-4 ${isPinging ? 'animate-spin text-[#D4AF37]' : ''}`} />
              <span>{isPinging ? 'Pinging 9 Websites...' : t.runHealthPing}</span>
            </button>

            <button
              onClick={onTriggerSync}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#283E2D] hover:bg-[#33503A] border border-[#3D6146] text-xs font-semibold text-amber-300 shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync Outbox to Firestore</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8972E] hover:from-[#E5C158] hover:to-[#C5A059] text-neutral-950 text-xs font-bold shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.addNewWebsite}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Connected Websites */}
        <div
          onClick={() => onSelectTab('websites')}
          className="bg-[#18261A] hover:bg-[#1E3022] border border-[#2A3E2D] p-5 rounded-2xl shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A0B0A2]">
              {t.totalWebsites}
            </span>
            <div className="p-2 rounded-xl bg-[#223625] text-[#D4AF37] group-hover:scale-110 transition-transform">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {websites.length}
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              {activeCount} Active
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-400 flex items-center justify-between">
            <span>Vercel + Cloud Run</span>
            <span className="text-[#D4AF37] flex items-center gap-1 group-hover:underline">
              Manage <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Total Form Submissions */}
        <div
          onClick={() => onSelectTab('submissions')}
          className="bg-[#18261A] hover:bg-[#1E3022] border border-[#2A3E2D] p-5 rounded-2xl shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A0B0A2]">
              {t.totalSubmissions}
            </span>
            <div className="p-2 rounded-xl bg-[#223625] text-emerald-400 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {metrics ? metrics.totalSubmissions : submissions.length}
            </span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <div className="mt-2 text-xs text-neutral-400 flex items-center justify-between">
            <span>PostgreSQL Authoritative</span>
            <span className="text-emerald-400 flex items-center gap-1 group-hover:underline">
              View Hub <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Orders & Total Revenue */}
        <div
          onClick={() => onSelectTab('orders')}
          className="bg-[#18261A] hover:bg-[#1E3022] border border-[#2A3E2D] p-5 rounded-2xl shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A0B0A2]">
              {t.totalRevenue}
            </span>
            <div className="p-2 rounded-xl bg-[#223625] text-[#D4AF37] group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#D4AF37]">
              PKR {metrics ? metrics.totalRevenuePKR.toLocaleString() : '164,800'}
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-400 flex items-center justify-between">
            <span>Verified Bookings & Escrow</span>
            <span className="text-[#D4AF37] flex items-center gap-1 group-hover:underline">
              Ledger <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Central Database Health */}
        <div
          onClick={() => onSelectTab('database')}
          className="bg-[#18261A] hover:bg-[#1E3022] border border-[#2A3E2D] p-5 rounded-2xl shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A0B0A2]">
              Central Database (Cloud SQL)
            </span>
            <div className="p-2 rounded-xl bg-[#223625] text-cyan-400 group-hover:scale-110 transition-transform">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              PostgreSQL 16
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-400 flex items-center justify-between">
            <span>Row-Level Security Active</span>
            <span className="text-cyan-400 flex items-center gap-1 group-hover:underline">
              SQL Console <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Network Websites Live Matrix */}
      <div className="bg-[#18261A] border border-[#2A3E2D] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#D4AF37]" />
              Zaitoon Connected Websites Network (All 9 Verified)
            </h2>
            <p className="text-xs text-neutral-400">
              Live monitoring, response times, and isolated tenant partitions for every connected platform.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('websites')}
            className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
          >
            View Full Registry ({websites.length}) <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {websites.map((site) => {
            const isHealthy = site.health.status === 'healthy';
            return (
              <div
                key={site.id}
                className="bg-[#1D2E20] hover:bg-[#233827] border border-[#2F4733] rounded-xl p-4 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#273E2B] text-neutral-300 border border-[#39563E]">
                      {site.category.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isHealthy
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                      {isHealthy ? `${site.health.latencyMs}ms` : 'Degraded'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                      {site.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                      {site.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#2C412F] flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-[#A0B0A2] truncate max-w-[140px]">
                    {site.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#2C412F]"
                      title="Open Live Vercel Frontend"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => onSelectWebsite(site.id)}
                      className="text-[11px] font-semibold text-[#D4AF37] hover:underline"
                    >
                      Inspect Data
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Recent Form Submissions & Cloud Infrastructure Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Form Submissions (2 cols) */}
        <div className="lg:col-span-2 bg-[#18261A] border border-[#2A3E2D] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Live Form Submissions & Leads
              </h2>
              <p className="text-xs text-neutral-400">
                Persistent records saved to PostgreSQL with full validation and customer data.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('submissions')}
              className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              View All Submissions <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#263A29]">
            {submissions.slice(0, 5).map((sub) => {
              const site = websites.find((w) => w.id === sub.website_id);
              return (
                <div key={sub.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm truncate">
                        {sub.customerName || 'Anonymous Applicant'}
                      </span>
                      <span className="text-xs text-neutral-400 truncate hidden sm:inline">
                        • {sub.formName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <span className="text-[#D4AF37] font-medium">{site?.name || sub.website_id}</span>
                      <span>•</span>
                      <span>{new Date(sub.submittedAt).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        sub.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : sub.status === 'in_review'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {sub.status.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() => onSelectTab('submissions')}
                      className="text-xs text-neutral-300 hover:text-white p-1"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Google Cloud Infrastructure & Real-Time Sync Status */}
        <div className="bg-[#18261A] border border-[#2A3E2D] rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Hybrid Google Cloud Status
            </h2>
            <p className="text-xs text-neutral-400">
              PostgreSQL source-of-truth paired with Cloud Firestore real-time projections.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#1E2E21] border border-[#2D4532] flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Google Cloud SQL (PostgreSQL)</div>
                <div className="text-[11px] text-neutral-400">Authoritative Business Store & RLS</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                ACTIVE
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#1E2E21] border border-[#2D4532] flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Google Cloud Run (Core API)</div>
                <div className="text-[11px] text-neutral-400">Auto-scaling REST API v1</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                HEALTHY
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#1E2E21] border border-[#2D4532] flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Cloud Firestore Projections</div>
                <div className="text-[11px] text-neutral-400">Real-time Outbox Sync Engine</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                SYNCED
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#1E2E21] border border-[#2D4532] flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Firebase Authentication</div>
                <div className="text-[11px] text-neutral-400">Multi-Factor & RBAC Claims</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                SECURED
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectTab('sync')}
              className="w-full py-2 px-3 rounded-xl bg-[#263B2A] hover:bg-[#314C36] text-[#D4AF37] font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Inspect Sync Outbox Queue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
