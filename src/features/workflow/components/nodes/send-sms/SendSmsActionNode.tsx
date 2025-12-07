import { MessageSquare } from 'lucide-react';
import { type ReactNode } from 'react';

import type { ActionNode as ActionNodeType } from '@/features/workflow/types';

import { Node, NodeBadge, NodeDescription } from '../Node';
import { useNodeDialog } from '../NodeDialogContext';

/**
 * Props for SendSmsActionNode component (React Flow custom node).
 */
export interface SendSmsActionNodeProps {
  /** Node data from React Flow */
  data: {
    node: ActionNodeType;
    step: number;
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
        <MessageSquare className="h-3.5 w-3.5" />
        Send SMS
      </NodeBadge>
      <NodeDescription step={step}>{getSendSmsDescription(node)}</NodeDescription>
    </Node>
  );
}
