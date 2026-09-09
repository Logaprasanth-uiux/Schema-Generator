import { IAssistantService } from '../interfaces';
import { AssistantContext, AssistantResponse } from '../../types';

export class MockAssistantService implements IAssistantService {
  async respond(
    message: string,
    context: AssistantContext
  ): Promise<AssistantResponse> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const lower = message.toLowerCase();

    if (context.stage === 'business-input') {
      if (lower.includes('prepaid') || lower.includes('example') || lower.includes('sample')) {
        return {
          message:
            'I can help you structure the **Accounts Payable & Prepaid Expense Allocation** input. The domain involves ingesting line items, mapping GL codes via Master Lookup, percentage-based multi-LOB cost splitting, and hard-gating ledger posting on non-zero variances.',
          suggestedActions: [
            { label: 'Prefill Sample Business Input', actionType: 'insert-text' },
            { label: 'Generate Requirements Now', actionType: 'jump-to-stage', payload: 'requirements' },
          ],
        };
      }
      return {
        message:
          'Provide the business requirement and any supporting data dictionaries or extract files. When ready, click **"Generate Requirements"** to trigger the AI analysis stage.',
        suggestedActions: [
          { label: 'Explain Required Document Formats', actionType: 'explain-concept' },
        ],
      };
    }

    if (context.stage === 'requirements') {
      if (lower.includes('finance') || lower.includes('fr')) {
        return {
          message:
            'The **Finance Requirements (FR-001 to FR-008)** govern transaction ingestion, master lookup resolution, percentage allocation, destination tax calculations, adjustment journaling, and the reconciliation zero-variance check (FR-007 / FR-008).',
          suggestedActions: [
            { label: 'Explain Traceability to Technical Requirements', actionType: 'explain-concept' },
            { label: 'Proceed to Class Generation', actionType: 'jump-to-stage', payload: 'classes' },
          ],
        };
      }
      if (lower.includes('technical') || lower.includes('tr')) {
        return {
          message:
            'The **Technical Requirements (TR-001 to TR-008)** specify 6-decimal math precision, SQL/NoSQL dynamic lookup engines, state machine workflows for adjustment entries, and hard-gating interceptors on the GL posting API.',
          suggestedActions: [
            { label: 'Add Custom Technical Rule', actionType: 'refine-requirement' },
          ],
        };
      }
      return {
        message:
          `You have **${context.requirements?.problemStatements.length || 5} Problem Statements**, **${context.requirements?.businessObjectives.length || 5} Objectives**, and **${context.requirements?.technicalRequirements.length || 8} Technical Requirements**. You can edit any card directly or click **"+ Add Information"** before proceeding to Class Generation.`,
        suggestedActions: [
          { label: 'Generate SCDP Classes', actionType: 'jump-to-stage', payload: 'classes' },
          { label: 'Add Accounting Rule Note', actionType: 'refine-requirement' },
        ],
      };
    }

    if (context.stage === 'classes') {
      if (lower.includes('class 9') || lower.includes('overrun') || lower.includes('budget')) {
        return {
          message:
            '**Class 9 (`PrePaidReportCostAllocation`)** performs the mathematical split across Lines of Business and evaluates `(AllocatedAmount > BudgetedAmount)`. If true, `BudgetOverrunInd` triggers a condition exception, preventing invalid ledger postings.',
          suggestedActions: [
            { label: 'Inspect Class 9 Components', actionType: 'highlight-class', payload: 'class-09' },
          ],
        };
      }
      if (lower.includes('dependency') || lower.includes('relationship')) {
        return {
          message:
            'The class dependencies cascade as follows:\n- **Class 5 (`PrePaidReport_I`)** → **Class 6 (`PrePaidReport_ItemCalculation`)**\n- **Class 6 & Class 2 (`CA`)** → **Class 7 (`PrePaidReportCostAllocation1`)**\n- **Class 7** → **Class 8 (`TCostAllocationValue`)** & **Class 9 (`PrePaidReportCostAllocation`)**\n- **Class 9 & Class 1 (`AD`)** → **Class 10 (`AdjustmentAc`)** → **Class 11 (`PrePaidReportWF`)**.',
          suggestedActions: [
            { label: 'Generate Full Schema', actionType: 'jump-to-stage', payload: 'schema' },
          ],
        };
      }
      return {
        message:
          `Currently inspecting **${context.classes?.length || 11} generated classes**. Each class encapsulates datasources, grain, math components, and lookup criteria. You can edit any class properties or click **"Generate Schema"**.`,
        suggestedActions: [
          { label: 'Generate SCDP Schema', actionType: 'jump-to-stage', payload: 'schema' },
        ],
      };
    }

    if (context.stage === 'schema') {
      return {
        message:
          'The **Schema Studio** shows the hierarchical SCDP Schema Tree on the left and the editable JSON on the right. Any edits you make in the JSON editor can be saved with **"Save Schema Changes"** to immediately update the workflow model.',
        suggestedActions: [
          { label: 'Validate SCDP JSON Syntax', actionType: 'explain-concept' },
          { label: 'Proceed to Final Review & Download', actionType: 'jump-to-stage', payload: 'output' },
        ],
      };
    }

    if (context.stage === 'output') {
      return {
        message:
          'Your DataTwin Schema is complete and validated! You can review the summary statistics, inspect the sample reconciliation run, copy the JSON, or click **"Download JSON"** to export `DataTwin-Schema.json` containing all your latest edits.',
        suggestedActions: [
          { label: 'Download DataTwin-Schema.json', actionType: 'insert-text' },
          { label: 'Back to Schema Studio', actionType: 'jump-to-stage', payload: 'schema' },
        ],
      };
    }

    return {
      message:
        'I am the **DataTwin Assistant**. I provide contextual guidance across Business Input, Requirements Traceability, Class Generation, Schema Studio, and Final Output.',
    };
  }
}
