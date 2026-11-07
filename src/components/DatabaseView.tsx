import React, { useState } from 'react';
import {
  Database,
  Terminal,
  Play,
  Shield,
  Layers,
  Table,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Lock,
} from 'lucide-react';
import { Language, translations } from '../i18n.js';
import { api } from '../api.js';

interface DatabaseViewProps {
  currentLang: Language;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<'tables' | 'sql' | 'rls'>('tables');
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM zaitoon_websites LIMIT 10;');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const sampleQueries = [
    { label: 'All Connected Websites', query: 'SELECT id, name, category, status, url FROM zaitoon_websites;' },
    { label: 'Recent Submissions', query: 'SELECT id, website_id, form_name, customer_name, status FROM zaitoon_submissions;' },
    { label: 'Platform Users & Roles', query: 'SELECT id, email, full_name, role, status FROM zaitoon_users;' },
    { label: 'Check RLS Policies', query: 'SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE schemaname = \'public\';' },
  ];

  const handleExecute = async () => {
    setIsExecuting(true);
    setQueryError(null);
    try {
      const res = await api.executeSql(sqlQuery);
      setQueryResult(res);
    } catch (err: any) {
      setQueryError(err.message || 'SQL execution failed');
      setQueryResult(null);
    } finally {
      setIsExecuting(false);
    }
  };

  const tables = [
    { name: 'zaitoon_websites', rows: 9, size: '64 KB', desc: 'Central registry of all 9 connected websites and future additions' },
    { name: 'zaitoon_submissions', rows: 5, size: '128 KB', desc: 'Multi-tenant form records, leads, admissions, bookings' },
    { name: 'zaitoon_orders', rows: 3, size: '48 KB', desc: 'Financial transactions, decor bookings, escrow milestones' },
    { name: 'zaitoon_users', rows: 4, size: '32 KB', desc: 'Firebase Auth & PostgreSQL centralized credentials & roles' },
    { name: 'zaitoon_audit_logs', rows: 8, size: '256 KB', desc: 'Tamper-evident cybersecurity audit ledger' },
    { name: 'zaitoon_sync_outbox', rows: 1, size: '24 KB', desc: 'PostgreSQL to Firestore outbox synchronization queue' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Database className="w-6 h-6 text-cyan-400" />
            {t.centralDb} (Google Cloud SQL)
          </h1>
          <p className="text-xs text-neutral-400">
            Authoritative relational engine (PostgreSQL 16) with schema isolation and Row-Level Security.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-[#18261A] border border-[#2A3E2D] p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'tables' ? 'bg-[#283E2D] text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Table Schemas
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'sql' ? 'bg-[#283E2D] text-[#D4AF37] shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            SQL Console
          </button>
          <button
            onClick={() => setActiveTab('rls')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'rls' ? 'bg-[#283E2D] text-emerald-400 shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            RLS Tenant Security
          </button>
        </div>
      </div>

      {/* Tab: Tables */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((tbl) => (
            <div key={tbl.name} className="bg-[#18261A] border border-[#2A3E2D] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-neutral-400" />
                  {tbl.name}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Partitioned
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {tbl.desc}
              </p>
              <div className="pt-2 border-t border-[#263A29] flex items-center justify-between text-xs text-neutral-400">
                <span>Total Rows: <strong className="text-white">{tbl.rows}</strong></span>
                <span>Storage: <strong className="text-white">{tbl.size}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: SQL Console */}
      {activeTab === 'sql' && (
        <div className="space-y-4">
          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400 font-semibold mr-1">Quick Queries:</span>
            {sampleQueries.map((sq, i) => (
              <button
                key={i}
                onClick={() => setSqlQuery(sq.query)}
                className="px-2.5 py-1 rounded-lg bg-[#1E2E21] hover:bg-[#283E2D] border border-[#2D4532] text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                {sq.label}
              </button>
            ))}
          </div>

          {/* Editor box */}
          <div className="bg-[#121C14] border border-[#2A3E2D] rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-[#0E150F] px-4 py-2 border-b border-[#243526] flex items-center justify-between text-xs">
              <span className="font-mono text-[#D4AF37] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> Google Cloud SQL Query Runner (PostgreSQL 16)
              </span>
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="flex items-center gap-1.5 bg-[#D4AF37] hover:bg-[#E5C158] text-neutral-950 font-bold px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isExecuting ? 'Running...' : 'Execute SQL'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full bg-transparent p-4 font-mono text-xs text-emerald-300 focus:outline-none resize-none"
            />
          </div>

          {/* Error message */}
          {queryError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {queryError}
            </div>
          )}

          {/* Query Results */}
          {queryResult && (
            <div className="bg-[#18261A] border border-[#2A3E2D] rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 py-2 bg-[#142016] border-b border-[#243526] text-xs text-neutral-400 flex items-center justify-between">
                <span>Result: {queryResult.rowCount} rows returned</span>
                <span className="text-emerald-400 font-mono text-[11px]">Execution time: ~12ms</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#101911] text-[#A0B0A2] uppercase font-mono text-[10px] border-b border-[#243526]">
                    <tr>
                      {queryResult.columns.map((c: string) => (
                        <th key={c} className="py-2.5 px-4">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#243526] font-mono text-[11px]">
                    {queryResult.rows.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-[#1E2E21]">
                        {queryResult.columns.map((c: string) => (
                          <td key={c} className="py-2 px-4 text-neutral-200 truncate max-w-xs">
                            {typeof row[c] === 'object' ? JSON.stringify(row[c]) : String(row[c] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Row-Level Security (RLS) */}
      {activeTab === 'rls' && (
        <div className="bg-[#18261A] border border-[#2A3E2D] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Row-Level Security (RLS) Multi-Tenant Policies
            </h2>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            In accordance with Enterprise Security standards, each website’s queries are strictly bound to its verified <code className="text-[#D4AF37]">website_id</code>. No website can access or corrupt records belonging to another tenant.
          </p>

          <div className="space-y-3 pt-2 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#121C14] border border-[#243526]">
              <span className="text-cyan-400 font-bold block mb-1">
                POLICY website_tenant_isolation ON zaitoon_submissions
              </span>
              <p className="text-neutral-400 text-[11px]">
                FOR ALL TO application_role USING (website_id = current_setting('app.current_website_id', true) OR current_setting('app.user_role') = 'super_admin');
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121C14] border border-[#243526]">
              <span className="text-cyan-400 font-bold block mb-1">
                POLICY website_orders_isolation ON zaitoon_orders
              </span>
              <p className="text-neutral-400 text-[11px]">
                FOR SELECT, INSERT TO application_role USING (website_id = current_setting('app.current_website_id', true) OR current_setting('app.user_role') = 'super_admin');
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
