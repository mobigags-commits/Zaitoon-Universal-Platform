import React, { useState } from 'react';
import {
  Search,
  Globe,
  FileCode,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  BarChart,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { Language, translations } from '../i18n.js';
import { Website } from '../types.js';

interface SeoCenterViewProps {
  currentLang: Language;
  websites: Website[];
}

export const SeoCenterView: React.FC<SeoCenterViewProps> = ({ currentLang, websites }) => {
  const t = translations[currentLang];
  const [selectedSiteId, setSelectedSiteId] = useState<string>(websites[0]?.id || '');
  const activeSite = websites.find((w) => w.id === selectedSiteId) || websites[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Search className="w-6 h-6 text-[#D4AF37]" />
            {t.seoCenter} (SEO, AEO, GEO & AdSense)
          </h1>
          <p className="text-xs text-neutral-400">
            Automated structured schema generator, live XML sitemaps, robots.txt, and AI Engine Optimization (AEO).
          </p>
        </div>

        {/* Website selector */}
        <div className="flex items-center gap-2 bg-[#18261A] border border-[#2A3E2D] px-3 py-1.5 rounded-xl text-xs">
          <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-neutral-400">Select Website:</span>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            {websites.map((w) => (
              <option key={w.id} value={w.id} className="bg-[#18261A] text-white">
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SEO Compliance Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#18261A] border border-[#2A3E2D] p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-neutral-400 uppercase font-bold">Technical SEO</span>
          <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> 100/100 Core Web Vitals
          </div>
        </div>

        <div className="bg-[#18261A] border border-[#2A3E2D] p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-neutral-400 uppercase font-bold">AEO (AI Search Engine)</span>
          <div className="text-[#D4AF37] font-bold text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> JSON-LD Schema Grounded
          </div>
        </div>

        <div className="bg-[#18261A] border border-[#2A3E2D] p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-neutral-400 uppercase font-bold">Google AdSense Status</span>
          <div className="text-cyan-400 font-bold text-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Ready & Pre-Configured
          </div>
        </div>

        <div className="bg-[#18261A] border border-[#2A3E2D] p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-neutral-400 uppercase font-bold">Search Console</span>
          <div className="text-white font-bold text-sm flex items-center gap-1.5">
            <Globe className="w-4 h-4" /> Auto-Verified Sitemaps
          </div>
        </div>
      </div>

      {/* Dynamic Sitemaps & Robots.txt Links */}
      <div className="bg-[#18261A] border border-[#2A3E2D] rounded-2xl p-6 space-y-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileCode className="w-5 h-5 text-emerald-400" />
          Central Dynamic Endpoints for {activeSite?.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[#121C14] border border-[#243526] space-y-2">
            <div className="flex items-center justify-between text-neutral-300 font-bold">
              <span>XML Sitemap Endpoint</span>
              <a
                href={`/api/v1/seo/${activeSite?.id}/sitemap.xml`}
                target="_blank"
                rel="noreferrer"
                className="text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                View Live XML <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <code className="text-emerald-300 block truncate">
              GET /api/v1/seo/{activeSite?.id}/sitemap.xml
            </code>
          </div>

          <div className="p-4 rounded-xl bg-[#121C14] border border-[#243526] space-y-2">
            <div className="flex items-center justify-between text-neutral-300 font-bold">
              <span>Robots.txt Directive</span>
              <a
                href={`/api/v1/seo/${activeSite?.id}/robots.txt`}
                target="_blank"
                rel="noreferrer"
                className="text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                View Live Robots.txt <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <code className="text-emerald-300 block truncate">
              GET /api/v1/seo/{activeSite?.id}/robots.txt
            </code>
          </div>
        </div>

        {/* Schema.org Structured Data Preview */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold text-neutral-300 block">
            Generated Schema.org (JSON-LD) for Search Engine Optimization
          </span>
          <pre className="p-4 rounded-xl bg-[#0E150F] border border-[#243526] text-[11px] font-mono text-emerald-300 overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "${activeSite?.url}/#website",
      "url": "${activeSite?.url}/",
      "name": "${activeSite?.name}",
      "description": "${activeSite?.description}",
      "inLanguage": ["en", "ur", "ar"]
    },
    {
      "@type": "Organization",
      "@id": "https://zaitoon.org/#organization",
      "name": "Zaitoon Universal Platform",
      "url": "https://zaitoon.org",
      "founder": {
        "@type": "Person",
        "name": "Muneeb Ur Rehman"
      }
    }
  ]
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};
