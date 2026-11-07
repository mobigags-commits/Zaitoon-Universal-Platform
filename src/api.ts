import { Website, User, FormSubmission, OrderBooking, AuditLog, SyncOutbox, Backup, DashboardMetrics } from './types.js';

const BASE_URL = '/api/v1';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Dashboard & Health
  getDashboard: () => request<{
    metrics: DashboardMetrics;
    submissionsByWebsite: Record<string, number>;
    recentActivity: AuditLog[];
    websites: Array<{ id: string; name: string; url: string; category: string; status: string; health: any; submissionsCount: number }>;
  }>('/dashboard'),

  getHealth: () => request<{
    status: string;
    timestamp: string;
    version: string;
    services: Record<string, any>;
    totalWebsitesRegistered: number;
    activeWebsitesCount: number;
  }>('/health'),

  pingAllWebsites: () => request<{
    success: boolean;
    timestamp: string;
    results: Array<{ id: string; url: string; status: string; httpStatus?: number; latencyMs?: number; error?: string }>;
  }>('/websites/ping-all', { method: 'POST' }),

  // Websites
  getWebsites: () => request<{ websites: Website[] }>('/websites'),
  getWebsite: (id: string) => request<{ website: Website }>(`/websites/${id}`),
  createWebsite: (data: Partial<Website>) => request<{ success: boolean; website: Website; message: string }>('/websites', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateWebsite: (id: string, data: Partial<Website>) => request<{ success: boolean; website: Website }>(`/websites/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  regenerateApiKey: (id: string) => request<{ success: boolean; apiKey: string }>(`/websites/${id}/regenerate-key`, {
    method: 'POST',
  }),
  deleteWebsite: (id: string) => request<{ success: boolean; message: string }>(`/websites/${id}`, {
    method: 'DELETE',
  }),

  // Submissions
  getSubmissions: (params?: { website_id?: string; status?: string; search?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.website_id) query.append('website_id', params.website_id);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.limit) query.append('limit', String(params.limit));
    return request<{ total: number; submissions: FormSubmission[] }>(`/submissions?${query.toString()}`);
  },
  createSubmission: (data: { website_id: string; formKey: string; formName?: string; data: Record<string, any>; customerName?: string; customerEmail?: string; customerPhone?: string }) =>
    request<{ success: boolean; submissionId: string; status: string; message: string }>('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSubmissionStatus: (id: string, status: string, notes?: string) =>
    request<{ success: boolean; submission: FormSubmission }>(`/submissions/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    }),
  deleteSubmission: (id: string) => request<{ success: boolean; message: string }>(`/submissions/${id}`, {
    method: 'DELETE',
  }),

  // Orders
  getOrders: (params?: { website_id?: string; type?: string }) => {
    const query = new URLSearchParams();
    if (params?.website_id) query.append('website_id', params.website_id);
    if (params?.type) query.append('type', params.type);
    return request<{ orders: OrderBooking[] }>(`/orders?${query.toString()}`);
  },
  createOrder: (data: Partial<OrderBooking>) => request<{ success: boolean; order: OrderBooking }>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Users
  getUsers: () => request<{ users: User[] }>('/users'),
  createUser: (data: Partial<User>) => request<{ success: boolean; user: User }>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateUser: (id: string, data: Partial<User>) => request<{ success: boolean; user: User }>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Database & SQL
  getDatabaseSchema: () => request<{
    engine: string;
    isolation: string;
    tables: Array<{ name: string; rows: number; sizeKb: number; columns: string[] }>;
  }>('/database/schema'),
  executeSql: (sql: string) => request<{
    rowCount: number;
    columns: string[];
    rows: any[];
  }>('/database/query', {
    method: 'POST',
    body: JSON.stringify({ sql }),
  }),

  // Sync Engine
  getSyncOutbox: () => request<{ queue: SyncOutbox[]; status: { isSyncing: boolean; lastSyncTimestamp: string; pendingItems: number } }>('/sync/outbox'),
  triggerSync: () => request<{ success: boolean; message: string }>('/sync/trigger', { method: 'POST' }),

  // Backups
  getBackups: () => request<{ backups: Backup[] }>('/backups'),
  createBackup: (backupType?: string) => request<{ success: boolean; backup: Backup }>('/backups/create', {
    method: 'POST',
    body: JSON.stringify({ backupType }),
  }),
  restoreBackup: (id: string) => request<{ success: boolean; message: string }>(`/backups/${id}/restore`, {
    method: 'POST',
  }),

  // Integrations SDK
  getIntegrationSnippet: (website_id: string) => request<{
    website: Website;
    apiUrl: string;
    htmlSnippet: string;
    reactHookSnippet: string;
  }>(`/integrations/${website_id}/snippet`),

  // Security & Audit
  getAuditLogs: (params?: { severity?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.severity) query.append('severity', params.severity);
    if (params?.limit) query.append('limit', String(params.limit));
    return request<{ total: number; logs: AuditLog[] }>(`/security/audit-logs?${query.toString()}`);
  },
};
