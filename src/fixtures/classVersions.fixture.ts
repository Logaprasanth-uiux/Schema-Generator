import { ClassVersion } from '../types';

export const sampleClassVersions: Record<string, ClassVersion[]> = {
  'class-01': [
    {
      id: 'c1-v1',
      classId: 'class-01',
      classNumber: 1,
      className: 'AD',
      versionNumber: 1,
      title: 'Class #1 · AD (Account Determination Master)',
      purpose: 'Account determination master to map GL account codes based on item category and service type.',
      datasource: 'AD',
      grain: 'Per accountclass',
      specification: `DATASOURCE: AD
SETTLEMENT GRAIN: Per accountclass

PURPOSE & BUSINESS LOGIC:
Account determination master to map GL account codes based on item category and service type.

COMPONENTS (1):
- parameter1 [MATH]: parameter1 (Placeholder numeric parameter)

CRITERIA & FILTER LOGIC:
- accountclass EQ *

EXPOSES:
- none (fields are resolved by downstream classes via GETGROUPFROMSCHEMA2)`,
      actor: 'AI Engine',
      timestamp: 'Sep 08, 2026 · 10:15 AM',
      changeType: 'INITIAL_GENERATION',
      changeSummary: 'Initial schema class generated from BR-001 mapping rules',
    },
    {
      id: 'c1-v2',
      classId: 'class-01',
      classNumber: 1,
      className: 'AD',
      versionNumber: 2,
      title: 'Class #1 · AD (Account Determination Master)',
      purpose: 'Account determination master to map GL account codes based on item category and service type, supporting active GL validation (BR-001, BR-002).',
      datasource: 'AD',
      grain: 'Per accountclass',
      specification: `DATASOURCE: AD
SETTLEMENT GRAIN: Per accountclass

PURPOSE & BUSINESS LOGIC:
Account determination master to map GL account codes based on item category and service type, supporting active GL validation (BR-001, BR-002).

COMPONENTS (1):
- parameter1 [MATH]: parameter1 (Mandatory numeric placeholder for active segment validation)

FORMULA RULES:
- ComponentExpr = parameter1 for parameter1

CRITERIA & FILTER LOGIC:
- accountclass EQ *
- ForPrdFrom, ForPrdTo overlap logic

EXPOSES:
- none (fields are grouped/resolved by downstream classes via GETGROUPFROMSCHEMA2)`,
      actor: 'Priya S. (Tax Lead)',
      timestamp: 'Sep 09, 2026 · 02:45 PM',
      changeType: 'EDIT',
      changeSummary: 'Added period overlap filter and mandatory segment validation rules',
    },
  ],
  'class-02': [
    {
      id: 'c2-v1',
      classId: 'class-02',
      classNumber: 2,
      className: 'CA',
      versionNumber: 1,
      title: 'Class #2 · CA (Cost Allocation Master)',
      purpose: 'Cost allocation master to provide predefined percentage profiles across Lines of Business (LoBs).',
      datasource: 'CA',
      grain: 'Per costallocationmethod',
      specification: `DATASOURCE: CA
SETTLEMENT GRAIN: Per costallocationmethod

PURPOSE & BUSINESS LOGIC:
Cost allocation master to provide predefined percentage profiles across Lines of Business (LoBs).

COMPONENTS (1):
- costallocationvalue [MATH]: costallocationvalue (Base allocation weight)

CRITERIA & FILTER LOGIC:
- costallocationmethod EQ *

EXPOSES:
- costallocationvalue: fetched by downstream classes`,
      actor: 'AI Engine',
      timestamp: 'Sep 08, 2026 · 10:15 AM',
      changeType: 'INITIAL_GENERATION',
      changeSummary: 'Initial allocation master generation',
    },
    {
      id: 'c2-v2',
      classId: 'class-02',
      classNumber: 2,
      className: 'CA',
      versionNumber: 2,
      title: 'Class #2 · CA (Cost Allocation Master)',
      purpose: 'Cost allocation master to provide predefined percentage profiles across Lines of Business (LoBs) (BR-004).',
      datasource: 'CA',
      grain: 'Per costallocationmethod',
      specification: `DATASOURCE: CA
SETTLEMENT GRAIN: Per costallocationmethod

PURPOSE & BUSINESS LOGIC:
Cost allocation master to provide predefined percentage profiles across Lines of Business (LoBs) (BR-004).

COMPONENTS (1):
- costallocationvalue [MATH]: costallocationvalue (Predefined allocation percentage or weighting value)

FORMULA RULES:
- ComponentExpr = costallocationvalue for costallocationvalue

CRITERIA & FILTER LOGIC:
- costallocationmethod EQ *
- ForPrdFrom, ForPrdTo overlap logic

EXPOSES:
- costallocationvalue: fetched by Class 7 PrePaidReportCostAllocation1`,
      actor: 'Logaprasanth (User)',
      timestamp: 'Sep 09, 2026 · 04:10 PM',
      changeType: 'EDIT',
      changeSummary: 'Configured dynamic period overlap and downstream fetch bindings',
    },
  ],
  'class-03': [
    {
      id: 'c3-v1',
      classId: 'class-03',
      classNumber: 3,
      className: 'AP',
      versionNumber: 1,
      title: 'Class #3 · AP (Approval Workflow Master)',
      purpose: 'Approval workflow master defining routing structure and configurable thresholds.',
      datasource: 'AP',
      grain: 'Per activitycode',
      specification: `DATASOURCE: AP
SETTLEMENT GRAIN: Per activitycode

PURPOSE & BUSINESS LOGIC:
Approval workflow master defining routing structure and configurable thresholds.

COMPONENTS (1):
- timeinmins [MATH]: timeinmins (Threshold timeout in minutes)

CRITERIA & FILTER LOGIC:
- activitycode EQ *`,
      actor: 'AI Engine',
      timestamp: 'Sep 08, 2026 · 10:15 AM',
      changeType: 'INITIAL_GENERATION',
      changeSummary: 'Initial approval workflow master generated',
    },
    {
      id: 'c3-v2',
      classId: 'class-03',
      classNumber: 3,
      className: 'AP',
      versionNumber: 2,
      title: 'Class #3 · AP (Approval Workflow Master)',
      purpose: 'Approval workflow master defining routing structure and configurable thresholds (BR-006).',
      datasource: 'AP',
      grain: 'Per activitycode',
      specification: `DATASOURCE: AP
SETTLEMENT GRAIN: Per activitycode

PURPOSE & BUSINESS LOGIC:
Approval workflow master defining routing structure and configurable thresholds (BR-006).

COMPONENTS (2):
- timeinmins [MATH]: timeinmins (Threshold timeout in minutes)
- timeindays [MATH]: timeindays (Threshold timeout in days)

FORMULA RULES:
- ComponentExpr = timeinmins for timeinmins
- ComponentExpr = timeindays for timeindays

CRITERIA & FILTER LOGIC:
- activitycode EQ *
- ForPrdFrom, ForPrdTo overlap logic

EXPOSES:
- none (fields are grouped/resolved by downstream classes, not fetched)`,
      actor: 'Logaprasanth (User)',
      timestamp: 'Sep 10, 2026 · 11:30 AM',
      changeType: 'EDIT',
      changeSummary: 'Added multi-day timeout parameters and period boundaries',
    },
  ],
  'class-04': [
    {
      id: 'c4-v1',
      classId: 'class-04',
      classNumber: 4,
      className: 'PWBill',
      versionNumber: 1,
      title: 'Class #4 · PWBill (Historical Bill Data)',
      purpose: 'Historical bill data to act as active period budgets for variance evaluation and overruns (BR-005).',
      datasource: 'PWBill',
      grain: 'Per documentnumber Monthly',
      specification: `DATASOURCE: PWBill
SETTLEMENT GRAIN: Per documentnumber Monthly

PURPOSE & BUSINESS LOGIC:
Historical bill data to act as active period budgets for variance evaluation and overruns (BR-005).

COMPONENTS (1):
- invoicetotal [MATH]: invoicetotal (Historical invoice total for budget proration)

CRITERIA & FILTER LOGIC:
- documentnumber EQ *`,
      actor: 'AI Engine',
      timestamp: 'Sep 08, 2026 · 10:15 AM',
      changeType: 'INITIAL_GENERATION',
      changeSummary: 'Initial historical budget extract class',
    },
  ],
  'class-05': [
    {
      id: 'c5-v1',
      classId: 'class-05',
      classNumber: 5,
      className: 'PrePaidReportLineItem',
      versionNumber: 1,
      title: 'Class #5 · PrePaidReportLineItem (Ingestion & Normalization)',
      purpose: 'Primary staging class reading raw invoice extract files and mapping items to master classifications.',
      datasource: 'PrePaidReport',
      grain: 'Per itemid Monthly',
      specification: `DATASOURCE: PrePaidReport
SETTLEMENT GRAIN: Per itemid Monthly

PURPOSE & BUSINESS LOGIC:
Primary staging class reading raw invoice extract files and mapping items to master classifications.

COMPONENTS (1):
- invoiceamount [MATH]: invoiceamount (Raw item invoice amount)

CRITERIA & FILTER LOGIC:
- transactionstatus EQ 'APPROVED'`,
      actor: 'AI Engine',
      timestamp: 'Sep 08, 2026 · 10:15 AM',
      changeType: 'INITIAL_GENERATION',
      changeSummary: 'Initial extract ingestion model',
    },
    {
      id: 'c5-v2',
      classId: 'class-05',
      classNumber: 5,
      className: 'PrePaidReportLineItem',
      versionNumber: 2,
      title: 'Class #5 · PrePaidReportLineItem (Ingestion & Normalization)',
      purpose: 'Primary staging class reading raw invoice extract files, validating period ranges, and mapping items to master classifications (BR-001, BR-003).',
      datasource: 'PrePaidReport',
      grain: 'Per itemid Monthly',
      specification: `DATASOURCE: PrePaidReport
SETTLEMENT GRAIN: Per itemid Monthly

PURPOSE & BUSINESS LOGIC:
Primary staging class reading raw invoice extract files, validating period ranges, and mapping items to master classifications (BR-001, BR-003).

COMPONENTS (2):
- invoiceamount [MATH]: invoiceamount (Raw item invoice amount)
- taxrate [MATH]: taxrate (Tax percentage extracted from line item)

FORMULA RULES:
- ComponentExpr = invoiceamount for invoiceamount
- ComponentExpr = taxrate for taxrate

CRITERIA & FILTER LOGIC:
- transactionstatus EQ 'APPROVED'
- amount GT 0.00
- ForPrdFrom, ForPrdTo range validity

GATING CONDITIONS:
- itemid NE ''`,
      actor: 'Priya S. (Tax Lead)',
      timestamp: 'Sep 09, 2026 · 05:20 PM',
      changeType: 'EDIT',
      changeSummary: 'Added tax rate components and positive balance validation rules',
    },
  ],
};
