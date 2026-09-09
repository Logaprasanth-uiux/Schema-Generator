'use client';

import React, { useState, useEffect } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { 
  Binary, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Copy, 
  Check, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  FileCode,
  FolderTree
} from 'lucide-react';
import { SchemaTreeNode } from '../../types';

export const SchemaStudioStage: React.FC = () => {
  const { 
    workflow, 
    setStage, 
    editedSchemaJson, 
    setEditedSchemaJson, 
    saveSchemaChanges, 
    copySchemaJson 
  } = useWorkflow();

  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!editedSchemaJson && workflow.schema) {
      setEditedSchemaJson(workflow.schema.rawJson);
    }
  }, [workflow.schema, editedSchemaJson, setEditedSchemaJson]);

  if (!workflow.schema) {
    return (
      <div className="p-12 text-center text-neutral-600 dark:text-neutral-400">
        <p>No schema generated yet. Please return to Classes stage.</p>
        <button
          onClick={() => setStage('classes')}
          className="mt-4 px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg text-xs font-semibold"
        >
          Go to Classes
        </button>
      </div>
    );
  }

  const handleCopy = async () => {
    const success = await copySchemaJson();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(editedSchemaJson);
      setEditedSchemaJson(JSON.stringify(parsed, null, 2));
      setSaveStatus({ type: 'success', message: 'JSON formatted cleanly' });
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 2500);
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: `Cannot format: ${err?.message}` });
    }
  };

  const handleSave = () => {
    const result = saveSchemaChanges();
    if (result.success) {
      setSaveStatus({ type: 'success', message: 'Schema changes saved successfully to workflow model!' });
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
    } else {
      setSaveStatus({ type: 'error', message: result.error || 'Syntax error in JSON' });
    }
  };

  const toggleNode = (nodeKey: string) => {
    setCollapsedNodes((prev) => ({
      ...prev,
      [nodeKey]: !prev[nodeKey],
    }));
  };

  // Render tree node recursively
  const renderTreeNode = (node: SchemaTreeNode, path: string, depth = 0) => {
    const key = `${path}-${node.technicalName || node.title}`;
    const isCollapsed = !!collapsedNodes[key];
    const hasChildren = node.children && node.children.length > 0;
    
    // Filter matching
    const matchesSearch = !searchQuery || 
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      node.technicalName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (node.val && node.val.toLowerCase().includes(searchQuery.toLowerCase()));

    if (searchQuery && !matchesSearch && !hasChildren) {
      return null;
    }

    return (
      <div key={key} className="text-xs select-none">
        <div
          onClick={() => hasChildren && toggleNode(key)}
          className={`flex items-center space-x-1.5 py-1 px-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer group transition-colors ${
            depth === 0 ? 'bg-neutral-100/70 dark:bg-neutral-900/60 font-semibold' : ''
          }`}
          style={{ paddingLeft: `${Math.max(8, depth * 16)}px` }}
        >
          {hasChildren ? (
            isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 shrink-0" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 shrink-0" />
            )
          ) : (
            <span className="h-3.5 w-3.5 flex items-center justify-center text-neutral-400 text-[10px] shrink-0">•</span>
          )}

          <span
            className={`${
              node.title.startsWith('#SchemaClass')
                ? 'text-neutral-900 dark:text-neutral-100 font-bold'
                : node.title.startsWith('#Components')
                ? 'text-neutral-800 dark:text-neutral-200 font-semibold'
                : node.title.startsWith('#Conditions')
                ? 'text-neutral-700 dark:text-neutral-300 font-semibold'
                : hasChildren
                ? 'text-neutral-800 dark:text-neutral-200'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {node.title}
          </span>

          {node.val !== undefined && (
            <span className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400 truncate max-w-xs">
              : &quot;{node.val}&quot;
            </span>
          )}

          {node.equality && (
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              {node.equality}
            </span>
          )}
        </div>

        {hasChildren && !isCollapsed && (
          <div className="border-l border-neutral-200 dark:border-neutral-800/80 ml-3">
            {node.children!.map((child, idx) => renderTreeNode(child, `${key}-${idx}`, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-5 lg:p-6 max-w-7xl mx-auto space-y-4 pb-20">
      {/* Header Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 bg-neutral-100 border border-neutral-200 dark:text-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 px-2 py-0.5 rounded-md">
                Stage 4 of 5
              </span>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">Schema Studio & Live JSON Workspace</span>
            </div>
            <h1 className="text-base font-bold text-neutral-900 dark:text-white mt-1">
              Dual-Pane Schema Tree & Code Editor
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 max-w-3xl">
              Inspect the structured SCDP hierarchy on the left or edit raw JSON directly on the right.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleFormatJson}
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Format JSON
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-neutral-800 dark:text-neutral-200" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Schema Changes</span>
            </button>
          </div>
        </div>

        {/* Status Notification Banner */}
        {saveStatus.type && (
          <div
            className={`mt-3 p-2.5 rounded-lg border text-xs flex items-center justify-between animate-in fade-in duration-150 ${
              saveStatus.type === 'success'
                ? 'bg-neutral-50 border-neutral-300 text-neutral-800 dark:bg-neutral-950 dark:border-neutral-700 dark:text-neutral-200'
                : 'bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950/50 dark:border-rose-500/40 dark:text-rose-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              {saveStatus.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              )}
              <span>{saveStatus.message}</span>
            </div>
            <button onClick={() => setSaveStatus({ type: null, message: '' })} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white">
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Dual Pane Studio Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[560px]">
        {/* Left Pane: Hierarchical Schema Tree (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm flex flex-col justify-between transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <FolderTree className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Hierarchical Schema Tree</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                {workflow.schema.stats.classCount} Classes
              </span>
            </div>

            {/* Tree Search Box */}
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nodes, fields, lookups..."
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-400 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none"
              />
            </div>

            {/* Tree View Content */}
            <div className="max-h-[460px] overflow-y-auto space-y-1 pr-1 font-mono text-xs">
              {workflow.schema.root.map((rootNode, idx) =>
                renderTreeNode(rootNode, `root-${idx}`, 0)
              )}
            </div>
          </div>

          <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>SCDP JSON Structure Valid</span>
            <span className="text-neutral-800 dark:text-neutral-200 font-mono font-semibold">100% Deterministic</span>
          </div>
        </div>

        {/* Right Pane: Live JSON Code Editor (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm flex flex-col justify-between transition-colors">
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <FileCode className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white">Formatted SCDP JSON Editor</h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                {(editedSchemaJson.length / 1024).toFixed(1)} KB • Editable
              </span>
            </div>

            {/* Editor Area */}
            <div className="flex-1 min-h-[420px] relative rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <textarea
                value={editedSchemaJson}
                onChange={(e) => setEditedSchemaJson(e.target.value)}
                spellCheck={false}
                className="w-full h-full min-h-[420px] bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-200 p-4 font-mono text-xs leading-relaxed resize-none focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
            <span>Edit any value directly • Click Save to commit</span>
            <button
              onClick={handleFormatJson}
              className="text-neutral-700 dark:text-neutral-300 hover:underline font-semibold"
            >
              Re-indent JSON
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Stage Action Bar */}
      <div className="sticky bottom-0 z-10 -mx-6 lg:-mx-8 -mb-6 lg:-mb-8 px-6 lg:px-8 py-3 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between shadow-lg transition-colors">
        <button
          onClick={() => setStage('classes')}
          className="flex items-center space-x-2 px-3 py-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Classes</span>
        </button>

        <button
          onClick={() => setStage('output')}
          className="flex items-center space-x-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-bold rounded-xl text-xs transition-all shadow-md"
        >
          <span>Proceed to Final Output</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
