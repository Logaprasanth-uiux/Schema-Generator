'use client';

import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { 
  RotateCcw, 
  Download, 
  Layers, 
  Lightbulb,
  Coins
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { workflow, theme, toggleTheme, generationCost, resetWorkflow, downloadSchemaJson } = useWorkflow();

  return (
    <header className="h-14 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-5 flex items-center justify-between text-neutral-900 dark:text-white select-none z-30 shrink-0 transition-colors duration-150">
      {/* Left: Clean Identity Only */}
      <div className="flex items-center space-x-2.5">
        <div className="h-8 w-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-sm">
          <Layers className="h-4 w-4" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-bold tracking-tight text-neutral-900 dark:text-neutral-100 text-sm">
            DataTwin
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700">
            Schema Generator
          </span>
        </div>
      </div>

      {/* Right: Premium Dynamic Cost, Theme Switch & Actions */}
      <div className="flex items-center space-x-2.5">
        {/* Dynamic Estimated Schema Cost with restrained gold emphasis */}
        <div 
          title={`Cost Source: ${generationCost.source || 'SCDP Pricing Engine'}`}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs shadow-sm"
        >
          <Coins className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
            {generationCost.isEstimate ? 'Est. Schema Cost' : 'Schema Cost'}
          </span>
          <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
            {generationCost.formattedAmount}
          </span>
        </div>

        {/* Theme Toggle: Light On / Off Icon */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Turn light on (Switch to Light Mode)' : 'Turn light off (Switch to Dark Mode)'}
          className="p-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors shadow-sm"
          aria-label="Toggle theme"
        >
          <Lightbulb className={`h-4 w-4 transition-transform ${theme === 'dark' ? 'text-neutral-500' : 'text-amber-500 fill-amber-500/20'}`} />
        </button>

        {/* Download Schema Action if Schema exists */}
        {workflow.schema && (
          <button
            onClick={downloadSchemaJson}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 dark:text-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700 rounded-lg transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400" />
            <span className="hidden sm:inline">Download</span>
          </button>
        )}

        {/* Reset Workflow */}
        <button
          onClick={resetWorkflow}
          title="Reset entire workflow"
          className="p-1.5 text-neutral-400 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
