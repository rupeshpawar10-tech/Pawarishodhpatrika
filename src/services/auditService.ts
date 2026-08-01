import { AuditRecord } from '../types/enterprisePlatform';

const STORAGE_KEY = 'satpura_audit_logs_v1';

const INITIAL_AUDITS: AuditRecord[] = [
  {
    auditId: 'AUD-0001',
    module: 'dictionary',
    recordId: 'dict-1',
    action: 'publish',
    performedBy: 'admin@taaptiresearch.org',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    ipAddress: '192.168.1.45',
    device: 'Chrome / macOS',
    requestId: 'req-98f23c'
  },
  {
    auditId: 'AUD-0002',
    module: 'corpus',
    recordId: 'corp-1',
    action: 'create',
    performedBy: 'editor@taaptiresearch.org',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    ipAddress: '192.168.1.88',
    device: 'Firefox / Windows',
    requestId: 'req-44a10b'
  },
  {
    auditId: 'AUD-0003',
    module: 'citations',
    recordId: 'CIT-000001',
    action: 'edit',
    performedBy: 'admin@taaptiresearch.org',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    ipAddress: '192.168.1.45',
    device: 'Chrome / macOS',
    requestId: 'req-77b89e'
  }
];

export const AuditService = {
  getAudits: (): AuditRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_AUDITS));
        return INITIAL_AUDITS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_AUDITS;
    }
  },

  logAction: (module: string, recordId: string, action: AuditRecord['action'], performedBy: string) => {
    const list = AuditService.getAudits();
    const newAudit: AuditRecord = {
      auditId: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      module,
      recordId,
      action,
      performedBy,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      device: 'Enterprise Web Client',
      requestId: `req-${Math.random().toString(36).substring(7)}`
    };
    list.unshift(newAudit);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('audits_changed'));
  }
};
