import { ISchemaHistoryService } from '../interfaces';
import { SchemaVersion } from '../../types';
import { sampleSchemaVersions } from '../../fixtures/schemaVersions.fixture';

const SCHEMA_HISTORY_STORAGE_KEY = 'datatwin_schema_version_history';

export class MockSchemaHistoryService implements ISchemaHistoryService {
  private getInitialVersions(): SchemaVersion[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(SCHEMA_HISTORY_STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Failed to read schema versions from localStorage', e);
      }
    }
    return JSON.parse(JSON.stringify(sampleSchemaVersions));
  }

  private persist(data: SchemaVersion[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SCHEMA_HISTORY_STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn('Failed to persist schema versions to localStorage', e);
      }
    }
  }

  async getVersions(): Promise<SchemaVersion[]> {
    return this.getInitialVersions();
  }

  async recordVersion(
    versionData: Omit<SchemaVersion, 'id' | 'versionNumber'>
  ): Promise<SchemaVersion> {
    const all = this.getInitialVersions();
    const newVersionNumber = all.length + 1;

    const newVersion: SchemaVersion = {
      ...versionData,
      id: `schema-v${newVersionNumber}-${Date.now()}`,
      versionNumber: newVersionNumber,
    };

    all.push(newVersion);
    this.persist(all);
    return newVersion;
  }
}
