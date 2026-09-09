import { IHistoryService } from '../interfaces';
import { HistoryRecord } from '../../types';
import { sampleHistoryRecords } from '../../fixtures/history.fixture';

const HISTORY_STORAGE_KEY = 'datatwin_schema_history';

export class MockHistoryService implements IHistoryService {
  private getInitialRecords(): HistoryRecord[] {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch {}
    return JSON.parse(JSON.stringify(sampleHistoryRecords));
  }

  private persist(records: HistoryRecord[]): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
      }
    } catch {}
  }

  async listSchemas(): Promise<HistoryRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.getInitialRecords();
  }

  async getSchema(id: string): Promise<HistoryRecord | null> {
    const list = this.getInitialRecords();
    const found = list.find((r) => r.id === id);
    return found || null;
  }

  async saveSchema(record: HistoryRecord): Promise<HistoryRecord> {
    const list = this.getInitialRecords();
    const existingIndex = list.findIndex((r) => r.id === record.id);
    const updatedRecord = {
      ...record,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      list[existingIndex] = updatedRecord;
    } else {
      list.unshift(updatedRecord);
    }

    this.persist(list);
    return updatedRecord;
  }

  async createVersion(id: string, newVersion: string): Promise<HistoryRecord> {
    const list = this.getInitialRecords();
    const existing = list.find((r) => r.id === id);
    if (!existing) {
      throw new Error(`Schema ${id} not found`);
    }

    const versioned: HistoryRecord = {
      ...existing,
      id: `hist-${Date.now()}`,
      version: newVersion,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.unshift(versioned);
    this.persist(list);
    return versioned;
  }

  async deleteSchema(id: string): Promise<boolean> {
    const list = this.getInitialRecords();
    const filtered = list.filter((r) => r.id !== id);
    this.persist(filtered);
    return true;
  }
}
