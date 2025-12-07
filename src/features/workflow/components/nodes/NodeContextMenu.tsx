'use client';

import { Settings, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Props for NodeContextMenu component.
 */
export interface NodeContextMenuProps {
  /** Trigger element (menu button) */
  children: ReactNode;
  /** Called when Configure is clicked */
  onConfigure?: () => void;
  /** Called when Delete is clicked */
  onDelete?: () => void;
  /** Whether to show delete option (false for trigger nodes) */
  showDelete?: boolean;
}

/**
 * Context menu for workflow nodes.
 * Provides Configure and Delete actions.
 * Delete option is hidden for trigger nodes.
 */
export function NodeContextMenu({
  children,
  onConfigure,
  onDelete,
  showDelete = true,
}: NodeContextMenuProps): ReactNode {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4}>
        <DropdownMenuItem onClick={onConfigure}>
          <Settings className="h-4 w-4" />
          Configure
        </DropdownMenuItem>
        {showDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
