import type { z } from 'zod';

import type { conditionSchema, ifElseConfigSchema } from './definition';

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
 * If/Else action configuration with one condition per path.
 */
export interface IfElseConfig {
  /** Condition for Path A (true branch) */
  pathACondition: Condition;
  /** Condition for Path B (false branch) */
  pathBCondition: Condition;
}

export type ConditionInput = z.input<typeof conditionSchema>;
export type IfElseConfigInput = z.input<typeof ifElseConfigSchema>;
export type IfElseConfigOutput = z.output<typeof ifElseConfigSchema>;
