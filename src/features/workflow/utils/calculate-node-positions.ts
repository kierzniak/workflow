import type { Workflow, WorkflowNode, NodePosition } from '@/features/workflow/types';
import {
  VERTICAL_SPACING,
  CANVAS_CENTER_X,
  CANVAS_START_Y,
  NODE_WIDTH,
  NODE_HEIGHT,
  PLUS_NODE_SIZE,
} from '@/features/workflow/constants/layout';

/**
 * Get the height of a node based on its type.
 */
function getNodeHeight(node: WorkflowNode): number {
  return node.type === 'plus' ? PLUS_NODE_SIZE : NODE_HEIGHT;
}

/**
 * Result of position calculation for all workflow nodes.
 */
export type NodePositionMap = Map<string, NodePosition>;

/**
 * Calculates positions for all nodes in a workflow based on graph structure.
 *
 * Linear layout:
 * - All nodes centered horizontally at CANVAS_CENTER_X
 * - Nodes stacked vertically with VERTICAL_SPACING between them
 * - Order determined by traversing edges from trigger node
 *
 * @param workflow - The workflow containing nodes and edges
 * @returns Map of node IDs to calculated positions
 */
export function calculateNodePositions(workflow: Workflow): NodePositionMap {
  const positions: NodePositionMap = new Map();
  const { nodes, edges } = workflow;

  // Build adjacency list for traversal
  const adjacency = buildAdjacencyList(edges);

  // Find trigger node (entry point)
  const triggerNode = findTriggerNode(nodes);
  if (!triggerNode) {
    return positions;
  }

  // Traverse graph and assign positions
  // Track current Y position and previous node height for proper spacing
  let currentY = CANVAS_START_Y;
  let previousNodeHeight = 0;
  let isFirstNode = true;
  const visited = new Set<string>();

  traverseAndPosition(
    triggerNode.id,
    adjacency,
    nodes,
    positions,
    visited,
    CANVAS_CENTER_X,
    (node: WorkflowNode) => {
      if (isFirstNode) {
        isFirstNode = false;
        previousNodeHeight = getNodeHeight(node);
        return currentY;
      }
      // Next node Y = previous node bottom + gap
      currentY += previousNodeHeight + VERTICAL_SPACING;
      previousNodeHeight = getNodeHeight(node);
      return currentY;
    }
  );

  return positions;
}

/**
 * Builds adjacency list from edges (source -> targets).
 */
function buildAdjacencyList(edges: Workflow['edges']): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();

  for (const edge of edges) {
    const targets = adjacency.get(edge.source) ?? [];
    targets.push(edge.target);
    adjacency.set(edge.source, targets);
  }

  return adjacency;
}

/**
 * Finds the trigger node in the workflow.
 */
function findTriggerNode(nodes: Map<string, WorkflowNode>): WorkflowNode | undefined {
  for (const node of nodes.values()) {
    if (node.type === 'trigger') {
      return node;
    }
  }
  return undefined;
}

/**
 * Traverses graph depth-first, assigning positions to nodes.
 * For linear flow, this produces top-to-bottom ordering.
 */
function traverseAndPosition(
  nodeId: string,
  adjacency: Map<string, string[]>,
  nodes: Map<string, WorkflowNode>,
  positions: NodePositionMap,
  visited: Set<string>,
  x: number,
  getNextY: (node: WorkflowNode) => number
): void {
  if (visited.has(nodeId)) {
    return;
  }
  visited.add(nodeId);

  const node = nodes.get(nodeId);
  if (!node) {
    return;
  }

  // Assign position (center plus nodes horizontally relative to content nodes)
  let xPos = x;
  if (node.type === 'plus') {
    xPos = x + NODE_WIDTH / 2 - PLUS_NODE_SIZE / 2;
  }
  positions.set(nodeId, { x: xPos, y: getNextY(node) });

  // Process children (for linear flow, there's at most one)
  const children = adjacency.get(nodeId) ?? [];
  for (const childId of children) {
    traverseAndPosition(childId, adjacency, nodes, positions, visited, x, getNextY);
  }
}
