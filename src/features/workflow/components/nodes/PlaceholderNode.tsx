import { Handle, Position } from '@xyflow/react';
import { CirclePlus, Zap } from 'lucide-react';
import { type ReactNode } from 'react';

import { NODE_HEIGHT, NODE_PADDING, NODE_WIDTH } from '@/features/workflow/constants/layout';
import type {
  ActionNode,
  PlaceholderNode as PlaceholderNodeType,
  TriggerNode,
} from '@/features/workflow/types';
import { cn } from '@/lib/utils';

import { useNodeDialog } from './NodeDialogContext';

/**
 * Props for PlaceholderNode component (React Flow custom node).
 */
export interface PlaceholderNodeProps {
  /** Node data from React Flow */
  data: {
    node: PlaceholderNodeType;
    /** Original trigger/action node for dialog context */
    originalNode: TriggerNode | ActionNode;
    step: number;
  };
}

const PLACEHOLDER_CONFIG = {
  trigger: {
    icon: Zap,
    badgeLabel: 'Trigger',
    description: 'Select the event that starts your workflow',
  },
  action: {
    icon: CirclePlus,
    badgeLabel: 'Action',
    description: 'Select the action for your workflow to run',
  },
} as const;

/**
 * Placeholder node for unconfigured trigger/action slots.
 * Displays a dashed border with badge indicating what type of node can be added.
 */
export function PlaceholderNode({ data }: PlaceholderNodeProps): ReactNode {
  const { node, originalNode, step } = data;
  const { openSelectionDialog } = useNodeDialog();
  const config = PLACEHOLDER_CONFIG[node.forType];
  const Icon = config.icon;

  const handleClick = (): void => {
    openSelectionDialog(originalNode);
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !border-0 !w-0 !h-0"
      />
      <div
        data-node-id={node.id}
        onClick={handleClick}
        className={cn(
          // Base styles
          'relative flex flex-col gap-1 rounded-lg bg-white cursor-pointer',
          // Dashed border for unconfigured state
          'border-2 border-dashed border-gray-300',
          // Transitions
          'transition-all duration-150 ease-in-out',
          // Hover states
          'hover:shadow-md hover:border-[#7297c5]',
          // Focus states for accessibility
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7297c5] focus-visible:ring-offset-2'
        )}
        style={{
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          padding: NODE_PADDING,
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium w-fit bg-gray-100 text-gray-600 border border-gray-200">
          <Icon className="h-3.5 w-3.5" />
          {config.badgeLabel}
        </span>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-1 pr-6">
          <span className="font-medium text-gray-900">{step}.</span> {config.description}
        </p>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent !border-0 !w-0 !h-0"
      />
    </>
  );
}
