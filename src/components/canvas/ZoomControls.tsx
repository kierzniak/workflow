'use client';

import { useReactFlow } from '@xyflow/react';
import { Plus, Minus, Maximize, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

/**
 * Zoom controls for the canvas.
 * Provides zoom in, zoom out, reset (100%), and fit view buttons.
 */
export function ZoomControls() {
  const { zoomIn, zoomOut, zoomTo, fitView } = useReactFlow();

  return (
    <div className="flex flex-col gap-1">
      <Button variant="outline" size="icon-sm" onClick={() => zoomIn()} aria-label="Zoom in">
        <Plus className="size-4" />
      </Button>
      <Button variant="outline" size="icon-sm" onClick={() => zoomOut()} aria-label="Zoom out">
        <Minus className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => zoomTo(1)}
        aria-label="Reset zoom to 100%"
      >
        <RotateCcw className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => fitView({ padding: 0.2 })}
        aria-label="Fit all nodes in view"
      >
        <Maximize className="size-4" />
      </Button>
    </div>
  );
}
