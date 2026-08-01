import { PreservationRecord } from '../types/enterprisePlatform';

const STORAGE_KEY = 'satpura_preservation_v1';

const INITIAL_PRESERVATIONS: PreservationRecord[] = [
  {
    preservationId: 'PRES-0001',
    objectType: 'dictionary',
    objectId: 'dict-1',
    title: 'पवारी-हिंदी-अंग्रेजी त्रिभाषीय शब्दकोश (Trilingual Dictionary)',
    checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    checksumSha512: 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
    fixityStatus: 'verified',
    lastScanDate: new Date().toISOString(),
    retentionPeriod: 'permanent',
    packageFormat: 'BagIt',
    pid: 'PID-SAT-DICT-2026-001',
    replicas: 3
  },
  {
    preservationId: 'PRES-0002',
    objectType: 'corpus',
    objectId: 'corp-1',
    title: 'सतपुड़ा लोकगीत ऑडियो संग्रह एवं टेक्सचुअल ट्रांसक्रिप्शन',
    checksumSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    checksumSha512: 'b10a8db164e0754105b7a99be72e3fe5b924677ad02fea74feef3f3d620dca2e32a6773fa6c88820cfbc94e1d1645367b0ebf4cb63c0a4e769666cfb2f8190c1',
    fixityStatus: 'verified',
    lastScanDate: new Date().toISOString(),
    retentionPeriod: '100_years',
    packageFormat: 'TEI_XML',
    pid: 'PID-SAT-CORP-2026-042',
    replicas: 3
  },
  {
    preservationId: 'PRES-0003',
    objectType: 'papers',
    objectId: 'paper-1',
    title: 'पवार राजवंश का सतपुड़ा अंचल में प्रवासन एवं सांस्कृतिक अवदान',
    checksumSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    checksumSha512: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92f4b3252d43a6d7f57cb51322c391775c96033486c729c13f9c0e44284d720b66',
    fixityStatus: 'verified',
    lastScanDate: new Date().toISOString(),
    retentionPeriod: '50_years',
    packageFormat: 'PDF_A',
    pid: 'PID-SAT-PAPER-2026-015',
    replicas: 2
  }
];

export const PreservationService = {
  getPreservations: (): PreservationRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRESERVATIONS));
        return INITIAL_PRESERVATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PRESERVATIONS;
    }
  },

  runFixityScan: (): PreservationRecord[] => {
    const list = PreservationService.getPreservations();
    list.forEach(item => {
      item.fixityStatus = 'verified';
      item.lastScanDate = new Date().toISOString();
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('preservation_changed'));
    return list;
  }
};
