'use client';

import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  FileSpreadsheet, 
  FileCode, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Edit3
} from 'lucide-react';
import { SupportingDocument } from '../../types';

export const BusinessInputStage: React.FC = () => {
  const { 
    workflow, 
    updateBusinessInput, 
    addSupportingDocument, 
    removeSupportingDocument,
    generateBusinessRequirement,
    generateRequirements 
  } = useWorkflow();

  const [dragActive, setDragActive] = useState(false);
  const [customDocName, setCustomDocName] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const newDoc: SupportingDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        status: 'processed',
        uploadedAt: new Date().toISOString(),
        previewText: 'Uploaded document parsed for SCDP domain context.',
      };
      addSupportingDocument(newDoc);
    }
  };

  const handleAddMockFile = () => {
    if (!customDocName.trim()) return;
    const newDoc: SupportingDocument = {
      id: `doc-${Date.now()}`,
      name: customDocName.trim(),
      type: 'text/csv',
      size: 154200,
      status: 'processed',
      uploadedAt: new Date().toISOString(),
      previewText: 'Parsed table columns: accountclass, accountgroup, itemtype, lob, basevalue, taxpercentage',
    };
    addSupportingDocument(newDoc);
    setCustomDocName('');
  };

  const highLevelText = workflow.businessInput.highLevelRequirement || '';
  const generatedBRText = workflow.businessInput.generatedBusinessRequirement || '';
  const isGenerated = workflow.businessInput.isBusinessRequirementGenerated || generatedBRText.trim().length > 0;
  const isHighLevelValid = highLevelText.trim().length >= 5;
  const isGeneratedBRValid = generatedBRText.trim().length >= 20;
  const hasAdvancedInstructions = (workflow.businessInput.additionalInstructions || '').trim().length > 0;

  return (
    <div className="flex flex-col min-h-full">
      {/* 1. Sticky Workspace Top Action Bar — Directly under Global Header (0px gap) */}
      <div className="sticky top-0 z-20 w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-2.5 flex items-center justify-between transition-colors shadow-xs">
        <div>
          <h2 className="text-xs font-bold text-neutral-900 dark:text-white leading-tight">
            {isGenerated ? 'Review Business Requirement' : 'Generate Business Requirement'}
          </h2>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            {isGenerated
              ? 'Review and edit the expanded specification before generating structured requirements.'
              : 'Enter a high-level business requirement to begin.'}
          </p>
        </div>

        {isGenerated ? (
          <button
            onClick={generateRequirements}
            disabled={!isGeneratedBRValid}
            className="flex items-center space-x-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed font-semibold rounded-lg text-xs transition-all shadow-sm shrink-0"
          >
            <span>Generate Requirements</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={generateBusinessRequirement}
            disabled={!isHighLevelValid}
            className="flex items-center space-x-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed font-semibold rounded-lg text-xs transition-all shadow-sm shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Business Requirement</span>
          </button>
        )}
      </div>

      {/* 2. Main Workspace Content */}
      <div className="flex-1 p-5 lg:p-6 max-w-5xl w-full mx-auto space-y-4 pb-16">
        {/* Primary Input: High-Level Business Requirement */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-2.5 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
                <FileText className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                <span>Business Requirement</span>
              </label>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                Describe the business need in a sentence or a few lines.
              </p>
            </div>
            
            <div className="flex items-center space-x-3 text-[11px] text-neutral-400 font-mono">
              <span>{highLevelText.length} chars</span>
              {highLevelText && (
                <button
                  onClick={() => updateBusinessInput({ highLevelRequirement: '' })}
                  className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="relative rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden focus-within:border-neutral-400 dark:focus-within:border-neutral-600 focus-within:ring-1 focus-within:ring-neutral-400 dark:focus-within:ring-neutral-600 transition-all">
            <textarea
              rows={4}
              value={highLevelText}
              onChange={(e) => updateBusinessInput({ highLevelRequirement: e.target.value })}
              placeholder="e.g. Allocate prepaid expenses across Lines of Business based on configured allocation percentages and reconcile zero variance against general ledger..."
              className="w-full bg-neutral-50/50 dark:bg-neutral-950 p-3.5 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 leading-relaxed resize-none focus:outline-none"
            />
          </div>
        </div>

        {/* Generated Business Requirement Review / Edit Editor (Appears upon generation) */}
        {isGenerated && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-3 transition-colors animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <Edit3 className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                <label className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Generated Business Requirement
                </label>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                  Review & Edit
                </span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] text-neutral-400 font-mono">
                <span>{generatedBRText.length} chars</span>
                <button
                  onClick={() => updateBusinessInput({ generatedBusinessRequirement: '' })}
                  className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Review and edit the detailed business requirement before generating structured requirements.
            </p>

            {/* Long-form Document Editor */}
            <div className="relative rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden focus-within:border-neutral-400 dark:focus-within:border-neutral-600 focus-within:ring-1 focus-within:ring-neutral-400 dark:focus-within:ring-neutral-600 transition-all">
              <textarea
                value={generatedBRText}
                onChange={(e) => updateBusinessInput({ generatedBusinessRequirement: e.target.value })}
                placeholder="Generated business requirement will appear here..."
                className="w-full min-h-[380px] lg:min-h-[420px] max-h-[600px] bg-neutral-50/50 dark:bg-neutral-950 p-4 text-xs font-mono text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 leading-relaxed resize-y focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Supporting Documents Area */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-3 transition-colors">
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <label className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center space-x-1.5">
                <Upload className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400" />
                <span>Supporting Documents</span>
              </label>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                Upload sample datasets, lookup tables, or extract dictionaries.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
              {workflow.businessInput.supportingDocuments.length} files
            </span>
          </div>

          {/* Clean Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
              dragActive
                ? 'border-neutral-400 bg-neutral-100 dark:bg-neutral-800'
                : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/40'
            }`}
          >
            <FileSpreadsheet className="h-5 w-5 text-neutral-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Drag & drop files or browse</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">Supported: CSV · XLSX · JSON · PDF</p>

            <div className="mt-2.5 pt-2 border-t border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-center max-w-sm mx-auto space-x-1.5">
              <input
                type="text"
                value={customDocName}
                onChange={(e) => setCustomDocName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMockFile()}
                placeholder="Or enter filename.csv..."
                className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md px-2.5 py-1 text-[11px] text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 shadow-sm"
              />
              <button
                onClick={handleAddMockFile}
                disabled={!customDocName.trim()}
                className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 disabled:opacity-40 text-neutral-700 dark:text-neutral-300 rounded-md text-xs font-semibold border border-neutral-200 dark:border-neutral-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Uploaded Documents List */}
          {workflow.businessInput.supportingDocuments.length > 0 && (
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5 pt-1">
              {workflow.businessInput.supportingDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between space-x-2 text-xs"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <FileCode className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">{doc.name}</span>
                    <span className="text-[10px] text-neutral-400 shrink-0">
                      ({(doc.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeSupportingDocument(doc.id)}
                    className="text-neutral-400 hover:text-rose-500 p-1 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Collapsible Additional Instructions */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm transition-colors">
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
          >
            <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              <Sliders className="h-3.5 w-3.5 text-neutral-500" />
              <span>Additional Instructions (Optional)</span>
              {hasAdvancedInstructions && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700">
                  Configured
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1.5 text-neutral-400 text-xs">
              <span className="text-[11px] hidden sm:inline">
                {isAdvancedOpen ? 'Hide' : 'Expand'}
              </span>
              {isAdvancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </button>

          {isAdvancedOpen && (
            <div className="p-4 pt-1 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Optional custom prompt overrides, precision thresholds, or hard-gating rules for the SCDP generation engine:
              </p>
              <textarea
                rows={3}
                value={workflow.businessInput.additionalInstructions}
                onChange={(e) => updateBusinessInput({ additionalInstructions: e.target.value })}
                placeholder="e.g. Enforce 6-decimal precision math, mandate active GL check condition, generate Class 1 to 11 with explicit grain..."
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-400 rounded-lg p-3 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 leading-relaxed transition-all font-mono"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
