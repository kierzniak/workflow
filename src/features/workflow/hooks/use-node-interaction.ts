'use client';

import { useCallback, useRef } from 'react';

import { useDialog } from '@/hooks';

import type { TriggerNode, ActionNode, WorkflowNode } from '@/features/workflow/types';

/** Dialog types for node interaction */
type NodeDialogType = 'node-selection' | 'node-configuration' | 'delete-confirmation';

/** Data passed to node dialogs */
interface NodeDialogData {
  /** The node being interacted with */
  node: TriggerNode | ActionNode;
  /** Type for selection dialog filtering */
  nodeType: 'trigger' | 'action';
}

export interface UseNodeInteractionReturn {
  /** Currently open dialog type */
  dialogType: NodeDialogType | null;
  /** Data for current dialog */
  dialogData: NodeDialogData | null;
  /** Handle node click - determines which dialog to open */
  handleNodeClick: (node: WorkflowNode) => void;
  /** Handle plus node click - opens selection dialog for the new action node */
  handlePlusNodeClick: (actionNode: ActionNode) => void;
  /** Handle delete click - opens delete confirmation dialog */
  handleDeleteClick: (node: TriggerNode | ActionNode) => void;
  /** Close current dialog (safe to call during transitions) */
  closeDialog: () => void;
  /** Open configuration dialog for a node */
  openConfigDialog: (node: TriggerNode | ActionNode) => void;
}

/**
 * Hook to manage node interaction state.
 * Determines whether to show selection or configuration dialog.
 * Handles transitions between dialogs safely.
 */
export function useNodeInteraction(): UseNodeInteractionReturn {
  const {
    dialogType,
    dialogData,
    openDialog,
    closeDialog: rawCloseDialog,
  } = useDialog<NodeDialogType, NodeDialogData>();

  // Track transitions to prevent Radix onOpenChange from closing during switch
  const isTransitioningRef = useRef(false);

  const handleNodeClick = useCallback(
    (node: WorkflowNode) => {
      if (node.type !== 'trigger' && node.type !== 'action') {
        return;
      }

      const nodeType = node.type === 'trigger' ? 'trigger' : 'action';

      if (node.name === null) {
        openDialog('node-selection', { node, nodeType });
      } else {
        openDialog('node-configuration', { node, nodeType });
      }
    },
    [openDialog]
  );

  /**
   * Handle plus node click - opens selection dialog for the new action node.
   * Called after insertActionAfterPlus creates the new action node.
   */
  const handlePlusNodeClick = useCallback(
    (actionNode: ActionNode) => {
      openDialog('node-selection', {
        node: actionNode,
        nodeType: 'action',
      });
    },
    [openDialog]
  );

  const openConfigDialog = useCallback(
    (node: TriggerNode | ActionNode) => {
      const nodeType = node.type === 'trigger' ? 'trigger' : 'action';
      isTransitioningRef.current = true;
      openDialog('node-configuration', { node, nodeType });
      // Reset after React processes the state update
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 0);
    },
    [openDialog]
  );

  /**
   * Handle delete click - opens delete confirmation dialog.
   */
  const handleDeleteClick = useCallback(
    (node: TriggerNode | ActionNode) => {
      const nodeType = node.type === 'trigger' ? 'trigger' : 'action';
      openDialog('delete-confirmation', { node, nodeType });
    },
    [openDialog]
  );

  // Safe close that won't interfere with dialog transitions
  const closeDialog = useCallback(() => {
    if (!isTransitioningRef.current) {
      rawCloseDialog();
    }
  }, [rawCloseDialog]);

  return {
    dialogType,
    dialogData,
    handleNodeClick,
    handlePlusNodeClick,
    handleDeleteClick,
    closeDialog,
    openConfigDialog,
  };
}
