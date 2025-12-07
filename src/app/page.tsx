'use client';

import { Canvas, CanvasProvider } from '@/components/canvas';
import {
  nodeTypes,
  WorkflowProvider,
  useWorkflow,
  workflowToCanvasNodes,
  workflowToCanvasEdges,
} from '@/features/workflow';

/**
 * Temporary debug component to verify workflow initialization.
 * Will be removed after Phase 3 is complete.
 */
function WorkflowDebug() {
  const { workflow } = useWorkflow();

  // Log to console for manual verification
  console.log('Workflow state:', {
    id: workflow.id,
    nodeCount: workflow.nodes.size,
    edgeCount: workflow.edges.length,
    nodes: Array.from(workflow.nodes.values()),
    edges: workflow.edges,
  });

  return (
    <div className="absolute right-16 bottom-4 z-50 rounded bg-black/80 p-3 font-mono text-xs text-white">
      <div>Workflow ID: {workflow.id || 'initializing...'}</div>
      <div>Nodes: {workflow.nodes.size}</div>
      <div>Edges: {workflow.edges.length}</div>
    </div>
  );
}

/**
 * Canvas wrapper that connects workflow state to Canvas component.
 */
function WorkflowCanvas() {
  const { workflow } = useWorkflow();

  const nodes = workflowToCanvasNodes(workflow.nodes);
  const edges = workflowToCanvasEdges(workflow.edges);

  return <Canvas nodes={nodes} edges={edges} nodeTypes={nodeTypes} />;
}

export default function Home() {
  return (
    <WorkflowProvider>
      <CanvasProvider>
        <WorkflowDebug />
        <WorkflowCanvas />
      </CanvasProvider>
    </WorkflowProvider>
  );
}
