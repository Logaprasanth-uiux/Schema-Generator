'use client';

import React from 'react';

interface RequirementCategoryChipProps {
  category?: string;
  className?: string;
}

export const RequirementCategoryChip: React.FC<RequirementCategoryChipProps> = ({
  category,
  className = '',
}) => {
  if (!category) return null;

  const normalized = category.trim().toLowerCase();

  // Soft, low-saturation category-specific tints for informational metadata labels (non-button appearance)
  let colorStyles = 'bg-stone-100/80 dark:bg-stone-900/40 text-stone-700 dark:text-stone-300 border-stone-200/60 dark:border-stone-800/40';

  if (normalized.includes('decision') || normalized.includes('getgroup') || normalized.includes('group')) {
    // Soft warm beige / sand tint
    colorStyles = 'bg-amber-50/80 dark:bg-amber-950/30 text-amber-900/90 dark:text-amber-200/90 border-amber-200/50 dark:border-amber-800/30';
  } else if (normalized.includes('allocation') || normalized.includes('sumfrom') || normalized.includes('sum') || normalized.includes('aggregate')) {
    // Soft green / sage tint
    colorStyles = 'bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-900/90 dark:text-emerald-200/90 border-emerald-200/50 dark:border-emerald-800/30';
  } else if (normalized.includes('calculation') || normalized.includes('math') || normalized.includes('formula')) {
    // Soft lavender / muted purple tint
    colorStyles = 'bg-purple-50/80 dark:bg-purple-950/30 text-purple-900/90 dark:text-purple-200/90 border-purple-200/50 dark:border-purple-800/30';
  } else if (normalized.includes('workflow') || normalized.includes('process') || normalized.includes('state')) {
    // Soft blue-grey / slate-sky tint
    colorStyles = 'bg-sky-50/80 dark:bg-sky-950/30 text-sky-900/90 dark:text-sky-200/90 border-sky-200/50 dark:border-sky-800/30';
  } else if (normalized.includes('validation') || normalized.includes('constraint') || normalized.includes('compliance')) {
    // Soft amber / honey tint
    colorStyles = 'bg-orange-50/80 dark:bg-orange-950/30 text-orange-900/90 dark:text-orange-200/90 border-orange-200/50 dark:border-orange-800/30';
  } else if (normalized.includes('lookup') || normalized.includes('mapping') || normalized.includes('fetch') || normalized.includes('fetchfrom')) {
    // Soft indigo / periwinkle tint
    colorStyles = 'bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-900/90 dark:text-indigo-200/90 border-indigo-200/50 dark:border-indigo-800/30';
  } else if (normalized.includes('security') || normalized.includes('audit')) {
    // Soft rose / blush tint
    colorStyles = 'bg-rose-50/80 dark:bg-rose-950/30 text-rose-900/90 dark:text-rose-200/90 border-rose-200/50 dark:border-rose-800/30';
  }

  return (
    <span
      className={`inline-flex items-center text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded border select-none ${colorStyles} ${className}`}
      title={`Classification: ${category}`}
      aria-label={`Classification: ${category}`}
    >
      {category}
    </span>
  );
};
