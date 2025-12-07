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

// Node types registry (React Flow)
export { nodeTypes } from './node-types';

// Components
export {
  // Placeholder (unconfigured nodes)
  PlaceholderNode as PlaceholderNodeComponent,
  // Configured node base
  ConfiguredNode,
  NodeBadge,
  NodeDescription,
  // Trigger nodes
  ScheduleTriggerNode,
  // Action nodes
  SendEmailActionNode,
  IfElseActionNode,
  // Helper nodes
  PlusNode as PlusNodeComponent,
} from './components';
export type {
  // Placeholder props
  PlaceholderNodeProps,
  // Configured node props
  ConfiguredNodeProps,
  NodeBadgeProps,
  NodeDescriptionProps,
  // Trigger node props
  ScheduleTriggerNodeProps,
  // Action node props
  SendEmailActionNodeProps,
  IfElseActionNodeProps,
  // Helper node props
  PlusNodeProps,
} from './components';
