import React, { useState } from 'react';
import {
  Globe,
  Shield,
  Key,
  CheckCircle2,
  X,
  Plus,
  Sparkles,
  Server,
  Code2,
} from 'lucide-react';
import { Language, translations } from '../i18n.js';
import { WebsiteCategory } from '../types.js';

interface AddWebsiteModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    url: string;
    domain?: string;
    category: WebsiteCategory;
    description: string;
    adminEmail: string;
    themeColor: string;
  }) => Promise<void>;
}

export const AddWebsiteModal: React.FC<AddWebsiteModalProps> = ({
  currentLang,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const t = translations[currentLang];
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('');
  const [category, setCategory] = useState<WebsiteCategory>('education');
  const [description, setDescription] = useState('');
  const [adminEmail, setAdminEmail] = useState('mobigags@gmail.com');
  const [themeColor, setThemeColor] = useState('#2D3B2D');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        url,
        domain: domain || undefined,
        category,
        description,
        adminEmail,
        themeColor,
      });
      onClose();
      // Reset
      setName('');
      setUrl('');
      setDomain('');
      setDescription('');
      setStep(1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: Array<{ id: WebsiteCategory; label: string }> = [
    { id: 'education', label: 'Online Quran & Islamic Academy' },
    { id: 'events', label: 'Events, Catering & Decor Booking' },
    { id: 'marketplace', label: 'Freelance & Tech Talent Marketplace' },
    { id: 'transport', label: 'Global Transit Fares & Rate Calculation' },
    { id: 'testing_service', label: 'Testing Service (ZTS Exams & Roll Slips)' },
    { id: 'matrimonial', label: 'Marriage Bureau & Matrimonial Profiles' },
    { id: 'higher_education', label: 'Higher Education Admissions (Degrees/Diplomas)' },
    { id: 'ecommerce', label: 'Multi-Vendor E-Commerce & Community' },
    { id: 'real_estate', label: 'Real Estate & Property Listings' },
    { id: 'custom', label: 'Custom Enterprise Web Application' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#18261A] border border-[#2D4532] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2C412F]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#223625] text-[#D4AF37]">
                <Globe className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-extrabold text-white">
                  {t.addNewWebsite}
                </h2>
                <p className="text-xs text-neutral-400">
                  Provision tenant isolation, database schema & secure API key.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-[#2C412F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Step 1: Basic Identity */}
          <div className="space-y-3">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Website Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Zaitoon Global Logistics"
                className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Vercel Live URL *
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://my-app.vercel.app"
                  className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Custom Domain (Optional)
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="logistics.zaitoon.org"
                  className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Business Category & Framework Module
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WebsiteCategory)}
                className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#18261A] text-white">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Website Purpose & Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of features, customer audience, and forms..."
                className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Designated Administrator Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Brand Theme Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure Guarantee notice */}
          <div className="p-3 bg-[#131F15] border border-[#233526] rounded-xl text-neutral-400 space-y-1">
            <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Central Registration
            </div>
            <p className="text-[10px] leading-relaxed">
              Upon creation, a unique <span className="text-white font-mono">website_id</span> is generated with Row-Level Security isolation in PostgreSQL. A secret Bearer API key will be provisioned instantly.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2C412F]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white font-semibold transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name || !url}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8972E] hover:from-[#E5C158] hover:to-[#C5A059] text-neutral-950 font-bold shadow-lg shadow-[#D4AF37]/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Register Website'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
