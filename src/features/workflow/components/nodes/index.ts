// Registry - main entry point for node system
export {
  NODE_CATALOG,
  NODE_DEFINITIONS,
  getNodeCatalogByType,
  getNodeCatalogEntry,
  getNodeDefinition,
  isActionName,
  isTriggerName,
  nodeTypes,
} from './registry';
export type { ActionName, NodeName, TriggerName } from './registry';

// Node definition types
export type { ConfigFormProps, IconComponent, NodeCatalogEntry, NodeDefinition } from './types';

// Shared components
export { ConfiguredNode, NodeBadge, NodeDescription } from './ConfiguredNode';
export type { ConfiguredNodeProps, NodeBadgeProps, NodeDescriptionProps } from './ConfiguredNode';
export { PlaceholderNode } from './PlaceholderNode';
export type { PlaceholderNodeProps } from './PlaceholderNode';
export { PlusNode } from './PlusNode';
export type { PlusNodeProps } from './PlusNode';

// Schedule node
export {
  ScheduleConfigForm,
  scheduleConfigSchema,
  scheduleDefinition,
  ScheduleTriggerNode,
} from './schedule';
export type {
  ScheduleConfig,
  ScheduleConfigFormProps,
  ScheduleConfigInput,
  ScheduleConfigOutput,
  ScheduleTriggerNodeProps,
} from './schedule';

// Send Email node
export {
  SendEmailActionNode,
  SendEmailConfigForm,
  sendEmailConfigSchema,
  sendEmailDefinition,
} from './send-email';
export type {
  SendEmailActionNodeProps,
  SendEmailConfig,
  SendEmailConfigFormProps,
  SendEmailConfigInput,
  SendEmailConfigOutput,
} from './send-email';

// If/Else node
export {
  comparisonOperatorSchema,
  conditionSchema,
  conditionValueSchema,
  IfElseActionNode,
  IfElseConfigForm,
  ifElseConfigSchema,
  ifElseDefinition,
} from './if-else';
export type {
  ComparisonOperator,
  Condition,
  ConditionInput,
  ConditionValue,
  IfElseActionNodeProps,
  IfElseConfig,
  IfElseConfigFormProps,
  IfElseConfigInput,
  IfElseConfigOutput,
} from './if-else';
