import { GitBranch } from 'lucide-react';
import { type ReactNode } from 'react';

import type { ActionNode as ActionNodeType } from '@/features/workflow/types';

import { Node, NodeBadge, NodeDescription } from '../Node';
import { useNodeDialog } from '../NodeDialogContext';

/**
 * Props for IfElseActionNode component (React Flow custom node).
 */
export interface IfElseActionNodeProps {
  /** Node data from React Flow */
  data: {
    node: ActionNodeType;
    step: number;
    showDelete: boolean;
  };
}

/** Human-readable operator labels */
const OPERATOR_LABELS: Record<string, string> = {
  equals: '=',
  'not-equals': '≠',
  'greater-than': '>',
  'less-than': '<',
  contains: 'contains',
  'not-contains': '!contains',
};

/**
 * Get description text for if/else action.
 * Displays condition on one line: "Field operator value"
 */
function getIfElseDescription(node: ActionNodeType): string {
  if (node.name === 'if-else' && node.config && 'pathACondition' in node.config) {
    const { pathACondition } = node.config;
    const operator = OPERATOR_LABELS[pathACondition.operator] ?? pathACondition.operator;
    return `${pathACondition.sourceField} ${operator} ${pathACondition.value}`;
  }
  return 'Configure conditions';
}

/**
 * If/Else action node - branches workflow based on conditions.
 * Concrete implementation of action for name='if-else'.
 */
export function IfElseActionNode({ data }: IfElseActionNodeProps): ReactNode {
  const { node, step, showDelete } = data;
  const { handleNodeClick, openConfigDialog, openDeleteDialog } = useNodeDialog();

  return (
    <Node
      id={node.id}
      onClick={() => handleNodeClick(node)}
      onConfigure={() => openConfigDialog(node)}
      onDelete={() => openDeleteDialog(node)}
      showDelete={showDelete}
    >
      <NodeBadge>
        <GitBranch className="h-3.5 w-3.5" />
        If/Else
      </NodeBadge>
      <NodeDescription step={step}>{getIfElseDescription(node)}</NodeDescription>
    </Node>
  );
}
