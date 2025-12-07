import type { CanvasEdge, CanvasNode, CanvasNodeData } from '@/components/canvas';

import type {
  ActionNode,
  PlaceholderNode,
  PlusNode,
  TriggerNode,
  Workflow,
  WorkflowEdge,
  WorkflowNode,
} from '../types';
import { calculateNodePositions } from './calculate-node-positions';

/**
 * Data passed to PlaceholderNode component.
 * Note: When rendering unconfigured trigger/action as placeholder,
 * we pass a synthetic PlaceholderNode for display purposes.
 */
interface PlaceholderNodeData extends CanvasNodeData {
  node: PlaceholderNode;
  step: number;
  onClick?: () => void;
}

/**
 * Data passed to PlusNode component.
 */
interface PlusNodeData extends CanvasNodeData {
  node: PlusNode;
  onClick?: () => void;
}

/**
 * Data passed to configured trigger node components.
 */
interface TriggerNodeData extends CanvasNodeData {
  node: TriggerNode;
  onClick?: () => void;
  onMenuClick?: () => void;
}

/**
 * Data passed to configured action node components.
 */
interface ActionNodeData extends CanvasNodeData {
  node: ActionNode;
  step: number;
  onClick?: () => void;
  onMenuClick?: () => void;
}

/**
 * Union of all workflow-specific canvas node data types.
 */
export type WorkflowCanvasNodeData =
  | PlaceholderNodeData
  | PlusNodeData
  | TriggerNodeData
  | ActionNodeData;

/**
 * Get the React Flow node type string for a workflow node.
 */
function getNodeType(node: WorkflowNode): string {
  switch (node.type) {
    case 'placeholder':
      return 'placeholder';
    case 'plus':
      return 'plus';
    case 'trigger':
      if (node.name === null) return 'placeholder';
      return `${node.name}-trigger`;
    case 'action':
      if (node.name === null) return 'placeholder';
      return `${node.name}-action`;
  }
}

/**
 * Calculate step number for a node based on order in Map.
 * Triggers are always step 1, actions are numbered sequentially.
 */
function calculateStepNumber(node: WorkflowNode, allNodes: WorkflowNode[]): number {
  if (node.type === 'trigger') return 1;
  if (node.type === 'placeholder' && node.forType === 'trigger') return 1;
  if (node.type === 'plus') return 0; // Plus nodes don't have step numbers

  // Count action-like nodes before this one
  const actionNodes = allNodes.filter(
    (n) => n.type === 'action' || (n.type === 'placeholder' && n.forType === 'action')
  );
  const index = actionNodes.findIndex((n) => n.id === node.id);
  return index >= 0 ? index + 2 : 2; // +2 because trigger is step 1
}

/**
 * Transform a single workflow node to a canvas node.
 */
function transformNode(
  node: WorkflowNode,
  allNodes: WorkflowNode[],
  callbacks?: {
    onClick?: (nodeId: string) => void;
    onMenuClick?: (nodeId: string) => void;
    onPlusClick?: (nodeId: string) => void;
  }
): CanvasNode<WorkflowCanvasNodeData> {
  const nodeType = getNodeType(node);
  const step = calculateStepNumber(node, allNodes);

  const onClick = callbacks?.onClick ? () => callbacks.onClick!(node.id) : undefined;
  const onMenuClick = callbacks?.onMenuClick ? () => callbacks.onMenuClick!(node.id) : undefined;

  let data: WorkflowCanvasNodeData;

  if (node.type === 'plus') {
    const plusClick = callbacks?.onPlusClick ? () => callbacks.onPlusClick!(node.id) : undefined;
    data = { node, onClick: plusClick };
  } else if (node.type === 'placeholder') {
    data = { node, step, onClick };
  } else if (node.type === 'trigger') {
    if (node.name === null) {
      // Render unconfigured trigger as placeholder
      const placeholderNode: PlaceholderNode = {
        id: node.id,
        type: 'placeholder',
        position: node.position,
        forType: 'trigger',
      };
      data = { node: placeholderNode, step, onClick };
    } else {
      data = { node, onClick, onMenuClick };
    }
  } else {
    // Action node
    if (node.name === null) {
      // Render unconfigured action as placeholder
      const placeholderNode: PlaceholderNode = {
        id: node.id,
        type: 'placeholder',
        position: node.position,
        forType: 'action',
      };
      data = { node: placeholderNode, step, onClick };
    } else {
      data = { node, step, onClick, onMenuClick };
    }
  }

  return {
    id: node.id,
    type: nodeType,
    position: node.position,
    data,
  };
}

/**
 * Transform workflow nodes to canvas nodes for React Flow.
 * Recalculates positions from graph structure to ensure correct layout.
 *
 * @param nodes - Map of workflow nodes
 * @param callbacks - Optional click handlers
 * @param workflow - Full workflow for position calculation
 * @returns Array of canvas nodes ready for React Flow
 */
export function workflowToCanvasNodes(
  nodes: Map<string, WorkflowNode>,
  callbacks?: {
    onClick?: (nodeId: string) => void;
    onMenuClick?: (nodeId: string) => void;
    onPlusClick?: (nodeId: string) => void;
  },
  workflow?: Workflow
): CanvasNode<WorkflowCanvasNodeData>[] {
  // Recalculate positions from graph structure
  const positions = workflow ? calculateNodePositions(workflow) : new Map();

  const nodeArray = Array.from(nodes.values());
  return nodeArray.map((node) => {
    // Apply calculated position or use stored position as fallback
    const position = positions.get(node.id) ?? node.position;
    const nodeWithPosition = { ...node, position };
    return transformNode(nodeWithPosition, nodeArray, callbacks);
  });
}

/**
 * Transform workflow edges to canvas edges for React Flow.
 * Applies Zapier-style smoothstep edges with brand color.
 *
 * @param edges - Array of workflow edges
 * @returns Array of canvas edges ready for React Flow
 */
export function workflowToCanvasEdges(edges: WorkflowEdge[]): CanvasEdge[] {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'smoothstep',
    style: {
      stroke: '#7297c5',
      strokeWidth: 2,
    },
  }));
}
