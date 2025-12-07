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
export { Node, NodeBadge, NodeDescription } from './Node';
export type { NodeProps, NodeBadgeProps, NodeDescriptionProps } from './Node';
export { PlaceholderNode } from './PlaceholderNode';
export type { PlaceholderNodeProps } from './PlaceholderNode';
export { PlusNode } from './PlusNode';
export type { PlusNodeProps } from './PlusNode';

// Node dialogs and context
export { NodeDialogProvider, useNodeDialog } from './NodeDialogContext';
export { NodeContextMenu } from './NodeContextMenu';
export type { NodeContextMenuProps } from './NodeContextMenu';
export { NodeConfigurationDialog } from './NodeConfigurationDialog';
export type { NodeConfigurationDialogProps, ConfigurableNode } from './NodeConfigurationDialog';
export { NodeDeleteDialog } from './NodeDeleteDialog';
export type { NodeDeleteDialogProps } from './NodeDeleteDialog';
export { NodeSelectionDialog } from './NodeSelectionDialog';
export type { NodeSelectionDialogProps } from './NodeSelectionDialog';

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
