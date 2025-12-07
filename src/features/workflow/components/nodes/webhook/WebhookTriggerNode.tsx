import { Webhook } from 'lucide-react';
import { type ReactNode } from 'react';

import type { TriggerNode as TriggerNodeType } from '@/features/workflow/types';

import { ConfiguredNode, NodeBadge, NodeDescription } from '../ConfiguredNode';

/**
 * Props for WebhookTriggerNode component (React Flow custom node).
 */
export interface WebhookTriggerNodeProps {
  /** Node data from React Flow */
  data: {
    node: TriggerNodeType;
    onClick?: () => void;
    onConfigure?: () => void;
    onDelete?: () => void;
    showDelete: boolean;
  };
}

/**
 * Get description text for webhook trigger.
 */
function getWebhookDescription(node: TriggerNodeType): string {
  if (node.name === 'webhook' && node.config && 'method' in node.config) {
    return `${node.config.method} request`;
  }
  return 'Configure webhook';
}

/**
 * Webhook trigger node - fires workflow when HTTP request is received.
 * Concrete implementation of trigger for name='webhook'.
 */
export function WebhookTriggerNode({ data }: WebhookTriggerNodeProps): ReactNode {
  const { node, onClick, onConfigure, onDelete, showDelete } = data;

  return (
    <ConfiguredNode
      id={node.id}
      onClick={onClick}
      onConfigure={onConfigure}
      onDelete={onDelete}
      showDelete={showDelete}
    >
      <NodeBadge>
        <Webhook className="h-3.5 w-3.5" />
        Webhook
      </NodeBadge>
      <NodeDescription step={1}>{getWebhookDescription(node)}</NodeDescription>
    </ConfiguredNode>
  );
}
