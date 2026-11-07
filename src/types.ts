export type WebsiteCategory =
  | 'education'
  | 'events'
  | 'marketplace'
  | 'transport'
  | 'testing_service'
  | 'matrimonial'
  | 'higher_education'
  | 'ecommerce'
  | 'real_estate'
  | 'custom';

export interface Website {
  id: string;
  name: string;
  slug: string;
  url: string;
  domain?: string;
  category: WebsiteCategory;
  description: string;
  status: 'active' | 'maintenance' | 'suspended' | 'disconnected';
  apiKey: string;
  webhookUrl?: string;
  syncStatus: 'synced' | 'pending' | 'retrying' | 'error';
  health: {
    status: 'healthy' | 'degraded' | 'down' | 'checking';
    latencyMs: number;
    uptimePercentage: number;
    lastChecked: string;
    httpStatus: number;
  };
  settings: {
    adminEmail: string;
    modulesEnabled: string[];
    allowPublicSubmissions: boolean;
    requireApproval: boolean;
    themeColor: string;
    customDomainStatus?: 'verified' | 'pending' | 'none';
  };
  stats: {
    totalSubmissions: number;
    totalUsers: number;
    totalOrders: number;
    revenue: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'super_admin' | 'website_admin' | 'moderator' | 'auditor';
  assignedWebsites: string[];
  status: 'active' | 'suspended' | 'pending';
  lastLogin: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
}

export interface FormSubmission {
  id: string;
  website_id: string;
  formKey: string;
  formName: string;
  data: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  ipAddress: string;
  submittedAt: string;
  notes?: string;
  auditTrail: Array<{ action: string; by: string; at: string }>;
}

export interface OrderBooking {
  id: string;
  website_id: string;
  referenceCode: string;
  type: 'event_booking' | 'ecommerce_order' | 'course_admission' | 'escrow_milestone' | 'test_registration' | 'matrimonial_plan' | 'property_inquiry';
  title: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  currency: string;
  paymentStatus: 'paid' | 'pending' | 'escrow' | 'refunded' | 'advance_paid';
  fulfillmentStatus: 'confirmed' | 'processing' | 'delivered' | 'scheduled' | 'cancelled';
  details: Record<string, any>;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  resource: string;
  website_id?: string;
  timestamp: string;
  ipAddress: string;
  severity: 'info' | 'warn' | 'security' | 'critical';
  details: string;
}

export interface SyncOutbox {
  id: string;
  entityType: 'website' | 'submission' | 'user' | 'order';
  entityId: string;
  website_id: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  status: 'synced' | 'queued' | 'retrying' | 'failed';
  retryCount: number;
  lastAttempt: string;
  payload: Record<string, any>;
}

export interface Backup {
  id: string;
  backupType: 'automated_daily' | 'manual_snapshot' | 'pre_migration' | 'cloud_sql_export';
  fileName: string;
  sizeBytes: number;
  status: 'completed' | 'verifying' | 'failed';
  checksum: string;
  storageLocation: string;
  verified: boolean;
  createdAt: string;
}

export interface DashboardMetrics {
  totalConnectedWebsites: number;
  activeWebsites: number;
  maintenanceWebsites: number;
  totalUsers: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  totalOrders: number;
  totalRevenuePKR: number;
  databaseStorageBytes: number;
  syncQueuePending: number;
}
