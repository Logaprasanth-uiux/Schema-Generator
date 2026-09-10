import { RequirementsModel } from '../types';

export const sampleRequirements: RequirementsModel = {
  domain: 'Accounts Payable and Expense Allocation',
  highLevelRequirement:
    'The business needs a system to process prepaid bill extracts by mapping item and service expenses to specific general ledger accounts. It must dynamically allocate costs across multiple Lines of Business using predetermined percentages. Finally, the system must account for applicable tax rates and support post-allocation adjustment journaling.',
  generatedAt: new Date().toISOString(),
  problemStatements: [
    {
      id: 'ps-1',
      code: 'PS-001',
      title: 'Manual GL Mapping Errors',
      category: 'Decision',
      description:
        'Manual and error-prone mapping of prepaid bill items and service expenses to specific general ledger accounts.',
      isAiGenerated: true,
    },
    {
      id: 'ps-2',
      code: 'PS-002',
      title: 'Inflexible Multi-LOB Distribution',
      category: 'Allocation',
      description:
        'Inability to dynamically and accurately distribute prepaid costs across multiple Lines of Business using predetermined allocation percentages.',
      isAiGenerated: true,
    },
    {
      id: 'ps-3',
      code: 'PS-003',
      title: 'Inaccurate Cross-Entity Tax Application & Multi-Jurisdiction Proration',
      category: 'Calculation',
      description: `1.0 BUSINESS CONTEXT & TAX APPORTIONMENT PROBLEM
Inaccurate calculation and application of tax rates on dynamically allocated expenses across different legal entities and operating jurisdictions. When prepaid expenses originate in one corporate headquarters entity but are apportioned across multiple operating subsidiaries, localized tax treatment must be deterministically resolved.

2.0 JURISDICTIONAL NEXUS & TAX RESOLUTION RULES
2.1 Destination Tax Nexus Resolution:
    - For each allocated line item, the engine shall determine the destination entity tax profile using the delivery address and corporate tax registration ID.
    - If the destination entity resides in a distinct tax jurisdiction from the purchasing entity, inter-company cross-border tax schedules must apply.
2.2 Tiered Rate Calculation:
    - State and provincial sales taxes must be computed separately from municipal or local transit surcharges.
    - Tax exemptions must be verified against the destination business unit exemption registry (TaxExemptionCertInd).

3.0 ALLOCATION & EXCLUSION RULES
3.1 Non-Taxable Item Proration:
    - Pure service items exempt from state sales tax shall not accrue destination tax liabilities.
    - Mixed hardware/service bundles must unpack SKU components to apply composite tax rates accurately.
3.2 Cross-Currency Conversion:
    - All tax amounts must be computed in the local transaction currency and converted to functional reporting currency using daily spot exchange rates.

4.0 AUDIT LINEAGE & COMPLIANCE
4.1 The system shall maintain an immutable audit record linking each tax calculation back to the master tax authority rate table version.
4.2 Tax liability variances exceeding 0.001 in functional currency must trigger an automated compliance review flag.`,
      isAiGenerated: true,
    },
    {
      id: 'ps-4',
      code: 'PS-004',
      title: 'Lack of Adjustment Approval Workflow',
      category: 'Workflow',
      description:
        'Lack of structured workflow to execute, track, and approve post-allocation adjustment journal entries.',
      isAiGenerated: true,
    },
    {
      id: 'ps-5',
      code: 'PS-005',
      title: 'Multi-Lateral Reconciliation & Zero-Variance Ledger Interception Specification',
      category: 'Validation',
      description: `1.0 PURPOSE & FINANCIAL CONTROL MANDATE
The system shall enforce strict mathematical reconciliation across all prepaid expense allocations, post-allocation adjustments, tax calculations, and sub-ledger postings. Any variance between the original source invoice total and the sum of all downstream line-item entries must be intercepted and prevented from posting to the General Ledger.

2.0 INGESTION & PRE-VALIDATION CRITERIA
2.1 Source Invoice Ingestion:
    - Ingest invoice header and line-item details from enterprise AP feeds (CSV, JSON, XML, EDI 810).
    - Validate that invoice header total exactly matches the sum of line-item base values plus stated invoice taxes.
    - If the source extract exhibits pre-existing internal inconsistency, reject the file immediately with error code ERR-INGEST-INCONSISTENT-TOTALS.
2.2 Data Quality & Currency Checks:
    - Ensure currency ISO codes conform to standard ISO 4217.
    - Ensure all fiscal period identifiers match open accounting periods in the Master Calendar table.

3.0 DYNAMIC ALLOCATION SPECIFICATIONS
3.1 Apportionment Methodology:
    - Lookup the allocation profile associated with the invoice commodity code and requesting department.
    - Retrieve active allocation weight configuration for the target Lines of Business (LOB).
    - Allocation weights must strictly sum to 100.000000% (1.000000) across all designated recipient entities.
3.2 Fractional Cent & Remainder Distribution:
    - All intermediate arithmetic operations shall maintain 6 decimal places of precision.
    - When round-off to 2 decimal places creates a fractional cent discrepancy (+/- 0.01), the engine shall assign the rounding delta to the primary LOB having the largest percentage weight.
    - The rounding delta assignment must be explicitly documented in the calculation lineage trace (RoundingAdjustmentAmt).

4.0 POST-ALLOCATION ADJUSTMENT WORKFLOW
4.1 Adjustment Capture:
    - Business unit controllers may submit re-allocation adjustments prior to ledger posting closing dates.
    - Adjustments may shift balances between LOBs or amend general ledger account classifications.
4.2 Multi-Lateral Balancing Rule:
    - Every adjustment entry must be net-zero across all modified lines (SUM(AdjustmentAmt) = 0.00).
    - Adjustments that alter the aggregate invoice total are strictly prohibited.
4.3 Hierarchical Approval Matrix:
    - Adjustments under ₹50,000 / $1,000 require Single Controller sign-off.
    - Adjustments between ₹50,000 and ₹500,000 require VP Finance authorization.
    - Adjustments exceeding ₹500,000 require CFO or Corporate Controller dual approval.

5.0 MULTI-LATERAL RECONCILIATION ENGINE
5.1 Mathematical Invariant Formulas:
    - Invariant 1: SourceTotal == SUM(LineItemBaseAllocated) + SUM(LineItemTaxes)
    - Invariant 2: NetAdjustmentTotal == 0.0000
    - Invariant 3: FinalPostableTotal == SourceTotal + NetAdjustmentTotal
    - Invariant 4: GLDebitEntriesTotal == GLCreditEntriesTotal
5.2 Tolerance Gating:
    - The reconciliation threshold is configured at exactly 0.0000 currency units.
    - No soft-variance thresholds are permitted under standard enterprise financial policy.

6.0 HARD-GATING INTERCEPTOR & ERROR HANDLING
6.1 Interception Rules:
    - If Invariant 1, 2, 3, or 4 evaluates to false, the ledger posting orchestration agent must immediately block the transaction.
    - Set transaction status to 'EXCEPTION_RECONCILIATION_FAILED'.
    - Generate an immutable audit exception record with detailed delta breakdown.
6.2 Notification & SLA:
    - Dispatch automated alert notification to the Financial Operations Queue.
    - Escalate to Tier-2 Financial Systems Engineering if unresolved within 4 business hours.

7.0 AUDIT LINEAGE & COMPLIANCE ARCHIVE
7.1 Cryptographic Hash Sealing:
    - Generate a SHA-256 digital signature over the complete payload:
      SHA256(SourceInvoicePayload + AllocationMatrix + AdjustmentsArray + FinalJournalLines)
    - Store the digital signature in the SCDP Compliance Ledger.
7.2 Data Retention:
    - Maintain transaction execution history for a minimum of 7 fiscal years in immutable storage.
    - Support instantaneous retrieval for internal audit, external financial examination, and tax authority audits.

8.0 EXPECTED DOWNSTREAM JOURNAL CONTRACT
8.1 Output Format:
    - Schema-compliant SCDP JSON transaction payload ready for SAP / Oracle / Workday General Ledger ingestion.
    - Balanced double-entry accounting records with complete COA (Chart of Accounts) string.
8.2 Final Verification Checklist:
    - [x] Header validation passed
    - [x] LOB allocation percentage verified
    - [x] Jurisdiction tax computed
    - [x] Controller approvals verified
    - [x] Zero variance confirmed (Variance == 0.00)`,
      isAiGenerated: true,
    },
  ],
  businessObjectives: [
    {
      id: 'bo-1',
      code: 'BO-001',
      title: 'Automate GL Account Determination',
      derivedFromPsCode: 'PS-001',
      description:
        'Automate the mapping of prepaid bill items and service expenses to designated general ledger accounts to eliminate manual errors.',
      isAiGenerated: true,
    },
    {
      id: 'bo-2',
      code: 'BO-002',
      title: 'Dynamic Percentage-Based Cost Splitting',
      derivedFromPsCode: 'PS-002',
      description:
        'Enable dynamic, percentage-based distribution of prepaid costs across multiple Lines of Business.',
      isAiGenerated: true,
    },
    {
      id: 'bo-3',
      code: 'BO-003',
      title: 'Jurisdictional Tax Precision',
      derivedFromPsCode: 'PS-003',
      description:
        'Ensure accurate and automated calculation and application of tax rates on all allocated expenses across business units.',
      isAiGenerated: true,
    },
    {
      id: 'bo-4',
      code: 'BO-004',
      title: 'Auditable Adjustment Workflow',
      derivedFromPsCode: 'PS-004',
      description:
        'Establish a structured, traceable, and auditable workflow for executing, tracking, and approving post-allocation adjustment journal entries.',
      isAiGenerated: true,
    },
    {
      id: 'bo-5',
      code: 'BO-005',
      title: 'Zero-Variance Ledger Hard-Gating',
      derivedFromPsCode: 'PS-005',
      description:
        'Implement automated validation and reconciliation mechanisms to ensure zero-variance between total allocated/adjusted expenses and original prepaid bill extract values prior to ledger posting.',
      isAiGenerated: true,
    },
  ],
  businessRequirements: [
    {
      id: 'br-1',
      code: 'BR-001',
      title: 'Master Lookup GL Resolution',
      category: 'Lookup',
      derivedFromBoCode: 'BO-001',
      description:
        'The system shall retrieve and map prepaid bill items and service expenses to specific general ledger accounts using a configurable master lookup table.',
      isAiGenerated: true,
    },
    {
      id: 'br-2',
      code: 'BR-002',
      title: 'Multi-LOB Weighted Distribution',
      category: 'Allocation',
      derivedFromBoCode: 'BO-002',
      description:
        'The system shall dynamically calculate and distribute prepaid costs across multiple Lines of Business (LOB) based on preconfigured allocation rules and percentage weights.',
      isAiGenerated: true,
    },
    {
      id: 'br-3',
      code: 'BR-003',
      title: 'Destination-Profile Tax Calculation',
      category: 'Calculation',
      derivedFromBoCode: 'BO-003',
      description:
        'The system shall compute and apply the correct tax rate to each dynamically allocated expense item based on the tax profile of the destination business unit.',
      isAiGenerated: true,
    },
    {
      id: 'br-4',
      code: 'BR-004',
      title: 'Adjustment Lifecycle Management',
      category: 'Workflow',
      derivedFromBoCode: 'BO-004',
      description:
        'The system shall provide an end-to-end workflow to create, route, track, and approve post-allocation adjustment journal entries prior to final posting.',
      isAiGenerated: true,
    },
    {
      id: 'br-5',
      code: 'BR-005',
      title: 'Sum-of-Segments Reconciliation',
      category: 'Validation',
      derivedFromBoCode: 'BO-005',
      description:
        'The system shall validate that the sum of all allocated expenses plus any post-allocation adjustments matches the original prepaid bill extract total.',
      isAiGenerated: true,
    },
    {
      id: 'br-6',
      code: 'BR-006',
      title: 'Non-Zero Variance Interception',
      category: 'Decision',
      derivedFromBoCode: 'BO-005',
      description:
        'The system shall prevent the ledger posting execution if any reconciliation variance exists between the final adjusted total and the original bill extract.',
      isAiGenerated: true,
    },
  ],
  financeRequirements: [
    {
      id: 'fr-1',
      code: 'FR-001',
      title: 'Source Bill Ingestion & Parse',
      derivedFromBrCode: 'BR-001',
      description:
        'The system shall ingest and parse raw prepaid bill items and service expenses from source data extracts.',
      isAiGenerated: true,
    },
    {
      id: 'fr-2',
      code: 'FR-002',
      title: 'Dynamic GL Account Mapping',
      derivedFromBrCode: 'BR-001',
      description:
        'The system shall map prepaid bill items to specific General Ledger (GL) accounts using a dynamically configurable master lookup table.',
      isAiGenerated: true,
    },
    {
      id: 'fr-3',
      code: 'FR-003',
      title: 'LOB Percentage Apportionment',
      derivedFromBrCode: 'BR-002',
      description:
        'The system shall dynamically calculate and allocate prepaid costs across multiple target Lines of Business (LOB) based on configured percentage weights.',
      isAiGenerated: true,
    },
    {
      id: 'fr-4',
      code: 'FR-004',
      title: 'Destination Tax Computation',
      derivedFromBrCode: 'BR-003',
      description:
        'The system shall determine the correct tax profile of the destination business unit and calculate the corresponding tax rate to apply to each allocated expense item.',
      isAiGenerated: true,
    },
    {
      id: 'fr-5',
      code: 'FR-005',
      title: 'Post-Allocation Adjustment Capture',
      derivedFromBrCode: 'BR-004',
      description:
        'The system shall support manual entry and creation of post-allocation adjustment journal entries.',
      isAiGenerated: true,
    },
    {
      id: 'fr-6',
      code: 'FR-006',
      title: 'Multi-Level Approval Routing',
      derivedFromBrCode: 'BR-004',
      description:
        'The system shall provide an approval and routing workflow to track, review, and approve adjustment entries before posting.',
      isAiGenerated: true,
    },
    {
      id: 'fr-7',
      code: 'FR-007',
      title: 'Automated Multi-Lateral Math Check',
      derivedFromBrCode: 'BR-005',
      description:
        'The system shall automatically execute a reconciliation check comparing the sum of all allocated expenses plus post-allocation adjustments with the original prepaid bill extract total.',
      isAiGenerated: true,
    },
    {
      id: 'fr-8',
      code: 'FR-008',
      title: 'Ledger Post Exception Gating',
      derivedFromBrCode: 'BR-006',
      description:
        'The system shall block ledger posting execution and generate an exception log if any variance is detected during the reconciliation check.',
      isAiGenerated: true,
    },
  ],
  technicalRequirements: [
    {
      id: 'tr-1',
      code: 'TR-001',
      title: 'Multi-Format Ingestion Pipeline',
      derivedFromFrCodes: ['FR-001'],
      description:
        'Implement a robust data integration pipeline to consume CSV, JSON, and database-sourced transactional extracts containing prepaid expense items.',
      isAiGenerated: true,
    },
    {
      id: 'tr-2',
      code: 'TR-002',
      title: 'Configuration-Driven Lookup Engine',
      derivedFromFrCodes: ['FR-002'],
      description:
        'Build a configuration-driven rule engine to resolve General Ledger accounts dynamically using SQL/NoSQL lookups without code modification.',
      isAiGenerated: true,
    },
    {
      id: 'tr-3',
      code: 'TR-003',
      title: '6-Decimal Precision Math Processor',
      derivedFromFrCodes: ['FR-003'],
      description:
        'Develop a calculation engine to compute allocations with precision up to 6 decimal places to prevent rounding-error variances.',
      isAiGenerated: true,
    },
    {
      id: 'tr-4',
      code: 'TR-004',
      title: 'Jurisdiction Tax Engine Service',
      derivedFromFrCodes: ['FR-004'],
      description:
        'Integrate an extensible metadata service to query destination business unit tax profiles and execute localized tax calculations.',
      isAiGenerated: true,
    },
    {
      id: 'tr-5',
      code: 'TR-005',
      title: 'State-Machine Workflow Engine',
      derivedFromFrCodes: ['FR-005', 'FR-006'],
      description:
        'Implement a state-machine workflow engine to handle transitions (Draft, Pending Approval, Approved, Rejected) of adjustment entries.',
      isAiGenerated: true,
    },
    {
      id: 'tr-6',
      code: 'TR-006',
      title: 'Lowest-Currency-Unit Reconciliation',
      derivedFromFrCodes: ['FR-007'],
      description:
        'Develop an automated reconciliation processor that performs multi-lateral math validations down to the lowest currency unit.',
      isAiGenerated: true,
    },
    {
      id: 'tr-7',
      code: 'TR-007',
      title: 'Hard-Gating Interceptor on GL Posting API',
      derivedFromFrCodes: ['FR-008'],
      description:
        'Implement a transactional hard-gating interceptor in the GL posting API to strictly prevent execution when variance is non-zero.',
      isAiGenerated: true,
    },
    {
      id: 'tr-8',
      code: 'TR-008',
      title: 'Audit Lineage & Traceability Store',
      derivedFromFrCodes: ['FR-001', 'FR-002', 'FR-003', 'FR-004', 'FR-005', 'FR-006', 'FR-007', 'FR-008'],
      description:
        'Design a centralized logging and auditable data lineage schema capturing all inputs, calculation configurations, intermediate states, and approvals.',
      isAiGenerated: true,
    },
  ],
  expectedOutput: {
    title: 'Allocated Expense Ledger Run',
    type: 'Allocated Transactions',
    description:
      'Processed prepaid expenses and service bills mapped to target general ledger accounts, dynamically distributed across multiple Lines of Business (LOB) with destination-specific tax calculations, post-allocation adjustments, and final ledger posting reconciliation validation.',
    sampleRecords: [
      {
        recordId: 'TXN-2023-11001',
        sourceBillId: 'INV-88992-ORACLE',
        vendorName: 'CloudSphere Solutions',
        prepaidGlAccount: '141200 - Prepaid IT Services',
        originalBillTotal: 100000.0,
        allocationDetails: [
          {
            targetLob: 'LOB-US-EAST-RETAIL',
            allocationPercentage: 60.0,
            baseAllocatedAmount: 60000.0,
            destinationTaxProfile: 'US-NY-RETAIL-01',
            appliedTaxRate: 8.875,
            calculatedTaxAmount: 5325.0,
            allocatedTotalWithTax: 65325.0,
          },
          {
            targetLob: 'LOB-US-WEST-RETAIL',
            allocationPercentage: 40.0,
            baseAllocatedAmount: 40000.0,
            destinationTaxProfile: 'US-CA-RETAIL-02',
            appliedTaxRate: 7.25,
            calculatedTaxAmount: 2900.0,
            allocatedTotalWithTax: 42900.0,
          },
        ],
        postAllocationAdjustments: [
          {
            adjustmentId: 'ADJ-11001-01',
            targetLob: 'LOB-US-EAST-RETAIL',
            adjustmentAmount: -5000.0,
            reason: 'Re-allocate seasonal capacity variance to West LOB',
          },
          {
            adjustmentId: 'ADJ-11001-02',
            targetLob: 'LOB-US-WEST-RETAIL',
            adjustmentAmount: 5000.0,
            reason: 'Re-allocate seasonal capacity variance to West LOB',
          },
        ],
        approvalWorkflow: {
          currentStep: 'APPROVED',
          assignedApprover: 'jane.doe@company.com',
          approvalDate: '2023-11-01T14:30:00Z',
          workflowStatus: 'APPROVED',
        },
        reconciliationSummary: {
          totalAllocatedBase: 100000.0,
          netAdjustments: 0.0,
          reconciliationVariance: 0.0,
        },
        status: 'PROCESSED',
      },
      {
        recordId: 'TXN-2023-11002',
        sourceBillId: 'INV-77441-AIG',
        vendorName: 'Apex Corporate Insurance',
        prepaidGlAccount: '141100 - Prepaid Insurance',
        originalBillTotal: 50000.0,
        allocationDetails: [
          {
            targetLob: 'LOB-CORP-FIN',
            allocationPercentage: 50.0,
            baseAllocatedAmount: 25000.0,
            destinationTaxProfile: 'US-DE-CORP-EXEMPT',
            appliedTaxRate: 0.0,
            calculatedTaxAmount: 0.0,
            allocatedTotalWithTax: 25000.0,
          },
          {
            targetLob: 'LOB-US-MIDWEST-MFG',
            allocationPercentage: 40.0,
            baseAllocatedAmount: 20000.0,
            destinationTaxProfile: 'US-IL-MFG-01',
            appliedTaxRate: 6.25,
            calculatedTaxAmount: 1250.0,
            allocatedTotalWithTax: 21250.0,
          },
        ],
        postAllocationAdjustments: [],
        approvalWorkflow: {
          currentStep: 'COMPLIANCE_REVIEW',
          assignedApprover: 'audit.team@company.com',
          approvalDate: null,
          workflowStatus: 'PENDING_REVIEW',
        },
        reconciliationSummary: {
          totalAllocatedBase: 45000.0,
          netAdjustments: 0.0,
          reconciliationVariance: -5000.0,
        },
        status: 'EXCEPTION',
      },
      {
        recordId: 'TXN-2023-11003',
        sourceBillId: 'INV-55221-WWR',
        vendorName: 'Worldwide Real Estate',
        prepaidGlAccount: '141400 - Prepaid Rent',
        originalBillTotal: 120000.0,
        allocationDetails: [
          {
            targetLob: 'LOB-EMEA-UK-OFFICES',
            allocationPercentage: 100.0,
            baseAllocatedAmount: 120000.0,
            destinationTaxProfile: 'UK-VAT-PROP',
            appliedTaxRate: 20.0,
            calculatedTaxAmount: 24000.0,
            allocatedTotalWithTax: 144000.0,
          },
        ],
        postAllocationAdjustments: [
          {
            adjustmentId: 'ADJ-11003-01',
            targetLob: 'LOB-EMEA-UK-OFFICES',
            adjustmentAmount: -10000.0,
            reason: 'Sublease credit adjustment from shared floor space',
          },
        ],
        approvalWorkflow: {
          currentStep: 'VP_FINANCE_APPROVAL',
          assignedApprover: 'vp.finance@company.com',
          approvalDate: null,
          workflowStatus: 'PENDING_REVIEW',
        },
        reconciliationSummary: {
          totalAllocatedBase: 120000.0,
          netAdjustments: -10000.0,
          reconciliationVariance: -10000.0,
        },
        status: 'EXCEPTION',
      },
      {
        recordId: 'TXN-2023-11004',
        sourceBillId: 'INV-33119-MKTG',
        vendorName: 'Omnicom Marketing Group',
        prepaidGlAccount: '141500 - Prepaid Marketing Services',
        originalBillTotal: 75000.0,
        allocationDetails: [
          {
            targetLob: 'LOB-APAC-APAC-MKTG',
            allocationPercentage: 100.0,
            baseAllocatedAmount: 75000.0,
            destinationTaxProfile: 'SG-GST-01',
            appliedTaxRate: 8.0,
            calculatedTaxAmount: 6000.0,
            allocatedTotalWithTax: 81000.0,
          },
        ],
        postAllocationAdjustments: [],
        approvalWorkflow: {
          currentStep: 'AUTO_APPROVED',
          assignedApprover: 'system@company.com',
          approvalDate: '2023-11-02T09:00:00Z',
          workflowStatus: 'APPROVED',
        },
        reconciliationSummary: {
          totalAllocatedBase: 75000.0,
          netAdjustments: 0.0,
          reconciliationVariance: 0.0,
        },
        status: 'PROCESSED',
      },
    ],
  },
};
