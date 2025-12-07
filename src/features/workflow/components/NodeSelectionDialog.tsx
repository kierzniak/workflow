'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import {
  getNodeCatalogByType,
  type ActionName,
  type NodeCatalogEntry,
  type TriggerName,
} from './nodes';

export interface NodeSelectionDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when open state changes (close requested) */
  onOpenChange: (open: boolean) => void;
  /** Filter catalog by node type */
  nodeType: 'trigger' | 'action';
  /** Called when user selects a node */
  onSelect: (name: TriggerName | ActionName) => void;
}

/**
 * Dialog for selecting a concrete node type from the catalog.
 * Filters entries by trigger or action based on nodeType prop.
 *
 * @example
 * <NodeSelectionDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   nodeType="action"
 *   onSelect={(name) => console.log('Selected:', name)}
 * />
 */
export function NodeSelectionDialog({
  open,
  onOpenChange,
  nodeType,
  onSelect,
}: NodeSelectionDialogProps): React.ReactElement {
  const entries = getNodeCatalogByType(nodeType);
  const title = nodeType === 'trigger' ? 'Select Trigger' : 'Select Action';
  const description =
    nodeType === 'trigger'
      ? 'Choose how your workflow will be triggered'
      : 'Choose an action to perform';

  const handleSelect = (entry: NodeCatalogEntry): void => {
    // Safe cast: entries come from NODE_CATALOG which derives from NODE_DEFINITIONS
    onSelect(entry.name as TriggerName | ActionName);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          {entries.map((entry) => (
            <NodeSelectionItem
              key={entry.name}
              entry={entry}
              onSelect={() => handleSelect(entry)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface NodeSelectionItemProps {
  entry: NodeCatalogEntry;
  onSelect: () => void;
}

function NodeSelectionItem({ entry, onSelect }: NodeSelectionItemProps): React.ReactElement {
  const Icon = entry.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex items-start gap-3 rounded-lg border p-3 text-left transition-colors',
        'hover:bg-accent hover:border-accent-foreground/20',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
        <Icon className="size-5 text-primary" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{entry.label}</span>
        <span className="text-sm text-muted-foreground">{entry.description}</span>
      </div>
    </button>
  );
}
