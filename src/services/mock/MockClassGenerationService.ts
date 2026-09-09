import { IClassGenerationService, ProgressCallback } from '../interfaces';
import { RequirementsModel, SchemaClass } from '../../types';
import { sampleSchemaClasses } from '../../fixtures';

export class MockClassGenerationService implements IClassGenerationService {
  async generateClasses(
    requirements: RequirementsModel,
    onProgress?: ProgressCallback
  ): Promise<SchemaClass[]> {
    const steps = [
      { id: '1', label: 'Analyzing requirement layers & grain definitions', detail: 'Evaluating BR-001..BR-006 against master datasources' },
      { id: '2', label: 'Generating Master Reference Classes (AD, CA, AP, PWBill)', detail: 'Mapped Account Determination, Cost Allocation, and Budget models' },
      { id: '3', label: 'Synthesizing Ingestion & Calculation Classes (PrePaidReport_I, PrePaidReport_ItemCalculation)', detail: 'Established 6-decimal math operations & local currency conversions' },
      { id: '4', label: 'Formulating Multi-Segment Allocation Classes (PrePaidReportCostAllocation1, TCostAllocationValue, PrePaidReportCostAllocation)', detail: 'Configured GETGROUPFROMSCHEMA2 lookups and SUMFROMSCHEMA denominators' },
      { id: '5', label: 'Constructing Adjustment & Workflow Routing Classes (AdjustmentAc, PrePaidReportWF)', detail: 'Integrated GL active gating condition and approval triggers' },
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
      await new Promise((resolve) => setTimeout(resolve, 380));
      if (onProgress) {
        onProgress({
          id: steps[i].id,
          label: steps[i].label,
          detail: steps[i].detail,
          status: 'done',
        });
      }
    }

    // Return deep cloned dynamic classes
    return JSON.parse(JSON.stringify(sampleSchemaClasses));
  }
}
