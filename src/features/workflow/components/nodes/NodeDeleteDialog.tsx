'use client';

import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * Props for NodeDeleteDialog component.
 */
export interface NodeDeleteDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Label of node being deleted (e.g., "Send Email") */
  nodeLabel: string;
  /** Called when user confirms deletion */
  onConfirm: () => void;
}

/**
 * Confirmation dialog for node deletion.
 * Displays warning and requires explicit confirmation.
 */
export function NodeDeleteDialog({
  open,
  onOpenChange,
  nodeLabel,
  onConfirm,
}: NodeDeleteDialogProps): ReactNode {
  const handleConfirm = (): void => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete {nodeLabel}?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. The node and its configuration will be permanently
                removed.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
