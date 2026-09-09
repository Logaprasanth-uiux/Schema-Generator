'use client';

import React from 'react';

interface StageActionBarProps {
  title: string;
  description: string;
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
}

export const StageActionBar: React.FC<StageActionBarProps> = ({
  title,
  description,
  leftActions,
  rightActions,
}) => {
  return (
    <div className="sticky top-0 z-20 w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-5 lg:px-6 py-2.5 flex items-center justify-between transition-colors shadow-xs shrink-0">
      <div className="flex items-center space-x-3 min-w-0 pr-3">
        {leftActions && <div className="flex items-center space-x-1.5 shrink-0">{leftActions}</div>}
        <div className="min-w-0">
          <h2 className="text-xs font-bold text-neutral-900 dark:text-white leading-tight truncate">
            {title}
          </h2>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
            {description}
          </p>
        </div>
      </div>

      {rightActions && (
        <div className="flex items-center space-x-2 shrink-0">
          {rightActions}
        </div>
      )}
    </div>
  );
};
