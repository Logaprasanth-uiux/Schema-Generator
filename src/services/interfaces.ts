import {
  BusinessInput,
  RequirementsModel,
  SchemaClass,
  SchemaModel,
  GenerationProgressStep,
  AssistantContext,
  AssistantResponse,
  GenerationCost,
  SupportingDocument,
  User,
  HistoryRecord,
} from '../types';

export interface ProgressCallback {
  (step: GenerationProgressStep): void;
}

export interface IRequirementsGenerationService {
  generateBusinessRequirement(
    highLevelInput: string,
    supportingDocs: SupportingDocument[],
    onProgress?: ProgressCallback
  ): Promise<string>;

  generateRequirements(
    input: BusinessInput,
    onProgress?: ProgressCallback
  ): Promise<RequirementsModel>;
}

export interface IClassGenerationService {
  generateClasses(
    requirements: RequirementsModel,
    onProgress?: ProgressCallback
  ): Promise<SchemaClass[]>;
}

export interface ISchemaGenerationService {
  generateSchema(
    requirements: RequirementsModel,
    classes: SchemaClass[],
    onProgress?: ProgressCallback
  ): Promise<SchemaModel>;
}

export interface IAssistantService {
  respond(
    message: string,
    context: AssistantContext
  ): Promise<AssistantResponse>;
}

export interface IPricingService {
  getEstimatedCost(context?: {
    businessInput?: BusinessInput;
    requirements?: RequirementsModel;
    classes?: SchemaClass[];
    schema?: SchemaModel;
  }): Promise<GenerationCost>;
}

export interface IAuthService {
  login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  isAuthenticated(): Promise<boolean>;
}

export interface IHistoryService {
  listSchemas(): Promise<HistoryRecord[]>;
  getSchema(id: string): Promise<HistoryRecord | null>;
  saveSchema(record: HistoryRecord): Promise<HistoryRecord>;
  createVersion(id: string, newVersion: string): Promise<HistoryRecord>;
  deleteSchema(id: string): Promise<boolean>;
}

