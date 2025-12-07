/**
 * Workflow feature module.
 *
 * This module will contain:
 * - Workflow state management
 * - Node components (Trigger, Action, Plus, Placeholder)
 * - Configuration modals
 * - Validation schemas
 */

// Types - from types/workflow.ts
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
export {
  createInitialWorkflow,
  calculateNodePositions,
  workflowToCanvasNodes,
  workflowToCanvasEdges,
} from './utils';
export type { NodePositionMap, WorkflowCanvasNodeData } from './utils';

// Constants
export {
  NODE_WIDTH,
  NODE_HEIGHT,
  NODE_PADDING,
  PLUS_NODE_SIZE,
  VERTICAL_SPACING,
  BRANCH_HORIZONTAL_SPACING,
  CANVAS_CENTER_X,
  CANVAS_START_Y,
} from './constants/layout';

// Context
export { WorkflowProvider, useWorkflow } from './context';

// Components
export { WorkflowCanvas } from './components';

// Node system - from nodes/
export {
  // Registry
  NODE_CATALOG,
  NODE_DEFINITIONS,
  getNodeCatalogByType,
  getNodeCatalogEntry,
  getNodeDefinition,
  nodeTypes,
  // Shared components
  ConfiguredNode,
  NodeBadge,
  NodeDescription,
  PlaceholderNode as PlaceholderNodeComponent,
  PlusNode as PlusNodeComponent,
  // Schedule node
  ScheduleConfigForm,
  scheduleConfigSchema,
  scheduleDefinition,
  ScheduleTriggerNode,
  // Send email node
  SendEmailActionNode,
  SendEmailConfigForm,
  sendEmailConfigSchema,
  sendEmailDefinition,
  // If/else node
  IfElseActionNode,
  IfElseConfigForm,
  ifElseConfigSchema,
  ifElseDefinition,
} from './components/nodes';

export type {
  // Node definition types
  ConfigFormProps,
  IconComponent,
  NodeCatalogEntry,
  NodeDefinition,
  // Shared component props
  ConfiguredNodeProps,
  NodeBadgeProps,
  NodeDescriptionProps,
  PlaceholderNodeProps,
  PlusNodeProps,
  // Schedule node types
  ScheduleConfigFormProps,
  ScheduleConfigInput,
  ScheduleConfigOutput,
  ScheduleTriggerNodeProps,
  // Send email node types
  SendEmailActionNodeProps,
  SendEmailConfigFormProps,
  SendEmailConfigInput,
  SendEmailConfigOutput,
  // If/else node types
  ConditionInput,
  IfElseActionNodeProps,
  IfElseConfigFormProps,
  IfElseConfigInput,
  IfElseConfigOutput,
} from './components/nodes';
