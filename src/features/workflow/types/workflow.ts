// =============================================================================
// Node Type (structural role in workflow)
// =============================================================================

/**
 * Structural role of a node in the workflow graph.
 * - trigger: Starting point of workflow (exactly one per workflow)
 * - action: Performs operations (including if-else branching)
 * - plus: Helper node for inserting new nodes
 * - placeholder: Temporary node during node selection
 */
export type NodeType = 'trigger' | 'action' | 'plus' | 'placeholder';

// =============================================================================
// Re-export types from node definitions
// =============================================================================

// Node name types - derived from registry
export type { ActionName, NodeName, TriggerName } from '../components/nodes/registry';
export { isActionName, isTriggerName } from '../components/nodes/registry';

// Configuration types - from individual node modules
export type { ScheduleConfig } from '../components/nodes/schedule';
export type { WebhookConfig } from '../components/nodes/webhook';
export type { SendEmailConfig } from '../components/nodes/send-email';
export type { SendSmsConfig } from '../components/nodes/send-sms';
export type {
  ComparisonOperator,
  Condition,
  ConditionValue,
  IfElseConfig,
} from '../components/nodes/if-else';

// Import for local use
import type { ScheduleConfig } from '../components/nodes/schedule';
import type { WebhookConfig } from '../components/nodes/webhook';
import type { SendEmailConfig } from '../components/nodes/send-email';
import type { SendSmsConfig } from '../components/nodes/send-sms';
import type { IfElseConfig } from '../components/nodes/if-else';
import type { ActionName, TriggerName } from '../components/nodes/registry';

/**
 * Union of all node configurations.
 */
export type NodeConfig =
  | ScheduleConfig
  | WebhookConfig
  | SendEmailConfig
  | SendSmsConfig
  | IfElseConfig;

// =============================================================================
// Config Type Guards
// =============================================================================

/**
 * Check if config is ScheduleConfig.
 */
export function isScheduleConfig(config: NodeConfig): config is ScheduleConfig {
  return 'frequency' in config && 'timeOfDay' in config;
}

/**
 * Check if config is WebhookConfig.
 */
export function isWebhookConfig(config: NodeConfig): config is WebhookConfig {
  return 'method' in config && !('phoneNumber' in config);
}

/**
 * Check if config is SendEmailConfig.
 */
export function isSendEmailConfig(config: NodeConfig): config is SendEmailConfig {
  return 'to' in config && 'subject' in config && 'body' in config;
}

/**
 * Check if config is SendSmsConfig.
 */
export function isSendSmsConfig(config: NodeConfig): config is SendSmsConfig {
  return 'phoneNumber' in config && 'message' in config;
}

/**
 * Check if config is IfElseConfig.
 */
export function isIfElseConfig(config: NodeConfig): config is IfElseConfig {
  return 'pathACondition' in config && 'pathBCondition' in config;
}

// =============================================================================
// Node Position
// =============================================================================

/**
 * Position coordinates for a node on the canvas.
 */
export interface NodePosition {
  x: number;
  y: number;
}

// =============================================================================
// Node Data Structures
// =============================================================================

/**
 * Base properties shared by all workflow nodes.
 */
interface BaseNode {
  /** Unique identifier for the node */
  id: string;
  /** Position on the canvas */
  position: NodePosition;
  /** Branch this node belongs to (undefined = main flow) */
  branchId?: string;
}

/**
 * Trigger node - starts the workflow (exactly one per workflow).
 * name=null means unconfigured, name='schedule' means configured.
 */
export interface TriggerNode extends BaseNode {
  type: 'trigger';
  /** Concrete trigger implementation (null = unconfigured) */
  name: TriggerName | null;
  /** Configuration for the selected trigger type */
  config?: ScheduleConfig | WebhookConfig;
}

/**
 * Action node - performs operations in the workflow.
 * name=null means unconfigured, name set means configured.
 */
export interface ActionNode extends BaseNode {
  type: 'action';
  /** Concrete action implementation (null = unconfigured) */
  name: ActionName | null;
  /** Configuration for the selected action type */
  config?: SendEmailConfig | SendSmsConfig | IfElseConfig;
}

/**
 * Plus helper node - insertion point for adding new nodes.
 */
export interface PlusNode extends BaseNode {
  type: 'plus';
}

/**
 * Placeholder node - temporary node shown during node selection.
 */
export interface PlaceholderNode extends BaseNode {
  type: 'placeholder';
  /** What type of node this placeholder will become */
  forType: 'trigger' | 'action';
}

/**
 * Union of all workflow node types.
 * Discriminated by the `type` field.
 */
export type WorkflowNode = TriggerNode | ActionNode | PlusNode | PlaceholderNode;

// =============================================================================
// Node Type Guards
// =============================================================================

/**
 * Check if a node is a TriggerNode.
 */
export function isTriggerNode(node: WorkflowNode): node is TriggerNode {
  return node.type === 'trigger';
}

/**
 * Check if a node is an ActionNode.
 */
export function isActionNode(node: WorkflowNode): node is ActionNode {
  return node.type === 'action';
}

/**
 * Check if a node is a PlusNode.
 */
export function isPlusNode(node: WorkflowNode): node is PlusNode {
  return node.type === 'plus';
}

/**
 * Check if a node is a PlaceholderNode.
 */
export function isPlaceholderNode(node: WorkflowNode): node is PlaceholderNode {
  return node.type === 'placeholder';
}

/**
 * Check if a node is configured (has a concrete name set).
 * Only applies to Trigger and Action nodes.
 */
export function isNodeConfigured(node: TriggerNode | ActionNode): boolean {
  return node.name !== null;
}

// =============================================================================
// Edge Types
// =============================================================================

/**
 * Edge connecting two nodes in the workflow.
 */
export interface WorkflowEdge {
  /** Unique identifier for the edge */
  id: string;
  /** ID of the source node */
  source: string;
  /** ID of the target node */
  target: string;
}

// =============================================================================
// Workflow Types
// =============================================================================

/**
 * Complete workflow structure.
 */
export interface Workflow {
  /** Unique identifier for the workflow */
  id: string;
  /** All nodes in the workflow, keyed by node ID */
  nodes: Map<string, WorkflowNode>;
  /** All edges connecting nodes */
  edges: WorkflowEdge[];
}

// =============================================================================
// ID Factory Functions
// =============================================================================

/**
 * Generate a unique node ID.
 */
export function createNodeId(): string {
  return `node_${crypto.randomUUID()}`;
}

/**
 * Generate a unique edge ID.
 */
export function createEdgeId(): string {
  return `edge_${crypto.randomUUID()}`;
}

/**
 * Generate a unique workflow ID.
 */
export function createWorkflowId(): string {
  return `workflow_${crypto.randomUUID()}`;
}
