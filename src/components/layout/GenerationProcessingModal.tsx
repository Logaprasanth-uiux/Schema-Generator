'use client';

import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Loader2 } from 'lucide-react';

export interface GenerationProcessingModalProps {
  isOpen?: boolean;
  operationLabel?: string;
  supportingText?: string;
}

export const GenerationProcessingModal: React.FC<GenerationProcessingModalProps> = ({
  isOpen: propIsOpen,
  operationLabel: propOperationLabel,
  supportingText = 'DataTwin Engine is processing your request',
}) => {
  const { isGeneratingModalOpen, generationOperationLabel, workflow } = useWorkflow();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isGeneratingModalOpen;

  if (!isOpen) return null;

  // Resolve operation label: explicit prop -> context label -> fallback stage derivation
  const resolveOperationLabel = (): string => {
    if (propOperationLabel) return propOperationLabel;
    if (generationOperationLabel && generationOperationLabel !== 'Generating…') {
      return generationOperationLabel;
    }
    switch (workflow.stage) {
      case 'business-input':
        return workflow.businessInput.isBusinessRequirementGenerated
          ? 'Generating Requirements…'
          : 'Generating Business Requirement…';
      case 'requirements':
        return 'Generating Schema Classes…';
      case 'classes':
        return 'Generating Schema…';
      default:
        return generationOperationLabel || 'Generating…';
    }
  };

  const label = resolveOperationLabel();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-label={label}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-2xl w-full max-w-[340px] p-6 shadow-xl dark:shadow-2xl text-center text-neutral-900 dark:text-neutral-100 animate-in fade-in zoom-in-95 duration-150">
        {/* 1. Processing indicator */}
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-6 w-6 text-neutral-700 dark:text-neutral-300 animate-spin stroke-[2.25]" />
        </div>

        {/* 2. Short primary processing message */}
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">
          {label}
        </h3>

        {/* 3. Small muted supporting text */}
        {supportingText && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
            {supportingText}
          </p>
        )}
      </div>
    </div>
  );
};
