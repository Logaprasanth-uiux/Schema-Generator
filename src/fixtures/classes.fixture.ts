import { SchemaClass } from '../types';

export const sampleSchemaClasses: SchemaClass[] = [
  {
    id: 'class-01',
    classNumber: 1,
    className: 'AD',
    purpose: 'Account determination master to map GL account codes based on item category and service type, supporting active GL validation (BR-001, BR-002).',
    datasource: 'AD',
    grain: 'Per accountclass',
    classLevelFields: ['accountclass', 'accountgroup', 'itemtype', 'accountcode', 'ledgername', 'transactionstatus', 'forprdfrom', 'forprdto'],
    lookupRules: [],
    formulaRules: ['ComponentExpr = parameter1 for parameter1'],
    components: [
      {
        id: 'comp-01-1',
        name: 'parameter1',
        type: 'MATH',
        expression: 'parameter1',
        description: 'Mandatory numeric placeholder for active segment validation'
      }
    ],
    criteria: ['accountclass EQ *', 'ForPrdFrom, ForPrdTo overlap logic'],
    conditions: [],
    expectedOutput: 'TT',
    dependencies: ['NA'],
    exposes: ['none (fields are grouped/resolved by downstream classes via GETGROUPFROMSCHEMA2)'],
    reviewPoints: 'AD requires parameter1 as a mandatory component for mathematical placeholder; confirm if any other numeric threshold fields are needed for specific segment validation.',
    associatedRequirements: ['BR-001', 'BR-002', 'FR-002', 'TR-002']
  },
  {
    id: 'class-02',
    classNumber: 2,
    className: 'CA',
    purpose: 'Cost allocation master to provide predefined percentage profiles across Lines of Business (LoBs) (BR-004).',
    datasource: 'CA',
    grain: 'Per costallocationmethod',
    classLevelFields: ['costallocationmethod', 'lob', 'forprdfrom', 'forprdto'],
    lookupRules: [],
    formulaRules: ['ComponentExpr = costallocationvalue for costallocationvalue'],
    components: [
      {
        id: 'comp-02-1',
        name: 'costallocationvalue',
        type: 'MATH',
        expression: 'costallocationvalue',
        description: 'Predefined allocation percentage or weighting value'
      }
    ],
    criteria: ['costallocationmethod EQ *', 'ForPrdFrom, ForPrdTo overlap logic'],
    conditions: [],
    expectedOutput: 'TT',
    dependencies: ['NA'],
    exposes: ['costallocationvalue: fetched by Class 7 PrePaidReportCostAllocation1'],
    reviewPoints: 'Confirm if allocation type defaults to percentages or if costallocationvalue needs scaling.',
    associatedRequirements: ['BR-002', 'FR-003', 'TR-003']
  },
  {
    id: 'class-03',
    classNumber: 3,
    className: 'AP',
    purpose: 'Approval workflow master defining routing structure and configurable thresholds (BR-006).',
    datasource: 'AP',
    grain: 'Per activitycode',
    classLevelFields: ['activitycode', 'strategyname', 'lob', 'activityname', 'forprdfrom', 'forprdto'],
    lookupRules: [],
    formulaRules: [
      'ComponentExpr = timeinmins for timeinmins',
      'ComponentExpr = timeindays for timeindays'
    ],
    components: [
      {
        id: 'comp-03-1',
        name: 'timeinmins',
        type: 'MATH',
        expression: 'timeinmins',
        description: 'Threshold timeout in minutes'
      },
      {
        id: 'comp-03-2',
        name: 'timeindays',
        type: 'MATH',
        expression: 'timeindays',
        description: 'Threshold timeout in days'
      }
    ],
    criteria: ['activitycode EQ *', 'ForPrdFrom, ForPrdTo overlap logic'],
    conditions: [],
    expectedOutput: 'TT',
    dependencies: ['NA'],
    exposes: ['none (fields are grouped/resolved by downstream classes, not fetched)'],
    reviewPoints: 'Confirm if additional thresholds should be mathematically exposed to workflow triggers.',
    associatedRequirements: ['BR-004', 'FR-006', 'TR-005']
  },
  {
    id: 'class-04',
    classNumber: 4,
    className: 'PWBill',
    purpose: 'Historical bill data to act as active period budgets for variance evaluation and overruns (BR-005).',
    datasource: 'PWBill',
    grain: 'Per lob Monthly',
    classLevelFields: ['lob', 'forprdfrom', 'forprdto'],
    lookupRules: [],
    formulaRules: ['ComponentExpr = budgetedamount for budgetedamount'],
    components: [
      {
        id: 'comp-04-1',
        name: 'budgetedamount',
        type: 'MATH',
        expression: 'budgetedamount',
        description: 'Active period budgeted cap per LOB'
      }
    ],
    criteria: ['lob EQ *', 'ForPrdFrom, ForPrdTo overlap logic'],
    conditions: [],
    expectedOutput: 'TT',
    dependencies: ['NA'],
    exposes: ['budgetedamount: summed by Class 9 PrePaidReportCostAllocation'],
    reviewPoints: 'Mapped budgetedamount from PWBill as the active period budget representation since a dedicated Budget Master was not provided.',
    associatedRequirements: ['BR-005', 'FR-007', 'TR-006']
  },
  {
    id: 'class-05',
    classNumber: 5,
    className: 'PrePaidReport_I',
    purpose: 'Transaction ingestion for raw prepaid bill line-items (FR-001).',
    datasource: 'PrePaidReport',
    grain: 'Per itemid Monthly',
    classLevelFields: ['documentnumber', 'itemid', 'itemname', 'taxcode', 'orgid', 'documenttype', 'forprdfrom', 'forprdto'],
    lookupRules: [],
    formulaRules: [
      'ComponentExpr = basevalue for basevalue',
      'ComponentExpr = taxpercentage for taxpercentage',
      'ComponentExpr = exchangerate for exchangerate'
    ],
    components: [
      {
        id: 'comp-05-1',
        name: 'basevalue',
        type: 'MATH',
        expression: 'basevalue',
        description: 'Prepaid base cost line amount'
      },
      {
        id: 'comp-05-2',
        name: 'taxpercentage',
        type: 'MATH',
        expression: 'taxpercentage',
        description: 'Line item tax percentage'
      },
      {
        id: 'comp-05-3',
        name: 'exchangerate',
        type: 'MATH',
        expression: 'exchangerate',
        description: 'Currency conversion multiplier'
      }
    ],
    criteria: ['documentnumber EQ *', 'itemid EQ *', 'ForPrdFrom, ForPrdTo base timeline limits'],
    conditions: [],
    expectedOutput: 'TT',
    dependencies: ['NA'],
    exposes: [
      'basevalue: fetched by Class 6 PrePaidReport_ItemCalculation',
      'taxpercentage: fetched by Class 6 PrePaidReport_ItemCalculation',
      'exchangerate: fetched by Class 6 PrePaidReport_ItemCalculation'
    ],
    reviewPoints: 'PrePaidReport datasource acts as the transaction input schema. Confirm that itemid acts as the finest grain line identifier.',
    associatedRequirements: ['BR-001', 'FR-001', 'TR-001']
  },
  {
    id: 'class-06',
    classNumber: 6,
    className: 'PrePaidReport_ItemCalculation',
    purpose: 'Systematize pre-amortization net base cost, tax-deductible calculations, and asset capitalization values (FR-003).',
    datasource: 'PrePaidReport',
    grain: 'Per itemid Monthly',
    classLevelFields: ['documentnumber', 'itemid', 'orgid', 'forprdfrom', 'forprdto'],
    lookupRules: [],
    formulaRules: [
      'ComponentExpr = BaseValue * (TaxPercentage / 100) for TaxValue',
      'ComponentExpr = BaseValue + TaxValue for DocumentValue',
      'ComponentExpr = DocumentValue * ExchangeRate for AmountInLocalCurrency'
    ],
    components: [
      {
        id: 'comp-06-1',
        name: 'BaseValue',
        type: 'FETCHFROMSCHEMA',
        sourceClass: 'Class 5 PrePaidReport_I',
        sourceColumn: 'basevalue'
      },
      {
        id: 'comp-06-2',
        name: 'TaxPercentage',
        type: 'FETCHFROMSCHEMA',
        sourceClass: 'Class 5 PrePaidReport_I',
        sourceColumn: 'taxpercentage'
      },
      {
        id: 'comp-06-3',
        name: 'ExchangeRate',
        type: 'FETCHFROMSCHEMA',
        sourceClass: 'Class 5 PrePaidReport_I',
        sourceColumn: 'exchangerate'
      },
      {
        id: 'comp-06-4',
        name: 'TaxValue',
        type: 'MATH',
        expression: 'BaseValue * (TaxPercentage / 100)'
      },
      {
        id: 'comp-06-5',
        name: 'DocumentValue',
        type: 'MATH',
        expression: 'BaseValue + TaxValue'
      },
      {
        id: 'comp-06-6',
        name: 'AmountInLocalCurrency',
        type: 'MATH',
        expression: 'DocumentValue * ExchangeRate'
      }
    ],
    criteria: ['documentnumber EQ *', 'itemid EQ *'],
    conditions: [],
    expectedOutput: 'TT',
    dependencies: ['Class 5 PrePaidReport_I (fetch)'],
    exposes: ['BaseValue: fetched by Class 7 PrePaidReportCostAllocation1'],
    reviewPoints: 'DocumentValue defined as total prepaid asset value. Review if specific jurisdictional limits cap the TaxValue computation.',
    associatedRequirements: ['BR-003', 'FR-004', 'TR-004']
  },
  {
    id: 'class-07',
    classNumber: 7,
    className: 'PrePaidReportCostAllocation1',
    purpose: 'Fetch dynamic multi-segment cost allocation parameters and targeted LOBs from reference data (FR-004).',
    datasource: 'PrePaidReport',
    grain: 'Per itemid Monthly',
    classLevelFields: ['documentnumber', 'itemid', 'costallocationmethod', 'lob', 'forprdfrom', 'forprdto'],
    lookupRules: [
      'lob = GETGROUPFROMSCHEMA2(Class 2 CA; lob; {"costallocationmethod":"costallocationmethod","ForPrdFrom":{"equality":"LE","value":"ForPrdTo"},"ForPrdTo":{"equality":"GE","value":"ForPrdFrom"}})'
    ],
    formulaRules: [],
    components: [
      {
        id: 'comp-07-1',
        name: 'BaseValue',
        type: 'FETCHFROMSCHEMA',
        sourceClass: 'Class 6 PrePaidReport_ItemCalculation',
        sourceColumn: 'BaseValue'
      },
      {
        id: 'comp-07-2',
        name: 'CostAllocationValue',
        type: 'FETCHFROMSCHEMA',
        sourceClass: 'Class 2 CA',
        sourceColumn: 'costallocationvalue'
      }
    ],
    criteria: ['documentnumber EQ *', 'itemid EQ *'],
    conditions: [],
    expectedOutput: 'TT',
    dependencies: ['Class 6 PrePaidReport_ItemCalculation (fetch)', 'Class 2 CA (group, fetch)'],
    exposes: [
      'BaseValue: fetched by Class 9 PrePaidReportCostAllocation',
      'CostAllocationValue: summed by Class 8 TCostAllocationValue, fetched by Class 9 PrePaidReportCostAllocation'
    ],
    reviewPoints: 'Ensure costallocationmethod maps cleanly from PrePaidReport to CA master logic.',
    associatedRequirements: ['BR-002', 'FR-003', 'TR-003']
  },
  {
    id: 'class-08',
    classNumber: 8,
    className: 'TCostAllocationValue',
    purpose: 'Compute aggregate denominator for dynamic allocation profiles (FR-004).',
    datasource: 'PrePaidReport',
    grain: 'Per itemid Monthly',
    classLevelFields: ['documentnumber', 'itemid', 'forprdfrom', 'forprdto'],
    lookupRules: [],
    formulaRules: [],
    components: [
      {
        id: 'comp-08-1',
        name: 'TCostAllocationValue',
        type: 'SUMFROMSCHEMA',
        sourceClass: 'Class 7 PrePaidReportCostAllocation1',
        sourceColumn: 'CostAllocationValue',
        expression: '{"documentnumber":"documentnumber","itemid":"itemid"}'
      }
    ],
    criteria: ['documentnumber EQ *', 'itemid EQ *'],
    conditions: [],
    expectedOutput: 'TT',
    dependencies: ['Class 7 PrePaidReportCostAllocation1 (sum)'],
    exposes: ['TCostAllocationValue: fetched by Class 9 PrePaidReportCostAllocation'],
    reviewPoints: 'Validates sum of proportion profiles; assumes allocation splits natively at itemid level.',
    associatedRequirements: ['BR-002', 'FR-003', 'TR-003']
  },
  {
    id: 'class-09',
    classNumber: 9,
    className: 'PrePaidReportCostAllocation',
    purpose: 'Dynamically allocate base prepaid costs across LOBs and validate against active period budgets (FR-004, FR-005).',
    datasource: 'PrePaidReport',
    grain: 'Per itemid Monthly',
    classLevelFields: ['documentnumber', 'itemid', 'lob', 'forprdfrom', 'forprdto'],
    lookupRules: [
      'lob = GETGROUPFROMSCHEMA2(Class 7 PrePaidReportCostAllocation1; lob; {"documentnumber":"documentnumber","itemid":"itemid"})'
    ],
    formulaRules: [
      'ComponentExpr = CostAllocationValue / TCostAllocationValue for CostAllocationParameter',
      'ComponentExpr = BaseValue * CostAllocationParameter for AllocatedAmount',
      'ComponentExpr = (AllocatedAmount > BudgetedAmount) for BudgetOverrunInd'
    ],
    components: [
      {
        id: 'comp-09-1',
        name: 'BaseValue',
        type: 'FETCHFROMSCHEMA',
        sourceClass: 'Class 7 PrePaidReportCostAllocation1',
        sourceColumn: 'BaseValue'
      },
      {
        id: 'comp-09-2',
        name: 'CostAllocationValue',
        type: 'FETCHFROMSCHEMA',
        sourceClass: 'Class 7 PrePaidReportCostAllocation1',
        sourceColumn: 'CostAllocationValue'
      },
      {
        id: 'comp-09-3',
        name: 'TCostAllocationValue',
        type: 'FETCHFROMSCHEMA',
        sourceClass: 'Class 8 TCostAllocationValue',
        sourceColumn: 'TCostAllocationValue'
      },
      {
        id: 'comp-09-4',
        name: 'CostAllocationParameter',
        type: 'MATH',
        expression: 'CostAllocationValue / TCostAllocationValue'
      },
      {
        id: 'comp-09-5',
        name: 'AllocatedAmount',
        type: 'MATH',
        expression: 'BaseValue * CostAllocationParameter'
      },
      {
        id: 'comp-09-6',
        name: 'BudgetedAmount',
        type: 'SUMFROMSCHEMA',
        sourceClass: 'Class 4 PWBill',
        sourceColumn: 'budgetedamount',
        expression: '{"lob":"lob","ForPrdFrom":{"equality":"LE","value":"ForPrdTo"},"ForPrdTo":{"equality":"GE","value":"ForPrdFrom"}}'
      },
      {
        id: 'comp-09-7',
        name: 'BudgetOverrunInd',
        type: 'MATH',
        expression: '(AllocatedAmount > BudgetedAmount)'
      }
    ],
    criteria: ['documentnumber EQ *', 'itemid EQ *'],
    conditions: [
      'BudgetOverrunInd EQ 0 (triggers exception validation error and blocks downstream posting if overrun is detected)'
    ],
    expectedOutput: 'TT',
    dependencies: [
      'Class 7 PrePaidReportCostAllocation1 (group, fetch)',
      'Class 8 TCostAllocationValue (fetch)',
      'Class 4 PWBill (sum)'
    ],
    exposes: ['AllocatedAmount: fetched by Class 10 AdjustmentAc'],
    reviewPoints: 'Budget validation is executed against PWBill history source; if overrun is detected, execution stops per Condition failure.',
    associatedRequirements: ['BR-002', 'BR-005', 'FR-003', 'FR-007', 'TR-006']
  },
  {
    id: 'class-10',
    classNumber: 10,
    className: 'AdjustmentAc',
    purpose: 'Generate post-allocation adjustment journal entries and execute reconciliation check against active ERP master accounts (FR-002, FR-006).',
    datasource: 'PrePaidReport',
    grain: 'Per itemid Monthly',
    classLevelFields: ['documentnumber', 'itemid', 'accountclass', 'accountgroup', 'accountcode', 'ledgername', 'transactionstatus', 'forprdfrom', 'forprdto'],
    lookupRules: [
      'accountcode = GETGROUPFROMSCHEMA2(Class 1 AD; accountcode; {"accountclass":"accountclass","accountgroup":"accountgroup"})',
      'ledgername = GETGROUPFROMSCHEMA2(Class 1 AD; ledgername; {"accountclass":"accountclass","accountgroup":"accountgroup"})',
      'transactionstatus = GETGROUPFROMSCHEMA2(Class 1 AD; transactionstatus; {"accountclass":"accountclass","accountgroup":"accountgroup"})'
    ],
    formulaRules: [
      'ComponentExpr = AllocatedAmount for AmountInLocalCurrency',
      'ComponentExpr = (transactionstatus == \'Active\') for ValidGLInd'
    ],
    components: [
      {
        id: 'comp-10-1',
        name: 'AllocatedAmount',
        type: 'FETCHFROMSCHEMA',
        sourceClass: 'Class 9 PrePaidReportCostAllocation',
        sourceColumn: 'AllocatedAmount'
      },
      {
        id: 'comp-10-2',
        name: 'AmountInLocalCurrency',
        type: 'MATH',
        expression: 'AllocatedAmount'
      },
      {
        id: 'comp-10-3',
        name: 'ValidGLInd',
        type: 'MATH',
        expression: '(transactionstatus == \'Active\')'
      }
    ],
    criteria: ['documentnumber EQ *', 'itemid EQ *'],
    conditions: [
      'ValidGLInd EQ 1 (Ensures GL account is active prior to journal generation)'
    ],
    expectedOutput: 'TT',
    dependencies: [
      'Class 9 PrePaidReportCostAllocation (fetch)',
      'Class 1 AD (group)'
    ],
    exposes: ['AmountInLocalCurrency: fetched by Class 11 PrePaidReportWF'],
    reviewPoints: 'Serves as the designated accounting class (AdjustmentAc) representing adjustment journals per FR-006.',
    associatedRequirements: ['BR-001', 'BR-004', 'FR-002', 'FR-005', 'TR-002', 'TR-005']
  },
  {
    id: 'class-11',
    classNumber: 11,
    className: 'PrePaidReportWF',
    purpose: 'Route post-allocation adjustment entries through a multi-level workflow structure (FR-007).',
    datasource: 'PrePaidReport',
    grain: 'Per documentnumber Monthly',
    classLevelFields: ['documentnumber', 'lob', 'activitycode', 'activityname', 'forprdfrom', 'forprdto'],
    lookupRules: [
      'activitycode = GETGROUPFROMSCHEMA2(Class 3 AP; activitycode; {"lob":"lob"})',
      'activityname = GETGROUPFROMSCHEMA2(Class 3 AP; activityname; {"lob":"lob"})',
      'lob = GETGROUPFROMSCHEMA2(Class 10 AdjustmentAc; lob; {"documentnumber":"documentnumber"})'
    ],
    formulaRules: ['ComponentExpr = 1 for WorkflowTrigger'],
    components: [
      {
        id: 'comp-11-1',
        name: 'AmountInLocalCurrency',
        type: 'FETCHFROMSCHEMA',
        sourceClass: 'Class 10 AdjustmentAc',
        sourceColumn: 'AmountInLocalCurrency'
      },
      {
        id: 'comp-11-2',
        name: 'WorkflowTrigger',
        type: 'MATH',
        expression: '1'
      }
    ],
    criteria: ['documentnumber EQ *'],
    conditions: [],
    expectedOutput: 'TT',
    dependencies: [
      'Class 10 AdjustmentAc (group, fetch)',
      'Class 3 AP (group)'
    ],
    exposes: ['none'],
    reviewPoints: 'Generates workflow activities evaluating computed thresholds. Validates threshold gating per the workflow definitions in AP.',
    associatedRequirements: ['BR-004', 'FR-006', 'TR-005']
  }
];
