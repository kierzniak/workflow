import { Mail } from 'lucide-react';
import { type ReactNode } from 'react';

import type { ActionNode as ActionNodeType } from '@/features/workflow/types';

import { ConfiguredNode, NodeBadge, NodeDescription } from '../ConfiguredNode';

/**
 * Props for SendEmailActionNode component (React Flow custom node).
 */
export interface SendEmailActionNodeProps {
  /** Node data from React Flow */
  data: {
    node: ActionNodeType;
    step: number;
    onClick?: () => void;
    onConfigure?: () => void;
    onDelete?: () => void;
    showDelete: boolean;
  };
}

/**
 * Get description text for send email action.
 */
function getSendEmailDescription(node: ActionNodeType): string {
  if (node.name === 'send-email' && node.config && 'to' in node.config) {
    return `Send to ${node.config.to}`;
  }
  return 'Configure email';
}

/**
 * Send Email action node - sends an email when workflow executes.
 * Concrete implementation of action for name='send-email'.
 */
export function SendEmailActionNode({ data }: SendEmailActionNodeProps): ReactNode {
  const { node, step, onClick, onConfigure, onDelete, showDelete } = data;

  return (
    <ConfiguredNode
      id={node.id}
      onClick={onClick}
      onConfigure={onConfigure}
      onDelete={onDelete}
      showDelete={showDelete}
    >
      <NodeBadge>
        <Mail className="h-3.5 w-3.5" />
        Send Email
      </NodeBadge>
      <NodeDescription step={step}>{getSendEmailDescription(node)}</NodeDescription>
    </ConfiguredNode>
  );
}
