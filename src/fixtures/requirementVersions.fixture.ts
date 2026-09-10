import { RequirementVersion } from '../types';

export const sampleRequirementVersions: Record<string, RequirementVersion[]> = {
  'ps-1': [
    {
      id: 'ps1-v1',
      requirementId: 'ps-1',
      requirementCode: 'PS-001',
      versionNumber: 1,
      title: 'Manual GL Mapping Inefficiencies',
      description: 'System requires manual input for GL mapping of prepaid expense lines, resulting in posting discrepancies.',
      actor: 'AI Engine',
      timestamp: 'Sep 08, 2026 · 10:15 AM',
      changeType: 'INITIAL_GENERATION',
      changeSummary: 'Initial requirement generated from business extract',
    },
  ],
  'ps-2': [
    {
      id: 'ps2-v1',
      requirementId: 'ps-2',
      requirementCode: 'PS-002',
      versionNumber: 1,
      title: 'Static LOB Distribution',
      description: 'Prepaid expenses are assigned to fixed corporate overhead accounts rather than dynamically apportioned across active Lines of Business.',
      actor: 'AI Engine',
      timestamp: 'Sep 08, 2026 · 10:15 AM',
      changeType: 'INITIAL_GENERATION',
      changeSummary: 'Initial requirement generated from business extract',
    },
  ],
  'ps-3': [
    {
      id: 'ps3-v1',
      requirementId: 'ps-3',
      requirementCode: 'PS-003',
      versionNumber: 1,
      title: 'Inaccurate Tax Application',
      description: 'Inaccurate calculation and application of tax rates on dynamically allocated expenses across different business units. When expenses are split, the default HQ tax rate is mistakenly applied to all units.',
      actor: 'AI Engine',
      timestamp: 'Sep 08, 2026 · 10:15 AM',
      changeType: 'INITIAL_GENERATION',
      changeSummary: 'Initial requirement generated from business extract',
    },
    {
      id: 'ps3-v2',
      requirementId: 'ps-3',
      requirementCode: 'PS-003',
      versionNumber: 2,
      title: 'Cross-Entity Tax Application & Nexus Resolution',
      description: `1.0 BUSINESS CONTEXT
Inaccurate calculation and application of tax rates on dynamically allocated expenses across different business units.

2.0 JURISDICTIONAL NEXUS RULES
2.1 Destination Tax Nexus Resolution:
    - For each allocated line item, determine destination entity tax profile using delivery address and corporate tax ID.
    - Destination tax rates must override originating headquarters tax profiles.`,
      actor: 'Priya S. (Tax Lead)',
      timestamp: 'Sep 09, 2026 · 02:30 PM',
      changeType: 'EDIT',
      changeSummary: 'Added destination nexus & exemption resolution rules',
    },
    {
      id: 'ps3-v3',
      requirementId: 'ps-3',
      requirementCode: 'PS-003',
      versionNumber: 3,
      title: 'Inaccurate Cross-Entity Tax Application & Multi-Jurisdiction Proration',
      description: `1.0 BUSINESS CONTEXT & TAX APPORTIONMENT PROBLEM
Inaccurate calculation and application of tax rates on dynamically allocated expenses across different legal entities and operating jurisdictions.

2.0 JURISDICTIONAL NEXUS & TAX RESOLUTION RULES
2.1 Destination Tax Nexus Resolution:
    - For each allocated line item, the engine shall determine the destination entity tax profile using the delivery address.
2.2 Tiered Rate Calculation:
    - State and provincial sales taxes must be computed separately from municipal surcharges.

3.0 ALLOCATION & EXCLUSION RULES
3.1 Non-Taxable Item Proration:
    - Pure service items exempt from state sales tax shall not accrue destination tax liabilities.
3.2 Cross-Currency Conversion:
    - All tax amounts must be computed in local transaction currency and converted to functional reporting currency.`,
      actor: 'Logaprasanth (Finance Architect)',
      timestamp: 'Sep 09, 2026 · 05:45 PM',
      changeType: 'EDIT',
      changeSummary: 'Added non-taxable item proration and audit compliance criteria',
    },
  ],
  'ps-4': [
    {
      id: 'ps4-v1',
      requirementId: 'ps-4',
      requirementCode: 'PS-004',
      versionNumber: 1,
      title: 'Uncontrolled Journal Adjustments',
      description: 'Journal adjustments are entered directly into the accounting system without dual-control review or audit tracking.',
      actor: 'AI Engine',
      timestamp: 'Sep 08, 2026 · 10:15 AM',
      changeType: 'INITIAL_GENERATION',
      changeSummary: 'Initial requirement generated from business extract',
    },
    {
      id: 'ps4-v2',
      requirementId: 'ps-4',
      requirementCode: 'PS-004',
      versionNumber: 2,
      title: 'Lack of Adjustment Approval Workflow',
      description: 'Lack of structured workflow to execute, track, and approve post-allocation adjustment journal entries with threshold-based controller sign-offs.',
      actor: 'Vikram R. (Internal Audit)',
      timestamp: 'Sep 09, 2026 · 11:20 AM',
      changeType: 'EDIT',
      changeSummary: 'Introduced tiered approval threshold requirement',
    },
  ],
  'ps-5': [
    {
      id: 'ps5-v1',
      requirementId: 'ps-5',
      requirementCode: 'PS-005',
      versionNumber: 1,
      title: 'Reconciliation & Variance Visibility Gap',
      description: `1.0 PURPOSE & FINANCIAL CONTROL MANDATE
The system shall enforce basic reconciliation across prepaid expense allocations to ensure the sum of distributed line items matches the original invoice extract total.

2.0 INGESTION & PRE-VALIDATION CRITERIA
2.1 Ingest invoice extract files and confirm row item totals.
2.2 Block ledger posting if variance is greater than $1.00.`,
      actor: 'AI Engine',
      timestamp: 'Sep 08, 2026 · 10:15 AM',
      changeType: 'INITIAL_GENERATION',
      changeSummary: 'Initial requirement generated from business extract',
    },
    {
      id: 'ps5-v2',
      requirementId: 'ps-5',
      requirementCode: 'PS-005',
      versionNumber: 2,
      title: 'Multi-Lateral Reconciliation & Fractional Cent Control',
      description: `1.0 PURPOSE & FINANCIAL CONTROL MANDATE
The system shall enforce strict mathematical reconciliation across all prepaid expense allocations.

2.0 INGESTION & PRE-VALIDATION CRITERIA
2.1 Source Invoice Ingestion:
    - Ingest invoice header and line-item details from enterprise AP feeds (CSV, JSON).
    - Validate that invoice header total exactly matches the sum of line items.

3.0 DYNAMIC ALLOCATION SPECIFICATIONS
3.1 Apportionment Methodology:
    - Allocation weights must strictly sum to 100.000000%.
3.2 Fractional Cent & Remainder Distribution:
    - Arithmetic operations must maintain 6 decimal places.
    - Rounding deltas (+/- 0.01) must be assigned to primary LOB with largest weight.

4.0 POST-ALLOCATION ADJUSTMENT WORKFLOW
4.1 Net-zero balancing rule: SUM(AdjustmentAmt) = 0.00.
4.2 Sign-off required for adjustments over ₹50,000.`,
      actor: 'Priya S. (Financial Operations)',
      timestamp: 'Sep 09, 2026 · 01:15 PM',
      changeType: 'EDIT',
      changeSummary: 'Expanded allocation precision & fractional cent distribution rules',
    },
    {
      id: 'ps5-v3',
      requirementId: 'ps-5',
      requirementCode: 'PS-005',
      versionNumber: 3,
      title: 'Multi-Lateral Reconciliation & Zero-Variance Ledger Interception Specification',
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
    - Support instantaneous retrieval for internal audit, external financial examination, and tax authority audits.`,
      actor: 'Logaprasanth (Chief Systems Architect)',
      timestamp: 'Sep 10, 2026 · 09:30 AM',
      changeType: 'EDIT',
      changeSummary: 'Added zero-tolerance hard-gating interceptors & SHA-256 cryptographic compliance archive',
    },
  ],
  'bo-1': [
    {
      id: 'bo1-v1',
      requirementId: 'bo-1',
      requirementCode: 'BO-001',
      versionNumber: 1,
      title: 'Automate GL Mapping for Invoices',
      description: 'Eliminate manual errors by automatically mapping bill extract items to designated general ledger accounts.',
      actor: 'AI Engine',
      timestamp: 'Sep 08, 2026 · 10:15 AM',
      changeType: 'INITIAL_GENERATION',
      changeSummary: 'Initial requirement generated',
    },
  ],
  'br-1': [
    {
      id: 'br1-v1',
      requirementId: 'br-1',
      requirementCode: 'BR-001',
      versionNumber: 1,
      title: 'GL Mapping Rule Engine Lookup',
      description: 'System must lookup general ledger accounts based on item description, vendor ID, and spend category.',
      actor: 'AI Engine',
      timestamp: 'Sep 08, 2026 · 10:15 AM',
      changeType: 'INITIAL_GENERATION',
      changeSummary: 'Initial requirement generated',
    },
  ],
  'fr-1': [
    {
      id: 'fr1-v1',
      requirementId: 'fr-1',
      requirementCode: 'FR-001',
      versionNumber: 1,
      title: 'COA Segment Validation',
      description: 'Verify that mapped GL codes match active Chart of Accounts (COA) segment definitions and accounting dimensions.',
      actor: 'AI Engine',
      timestamp: 'Sep 08, 2026 · 10:15 AM',
      changeType: 'INITIAL_GENERATION',
      changeSummary: 'Initial requirement generated',
    },
  ],
  'tr-1': [
    {
      id: 'tr1-v1',
      requirementId: 'tr-1',
      requirementCode: 'TR-001',
      versionNumber: 1,
      title: 'ERP GL Lookup Integration Service',
      description: 'Integrate with ERP Chart of Accounts service via REST API with latency < 150ms and local caching.',
      actor: 'AI Engine',
      timestamp: 'Sep 08, 2026 · 10:15 AM',
      changeType: 'INITIAL_GENERATION',
      changeSummary: 'Initial requirement generated',
    },
  ],
};
