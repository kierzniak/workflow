import type { NodeTypes } from '@xyflow/react';

import {
  IfElseActionNode,
  PlaceholderNode,
  PlusNode,
  ScheduleTriggerNode,
  SendEmailActionNode,
} from './components/nodes';

/**
 * React Flow node type registry.
 * Maps node type strings to their React components.
 *
 * Naming convention:
 * - `placeholder` - unconfigured trigger/action slots
 * - `plus` - helper insertion node
 * - `{name}-trigger` - configured trigger nodes (e.g., schedule-trigger)
 * - `{name}-action` - configured action nodes (e.g., send-email-action)
 */
export const nodeTypes: NodeTypes = {
  // Unconfigured nodes
  placeholder: PlaceholderNode,
  // Helper nodes
  plus: PlusNode,
  // Configured trigger nodes
  'schedule-trigger': ScheduleTriggerNode,
  // Configured action nodes
  'send-email-action': SendEmailActionNode,
  'if-else-action': IfElseActionNode,
};
