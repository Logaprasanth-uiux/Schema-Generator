'use client';

import React, { useState, useEffect } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { historyService } from '../../services';
import { HistoryRecord } from '../../types';
import { 
  History as HistoryIcon, 
  Search, 
  Plus, 
  ArrowRight, 
  Clock, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  FileCode,
  Trash2
} from 'lucide-react';
import { StageActionBar } from '../layout/StageActionBar';

export const HistoryPage: React.FC = () => {
  const { loadHistorySchema, startNewSchema } = useWorkflow();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const list = await historyService.listSchemas();
      setRecords(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this schema from history?')) {
      await historyService.deleteSchema(id);
      await fetchRecords();
    }
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* 1. Sticky Top Action Bar */}
      <StageActionBar
        title="Schema History & Saved Sessions"
        description="Select a previously generated schema to open in Edit Mode, or start a new schema."
        rightActions={
          <button
            onClick={startNewSchema}
            className="flex items-center space-x-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-semibold rounded-lg text-xs transition-all shadow-sm shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Schema</span>
          </button>
        }
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 p-5 lg:p-6 max-w-5xl w-full mx-auto space-y-4 pb-16">
        {/* Search and Filters Bar */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5 transition-colors">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by schema name or domain..."
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-400 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-all"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1 text-xs select-none self-start sm:self-auto">
            {['All', 'Completed', 'In Review', 'Draft'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedStatus === status
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* History List / Table */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden transition-colors">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-neutral-500">
              Loading history records...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <HistoryIcon className="h-8 w-8 text-neutral-400 mx-auto" />
              <p className="text-xs text-neutral-600 dark:text-neutral-400">No schema records match your filter.</p>
              <button
                onClick={startNewSchema}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 rounded-lg text-xs font-semibold"
              >
                Create New Schema
              </button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredRecords.map((record) => {
                return (
                  <div
                    key={record.id}
                    onClick={() => loadHistorySchema(record)}
                    className="p-4 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    {/* Left: Schema Info */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-neutral-950 dark:group-hover:text-white truncate">
                          {record.name}
                        </h3>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 shrink-0">
                          {record.version}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded shrink-0 ${
                            record.status === 'Completed'
                              ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700'
                              : record.status === 'In Review'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50'
                              : 'bg-neutral-50 text-neutral-600 border border-neutral-200 dark:bg-neutral-900 dark:text-neutral-400'
                          }`}
                        >
                          {record.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        {record.description}
                      </p>

                      <div className="flex items-center space-x-3 text-[10px] font-mono text-neutral-400 pt-0.5">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Updated {formatDate(record.updatedAt)}</span>
                        </span>
                        <span>•</span>
                        <span>{record.classCount} Classes</span>
                        <span>•</span>
                        <span>{record.componentCount} Components</span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={(e) => handleDelete(e, record.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors"
                        title="Delete from history"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => loadHistorySchema(record)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-semibold rounded-lg text-xs border border-neutral-200 dark:border-neutral-700 transition-colors shadow-xs"
                      >
                        <span>Open & Edit</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
