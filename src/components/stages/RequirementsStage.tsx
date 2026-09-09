'use client';

import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { 
  GitBranch, 
  Layers, 
  Edit3, 
  Check, 
  X, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  FileCheck,
  ShieldCheck,
  Calculator,
  Workflow as WorkflowIcon,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { 
  ProblemStatement, 
  BusinessObjective, 
  BusinessRequirement, 
  FinanceRequirement, 
  TechnicalRequirement 
} from '../../types';

export const RequirementsStage: React.FC = () => {
  const { 
    workflow, 
    setStage,
    updateProblemStatement, 
    updateBusinessObjective, 
    updateBusinessRequirement, 
    updateFinanceRequirement, 
    updateTechnicalRequirement,
    addAdditionalInformation,
    removeAdditionalInformation,
    generateClasses,
    sendAssistantMessage
  } = useWorkflow();

  const req = workflow.requirements;
  const [activeTab, setActiveTab] = useState<'all' | 'ps' | 'bo' | 'br' | 'fr' | 'tr' | 'traceability'>('all');
  
  // Editing state
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{ title: string; description: string }>({ title: '', description: '' });

  // Add information modal
  const [isAddInfoOpen, setIsAddInfoOpen] = useState(false);
  const [newInfoCategory, setNewInfoCategory] = useState<'business' | 'finance' | 'technical' | 'rule' | 'constraint' | 'note'>('rule');
  const [newInfoContent, setNewInfoContent] = useState('');

  if (!req) {
    return (
      <div className="p-12 text-center text-neutral-600 dark:text-neutral-400">
        <p>No requirements generated yet. Please return to Business Input stage.</p>
        <button
          onClick={() => setStage('business-input')}
          className="mt-4 px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg text-xs font-semibold"
        >
          Go to Business Input
        </button>
      </div>
    );
  }

  const startEdit = (id: string, title: string, description: string) => {
    setEditingCardId(id);
    setEditFormData({ title, description });
  };

  const cancelEdit = () => {
    setEditingCardId(null);
    setEditFormData({ title: '', description: '' });
  };

  const handleSavePS = (id: string) => {
    updateProblemStatement(id, { title: editFormData.title, description: editFormData.description });
    setEditingCardId(null);
  };

  const handleSaveBO = (id: string) => {
    updateBusinessObjective(id, { title: editFormData.title, description: editFormData.description });
    setEditingCardId(null);
  };

  const handleSaveBR = (id: string) => {
    updateBusinessRequirement(id, { title: editFormData.title, description: editFormData.description });
    setEditingCardId(null);
  };

  const handleSaveFR = (id: string) => {
    updateFinanceRequirement(id, { title: editFormData.title, description: editFormData.description });
    setEditingCardId(null);
  };

  const handleSaveTR = (id: string) => {
    updateTechnicalRequirement(id, { title: editFormData.title, description: editFormData.description });
    setEditingCardId(null);
  };

  const handleCreateAddInfo = () => {
    if (!newInfoContent.trim()) return;
    addAdditionalInformation({
      category: newInfoCategory,
      content: newInfoContent.trim(),
      author: 'User Reviewer',
    });
    setNewInfoContent('');
    setIsAddInfoOpen(false);
  };

  return (
    <div className="p-5 lg:p-6 max-w-7xl mx-auto space-y-5 pb-20">
      {/* Header Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 bg-neutral-100 border border-neutral-200 dark:text-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 px-2 py-0.5 rounded-md">
                Stage 2 of 5
              </span>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">Traceability & Requirements Review</span>
            </div>
            <h1 className="text-base font-bold text-neutral-900 dark:text-white mt-1">
              Structured Requirements Review & Refinement
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 max-w-3xl">
              Traceable requirement layers synthesized from the reviewed Business Requirement: Problem Statements, Objectives, Business Requirements, Finance Requirements, and Technical Requirements.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsAddInfoOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
              <Plus className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400" />
              <span>Add Information</span>
            </button>
          </div>
        </div>

        {/* Requirements Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4 pt-3.5 border-t border-neutral-100 dark:border-neutral-800">
          <div className="bg-neutral-50 dark:bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400">Problem Statements</p>
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{req.problemStatements.length}</p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400">Business Objectives</p>
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{req.businessObjectives.length}</p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400">Business Requirements</p>
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{req.businessRequirements.length}</p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400">Finance Rules (FR)</p>
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{req.financeRequirements.length}</p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400">Technical Specs (TR)</p>
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{req.technicalRequirements.length}</p>
          </div>
        </div>
      </div>

      {/* Additional Information / Rules Banner if any */}
      {workflow.additionalInformation.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 text-neutral-500" />
              <span>User-Appended Context & Rules ({workflow.additionalInformation.length})</span>
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {workflow.additionalInformation.map((info) => (
              <div
                key={info.id}
                className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-start justify-between space-x-2 text-xs"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 mr-1.5">
                    {info.category}
                  </span>
                  <span className="text-neutral-800 dark:text-neutral-200">{info.content}</span>
                </div>
                <button
                  onClick={() => removeAdditionalInformation(info.id)}
                  className="text-neutral-400 hover:text-rose-500 shrink-0 p-1"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Filter Nav */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-b border-neutral-200 dark:border-neutral-800 text-xs select-none">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'all'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          All Layers ({req.problemStatements.length + req.businessObjectives.length + req.businessRequirements.length + req.financeRequirements.length + req.technicalRequirements.length})
        </button>
        <button
          onClick={() => setActiveTab('ps')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'ps'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Problem Statements ({req.problemStatements.length})
        </button>
        <button
          onClick={() => setActiveTab('bo')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'bo'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Business Objectives ({req.businessObjectives.length})
        </button>
        <button
          onClick={() => setActiveTab('br')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'br'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Business Requirements ({req.businessRequirements.length})
        </button>
        <button
          onClick={() => setActiveTab('fr')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'fr'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Finance Requirements ({req.financeRequirements.length})
        </button>
        <button
          onClick={() => setActiveTab('tr')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'tr'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Technical Requirements ({req.technicalRequirements.length})
        </button>
        <button
          onClick={() => setActiveTab('traceability')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'traceability'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Traceability Map (HLR → TR)
        </button>
      </div>

      {/* Traceability Flow View */}
      {activeTab === 'traceability' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <GitBranch className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              <span>Full End-to-End Requirement Traceability Chain</span>
            </h3>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">HLR → PS → BO → BR → FR → TR</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs">
            <span className="font-bold text-neutral-800 dark:text-neutral-300 uppercase tracking-wider text-[10px] block mb-1">
              High Level Requirement (HLR)
            </span>
            <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed font-mono text-[11px]">
              {req.highLevelRequirement}
            </p>
          </div>

          <div className="space-y-3">
            {req.problemStatements.map((ps) => {
              const matchedBOs = req.businessObjectives.filter((bo) => bo.derivedFromPsCode === ps.code);
              return (
                <div key={ps.id} className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-950/70 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-200 flex items-center space-x-2">
                      <span className="font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700">
                        {ps.code}
                      </span>
                      <span>{ps.title}</span>
                    </span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{ps.category}</span>
                  </div>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 pl-2 border-l-2 border-neutral-400 dark:border-neutral-600">
                    {ps.description}
                  </p>

                  {/* Derived BOs */}
                  <div className="pl-3 space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800/80">
                    {matchedBOs.map((bo) => {
                      const matchedBRs = req.businessRequirements.filter((br) => br.derivedFromBoCode === bo.code);
                      return (
                        <div key={bo.id} className="space-y-2">
                          <div className="text-xs text-neutral-800 dark:text-neutral-200 flex items-center space-x-2">
                            <span className="font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-1.5 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 text-[10px]">
                              {bo.code}
                            </span>
                            <span className="font-semibold">{bo.title}</span>
                          </div>
                          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 pl-2">
                            {bo.description}
                          </p>

                          {/* Derived BRs */}
                          <div className="pl-3 space-y-2">
                            {matchedBRs.map((br) => {
                              const matchedFRs = req.financeRequirements.filter((fr) => fr.derivedFromBrCode === br.code);
                              return (
                                <div key={br.id} className="p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5 shadow-sm">
                                  <div className="text-xs text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
                                    <span className="flex items-center space-x-2">
                                      <span className="font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-1.5 py-0.5 rounded text-[10px]">
                                        {br.code}
                                      </span>
                                      <span className="font-semibold">{br.title}</span>
                                    </span>
                                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{br.category}</span>
                                  </div>
                                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400">{br.description}</p>

                                  {/* FR & TR */}
                                  <div className="pt-1 flex flex-wrap gap-1.5">
                                    {matchedFRs.map((fr) => (
                                      <span
                                        key={fr.id}
                                        title={fr.description}
                                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                                      >
                                        {fr.code}: {fr.title}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Layer Cards Display */}
      {activeTab !== 'traceability' && (
        <div className="space-y-5">
          {/* 1. Problem Statements */}
          {(activeTab === 'all' || activeTab === 'ps') && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Problem Statements ({req.problemStatements.length})</span>
                </h3>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Core operational pain points</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {req.problemStatements.map((ps) => {
                  const isEditing = editingCardId === ps.id;
                  return (
                    <div
                      key={ps.id}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-2 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                            {ps.code}
                          </span>
                          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editFormData.title}
                                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-0.5 text-xs text-neutral-900 dark:text-white"
                              />
                            ) : (
                              ps.title
                            )}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {ps.category}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={3}
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded p-2 text-xs text-neutral-900 dark:text-neutral-100 font-mono"
                          />
                          <div className="flex justify-end space-x-2">
                            <button onClick={cancelEdit} className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white">
                              Cancel
                            </button>
                            <button onClick={() => handleSavePS(ps.id)} className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 rounded text-xs font-semibold">
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                          {ps.description}
                        </p>
                      )}

                      {!isEditing && (
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400">
                          <span>{ps.isAiGenerated ? 'AI Generated' : 'User Modified'}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => startEdit(ps.id, ps.title, ps.description)}
                              className="hover:text-neutral-900 dark:hover:text-white flex items-center space-x-1"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Business Objectives */}
          {(activeTab === 'all' || activeTab === 'bo') && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 flex items-center space-x-1.5">
                  <FileCheck className="h-4 w-4" />
                  <span>Business Objectives ({req.businessObjectives.length})</span>
                </h3>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Measurable operational goals</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {req.businessObjectives.map((bo) => {
                  const isEditing = editingCardId === bo.id;
                  return (
                    <div
                      key={bo.id}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-2 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                            {bo.code}
                          </span>
                          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editFormData.title}
                                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-0.5 text-xs text-neutral-900 dark:text-white"
                              />
                            ) : (
                              bo.title
                            )}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                          from {bo.derivedFromPsCode}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={3}
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded p-2 text-xs text-neutral-900 dark:text-neutral-100 font-mono"
                          />
                          <div className="flex justify-end space-x-2">
                            <button onClick={cancelEdit} className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white">
                              Cancel
                            </button>
                            <button onClick={() => handleSaveBO(bo.id)} className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 rounded text-xs font-semibold">
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                          {bo.description}
                        </p>
                      )}

                      {!isEditing && (
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400">
                          <span>{bo.isAiGenerated ? 'AI Generated' : 'User Modified'}</span>
                          <button
                            onClick={() => startEdit(bo.id, bo.title, bo.description)}
                            className="hover:text-neutral-900 dark:hover:text-white flex items-center space-x-1"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Business Requirements */}
          {(activeTab === 'all' || activeTab === 'br') && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 flex items-center space-x-1.5">
                  <Layers className="h-4 w-4" />
                  <span>Business Requirements ({req.businessRequirements.length})</span>
                </h3>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Functional processing rules</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {req.businessRequirements.map((br) => {
                  const isEditing = editingCardId === br.id;
                  return (
                    <div
                      key={br.id}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-2 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                            {br.code}
                          </span>
                          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editFormData.title}
                                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-0.5 text-xs text-neutral-900 dark:text-white"
                              />
                            ) : (
                              br.title
                            )}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                          from {br.derivedFromBoCode}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={3}
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded p-2 text-xs text-neutral-900 dark:text-neutral-100 font-mono"
                          />
                          <div className="flex justify-end space-x-2">
                            <button onClick={cancelEdit} className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white">
                              Cancel
                            </button>
                            <button onClick={() => handleSaveBR(br.id)} className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 rounded text-xs font-semibold">
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                          {br.description}
                        </p>
                      )}

                      {!isEditing && (
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400">
                          <span>Cat: {br.category}</span>
                          <button
                            onClick={() => startEdit(br.id, br.title, br.description)}
                            className="hover:text-neutral-900 dark:hover:text-white flex items-center space-x-1"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Finance Requirements */}
          {(activeTab === 'all' || activeTab === 'fr') && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 flex items-center space-x-1.5">
                  <Calculator className="h-4 w-4" />
                  <span>Finance Requirements ({req.financeRequirements.length})</span>
                </h3>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Accounting, GL & allocation formulas</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {req.financeRequirements.map((fr) => {
                  const isEditing = editingCardId === fr.id;
                  return (
                    <div
                      key={fr.id}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-2 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                            {fr.code}
                          </span>
                          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editFormData.title}
                                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-0.5 text-xs text-neutral-900 dark:text-white"
                              />
                            ) : (
                              fr.title
                            )}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                          from {fr.derivedFromBrCode}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={3}
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded p-2 text-xs text-neutral-900 dark:text-neutral-100 font-mono"
                          />
                          <div className="flex justify-end space-x-2">
                            <button onClick={cancelEdit} className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white">
                              Cancel
                            </button>
                            <button onClick={() => handleSaveFR(fr.id)} className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 rounded text-xs font-semibold">
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                          {fr.description}
                        </p>
                      )}

                      {!isEditing && (
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400">
                          <span>{fr.isAiGenerated ? 'AI Generated' : 'User Modified'}</span>
                          <button
                            onClick={() => startEdit(fr.id, fr.title, fr.description)}
                            className="hover:text-neutral-900 dark:hover:text-white flex items-center space-x-1"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Technical Requirements */}
          {(activeTab === 'all' || activeTab === 'tr') && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 flex items-center space-x-1.5">
                  <WorkflowIcon className="h-4 w-4" />
                  <span>Technical Requirements ({req.technicalRequirements.length})</span>
                </h3>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">SCDP classes, schemas, grain & pipelines</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {req.technicalRequirements.map((tr) => {
                  const isEditing = editingCardId === tr.id;
                  return (
                    <div
                      key={tr.id}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-2 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                            {tr.code}
                          </span>
                          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editFormData.title}
                                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-0.5 text-xs text-neutral-900 dark:text-white"
                              />
                            ) : (
                              tr.title
                            )}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                          from {tr.derivedFromFrCodes.join(', ')}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={3}
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded p-2 text-xs text-neutral-900 dark:text-neutral-100 font-mono"
                          />
                          <div className="flex justify-end space-x-2">
                            <button onClick={cancelEdit} className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white">
                              Cancel
                            </button>
                            <button onClick={() => handleSaveTR(tr.id)} className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 rounded text-xs font-semibold">
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                          {tr.description}
                        </p>
                      )}

                      {!isEditing && (
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400">
                          <span>{tr.isAiGenerated ? 'AI Generated' : 'User Modified'}</span>
                          <button
                            onClick={() => startEdit(tr.id, tr.title, tr.description)}
                            className="hover:text-neutral-900 dark:hover:text-white flex items-center space-x-1"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Info Modal */}
      {isAddInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl text-neutral-900 dark:text-neutral-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xs font-bold flex items-center space-x-1.5">
                <Plus className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                <span>Add Domain Rule, Rule Adjustment or Constraint</span>
              </h3>
              <button
                onClick={() => setIsAddInfoOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Category</label>
                <select
                  value={newInfoCategory}
                  onChange={(e: any) => setNewInfoCategory(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-neutral-500"
                >
                  <option value="business">Business Clarification</option>
                  <option value="finance">Finance Rule</option>
                  <option value="technical">Technical Architecture</option>
                  <option value="rule">Business Rule</option>
                  <option value="constraint">SCDP Constraint</option>
                  <option value="note">General Note</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Content / Specification</label>
                <textarea
                  rows={4}
                  value={newInfoContent}
                  onChange={(e) => setNewInfoContent(e.target.value)}
                  placeholder="E.g. Cost allocation percentages must strictly sum to 100% per costallocationmethod..."
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-900 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsAddInfoOpen(false)}
                className="px-3.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAddInfo}
                disabled={!newInfoContent.trim()}
                className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold rounded-lg text-xs"
              >
                Save Information
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Stage Action Bar */}
      <div className="sticky bottom-0 z-10 -mx-6 lg:-mx-8 -mb-6 lg:-mb-8 px-6 lg:px-8 py-3 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between shadow-lg transition-colors">
        <button
          onClick={() => setStage('business-input')}
          className="flex items-center space-x-2 px-3 py-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Business Input</span>
        </button>

        <button
          onClick={generateClasses}
          className="flex items-center space-x-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-bold rounded-xl text-xs transition-all shadow-md"
        >
          <span>Generate Classes</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
