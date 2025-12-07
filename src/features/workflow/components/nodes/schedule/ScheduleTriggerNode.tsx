import { Calendar } from 'lucide-react';
import { type ReactNode } from 'react';

import type { TriggerNode as TriggerNodeType } from '@/features/workflow/types';

import { ConfiguredNode, NodeBadge, NodeDescription } from '../ConfiguredNode';

/**
 * Props for ScheduleTriggerNode component (React Flow custom node).
 */
export interface ScheduleTriggerNodeProps {
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
 * Frequency display labels.
 */
const FREQUENCY_LABELS: Record<string, string> = {
  hourly: 'Every Hour',
  daily: 'Every Day',
  weekly: 'Every Week',
  monthly: 'Every Month',
};

/**
 * Get description text for schedule trigger.
 */
function getScheduleDescription(node: TriggerNodeType): string {
  if (node.name === 'schedule' && node.config && 'frequency' in node.config) {
    return FREQUENCY_LABELS[node.config.frequency] ?? 'Scheduled';
  }
  return 'Configure schedule';
}

/**
 * Schedule trigger node - fires workflow on a time-based schedule.
 * Concrete implementation of trigger for name='schedule'.
 */
export function ScheduleTriggerNode({ data }: ScheduleTriggerNodeProps): ReactNode {
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
        <Calendar className="h-3.5 w-3.5" />
        Schedule
      </NodeBadge>
      <NodeDescription step={1}>{getScheduleDescription(node)}</NodeDescription>
    </ConfiguredNode>
  );
}
