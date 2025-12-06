'use client';

import { ReactFlowProvider } from '@xyflow/react';

interface CanvasProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that wraps React Flow's context.
 * Must wrap any component that uses Canvas or canvas hooks.
 */
export function CanvasProvider({ children }: CanvasProviderProps) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
}
