import { Handle, Position } from '@xyflow/react';
import { Plus } from 'lucide-react';
import { type ReactNode } from 'react';

import { PLUS_NODE_SIZE } from '@/features/workflow/constants/layout';
import { useWorkflow } from '@/features/workflow/context';
import type { PlusNode as PlusNodeType } from '@/features/workflow/types';
import { cn } from '@/lib/utils';

import { useNodeDialog } from './NodeDialogContext';

/**
 * Props for PlusNode component (React Flow custom node).
 */
export interface PlusNodeProps {
  /** Node data from React Flow */
  data: {
    node: PlusNodeType;
  };
}

/**
 * Plus helper node - insertion point for adding new nodes.
 * Displayed between nodes on the edge line.
 */
export function PlusNode({ data }: PlusNodeProps): ReactNode {
  const { node } = data;
  const { insertActionAfterPlus } = useWorkflow();
  const { openSelectionDialog } = useNodeDialog();

  const handleClick = (): void => {
    const newActionNode = insertActionAfterPlus(node.id);
    openSelectionDialog(newActionNode);
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !border-0 !w-0 !h-0"
      />
      <button
        type="button"
        data-node-id={node.id}
        onClick={handleClick}
        className={cn(
          // Base styles
          'flex items-center justify-center rounded-full',
          'bg-white border-2 border-[#7297c5]',
          'text-[#7297c5] cursor-pointer',
          // Transitions
          'transition-all duration-150 ease-in-out',
          // Hover states
          'hover:scale-110 hover:bg-[#7297c5] hover:text-white hover:shadow-md',
          // Focus states for accessibility
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7297c5] focus-visible:ring-offset-2'
        )}
        style={{
          width: PLUS_NODE_SIZE,
          height: PLUS_NODE_SIZE,
        }}
        aria-label="Add new node"
      >
        <Plus className="h-4 w-4" />
      </button>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent !border-0 !w-0 !h-0"
      />
    </>
  );
}
