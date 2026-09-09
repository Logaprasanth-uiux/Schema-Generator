import { BusinessInput } from '../types';

export const sampleBusinessInput: BusinessInput = {
  highLevelRequirement: 'Allocate prepaid expenses across Lines of Business based on configured allocation percentages, accounting for destination tax rates and zero-variance ledger posting.',
  isBusinessRequirementGenerated: true,
  generatedBusinessRequirement: `DOMAIN: Accounts Payable and Expense Allocation
HLR: The business needs a system to process prepaid bill extracts by mapping item and service expenses to specific general ledger accounts. It must dynamically allocate costs across multiple Lines of Business using predetermined percentages. Finally, the system must account for applicable tax rates and support post-allocation adjustment journaling.

Key Operational Capabilities:
1. Automated mapping of prepaid bill line-items to General Ledger accounts via Master Lookup table.
2. Dynamic percentage-based distribution of prepaid costs across target Lines of Business (LOB).
3. Destination-specific tax calculation and local currency conversion.
4. Approval and routing workflow for post-allocation adjustments.
5. Zero-variance reconciliation hard-gate to prevent ledger posting when discrepancies exist.`,
  supportingDocuments: [
    {
      id: 'doc-001',
      name: 'Prepaid_Extract_Sample_2023.csv',
      type: 'text/csv',
      size: 245760,
      status: 'processed',
      uploadedAt: new Date().toISOString(),
      previewText: 'documentnumber,itemid,itemname,taxcode,orgid,basevalue,taxpercentage,exchangerate\nINV-88992-ORACLE,ITEM-101,IT Cloud Hosting,TX-NY-01,ORG-USA,100000.00,8.875,1.0\nINV-77441-AIG,ITEM-102,Corporate Liability Policy,TX-DE-00,ORG-USA,50000.00,0.0,1.0'
    },
    {
      id: 'doc-002',
      name: 'Cost_Allocation_Rules_Master_v2.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 112400,
      status: 'processed',
      uploadedAt: new Date().toISOString(),
      previewText: 'CostAllocationMethod,LOB,AllocationValue,EffDateFrom,EffDateTo\nMETH-IT-ALLOC,LOB-US-EAST-RETAIL,60.0,2023-01-01,2023-12-31\nMETH-IT-ALLOC,LOB-US-WEST-RETAIL,40.0,2023-01-01,2023-12-31'
    }
  ],
  additionalInstructions: 'Ensure SCDP strict schema validation is enforced, including overlap logic for ForPrdFrom/ForPrdTo and BudgetOverrunInd check.'
};
