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
// Node Name (concrete implementations)
// =============================================================================

/**
 * Concrete trigger implementations.
 * Triggers start workflow execution based on events/schedules.
 */
export type TriggerName = 'schedule';

/**
 * Concrete action implementations.
 * Actions perform operations within the workflow.
 */
export type ActionName = 'send-email' | 'if-else';

/**
 * All concrete node names.
 * A node with name=null is unconfigured; name set = configured.
 */
export type NodeName = TriggerName | ActionName;

// =============================================================================
// Configuration Types (per concrete node)
// =============================================================================

/**
 * Schedule trigger configuration.
 */
export interface ScheduleConfig {
  /** How often the trigger fires */
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  /** Time of day in HH:mm format (24-hour) */
  timeOfDay: string;
  /** IANA timezone identifier (e.g., "America/New_York") */
  timezone: string;
  /** Day of week for weekly frequency (1=Monday, 7=Sunday, ISO 8601) */
  dayOfWeek?: number;
}

/**
 * Send email action configuration.
 */
export interface SendEmailConfig {
  /** Recipient email address */
  to: string;
  /** Email subject line */
  subject: string;
  /** Email body content */
  body: string;
  /** Sender display name (optional) */
  fromName?: string;
}

/**
 * Comparison operators for if-else conditions.
 */
export type ComparisonOperator =
  | 'equals'
  | 'not-equals'
  | 'greater-than'
  | 'less-than'
  | 'contains'
  | 'not-contains';

/**
 * Supported value types for condition comparisons.
 */
export type ConditionValue = string | number | boolean;

/**
 * Single condition in an if-else branch.
 */
export interface Condition {
  /** Unique identifier for this condition */
  id: string;
  /** ID of the node providing the source value */
  sourceNodeId: string;
  /** Field/property name from the source node */
  sourceField: string;
  /** Comparison operator */
  operator: ComparisonOperator;
  /** Value to compare against */
  value: ConditionValue;
}

/**
 * Group of conditions for a branch (AND logic).
 */
export interface ConditionGroup {
  conditions: Condition[];
}

/**
 * If/Else action configuration with two condition groups.
 */
export interface IfElseConfig {
  /** Conditions for Path A (evaluated with AND logic) */
  pathAConditions: ConditionGroup;
  /** Conditions for Path B (evaluated with AND logic) */
  pathBConditions: ConditionGroup;
}

/**
 * Union of all node configurations.
 */
export type NodeConfig = ScheduleConfig | SendEmailConfig | IfElseConfig;

// =============================================================================
// Type Guards
// =============================================================================

/**
 * Check if a name is a trigger name.
 */
export function isTriggerName(name: NodeName): name is TriggerName {
  return name === 'schedule';
}

/**
 * Check if a name is an action name.
 */
export function isActionName(name: NodeName): name is ActionName {
  return name === 'send-email' || name === 'if-else';
}

/**
 * Check if config is ScheduleConfig.
 */
export function isScheduleConfig(config: NodeConfig): config is ScheduleConfig {
  return 'frequency' in config && 'timeOfDay' in config;
}

/**
 * Check if config is SendEmailConfig.
 */
export function isSendEmailConfig(config: NodeConfig): config is SendEmailConfig {
  return 'to' in config && 'subject' in config && 'body' in config;
}

/**
 * Check if config is IfElseConfig.
 */
export function isIfElseConfig(config: NodeConfig): config is IfElseConfig {
  return 'pathAConditions' in config && 'pathBConditions' in config;
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
  config?: ScheduleConfig;
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
  config?: SendEmailConfig | IfElseConfig;
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
