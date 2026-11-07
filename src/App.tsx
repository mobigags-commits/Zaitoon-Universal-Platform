import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { DashboardView } from './components/DashboardView.js';
import { WebsitesView } from './components/WebsitesView.js';
import { AddWebsiteModal } from './components/AddWebsiteModal.js';
import { SubmissionsView } from './components/SubmissionsView.js';
import { OrdersView } from './components/OrdersView.js';
import { DatabaseView } from './components/DatabaseView.js';
import { SyncEngineView } from './components/SyncEngineView.js';
import { UsersView } from './components/UsersView.js';
import { IntegrationsView } from './components/IntegrationsView.js';
import { BackupsView } from './components/BackupsView.js';
import { SecurityAuditView } from './components/SecurityAuditView.js';
import { SeoCenterView } from './components/SeoCenterView.js';
import { SettingsView } from './components/SettingsView.js';
import { Language, isRTL, translations } from './i18n.js';
import { Website, FormSubmission, OrderBooking, User, DashboardMetrics, AuditLog } from './types.js';
import { api } from './api.js';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  // Core Data
  const [websites, setWebsites] = useState<Website[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [orders, setOrders] = useState<OrderBooking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync RTL with language
  useEffect(() => {
    const rtl = isRTL(currentLang);
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Load all initial data from Zaitoon Core API
  const refreshData = async () => {
    try {
      const [dashData, sitesData, subsData, ordersData, usersData] = await Promise.all([
        api.getDashboard(),
        api.getWebsites(),
        api.getSubmissions({ limit: 100 }),
        api.getOrders(),
        api.getUsers(),
      ]);

      setMetrics(dashData.metrics);
      setRecentActivity(dashData.recentActivity);
      setWebsites(sitesData.websites);
      setSubmissions(subsData.submissions);
      setOrders(ordersData.orders);
      setUsers(usersData.users);
    } catch (err) {
      console.error('[Zaitoon App] Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handler: Ping all 9 websites
  const handlePingAll = async () => {
    setIsPinging(true);
    try {
      const res = await api.pingAllWebsites();
      showToast(`Pinging complete: Verified ${res.results.length} websites.`);
      await refreshData();
    } catch (err: any) {
      showToast(`Ping failed: ${err.message}`);
    } finally {
      setIsPinging(false);
    }
  };

  // Handler: Add Website
  const handleAddWebsite = async (data: any) => {
    try {
      const res = await api.createWebsite(data);
      showToast(`Website "${res.website.name}" registered successfully.`);
      await refreshData();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Handler: Update Website
  const handleUpdateWebsite = async (id: string, data: Partial<Website>) => {
    try {
      await api.updateWebsite(id, data);
      showToast('Website configurations updated.');
      await refreshData();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Handler: Regenerate API Key
  const handleRegenerateKey = async (id: string) => {
    try {
      const res = await api.regenerateApiKey(id);
      showToast('New API token generated & persisted.');
      await refreshData();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Handler: Delete Website (Safeguarded)
  const handleDeleteWebsite = async (id: string) => {
    try {
      await api.deleteWebsite(id);
      showToast('Website deregistered. Historical records safeguarded.');
      await refreshData();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Handler: Update Submission Status
  const handleUpdateSubmissionStatus = async (id: string, status: string, notes?: string) => {
    try {
      await api.updateSubmissionStatus(id, status, notes);
      showToast(`Submission status updated to ${status}.`);
      await refreshData();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Handler: Delete Submission
  const handleDeleteSubmission = async (id: string) => {
    try {
      await api.deleteSubmission(id);
      showToast('Submission deleted.');
      await refreshData();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Handler: Create Submission
  const handleCreateSubmission = async (data: any) => {
    try {
      await api.createSubmission(data);
      showToast('Form submission persisted to PostgreSQL.');
      await refreshData();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Handler: Create Order
  const handleCreateOrder = async (orderData: Partial<OrderBooking>) => {
    try {
      await api.createOrder(orderData);
      showToast('Order / booking recorded in central ledger.');
      await refreshData();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Handler: Create User
  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      await api.createUser(userData);
      showToast('New user account provisioned.');
      await refreshData();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Handler: Update User
  const handleUpdateUser = async (id: string, userData: Partial<User>) => {
    try {
      await api.updateUser(id, userData);
      showToast('User permissions updated.');
      await refreshData();
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  // Handler: Trigger Outbox Sync
  const handleTriggerSync = async () => {
    try {
      await api.triggerSync();
      showToast('All outbox records synchronized to Cloud Firestore.');
      await refreshData();
    } catch (err: any) {
      showToast(`Sync Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D150E] text-neutral-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E2E21] border border-[#D4AF37] text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        websites={websites}
        selectedWebsiteId={selectedWebsiteId}
        onSelectWebsite={setSelectedWebsiteId}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onPingAll={handlePingAll}
        isPinging={isPinging}
        activeTab={activeTab}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentLang={currentLang}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          websitesCount={websites.length}
          submissionsCount={submissions.length}
          syncPendingCount={metrics?.syncQueuePending || 0}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-h-[calc(100vh-61px)]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                currentLang={currentLang}
                metrics={metrics}
                websites={websites}
                submissions={submissions}
                recentActivity={recentActivity}
                onSelectTab={setActiveTab}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onPingAll={handlePingAll}
                isPinging={isPinging}
                onTriggerSync={handleTriggerSync}
                onSelectWebsite={(id) => {
                  setSelectedWebsiteId(id);
                  setActiveTab('submissions');
                }}
              />
            )}

            {activeTab === 'websites' && (
              <WebsitesView
                currentLang={currentLang}
                websites={websites}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onUpdateWebsite={handleUpdateWebsite}
                onRegenerateKey={handleRegenerateKey}
                onDeleteWebsite={handleDeleteWebsite}
                onSelectWebsiteForSnippet={(siteId) => {
                  setSelectedWebsiteId(siteId);
                  setActiveTab('integrations');
                }}
              />
            )}

            {activeTab === 'submissions' && (
              <SubmissionsView
                currentLang={currentLang}
                submissions={submissions}
                websites={websites}
                selectedWebsiteId={selectedWebsiteId}
                onUpdateStatus={handleUpdateSubmissionStatus}
                onDeleteSubmission={handleDeleteSubmission}
                onCreateSubmission={handleCreateSubmission}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersView
                currentLang={currentLang}
                orders={orders}
                websites={websites}
                selectedWebsiteId={selectedWebsiteId}
                onCreateOrder={handleCreateOrder}
              />
            )}

            {activeTab === 'database' && (
              <DatabaseView currentLang={currentLang} />
            )}

            {activeTab === 'sync' && (
              <SyncEngineView currentLang={currentLang} />
            )}

            {activeTab === 'users' && (
              <UsersView
                currentLang={currentLang}
                users={users}
                websites={websites}
                onCreateUser={handleCreateUser}
                onUpdateUser={handleUpdateUser}
              />
            )}

            {activeTab === 'integrations' && (
              <IntegrationsView
                currentLang={currentLang}
                websites={websites}
                selectedWebsiteId={selectedWebsiteId}
              />
            )}

            {activeTab === 'backups' && (
              <BackupsView currentLang={currentLang} />
            )}

            {activeTab === 'security' && (
              <SecurityAuditView currentLang={currentLang} />
            )}

            {activeTab === 'seo' && (
              <SeoCenterView currentLang={currentLang} websites={websites} />
            )}

            {activeTab === 'settings' && (
              <SettingsView currentLang={currentLang} />
            )}
          </div>
        </main>
      </div>

      {/* Add New Website Modal (Unlimited expansion) */}
      <AddWebsiteModal
        currentLang={currentLang}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddWebsite}
      />
    </div>
  );
}
