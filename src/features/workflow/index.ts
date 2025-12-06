/**
 * Workflow feature module.
 *
 * This module will contain:
 * - Workflow state management
 * - Node components (Trigger, Action, Plus, Placeholder)
 * - Configuration modals
 * - Validation schemas
 */

// Types
export type {
  // Core types
  NodeType,
  TriggerName,
  ActionName,
  NodeName,
  // Configuration types
  ScheduleConfig,
  SendEmailConfig,
  ComparisonOperator,
  ConditionValue,
  Condition,
  ConditionGroup,
  IfElseConfig,
  NodeConfig,
  // Node data structures
  NodePosition,
  TriggerNode,
  ActionNode,
  PlusNode,
  PlaceholderNode,
  WorkflowNode,
  // Edge and Workflow types
  WorkflowEdge,
  Workflow,
} from './types';

export {
  // Name type guards
  isTriggerName,
  isActionName,
  // Config type guards
  isScheduleConfig,
  isSendEmailConfig,
  isIfElseConfig,
  // Node type guards
  isTriggerNode,
  isActionNode,
  isPlusNode,
  isPlaceholderNode,
  isNodeConfigured,
  // ID factory functions
  createNodeId,
  createEdgeId,
  createWorkflowId,
} from './types';

// Hooks
export { useWorkflowState } from './hooks';
export type { UseWorkflowStateReturn } from './hooks';

// Utils
export { createInitialWorkflow } from './utils';

// Context
export { WorkflowProvider, useWorkflow } from './context';
