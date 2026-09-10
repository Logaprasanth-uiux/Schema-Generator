import { SchemaVersion } from '../types';
import { sampleSchemaModel, rawSchemaJsonTree } from './schema.fixture';

// Generate realistic previous versions with slight modifications for diff comparison
const createVersion1Json = (): string => {
  const v1Tree = JSON.parse(JSON.stringify(rawSchemaJsonTree));
  if (v1Tree[0]?.children?.[1]?.children) {
    // Remove last 2 classes and change a few parameters
    v1Tree[0].children[1].children = v1Tree[0].children[1].children.slice(0, 9);
    const adClass = v1Tree[0].children[1].children[0];
    if (adClass) {
      adClass.title = '#SchemaClass#1 (AD_INITIAL)';
    }
  }
  return JSON.stringify(v1Tree, null, 2);
};

const createVersion2Json = (): string => {
  const v2Tree = JSON.parse(JSON.stringify(rawSchemaJsonTree));
  if (v2Tree[0]?.children?.[1]?.children) {
    const caClass = v2Tree[0].children[1].children[1];
    if (caClass) {
      caClass.title = '#SchemaClass#2 (CA_ALLOCATION_LEGACY)';
    }
  }
  return JSON.stringify(v2Tree, null, 2);
};

export const sampleSchemaVersions: SchemaVersion[] = [
  {
    id: 'schema-v1',
    versionNumber: 1,
    schemaGroupName: 'SCDP Generated Schema',
    rawJson: createVersion1Json(),
    timestamp: 'Sep 08, 2026 · 10:45 AM',
    actor: 'AI Generation Engine',
    changeSummary: 'Initial schema generated with 9 baseline settlement classes',
  },
  {
    id: 'schema-v2',
    versionNumber: 2,
    schemaGroupName: 'SCDP Generated Schema',
    rawJson: createVersion2Json(),
    timestamp: 'Sep 09, 2026 · 02:30 PM',
    actor: 'Logaprasanth (User)',
    changeSummary: 'Added 11-class architecture and fine-tuned CA allocation method lookup rules',
  },
];
