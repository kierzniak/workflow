import { Handle, Position } from '@xyflow/react';
import { MoreVertical } from 'lucide-react';
import { type ReactNode } from 'react';

import { NODE_HEIGHT, NODE_PADDING, NODE_WIDTH } from '@/features/workflow/constants/layout';
import { cn } from '@/lib/utils';

import { NodeContextMenu } from '../NodeContextMenu';

/**
 * Props for the ConfiguredNode component.
 */
export interface ConfiguredNodeProps {
  /** Unique node identifier */
  id: string;
  /** Click handler for the node body */
  onClick?: () => void;
  /** Called when Configure menu item is clicked */
  onConfigure?: () => void;
  /** Called when Delete menu item is clicked */
  onDelete?: () => void;
  /** Whether to show delete option (false for trigger nodes) */
  showDelete?: boolean;
  /** Content to render inside the node */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Base component for configured nodes (Schedule, SendEmail, IfElse, etc.).
 * Provides consistent styling with solid border and menu button.
 *
 * @example
 * ```tsx
 * <ConfiguredNode id="node-1" onClick={handleClick} onMenuClick={handleMenu}>
 *   <NodeBadge><Calendar /> Schedule</NodeBadge>
 *   <NodeDescription step={1}>Every Day at 9:00 AM</NodeDescription>
 * </ConfiguredNode>
 * ```
 */
export function ConfiguredNode({
  id,
  onClick,
  onConfigure,
  onDelete,
  showDelete = true,
  children,
  className,
}: ConfiguredNodeProps): ReactNode {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !border-0 !w-0 !h-0"
      />
      <div
        data-node-id={id}
        onClick={onClick}
        className={cn(
          // Base styles
          'relative flex flex-col gap-1 rounded-lg bg-white cursor-pointer',
          // Solid border for configured state
          'border border-solid border-gray-200 shadow-sm',
          // Transitions
          'transition-all duration-150 ease-in-out',
          // Hover states
          'hover:shadow-md hover:border-[#7297c5]',
          // Focus states for accessibility
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7297c5] focus-visible:ring-offset-2',
          className
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
            onClick?.();
          }
        }}
      >
        {/* Context Menu */}
        <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
          <NodeContextMenu onConfigure={onConfigure} onDelete={onDelete} showDelete={showDelete}>
            <button
              type="button"
              className={cn(
                'p-1 rounded',
                'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7297c5]'
              )}
              aria-label="Node menu"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </NodeContextMenu>
        </div>

        {children}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent !border-0 !w-0 !h-0"
      />
    </>
  );
}

/**
 * Props for NodeBadge component.
 */
export interface NodeBadgeProps {
  /** Badge content (icon + label) */
  children: ReactNode;
}

/**
 * Badge for configured nodes displaying node type.
 * Always uses the brand color (#7297c5).
 */
export function NodeBadge({ children }: NodeBadgeProps): ReactNode {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium w-fit bg-[#7297c5]/10 text-[#7297c5] border border-[#7297c5]/30">
      {children}
    </span>
  );
}

/**
 * Props for NodeDescription component.
 */
export interface NodeDescriptionProps {
  /** Step number (e.g., 1, 2) */
  step: number;
  /** Description text */
  children: ReactNode;
}

/**
 * Description component for configured nodes showing step number and description.
 */
export function NodeDescription({ step, children }: NodeDescriptionProps): ReactNode {
  return (
    <p className="text-sm text-gray-600 mt-1 pr-6">
      <span className="font-medium text-gray-900">{step}.</span> {children}
    </p>
  );
}
