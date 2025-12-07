'use client';

import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Panel,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react';

import { cn } from '@/lib/utils';

import { ZoomControls } from './ZoomControls';
import type { CanvasProps, CanvasNodeData } from './types';

import '@xyflow/react/dist/style.css';

/**
 * Canvas component that renders an interactive node graph.
 * Built on React Flow but abstracts implementation details.
 *
 * @example
 * ```tsx
 * <CanvasProvider>
 *   <Canvas nodes={nodes} edges={edges} onNodeClick={handleClick} />
 * </CanvasProvider>
 * ```
 */
export function Canvas<T extends CanvasNodeData = CanvasNodeData>({
  nodes,
  edges,
  nodeTypes,
  onNodeClick,
  onCanvasClick,
  className,
}: CanvasProps<T>) {
  // Transform canvas nodes to React Flow nodes
  const rfNodes: Node[] = nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data,
    draggable: false, // FR-007: Node dragging disabled
  }));

  // Transform canvas edges to React Flow edges
  const rfEdges: Edge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: edge.type,
    style: edge.style,
  }));

  // Handle node click - extract node ID for callback
  const handleNodeClick: NodeMouseHandler = (_event, node) => {
    onNodeClick?.(node.id);
  };

  // Handle pane/background click
  const handlePaneClick = () => {
    onCanvasClick?.();
  };

  return (
    <div className={cn('h-full w-full', className)}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={true}
        panOnScroll={false}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        minZoom={0.25}
        maxZoom={2.0}
        fitView
        fitViewOptions={{ maxZoom: 1 }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Panel position="bottom-right" className="m-4">
          <ZoomControls />
        </Panel>
      </ReactFlow>
    </div>
  );
}
