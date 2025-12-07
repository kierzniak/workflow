import { GitBranch } from 'lucide-react';
import { type ReactNode } from 'react';

import type { ActionNode as ActionNodeType } from '@/features/workflow/types';

import { ConfiguredNode, NodeBadge, NodeDescription } from './ConfiguredNode';

/**
 * Props for IfElseActionNode component (React Flow custom node).
 */
export interface IfElseActionNodeProps {
  /** Node data from React Flow */
  data: {
    node: ActionNodeType;
    step: number;
    onClick?: () => void;
    onMenuClick?: () => void;
  };
}

/**
 * Get description text for if/else action.
 */
function getIfElseDescription(node: ActionNodeType): string {
  if (node.name === 'if-else' && node.config && 'pathAConditions' in node.config) {
    const conditionCount =
      node.config.pathAConditions.conditions.length + node.config.pathBConditions.conditions.length;
    return `${conditionCount} condition${conditionCount !== 1 ? 's' : ''} configured`;
  }
  return 'Configure conditions';
}

/**
 * If/Else action node - branches workflow based on conditions.
 * Concrete implementation of action for name='if-else'.
 */
export function IfElseActionNode({ data }: IfElseActionNodeProps): ReactNode {
  const { node, step, onClick, onMenuClick } = data;

  return (
    <ConfiguredNode id={node.id} onClick={onClick} onMenuClick={onMenuClick}>
      <NodeBadge>
        <GitBranch className="h-3.5 w-3.5" />
        If/Else
      </NodeBadge>
      <NodeDescription step={step}>{getIfElseDescription(node)}</NodeDescription>
    </ConfiguredNode>
  );
}
