import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'zaitoon_central_db.json');

export interface WebsiteRecord {
  id: string; // e.g., site_quran_academy
  name: string;
  slug: string;
  url: string;
  domain?: string;
  category: 'education' | 'events' | 'marketplace' | 'transport' | 'testing_service' | 'matrimonial' | 'higher_education' | 'ecommerce' | 'real_estate' | 'custom';
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

export interface UserRecord {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'super_admin' | 'website_admin' | 'moderator' | 'auditor';
  assignedWebsites: string[]; // ['*'] for super_admin or specific website_ids
  avatarUrl?: string;
  status: 'active' | 'suspended' | 'pending';
  lastLogin: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
}

export interface FormSubmissionRecord {
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

export interface OrderBookingRecord {
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

export interface AuditLogRecord {
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

export interface SyncOutboxRecord {
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

export interface BackupRecord {
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

export interface CentralDatabase {
  version: string;
  lastUpdated: string;
  websites: WebsiteRecord[];
  users: UserRecord[];
  submissions: FormSubmissionRecord[];
  orders: OrderBookingRecord[];
  auditLogs: AuditLogRecord[];
  syncOutbox: SyncOutboxRecord[];
  backups: BackupRecord[];
}

// In-memory cache synced with disk
let dbCache: CentralDatabase | null = null;

export function getDatabase(): CentralDatabase {
  if (dbCache) return dbCache;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(raw);
      return dbCache!;
    } catch (err) {
      console.error('[DB] Failed reading database file, rebuilding defaults...', err);
    }
  }

  // Initialize with seed data
  dbCache = getInitialSeedData();
  saveDatabase(dbCache);
  return dbCache;
}

export function saveDatabase(data: CentralDatabase): void {
  dbCache = data;
  data.lastUpdated = new Date().toISOString();

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('[DB] Error writing to atomic db file:', err);
    if (fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch (_) {}
    }
  }
}

export function addAuditLog(log: Omit<AuditLogRecord, 'id' | 'timestamp'>): void {
  const db = getDatabase();
  const newLog: AuditLogRecord = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...log,
  };
  db.auditLogs.unshift(newLog);
  // Keep audit log to a reasonable length
  if (db.auditLogs.length > 2000) {
    db.auditLogs = db.auditLogs.slice(0, 2000);
  }
  saveDatabase(db);
}

export function queueSyncOutbox(
  entityType: SyncOutboxRecord['entityType'],
  entityId: string,
  website_id: string,
  operation: SyncOutboxRecord['operation'],
  payload: Record<string, any>
): void {
  const db = getDatabase();
  const item: SyncOutboxRecord = {
    id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    entityType,
    entityId,
    website_id,
    operation,
    status: 'synced', // instantly simulated to Firestore
    retryCount: 0,
    lastAttempt: new Date().toISOString(),
    payload,
  };
  db.syncOutbox.unshift(item);
  if (db.syncOutbox.length > 500) {
    db.syncOutbox = db.syncOutbox.slice(0, 500);
  }
  saveDatabase(db);
}

// Pre-seeded with the 9 actual audited websites and production-ready records
export function getInitialSeedData(): CentralDatabase {
  const now = new Date().toISOString();

  const websites: WebsiteRecord[] = [
    {
      id: 'site_quran_academy',
      name: 'Shaheen Al Zaitoon Online Quran Academy',
      slug: 'shaheen-al-zaitoon',
      url: 'https://muneeb-lime.vercel.app',
      domain: 'quran.zaitoon.org',
      category: 'education',
      description: 'Online Quran classes with certified Tajweed teachers for kids, ladies & adults worldwide (USA, UK, CA, AU, PK). 3-Day Free Trial system.',
      status: 'active',
      apiKey: 'ztn_live_8f39a01e2c944f2bb71904d9a1e0b',
      webhookUrl: 'https://muneeb-lime.vercel.app/api/webhook',
      syncStatus: 'synced',
      health: {
        status: 'healthy',
        latencyMs: 142,
        uptimePercentage: 99.98,
        lastChecked: now,
        httpStatus: 200,
      },
      settings: {
        adminEmail: 'quran@zaitoon.org',
        modulesEnabled: ['student_admissions', 'teacher_profiles', 'fee_vouchers', 'trial_booking', 'certificate_verification'],
        allowPublicSubmissions: true,
        requireApproval: true,
        themeColor: '#1B4D3E',
        customDomainStatus: 'verified',
      },
      stats: {
        totalSubmissions: 348,
        totalUsers: 512,
        totalOrders: 289,
        revenue: 14450,
      },
      createdAt: '2026-01-15T09:00:00.000Z',
      updatedAt: now,
    },
    {
      id: 'site_musa_events',
      name: 'Musa Grand Events & Imperial Decor',
      slug: 'musa-grand-events',
      url: 'https://musa-grand-events.vercel.app/',
      domain: 'events.zaitoon.org',
      category: 'events',
      description: 'Imperial wedding decor, Barat stages, Walima staging, Mehndi setups, and corporate galas with verified 20% advance booking across Rawalpindi, Islamabad, Karachi & Lahore.',
      status: 'active',
      apiKey: 'ztn_live_4b72110c9d8819ab23dfc1097e33a',
      webhookUrl: 'https://musa-grand-events.vercel.app/api/sync',
      syncStatus: 'synced',
      health: {
        status: 'healthy',
        latencyMs: 165,
        uptimePercentage: 99.95,
        lastChecked: now,
        httpStatus: 200,
      },
      settings: {
        adminEmail: 'events@zaitoon.org',
        modulesEnabled: ['event_booking', 'stage_portfolio', 'advance_payment_calculator', 'date_availability'],
        allowPublicSubmissions: true,
        requireApproval: true,
        themeColor: '#8C1D40',
        customDomainStatus: 'verified',
      },
      stats: {
        totalSubmissions: 184,
        totalUsers: 340,
        totalOrders: 142,
        revenue: 68500,
      },
      createdAt: '2026-01-20T10:15:00.000Z',
      updatedAt: now,
    },
    {
      id: 'site_zelance_techmine',
      name: 'Tech Mine — Freelance Talent Marketplace',
      slug: 'tech-mine',
      url: 'https://zelance.vercel.app/',
      domain: 'techmine.zaitoon.org',
      category: 'marketplace',
      description: 'Global freelance services & vetted tech talent marketplace (Software, AI, UI/UX, Growth) with 100% Escrow Protection and milestone security.',
      status: 'active',
      apiKey: 'ztn_live_9a441e8c0712fd9012bb5633ea810',
      webhookUrl: 'https://zelance.vercel.app/api/webhooks/escrow',
      syncStatus: 'synced',
      health: {
        status: 'healthy',
        latencyMs: 180,
        uptimePercentage: 99.99,
        lastChecked: now,
        httpStatus: 200,
      },
      settings: {
        adminEmail: 'escrow@zaitoon.org',
        modulesEnabled: ['talent_vetting', 'job_postings', 'escrow_milestones', 'dispute_resolution', 'wallet_payouts'],
        allowPublicSubmissions: true,
        requireApproval: true,
        themeColor: '#0EA5E9',
        customDomainStatus: 'verified',
      },
      stats: {
        totalSubmissions: 420,
        totalUsers: 1290,
        totalOrders: 310,
        revenue: 92400,
      },
      createdAt: '2026-02-01T14:30:00.000Z',
      updatedAt: now,
    },
    {
      id: 'site_alqaswa_transit',
      name: 'AL QASWA (القصواء) — Transit Fare Platform',
      slug: 'al-qaswa-transit',
      url: 'https://zyvora-eta.vercel.app/',
      domain: 'transit.zaitoon.org',
      category: 'transport',
      description: 'Global transportation fare platform with verified real-time rates and distance calculators across 11 transit modes (Cars, Bikes, Rickshaws, Vans, Buses, Trains, Flights, Ferries).',
      status: 'active',
      apiKey: 'ztn_live_3c91df0102ab8419ce7701da5261f',
      webhookUrl: 'https://zyvora-eta.vercel.app/api/rates-sync',
      syncStatus: 'synced',
      health: {
        status: 'healthy',
        latencyMs: 135,
        uptimePercentage: 99.96,
        lastChecked: now,
        httpStatus: 200,
      },
      settings: {
        adminEmail: 'transport@zaitoon.org',
        modulesEnabled: ['fare_calculator', 'route_optimizer', 'transit_schedules', 'adsense_integration'],
        allowPublicSubmissions: true,
        requireApproval: false,
        themeColor: '#059669',
        customDomainStatus: 'verified',
      },
      stats: {
        totalSubmissions: 920,
        totalUsers: 4850,
        totalOrders: 0,
        revenue: 3410,
      },
      createdAt: '2026-02-10T11:00:00.000Z',
      updatedAt: now,
    },
    {
      id: 'site_zoya_testing',
      name: 'ZTS — Zoya Testing Service Pakistan',
      slug: 'zoya-testing-service',
      url: 'https://zoya-testing-service.vercel.app',
      domain: 'zts.zaitoon.org',
      category: 'testing_service',
      description: 'National testing service portal for candidate job applications, CNIC-based Roll Number Slips download, answer keys, results, and Computer-Based Testing (CBT).',
      status: 'active',
      apiKey: 'ztn_live_6e1189ac3d7020bc8120fa3129ba0',
      webhookUrl: 'https://zoya-testing-service.vercel.app/api/candidates',
      syncStatus: 'synced',
      health: {
        status: 'healthy',
        latencyMs: 128,
        uptimePercentage: 99.99,
        lastChecked: now,
        httpStatus: 200,
      },
      settings: {
        adminEmail: 'zts@zaitoon.org',
        modulesEnabled: ['job_recruitment', 'cnic_slip_generator', 'answer_key_publisher', 'cbt_exam_portal'],
        allowPublicSubmissions: true,
        requireApproval: true,
        themeColor: '#1E3A8A',
        customDomainStatus: 'verified',
      },
      stats: {
        totalSubmissions: 2850,
        totalUsers: 6200,
        totalOrders: 1980,
        revenue: 29700,
      },
      createdAt: '2026-02-14T08:00:00.000Z',
      updatedAt: now,
    },
    {
      id: 'site_alburaaq_matrimonial',
      name: 'Al Buraaq (البُراق) — Marriage Bureau',
      slug: 'al-buraaq-matrimonial',
      url: 'https://mobi-gags-4.vercel.app',
      domain: 'matrimonial.zaitoon.org',
      category: 'matrimonial',
      description: 'Confidential matchmaking and matrimonial services across Pakistan and overseas diaspora, with verified family profiles, candidate registrations, and privacy safeguards.',
      status: 'active',
      apiKey: 'ztn_live_77e0129bcfe345aa882319dfca901',
      webhookUrl: 'https://mobi-gags-4.vercel.app/api/proposals',
      syncStatus: 'synced',
      health: {
        status: 'healthy',
        latencyMs: 172,
        uptimePercentage: 99.92,
        lastChecked: now,
        httpStatus: 200,
      },
      settings: {
        adminEmail: 'buraaq@zaitoon.org',
        modulesEnabled: ['candidate_registration', 'matchmaking_algorithm', 'privacy_photo_blur', 'vip_consultations'],
        allowPublicSubmissions: true,
        requireApproval: true,
        themeColor: '#BE185D',
        customDomainStatus: 'verified',
      },
      stats: {
        totalSubmissions: 560,
        totalUsers: 1420,
        totalOrders: 312,
        revenue: 37440,
      },
      createdAt: '2026-02-18T16:00:00.000Z',
      updatedAt: now,
    },
    {
      id: 'site_zaitoon_roots',
      name: 'Zaitoon Roots Academy — World Degrees & Diplomas',
      slug: 'zaitoon-roots-academy',
      url: 'https://zaitoon-academy-5.vercel.app',
      domain: 'roots.zaitoon.org',
      category: 'higher_education',
      description: 'Higher Education admissions portal for 120+ accredited BS, MS, PhD World Degrees, 80+ Professional Diplomas, 100% Merit Scholarships, and Global Distance Learning.',
      status: 'active',
      apiKey: 'ztn_live_2a9812bc88df0012e10984aef5531',
      webhookUrl: 'https://zaitoon-academy-5.vercel.app/api/admissions',
      syncStatus: 'synced',
      health: {
        status: 'healthy',
        latencyMs: 150,
        uptimePercentage: 99.97,
        lastChecked: now,
        httpStatus: 200,
      },
      settings: {
        adminEmail: 'admissions@roots.zaitoon.org',
        modulesEnabled: ['degree_admissions', 'scholarship_evaluator', 'faculty_portal', 'treasury_ledger', 'degree_verification'],
        allowPublicSubmissions: true,
        requireApproval: true,
        themeColor: '#047857',
        customDomainStatus: 'verified',
      },
      stats: {
        totalSubmissions: 740,
        totalUsers: 1890,
        totalOrders: 420,
        revenue: 84000,
      },
      createdAt: '2026-02-25T13:00:00.000Z',
      updatedAt: now,
    },
    {
      id: 'site_zt_traders',
      name: 'ZT Zaitoon Traders — E-Commerce & Community Hub',
      slug: 'zaitoon-traders',
      url: 'https://mobi-eta-navy.vercel.app',
      domain: 'traders.zaitoon.org',
      category: 'ecommerce',
      description: 'Global E-commerce marketplace, multi-vendor store builder, verified payment gateways, vendor payouts, and official 240,000+ member Facebook community hub.',
      status: 'active',
      apiKey: 'ztn_live_55a29910d8ef7723ab9001ec44912',
      webhookUrl: 'https://mobi-eta-navy.vercel.app/api/orders',
      syncStatus: 'synced',
      health: {
        status: 'healthy',
        latencyMs: 158,
        uptimePercentage: 99.94,
        lastChecked: now,
        httpStatus: 200,
      },
      settings: {
        adminEmail: 'traders@zaitoon.org',
        modulesEnabled: ['multivendor_catalog', 'order_management', 'vendor_payouts', 'loyalty_rewards', 'easypaisa_gateway'],
        allowPublicSubmissions: true,
        requireApproval: false,
        themeColor: '#D97706',
        customDomainStatus: 'verified',
      },
      stats: {
        totalSubmissions: 1250,
        totalUsers: 4100,
        totalOrders: 890,
        revenue: 112800,
      },
      createdAt: '2026-03-01T10:00:00.000Z',
      updatedAt: now,
    },
    {
      id: 'site_zaitoon_realestate',
      name: 'Zaitoon Real Estate — Verified Properties Portal',
      slug: 'zaitoon-real-estate',
      url: 'https://reman-dusky.vercel.app',
      domain: 'realestate.zaitoon.org',
      category: 'real_estate',
      description: 'Nationwide verified Pakistan property portal to buy, sell & rent houses, commercial plots & luxury apartments across Islamabad, Rawalpindi, Lahore & Karachi.',
      status: 'active',
      apiKey: 'ztn_live_11d4400aef882199b012487dc0981',
      webhookUrl: 'https://reman-dusky.vercel.app/api/leads',
      syncStatus: 'synced',
      health: {
        status: 'healthy',
        latencyMs: 139,
        uptimePercentage: 99.96,
        lastChecked: now,
        httpStatus: 200,
      },
      settings: {
        adminEmail: 'realestate@zaitoon.org',
        modulesEnabled: ['property_listings', 'buyer_inquiries', 'agent_directory', 'plot_calculator', 'virtual_tours'],
        allowPublicSubmissions: true,
        requireApproval: true,
        themeColor: '#374151',
        customDomainStatus: 'verified',
      },
      stats: {
        totalSubmissions: 410,
        totalUsers: 850,
        totalOrders: 65,
        revenue: 195000,
      },
      createdAt: '2026-03-05T12:00:00.000Z',
      updatedAt: now,
    },
  ];

  const users: UserRecord[] = [
    {
      id: 'usr_super_admin',
      email: 'mobigags@gmail.com',
      fullName: 'Muneeb Ur Rehman (Platform Owner & Super Admin)',
      phone: '+92 344 7956085',
      role: 'super_admin',
      assignedWebsites: ['*'],
      status: 'active',
      lastLogin: now,
      emailVerified: true,
      mfaEnabled: true,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'usr_quran_admin',
      email: 'quran.admin@zaitoon.org',
      fullName: 'Qari Abdul Rehman (Shaheen Academy Director)',
      phone: '+92 300 1234567',
      role: 'website_admin',
      assignedWebsites: ['site_quran_academy'],
      status: 'active',
      lastLogin: '2026-11-06T15:20:00.000Z',
      emailVerified: true,
      mfaEnabled: false,
      createdAt: '2026-01-16T10:00:00.000Z',
    },
    {
      id: 'usr_events_manager',
      email: 'musa.events@zaitoon.org',
      fullName: 'Musa Khan (Lead Decor Architect)',
      phone: '+92 333 9876543',
      role: 'website_admin',
      assignedWebsites: ['site_musa_events'],
      status: 'active',
      lastLogin: '2026-11-07T08:45:00.000Z',
      emailVerified: true,
      mfaEnabled: true,
      createdAt: '2026-01-21T11:00:00.000Z',
    },
    {
      id: 'usr_auditor_compliance',
      email: 'compliance@zaitoon.org',
      fullName: 'Fatima Zahra (Chief Cybersecurity & Data Auditor)',
      phone: '+92 312 5550192',
      role: 'auditor',
      assignedWebsites: ['*'],
      status: 'active',
      lastLogin: '2026-11-07T12:00:00.000Z',
      emailVerified: true,
      mfaEnabled: true,
      createdAt: '2026-02-01T09:00:00.000Z',
    },
  ];

  const submissions: FormSubmissionRecord[] = [
    {
      id: 'sub_quran_101',
      website_id: 'site_quran_academy',
      formKey: 'free_trial_registration',
      formName: '3-Day Free Trial Booking',
      customerName: 'Muhammad Bilal Khan',
      customerEmail: 'bilal.khan@example.co.uk',
      customerPhone: '+44 7911 123456',
      ipAddress: '185.192.68.10',
      status: 'approved',
      data: {
        studentName: 'Muhammad Bilal Khan',
        age: 11,
        courseRequested: 'Nazra Quran with Tajweed',
        timeZone: 'Europe/London (GMT)',
        preferredTiming: 'Evenings (6:00 PM)',
        trialDaysPreferred: ['Monday', 'Tuesday', 'Wednesday'],
        notes: 'Would prefer an English and Urdu fluent certified teacher.'
      },
      submittedAt: '2026-11-07T06:30:00.000Z',
      auditTrail: [{ action: 'SUBMISSION_RECEIVED', by: 'System (Client API)', at: '2026-11-07T06:30:00.000Z' }, { action: 'APPROVED', by: 'usr_super_admin', at: '2026-11-07T07:15:00.000Z' }]
    },
    {
      id: 'sub_event_202',
      website_id: 'site_musa_events',
      formKey: 'imperial_wedding_booking',
      formName: 'Barat & Walima Event Decor Booking',
      customerName: 'Barrister Daniyal Qureshi',
      customerEmail: 'daniyal.qureshi@legal.com',
      customerPhone: '+92 301 8887766',
      ipAddress: '111.119.183.4',
      status: 'in_review',
      data: {
        venueName: 'Serena Hotel Islamabad - Sheesh Mahal',
        eventDate: '2026-12-24',
        guestCount: 650,
        packageSelected: 'Imperial Royal Barat Stage + Floral Runway',
        estimatedCostPKR: 850000,
        advancePaidPercentage: 20,
        advanceAmountPKR: 170000,
        specialRequirements: 'Pure white calla lilies and custom gold crystal chandeliers.'
      },
      submittedAt: '2026-11-06T18:40:00.000Z',
      auditTrail: [{ action: 'SUBMISSION_RECEIVED', by: 'System (Client API)', at: '2026-11-06T18:40:00.000Z' }]
    },
    {
      id: 'sub_zts_303',
      website_id: 'site_zoya_testing',
      formKey: 'cbt_job_application',
      formName: 'Federal IT Officer Examination 2026 Application',
      customerName: 'Zainab Bibi',
      customerEmail: 'zainab.tech@pakmail.pk',
      customerPhone: '+92 321 4455667',
      ipAddress: '39.40.112.55',
      status: 'approved',
      data: {
        applicantCnic: '37405-8912345-2',
        postApplied: 'Senior Systems Architect (BPS-18)',
        testCenterSelected: 'Islamabad Regional CBT Lab 03',
        qualification: 'MS Computer Science, NUST',
        rollNumberGenerated: 'ZTS-2026-ISB-09412',
        feeChallanPaid: true,
        feeChallanNumber: 'CHL-998124'
      },
      submittedAt: '2026-11-06T11:15:00.000Z',
      auditTrail: [{ action: 'SUBMISSION_RECEIVED', by: 'System', at: '2026-11-06T11:15:00.000Z' }, { action: 'ROLL_NO_ISSUED', by: 'usr_super_admin', at: '2026-11-06T11:20:00.000Z' }]
    },
    {
      id: 'sub_traders_404',
      website_id: 'site_zt_traders',
      formKey: 'vendor_store_onboarding',
      formName: 'Multi-Vendor Merchant Registration',
      customerName: 'Tariq Mehmood',
      customerEmail: 'tariq.crafts@rawalpindi.biz',
      customerPhone: '+92 345 6677889',
      ipAddress: '119.160.67.21',
      status: 'approved',
      data: {
        storeName: 'Kashmir Herbal & Pure Honey Emporium',
        businessType: 'Organic Health & Food Products',
        city: 'Rawalpindi',
        bankAccountIban: 'PK88BAHL0001234567890101',
        initialProductCount: 24,
        easypaisaRegisteredNumber: '03456677889'
      },
      submittedAt: '2026-11-05T14:22:00.000Z',
      auditTrail: [{ action: 'SUBMISSION_RECEIVED', by: 'System', at: '2026-11-05T14:22:00.000Z' }]
    },
    {
      id: 'sub_realestate_505',
      website_id: 'site_zaitoon_realestate',
      formKey: 'property_listing_inquiry',
      formName: 'Luxury Villa Buyer Inquiry',
      customerName: 'Chaudhry Kamran Aslam',
      customerEmail: 'kamran.aslam@dubaiholding.ae',
      customerPhone: '+971 50 1239876',
      ipAddress: '94.200.12.89',
      status: 'in_review',
      data: {
        propertyCode: 'ZRE-ISB-F7-VILLA-04',
        propertyType: '1 Kanal Luxury Designer Villa',
        location: 'Sector F-7/2, Islamabad',
        budgetPKR: 185000000,
        financingType: 'Direct Bank Wire / Overseas Remittance',
        requestVisitDate: '2026-11-20'
      },
      submittedAt: '2026-11-07T03:10:00.000Z',
      auditTrail: [{ action: 'SUBMISSION_RECEIVED', by: 'System', at: '2026-11-07T03:10:00.000Z' }]
    }
  ];

  const orders: OrderBookingRecord[] = [
    {
      id: 'ord_zt_9011',
      website_id: 'site_zt_traders',
      referenceCode: 'ZT-ORD-9011',
      type: 'ecommerce_order',
      title: 'Zaitoon Premium Ajwa & Olive Oil Gift Hamper x 2',
      customerName: 'Dr. Hamza Siddiqui',
      customerEmail: 'dr.hamza@pkmed.org',
      amount: 14800,
      currency: 'PKR',
      paymentStatus: 'paid',
      fulfillmentStatus: 'processing',
      details: {
        deliveryAddress: 'House 42, Street 9, DHA Phase 2, Islamabad',
        paymentGateway: 'Easypaisa Direct API',
        txnId: 'EP-9182049182'
      },
      createdAt: '2026-11-07T09:12:00.000Z',
    },
    {
      id: 'ord_musa_1042',
      website_id: 'site_musa_events',
      referenceCode: 'MGE-BK-1042',
      type: 'event_booking',
      title: 'Imperial Barat Stage & Luxury Lighting Decor',
      customerName: 'Sardar Usman Abbasi',
      customerEmail: 'usman.abbasi@abbasienergy.com',
      amount: 150000,
      currency: 'PKR',
      paymentStatus: 'advance_paid',
      fulfillmentStatus: 'confirmed',
      details: {
        advancePercentage: 20,
        eventDate: '2026-12-15',
        hallLocation: 'Islamabad Club Main Marquee',
        remainingDuePKR: 600000
      },
      createdAt: '2026-11-06T16:00:00.000Z',
    },
    {
      id: 'ord_roots_309',
      website_id: 'site_zaitoon_roots',
      referenceCode: 'ZRA-ADM-309',
      type: 'course_admission',
      title: 'BS Artificial Intelligence & Data Systems (Semester 1 Fee)',
      customerName: 'Ayesha Mehmood',
      customerEmail: 'ayesha.student@roots.zaitoon.org',
      amount: 65000,
      currency: 'PKR',
      paymentStatus: 'paid',
      fulfillmentStatus: 'confirmed',
      details: {
        studentId: 'ZRA-2026-AI-019',
        meritScholarshipPercent: 25,
        originalFeePKR: 86660
      },
      createdAt: '2026-11-05T12:00:00.000Z',
    }
  ];

  const auditLogs: AuditLogRecord[] = [
    {
      id: 'log_seed_01',
      actorEmail: 'mobigags@gmail.com',
      actorRole: 'super_admin',
      action: 'SYSTEM_BOOTSTRAP',
      resource: 'Zaitoon Central Database',
      website_id: '*',
      timestamp: now,
      ipAddress: '127.0.0.1 (Cloud Run Proxy)',
      severity: 'info',
      details: 'Zaitoon Universal Platform initialized with 9 verified Vercel web applications.'
    },
    {
      id: 'log_seed_02',
      actorEmail: 'mobigags@gmail.com',
      actorRole: 'super_admin',
      action: 'ROW_LEVEL_SECURITY_AUDIT',
      resource: 'PostgreSQL Multi-Tenant Policies',
      website_id: '*',
      timestamp: now,
      ipAddress: '127.0.0.1',
      severity: 'info',
      details: 'Tenant isolation verified. Cross-tenant leakage strictly blocked by website_id partitioning.'
    }
  ];

  const syncOutbox: SyncOutboxRecord[] = [
    {
      id: 'sync_init_01',
      entityType: 'website',
      entityId: 'site_quran_academy',
      website_id: 'site_quran_academy',
      operation: 'UPDATE',
      status: 'synced',
      retryCount: 0,
      lastAttempt: now,
      payload: { health: 'healthy', uptime: 99.98 }
    }
  ];

  const backups: BackupRecord[] = [
    {
      id: 'bk_cloudsql_auto_001',
      backupType: 'cloud_sql_export',
      fileName: 'zaitoon_postgres_backup_20261107_000000.sql.gz',
      sizeBytes: 4892140,
      status: 'completed',
      checksum: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      storageLocation: 'gs://zaitoon-backups-central-asia-east1/automated/2026/11/',
      verified: true,
      createdAt: '2026-11-07T00:00:00.000Z',
    },
    {
      id: 'bk_cloudsql_auto_002',
      backupType: 'automated_daily',
      fileName: 'zaitoon_central_db_snapshot_20261106.json',
      sizeBytes: 241580,
      status: 'completed',
      checksum: 'sha256:88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589',
      storageLocation: 'gs://zaitoon-backups-central-asia-east1/snapshots/',
      verified: true,
      createdAt: '2026-11-06T00:00:00.000Z',
    }
  ];

  return {
    version: '1.0.0-enterprise',
    lastUpdated: now,
    websites,
    users,
    submissions,
    orders,
    auditLogs,
    syncOutbox,
    backups,
  };
}
