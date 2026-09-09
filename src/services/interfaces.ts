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
