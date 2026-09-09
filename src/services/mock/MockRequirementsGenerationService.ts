import { IRequirementsGenerationService, ProgressCallback } from '../interfaces';
import { BusinessInput, RequirementsModel, SupportingDocument } from '../../types';
import { sampleRequirements, sampleBusinessInput } from '../../fixtures';

export class MockRequirementsGenerationService implements IRequirementsGenerationService {
  async generateBusinessRequirement(
    highLevelInput: string,
    supportingDocs: SupportingDocument[],
    onProgress?: ProgressCallback
  ): Promise<string> {
    const steps = [
      { id: '1', label: 'Analyzing high-level business requirement', detail: 'Parsing core operational intent & domain scope' },
      { id: '2', label: 'Synthesizing detailed Business Requirement', detail: 'Formulating ledger mapping, cost apportionment & tax rules' },
      { id: '3', label: 'Structuring key capabilities & validation criteria', detail: 'Generating comprehensive business requirement draft' },
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
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (onProgress) {
        onProgress({
          id: steps[i].id,
          label: steps[i].label,
          detail: steps[i].detail,
          status: 'done',
        });
      }
    }

    if (highLevelInput && highLevelInput.trim().length > 0) {
      return `DOMAIN: Accounts Payable and Expense Allocation
HLR: ${highLevelInput.trim()}

Key Operational Capabilities:
1. Automated mapping of prepaid bill line-items to General Ledger accounts via Master Lookup table.
2. Dynamic percentage-based distribution of prepaid costs across target Lines of Business (LOB).
3. Destination-specific tax calculation and local currency conversion.
4. Approval and routing workflow for post-allocation adjustments.
5. Zero-variance reconciliation hard-gate to prevent ledger posting when discrepancies exist.`;
    }

    return sampleBusinessInput.generatedBusinessRequirement || '';
  }

  async generateRequirements(
    input: BusinessInput,
    onProgress?: ProgressCallback
  ): Promise<RequirementsModel> {
    const steps = [
      { id: '1', label: 'Ingesting reviewed Business Requirement', detail: 'Parsing domain rules & document attachments' },
      { id: '2', label: 'Formulating Problem Statements (PS-001..PS-005)', detail: 'Mapped Decision, Allocation, Calculation, Workflow, Validation' },
      { id: '3', label: 'Deriving Business Objectives & Requirements', detail: 'Structured BO-001..BO-005 and BR-001..BR-006' },
      { id: '4', label: 'Synthesizing Finance & Technical Specifications', detail: 'Generated 8 Finance (FR) and 8 Technical (TR) rules' },
      { id: '5', label: 'Constructing expected ledger verification profile', detail: 'Synthesized 4 sample transaction reconciliation records' },
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
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (onProgress) {
        onProgress({
          id: steps[i].id,
          label: steps[i].label,
          detail: steps[i].detail,
          status: 'done',
        });
      }
    }

    const customized: RequirementsModel = {
      ...sampleRequirements,
      highLevelRequirement: input.generatedBusinessRequirement || input.highLevelRequirement || sampleRequirements.highLevelRequirement,
      generatedAt: new Date().toISOString(),
    };

    return customized;
  }
}
