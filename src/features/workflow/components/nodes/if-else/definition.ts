import { GitBranch } from 'lucide-react';
import { z } from 'zod';

import type { NodeDefinition } from '../types';

import { IfElseConfigForm } from './IfElseConfigForm';
import { IfElseActionNode } from './IfElseActionNode';
import type { IfElseConfig } from './types';

/**
 * Schema for comparison operators.
 */
export const comparisonOperatorSchema = z.enum([
  'equals',
  'not-equals',
  'greater-than',
  'less-than',
  'contains',
  'not-contains',
]);

/**
 * Schema for condition values (string, number, or boolean).
 */
export const conditionValueSchema = z.union([z.string(), z.number(), z.boolean()]);

/**
 * Schema for a single condition.
 */
export const conditionSchema = z.object({
  sourceNodeId: z.string().min(1, 'Please select a source node'),
  sourceField: z.string().min(1, 'Please select a field'),
  operator: comparisonOperatorSchema,
  value: conditionValueSchema,
});

/**
 * Schema for if-else action configuration.
 * One condition per path (Path A = true branch, Path B = false branch).
 */
export const ifElseConfigSchema = z.object({
  pathACondition: conditionSchema,
  pathBCondition: conditionSchema,
});

/**
 * If/Else action node definition.
 */
export const ifElseDefinition: NodeDefinition<'if-else', IfElseConfig> = {
  name: 'if-else',
  type: 'action',
  label: 'If/Else',
  description: 'Branch workflow based on conditions',
  icon: GitBranch,
  schema: ifElseConfigSchema,
  component: IfElseActionNode,
  configForm: IfElseConfigForm,
};
