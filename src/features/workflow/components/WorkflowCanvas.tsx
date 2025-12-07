'use client';

import { Canvas } from '@/components/canvas';

import { useWorkflow } from '@/features/workflow/context';
import { useNodeInteraction } from '@/features/workflow/hooks';
import { getNodeDefinition, nodeTypes } from './nodes';
import type { ActionName, NodeConfig, TriggerName } from '@/features/workflow/types';
import { workflowToCanvasEdges, workflowToCanvasNodes } from '@/features/workflow/utils';

import { NodeConfigurationDialog } from './NodeConfigurationDialog';
import { NodeSelectionDialog } from './NodeSelectionDialog';

const CONFIG_FORM_ID = 'node-config-form';

/**
 * Canvas wrapper that connects workflow state to Canvas component.
 * Manages node click interactions and dialog state.
 */
export function WorkflowCanvas(): React.ReactElement {
  const { workflow, updateNode, insertActionAfterPlus, createIfElseChildren } = useWorkflow();
  const {
    dialogType,
    dialogData,
    handleNodeClick,
    handlePlusNodeClick,
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

  // Transform nodes with click handlers (positions recalculated from graph structure)
  const nodes = workflowToCanvasNodes(
    workflow.nodes,
    {
      onClick: (nodeId) => {
        const node = workflow.nodes.get(nodeId);
        if (node) handleNodeClick(node);
      },
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
    </>
  );
}
