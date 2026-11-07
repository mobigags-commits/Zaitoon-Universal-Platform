import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Download,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  Calendar,
  User,
  Mail,
  Phone,
  FileSpreadsheet,
} from 'lucide-react';
import { Language, translations } from '../i18n.js';
import { FormSubmission, Website } from '../types.js';

interface SubmissionsViewProps {
  currentLang: Language;
  submissions: FormSubmission[];
  websites: Website[];
  selectedWebsiteId: string;
  onUpdateStatus: (id: string, status: string, notes?: string) => Promise<void>;
  onDeleteSubmission: (id: string) => Promise<void>;
  onCreateSubmission: (data: any) => Promise<void>;
}

export const SubmissionsView: React.FC<SubmissionsViewProps> = ({
  currentLang,
  submissions,
  websites,
  selectedWebsiteId,
  onUpdateStatus,
  onDeleteSubmission,
  onCreateSubmission,
}) => {
  const t = translations[currentLang];
  const [siteFilter, setSiteFilter] = useState<string>(selectedWebsiteId);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [inspectSubmission, setInspectSubmission] = useState<FormSubmission | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New submission state
  const [newTargetSite, setNewTargetSite] = useState(websites[0]?.id || '');
  const [newFormKey, setNewFormKey] = useState('contact_or_application');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newPayloadNotes, setNewPayloadNotes] = useState('');

  const filtered = submissions.filter((sub) => {
    const matchSite = siteFilter === 'all' || sub.website_id === siteFilter;
    const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      (sub.customerName && sub.customerName.toLowerCase().includes(q)) ||
      (sub.customerEmail && sub.customerEmail.toLowerCase().includes(q)) ||
      sub.formName.toLowerCase().includes(q) ||
      sub.id.toLowerCase().includes(q) ||
      JSON.stringify(sub.data).toLowerCase().includes(q);
    return matchSite && matchStatus && matchSearch;
  });

  const exportToJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `zaitoon_submissions_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportToCsv = () => {
    const headers = ['ID', 'Website ID', 'Form Name', 'Customer Name', 'Email', 'Phone', 'Status', 'Date'];
    const rows = filtered.map((s) => [
      s.id,
      s.website_id,
      `"${s.formName}"`,
      `"${s.customerName || ''}"`,
      `"${s.customerEmail || ''}"`,
      `"${s.customerPhone || ''}"`,
      s.status,
      s.submittedAt,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `zaitoon_submissions_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCreateTestSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTargetSite || !newCustomerName) return;

    await onCreateSubmission({
      website_id: newTargetSite,
      formKey: newFormKey,
      formName: newFormKey.replace(/_/g, ' ').toUpperCase(),
      customerName: newCustomerName,
      customerEmail: newCustomerEmail,
      customerPhone: newCustomerPhone,
      data: {
        customerName: newCustomerName,
        customerEmail: newCustomerEmail,
        customerPhone: newCustomerPhone,
        notes: newPayloadNotes,
        source: 'Master Admin Manual / Client Emulation',
        verified: true,
      },
    });

    setIsNewModalOpen(false);
    setNewCustomerName('');
    setNewCustomerEmail('');
    setNewCustomerPhone('');
    setNewPayloadNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-emerald-400" />
            {t.submissions} & Central Data Hub
          </h1>
          <p className="text-xs text-neutral-400">
            Authoritative, tamper-evident PostgreSQL records with multi-tenant row isolation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportToCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#223625] hover:bg-[#2B4530] border border-[#335338] text-neutral-200 text-xs font-semibold transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>
          <button
            onClick={exportToJson}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#223625] hover:bg-[#2B4530] border border-[#335338] text-neutral-200 text-xs font-semibold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>JSON</span>
          </button>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8972E] hover:from-[#E5C158] hover:to-[#C5A059] text-neutral-950 font-bold px-3.5 py-2 rounded-xl text-xs shadow-md shadow-[#D4AF37]/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Submission</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#18261A] border border-[#2A3E2D] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-[260px] bg-[#1E2E21] border border-[#2D4532] px-3 py-2 rounded-xl text-xs">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, email, form type, or data payload..."
            className="bg-transparent text-white placeholder-neutral-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Website Filter */}
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="bg-[#1E2E21] border border-[#2D4532] text-neutral-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer max-w-[200px]"
          >
            <option value="all" className="bg-[#18261A] text-white">
              All Websites ({websites.length})
            </option>
            {websites.map((w) => (
              <option key={w.id} value={w.id} className="bg-[#18261A] text-white">
                {w.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1E2E21] border border-[#2D4532] text-neutral-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#18261A] text-white">All Statuses</option>
            <option value="pending" className="bg-[#18261A] text-white">Pending Approval</option>
            <option value="in_review" className="bg-[#18261A] text-white">In Review</option>
            <option value="approved" className="bg-[#18261A] text-white">Approved</option>
            <option value="rejected" className="bg-[#18261A] text-white">Rejected</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-[#18261A] border border-[#2A3E2D] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#142016] text-[#A0B0A2] uppercase tracking-wider font-semibold border-b border-[#2A3E2D] text-[10px]">
              <tr>
                <th className="py-3 px-4">Customer / Applicant</th>
                <th className="py-3 px-4">Origin Website</th>
                <th className="py-3 px-4">Form Purpose</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243526]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    No submissions found matching the criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => {
                  const site = websites.find((w) => w.id === sub.website_id);
                  return (
                    <tr key={sub.id} className="hover:bg-[#1E2E21]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">
                          {sub.customerName || 'Anonymous Customer'}
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                          {sub.customerEmail && <span>{sub.customerEmail}</span>}
                          {sub.customerPhone && <span>• {sub.customerPhone}</span>}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-neutral-200 block truncate max-w-[180px]">
                          {site ? site.name : sub.website_id}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {sub.website_id}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-[#223625] text-neutral-200 border border-[#2D4532] text-[11px] font-medium">
                          {sub.formName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">
                        {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1 ${
                            sub.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : sub.status === 'in_review'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : sub.status === 'rejected'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              sub.status === 'approved'
                                ? 'bg-emerald-400'
                                : sub.status === 'in_review'
                                ? 'bg-sky-400'
                                : sub.status === 'rejected'
                                ? 'bg-rose-400'
                                : 'bg-amber-400'
                            }`}
                          ></span>
                          {sub.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectSubmission(sub)}
                            className="p-1.5 rounded-lg bg-[#223625] hover:bg-[#2C4530] text-[#D4AF37] transition-colors"
                            title="Inspect Payload"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {sub.status !== 'approved' && (
                            <button
                              onClick={() => onUpdateStatus(sub.id, 'approved')}
                              className="p-1.5 rounded-lg bg-[#223625] hover:bg-[#2C4530] text-emerald-400 transition-colors"
                              title="Approve Submission"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (window.confirm('Delete submission permanently?')) {
                                onDeleteSubmission(sub.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Submission Modal */}
      {inspectSubmission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18261A] border border-[#2D4532] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#2C412F]">
              <div>
                <h3 className="text-base font-bold text-white">
                  Submission Payload: {inspectSubmission.formName}
                </h3>
                <span className="text-[11px] text-neutral-400 font-mono">
                  ID: {inspectSubmission.id} • IP: {inspectSubmission.ipAddress}
                </span>
              </div>
              <button
                onClick={() => setInspectSubmission(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#121C14] border border-[#243526] p-3 rounded-xl text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block">Customer Name</span>
                <span className="font-semibold text-white">{inspectSubmission.customerName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block">Email Address</span>
                <span className="font-semibold text-white truncate block">{inspectSubmission.customerEmail || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block">Phone / Mobile</span>
                <span className="font-semibold text-white">{inspectSubmission.customerPhone || 'N/A'}</span>
              </div>
            </div>

            {/* JSON Payload viewer */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-300 block">
                Structured Field Data (Stored in PostgreSQL JSONB column)
              </span>
              <pre className="bg-[#0E150F] border border-[#243526] p-3.5 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto">
                {JSON.stringify(inspectSubmission.data, null, 2)}
              </pre>
            </div>

            {/* Audit Trail */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-300 block">Audit Trail</span>
              <div className="space-y-1">
                {inspectSubmission.auditTrail.map((log, idx) => (
                  <div key={idx} className="text-[11px] text-neutral-400 flex items-center justify-between bg-[#1E2E21] px-3 py-1.5 rounded-lg">
                    <span className="text-white font-medium">{log.action}</span>
                    <span>by {log.by} at {new Date(log.at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#2C412F] text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    await onUpdateStatus(inspectSubmission.id, 'approved');
                    setInspectSubmission({ ...inspectSubmission, status: 'approved' });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
                >
                  Approve
                </button>
                <button
                  onClick={async () => {
                    await onUpdateStatus(inspectSubmission.id, 'in_review');
                    setInspectSubmission({ ...inspectSubmission, status: 'in_review' });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold cursor-pointer"
                >
                  Mark In Review
                </button>
                <button
                  onClick={async () => {
                    await onUpdateStatus(inspectSubmission.id, 'rejected');
                    setInspectSubmission({ ...inspectSubmission, status: 'rejected' });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold cursor-pointer"
                >
                  Reject
                </button>
              </div>

              <button
                onClick={() => setInspectSubmission(null)}
                className="px-4 py-1.5 rounded-lg text-neutral-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Test Submission Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18261A] border border-[#2D4532] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#2C412F]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#D4AF37]" />
                Emulate Live Form Submission
              </h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTestSubmission} className="space-y-3">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Target Website *</label>
                <select
                  value={newTargetSite}
                  onChange={(e) => setNewTargetSite(e.target.value)}
                  className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  {websites.map((w) => (
                    <option key={w.id} value={w.id} className="bg-[#18261A] text-white">
                      {w.name} ({w.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Form Key</label>
                  <input
                    type="text"
                    value={newFormKey}
                    onChange={(e) => setNewFormKey(e.target.value)}
                    className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Additional Payload Details / Notes</label>
                <textarea
                  rows={3}
                  value={newPayloadNotes}
                  onChange={(e) => setNewPayloadNotes(e.target.value)}
                  placeholder="e.g. Requested evening slot, 3-day trial booking..."
                  className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C412F]">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-neutral-950 font-bold shadow-md cursor-pointer"
                >
                  Save Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
