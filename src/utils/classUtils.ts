import { SchemaClass } from '../types';

/**
 * Formats a SchemaClass into a unified, readable specification string
 * suitable for version comparison, diffing, and text inspection.
 */
export function formatClassSpecification(cls: {
  className?: string;
  datasource?: string;
  grain?: string;
  purpose?: string;
  components?: Array<{ name: string; type: string; expression?: string; description?: string }>;
  formulaRules?: string[];
  criteria?: string[];
  conditions?: string[];
  dependencies?: string[];
  exposes?: string[];
}): string {
  const parts: string[] = [];
  parts.push(`DATASOURCE: ${cls.datasource || 'Default'}`);
  parts.push(`SETTLEMENT GRAIN: ${cls.grain || 'Default'}`);
  parts.push(`\nPURPOSE & BUSINESS LOGIC:\n${cls.purpose || 'No purpose description defined.'}`);

  if (cls.components && cls.components.length > 0) {
    parts.push(`\nCOMPONENTS (${cls.components.length}):`);
    cls.components.forEach((c) => {
      parts.push(`- ${c.name} [${c.type}]${c.expression ? `: ${c.expression}` : ''}${c.description ? ` (${c.description})` : ''}`);
    });
  }

  if (cls.formulaRules && cls.formulaRules.length > 0) {
    parts.push(`\nFORMULA RULES:`);
    cls.formulaRules.forEach((r) => parts.push(`- ${r}`));
  }

  if (cls.criteria && cls.criteria.length > 0) {
    parts.push(`\nCRITERIA & FILTER LOGIC:`);
    cls.criteria.forEach((c) => parts.push(`- ${c}`));
  }

  if (cls.conditions && cls.conditions.length > 0) {
    parts.push(`\nGATING CONDITIONS:`);
    cls.conditions.forEach((cond) => parts.push(`- ${cond}`));
  }

  if (cls.dependencies && cls.dependencies.length > 0 && cls.dependencies[0] !== 'NA') {
    parts.push(`\nDEPENDENCIES:`);
    cls.dependencies.forEach((d) => parts.push(`- ${d}`));
  }

  if (cls.exposes && cls.exposes.length > 0 && cls.exposes[0] !== 'none') {
    parts.push(`\nEXPOSES:`);
    cls.exposes.forEach((e) => parts.push(`- ${e}`));
  }

  return parts.join('\n');
}
