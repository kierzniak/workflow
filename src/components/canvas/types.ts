import type { NodeTypes } from '@xyflow/react';

/**
 * Canvas-specific types that abstract React Flow internals.
 * These types ensure the canvas component remains workflow-agnostic.
 */

/** Position on the canvas */
export interface CanvasPosition {
  x: number;
  y: number;
}

/** Generic node data that can be extended by consumers */
export interface CanvasNodeData {
  [key: string]: unknown;
}

/** Canvas node representation (abstracts React Flow Node) */
export interface CanvasNode<T extends CanvasNodeData = CanvasNodeData> {
  id: string;
  type: string;
  position: CanvasPosition;
  data: T;
}

/** Canvas edge representation (abstracts React Flow Edge) */
export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

/** Viewport state for pan/zoom */
export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

/** Props for the Canvas component */
export interface CanvasProps<T extends CanvasNodeData = CanvasNodeData> {
  /** Nodes to render on canvas */
  nodes: CanvasNode<T>[];
  /** Edges connecting nodes */
  edges: CanvasEdge[];
  /** Custom node type components (React Flow NodeTypes) */
  nodeTypes?: NodeTypes;
  /** Called when a node is clicked */
  onNodeClick?: (nodeId: string) => void;
  /** Called when canvas background is clicked */
  onCanvasClick?: () => void;
  /** Optional CSS class for canvas container */
  className?: string;
}
