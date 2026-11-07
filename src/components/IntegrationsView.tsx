import React, { useState, useEffect } from 'react';
import {
  Code2,
  Copy,
  Check,
  Globe,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Language, translations } from '../i18n.js';
import { Website } from '../types.js';
import { api } from '../api.js';

interface IntegrationsViewProps {
  currentLang: Language;
  websites: Website[];
  selectedWebsiteId: string;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  currentLang,
  websites,
  selectedWebsiteId,
}) => {
  const t = translations[currentLang];
  const [activeSiteId, setActiveSiteId] = useState<string>(
    selectedWebsiteId === 'all' ? websites[0]?.id || '' : selectedWebsiteId
  );
  const [snippetData, setSnippetData] = useState<{
    htmlSnippet: string;
    reactHookSnippet: string;
    apiUrl: string;
  } | null>(null);

  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeSnippetTab, setActiveSnippetTab] = useState<'react' | 'html' | 'audit'>('react');

  // Test form state
  const [testFormKey, setTestFormKey] = useState('contact_or_inquiry');
  const [testName, setTestName] = useState('Ahmad Raza');
  const [testEmail, setTestEmail] = useState('ahmad.raza@example.pk');
  const [testMessage, setTestMessage] = useState('Testing live API submission from Vercel adapter.');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    if (activeSiteId) {
      api.getIntegrationSnippet(activeSiteId).then((data) => {
        setSnippetData({
          htmlSnippet: data.htmlSnippet,
          reactHookSnippet: data.reactHookSnippet,
          apiUrl: data.apiUrl,
        });
      });
    }
  }, [activeSiteId]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSendTestPayload = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await api.createSubmission({
        website_id: activeSiteId,
        formKey: testFormKey,
        formName: testFormKey.toUpperCase(),
        customerName: testName,
        customerEmail: testEmail,
        data: {
          customerName: testName,
          customerEmail: testEmail,
          message: testMessage,
          adapterTest: true,
          timestamp: new Date().toISOString(),
        },
      });
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ error: err.message });
    } finally {
      setTestLoading(false);
    }
  };

  const activeSite = websites.find((w) => w.id === activeSiteId) || websites[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Code2 className="w-6 h-6 text-[#D4AF37]" />
            {t.clientSdk} & Integration Adapters
          </h1>
          <p className="text-xs text-neutral-400">
            Plug-and-play SDK adapters for all 9 Vercel websites to replace localStorage with PostgreSQL persistence.
          </p>
        </div>

        {/* Website Selector */}
        <div className="flex items-center gap-2 bg-[#18261A] border border-[#2A3E2D] px-3 py-1.5 rounded-xl text-xs">
          <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-neutral-400">Target Website:</span>
          <select
            value={activeSiteId}
            onChange={(e) => setActiveSiteId(e.target.value)}
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

      {/* Main Split: Code Snippets on Left, Live Adapter Tester on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 2 Columns - Code Snippets & Audit Report */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#18261A] border border-[#2A3E2D] rounded-2xl overflow-hidden shadow-sm">
            {/* Snippet Header */}
            <div className="px-5 py-3 bg-[#142016] border-b border-[#2A3E2D] flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-bold text-white">
                  Integration Adapter for <span className="text-[#D4AF37]">{activeSite?.name}</span>
                </span>
              </div>

              {/* Tabs */}
              <div className="flex items-center bg-[#1E2E21] p-1 rounded-lg">
                <button
                  onClick={() => setActiveSnippetTab('react')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    activeSnippetTab === 'react' ? 'bg-[#D4AF37] text-neutral-950 font-bold' : 'text-neutral-400'
                  }`}
                >
                  React Hook (TypeScript)
                </button>
                <button
                  onClick={() => setActiveSnippetTab('html')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    activeSnippetTab === 'html' ? 'bg-[#D4AF37] text-neutral-950 font-bold' : 'text-neutral-400'
                  }`}
                >
                  Vanilla JS / HTML
                </button>
                <button
                  onClick={() => setActiveSnippetTab('audit')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    activeSnippetTab === 'audit' ? 'bg-[#D4AF37] text-neutral-950 font-bold' : 'text-neutral-400'
                  }`}
                >
                  Technical Audit
                </button>
              </div>
            </div>

            {/* Code Box */}
            <div className="p-4 relative bg-[#0D140E]">
              {activeSnippetTab === 'react' && snippetData && (
                <div>
                  <button
                    onClick={() => copyToClipboard(snippetData.reactHookSnippet, 'react')}
                    className="absolute top-6 right-6 p-2 rounded-lg bg-[#223625] hover:bg-[#2D4530] text-[#D4AF37] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedType === 'react' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'react' ? 'Copied' : 'Copy Hook'}</span>
                  </button>
                  <pre className="text-emerald-300 font-mono text-xs overflow-x-auto p-2 leading-relaxed">
                    {snippetData.reactHookSnippet}
                  </pre>
                </div>
              )}

              {activeSnippetTab === 'html' && snippetData && (
                <div>
                  <button
                    onClick={() => copyToClipboard(snippetData.htmlSnippet, 'html')}
                    className="absolute top-6 right-6 p-2 rounded-lg bg-[#223625] hover:bg-[#2D4530] text-[#D4AF37] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedType === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'html' ? 'Copied' : 'Copy Script'}</span>
                  </button>
                  <pre className="text-emerald-300 font-mono text-xs overflow-x-auto p-2 leading-relaxed">
                    {snippetData.htmlSnippet}
                  </pre>
                </div>
              )}

              {activeSnippetTab === 'audit' && (
                <div className="space-y-4 text-xs text-neutral-300 p-2 leading-relaxed">
                  <div className="p-3 bg-[#162419] rounded-xl border border-[#263C2A] space-y-2">
                    <span className="font-bold text-[#D4AF37] text-sm block">
                      Phase 1 Source Inspection & Diagnostic Audit
                    </span>
                    <p>
                      <strong>Vercel Endpoint:</strong> <a href={activeSite?.url} target="_blank" rel="noreferrer" className="text-cyan-400 underline">{activeSite?.url}</a>
                    </p>
                    <p>
                      <strong>Frontend Framework:</strong> React 18/19 SPA with Vite + Tailwind CSS.
                    </p>
                    <p>
                      <strong>Prior State:</strong> Browser <code className="text-amber-300">localStorage</code> without central persistence.
                    </p>
                    <p>
                      <strong>Target Upgrade:</strong> Seamlessly route submissions to <code className="text-emerald-300">POST /api/v1/submissions</code> with Bearer API Key. No changes to UI/UX required on Vercel frontend.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: 1 Column - Live API Sandbox Tester */}
        <div className="bg-[#18261A] border border-[#2A3E2D] rounded-2xl p-5 shadow-sm space-y-4 text-xs">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Live API Connection Tester
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Simulate an incoming submission from {activeSite?.name} to verify Cloud Run & PostgreSQL intake.
            </p>
          </div>

          <form onSubmit={handleSendTestPayload} className="space-y-3">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Form Key</label>
              <input
                type="text"
                value={testFormKey}
                onChange={(e) => setTestFormKey(e.target.value)}
                className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Customer / Applicant</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Email</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Payload Content</label>
              <textarea
                rows={2}
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full bg-[#1E2E21] border border-[#2D4532] rounded-xl px-3 py-2 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={testLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8972E] text-neutral-950 font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testLoading ? 'Transmitting to Core API...' : 'Send Live Test Payload'}</span>
            </button>
          </form>

          {/* Result */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border font-mono text-[11px] ${
                testResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <div>
                  <div className="font-bold flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 201 Created (PostgreSQL)
                  </div>
                  <div>ID: {testResult.submissionId}</div>
                  <div>Status: {testResult.status}</div>
                </div>
              ) : (
                <div>Error: {testResult.error}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
