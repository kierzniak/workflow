import type {
  Workflow,
  TriggerNode,
  ActionNode,
  PlusNode,
  WorkflowEdge,
} from '@/features/workflow/types';
import { createWorkflowId, createNodeId, createEdgeId } from '@/features/workflow/types';

// =============================================================================
// Layout Constants
// =============================================================================

/** Horizontal center position for main flow nodes */
const NODE_CENTER_X = 400;

/** Vertical spacing between nodes */
const NODE_VERTICAL_GAP = 100;

/** Starting Y position for the first node */
const NODE_START_Y = 100;

// =============================================================================
// Initial Workflow Factory
// =============================================================================

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

  // Create nodes
  const triggerNode: TriggerNode = {
    id: triggerId,
    type: 'trigger',
    name: null,
    position: { x: NODE_CENTER_X, y: NODE_START_Y },
  };

  const plusBetweenNode: PlusNode = {
    id: plusBetweenId,
    type: 'plus',
    position: { x: NODE_CENTER_X, y: NODE_START_Y + NODE_VERTICAL_GAP },
  };

  const actionNode: ActionNode = {
    id: actionId,
    type: 'action',
    name: null,
    position: { x: NODE_CENTER_X, y: NODE_START_Y + NODE_VERTICAL_GAP * 2 },
  };

  const plusEndNode: PlusNode = {
    id: plusEndId,
    type: 'plus',
    position: { x: NODE_CENTER_X, y: NODE_START_Y + NODE_VERTICAL_GAP * 3 },
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

  return {
    id: workflowId,
    nodes,
    edges,
  };
}
