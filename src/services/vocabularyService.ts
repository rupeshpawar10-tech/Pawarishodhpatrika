import { VocabularyRecord, VocabularyType } from '../types/enterprise';

const STORAGE_KEY = 'satpura_vocabularies_v1';

const INITIAL_VOCABULARIES: VocabularyRecord[] = [
  {
    vocabularyId: 'VOC-0001',
    type: 'languages',
    code: 'paw',
    label: { hi: 'पवारी बोली', en: 'Pawari Dialect', paw: 'पवारी' },
    description: { hi: 'सतपुड़ा एवं वरद अंचल में बोली जाने वाली प्रमुख भीली-राजस्थानी मिश्रित बोली', en: 'Pawari dialect spoken in Satpura region' },
    sortOrder: 1,
    status: 'approved',
    isSystem: true,
    createdBy: 'admin@taaptiresearch.org',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    vocabularyId: 'VOC-0002',
    type: 'genres',
    code: 'lokgeet',
    label: { hi: 'लोकगीत', en: 'Folk Song' },
    description: { hi: 'पारंपरिक सांस्कृतिक लोकगीत एवं विवाह गीत', en: 'Traditional folk songs and marriage chants' },
    sortOrder: 2,
    status: 'approved',
    isSystem: true,
    createdBy: 'admin@taaptiresearch.org',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    vocabularyId: 'VOC-0003',
    type: 'part_of_speech',
    code: 'noun',
    label: { hi: 'संज्ञा (Noun)', en: 'Noun' },
    sortOrder: 1,
    status: 'approved',
    isSystem: true,
    createdBy: 'admin@taaptiresearch.org',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const VocabularyService = {
  getVocabularies: (): VocabularyRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VOCABULARIES));
        return INITIAL_VOCABULARIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_VOCABULARIES;
    }
  },

  saveVocabulary: (vocab: VocabularyRecord) => {
    const list = VocabularyService.getVocabularies();
    const index = list.findIndex(v => v.vocabularyId === vocab.vocabularyId);
    if (index >= 0) {
      list[index] = { ...vocab, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(vocab);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('vocabularies_changed'));
  },

  deleteVocabulary: (vocabularyId: string) => {
    let list = VocabularyService.getVocabularies();
    list = list.filter(v => v.vocabularyId !== vocabularyId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('vocabularies_changed'));
  },

  getByType: (type: VocabularyType): VocabularyRecord[] => {
    return VocabularyService.getVocabularies().filter(v => v.type === type);
  }
};
