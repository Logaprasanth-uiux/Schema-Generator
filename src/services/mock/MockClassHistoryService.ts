import { IClassHistoryService } from '../interfaces';
import { ClassVersion } from '../../types';
import { sampleClassVersions } from '../../fixtures/classVersions.fixture';

const CLASS_HISTORY_STORAGE_KEY = 'datatwin_class_version_history';

export class MockClassHistoryService implements IClassHistoryService {
  private getInitialVersions(): Record<string, ClassVersion[]> {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(CLASS_HISTORY_STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Failed to read class versions from localStorage', e);
      }
    }
    return JSON.parse(JSON.stringify(sampleClassVersions));
  }

  private persist(data: Record<string, ClassVersion[]>): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CLASS_HISTORY_STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn('Failed to persist class versions to localStorage', e);
      }
    }
  }

  async getAllVersions(): Promise<Record<string, ClassVersion[]>> {
    return this.getInitialVersions();
  }

  async getVersions(classId: string): Promise<ClassVersion[]> {
    const all = this.getInitialVersions();
    return all[classId] || all[classId.toLowerCase()] || [];
  }

  async recordVersion(
    versionData: Omit<ClassVersion, 'id' | 'versionNumber'>
  ): Promise<ClassVersion> {
    const all = this.getInitialVersions();
    const classId = versionData.classId;
    const existing = all[classId] || [];
    const newVersionNumber = existing.length + 1;

    const newVersion: ClassVersion = {
      ...versionData,
      id: `${classId}-v${newVersionNumber}-${Date.now()}`,
      versionNumber: newVersionNumber,
    };

    all[classId] = [...existing, newVersion];
    this.persist(all);
    return newVersion;
  }
}
