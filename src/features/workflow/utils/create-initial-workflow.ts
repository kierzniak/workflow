import type {
  Workflow,
  TriggerNode,
  ActionNode,
  PlusNode,
  WorkflowEdge,
} from '@/features/workflow/types';
import { createWorkflowId, createNodeId, createEdgeId } from '@/features/workflow/types';
import { calculateNodePositions } from '@/features/workflow/utils/calculate-node-positions';

/**
 * Creates an initial workflow with:
 * - 1 Trigger node (unconfigured)
 * - 1 Plus node (between trigger and action)
 * - 1 Action node (unconfigured)
 * - 1 Plus node (after action, end of flow)
 *
 * Layout (top to bottom):
 * [Trigger] → [Plus] → [Action] → [Plus]
 */
export function createInitialWorkflow(): Workflow {
  // Generate IDs
  const workflowId = createWorkflowId();
  const triggerId = createNodeId();
  const plusBetweenId = createNodeId();
  const actionId = createNodeId();
  const plusEndId = createNodeId();

  // Create nodes with placeholder positions (will be calculated)
  const triggerNode: TriggerNode = {
    id: triggerId,
    type: 'trigger',
    name: null,
    position: { x: 0, y: 0 },
  };

  const plusBetweenNode: PlusNode = {
    id: plusBetweenId,
    type: 'plus',
    position: { x: 0, y: 0 },
  };

  const actionNode: ActionNode = {
    id: actionId,
    type: 'action',
    name: null,
    position: { x: 0, y: 0 },
  };

  const plusEndNode: PlusNode = {
    id: plusEndId,
    type: 'plus',
    position: { x: 0, y: 0 },
  };

  // Create edges
  const edges: WorkflowEdge[] = [
    { id: createEdgeId(), source: triggerId, target: plusBetweenId },
    { id: createEdgeId(), source: plusBetweenId, target: actionId },
    { id: createEdgeId(), source: actionId, target: plusEndId },
  ];

  // Build nodes map
  const nodes = new Map<string, TriggerNode | ActionNode | PlusNode>();
  nodes.set(triggerId, triggerNode);
  nodes.set(plusBetweenId, plusBetweenNode);
  nodes.set(actionId, actionNode);
  nodes.set(plusEndId, plusEndNode);

  // Create workflow with placeholder positions
  const workflow: Workflow = {
    id: workflowId,
    nodes,
    edges,
  };

  // Calculate and apply positions
  const positions = calculateNodePositions(workflow);
  for (const [nodeId, position] of positions) {
    const node = nodes.get(nodeId);
    if (node) {
      node.position = position;
    }
  }

  return workflow;
}
