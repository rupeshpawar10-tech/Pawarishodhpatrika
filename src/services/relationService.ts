import { RelationRecord, RelationType, SupportedModule } from '../types/enterprise';

const STORAGE_KEY = 'satpura_relations_v1';

const INITIAL_RELATIONS: RelationRecord[] = [
  {
    relationId: 'REL-00001',
    sourceModule: 'papers',
    sourceRecordId: 'paper-1',
    targetModule: 'history',
    targetRecordId: 'hist-1',
    relationType: 'cites',
    direction: 'source_to_target',
    confidenceScore: 98,
    notes: 'शोध पत्र में इस ऐतिहासिक घटना का प्राथमिक संदर्भ दिया गया है।',
    status: 'published',
    createdBy: 'admin@taaptiresearch.org',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    relationId: 'REL-00002',
    sourceModule: 'dictionary',
    sourceRecordId: 'dict-1',
    targetModule: 'corpus',
    targetRecordId: 'corp-1',
    relationType: 'derived_from',
    direction: 'bidirectional',
    confidenceScore: 95,
    notes: 'शब्दकोश का यह शब्द इस लोकगीत कॉर्पस ऑडियो से संकलित किया गया है।',
    status: 'published',
    createdBy: 'editor@taaptiresearch.org',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const RelationService = {
  getRelations: (): RelationRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RELATIONS));
        return INITIAL_RELATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_RELATIONS;
    }
  },

  saveRelation: (rel: RelationRecord) => {
    const list = RelationService.getRelations();
    // Validate uniqueness if already exists
    const existing = list.findIndex(r => r.relationId === rel.relationId);
    if (existing >= 0) {
      list[existing] = { ...rel, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(rel);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('relations_changed'));
  },

  deleteRelation: (relationId: string) => {
    let list = RelationService.getRelations();
    list = list.filter(r => r.relationId !== relationId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('relations_changed'));
  },

  getRelationsForRecord: (module: string, recordId: string): RelationRecord[] => {
    const list = RelationService.getRelations();
    return list.filter(r => 
      (r.sourceModule === module && r.sourceRecordId === recordId) ||
      (r.targetModule === module && r.targetRecordId === recordId)
    );
  }
};
