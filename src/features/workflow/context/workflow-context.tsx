'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';

import { useWorkflowState } from '@/features/workflow/hooks';
import type { UseWorkflowStateReturn } from '@/features/workflow/hooks';
import { createInitialWorkflow } from '@/features/workflow/utils';

// =============================================================================
// Context
// =============================================================================

const WorkflowContext = createContext<UseWorkflowStateReturn | null>(null);

// =============================================================================
// Provider
// =============================================================================

interface WorkflowProviderProps {
  children: ReactNode;
}

/**
 * Provider component that initializes and manages workflow state.
 * Automatically creates initial workflow on mount.
 */
export function WorkflowProvider({ children }: WorkflowProviderProps): ReactNode {
  const workflowState = useWorkflowState();

  // Initialize workflow on mount
  useEffect(() => {
    const initialWorkflow = createInitialWorkflow();
    workflowState.initializeWorkflow(initialWorkflow);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <WorkflowContext.Provider value={workflowState}>{children}</WorkflowContext.Provider>;
}

// =============================================================================
// Consumer Hook
// =============================================================================

/**
 * Hook to access workflow context.
 * Must be used within a WorkflowProvider.
 *
 * @throws Error if used outside WorkflowProvider
 */
export function useWorkflow(): UseWorkflowStateReturn {
  const context = useContext(WorkflowContext);

  if (context === null) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }

  return context;
}
