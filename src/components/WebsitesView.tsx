import React, { useState } from 'react';
import {
  Globe,
  Search,
  Filter,
  ExternalLink,
  Key,
  RotateCw,
  Trash2,
  CheckCircle,
  AlertCircle,
  Activity,
  Code2,
  Shield,
  Layers,
  Settings,
  Copy,
  Eye,
  EyeOff,
  Check,
  PlusCircle,
} from 'lucide-react';
import { Language, translations } from '../i18n.js';
import { Website, WebsiteCategory } from '../types.js';

interface WebsitesViewProps {
  currentLang: Language;
  websites: Website[];
  onOpenAddModal: () => void;
  onUpdateWebsite: (id: string, data: Partial<Website>) => Promise<void>;
  onRegenerateKey: (id: string) => Promise<void>;
  onDeleteWebsite: (id: string) => Promise<void>;
  onSelectWebsiteForSnippet: (websiteId: string) => void;
}

export const WebsitesView: React.FC<WebsitesViewProps> = ({
  currentLang,
  websites,
  onOpenAddModal,
  onUpdateWebsite,
  onRegenerateKey,
  onDeleteWebsite,
  onSelectWebsiteForSnippet,
}) => {
  const t = translations[currentLang];
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [inspectWebsite, setInspectWebsite] = useState<Website | null>(null);

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Categories' },
    { id: 'education', label: 'Quran & Islamic Education' },
    { id: 'events', label: 'Events & Decor' },
    { id: 'marketplace', label: 'Freelance & Tech Talent' },
    { id: 'transport', label: 'Transit & Fares' },
    { id: 'testing_service', label: 'Testing Service (ZTS)' },
    { id: 'matrimonial', label: 'Matrimonial Bureau' },
    { id: 'higher_education', label: 'World Degrees & Diplomas' },
    { id: 'ecommerce', label: 'E-Commerce & Community' },
    { id: 'real_estate', label: 'Real Estate & Properties' },
  ];

  const filtered = websites.filter((site) => {
    const matchCat = selectedCategory === 'all' || site.category === selectedCategory;
    const matchStat = selectedStatus === 'all' || site.status === selectedStatus;
    const q = search.toLowerCase();
    const matchSearch =
      site.name.toLowerCase().includes(q) ||
      site.url.toLowerCase().includes(q) ||
      site.id.toLowerCase().includes(q) ||
      site.description.toLowerCase().includes(q);
    return matchCat && matchStat && matchSearch;
  });

  const toggleKeyVisibility = (id: string) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-[#D4AF37]" />
            {t.connectedWebsites}
          </h1>
          <p className="text-xs text-neutral-400">
            Manage all 9 verified production platforms and expand with unlimited future websites.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8972E] hover:from-[#E5C158] hover:to-[#C5A059] text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.addNewWebsite}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#18261A] border border-[#2A3E2D] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-[260px] bg-[#1E2E21] border border-[#2D4532] px-3 py-2 rounded-xl text-xs">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="bg-transparent text-white placeholder-neutral-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#1E2E21] border border-[#2D4532] text-neutral-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#18261A] text-white">
                {c.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#1E2E21] border border-[#2D4532] text-neutral-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#18261A] text-white">All Statuses</option>
            <option value="active" className="bg-[#18261A] text-white">Active</option>
            <option value="maintenance" className="bg-[#18261A] text-white">Maintenance</option>
            <option value="suspended" className="bg-[#18261A] text-white">Suspended</option>
          </select>
        </div>
      </div>

      {/* Website Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((site) => {
          const isRevealed = revealedKeys[site.id];
          const isCopied = copiedKey === site.id;
          const isHealthy = site.health.status === 'healthy';

          return (
            <div
              key={site.id}
              className="bg-[#18261A] border border-[#2A3E2D] hover:border-[#3E5C42] rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between space-y-4 group"
            >
              {/* Header: Title, Category, Status */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#223625] text-[#D4AF37] border border-[#D4AF37]/30">
                    {site.category.replace(/_/g, ' ')}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        site.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : site.status === 'maintenance'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          site.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      ></span>
                      {site.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {site.name}
                  </h3>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 mt-0.5 truncate"
                  >
                    <span>{site.url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>

                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                  {site.description}
                </p>

                {/* Telemetry pill */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#263A29] text-[11px]">
                  <div className="bg-[#1E2E21] p-2 rounded-lg">
                    <span className="text-neutral-400 block text-[10px] uppercase">Latency / Uptime</span>
                    <span className="font-semibold text-white">
                      {isHealthy ? `${site.health.latencyMs}ms` : 'Offline'} ({site.health.uptimePercentage}%)
                    </span>
                  </div>
                  <div className="bg-[#1E2E21] p-2 rounded-lg">
                    <span className="text-neutral-400 block text-[10px] uppercase">Postgres Records</span>
                    <span className="font-semibold text-[#D4AF37]">
                      {site.stats.totalSubmissions} Submissions
                    </span>
                  </div>
                </div>

                {/* API Key box */}
                <div className="bg-[#142016] border border-[#243526] rounded-xl p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase font-semibold">
                    <span className="flex items-center gap-1">
                      <Key className="w-3 h-3 text-[#D4AF37]" /> Bearer API Token
                    </span>
                    <button
                      onClick={() => onRegenerateKey(site.id)}
                      className="text-neutral-400 hover:text-[#D4AF37] flex items-center gap-0.5 lowercase font-normal"
                      title="Rotate Token"
                    >
                      <RotateCw className="w-2.5 h-2.5" /> rotate
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                    <span className="text-neutral-300 truncate">
                      {isRevealed ? site.apiKey : `${site.apiKey.slice(0, 12)}••••••••••••••••`}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleKeyVisibility(site.id)}
                        className="p-1 text-neutral-400 hover:text-white rounded"
                        title={isRevealed ? 'Hide' : 'Reveal'}
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(site.apiKey, site.id)}
                        className="p-1 text-neutral-400 hover:text-[#D4AF37] rounded"
                        title="Copy API Token"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#263A29] flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => onSelectWebsiteForSnippet(site.id)}
                  className="flex items-center gap-1.5 text-neutral-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-[#223625] hover:bg-[#2C4530] text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Integration SDK</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setInspectWebsite(site)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#223625] hover:bg-[#2C4530] text-[#D4AF37] text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`${t.deleteWebsiteWarning}\nWebsite: ${site.name}`)) {
                        onDeleteWebsite(site.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Deregister Connection (Safeguarded)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Website Settings Modal */}
      {inspectWebsite && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18261A] border border-[#2D4532] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2C412F]">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-base font-bold text-white">
                  Configure {inspectWebsite.name}
                </h3>
              </div>
              <button
                onClick={() => setInspectWebsite(null)}
                className="text-neutral-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">
                  Tenant Website ID (Immutable)
                </label>
                <input
                  type="text"
                  disabled
                  value={inspectWebsite.id}
                  className="w-full bg-[#121C14] border border-[#243526] rounded-xl px-3 py-2 text-neutral-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Website Display Name
                </label>
                <input
                  type="text"
                  value={inspectWebsite.name}
                  onChange={(e) =>
                    setInspectWebsite({ ...inspectWebsite, name: e.target.value })
                  }
                  className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Status
                </label>
                <select
                  value={inspectWebsite.status}
                  onChange={(e) =>
                    setInspectWebsite({
                      ...inspectWebsite,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="active">Active & Operational</option>
                  <option value="maintenance">Maintenance Mode</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Custom Domain
                </label>
                <input
                  type="text"
                  value={inspectWebsite.domain || ''}
                  onChange={(e) =>
                    setInspectWebsite({ ...inspectWebsite, domain: e.target.value })
                  }
                  placeholder="e.g. quran.zaitoon.org"
                  className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Webhook URL (For Real-Time Events)
                </label>
                <input
                  type="text"
                  value={inspectWebsite.webhookUrl || ''}
                  onChange={(e) =>
                    setInspectWebsite({ ...inspectWebsite, webhookUrl: e.target.value })
                  }
                  placeholder="https://.../api/webhook"
                  className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2C412F]">
              <button
                onClick={() => setInspectWebsite(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
              >
                {t.cancel}
              </button>
              <button
                onClick={async () => {
                  await onUpdateWebsite(inspectWebsite.id, inspectWebsite);
                  setInspectWebsite(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#E5C158] text-neutral-950 shadow-md cursor-pointer"
              >
                {t.saveChanges}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
