import type { Workflow, WorkflowNode, NodePosition } from '@/features/workflow/types';
import {
  VERTICAL_SPACING,
  CANVAS_CENTER_X,
  CANVAS_START_Y,
  NODE_WIDTH,
  NODE_HEIGHT,
  PLUS_NODE_SIZE,
  BRANCH_HORIZONTAL_SPACING,
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
 * Handles both linear flow and branching (if-else nodes with 2 children).
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

  // Start traversal from trigger
  const visited = new Set<string>();
  traverseAndPosition(
    triggerNode.id,
    adjacency,
    nodes,
    positions,
    visited,
    CANVAS_CENTER_X,
    CANVAS_START_Y
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
 * Handles branching by positioning children side-by-side.
 *
 * @returns The Y position after this subtree (for calculating next node position)
 */
function traverseAndPosition(
  nodeId: string,
  adjacency: Map<string, string[]>,
  nodes: Map<string, WorkflowNode>,
  positions: NodePositionMap,
  visited: Set<string>,
  centerX: number,
  startY: number
): number {
  if (visited.has(nodeId)) {
    return startY;
  }
  visited.add(nodeId);

  const node = nodes.get(nodeId);
  if (!node) {
    return startY;
  }

  // Calculate X position (center plus nodes)
  const nodeHeight = getNodeHeight(node);
  let xPos = centerX;
  if (node.type === 'plus') {
    xPos = centerX + NODE_WIDTH / 2 - PLUS_NODE_SIZE / 2;
  }

  // Assign position
  positions.set(nodeId, { x: xPos, y: startY });

  // Get children
  const children = adjacency.get(nodeId) ?? [];

  if (children.length === 0) {
    // Leaf node - return Y after this node
    return startY + nodeHeight;
  }

  if (children.length === 1) {
    // Linear flow - continue with same centerX
    const nextY = startY + nodeHeight + VERTICAL_SPACING;
    return traverseAndPosition(children[0], adjacency, nodes, positions, visited, centerX, nextY);
  }

  // Branching (2+ children) - position side by side
  // Path A (first child) = left, Path B (second child) = right
  const branchStartY = startY + nodeHeight + VERTICAL_SPACING;
  const leftX = centerX - BRANCH_HORIZONTAL_SPACING / 2;
  const rightX = centerX + BRANCH_HORIZONTAL_SPACING / 2;

  // Process each branch, track max Y reached
  let maxY = branchStartY;

  // Path A (left branch)
  const leftEndY = traverseAndPosition(
    children[0],
    adjacency,
    nodes,
    positions,
    visited,
    leftX,
    branchStartY
  );
  maxY = Math.max(maxY, leftEndY);

  // Path B (right branch)
  if (children.length >= 2) {
    const rightEndY = traverseAndPosition(
      children[1],
      adjacency,
      nodes,
      positions,
      visited,
      rightX,
      branchStartY
    );
    maxY = Math.max(maxY, rightEndY);
  }

  return maxY;
}
