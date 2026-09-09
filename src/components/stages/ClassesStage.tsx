'use client';

import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { 
  Boxes, 
  Database, 
  Layers, 
  Workflow, 
  ArrowRight, 
  ArrowLeft, 
  Edit3, 
  Plus, 
  Sparkles, 
  AlertTriangle,
  Network,
  X
} from 'lucide-react';
import { SchemaClass } from '../../types';
import { StageActionBar } from '../layout/StageActionBar';

export const ClassesStage: React.FC = () => {
  const { 
    workflow, 
    setStage,
    updateClass, 
    addClass, 
    removeClass, 
    generateSchema,
    sendAssistantMessage
  } = useWorkflow();

  const classes = workflow.classes || [];
  const [editingClass, setEditingClass] = useState<SchemaClass | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'dependencies'>('cards');
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);

  // New Class Form State
  const [newClassName, setNewClassName] = useState('');
  const [newClassPurpose, setNewClassPurpose] = useState('');
  const [newClassDatasource, setNewClassDatasource] = useState('PrePaidReport');
  const [newClassGrain, setNewClassGrain] = useState('Per itemid Monthly');

  if (classes.length === 0) {
    return (
      <div className="flex flex-col min-h-full">
        <StageActionBar
          title="Domain Classes"
          description="Classes not yet generated."
          leftActions={
            <button
              onClick={() => setStage('requirements')}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-md transition-colors"
              title="Back to Requirements"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          }
        />
        <div className="flex-1 p-12 text-center text-neutral-600 dark:text-neutral-400">
          <p className="text-xs">No domain classes generated yet. Please return to Requirements stage.</p>
          <button
            onClick={() => setStage('requirements')}
            className="mt-4 px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg text-xs font-semibold"
          >
            Go to Requirements
          </button>
        </div>
      </div>
    );
  }

  const handleOpenEdit = (cls: SchemaClass) => {
    setEditingClass(JSON.parse(JSON.stringify(cls)));
  };

  const handleSaveEdit = () => {
    if (!editingClass) return;
    updateClass(editingClass.id, editingClass);
    setEditingClass(null);
  };

  const handleCreateClass = () => {
    if (!newClassName.trim()) return;
    const nextNumber = classes.length + 1;
    const newCls: SchemaClass = {
      id: `class-${Date.now()}`,
      classNumber: nextNumber,
      className: newClassName.trim(),
      purpose: newClassPurpose.trim() || 'Custom SCDP Processing Class',
      datasource: newClassDatasource.trim(),
      grain: newClassGrain.trim(),
      classLevelFields: ['documentnumber', 'itemid', 'forprdfrom', 'forprdto'],
      lookupRules: [],
      formulaRules: [],
      components: [
        {
          id: `comp-${Date.now()}`,
          name: 'CustomParameter',
          type: 'MATH',
          expression: '1.0',
        },
      ],
      criteria: ['documentnumber EQ *'],
      conditions: [],
      expectedOutput: 'TT',
      dependencies: ['NA'],
      exposes: ['CustomParameter'],
      reviewPoints: 'Newly added custom schema class.',
      isCustomAdded: true,
    };
    addClass(newCls);
    setIsAddClassModalOpen(false);
    setNewClassName('');
    setNewClassPurpose('');
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* 1. Sticky Workspace Top Action Bar */}
      <StageActionBar
        title="Domain Classes Architecture"
        description={`${classes.length} classes configured with grains, formulas, and dependencies.`}
        leftActions={
          <button
            onClick={() => setStage('requirements')}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Back to Requirements"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        }
        rightActions={
          <>
            {/* View Mode Toggle */}
            <div className="flex bg-neutral-100 dark:bg-neutral-950 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'cards' 
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('dependencies')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'dependencies' 
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold shadow-xs' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Lineage
              </button>
            </div>

            <button
              onClick={() => setIsAddClassModalOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-semibold transition-all shadow-xs"
            >
              <Plus className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400" />
              <span>Add Class</span>
            </button>

            <button
              onClick={generateSchema}
              className="flex items-center space-x-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-semibold rounded-lg text-xs transition-all shadow-sm shrink-0"
            >
              <span>Generate Schema</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </>
        }
      />

      {/* 2. Main Workspace Content */}
      <div className="flex-1 p-5 lg:p-6 max-w-5xl w-full mx-auto space-y-4 pb-16">
        {/* View Mode 1: Dependency Flow View */}
        {viewMode === 'dependencies' && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 lg:p-5 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                <Network className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                <span>SCDP Inter-Class Dependency & Lineage Flow</span>
              </h3>
              <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">Level 1 → Level 2 → Level 3</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Column 1: Masters */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-300 uppercase tracking-wider block px-1">
                  Level 1: Masters
                </span>
                {classes.slice(0, 4).map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">#{c.classNumber} {c.className}</span>
                      <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">{c.grain}</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{c.purpose}</p>
                  </div>
                ))}
              </div>

              {/* Column 2: Ingestion & Math */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-300 uppercase tracking-wider block px-1">
                  Level 2: Ingestion & Calc
                </span>
                {classes.slice(4, 8).map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">#{c.classNumber} {c.className}</span>
                      <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">{c.grain}</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{c.purpose}</p>
                    <div className="pt-1 flex flex-wrap gap-1">
                      {c.dependencies.map((d, i) => (
                        <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                          Dep: {d}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Column 3: Allocations & WF */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-300 uppercase tracking-wider block px-1">
                  Level 3: Allocation & Gating
                </span>
                {classes.slice(8).map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">#{c.classNumber} {c.className}</span>
                      <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">{c.grain}</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{c.purpose}</p>
                    <div className="pt-1 flex flex-wrap gap-1">
                      {c.conditions.map((cond, i) => (
                        <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                          Gate: {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Dynamic Cards Grid */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {classes.map((cls) => {
              return (
                <div
                  key={cls.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 rounded-xl p-4 shadow-sm space-y-2.5 flex flex-col justify-between transition-all group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                            Class #{cls.classNumber}
                          </span>
                          <h3 className="text-sm font-bold text-neutral-900 dark:text-white transition-colors">
                            {cls.className}
                          </h3>
                        </div>
                        <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-1">
                          DS: <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{cls.datasource}</span> • Grain: <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{cls.grain}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleOpenEdit(cls)}
                        className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        title="Edit Class"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-3 leading-relaxed">
                      {cls.purpose}
                    </p>

                    {/* Components Required Preview */}
                    <div className="space-y-1 pt-1.5 border-t border-neutral-100 dark:border-neutral-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                        Components ({cls.components.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {cls.components.map((comp) => (
                          <span
                            key={comp.id}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800"
                          >
                            {comp.name} <span className="text-neutral-500 dark:text-neutral-400">({comp.type})</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Conditions / Gating Rules if any */}
                    {cls.conditions.length > 0 && (
                      <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-700 dark:text-neutral-300 flex items-start space-x-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-neutral-500 shrink-0 mt-0.5" />
                        <span>{cls.conditions[0]}</span>
                      </div>
                    )}

                    {/* Lookups if any */}
                    {cls.lookupRules.length > 0 && (
                      <div className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-700 dark:text-neutral-300 truncate">
                        {cls.lookupRules[0]}
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
                    <button
                      onClick={() => sendAssistantMessage(`Explain the purpose and dependencies of Class ${cls.classNumber}: ${cls.className}`)}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center space-x-1 font-medium"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>AI Context</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(cls)}
                      className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white font-semibold"
                    >
                      Configure Class →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Class Modal */}
      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl text-neutral-900 dark:text-neutral-100 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-700">
                  Class #{editingClass.classNumber}
                </span>
                <h3 className="text-sm font-bold">{editingClass.className}</h3>
              </div>
              <button
                onClick={() => setEditingClass(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Class Name</label>
                  <input
                    type="text"
                    value={editingClass.className}
                    onChange={(e) => setEditingClass({ ...editingClass, className: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-900 dark:text-neutral-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Primary Datasource</label>
                  <input
                    type="text"
                    value={editingClass.datasource}
                    onChange={(e) => setEditingClass({ ...editingClass, datasource: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-900 dark:text-neutral-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Settlement Grain</label>
                <input
                  type="text"
                  value={editingClass.grain}
                  onChange={(e) => setEditingClass({ ...editingClass, grain: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-900 dark:text-neutral-200"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Purpose & Business Logic</label>
                <textarea
                  rows={3}
                  value={editingClass.purpose}
                  onChange={(e) => setEditingClass({ ...editingClass, purpose: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 text-neutral-900 dark:text-neutral-200 font-sans"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Components ({editingClass.components.length})
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {editingClass.components.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{comp.name}</span>
                        <span className="text-neutral-500 font-mono">[{comp.type}]</span>
                      </div>
                      <span className="font-mono text-neutral-600 dark:text-neutral-400 truncate max-w-xs">{comp.expression}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-neutral-100 dark:border-neutral-800">
              {editingClass.isCustomAdded ? (
                <button
                  onClick={() => {
                    removeClass(editingClass.id);
                    setEditingClass(null);
                  }}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium"
                >
                  Delete Class
                </button>
              ) : <div />}

              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold rounded-lg text-xs"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl text-neutral-900 dark:text-neutral-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xs font-bold flex items-center space-x-1.5">
                <Plus className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                <span>Create New Schema Domain Class</span>
              </h3>
              <button
                onClick={() => setIsAddClassModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Class Name</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="E.g. PrePaidVarianceCheck or AccountGroupSummary"
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-900 dark:text-neutral-200"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Primary Datasource</label>
                <input
                  type="text"
                  value={newClassDatasource}
                  onChange={(e) => setNewClassDatasource(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-900 dark:text-neutral-200"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Settlement Grain</label>
                <input
                  type="text"
                  value={newClassGrain}
                  onChange={(e) => setNewClassGrain(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-900 dark:text-neutral-200"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Purpose</label>
                <textarea
                  rows={3}
                  value={newClassPurpose}
                  onChange={(e) => setNewClassPurpose(e.target.value)}
                  placeholder="Describe the operational role and output of this class..."
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 text-neutral-900 dark:text-neutral-200"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsAddClassModalOpen(false)}
                className="px-3.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateClass}
                disabled={!newClassName.trim()}
                className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold rounded-lg text-xs"
              >
                Create Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
