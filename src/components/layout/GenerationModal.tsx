'use client';

import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Loader2, CheckCircle2 } from 'lucide-react';

export const GenerationModal: React.FC = () => {
  const { isGeneratingModalOpen, workflow } = useWorkflow();

  if (!isGeneratingModalOpen) return null;

  const getTitle = () => {
    switch (workflow.stage) {
      case 'business-input':
        return workflow.businessInput.isBusinessRequirementGenerated
          ? 'Synthesizing Structured Traceability Requirements...'
          : 'Expanding High-Level Intent to Business Requirement...';
      case 'requirements':
        return 'Synthesizing SCDP Domain Classes & Mappings...';
      case 'classes':
        return 'Compiling SCDP Hierarchical Schema Tree & JSON...';
      default:
        return 'Processing Generation Pipeline...';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-neutral-900 dark:text-neutral-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">DataTwin Engine</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">{getTitle()}</p>
          </div>
        </div>

        <div className="space-y-2.5 my-5">
          {workflow.currentProgressSteps.map((step) => {
            return (
              <div
                key={step.id}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  step.status === 'done'
                    ? 'bg-neutral-50 dark:bg-neutral-950/40 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200'
                    : step.status === 'active'
                    ? 'bg-neutral-100 dark:bg-neutral-800/80 border-neutral-400 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 shadow-sm'
                    : 'bg-neutral-50/50 dark:bg-neutral-950/20 border-neutral-200 dark:border-neutral-800/60 text-neutral-400 dark:text-neutral-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {step.status === 'done' ? (
                      <CheckCircle2 className="h-4 w-4 text-neutral-700 dark:text-neutral-300 shrink-0" />
                    ) : step.status === 'active' ? (
                      <Loader2 className="h-4 w-4 text-neutral-800 dark:text-neutral-200 animate-spin shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[10px] text-neutral-400 dark:text-neutral-500">
                        {step.id}
                      </div>
                    )}
                    <span className="font-semibold">{step.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                      step.status === 'done'
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300'
                        : step.status === 'active'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                        : 'text-neutral-400 dark:text-neutral-500'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
                {step.detail && (
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 pl-6">
                    {step.detail}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-3">
          <span>SCDP Generation Contract: Active</span>
          <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">Deterministic Rule Engine</span>
        </div>
      </div>
    </div>
  );
};
