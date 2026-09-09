export interface SchemaComponent {
  id: string;
  name: string;
  type: 'MATH' | 'FETCHFROMSCHEMA' | 'SUMFROMSCHEMA' | 'GETGROUPFROMSCHEMA2';
  sourceClass?: string;
  sourceColumn?: string;
  expression?: string;
  condition?: string;
  description?: string;
}

export interface SchemaClass {
  id: string;
  classNumber: number;
  className: string;
  purpose: string;
  datasource: string;
  grain: string;
  classLevelFields: string[];
  lookupRules: string[];
  formulaRules: string[];
  components: SchemaComponent[];
  criteria: string[];
  conditions: string[];
  expectedOutput: string;
  dependencies: string[];
  exposes: string[];
  reviewPoints: string;
  associatedRequirements?: string[];
  metadata?: Record<string, unknown>;
  isCustomAdded?: boolean;
}
