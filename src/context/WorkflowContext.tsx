'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  WorkflowStage,
  GenerationStatus,
  GenerationProgressStep,
  SupportingDocument,
  AdditionalInformation,
  BusinessInput,
  RequirementsModel,
  SchemaClass,
  SchemaModel,
  SchemaGenerationWorkflow,
  AssistantMessage,
  AssistantSuggestedAction,
  ProblemStatement,
  BusinessObjective,
  BusinessRequirement,
  FinanceRequirement,
  TechnicalRequirement,
  GenerationCost,
} from '../types';
import { sampleBusinessInput } from '../fixtures/sampleInput.fixture';
import { requirementsService, classService, schemaService, assistantService, pricingService } from '../services';

interface WorkflowContextValue {
  workflow: SchemaGenerationWorkflow;
  setStage: (stage: WorkflowStage) => void;
  updateBusinessInput: (updates: Partial<BusinessInput>) => void;
  loadSampleInput: () => void;
  addSupportingDocument: (doc: SupportingDocument) => void;
  removeSupportingDocument: (id: string) => void;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Generation cost
  generationCost: GenerationCost;

  // Generation methods
  generateBusinessRequirement: () => Promise<void>;
  generateRequirements: () => Promise<void>;
  generateClasses: () => Promise<void>;
  generateSchema: () => Promise<void>;
  isGeneratingModalOpen: boolean;
  closeGeneratingModal: () => void;

  // Requirements updates
  updateProblemStatement: (id: string, updated: Partial<ProblemStatement>) => void;
  updateBusinessObjective: (id: string, updated: Partial<BusinessObjective>) => void;
  updateBusinessRequirement: (id: string, updated: Partial<BusinessRequirement>) => void;
  updateFinanceRequirement: (id: string, updated: Partial<FinanceRequirement>) => void;
  updateTechnicalRequirement: (id: string, updated: Partial<TechnicalRequirement>) => void;
  addAdditionalInformation: (info: Omit<AdditionalInformation, 'id' | 'createdAt'>) => void;
  removeAdditionalInformation: (id: string) => void;

  // Classes updates
  updateClass: (id: string, updated: Partial<SchemaClass>) => void;
  addClass: (newClass: SchemaClass) => void;
  removeClass: (id: string) => void;

  // Schema updates
  editedSchemaJson: string;
  setEditedSchemaJson: (json: string) => void;
  saveSchemaChanges: () => { success: boolean; error?: string };
  downloadSchemaJson: () => void;
  copySchemaJson: () => Promise<boolean>;

  // Assistant Chat
  assistantMessages: AssistantMessage[];
  isAssistantThinking: boolean;
  sendAssistantMessage: (text: string) => Promise<void>;
  handleAssistantAction: (action: AssistantSuggestedAction) => void;
  clearAssistantChat: () => void;

  // Global reset
  resetWorkflow: () => void;
}

const initialWorkflow: SchemaGenerationWorkflow = {
  id: 'wf-current',
  title: 'Accounts Payable & Prepaid Expense Allocation',
  domain: 'Accounts Payable and Expense Allocation',
  stage: 'business-input',
  businessInput: {
    highLevelRequirement: '',
    generatedBusinessRequirement: '',
    isBusinessRequirementGenerated: false,
    supportingDocuments: [],
    additionalInstructions: '',
  },
  additionalInformation: [],
  generationStatus: 'idle',
  currentProgressSteps: [],
  updatedAt: new Date().toISOString(),
};

const initialGenerationCost: GenerationCost = {
  amount: 0,
  currency: 'INR',
  currencySymbol: '₹',
  formattedAmount: '—',
  isEstimate: true,
  source: 'DataTwin Standard Tier SCDP Pricing',
};

const WorkflowContext = createContext<WorkflowContextValue | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workflow, setWorkflow] = useState<SchemaGenerationWorkflow>(initialWorkflow);
  const [editedSchemaJson, setEditedSchemaJson] = useState<string>('');
  const [isGeneratingModalOpen, setIsGeneratingModalOpen] = useState<boolean>(false);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [generationCost, setGenerationCost] = useState<GenerationCost>(initialGenerationCost);

  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: 'Welcome to **DataTwin Schema Generator**. Enter your high-level business requirement on the left, or click **"Load Reference Sample"** to begin.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stageContext: 'business-input',
      suggestedActions: [
        { label: 'Load Prepaid Allocation Sample', actionType: 'insert-text' },
        { label: 'What is SCDP Schema?', actionType: 'explain-concept' }
      ]
    }
  ]);
  const [isAssistantThinking, setIsAssistantThinking] = useState<boolean>(false);

  // Initialize theme from localStorage, default to 'light'
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('datatwin_theme') as 'light' | 'dark' | null;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeState(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        setThemeState('light');
        document.documentElement.classList.remove('dark');
      }
    } catch {
      setThemeState('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('datatwin_theme', newTheme);
    } catch {}
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('datatwin_theme', nextTheme);
      } catch {}
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return nextTheme;
    });
  }, []);

  // Update generation cost from pricingService
  useEffect(() => {
    pricingService
      .getEstimatedCost({
        businessInput: workflow.businessInput,
        requirements: workflow.requirements,
        classes: workflow.classes,
        schema: workflow.schema,
      })
      .then((cost) => setGenerationCost(cost))
      .catch(() => {});
  }, [
    workflow.businessInput.isBusinessRequirementGenerated,
    workflow.businessInput.generatedBusinessRequirement,
    workflow.requirements,
    workflow.classes,
    workflow.schema,
  ]);

  const setStage = useCallback((stage: WorkflowStage) => {
    setWorkflow((prev) => ({ ...prev, stage, updatedAt: new Date().toISOString() }));
  }, []);

  const updateBusinessInput = useCallback((updates: Partial<BusinessInput>) => {
    setWorkflow((prev) => ({
      ...prev,
      businessInput: { ...prev.businessInput, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const loadSampleInput = useCallback(() => {
    setWorkflow((prev) => ({
      ...prev,
      businessInput: JSON.parse(JSON.stringify(sampleBusinessInput)),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const addSupportingDocument = useCallback((doc: SupportingDocument) => {
    setWorkflow((prev) => ({
      ...prev,
      businessInput: {
        ...prev.businessInput,
        supportingDocuments: [...prev.businessInput.supportingDocuments, doc],
      },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeSupportingDocument = useCallback((id: string) => {
    setWorkflow((prev) => ({
      ...prev,
      businessInput: {
        ...prev.businessInput,
        supportingDocuments: prev.businessInput.supportingDocuments.filter((d) => d.id !== id),
      },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Generation 1: High-Level Business Requirement -> Detailed Business Requirement
  const generateBusinessRequirement = useCallback(async () => {
    setIsGeneratingModalOpen(true);
    setWorkflow((prev) => ({
      ...prev,
      generationStatus: 'generating',
      currentProgressSteps: [],
    }));

    try {
      const generatedText = await requirementsService.generateBusinessRequirement(
        workflow.businessInput.highLevelRequirement,
        workflow.businessInput.supportingDocuments,
        (step: GenerationProgressStep) => {
          setWorkflow((prev) => {
            const existingIdx = prev.currentProgressSteps.findIndex((s) => s.id === step.id);
            const newSteps = [...prev.currentProgressSteps];
            if (existingIdx >= 0) {
              newSteps[existingIdx] = step;
            } else {
              newSteps.push(step);
            }
            return { ...prev, currentProgressSteps: newSteps };
          });
        }
      );

      setWorkflow((prev) => ({
        ...prev,
        businessInput: {
          ...prev.businessInput,
          generatedBusinessRequirement: generatedText,
          isBusinessRequirementGenerated: true,
        },
        generationStatus: 'completed',
        updatedAt: new Date().toISOString(),
      }));

      // Notify Assistant
      setAssistantMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          content: 'Business Requirement generated from your high-level input. Review and edit the document below, then click **"Generate Requirements"** to structure it into Problem Statements, Objectives, and Technical rules.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stageContext: 'business-input',
          suggestedActions: [
            { label: 'Generate Requirements', actionType: 'explain-concept' }
          ]
        }
      ]);
    } catch (err) {
      console.error(err);
      setWorkflow((prev) => ({ ...prev, generationStatus: 'error' }));
    } finally {
      setTimeout(() => setIsGeneratingModalOpen(false), 500);
    }
  }, [workflow.businessInput]);

  // Generation 2: Reviewed Business Requirement -> Structured Requirements
  const generateRequirements = useCallback(async () => {
    setIsGeneratingModalOpen(true);
    setWorkflow((prev) => ({
      ...prev,
      generationStatus: 'generating',
      currentProgressSteps: [],
    }));

    try {
      const result = await requirementsService.generateRequirements(
        workflow.businessInput,
        (step: GenerationProgressStep) => {
          setWorkflow((prev) => {
            const existingIdx = prev.currentProgressSteps.findIndex((s) => s.id === step.id);
            const newSteps = [...prev.currentProgressSteps];
            if (existingIdx >= 0) {
              newSteps[existingIdx] = step;
            } else {
              newSteps.push(step);
            }
            return { ...prev, currentProgressSteps: newSteps };
          });
        }
      );

      setWorkflow((prev) => ({
        ...prev,
        requirements: result,
        stage: 'requirements',
        generationStatus: 'completed',
        updatedAt: new Date().toISOString(),
      }));

      // Notify Assistant
      setAssistantMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          content: 'Structured Requirements derived with full traceability. Review Problem Statements, Business Objectives, Finance Rules, and Technical Architecture below.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stageContext: 'requirements',
          suggestedActions: [
            { label: 'Explain Traceability Matrix', actionType: 'explain-concept' },
            { label: 'Generate Schema Classes', actionType: 'jump-to-stage', payload: 'classes' }
          ]
        }
      ]);
    } catch (err) {
      console.error(err);
      setWorkflow((prev) => ({ ...prev, generationStatus: 'error' }));
    } finally {
      setTimeout(() => setIsGeneratingModalOpen(false), 500);
    }
  }, [workflow.businessInput]);

  // Generation 3: Classes
  const generateClasses = useCallback(async () => {
    if (!workflow.requirements) return;
    setIsGeneratingModalOpen(true);
    setWorkflow((prev) => ({
      ...prev,
      generationStatus: 'generating',
      currentProgressSteps: [],
    }));

    try {
      const result = await classService.generateClasses(
        workflow.requirements,
        (step: GenerationProgressStep) => {
          setWorkflow((prev) => {
            const existingIdx = prev.currentProgressSteps.findIndex((s) => s.id === step.id);
            const newSteps = [...prev.currentProgressSteps];
            if (existingIdx >= 0) {
              newSteps[existingIdx] = step;
            } else {
              newSteps.push(step);
            }
            return { ...prev, currentProgressSteps: newSteps };
          });
        }
      );

      setWorkflow((prev) => ({
        ...prev,
        classes: result,
        stage: 'classes',
        generationStatus: 'completed',
        updatedAt: new Date().toISOString(),
      }));

      // Notify Assistant
      setAssistantMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          content: `${result.length} Schema Classes generated. Inspect their grain, formulas, and dependencies below before building the final schema.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stageContext: 'classes',
          suggestedActions: [
            { label: 'Generate Full Schema Tree', actionType: 'jump-to-stage', payload: 'schema' }
          ]
        }
      ]);
    } catch (err) {
      console.error(err);
      setWorkflow((prev) => ({ ...prev, generationStatus: 'error' }));
    } finally {
      setTimeout(() => setIsGeneratingModalOpen(false), 500);
    }
  }, [workflow.requirements]);

  // Generation 4: Schema
  const generateSchema = useCallback(async () => {
    if (!workflow.requirements || !workflow.classes) return;
    setIsGeneratingModalOpen(true);
    setWorkflow((prev) => ({
      ...prev,
      generationStatus: 'generating',
      currentProgressSteps: [],
    }));

    try {
      const result = await schemaService.generateSchema(
        workflow.requirements,
        workflow.classes,
        (step: GenerationProgressStep) => {
          setWorkflow((prev) => {
            const existingIdx = prev.currentProgressSteps.findIndex((s) => s.id === step.id);
            const newSteps = [...prev.currentProgressSteps];
            if (existingIdx >= 0) {
              newSteps[existingIdx] = step;
            } else {
              newSteps.push(step);
            }
            return { ...prev, currentProgressSteps: newSteps };
          });
        }
      );

      setWorkflow((prev) => ({
        ...prev,
        schema: result,
        stage: 'schema',
        generationStatus: 'completed',
        updatedAt: new Date().toISOString(),
      }));
      setEditedSchemaJson(result.rawJson);

      // Notify Assistant
      setAssistantMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          content: `SCDP Schema Studio ready with ${result.stats.classCount} classes and ${result.stats.componentCount} components. You can edit the JSON directly on the right pane.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stageContext: 'schema',
          suggestedActions: [
            { label: 'Proceed to Final Output', actionType: 'jump-to-stage', payload: 'output' }
          ]
        }
      ]);
    } catch (err) {
      console.error(err);
      setWorkflow((prev) => ({ ...prev, generationStatus: 'error' }));
    } finally {
      setTimeout(() => setIsGeneratingModalOpen(false), 500);
    }
  }, [workflow.requirements, workflow.classes]);

  const closeGeneratingModal = useCallback(() => {
    setIsGeneratingModalOpen(false);
  }, []);

  // Requirements Update Handlers
  const updateProblemStatement = useCallback((id: string, updated: Partial<ProblemStatement>) => {
    setWorkflow((prev) => {
      if (!prev.requirements) return prev;
      return {
        ...prev,
        requirements: {
          ...prev.requirements,
          problemStatements: prev.requirements.problemStatements.map((item) =>
            item.id === id ? { ...item, ...updated, isAiGenerated: false } : item
          ),
          lastEditedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const updateBusinessObjective = useCallback((id: string, updated: Partial<BusinessObjective>) => {
    setWorkflow((prev) => {
      if (!prev.requirements) return prev;
      return {
        ...prev,
        requirements: {
          ...prev.requirements,
          businessObjectives: prev.requirements.businessObjectives.map((item) =>
            item.id === id ? { ...item, ...updated, isAiGenerated: false } : item
          ),
          lastEditedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const updateBusinessRequirement = useCallback((id: string, updated: Partial<BusinessRequirement>) => {
    setWorkflow((prev) => {
      if (!prev.requirements) return prev;
      return {
        ...prev,
        requirements: {
          ...prev.requirements,
          businessRequirements: prev.requirements.businessRequirements.map((item) =>
            item.id === id ? { ...item, ...updated, isAiGenerated: false } : item
          ),
          lastEditedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const updateFinanceRequirement = useCallback((id: string, updated: Partial<FinanceRequirement>) => {
    setWorkflow((prev) => {
      if (!prev.requirements) return prev;
      return {
        ...prev,
        requirements: {
          ...prev.requirements,
          financeRequirements: prev.requirements.financeRequirements.map((item) =>
            item.id === id ? { ...item, ...updated, isAiGenerated: false } : item
          ),
          lastEditedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const updateTechnicalRequirement = useCallback((id: string, updated: Partial<TechnicalRequirement>) => {
    setWorkflow((prev) => {
      if (!prev.requirements) return prev;
      return {
        ...prev,
        requirements: {
          ...prev.requirements,
          technicalRequirements: prev.requirements.technicalRequirements.map((item) =>
            item.id === id ? { ...item, ...updated, isAiGenerated: false } : item
          ),
          lastEditedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const addAdditionalInformation = useCallback((info: Omit<AdditionalInformation, 'id' | 'createdAt'>) => {
    const newEntry: AdditionalInformation = {
      ...info,
      id: `add-info-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setWorkflow((prev) => ({
      ...prev,
      additionalInformation: [...prev.additionalInformation, newEntry],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeAdditionalInformation = useCallback((id: string) => {
    setWorkflow((prev) => ({
      ...prev,
      additionalInformation: prev.additionalInformation.filter((item) => item.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Classes Update Handlers
  const updateClass = useCallback((id: string, updated: Partial<SchemaClass>) => {
    setWorkflow((prev) => {
      if (!prev.classes) return prev;
      return {
        ...prev,
        classes: prev.classes.map((cls) => (cls.id === id ? { ...cls, ...updated } : cls)),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const addClass = useCallback((newClass: SchemaClass) => {
    setWorkflow((prev) => ({
      ...prev,
      classes: [...(prev.classes || []), newClass],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeClass = useCallback((id: string) => {
    setWorkflow((prev) => {
      if (!prev.classes) return prev;
      return {
        ...prev,
        classes: prev.classes.filter((cls) => cls.id !== id),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  // Schema Save & Download Handlers
  const saveSchemaChanges = useCallback((): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(editedSchemaJson);
      setWorkflow((prev) => {
        if (!prev.schema) return prev;
        return {
          ...prev,
          schema: {
            ...prev.schema,
            root: parsed,
            rawJson: editedSchemaJson,
            generatedAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        };
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Invalid JSON format' };
    }
  }, [editedSchemaJson]);

  const downloadSchemaJson = useCallback(() => {
    const jsonString = editedSchemaJson || (workflow.schema ? workflow.schema.rawJson : JSON.stringify(workflow, null, 2));
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DataTwin-Schema-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [editedSchemaJson, workflow]);

  const copySchemaJson = useCallback(async (): Promise<boolean> => {
    try {
      const jsonString = editedSchemaJson || (workflow.schema ? workflow.schema.rawJson : '');
      await navigator.clipboard.writeText(jsonString);
      return true;
    } catch {
      return false;
    }
  }, [editedSchemaJson, workflow.schema]);

  // Assistant Chat Handlers
  const sendAssistantMessage = useCallback(async (text: string) => {
    const userMsg: AssistantMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stageContext: workflow.stage,
    };

    setAssistantMessages((prev) => [...prev, userMsg]);
    setIsAssistantThinking(true);

    try {
      const resp = await assistantService.respond(text, {
        stage: workflow.stage,
        requirements: workflow.requirements,
        classes: workflow.classes,
        schema: workflow.schema,
      });

      const assistantMsg: AssistantMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        content: resp.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stageContext: workflow.stage,
        suggestedActions: resp.suggestedActions,
      };

      setAssistantMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAssistantThinking(false);
    }
  }, [workflow]);

  const handleAssistantAction = useCallback((action: AssistantSuggestedAction) => {
    if (action.actionType === 'insert-text') {
      loadSampleInput();
    } else if (action.actionType === 'jump-to-stage' && action.payload) {
      setStage(action.payload as WorkflowStage);
    } else if (action.actionType === 'explain-concept' || action.actionType === 'refine-requirement') {
      sendAssistantMessage(action.label);
    }
  }, [loadSampleInput, setStage, sendAssistantMessage]);

  const clearAssistantChat = useCallback(() => {
    setAssistantMessages([]);
  }, []);

  const resetWorkflow = useCallback(() => {
    setWorkflow(initialWorkflow);
    setEditedSchemaJson('');
    setGenerationCost(initialGenerationCost);
    setAssistantMessages([
      {
        id: 'init-reset',
        sender: 'assistant',
        content: 'Workflow has been reset. You can start with a new requirement or load sample data.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stageContext: 'business-input',
        suggestedActions: [{ label: 'Load Reference Sample', actionType: 'insert-text' }],
      },
    ]);
  }, []);

  return (
    <WorkflowContext.Provider
      value={{
        workflow,
        setStage,
        updateBusinessInput,
        loadSampleInput,
        addSupportingDocument,
        removeSupportingDocument,
        theme,
        setTheme,
        toggleTheme,
        generationCost,
        generateBusinessRequirement,
        generateRequirements,
        generateClasses,
        generateSchema,
        isGeneratingModalOpen,
        closeGeneratingModal,
        updateProblemStatement,
        updateBusinessObjective,
        updateBusinessRequirement,
        updateFinanceRequirement,
        updateTechnicalRequirement,
        addAdditionalInformation,
        removeAdditionalInformation,
        updateClass,
        addClass,
        removeClass,
        editedSchemaJson,
        setEditedSchemaJson,
        saveSchemaChanges,
        downloadSchemaJson,
        copySchemaJson,
        assistantMessages,
        isAssistantThinking,
        sendAssistantMessage,
        handleAssistantAction,
        clearAssistantChat,
        resetWorkflow,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
