import React from 'react';
import {
  LayoutDashboard,
  Globe2,
  FileText,
  ShoppingBag,
  Database,
  RefreshCw,
  Users,
  Code2,
  HardDriveDownload,
  ShieldAlert,
  Search,
  Server,
  ChevronRight,
  Layers,
  Sliders,
} from 'lucide-react';
import { Language, translations } from '../i18n.js';

interface SidebarProps {
  currentLang: Language;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  websitesCount: number;
  submissionsCount: number;
  syncPendingCount: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentLang,
  activeTab,
  onSelectTab,
  websitesCount,
  submissionsCount,
  syncPendingCount,
}) => {
  const t = translations[currentLang];

  const menuSections: MenuSection[] = [
    {
      label: currentLang === 'ur' ? 'مرکزی کنٹرول' : currentLang === 'ar' ? 'التحكم الرئيسي' : 'Core Hub',
      items: [
        { id: 'dashboard', label: t.controlCenter, icon: LayoutDashboard },
        { id: 'websites', label: t.connectedWebsites, icon: Globe2, badge: websitesCount },
      ],
    },
    {
      label: currentLang === 'ur' ? 'ڈیٹا اور اندراجات' : currentLang === 'ar' ? 'البيانات والمدخلات' : 'Data Persistence',
      items: [
        { id: 'submissions', label: t.submissions, icon: FileText, badge: submissionsCount },
        { id: 'orders', label: t.ordersAndBookings, icon: ShoppingBag },
      ],
    },
    {
      label: currentLang === 'ur' ? 'انفراسٹرکچر اور ہم آہنگی' : currentLang === 'ar' ? 'البنية والمزامنة' : 'Cloud Infrastructure',
      items: [
        { id: 'database', label: t.databaseSchema, icon: Database },
        { id: 'sync', label: t.dataSync, icon: RefreshCw, badge: syncPendingCount > 0 ? `${syncPendingCount} pending` : undefined, badgeColor: 'bg-amber-500/20 text-amber-300' },
      ],
    },
    {
      label: currentLang === 'ur' ? 'سیکیورٹی اور ٹولز' : currentLang === 'ar' ? 'الأمان والأدوات' : 'Security & Tools',
      items: [
        { id: 'users', label: t.userManagement, icon: Users },
        { id: 'integrations', label: t.clientSdk, icon: Code2 },
        { id: 'backups', label: t.backupsAndDr, icon: HardDriveDownload },
        { id: 'security', label: t.auditLogs, icon: ShieldAlert },
        { id: 'seo', label: t.seoCenter, icon: Search },
        { id: 'settings', label: t.systemSettings, icon: Server },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#121C14] border-r border-[#243526] flex flex-col justify-between min-h-[calc(100vh-61px)]">
      <div className="py-4 px-3 space-y-6">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#A0B0A2]/60">
              {section.label}
            </h3>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-[#233827] text-white border-l-2 border-[#D4AF37] shadow-sm'
                        : 'text-neutral-300 hover:bg-[#1A291D] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-[#D4AF37]' : 'text-neutral-400 group-hover:text-[#D4AF37]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                          item.badgeColor || (isActive ? 'bg-[#D4AF37] text-neutral-950' : 'bg-[#1E2E21] text-neutral-300')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Cloud & Tenant Status Badge at bottom */}
      <div className="p-3 m-3 bg-[#18261A] border border-[#2B402E] rounded-xl text-neutral-400 text-[11px] space-y-2">
        <div className="flex items-center justify-between text-neutral-300">
          <span className="flex items-center gap-1.5 font-semibold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Cloud Run Core API
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">v1.0.0</span>
        </div>
        <div className="text-[10px] text-neutral-400 leading-relaxed">
          PostgreSQL Row-Level Security active. Isolated multi-tenant persistence.
        </div>
      </div>
    </aside>
  );
};
