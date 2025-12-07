'use client';

import { Canvas } from '@/components/canvas';

import { useWorkflow } from '@/features/workflow/context';
import { nodeTypes } from './nodes';
import { workflowToCanvasEdges, workflowToCanvasNodes } from '@/features/workflow/utils';

import { NodeDialogProvider } from './nodes/NodeDialogContext';

/**
 * Canvas wrapper that connects workflow state to Canvas component.
 */
export function WorkflowCanvas(): React.ReactElement {
  const { workflow } = useWorkflow();

  const nodes = workflowToCanvasNodes(workflow.nodes, workflow);
  const edges = workflowToCanvasEdges(workflow.edges);

  return (
    <NodeDialogProvider>
      <Canvas nodes={nodes} edges={edges} nodeTypes={nodeTypes} />
    </NodeDialogProvider>
  );
}
