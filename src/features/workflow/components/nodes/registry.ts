import type { NodeTypes } from '@xyflow/react';

import { ifElseDefinition } from './if-else';
import { scheduleDefinition } from './schedule';
import { sendEmailDefinition } from './send-email';
import { sendSmsDefinition } from './send-sms';
import { webhookDefinition } from './webhook';
import { PlaceholderNode } from './PlaceholderNode';
import { PlusNode } from './PlusNode';
import type { NodeCatalogEntry } from './types';

/**
 * All registered node definitions.
 * To add a new node: import its definition and add to this array.
 */
export const NODE_DEFINITIONS = [
  scheduleDefinition,
  webhookDefinition,
  sendEmailDefinition,
  sendSmsDefinition,
  ifElseDefinition,
] as const;

/**
 * Type for all node names derived from definitions.
 */
export type NodeName = (typeof NODE_DEFINITIONS)[number]['name'];

/**
 * Type for trigger node names only.
 */
export type TriggerName = Extract<(typeof NODE_DEFINITIONS)[number], { type: 'trigger' }>['name'];

/**
 * Type for action node names only.
 */
export type ActionName = Extract<(typeof NODE_DEFINITIONS)[number], { type: 'action' }>['name'];

/**
 * Node catalog for selection UI.
 * Derived from NODE_DEFINITIONS with only UI-relevant fields.
 */
export const NODE_CATALOG: NodeCatalogEntry[] = NODE_DEFINITIONS.map((d) => ({
  name: d.name,
  type: d.type,
  label: d.label,
  description: d.description,
  icon: d.icon,
}));

/**
 * React Flow node types registry.
 * Maps node type strings to their React components.
 *
 * Naming convention:
 * - `placeholder` - unconfigured trigger/action slots
 * - `plus` - helper insertion node
 * - `{name}-trigger` - configured trigger nodes (e.g., schedule-trigger)
 * - `{name}-action` - configured action nodes (e.g., send-email-action)
 */
export const nodeTypes: NodeTypes = {
  // Shared/helper nodes
  placeholder: PlaceholderNode,
  plus: PlusNode,
  // Dynamically registered from definitions
  ...Object.fromEntries(NODE_DEFINITIONS.map((d) => [`${d.name}-${d.type}`, d.component])),
};

/**
 * Get catalog entries filtered by node type.
 *
 * @param type - 'trigger' or 'action'
 * @returns Array of matching catalog entries
 */
export function getNodeCatalogByType(type: 'trigger' | 'action'): NodeCatalogEntry[] {
  return NODE_CATALOG.filter((entry) => entry.type === type);
}

/**
 * Get a single catalog entry by name.
 *
 * @param name - The node name to look up
 * @returns The catalog entry or undefined if not found
 */
export function getNodeCatalogEntry(name: string): NodeCatalogEntry | undefined {
  return NODE_CATALOG.find((entry) => entry.name === name);
}

/**
 * Get a node definition by name.
 *
 * @param name - The node name to look up
 * @returns The node definition or undefined if not found
 */
export function getNodeDefinition(name: string): (typeof NODE_DEFINITIONS)[number] | undefined {
  return NODE_DEFINITIONS.find((d) => d.name === name);
}

/**
 * Check if a name is a trigger name.
 */
export function isTriggerName(name: string): name is TriggerName {
  const def = getNodeDefinition(name);
  return def?.type === 'trigger';
}

/**
 * Check if a name is an action name.
 */
export function isActionName(name: string): name is ActionName {
  const def = getNodeDefinition(name);
  return def?.type === 'action';
}
