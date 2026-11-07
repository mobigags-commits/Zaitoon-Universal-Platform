import React from 'react';
import {
  ShieldCheck,
  Globe,
  PlusCircle,
  Activity,
  Database,
  Languages,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Language, translations } from '../i18n.js';
import { Website } from '../types.js';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  websites: Website[];
  selectedWebsiteId: string;
  onSelectWebsite: (id: string) => void;
  onOpenAddModal: () => void;
  onPingAll: () => void;
  isPinging: boolean;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  websites,
  selectedWebsiteId,
  onSelectWebsite,
  onOpenAddModal,
  onPingAll,
  isPinging,
}) => {
  const t = translations[currentLang];
  const activeCount = websites.filter((w) => w.status === 'active').length;

  return (
    <header className="sticky top-0 z-40 bg-[#162218]/90 backdrop-blur-md border-b border-[#2C412F] text-white">
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#B8972E] to-[#8C6D15] p-0.5 shadow-lg shadow-[#D4AF37]/10 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#18261A] rounded-[10px] flex items-center justify-center text-[#D4AF37] font-bold">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-base lg:text-lg">
                ZAITOON
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 uppercase tracking-wider">
                Universal
              </span>
            </div>
            <p className="text-xs text-neutral-400 truncate hidden sm:block">
              {t.adminTitle} • Central Database & Core API
            </p>
          </div>
        </div>

        {/* Global Context Switcher & Health telemetry */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          {/* Website Scope Selector */}
          <div className="hidden md:flex items-center bg-[#1E2E21] border border-[#2D4532] rounded-lg px-2.5 py-1.5 text-xs text-neutral-300">
            <Globe className="w-3.5 h-3.5 text-[#D4AF37] mr-2 shrink-0" />
            <span className="text-neutral-400 mr-2 text-[11px] uppercase tracking-wider">Scope:</span>
            <select
              value={selectedWebsiteId}
              onChange={(e) => onSelectWebsite(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer max-w-[180px] truncate"
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
          </div>

          {/* Quick Health Ping */}
          <button
            onClick={onPingAll}
            disabled={isPinging}
            title={t.runHealthPing}
            className="flex items-center gap-1.5 bg-[#1F3123] hover:bg-[#28402E] border border-[#335338] text-xs text-emerald-300 px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
          >
            <Activity className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-[#D4AF37]' : 'text-emerald-400'}`} />
            <span className="hidden lg:inline">{activeCount}/{websites.length} Active</span>
            <RefreshCw className={`w-3 h-3 text-neutral-400 ${isPinging ? 'animate-spin' : ''}`} />
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-[#1E2E21] border border-[#2D4532] rounded-lg p-1 text-xs">
            <Languages className="w-3.5 h-3.5 text-[#D4AF37] mx-1 shrink-0" />
            {(['en', 'ur', 'ar'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase transition-all ${
                  currentLang === lang
                    ? 'bg-[#D4AF37] text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Add Website CTA */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8972E] hover:from-[#E5C158] hover:to-[#C5A059] text-neutral-950 font-semibold px-3 py-1.5 rounded-lg text-xs shadow-md shadow-[#D4AF37]/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{t.addNewWebsite}</span>
          </button>

          {/* Super Admin User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#2C412F]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2D4532] to-[#162218] border border-[#D4AF37]/50 flex items-center justify-center font-bold text-xs text-[#D4AF37] shadow">
              M
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-white truncate max-w-[120px]">
                Muneeb Ur Rehman
              </div>
              <div className="text-[10px] text-[#D4AF37] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> Super Admin
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
