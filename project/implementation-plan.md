# Implementation Plan – Visual Workflow Automation PoC

## Overview

This document outlines a phased implementation plan for building a proof-of-concept visual workflow automation platform. Each phase results in a fully functional application that can be manually tested and verified. Tasks are designed as independent units with clear completion criteria.

**Technology Stack:**
- React 19+ with Next.js (App Router)
- TypeScript (strict mode, no `any`)
- React Flow for canvas rendering
- Zod for validation
- ShadCN UI for components
- TailwindCSS for styling

**Architecture Principles:**
- Feature-based folder structure with single `workflow` feature
- Canvas as independent, reusable component (not tied to workflow)
- Separation of concerns (components → UI, hooks → state, services → I/O)
- Dependency injection for testability
- Discriminated unions for state modeling (`type` + `name` pattern)
- Result types over exceptions
- Derived state over stored state (e.g., node configured status derived from `name`)

**Project Structure:**
```
src/
  app/                    # Next.js App Router
  components/
    ui/                   # ShadCN components
    canvas/               # React Flow abstraction (workflow-agnostic)
  features/
    workflow/             # Workflow feature
      components/         # Workflow-specific components
      hooks/              # Workflow hooks
      types/              # Domain types
      constants/          # Node catalog, layout constants
      utils/              # Utility functions
      schemas/            # Zod validation schemas
  shared/
    types/                # Common types (Result, AsyncState)
    utils/                # Shared utilities
    hooks/                # Shared hooks
    constants/            # App-wide constants
```

---

## Phase 1: Project Setup and Skeleton

**Goal:** Establish the foundational project structure with all tooling configured and a basic "hello world" page rendering.

**Verification:** Application runs in development mode, displays a basic page, and all linting/type-checking passes.

### Task 1.1: Initialize Next.js Project with TypeScript

- [ ] Create new Next.js project with App Router (`create-next-app@latest`)
- [ ] Configure TypeScript with strict mode enabled
- [ ] Set up `tsconfig.json` with path aliases (`@/` for `src/`)
- [ ] Verify the default page renders at `localhost:3000`

**Acceptance Criteria:**
- `npm run dev` starts the application without errors
- TypeScript compilation succeeds with no warnings
- Path aliases work correctly

---

### Task 1.2: Configure Code Quality Tools

- [ ] Install and configure ESLint with React and TypeScript rules
- [ ] Install and configure Prettier for code formatting
- [ ] Add `lint-staged` and `husky` for pre-commit hooks
- [ ] Configure ESLint rule to disallow `any` type
- [ ] Add npm scripts: `lint`, `lint:fix`, `format`

**Acceptance Criteria:**
- `npm run lint` executes without configuration errors
- Pre-commit hook runs linting on staged files
- Using `any` type triggers a linting error

---

### Task 1.3: Install and Configure TailwindCSS

- [ ] Install TailwindCSS and required dependencies
- [ ] Configure `tailwind.config.ts` with content paths
- [ ] Set up global CSS file with Tailwind directives
- [ ] Add custom theme configuration (colors, spacing) placeholder
- [ ] Verify Tailwind classes apply correctly on test element

**Acceptance Criteria:**
- Tailwind utility classes render correctly in browser
- Hot reload works with style changes
- Custom theme values are accessible

---

### Task 1.4: Install and Configure ShadCN UI

- [ ] Initialize ShadCN UI with `npx shadcn@latest init`
- [ ] Configure component output directory (`src/components/ui`)
- [ ] Install base components: Button, Dialog, Input, Label
- [ ] Create a test page demonstrating ShadCN Button component
- [ ] Verify component styling matches ShadCN defaults

**Acceptance Criteria:**
- ShadCN components render with correct styling
- Components are accessible via keyboard navigation
- Component imports resolve correctly

---

### Task 1.5: Set Up Feature-Based Folder Structure

- [ ] Create `src/features/` directory for feature modules
- [ ] Create `src/components/` directory for shared/independent components:
  - `src/components/ui/` – ShadCN components
  - `src/components/canvas/` – Canvas component (React Flow abstraction)
- [ ] Create `src/shared/` directory for shared utilities:
  - `src/shared/types/` – Common type definitions
  - `src/shared/utils/` – Utility functions
  - `src/shared/hooks/` – Shared hooks
  - `src/shared/constants/` – Application constants
- [ ] Add README.md files documenting folder purposes
- [ ] Create initial shared types file (`result.ts`, `async-state.ts`)

**Acceptance Criteria:**
- Folder structure separates features from shared components
- Canvas is a reusable component, not tied to workflow feature
- Shared types are importable via path aliases
- README documentation exists for main directories

---

### Task 1.6: Configure Testing Infrastructure

- [ ] Install Vitest as the test runner
- [ ] Install React Testing Library and related utilities
- [ ] Configure `vitest.config.ts` with React support
- [ ] Add test utilities file with custom render function
- [ ] Create sample test to verify setup works
- [ ] Add npm scripts: `test`, `test:watch`, `test:coverage`

**Acceptance Criteria:**
- `npm run test` executes without configuration errors
- Sample test passes
- Coverage report generates correctly

---

### Task 1.7: Create Application Shell Layout

- [ ] Create root layout (`src/app/layout.tsx`) with metadata
- [ ] Create basic header component with application title
- [ ] Create main content area with full-height canvas placeholder
- [ ] Apply base styling (dark/light mode support optional)
- [ ] Add ErrorBoundary wrapper for the main content area

**Acceptance Criteria:**
- Application has consistent header across pages
- Main content area takes remaining viewport height
- ErrorBoundary catches and displays errors gracefully

---

## Phase 2: Workflow Canvas Foundation

**Goal:** Integrate React Flow and render an empty, interactive canvas with pan/zoom controls.

**Verification:** User can see an empty canvas, pan around by dragging, zoom in/out, and reset the view.

### Task 2.1: Install and Configure React Flow

- [ ] Install `@xyflow/react` package
- [ ] Create `src/features/workflow/` feature directory with structure:
  - `components/` – Workflow-specific React components
  - `hooks/` – Custom hooks for workflow logic
  - `types/` – TypeScript types for workflow domain
  - `constants/` – Feature constants (layout, catalog)
  - `utils/` – Utility functions
  - `schemas/` – Zod validation schemas
- [ ] Create `src/components/canvas/` for React Flow abstraction (independent of workflow):
  - `Canvas.tsx` – Main canvas component
  - `types.ts` – Canvas-specific types
  - `hooks/` – Canvas-related hooks (zoom, pan)
- [ ] Create `ReactFlowProvider` wrapper component in canvas directory

**Acceptance Criteria:**
- React Flow package installed without peer dependency issues
- Workflow feature directory structure is complete
- Canvas component is separate and workflow-agnostic
- Provider component is created and exportable

---

### Task 2.2: Create Canvas Abstraction Layer

- [ ] Define `CanvasNode` and `CanvasEdge` types in `src/components/canvas/types.ts`
- [ ] Create `Canvas` component wrapping `ReactFlow` in `src/components/canvas/`
- [ ] Define `CanvasProps` interface with JSDoc documentation
- [ ] Implement canvas background (dots or grid pattern)
- [ ] Ensure React Flow is an internal implementation detail
- [ ] Canvas accepts generic node/edge data, not workflow-specific types

**Acceptance Criteria:**
- `Canvas` component renders without exposing React Flow internals
- Custom types abstract away React Flow's node/edge types
- Background pattern is visible on the canvas
- Canvas is reusable and not coupled to workflow feature

---

### Task 2.3: Implement Canvas Panning (FR-005)

- [ ] Enable mouse drag panning on empty canvas space
- [ ] Configure trackpad/scroll wheel for vertical panning
- [ ] Enable horizontal scroll for horizontal panning (if available)
- [ ] Ensure clicking on nodes does NOT trigger panning
- [ ] Add visual cursor feedback (`grab` → `grabbing`)

**Acceptance Criteria:**
- Dragging empty canvas space pans the view
- Scroll wheel pans vertically
- Trackpad horizontal scroll pans horizontally

---

### Task 2.4: Implement Zoom Controls (FR-006)

- [ ] Enable mouse wheel/trackpad pinch zoom
- [ ] Create `ZoomControls` component with:
  - Zoom in button
  - Zoom out button
  - Reset view button (fit to center)
- [ ] Position controls in bottom-right corner of canvas
- [ ] Define zoom limits (min: 0.25, max: 2.0)
- [ ] Style controls using ShadCN Button component

**Acceptance Criteria:**
- Pinch/wheel zoom works smoothly
- Zoom buttons increment/decrement zoom level
- Reset button centers the workflow in view
- Zoom cannot exceed defined limits

---

### Task 2.5: Disable Node Dragging (FR-007)

- [ ] Configure React Flow to disable node dragging (`nodesDraggable={false}`)
- [ ] Ensure nodes remain in their programmatic positions
- [ ] Verify clicking nodes does not initiate drag behavior
- [ ] Add visual cursor on nodes (`pointer` for clickable)

**Acceptance Criteria:**
- Nodes cannot be dragged by the user
- Node click events still fire correctly
- Cursor indicates nodes are clickable

---

### Task 2.6: Create Canvas Page Route

- [ ] Create workflow builder page at `/` (or `/workflow`)
- [ ] Integrate `Canvas` component into the page
- [ ] Wrap page with necessary providers (ReactFlowProvider)
- [ ] Ensure canvas fills available space below header
- [ ] Add loading state placeholder

**Acceptance Criteria:**
- Navigating to `/` displays the canvas
- Canvas is responsive to viewport size changes
- No layout shift occurs during initial render

---

## Phase 3: Workflow Data Model and Initialization

**Goal:** Define the workflow data structure and initialize an empty workflow with one Trigger node, one Action node, and Plus helper nodes.

**Verification:** On page load, the workflow state contains correctly structured nodes (not yet rendered on canvas).

### Task 3.1: Define Core Domain Types

- [ ] Create `src/features/workflow/types/workflow.ts`
- [ ] Define `NodeType` for structural role:
  ```typescript
  type NodeType = 'trigger' | 'action' | 'plus' | 'placeholder';
  ```
- [ ] Define `NodeName` for concrete implementations:
  ```typescript
  type TriggerName = 'schedule';
  type ActionName = 'send-email' | 'if-else';
  type NodeName = TriggerName | ActionName;
  ```
- [ ] Node status is derived from `name`:
  - `name: null` → unconfigured
  - `name: NodeName` → configured (or partially configured if config incomplete)
- [ ] Add JSDoc documentation for all types

**Acceptance Criteria:**
- All types are properly exported
- Types use discriminated unions where appropriate
- No `any` types present
- Status is derived, not stored separately

---

### Task 3.2: Define Node Data Structures

- [ ] Define `WorkflowNode` as discriminated union by `type`:
  ```typescript
  type WorkflowNode =
    | TriggerNode
    | ActionNode
    | PlusNode
    | PlaceholderNode;
  ```
- [ ] Define `TriggerNode`:
  ```typescript
  interface TriggerNode {
    id: string;
    type: 'trigger';
    name: TriggerName | null;
    position: { x: number; y: number };
    config?: ScheduleConfig;
  }
  ```
- [ ] Define `ActionNode`:
  ```typescript
  interface ActionNode {
    id: string;
    type: 'action';
    name: ActionName | null;
    position: { x: number; y: number };
    branchId?: string;
    config?: SendEmailConfig | IfElseConfig;
  }
  ```
- [ ] Define `PlusNode`:
  ```typescript
  interface PlusNode {
    id: string;
    type: 'plus';
    position: { x: number; y: number };
    branchId?: string;
  }
  ```
- [ ] Define `PlaceholderNode`:
  ```typescript
  interface PlaceholderNode {
    id: string;
    type: 'placeholder';
    forType: 'trigger' | 'action';
    position: { x: number; y: number };
    branchId?: string;
  }
  ```
- [ ] Create type guard functions for each node type

**Acceptance Criteria:**
- Each node type has its own interface
- Type guards can discriminate between node types
- `name: null` clearly indicates unconfigured state
- Configuration fields are properly typed per node name

---

### Task 3.3: Define Edge and Workflow Types

- [ ] Define `WorkflowEdge` interface:
  - `id: string`
  - `source: string`
  - `target: string`
  - `type?: 'default' | 'branch'`
- [ ] Define `Branch` interface:
  - `id: string`
  - `label: string` ('Path A' | 'Path B')
  - `parentNodeId: string`
  - `nodeIds: string[]`
- [ ] Define `Workflow` interface:
  - `id: string`
  - `nodes: Map<string, WorkflowNodeUnion>`
  - `edges: WorkflowEdge[]`
  - `branches: Map<string, Branch>`
- [ ] Add factory functions for creating IDs

**Acceptance Criteria:**
- Workflow structure supports branching
- Types enforce referential integrity conceptually
- Factory functions generate unique IDs

---

### Task 3.4: Create Workflow State Hook

- [ ] Create `useWorkflowState` hook in `src/features/workflow/hooks/`
- [ ] Implement state using `useReducer` for complex updates
- [ ] Define action types for state mutations:
  - `INITIALIZE_WORKFLOW`
  - `ADD_NODE`
  - `UPDATE_NODE`
  - `DELETE_NODE`
- [ ] Return typed state and dispatch function
- [ ] Use explicit return type annotation

**Acceptance Criteria:**
- Hook manages workflow state immutably
- All actions are properly typed
- State updates trigger re-renders correctly

---

### Task 3.5: Implement Workflow Initialization (FR-001, FR-002)

- [ ] Create `initializeWorkflow` function returning initial state
- [ ] Generate initial Trigger node (unconfigured, top position)
- [ ] Generate initial Action node (unconfigured, below trigger)
- [ ] Generate Plus node between Trigger and Action
- [ ] Generate Plus node below Action (end of flow)
- [ ] Create edges connecting all nodes
- [ ] Define position constants for consistent spacing

**Acceptance Criteria:**
- Function returns valid `Workflow` structure
- Exactly 4 nodes created (Trigger, Action, 2 Plus nodes)
- Edges connect nodes in correct order
- All nodes have valid positions

---

### Task 3.6: Create Workflow Context Provider

- [ ] Create `WorkflowContext` with typed value
- [ ] Create `WorkflowProvider` component
- [ ] Initialize workflow on provider mount (FR-001)
- [ ] Create `useWorkflow` hook for consuming context
- [ ] Add error handling for missing provider
- [ ] Export from feature index file

**Acceptance Criteria:**
- Provider initializes workflow automatically
- Context consumers receive typed workflow state
- Error thrown when hook used outside provider

---

### Task 3.7: Integrate Provider into Application

- [ ] Wrap canvas page with `WorkflowProvider`
- [ ] Create temporary debug component showing node count
- [ ] Verify workflow initializes with correct node count (4)
- [ ] Verify workflow initializes with correct edge count (3)
- [ ] Log workflow state to console for manual verification

**Acceptance Criteria:**
- Debug output shows 4 nodes and 3 edges
- No errors in console during initialization
- State persists during component re-renders

---

## Phase 4: Render Nodes on Canvas

**Goal:** Display the initialized workflow nodes on the React Flow canvas with proper styling and positioning.

**Verification:** User sees Trigger node, Action node, and Plus nodes rendered on the canvas in a vertical layout.

### Task 4.1: Create Node Position Calculator

- [ ] Create `calculateNodePositions` utility function
- [ ] Define layout constants:
  - `NODE_WIDTH: 280`
  - `NODE_HEIGHT: 80`
  - `VERTICAL_SPACING: 100`
  - `PLUS_NODE_SIZE: 32`
  - `BRANCH_HORIZONTAL_SPACING: 320`
- [ ] Calculate positions based on workflow structure
- [ ] Handle linear layout (single column centered)
- [ ] Return position map: `Map<nodeId, {x, y}>`

**Acceptance Criteria:**
- Positions are calculated deterministically
- Constants are configurable
- Function is pure (no side effects)

---

### Task 4.2: Create Base Node Component

- [ ] Create `BaseNode` component in `src/features/workflow/components/nodes/`
- [ ] Define `BaseNodeProps` interface with JSDoc
- [ ] Implement base styling (border, background, shadow)
- [ ] Add status indicator (derive from `name`: null vs set)
- [ ] Support `onClick` handler prop
- [ ] Use composition for node content

**Acceptance Criteria:**
- Component renders with consistent styling
- Click events propagate correctly
- Status (name null vs name set) is visually distinguishable

---

### Task 4.3: Create Trigger Node Component (FR-008)

- [ ] Create `TriggerNode` component extending `BaseNode`
- [ ] Add trigger-specific styling (e.g., purple accent like Zapier)
- [ ] Display "Trigger" label when `name: null`
- [ ] Display node name label when configured (e.g., "Schedule")
- [ ] Add trigger icon (changes based on `name`)
- [ ] Show step number ("1.")

**Acceptance Criteria:**
- Trigger node has distinct visual style
- Label shows "Trigger" when `name` is null, otherwise shows name
- Icon renders correctly

---

### Task 4.4: Create Action Node Component (FR-008)

- [ ] Create `ActionNode` component extending `BaseNode`
- [ ] Add action-specific styling (e.g., teal accent)
- [ ] Display "Action" label when `name: null`
- [ ] Display node name when configured (e.g., "Send Email", "If/Else")
- [ ] Add action icon (changes based on `name`)
- [ ] Show step number dynamically

**Acceptance Criteria:**
- Action node has distinct visual style from Trigger
- Label shows "Action" when `name` is null, otherwise shows name
- Step numbers are correctly calculated

---

### Task 4.5: Create Plus Helper Node Component (FR-013)

- [ ] Create `PlusNode` component
- [ ] Style as circular button with "+" icon
- [ ] Size: 32x32 pixels
- [ ] Add hover state (scale up, color change)
- [ ] Position on edge line between nodes
- [ ] Make focusable for accessibility

**Acceptance Criteria:**
- Plus node is visually smaller than content nodes
- Hover feedback is visible
- Keyboard accessible (focusable, activatable)

---

### Task 4.6: Create Placeholder Node Component (FR-008)

- [ ] Create `PlaceholderNode` component
- [ ] Style with dashed border indicating temporary state
- [ ] Display "Select a node type..." text
- [ ] Match size of Action node
- [ ] Add subtle animation (pulse or shimmer)

**Acceptance Criteria:**
- Placeholder is visually distinct from configured nodes
- User understands this is a temporary state
- Animation is subtle and not distracting

---

### Task 4.7: Register Custom Nodes with React Flow

- [ ] Create `nodeTypes` configuration object
- [ ] Register all custom node components:
  - `trigger` → `TriggerNode`
  - `action` → `ActionNode`
  - `plus` → `PlusNode`
  - `placeholder` → `PlaceholderNode`
- [ ] Pass `nodeTypes` to `Canvas` component
- [ ] Verify React Flow recognizes custom types

**Acceptance Criteria:**
- No React Flow warnings about unknown node types
- Each node type renders its custom component
- Type configuration is centralized

---

### Task 4.8: Transform Workflow State to React Flow Nodes

- [ ] Create `workflowToCanvasNodes` transformer function
- [ ] Map `WorkflowNode` to React Flow `Node` type
- [ ] Include node data for custom component consumption
- [ ] Memoize transformation for performance
- [ ] Handle all node types correctly

**Acceptance Criteria:**
- Transformation is type-safe
- All workflow nodes produce valid React Flow nodes
- Custom data is accessible in node components

---

### Task 4.9: Transform Workflow Edges to React Flow Edges

- [ ] Create `workflowToCanvasEdges` transformer function
- [ ] Map `WorkflowEdge` to React Flow `Edge` type
- [ ] Style edges (color, stroke width)
- [ ] Configure edge routing (step or bezier)
- [ ] Ensure edges connect to correct node handles

**Acceptance Criteria:**
- All edges render between correct nodes
- Edge styling is consistent
- No orphaned edges or errors

---

### Task 4.10: Render Initial Workflow on Canvas

- [ ] Connect workflow state to Canvas component
- [ ] Pass transformed nodes and edges to React Flow
- [ ] Verify all 4 nodes render in correct positions
- [ ] Verify all 3 edges connect correctly
- [ ] Auto-fit view on initial render

**Acceptance Criteria:**
- Trigger node at top
- Plus node below Trigger
- Action node below Plus
- Plus node below Action
- Edges visible connecting all nodes

---

## Phase 5: Node Selection and Configuration Modals

**Goal:** Enable users to click nodes to configure them, including selecting node names and filling configuration forms.

**Verification:** User can click nodes, select node names, configure settings, and see changes reflected on the canvas.

### Task 5.1: Create Modal Infrastructure

- [ ] Create `Modal` wrapper component using ShadCN Dialog
- [ ] Implement modal state management hook (`useModal`)
- [ ] Support modal stacking prevention (only one modal open)
- [ ] Add focus trap and escape key handling (FR-029, FR-030)
- [ ] Create modal header with title and close button

**Acceptance Criteria:**
- Only one modal can be open at a time
- Focus is trapped within modal
- Escape key closes modal
- Clicking outside closes modal (configurable)

---

### Task 5.2: Define Node Catalog

- [ ] Create `src/features/workflow/constants/node-catalog.ts`
- [ ] Define `NodeCatalogEntry` interface:
  ```typescript
  interface NodeCatalogEntry {
    name: TriggerName | ActionName;
    label: string;
    description: string;
    icon: ReactNode;
    type: 'trigger' | 'action';
  }
  ```
- [ ] Add catalog entries:
  - `{ name: 'schedule', type: 'trigger', label: 'Schedule', ... }`
  - `{ name: 'send-email', type: 'action', label: 'Send Email', ... }`
  - `{ name: 'if-else', type: 'action', label: 'If/Else', ... }`
- [ ] Export helper function to filter by type:
  ```typescript
  function getNodeCatalogByType(type: 'trigger' | 'action'): NodeCatalogEntry[]
  ```

**Acceptance Criteria:**
- Catalog uses `name` for node identification
- Each entry has complete information
- Filter function returns correct entries by type

---

### Task 5.3: Create Node Selection Modal (FR-014, FR-015, FR-016)

- [ ] Create `NodeSelectionModal` component
- [ ] Accept `nodeType` prop to filter catalog (`'trigger' | 'action'`)
- [ ] Display filtered catalog entries as selectable list
- [ ] Show icon, label, and description for each entry
- [ ] Add search/filter input (optional for PoC)
- [ ] Handle selection: emit chosen `name` value
- [ ] Handle cancellation: close without selection

**Acceptance Criteria:**
- Trigger nodes only see trigger options (schedule)
- Action nodes only see action options (send-email, if-else)
- Selection emits the `name` value (e.g., 'schedule', 'send-email')
- Cancel returns without selection

---

### Task 5.4: Create Node Configuration Modal Shell

- [ ] Create `NodeConfigurationModal` component
- [ ] Accept `node` prop with current node data
- [ ] Display node name in modal header
- [ ] Create form container for configuration fields
- [ ] Add Save and Cancel buttons in footer
- [ ] Handle form submission and cancellation

**Acceptance Criteria:**
- Modal displays for any configured/unconfigured node
- Header shows appropriate node name
- Footer buttons are consistently positioned

---

### Task 5.5: Define Configuration Schemas with Zod

- [ ] Create `src/features/workflow/schemas/` directory
- [ ] Define `scheduleConfigSchema`:
  - `frequency: 'daily' | 'hourly' | 'weekly' | 'monthly'`
  - `timeOfDay: string` (HH:mm format)
  - `timezone: string`
  - `dayOfWeek?: number` (for weekly)
- [ ] Define `sendEmailConfigSchema`:
  - `to: string` (email format)
  - `subject: string` (required)
  - `body: string` (required)
  - `fromName?: string`
- [ ] Define `ifElseConfigSchema`:
  - `pathAConditions: ConditionGroup`
  - `pathBConditions: ConditionGroup`
- [ ] Export schemas and inferred types

**Acceptance Criteria:**
- All schemas validate correctly
- Type inference works from schemas
- Error messages are user-friendly

---

### Task 5.6: Create Schedule Trigger Configuration Form (FR-017, FR-018)

- [ ] Create `ScheduleConfigForm` component
- [ ] Add frequency select field (daily, hourly, weekly, monthly)
- [ ] Add time of day picker field
- [ ] Add timezone select field
- [ ] Add conditional day of week field (shows for weekly)
- [ ] Integrate with Zod validation
- [ ] Use ShadCN form components (Input, Select, Label)

**Acceptance Criteria:**
- All fields render correctly
- Validation errors display inline
- Conditional fields show/hide based on frequency

---

### Task 5.7: Create Send Email Configuration Form (FR-017, FR-018)

- [ ] Create `SendEmailConfigForm` component
- [ ] Add "To" email input with validation
- [ ] Add "Subject" text input
- [ ] Add "Body" textarea
- [ ] Add "From Name" optional input
- [ ] Integrate with Zod validation
- [ ] Show validation errors inline

**Acceptance Criteria:**
- Email field validates format
- Required fields show error when empty
- Form is accessible with proper labels

---

### Task 5.8: Create If/Else Configuration Form (FR-018a, FR-018b)

- [ ] Create `IfElseConfigForm` component
- [ ] Create tabbed interface for Path A / Path B conditions
- [ ] Create `ConditionRow` subcomponent:
  - Value source dropdown (mock data from previous nodes)
  - Operator dropdown (equals, not equals, greater than, contains, etc.)
  - Comparison value input
- [ ] Support adding/removing condition rows
- [ ] Support AND logic within each path
- [ ] Integrate with Zod validation

**Acceptance Criteria:**
- Both paths are configurable independently
- Conditions can be added and removed
- Validation ensures at least one condition per path

---

### Task 5.9: Implement Node Click Handler

- [ ] Add `onNodeClick` callback to Canvas component
- [ ] Create `useNodeInteraction` hook to manage:
  - Currently selected node
  - Modal open state
  - Modal type (selection vs configuration)
- [ ] Determine modal type based on node state:
  - `name: null` → Selection modal first
  - `name: NodeName` → Configuration modal directly
- [ ] Handle click events from custom node components

**Acceptance Criteria:**
- Clicking node with `name: null` opens selection modal
- Clicking node with `name` set opens configuration modal
- Modal state is managed centrally

---

### Task 5.10: Implement Node Selection Flow

- [ ] Wire `NodeSelectionModal` to node click for unconfigured nodes (`name: null`)
- [ ] On selection: update node with selected `name`
- [ ] On selection: immediately open configuration modal
- [ ] On cancel: revert any placeholder state
- [ ] Update workflow state via dispatch

**Acceptance Criteria:**
- Selecting a name (e.g., 'schedule') updates node's `name` field
- Configuration modal opens after selection
- Cancellation leaves node with `name: null`

---

### Task 5.11: Implement Node Configuration Save (FR-019)

- [ ] Validate form data with Zod schema on save
- [ ] If valid: update node config in workflow state
- [ ] If valid: mark node as 'configured'
- [ ] If valid: close modal
- [ ] If invalid: show errors, keep modal open
- [ ] Update node visual appearance to reflect configured state

**Acceptance Criteria:**
- Valid configuration saves and closes modal
- Invalid configuration shows errors
- Node displays configured state visually

---

### Task 5.12: Implement Modal Cancel Behavior (FR-020)

- [ ] Cancel button closes modal without saving
- [ ] X button closes modal without saving
- [ ] Clicking outside closes modal without saving
- [ ] Escape key closes modal without saving
- [ ] Unsaved changes are discarded
- [ ] Add confirmation dialog if changes detected (optional)

**Acceptance Criteria:**
- All close methods work consistently
- No partial saves occur
- Original state preserved on cancel

---

## Phase 6: Plus Node Interaction and Node Addition

**Goal:** Enable users to add new nodes to the workflow by clicking Plus helper nodes.

**Verification:** User can click a Plus node, select a node type, configure it, and see the new node appear in the workflow.

### Task 6.1: Implement Plus Node Click Handler (FR-014)

- [ ] Add click handler to `PlusNode` component
- [ ] On click: replace Plus node with Placeholder node
- [ ] On click: open Node Selection modal (actions only)
- [ ] Update workflow state to reflect placeholder
- [ ] Store reference to original Plus node position

**Acceptance Criteria:**
- Plus node transforms to placeholder on click
- Selection modal opens automatically
- Placeholder appears in correct position

---

### Task 6.2: Implement Node Insertion Logic

- [ ] Create `insertNodeAfter` function in workflow reducer
- [ ] Handle insertion in linear section:
  - Create new Action node at Plus position
  - Create new Plus node below new Action
  - Update edges to maintain connectivity
- [ ] Recalculate positions for all affected nodes
- [ ] Maintain Plus node placement rules (FR-013)

**Acceptance Criteria:**
- New node inserts at correct position
- Plus nodes remain between all consecutive nodes
- Edges reconnect correctly

---

### Task 6.3: Handle Selection Cancellation from Plus

- [ ] If user cancels selection modal:
  - Remove placeholder node
  - Restore original Plus node
  - Revert workflow state
- [ ] Ensure no orphaned nodes or edges
- [ ] Visual transition back to Plus node

**Acceptance Criteria:**
- Cancellation fully reverts state
- No console errors or warnings
- UI returns to pre-click state

---

### Task 6.4: Test Node Addition Flow End-to-End

- [ ] Verify clicking Plus between Trigger and Action:
  - Placeholder appears
  - Selection modal opens
  - Selecting "Send Email" creates Action node
  - Configuration modal opens
  - Saving configuration updates node
  - New Plus nodes appear correctly
- [ ] Verify clicking Plus at end of flow
- [ ] Verify multiple sequential additions

**Acceptance Criteria:**
- Full flow works without errors
- Node count increases correctly
- Edges maintain connectivity

---

## Phase 7: If/Else Branching Implementation

**Goal:** Enable users to add If/Else nodes that create branching paths in the workflow.

**Verification:** User can add an If/Else node and see two branch paths (Path A, Path B) with their own nodes.

### Task 7.1: Implement If/Else Node Creation (FR-026)

- [ ] When `name: 'if-else'` selected from catalog:
  - Create Action node with `{ type: 'action', name: 'if-else' }`
  - Create Branch A structure (id, label, parent reference)
  - Create Branch B structure
  - Create unconfigured Action node in each branch (`{ type: 'action', name: null }`)
  - Create Plus node below each branch Action
- [ ] Update edges for branching structure
- [ ] Store branch metadata in workflow state

**Acceptance Criteria:**
- If/Else node creates two branches
- Each branch has one Action node with `name: null`
- Each branch has a Plus node at the end

---

### Task 7.2: Implement Branch Layout Calculator

- [ ] Update `calculateNodePositions` for branches
- [ ] Position branch labels (Path A, Path B) below If/Else
- [ ] Position branch nodes horizontally offset:
  - Path A: `parentX - BRANCH_HORIZONTAL_SPACING / 2`
  - Path B: `parentX + BRANCH_HORIZONTAL_SPACING / 2`
- [ ] Maintain vertical spacing within branches
- [ ] Handle nested branches (future-proofing)

**Acceptance Criteria:**
- Branches appear side-by-side
- Vertical alignment is consistent
- No node overlap

---

### Task 7.3: Create Branch Label Component

- [ ] Create `BranchLabel` component
- [ ] Display branch name ("Path A", "Path B")
- [ ] Style as badge/pill above branch nodes
- [ ] Add dropdown menu for branch options (placeholder)
- [ ] Position relative to first node in branch

**Acceptance Criteria:**
- Labels clearly identify each branch
- Styling is consistent with Zapier reference
- Labels don't interfere with nodes

---

### Task 7.4: Create Branch Edge Routing

- [ ] Create custom edge component for branch connections
- [ ] Implement stepped edge path from If/Else to branches:
  - Vertical line down from If/Else
  - Horizontal split to each branch
  - Vertical line down to first branch node
- [ ] Style branch edges distinctly (optional)
- [ ] Handle edge animations (optional)

**Acceptance Criteria:**
- Edges clearly show branching structure
- No edge overlaps
- Visual hierarchy is clear

---

### Task 7.5: Implement Branch Path Independence (FR-028)

- [ ] Ensure editing Path A doesn't affect Path B
- [ ] Track `branchId` on all nodes within branches
- [ ] Filter nodes by branch when needed
- [ ] Maintain separate Plus node chains per branch
- [ ] Validate branch operations independently

**Acceptance Criteria:**
- Adding node to Path A doesn't change Path B
- Branch node counts are independent
- State updates are isolated

---

### Task 7.6: Test Branching Flow End-to-End

- [ ] Create workflow with If/Else node
- [ ] Configure If/Else conditions for both paths
- [ ] Add Action nodes to each branch
- [ ] Configure Action nodes in each branch
- [ ] Verify final workflow structure is correct
- [ ] Verify visual layout matches Zapier reference

**Acceptance Criteria:**
- Full branching flow works
- Configuration saves correctly
- Visual output matches expectations

---

## Phase 8: Node Deletion

**Goal:** Enable users to delete nodes from the workflow with proper cleanup.

**Verification:** User can delete nodes via context menu, confirm deletion, and see the workflow update correctly.

### Task 8.1: Create Node Context Menu (FR-021)

- [ ] Create `NodeContextMenu` component using ShadCN DropdownMenu
- [ ] Add "Delete" menu item with destructive styling
- [ ] Add "Configure" menu item (opens config modal)
- [ ] Trigger menu on right-click or menu button click
- [ ] Position menu relative to node

**Acceptance Criteria:**
- Context menu appears on right-click
- Menu items are clearly labeled
- Menu closes on item selection or outside click

---

### Task 8.2: Create Delete Confirmation Dialog

- [ ] Create `DeleteConfirmationDialog` component
- [ ] Display warning message about deletion
- [ ] Show node name being deleted
- [ ] Add "Cancel" and "Delete" buttons
- [ ] Style Delete button as destructive

**Acceptance Criteria:**
- Dialog clearly communicates action
- Cancel returns without deletion
- Delete confirms and proceeds

---

### Task 8.3: Implement Linear Node Deletion (FR-022)

- [ ] Create `deleteNode` function in workflow reducer
- [ ] Handle deletion in linear path:
  - Remove the node
  - Reconnect predecessor to successor
  - Ensure Plus node exists between remaining nodes
  - Recalculate positions
- [ ] Prevent deletion of initial Trigger node (FR-010)
- [ ] Update edges after deletion

**Acceptance Criteria:**
- Node is removed from workflow
- Path remains connected
- Plus nodes are correctly placed
- Trigger node cannot be deleted

---

### Task 8.4: Implement If/Else Deletion Rules (FR-023)

- [ ] Implement Option A: Disallow deletion if branches have children
- [ ] When attempting to delete If/Else with children:
  - Show error message
  - Prompt user to delete branch contents first
- [ ] Allow deletion of empty If/Else (no children in branches)
- [ ] Clean up branch structures on valid deletion

**Acceptance Criteria:**
- If/Else with children shows error on delete attempt
- Empty If/Else can be deleted
- Branch metadata is cleaned up

---

### Task 8.5: Implement Branch Node Deletion

- [ ] Handle deletion of nodes within a branch
- [ ] Maintain branch structure after deletion
- [ ] Ensure Plus nodes remain correctly placed
- [ ] Allow deletion of auto-created branch Action nodes
- [ ] Update branch node references

**Acceptance Criteria:**
- Branch nodes can be deleted
- Branch structure remains valid
- Plus nodes maintain correct positions

---

### Task 8.6: Test Deletion Scenarios

- [ ] Test deleting middle node in linear path
- [ ] Test deleting last node in linear path
- [ ] Test attempting to delete Trigger node
- [ ] Test deleting If/Else with empty branches
- [ ] Test attempting to delete If/Else with children
- [ ] Test deleting nodes within branches

**Acceptance Criteria:**
- All deletion scenarios work correctly
- No orphaned nodes or edges
- State consistency maintained

---

## Phase 9: Visual Polish and Node States

**Goal:** Refine visual appearance of nodes to clearly indicate configuration state and improve overall UX.

**Verification:** Users can easily distinguish configured vs unconfigured nodes, and the UI matches the quality of the Zapier reference.

### Task 9.1: Implement Node State Visual Indicators (FR-024)

- [ ] Create visual distinction for unconfigured nodes (`name: null`):
  - Dashed border
  - Muted colors
  - Warning/info icon
  - "Select..." or "Configure..." text
- [ ] Create visual distinction for configured nodes (`name` set):
  - Solid border
  - Full colors
  - Checkmark or success indicator
  - Node name displayed (e.g., "Schedule", "Send Email")

**Acceptance Criteria:**
- Configuration state (`name` null vs set) is immediately visible
- Visual language is consistent
- Accessibility contrast requirements met

---

### Task 9.2: Add Node Icons

- [ ] Add icon set for node names:
  - `schedule`: Calendar icon
  - `send-email`: Mail icon
  - `if-else`: Git branch icon
- [ ] Add icon for unconfigured Trigger (`name: null`): lightning bolt
- [ ] Add icon for unconfigured Action (`name: null`): plus-circle
- [ ] Size and position icons consistently

**Acceptance Criteria:**
- Each node name has unique icon
- Icons render crisply at all zoom levels
- Icon meanings are intuitive

---

### Task 9.3: Implement Step Numbers

- [ ] Calculate step numbers based on node order
- [ ] Display step number on each node ("1.", "2.", etc.)
- [ ] Handle branch numbering (e.g., "3.", "4." for Path A, "5.", "6." for Path B)
- [ ] Update numbers when nodes are added/removed
- [ ] Style step numbers consistently

**Acceptance Criteria:**
- Step numbers are sequential
- Numbers update on workflow changes
- Styling matches Zapier reference

---

### Task 9.4: Refine Edge Styling

- [ ] Style edges with consistent color (purple/blue gradient)
- [ ] Add edge stroke width appropriate for zoom levels
- [ ] Ensure edges connect at node center points
- [ ] Add subtle animation on edge creation (optional)
- [ ] Handle edge visibility at extreme zoom levels

**Acceptance Criteria:**
- Edges are visually pleasing
- Connection points are accurate
- Edges remain visible at all zoom levels

---

### Task 9.5: Add Hover and Focus States

- [ ] Add hover state to all interactive nodes:
  - Slight scale increase
  - Border color change
  - Shadow enhancement
- [ ] Add focus state for keyboard navigation
- [ ] Add press/active state feedback
- [ ] Ensure states don't conflict with configuration state indicators

**Acceptance Criteria:**
- Hover provides clear feedback
- Focus is visible for accessibility
- States are consistent across node types

---

### Task 9.6: Implement Loading States

- [ ] Add loading indicator for configuration save
- [ ] Add loading state to configuration modal
- [ ] Disable form during save operation
- [ ] Show success feedback on save complete
- [ ] Handle error states gracefully

**Acceptance Criteria:**
- User knows when save is in progress
- Form cannot be double-submitted
- Errors are clearly communicated

---

## Phase 10: Error Handling and Validation

**Goal:** Implement comprehensive error handling and validation throughout the application.

**Verification:** Validation errors display correctly, error boundaries catch failures, and the application never enters a broken state.

### Task 10.1: Implement Validation Error Display (FR-025)

- [ ] Create `FormError` component for inline errors
- [ ] Position errors below relevant form fields
- [ ] Style errors with red color and icon
- [ ] Support multiple errors per field
- [ ] Add aria-describedby for accessibility

**Acceptance Criteria:**
- Errors appear next to invalid fields
- Error messages are user-friendly
- Screen readers announce errors

---

### Task 10.2: Create Error Summary Component

- [ ] Create `ErrorSummary` component for form-level errors
- [ ] List all validation errors in one location
- [ ] Link errors to their respective fields (scroll/focus)
- [ ] Display at top of configuration modal
- [ ] Hide when no errors present

**Acceptance Criteria:**
- All errors are summarized
- Clicking error focuses relevant field
- Summary updates in real-time

---

### Task 10.3: Implement Error Boundary for Canvas

- [ ] Create `CanvasErrorBoundary` component
- [ ] Display friendly error message when canvas fails
- [ ] Provide "Refresh" button to recover
- [ ] Log errors for debugging
- [ ] Prevent full app crash

**Acceptance Criteria:**
- Canvas errors are caught
- User sees helpful error message
- Recovery action is available

---

### Task 10.4: Implement Workflow State Validation

- [ ] Create `validateWorkflowState` function
- [ ] Check for orphaned nodes (no edges)
- [ ] Check for missing required fields
- [ ] Validate edge connectivity
- [ ] Return `Result<void, ValidationError[]>`

**Acceptance Criteria:**
- Invalid states are detected
- Specific errors are identified
- Validation is comprehensive

---

### Task 10.5: Add Toast Notifications

- [ ] Install and configure ShadCN Sonner (toast)
- [ ] Create toast for successful save
- [ ] Create toast for validation errors
- [ ] Create toast for unexpected errors
- [ ] Position toasts appropriately

**Acceptance Criteria:**
- Toasts appear for key actions
- Toasts are dismissible
- Toasts don't block interaction

---

## Phase 11: Final Integration and Testing

**Goal:** Ensure all features work together seamlessly and the application is ready for demonstration.

**Verification:** Complete end-to-end workflow can be created, configured, and edited without errors.

### Task 11.1: End-to-End Integration Test

- [ ] Create comprehensive test scenario:
  1. App loads with initial workflow
  2. Configure Schedule trigger
  3. Add Send Email action
  4. Configure Send Email
  5. Add If/Else node
  6. Configure If/Else conditions
  7. Add actions to both branches
  8. Configure branch actions
  9. Delete a node
  10. Verify final state
- [ ] Document test steps and expected outcomes

**Acceptance Criteria:**
- Full workflow can be built without errors
- All configurations save correctly
- Deletion works as expected

---

### Task 11.2: Accessibility Audit

- [ ] Run automated accessibility checks (axe, lighthouse)
- [ ] Verify keyboard navigation through entire app
- [ ] Test with screen reader
- [ ] Ensure color contrast meets WCAG AA
- [ ] Add missing ARIA labels

**Acceptance Criteria:**
- No critical accessibility issues
- Keyboard navigation is complete
- Screen reader can navigate workflow

---

### Task 11.3: Performance Verification (FR-033)

- [ ] Test with 50+ nodes
- [ ] Verify canvas remains responsive
- [ ] Check for memory leaks
- [ ] Profile render performance
- [ ] Optimize if needed

**Acceptance Criteria:**
- 50 nodes render smoothly
- No significant lag on interactions
- Memory usage is stable

---

### Task 11.4: Browser Compatibility Check

- [ ] Test in Chrome (latest)
- [ ] Test in Firefox (latest)
- [ ] Test in Safari (latest)
- [ ] Test in Edge (latest)
- [ ] Document any browser-specific issues

**Acceptance Criteria:**
- Core functionality works in all browsers
- Visual appearance is consistent
- No blocking bugs in any browser

---

### Task 11.5: Documentation

- [ ] Document project setup instructions
- [ ] Document folder structure and architecture
- [ ] Document key components and their purposes
- [ ] Document state management approach
- [ ] Create troubleshooting guide

**Acceptance Criteria:**
- New developer can set up project
- Architecture is understood
- Common issues have solutions

---

### Task 11.6: Final Review and Cleanup

- [ ] Remove debug code and console logs
- [ ] Remove unused imports and variables
- [ ] Ensure consistent code formatting
- [ ] Review and update comments
- [ ] Verify all tests pass
- [ ] Create production build

**Acceptance Criteria:**
- No debug artifacts in code
- Build succeeds without warnings
- All tests pass

---

## Summary

| Phase | Description | Tasks | Testable Outcome |
|-------|-------------|-------|------------------|
| 1 | Project Setup | 7 | App runs, linting passes |
| 2 | Canvas Foundation | 6 | Empty canvas with pan/zoom |
| 3 | Data Model | 7 | Workflow state initialized |
| 4 | Node Rendering | 10 | Nodes visible on canvas |
| 5 | Configuration Modals | 12 | Nodes can be configured |
| 6 | Node Addition | 4 | Plus nodes add new nodes |
| 7 | Branching | 6 | If/Else creates branches |
| 8 | Node Deletion | 6 | Nodes can be deleted |
| 9 | Visual Polish | 6 | Professional appearance |
| 10 | Error Handling | 5 | Robust error management |
| 11 | Final Testing | 6 | Production-ready app |

**Total Tasks: 75**

---

## Notes

### Dependencies Between Phases

- Phase 2 requires Phase 1 completion
- Phase 3 requires Phase 2 completion
- Phase 4 requires Phase 3 completion
- Phases 5-8 can proceed in parallel after Phase 4
- Phase 9 can proceed after Phase 5
- Phase 10 can proceed after Phase 5
- Phase 11 requires all previous phases

### Risk Mitigation

- Start with simplest implementations, iterate
- Test frequently during development
- Keep React Flow abstracted to allow replacement
- Use feature flags for incomplete features if needed

### Future Considerations (Out of Scope)

- Workflow persistence (save/load)
- Workflow execution engine
- Additional node types
- User authentication
- Undo/redo functionality
- Workflow templates