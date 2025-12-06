import { useReducer } from 'react';

import type {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  TriggerNode,
  ActionNode,
} from '@/features/workflow/types';

// =============================================================================
// Action Types
// =============================================================================

type WorkflowAction =
  | { type: 'INITIALIZE_WORKFLOW'; payload: Workflow }
  | { type: 'ADD_NODE'; payload: { node: WorkflowNode; edges: WorkflowEdge[] } }
  | {
      type: 'UPDATE_NODE';
      payload: { id: string; updates: Partial<TriggerNode> | Partial<ActionNode> };
    }
  | { type: 'DELETE_NODE'; payload: { id: string } }
  | { type: 'REPLACE_NODE'; payload: { oldId: string; newNode: WorkflowNode } }
  | { type: 'SET_EDGES'; payload: WorkflowEdge[] };

// =============================================================================
// Reducer
// =============================================================================

function workflowReducer(state: Workflow, action: WorkflowAction): Workflow {
  switch (action.type) {
    case 'INITIALIZE_WORKFLOW': {
      return action.payload;
    }

    case 'ADD_NODE': {
      const { node, edges } = action.payload;
      const newNodes = new Map(state.nodes);
      newNodes.set(node.id, node);

      return {
        ...state,
        nodes: newNodes,
        edges: [...state.edges, ...edges],
      };
    }

    case 'UPDATE_NODE': {
      const { id, updates } = action.payload;
      const existingNode = state.nodes.get(id);
      if (!existingNode) return state;

      // Only trigger and action nodes can be updated
      if (existingNode.type !== 'trigger' && existingNode.type !== 'action') {
        return state;
      }

      const newNodes = new Map(state.nodes);
      newNodes.set(id, { ...existingNode, ...updates } as WorkflowNode);

      return {
        ...state,
        nodes: newNodes,
      };
    }

    case 'DELETE_NODE': {
      const { id } = action.payload;
      const newNodes = new Map(state.nodes);
      newNodes.delete(id);

      // Remove edges connected to this node
      const newEdges = state.edges.filter((edge) => edge.source !== id && edge.target !== id);

      return {
        ...state,
        nodes: newNodes,
        edges: newEdges,
      };
    }

    case 'REPLACE_NODE': {
      const { oldId, newNode } = action.payload;
      const newNodes = new Map(state.nodes);
      newNodes.delete(oldId);
      newNodes.set(newNode.id, newNode);

      // Update edges to point to new node
      const newEdges = state.edges.map((edge) => {
        if (edge.source === oldId) {
          return { ...edge, source: newNode.id };
        }
        if (edge.target === oldId) {
          return { ...edge, target: newNode.id };
        }
        return edge;
      });

      return {
        ...state,
        nodes: newNodes,
        edges: newEdges,
      };
    }

    case 'SET_EDGES': {
      return {
        ...state,
        edges: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}

// =============================================================================
// Initial State
// =============================================================================

const initialState: Workflow = {
  id: '',
  nodes: new Map(),
  edges: [],
};

// =============================================================================
// Hook
// =============================================================================

export interface UseWorkflowStateReturn {
  /** Current workflow state */
  workflow: Workflow;
  /** Initialize workflow with given state */
  initializeWorkflow: (workflow: Workflow) => void;
  /** Add a node with its connecting edges */
  addNode: (node: WorkflowNode, edges: WorkflowEdge[]) => void;
  /** Update a trigger or action node */
  updateNode: (id: string, updates: Partial<TriggerNode> | Partial<ActionNode>) => void;
  /** Delete a node and its connected edges */
  deleteNode: (id: string) => void;
  /** Replace a node (e.g., plus/placeholder → action), re-linking edges */
  replaceNode: (oldId: string, newNode: WorkflowNode) => void;
  /** Replace all edges */
  setEdges: (edges: WorkflowEdge[]) => void;
}

/**
 * Hook for managing workflow state with useReducer.
 * Provides immutable state updates for nodes and edges.
 */
export function useWorkflowState(): UseWorkflowStateReturn {
  const [workflow, dispatch] = useReducer(workflowReducer, initialState);

  const initializeWorkflow = (newWorkflow: Workflow): void => {
    dispatch({ type: 'INITIALIZE_WORKFLOW', payload: newWorkflow });
  };

  const addNode = (node: WorkflowNode, edges: WorkflowEdge[]): void => {
    dispatch({ type: 'ADD_NODE', payload: { node, edges } });
  };

  const updateNode = (id: string, updates: Partial<TriggerNode> | Partial<ActionNode>): void => {
    dispatch({ type: 'UPDATE_NODE', payload: { id, updates } });
  };

  const deleteNode = (id: string): void => {
    dispatch({ type: 'DELETE_NODE', payload: { id } });
  };

  const replaceNode = (oldId: string, newNode: WorkflowNode): void => {
    dispatch({ type: 'REPLACE_NODE', payload: { oldId, newNode } });
  };

  const setEdges = (edges: WorkflowEdge[]): void => {
    dispatch({ type: 'SET_EDGES', payload: edges });
  };

  return {
    workflow,
    initializeWorkflow,
    addNode,
    updateNode,
    deleteNode,
    replaceNode,
    setEdges,
  };
}
