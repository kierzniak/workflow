'use client';

import { toast } from 'sonner';

import { Canvas } from '@/components/canvas';

import { useWorkflow } from '@/features/workflow/context';
import { useNodeInteraction } from '@/features/workflow/hooks';
import { getNodeDefinition, nodeTypes } from './nodes';
import type { ActionName, NodeConfig, TriggerName } from '@/features/workflow/types';
import { workflowToCanvasEdges, workflowToCanvasNodes } from '@/features/workflow/utils';

import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { NodeConfigurationDialog } from './NodeConfigurationDialog';
import { NodeSelectionDialog } from './NodeSelectionDialog';
import { getNodeCatalogEntry } from './nodes';

const CONFIG_FORM_ID = 'node-config-form';

/**
 * Canvas wrapper that connects workflow state to Canvas component.
 * Manages node click interactions and dialog state.
 */
export function WorkflowCanvas(): React.ReactElement {
  const { workflow, updateNode, deleteNode, insertActionAfterPlus, createIfElseChildren } =
    useWorkflow();
  const {
    dialogType,
    dialogData,
    handleNodeClick,
    handlePlusNodeClick,
    handleDeleteClick,
    closeDialog,
    openConfigDialog,
  } = useNodeInteraction();

  // Handle plus node click - insert new action after the plus (keep plus)
  const onPlusClick = (nodeId: string): void => {
    const node = workflow.nodes.get(nodeId);
    if (!node || node.type !== 'plus') return;

    // Insert new action + plus after the clicked plus (keeps the plus node)
    const newActionNode = insertActionAfterPlus(nodeId);
    handlePlusNodeClick(newActionNode);
  };

  // Handle menu configure - opens config dialog for node
  const handleMenuConfigure = (nodeId: string): void => {
    const node = workflow.nodes.get(nodeId);
    if (node && (node.type === 'trigger' || node.type === 'action')) {
      handleNodeClick(node);
    }
  };

  // Handle menu delete - opens confirmation dialog
  const handleMenuDelete = (nodeId: string): void => {
    const node = workflow.nodes.get(nodeId);
    if (node && (node.type === 'trigger' || node.type === 'action') && node.name) {
      handleDeleteClick(node);
    }
  };

  // Handle confirmed deletion
  const handleConfirmDelete = (): void => {
    if (!dialogData?.node) return;
    const label = getDeleteNodeLabel();
    deleteNode(dialogData.node.id);
    closeDialog();
    toast.success(`${label} deleted`);
  };

  // Get node label for delete dialog
  const getDeleteNodeLabel = (): string => {
    if (!dialogData?.node?.name) return 'Node';
    return getNodeCatalogEntry(dialogData.node.name)?.label ?? 'Node';
  };

  // Transform nodes with click handlers (positions recalculated from graph structure)
  const nodes = workflowToCanvasNodes(
    workflow.nodes,
    {
      onClick: (nodeId) => {
        const node = workflow.nodes.get(nodeId);
        if (node) handleNodeClick(node);
      },
      onConfigure: handleMenuConfigure,
      onDelete: handleMenuDelete,
      onPlusClick,
    },
    workflow
  );
  const edges = workflowToCanvasEdges(workflow.edges);

  // Handle node type selection
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
    // Note: We create the updated node since state update is async
    if (node.type === 'trigger') {
      openConfigDialog({ ...node, name: name as TriggerName });
    } else if (node.type === 'action') {
      openConfigDialog({ ...node, name: name as ActionName });
    }
  };

  // Generic config save handler - works for any node type
  const handleConfigSave = (config: NodeConfig): void => {
    if (!dialogData?.node) return;
    // Type assertion safe: form validation ensures correct config type for each node
    updateNode(dialogData.node.id, { config } as Partial<typeof dialogData.node>);
    closeDialog();
    toast.success('Configuration saved');
  };

  // Dynamically render the config form based on node definition
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

  return (
    <>
      <Canvas nodes={nodes} edges={edges} nodeTypes={nodeTypes} />

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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={dialogType === 'delete-confirmation'}
        onOpenChange={(open) => !open && closeDialog()}
        nodeLabel={getDeleteNodeLabel()}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
