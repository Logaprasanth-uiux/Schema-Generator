import { ISchemaGenerationService, ProgressCallback } from '../interfaces';
import { RequirementsModel, SchemaClass, SchemaModel, SchemaTreeNode } from '../../types';
import { sampleSchemaModel } from '../../fixtures';

export class MockSchemaGenerationService implements ISchemaGenerationService {
  async generateSchema(
    requirements: RequirementsModel,
    classes: SchemaClass[],
    onProgress?: ProgressCallback
  ): Promise<SchemaModel> {
    const steps = [
      { id: '1', label: 'Transforming dynamic Schema Classes into SCDP node tree', detail: `Processing ${classes.length} active classes` },
      { id: '2', label: 'Resolving GETGROUPFROMSCHEMA2 and FETCHFROMSCHEMA references', detail: 'Validating dependency acyclicity and lookup parameters' },
      { id: '3', label: 'Compiling MATH expressions & Conditional Gating Rules', detail: 'Checking BudgetOverrunInd and ValidGLInd rules' },
      { id: '4', label: 'Generating formatted SCDP JSON specification', detail: 'Performing schema validation against master SCDP schema syntax' },
    ];

    for (let i = 0; i < steps.length; i++) {
      if (onProgress) {
        onProgress({
          id: steps[i].id,
          label: steps[i].label,
          detail: steps[i].detail,
          status: 'active',
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 360));
      if (onProgress) {
        onProgress({
          id: steps[i].id,
          label: steps[i].label,
          detail: steps[i].detail,
          status: 'done',
        });
      }
    }

    // Build the dynamic SCDP tree from the classes array
    const dynamicClassNodes: SchemaTreeNode[] = classes.map((cls, idx) => {
      const classChildren: SchemaTreeNode[] = [
        { title: 'SchemaName', technicalName: 'SchemaName', val: cls.className },
        { title: 'DataSource', technicalName: 'DataSource', val: cls.datasource },
        { title: 'SettlementType', technicalName: 'SettlementType', val: cls.grain },
        { title: 'OutputProcessCode', technicalName: 'OutputProcessCode', val: cls.expectedOutput || 'TT' },
      ];

      // Add class level fields
      cls.classLevelFields.forEach((field) => {
        classChildren.push({
          title: field,
          technicalName: field,
          val: '*',
          equality: 'EQ',
        });
      });

      // Add lookup rules
      cls.lookupRules.forEach((lookup, lIdx) => {
        classChildren.push({
          title: `LookupRule#${lIdx + 1}`,
          technicalName: `LookupRule#${lIdx + 1}`,
          val: lookup,
        });
      });

      // Add components
      if (cls.components && cls.components.length > 0) {
        const componentChildren: SchemaTreeNode[] = cls.components.map((comp, cIdx) => {
          const compNodes: SchemaTreeNode[] = [
            { title: 'ComponentName', technicalName: 'ComponentName', val: comp.name },
            { title: 'ComponentProcessType', technicalName: 'ComponentProcessType', val: comp.type },
          ];
          if (comp.expression) {
            compNodes.push({ title: 'ComponentExpression', technicalName: 'ComponentExpression', val: comp.expression });
          }
          if (comp.sourceClass) {
            compNodes.push({ title: 'FetchSchemaName', technicalName: 'FetchSchemaName', val: comp.sourceClass });
          }
          if (comp.sourceColumn) {
            compNodes.push({ title: 'FetchColumnName', technicalName: 'FetchColumnName', val: comp.sourceColumn });
          }
          return {
            title: `#Components#${cIdx + 1} (${comp.name})`,
            technicalName: `#Components#${cIdx + 1}`,
            children: compNodes,
          };
        });

        classChildren.push({
          title: 'Components',
          technicalName: 'Components',
          children: componentChildren,
        });
      }

      // Add conditions
      if (cls.conditions && cls.conditions.length > 0) {
        const conditionChildren: SchemaTreeNode[] = cls.conditions.map((cond, cIdx) => ({
          title: `#Conditions#${cIdx + 1}`,
          technicalName: `#Conditions#${cIdx + 1}`,
          val: cond,
        }));
        classChildren.push({
          title: 'Conditions',
          technicalName: 'Conditions',
          children: conditionChildren,
        });
      }

      return {
        title: `#SchemaClass#${idx + 1} (${cls.className})`,
        technicalName: `#SchemaClass#${idx + 1}`,
        children: classChildren,
      };
    });

    const rootTree: SchemaTreeNode[] = [
      {
        title: 'Root',
        technicalName: 'Root',
        expanded: true,
        children: [
          {
            title: 'SchemaGroupName',
            technicalName: 'SchemaGroupName',
            val: `${requirements.domain} Schema`,
          },
          {
            title: 'SchemaClass',
            technicalName: 'SchemaClass',
            expanded: true,
            children: dynamicClassNodes.length > 0 ? dynamicClassNodes : sampleSchemaModel.root[0].children?.[1].children || [],
          },
        ],
      },
    ];

    const totalComponents = classes.reduce((sum, c) => sum + (c.components?.length || 0), 0);
    const totalFields = classes.reduce((sum, c) => sum + (c.classLevelFields?.length || 0), 0);
    const totalFormulas = classes.reduce((sum, c) => sum + (c.formulaRules?.length || 0), 0);

    const schemaModel: SchemaModel = {
      schemaGroupName: `${requirements.domain} Schema`,
      root: rootTree,
      rawJson: JSON.stringify(rootTree, null, 2),
      generatedAt: new Date().toISOString(),
      version: '1.0.0-scdp',
      stats: {
        classCount: classes.length,
        componentCount: totalComponents || 26,
        fieldCount: totalFields || 68,
        formulaCount: totalFormulas || 18,
      },
      validationResult: {
        isValid: true,
        errors: [],
        warnings: [
          'Ensure lookup tables for CA (Cost Allocation) have matching active period dates before live ingestion.',
        ],
        stats: {
          totalClasses: classes.length,
          totalComponents: totalComponents || 26,
          totalFields: totalFields || 68,
          totalLookupRules: 9,
        },
      },
    };

    return schemaModel;
  }
}
