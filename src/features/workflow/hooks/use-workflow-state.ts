import { useReducer } from 'react';

import type {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  TriggerNode,
  ActionNode,
  PlusNode,
} from '@/features/workflow/types';
import { createNodeId, createEdgeId } from '@/features/workflow/types';

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
  | { type: 'SET_EDGES'; payload: WorkflowEdge[] }
  | {
      type: 'INSERT_ACTION_AFTER_PLUS';
      payload: {
        plusNodeId: string;
        actionNode: ActionNode;
        newPlusNode: PlusNode;
        actionEdgeId: string;
        plusEdgeId: string;
      };
    }
  | {
      type: 'CREATE_IF_ELSE_CHILDREN';
      payload: {
        ifElseNodeId: string;
        existingSuccessorId?: string;
        pathAAction: ActionNode;
        pathAPlus: PlusNode;
        pathBAction: ActionNode;
        pathBPlus: PlusNode;
      };
    };

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

    case 'INSERT_ACTION_AFTER_PLUS': {
      const { plusNodeId, actionNode, newPlusNode, actionEdgeId, plusEdgeId } = action.payload;

      // Find edge: plusNode → successor
      const outgoingEdgeIndex = state.edges.findIndex((e) => e.source === plusNodeId);

      const newNodes = new Map(state.nodes);
      newNodes.set(actionNode.id, actionNode);
      newNodes.set(newPlusNode.id, newPlusNode);

      let newEdges: WorkflowEdge[];

      if (outgoingEdgeIndex === -1) {
        // Plus is at end of flow
        // Add: Plus → Action → NewPlus
        newEdges = [
          ...state.edges,
          { id: actionEdgeId, source: plusNodeId, target: actionNode.id },
          { id: plusEdgeId, source: actionNode.id, target: newPlusNode.id },
        ];
      } else {
        // Plus has successor
        const successorId = state.edges[outgoingEdgeIndex].target;

        // Change: Plus → Action (was Plus → Successor)
        // Add: Action → NewPlus → Successor
        newEdges = state.edges.map((edge, index) => {
          if (index === outgoingEdgeIndex) {
            return { ...edge, target: actionNode.id };
          }
          return edge;
        });

        newEdges.push(
          { id: actionEdgeId, source: actionNode.id, target: newPlusNode.id },
          { id: plusEdgeId, source: newPlusNode.id, target: successorId }
        );
      }

      return { ...state, nodes: newNodes, edges: newEdges };
    }

    case 'CREATE_IF_ELSE_CHILDREN': {
      const { ifElseNodeId, existingSuccessorId, pathAAction, pathAPlus, pathBAction, pathBPlus } =
        action.payload;

      const newNodes = new Map(state.nodes);
      newNodes.set(pathAAction.id, pathAAction);
      newNodes.set(pathBAction.id, pathBAction);
      newNodes.set(pathBPlus.id, pathBPlus);

      let newEdges: WorkflowEdge[];

      if (existingSuccessorId) {
        // If-else in middle: move existing successor to Path A (no new plus for Path A)
        newEdges = state.edges.filter(
          (e) => !(e.source === ifElseNodeId && e.target === existingSuccessorId)
        );
        newEdges.push(
          { id: createEdgeId(), source: ifElseNodeId, target: pathAAction.id },
          { id: createEdgeId(), source: pathAAction.id, target: existingSuccessorId },
          { id: createEdgeId(), source: ifElseNodeId, target: pathBAction.id },
          { id: createEdgeId(), source: pathBAction.id, target: pathBPlus.id }
        );
      } else {
        // If-else at end: both branches get plus nodes
        newNodes.set(pathAPlus.id, pathAPlus);
        newEdges = [
          ...state.edges,
          { id: createEdgeId(), source: ifElseNodeId, target: pathAAction.id },
          { id: createEdgeId(), source: pathAAction.id, target: pathAPlus.id },
          { id: createEdgeId(), source: ifElseNodeId, target: pathBAction.id },
          { id: createEdgeId(), source: pathBAction.id, target: pathBPlus.id },
        ];
      }

      return { ...state, nodes: newNodes, edges: newEdges };
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
  /** Insert action + plus after clicked plus node, returns the new action node */
  insertActionAfterPlus: (plusNodeId: string) => ActionNode;
  /** Create child nodes (2 actions + 2 plus) for an if-else node */
  createIfElseChildren: (ifElseNodeId: string) => void;
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

  const insertActionAfterPlus = (plusNodeId: string): ActionNode => {
    const actionNode: ActionNode = {
      id: createNodeId(),
      type: 'action',
      name: null,
      position: { x: 0, y: 0 }, // Will be recalculated by calculateNodePositions
    };
    const newPlusNode: PlusNode = {
      id: createNodeId(),
      type: 'plus',
      position: { x: 0, y: 0 },
    };
    dispatch({
      type: 'INSERT_ACTION_AFTER_PLUS',
      payload: {
        plusNodeId,
        actionNode,
        newPlusNode,
        actionEdgeId: createEdgeId(),
        plusEdgeId: createEdgeId(),
      },
    });
    return actionNode;
  };

  const createIfElseChildren = (ifElseNodeId: string): void => {
    // Find if if-else has a successor (existing edge from if-else to something)
    const existingOutgoingEdge = workflow.edges.find((e) => e.source === ifElseNodeId);
    const existingSuccessorId = existingOutgoingEdge?.target;

    // Create Path A nodes
    const pathAAction: ActionNode = {
      id: createNodeId(),
      type: 'action',
      name: null,
      position: { x: 0, y: 0 },
    };
    const pathAPlus: PlusNode = {
      id: createNodeId(),
      type: 'plus',
      position: { x: 0, y: 0 },
    };

    // Create Path B nodes
    const pathBAction: ActionNode = {
      id: createNodeId(),
      type: 'action',
      name: null,
      position: { x: 0, y: 0 },
    };
    const pathBPlus: PlusNode = {
      id: createNodeId(),
      type: 'plus',
      position: { x: 0, y: 0 },
    };

    dispatch({
      type: 'CREATE_IF_ELSE_CHILDREN',
      payload: {
        ifElseNodeId,
        existingSuccessorId,
        pathAAction,
        pathAPlus,
        pathBAction,
        pathBPlus,
      },
    });
  };

  return {
    workflow,
    initializeWorkflow,
    addNode,
    updateNode,
    deleteNode,
    replaceNode,
    setEdges,
    insertActionAfterPlus,
    createIfElseChildren,
  };
}
