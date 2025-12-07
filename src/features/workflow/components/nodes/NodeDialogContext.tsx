'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';

import { useWorkflow } from '@/features/workflow/context';
import type {
  ActionName,
  ActionNode,
  NodeConfig,
  TriggerName,
  TriggerNode,
} from '@/features/workflow/types';

import { getNodeCatalogEntry, getNodeDefinition } from './registry';
import { NodeConfigurationDialog } from './NodeConfigurationDialog';
import { NodeDeleteDialog } from './NodeDeleteDialog';
import { NodeSelectionDialog } from './NodeSelectionDialog';

// =============================================================================
// Types
// =============================================================================

/** Dialog types for node interaction */
type NodeDialogType = 'node-selection' | 'node-configuration' | 'delete-confirmation';

/** Data passed to node dialogs */
interface NodeDialogData {
  /** The node being interacted with */
  node: TriggerNode | ActionNode;
  /** Type for selection dialog filtering */
  nodeType: 'trigger' | 'action';
}

interface NodeDialogContextValue {
  /** Open selection dialog for a node */
  openSelectionDialog: (node: TriggerNode | ActionNode) => void;
  /** Open configuration dialog for a node */
  openConfigDialog: (node: TriggerNode | ActionNode) => void;
  /** Open delete confirmation dialog for a node */
  openDeleteDialog: (node: TriggerNode | ActionNode) => void;
  /** Handle node click - determines which dialog to open */
  handleNodeClick: (node: TriggerNode | ActionNode) => void;
}

// =============================================================================
// Context
// =============================================================================

const NodeDialogContext = createContext<NodeDialogContextValue | null>(null);

// =============================================================================
// Provider
// =============================================================================

const CONFIG_FORM_ID = 'node-config-form';

interface NodeDialogProviderProps {
  children: ReactNode;
}

/**
 * Provider that manages all node dialog state internally.
 * Renders dialogs at the provider level.
 */
export function NodeDialogProvider({ children }: NodeDialogProviderProps): ReactNode {
  const { updateNode, deleteNode, createIfElseChildren } = useWorkflow();

  // Dialog state
  const [dialogType, setDialogType] = useState<NodeDialogType | null>(null);
  const [dialogData, setDialogData] = useState<NodeDialogData | null>(null);

  // Track transitions to prevent Radix onOpenChange from closing during switch
  const isTransitioningRef = useRef(false);

  // ==========================================================================
  // Dialog open/close
  // ==========================================================================

  const openDialog = useCallback((type: NodeDialogType, data: NodeDialogData) => {
    setDialogType(type);
    setDialogData(data);
  }, []);

  const closeDialog = useCallback(() => {
    if (!isTransitioningRef.current) {
      setDialogType(null);
      setDialogData(null);
    }
  }, []);

  // ==========================================================================
  // Public API
  // ==========================================================================

  const openSelectionDialog = useCallback(
    (node: TriggerNode | ActionNode) => {
      const nodeType = node.type === 'trigger' ? 'trigger' : 'action';
      openDialog('node-selection', { node, nodeType });
    },
    [openDialog]
  );

  const openConfigDialog = useCallback(
    (node: TriggerNode | ActionNode) => {
      const nodeType = node.type === 'trigger' ? 'trigger' : 'action';
      isTransitioningRef.current = true;
      openDialog('node-configuration', { node, nodeType });
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 0);
    },
    [openDialog]
  );

  const openDeleteDialog = useCallback(
    (node: TriggerNode | ActionNode) => {
      const nodeType = node.type === 'trigger' ? 'trigger' : 'action';
      openDialog('delete-confirmation', { node, nodeType });
    },
    [openDialog]
  );

  const handleNodeClick = useCallback(
    (node: TriggerNode | ActionNode) => {
      if (node.name === null) {
        openSelectionDialog(node);
      } else {
        openConfigDialog(node);
      }
    },
    [openSelectionDialog, openConfigDialog]
  );

  // ==========================================================================
  // Dialog handlers
  // ==========================================================================

  const getNodeLabel = (): string => {
    if (!dialogData?.node?.name) return 'Node';
    return getNodeCatalogEntry(dialogData.node.name)?.label ?? 'Node';
  };

  const handleNodeSelect = (name: string): void => {
    if (!dialogData?.node) return;

    const { node, nodeType } = dialogData;

    // Update node with selected name
    if (nodeType === 'trigger') {
      updateNode(node.id, { name: name as TriggerName });
    } else {
      updateNode(node.id, { name: name as ActionName });

      // Special handling for if-else: create child nodes
      if (name === 'if-else') {
        createIfElseChildren(node.id);
      }
    }

    // Open config dialog directly (replaces selection dialog)
    if (node.type === 'trigger') {
      openConfigDialog({ ...node, name: name as TriggerName });
    } else if (node.type === 'action') {
      openConfigDialog({ ...node, name: name as ActionName });
    }
  };

  const handleConfigSave = (config: NodeConfig): void => {
    if (!dialogData?.node) return;
    updateNode(dialogData.node.id, { config } as Partial<typeof dialogData.node>);
    closeDialog();
    toast.success('Configuration saved');
  };

  const handleConfirmDelete = (): void => {
    if (!dialogData?.node) return;
    const label = getNodeLabel();
    deleteNode(dialogData.node.id);
    closeDialog();
    toast.success(`${label} deleted`);
  };

  const renderConfigForm = (): React.ReactNode => {
    const node = dialogData?.node;
    if (!node?.name) return null;

    const definition = getNodeDefinition(node.name);
    if (!definition) return null;

    const FormComponent = definition.configForm;
    return (
      <FormComponent
        formId={CONFIG_FORM_ID}
        defaultValues={node.config}
        onSubmit={handleConfigSave}
      />
    );
  };

  // ==========================================================================
  // Render
  // ==========================================================================

  const contextValue: NodeDialogContextValue = {
    openSelectionDialog,
    openConfigDialog,
    openDeleteDialog,
    handleNodeClick,
  };

  return (
    <NodeDialogContext.Provider value={contextValue}>
      {children}

      {/* Node Selection Dialog */}
      <NodeSelectionDialog
        open={dialogType === 'node-selection'}
        onOpenChange={(open) => !open && closeDialog()}
        nodeType={dialogData?.nodeType ?? 'trigger'}
        onSelect={handleNodeSelect}
      />

      {/* Node Configuration Dialog */}
      {dialogData?.node && (
        <NodeConfigurationDialog
          open={dialogType === 'node-configuration' && !!dialogData.node.name}
          onOpenChange={(open) => !open && closeDialog()}
          node={dialogData.node}
          formId={CONFIG_FORM_ID}
        >
          {renderConfigForm()}
        </NodeConfigurationDialog>
      )}

      {/* Node Delete Dialog */}
      <NodeDeleteDialog
        open={dialogType === 'delete-confirmation'}
        onOpenChange={(open) => !open && closeDialog()}
        nodeLabel={getNodeLabel()}
        onConfirm={handleConfirmDelete}
      />
    </NodeDialogContext.Provider>
  );
}

// =============================================================================
// Consumer Hook
// =============================================================================

/**
 * Hook to access node dialog context.
 * Must be used within a NodeDialogProvider.
 */
export function useNodeDialog(): NodeDialogContextValue {
  const context = useContext(NodeDialogContext);

  if (context === null) {
    throw new Error('useNodeDialog must be used within a NodeDialogProvider');
  }

  return context;
}
