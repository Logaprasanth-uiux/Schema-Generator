'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, FileText } from 'lucide-react';

interface AddNewBusinessRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    category: string;
    description: string;
  }) => void;
}

export const AddNewBusinessRequirementModal: React.FC<AddNewBusinessRequirementModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Business Logic');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setCategory('Business Logic');
      setDescription('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim() || !description.trim()) return;

    onSave({
      title: title.trim(),
      category: category.trim() || 'Business Logic',
      description: description.trim(),
    });

    onClose();
  };

  const isSaveEnabled = title.trim().length > 0 && description.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl text-neutral-900 dark:text-neutral-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="text-xs font-bold flex items-center space-x-1.5 text-neutral-900 dark:text-white">
            <Plus className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            <span>Add New Business Requirement</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer p-1 rounded-md transition-colors"
            title="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-3.5 text-xs">
          {/* Requirement Title */}
          <div>
            <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Requirement Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Cost Allocation Split Verification"
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-neutral-500 transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Classification Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-neutral-500 transition-colors"
            >
              <option value="Allocation">Allocation</option>
              <option value="Calculation">Calculation</option>
              <option value="Validation">Validation</option>
              <option value="Decision">Decision</option>
              <option value="Workflow">Workflow</option>
              <option value="Lookup">Lookup</option>
              <option value="Business Logic">Business Logic</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Requirement Description / Specification <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the business processing rule, formula behavior, validation check, or settlement constraint..."
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2.5 text-xs text-neutral-900 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-colors"
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex justify-end space-x-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isSaveEnabled}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold rounded-lg text-xs cursor-pointer disabled:opacity-40 transition-all shadow-xs"
          >
            Add Requirement
          </button>
        </div>
      </div>
    </div>
  );
};
