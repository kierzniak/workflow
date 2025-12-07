import type { Workflow } from '@/features/workflow/types';

/**
 * Get all descendant node IDs of a given node (for cascade deletion).
 * Uses BFS to traverse the graph.
 */
export function getAllDescendantIds(nodeId: string, workflow: Workflow): string[] {
  const descendants: string[] = [];
  const queue = [...workflow.edges.filter((e) => e.source === nodeId).map((e) => e.target)];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    descendants.push(currentId);

    // Add children of current node
    const childEdges = workflow.edges.filter((e) => e.source === currentId);
    queue.push(...childEdges.map((e) => e.target));
  }

  return descendants;
}
