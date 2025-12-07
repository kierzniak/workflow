'use client';

import { CanvasProvider } from '@/components/canvas';
import { WorkflowCanvas, WorkflowProvider } from '@/features/workflow';

export default function Home() {
  return (
    <WorkflowProvider>
      <CanvasProvider>
        <WorkflowCanvas />
      </CanvasProvider>
    </WorkflowProvider>
  );
}
