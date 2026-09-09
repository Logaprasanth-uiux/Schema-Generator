import { 
  IRequirementsGenerationService, 
  IClassGenerationService, 
  ISchemaGenerationService, 
  IAssistantService,
  IPricingService,
  IAuthService,
  IHistoryService
} from './interfaces';
import { MockRequirementsGenerationService } from './mock/MockRequirementsGenerationService';
import { MockClassGenerationService } from './mock/MockClassGenerationService';
import { MockSchemaGenerationService } from './mock/MockSchemaGenerationService';
import { MockAssistantService } from './mock/MockAssistantService';
import { MockPricingService } from './mock/MockPricingService';
import { MockAuthService } from './mock/MockAuthService';
import { MockHistoryService } from './mock/MockHistoryService';

export * from './interfaces';
export * from './mock/MockRequirementsGenerationService';
export * from './mock/MockClassGenerationService';
export * from './mock/MockSchemaGenerationService';
export * from './mock/MockAssistantService';
export * from './mock/MockPricingService';
export * from './mock/MockAuthService';
export * from './mock/MockHistoryService';

// Service factory / registry allowing replacement with Real AI / Backend Services in future
export const requirementsService: IRequirementsGenerationService = new MockRequirementsGenerationService();
export const classService: IClassGenerationService = new MockClassGenerationService();
export const schemaService: ISchemaGenerationService = new MockSchemaGenerationService();
export const assistantService: IAssistantService = new MockAssistantService();
export const pricingService: IPricingService = new MockPricingService();
export const authService: IAuthService = new MockAuthService();
export const historyService: IHistoryService = new MockHistoryService();

