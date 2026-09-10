export interface ProblemStatement {
  id: string;
  code: string; // e.g. PS-001
  title: string;
  category: 'Decision' | 'Allocation' | 'Calculation' | 'Workflow' | 'Validation' | string;
  description: string;
  isAiGenerated?: boolean;
}

export interface BusinessObjective {
  id: string;
  code: string; // e.g. BO-001
  title: string;
  derivedFromPsCode: string; // e.g. PS-001
  description: string;
  isAiGenerated?: boolean;
}

export interface BusinessRequirement {
  id: string;
  code: string; // e.g. BR-001
  title: string;
  category: 'Lookup' | 'Allocation' | 'Calculation' | 'Workflow' | 'Validation' | 'Decision' | string;
  derivedFromBoCode: string; // e.g. BO-001
  description: string;
  isAiGenerated?: boolean;
}

export interface FinanceRequirement {
  id: string;
  code: string; // e.g. FR-001
  title: string;
  derivedFromBrCode: string; // e.g. BR-001
  description: string;
  isAiGenerated?: boolean;
}

export interface TechnicalRequirement {
  id: string;
  code: string; // e.g. TR-001
  title: string;
  derivedFromFrCodes: string[]; // e.g. ['FR-001']
  description: string;
  isAiGenerated?: boolean;
}

export interface ExpectedOutputSample {
  recordId: string;
  sourceBillId: string;
  vendorName: string;
  prepaidGlAccount: string;
  originalBillTotal: number;
  allocationDetails: Array<{
    targetLob: string;
    allocationPercentage: number;
    baseAllocatedAmount: number;
    destinationTaxProfile: string;
    appliedTaxRate: number;
    calculatedTaxAmount: number;
    allocatedTotalWithTax: number;
  }>;
  postAllocationAdjustments: Array<{
    adjustmentId: string;
    targetLob: string;
    adjustmentAmount: number;
    reason: string;
  }>;
  approvalWorkflow: {
    currentStep: string;
    assignedApprover: string;
    approvalDate: string | null;
    workflowStatus: string;
  };
  reconciliationSummary: {
    totalAllocatedBase: number;
    netAdjustments: number;
    reconciliationVariance: number;
  };
  status: 'PROCESSED' | 'EXCEPTION' | 'PENDING';
}

export interface RequirementsModel {
  domain: string;
  highLevelRequirement: string;
  problemStatements: ProblemStatement[];
  businessObjectives: BusinessObjective[];
  businessRequirements: BusinessRequirement[];
  financeRequirements: FinanceRequirement[];
  technicalRequirements: TechnicalRequirement[];
  expectedOutput: {
    title: string;
    type: string;
    description: string;
    sampleRecords: ExpectedOutputSample[];
  };
  generatedAt: string;
  lastEditedAt?: string;
}

export interface RequirementVersion {
  id: string;
  requirementId: string;
  requirementCode: string;
  versionNumber: number;
  title: string;
  description: string;
  actor: string;
  timestamp: string;
  changeType?: 'INITIAL_GENERATION' | 'EDIT' | 'REGENERATION' | 'TITLE_UPDATE' | string;
  changeSummary: string;
}

