import { MessageSquare } from 'lucide-react';
import { type ReactNode } from 'react';

import type { ActionNode as ActionNodeType } from '@/features/workflow/types';

import { ConfiguredNode, NodeBadge, NodeDescription } from '../ConfiguredNode';

/**
 * Props for SendSmsActionNode component (React Flow custom node).
 */
export interface SendSmsActionNodeProps {
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
 * Get description text for send SMS action.
 */
function getSendSmsDescription(node: ActionNodeType): string {
  if (node.name === 'send-sms' && node.config && 'phoneNumber' in node.config) {
    return `Send to ${node.config.phoneNumber}`;
  }
  return 'Configure SMS';
}

/**
 * Send SMS action node - sends an SMS when workflow executes.
 * Concrete implementation of action for name='send-sms'.
 */
export function SendSmsActionNode({ data }: SendSmsActionNodeProps): ReactNode {
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
        <MessageSquare className="h-3.5 w-3.5" />
        Send SMS
      </NodeBadge>
      <NodeDescription step={step}>{getSendSmsDescription(node)}</NodeDescription>
    </ConfiguredNode>
  );
}
