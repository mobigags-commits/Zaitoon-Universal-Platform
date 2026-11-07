export type Language = 'en' | 'ur' | 'ar';

export interface Translations {
  appName: string;
  adminTitle: string;
  centralDb: string;
  coreApi: string;
  controlCenter: string;
  connectedWebsites: string;
  allWebsites: string;
  addNewWebsite: string;
  submissions: string;
  ordersAndBookings: string;
  databaseSchema: string;
  dataSync: string;
  userManagement: string;
  clientSdk: string;
  backupsAndDr: string;
  auditLogs: string;
  seoCenter: string;
  systemSettings: string;
  totalWebsites: string;
  activeStatus: string;
  pendingReviews: string;
  totalSubmissions: string;
  totalRevenue: string;
  apiHealth: string;
  networkTelemetry: string;
  quickActions: string;
  runHealthPing: string;
  searchPlaceholder: string;
  filterByCategory: string;
  filterByStatus: string;
  websiteId: string;
  apiKey: string;
  actions: string;
  status: string;
  saveChanges: string;
  cancel: string;
  confirm: string;
  deleteWebsiteWarning: string;
  tenantIsolationActive: string;
  superAdminOnly: string;
  syncedWithPostgres: string;
  live: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Zaitoon Universal Platform',
    adminTitle: 'Zaitoon Master Admin',
    centralDb: 'Zaitoon Central Database',
    coreApi: 'Zaitoon Core API',
    controlCenter: 'Zaitoon Control Center',
    connectedWebsites: 'Connected Websites',
    allWebsites: 'All Network Websites',
    addNewWebsite: 'Add New Website',
    submissions: 'Form Submissions',
    ordersAndBookings: 'Orders & Bookings',
    databaseSchema: 'Central Database & SQL',
    dataSync: 'Firestore Sync Engine',
    userManagement: 'User Management & RBAC',
    clientSdk: 'Client Integration & SDK',
    backupsAndDr: 'Backups & Recovery',
    auditLogs: 'Security & Audit Logs',
    seoCenter: 'SEO & AdSense Center',
    systemSettings: 'Cloud Infrastructure',
    totalWebsites: 'Connected Websites',
    activeStatus: 'Active & Operational',
    pendingReviews: 'Pending Approvals',
    totalSubmissions: 'Total Submissions',
    totalRevenue: 'Total Network Revenue',
    apiHealth: 'API & Cloud Status',
    networkTelemetry: 'Network Telemetry & Health',
    quickActions: 'Operational Quick Actions',
    runHealthPing: 'Ping Network Endpoints',
    searchPlaceholder: 'Search records, forms, websites or customers...',
    filterByCategory: 'Filter by Category',
    filterByStatus: 'Filter by Status',
    websiteId: 'Website ID',
    apiKey: 'API Key',
    actions: 'Actions',
    status: 'Status',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    confirm: 'Confirm Action',
    deleteWebsiteWarning: 'Are you sure? Data retention safeguards will preserve historical records.',
    tenantIsolationActive: 'Multi-Tenant PostgreSQL Isolation Active',
    superAdminOnly: 'Super Admin Authorization Required',
    syncedWithPostgres: 'Authoritative PostgreSQL Synced',
    live: 'LIVE',
  },
  ur: {
    appName: 'زیتون یونیورسل پلیٹ فارم',
    adminTitle: 'زیتون ماسٹر ایڈمن',
    centralDb: 'زیتون مرکزی ڈیٹا بیس',
    coreApi: 'زیتون کور اے پی آئی',
    controlCenter: 'زیتون کنٹرول سینٹر',
    connectedWebsites: 'منسلک ویب سائٹس',
    allWebsites: 'تمام نیٹ ورک ویب سائٹس',
    addNewWebsite: 'نئی ویب سائٹ شامل کریں',
    submissions: 'فارم اندراجات',
    ordersAndBookings: 'آرڈرز اور بکنگز',
    databaseSchema: 'مرکزی ڈیٹا بیس اور ایس کیو ایل',
    dataSync: 'فائر اسٹور ہم آہنگی انجن',
    userManagement: 'صارفین اور اختیارات',
    clientSdk: 'کلائنٹ ایس ڈی کے اور انضمام',
    backupsAndDr: 'بیک اپ اور بحالی',
    auditLogs: 'سیکیورٹی اور آڈٹ لاگز',
    seoCenter: 'ایس ای او اور ایڈسینس مرکز',
    systemSettings: 'کلاؤڈ انفراسٹرکچر',
    totalWebsites: 'کل منسلک ویب سائٹس',
    activeStatus: 'فعال اور آپریشنل',
    pendingReviews: 'زیر التواء توثیق',
    totalSubmissions: 'کل فارم اندراجات',
    totalRevenue: 'کل نیٹ ورک آمدنی',
    apiHealth: 'اے پی آئی اور کلاؤڈ حالت',
    networkTelemetry: 'نیٹ ورک مانیٹرنگ اور صحت',
    quickActions: 'فوری اقدامات',
    runHealthPing: 'تمام ویب سائٹس کو پنگ کریں',
    searchPlaceholder: 'ریکارڈز، ویب سائٹس یا کسٹمرز تلاش کریں...',
    filterByCategory: 'شعبے کے لحاظ سے فلٹر',
    filterByStatus: 'حیثیت کے لحاظ سے فلٹر',
    websiteId: 'ویب سائٹ آئی ڈی',
    apiKey: 'اے پی آئی کی',
    actions: 'اقدامات',
    status: 'حیثیت',
    saveChanges: 'تبدیلیاں محفوظ کریں',
    cancel: 'منسوخ کریں',
    confirm: 'تصدیق کریں',
    deleteWebsiteWarning: 'کیا آپ واقعی ویب سائٹ کو ہٹانا چاہتے ہیں؟ ڈیٹا محفوظ رہے گا۔',
    tenantIsolationActive: 'ملٹی ٹیننٹ الگ تھلگ ڈیٹا بیس فعال ہے',
    superAdminOnly: 'صرف سپر ایڈمن کے اختیارات درکار ہیں',
    syncedWithPostgres: 'پوسٹگریس کیول ڈیٹا بیس سے مکمل مطابقت',
    live: 'لائیو',
  },
  ar: {
    appName: 'منصة زيتون العالمية',
    adminTitle: 'لوحة تحكم زيتون الرئيسية',
    centralDb: 'قاعدة بيانات زيتون المركزية',
    coreApi: 'واجهة برمجة تطبيقات زيتون',
    controlCenter: 'مركز تحكم زيتون',
    connectedWebsites: 'المواقع المتصلة',
    allWebsites: 'جميع مواقع الشبكة',
    addNewWebsite: 'إضافة موقع جديد',
    submissions: 'بيانات النماذج',
    ordersAndBookings: 'الطلبات والحجوزات',
    databaseSchema: 'قاعدة البيانات المركزية و SQL',
    dataSync: 'محرك مزامنة فايرستور',
    userManagement: 'إدارة المستخدمين والأدوار',
    clientSdk: 'حزمة تكامل العميل (SDK)',
    backupsAndDr: 'النسخ الاحتياطي والاسترداد',
    auditLogs: 'سجلات الأمان والتدقيق',
    seoCenter: 'مركز تحسين محركات البحث وإدسينس',
    systemSettings: 'البنية التحتية السحابية',
    totalWebsites: 'المواقع المتصلة',
    activeStatus: 'نشط ويعمل',
    pendingReviews: 'في انتظار المراجعة',
    totalSubmissions: 'إجمالي النماذج',
    totalRevenue: 'إجمالي الإيرادات',
    apiHealth: 'حالة الواجهة والسحابة',
    networkTelemetry: 'قياسات وصحة الشبكة',
    quickActions: 'إجراءات سريعة',
    runHealthPing: 'فحص استجابة المواقع الحية',
    searchPlaceholder: 'ابحث عن السجلات أو المواقع أو العملاء...',
    filterByCategory: 'تصفية حسب الفئة',
    filterByStatus: 'تصفية حسب الحالة',
    websiteId: 'معرف الموقع',
    apiKey: 'مفتاح API',
    actions: 'إجراءات',
    status: 'الحالة',
    saveChanges: 'حفظ التغييرات',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    deleteWebsiteWarning: 'هل أنت متأكد؟ سيتم الاحتفاظ بالسجلات التاريخية بموجب سياسة الاستبقاء.',
    tenantIsolationActive: 'عزل البيانات متعدد المستأجرين نشط',
    superAdminOnly: 'مطلوب صلاحية المشرف العام (Super Admin)',
    syncedWithPostgres: 'متزامن مع PostgreSQL الرئيسي',
    live: 'مباشر',
  },
};

export function isRTL(lang: Language): boolean {
  return lang === 'ur' || lang === 'ar';
}
