'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { getNodeCatalogEntry } from './nodes';
import type { ActionNode, TriggerNode } from '@/features/workflow/types';

/** Node types that can be configured */
export type ConfigurableNode = TriggerNode | ActionNode;

export interface NodeConfigurationDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when open state changes (close requested) */
  onOpenChange: (open: boolean) => void;
  /** The node being configured */
  node: ConfigurableNode;
  /** Form ID to trigger submit on Save click */
  formId: string;
  /** Form content rendered as children */
  children?: React.ReactNode;
}

/**
 * Dialog shell for node configuration.
 * Renders header with node info and footer with Save/Cancel buttons.
 * Save button triggers form submission via form ID.
 *
 * @example
 * <NodeConfigurationDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   node={selectedNode}
 *   formId="schedule-config-form"
 * >
 *   <ScheduleConfigForm formId="schedule-config-form" onSubmit={handleSave} />
 * </NodeConfigurationDialog>
 */
export function NodeConfigurationDialog({
  open,
  onOpenChange,
  node,
  formId,
  children,
}: NodeConfigurationDialogProps): React.ReactElement {
  const catalogEntry = node.name ? getNodeCatalogEntry(node.name) : null;

  const title = catalogEntry?.label ?? 'Configure Node';
  const description = catalogEntry?.description ?? 'Set up this node';
  const Icon = catalogEntry?.icon;

  const handleCancel = (): void => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
            )}
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          {children ?? (
            <p className="text-sm text-muted-foreground">Configuration form will appear here.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" form={formId}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
