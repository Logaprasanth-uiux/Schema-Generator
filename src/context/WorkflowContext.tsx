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
  HistoryRecord,
} from '../types';
import { sampleBusinessInput } from '../fixtures/sampleInput.fixture';
import { requirementsService, classService, schemaService, assistantService, pricingService, historyService } from '../services';

interface WorkflowContextValue {
  workflow: SchemaGenerationWorkflow;
  setStage: (stage: WorkflowStage) => void;
  updateBusinessInput: (updates: Partial<BusinessInput>) => void;
  loadSampleInput: () => void;
  addSupportingDocument: (doc: SupportingDocument) => void;
  removeSupportingDocument: (id: string) => void;
  
  // App View Navigation
  activeView: 'generator' | 'history';
  setActiveView: (view: 'generator' | 'history') => void;

  // History & Edit Mode
  currentHistoryRecord: HistoryRecord | null;
  isEditMode: boolean;
  loadHistorySchema: (record: HistoryRecord) => void;
  startNewSchema: () => void;
  saveToHistory: () => Promise<HistoryRecord>;

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

  // Assistant Chat (User-Initiated Only)
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

  // App Navigation & History Edit State
  const [activeView, setActiveView] = useState<'generator' | 'history'>('generator');
  const [currentHistoryRecord, setCurrentHistoryRecord] = useState<HistoryRecord | null>(null);

  // Assistant Messages — Starts empty, responded ONLY upon explicit user interaction
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([]);
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

  // Update generation cost dynamically from pricingService
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

  // History & Edit Mode Handlers
  const loadHistorySchema = useCallback((record: HistoryRecord) => {
    const loadedState = JSON.parse(JSON.stringify(record.workflowState)) as SchemaGenerationWorkflow;
    setWorkflow(loadedState);
    if (loadedState.schema) {
      setEditedSchemaJson(loadedState.schema.rawJson);
    } else {
      setEditedSchemaJson('');
    }
    setCurrentHistoryRecord(record);
    setActiveView('generator');
  }, []);

  const startNewSchema = useCallback(() => {
    setWorkflow(initialWorkflow);
    setEditedSchemaJson('');
    setCurrentHistoryRecord(null);
    setGenerationCost(initialGenerationCost);
    setActiveView('generator');
  }, []);

  const saveToHistory = useCallback(async (): Promise<HistoryRecord> => {
    const record: HistoryRecord = {
      id: currentHistoryRecord ? currentHistoryRecord.id : `hist-${Date.now()}`,
      name: workflow.title || 'Untitled SCDP Schema',
      domain: workflow.domain || 'Financial Operations',
      description: workflow.businessInput.highLevelRequirement || 'Custom generated SCDP schema.',
      status: workflow.stage === 'output' ? 'Completed' : 'Draft',
      version: currentHistoryRecord ? currentHistoryRecord.version : 'v1.0',
      classCount: workflow.classes?.length || 0,
      componentCount: workflow.schema?.stats.componentCount || 0,
      createdAt: currentHistoryRecord ? currentHistoryRecord.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      workflowState: workflow,
    };

    const saved = await historyService.saveSchema(record);
    setCurrentHistoryRecord(saved);
    return saved;
  }, [workflow, currentHistoryRecord]);

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
        const updatedWorkflow = {
          ...prev,
          schema: {
            ...prev.schema,
            root: parsed,
            rawJson: editedSchemaJson,
            generatedAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        };
        // If in edit mode, sync to history record
        if (currentHistoryRecord) {
          historyService.saveSchema({
            ...currentHistoryRecord,
            workflowState: updatedWorkflow,
            updatedAt: new Date().toISOString(),
          }).catch(() => {});
        }
        return updatedWorkflow;
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Invalid JSON format' };
    }
  }, [editedSchemaJson, currentHistoryRecord]);

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

  // Assistant Chat Handlers (User-Initiated Only)
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
    setCurrentHistoryRecord(null);
    setGenerationCost(initialGenerationCost);
    // Do NOT insert automatic assistant messages on reset!
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
        activeView,
        setActiveView,
        currentHistoryRecord,
        isEditMode: !!currentHistoryRecord,
        loadHistorySchema,
        startNewSchema,
        saveToHistory,
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
