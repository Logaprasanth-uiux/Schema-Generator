import { IRequirementHistoryService } from '../interfaces';
import { RequirementVersion } from '../../types';
import { sampleRequirementVersions } from '../../fixtures/requirementVersions.fixture';

const REQ_HISTORY_STORAGE_KEY = 'datatwin_req_version_history';

export class MockRequirementHistoryService implements IRequirementHistoryService {
  private getInitialVersions(): Record<string, RequirementVersion[]> {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(REQ_HISTORY_STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Failed to read requirement versions from localStorage', e);
      }
    }
    return JSON.parse(JSON.stringify(sampleRequirementVersions));
  }

  private persist(data: Record<string, RequirementVersion[]>): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(REQ_HISTORY_STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn('Failed to persist requirement versions to localStorage', e);
      }
    }
  }

  async getAllVersions(): Promise<Record<string, RequirementVersion[]>> {
    return this.getInitialVersions();
  }

  async getVersions(requirementId: string): Promise<RequirementVersion[]> {
    const all = this.getInitialVersions();
    return all[requirementId] || all[requirementId.toLowerCase()] || [];
  }

  async recordVersion(
    versionData: Omit<RequirementVersion, 'id' | 'versionNumber'>
  ): Promise<RequirementVersion> {
    const all = this.getInitialVersions();
    const reqId = versionData.requirementId;
    const existing = all[reqId] || [];
    const newVersionNumber = existing.length + 1;

    const newVersion: RequirementVersion = {
      ...versionData,
      id: `${reqId}-v${newVersionNumber}-${Date.now()}`,
      versionNumber: newVersionNumber,
    };

    all[reqId] = [...existing, newVersion];
    this.persist(all);
    return newVersion;
  }
}
