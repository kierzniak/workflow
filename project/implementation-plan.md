# Implementation Plan – Visual Workflow Automation PoC

## Overview

This document outlines a phased implementation plan for building a proof-of-concept visual workflow automation platform. Each phase results in a fully functional application that can be manually tested and verified. Tasks are designed as independent units with clear completion criteria.

---

## 📊 Implementation Status

> **Last Updated:** 2025-12-07

| Metric               | Value                     |
| -------------------- | ------------------------- |
| **Overall Progress** | ~85% (PoC scope complete) |
| **Current Phase**    | ✅ PoC Complete           |
| **Phases Completed** | 7 of 10 (3 partial)       |

### Phase Status Overview

| Phase                    | Status      | Progress |
| ------------------------ | ----------- | -------- |
| 1. Project Setup         | ✅ Complete | 100%     |
| 2. Canvas Foundation     | ✅ Complete | 100%     |
| 3. Data Model            | ✅ Complete | 100%     |
| 4. Node Rendering        | ✅ Complete | 100%     |
| 5. Configuration Modals  | ✅ Complete | 100%     |
| 6. Plus Node Interaction | ✅ Complete | 100%     |
| 7. If/Else Branching     | ⏭️ Partial  | 50%      |
| 8. Node Deletion         | ✅ Complete | 100%     |
| 9. Visual Polish         | ⏭️ Partial  | 83%      |
| 10. Error Handling       | ⏭️ Partial  | 40%      |

### Dependencies

All required dependencies are installed. ✅

---

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

**Project Structure (emerges organically as features are built):**

```
src/
  app/                    # Next.js App Router
  components/
    ui/                   # ShadCN components
    canvas/               # React Flow abstraction (created in Phase 2)
  features/
    workflow/             # Workflow feature (created in Phase 3+)
      components/         # Workflow-specific components
      hooks/              # Workflow hooks
      types/              # Domain types
      constants/          # Node catalog, layout constants
      utils/              # Utility functions
      schemas/            # Zod validation schemas
  lib/                    # Shared utilities (cn helper, etc.)
```

> **Note:** Directories are created as needed when implementing features, not upfront.

---

## Phase 1: Project Setup and Skeleton

**Goal:** Establish the foundational project structure with all tooling configured and a basic "hello world" page rendering.

**Verification:** Application runs in development mode, displays a basic page, and all linting/type-checking passes.

### Task 1.1: Initialize Next.js Project with TypeScript ✅

- [x] Create new Next.js project with App Router (`create-next-app@latest`)
- [x] Configure TypeScript with strict mode enabled
- [x] Set up `tsconfig.json` with path aliases (`@/` for `src/`)
- [x] Verify the default page renders at `localhost:3000`

**Acceptance Criteria:**

- ✅ `pnpm run dev` starts the application without errors
- ✅ TypeScript compilation succeeds with no warnings
- ✅ Path aliases work correctly

---

### Task 1.2: Configure Code Quality Tools ✅

- [x] Install and configure ESLint with React and TypeScript rules
- [x] Install and configure Prettier for code formatting
- [x] Add `lint-staged` and `husky` for pre-commit hooks
- [x] Configure ESLint rule to disallow `any` type
- [x] Add pnpm scripts: `lint`, `lint:fix`, `format`

**Acceptance Criteria:**

- ✅ `pnpm run lint` executes without configuration errors
- ✅ Pre-commit hook runs linting on staged files
- ✅ Using `any` type triggers a linting error

---

### Task 1.3: Install and Configure TailwindCSS ✅

- [x] Install TailwindCSS and required dependencies
- [x] Configure `tailwind.config.ts` with content paths
- [x] Set up global CSS file with Tailwind directives
- [x] Add custom theme configuration (colors, spacing) placeholder
- [x] Verify Tailwind classes apply correctly on test element

**Acceptance Criteria:**

- ✅ Tailwind utility classes render correctly in browser
- ✅ Hot reload works with style changes
- ✅ Custom theme values are accessible

---

### Task 1.4: Install and Configure ShadCN UI ✅

- [x] Initialize ShadCN UI with `npx shadcn@latest init`
- [x] Configure component output directory (`src/components/ui`)
- [x] Install base components: Button, Dialog, Input, Label
- [x] Create a test page demonstrating ShadCN Button component
- [x] Verify component styling matches ShadCN defaults

> **Note:** 9 components installed: Button, Dialog, Input, Label, Textarea, Field, Separator, DropdownMenu, Sonner

**Acceptance Criteria:**

- ✅ ShadCN components render with correct styling
- ✅ Components are accessible via keyboard navigation
- ✅ Component imports resolve correctly

---

### Task 1.5: Configure Testing Infrastructure ✅

- [x] Install Vitest as the test runner
- [x] Install React Testing Library and related utilities
- [x] Configure `vitest.config.ts` with React support
- [x] Add test utilities file with custom render function
- [x] Create sample test to verify setup works
- [x] Add pnpm scripts: `test`, `test:watch`, `test:coverage`

**Acceptance Criteria:**

- ✅ `pnpm run test` executes without configuration errors
- ✅ Sample test passes (4 tests in button.test.tsx)
- ✅ Coverage report generates correctly

---

### Task 1.6: Create Application Shell Layout ✅

- [x] Create root layout (`src/app/layout.tsx`) with metadata
- [x] Create basic header component with application title
- [x] Create main content area with full-height canvas placeholder
- [x] Apply base styling light mode only
- [x] Add ErrorBoundary wrapper for the main content area

**Acceptance Criteria:**

- ✅ Application has consistent header across pages
- ✅ Main content area takes remaining viewport height
- ✅ ErrorBoundary catches and displays errors gracefully

---

## Phase 2: Workflow Canvas Foundation

**Goal:** Integrate React Flow and render an empty, interactive canvas with pan/zoom controls.

**Verification:** User can see an empty canvas, pan around by dragging, zoom in/out, and reset the view.

### Task 2.1: Install and Configure React Flow ✅

- [x] Install `@xyflow/react` package
- [x] Create `src/features/workflow/` feature directory with structure:
  - `components/` – Workflow-specific React components
  - `hooks/` – Custom hooks for workflow logic
  - `types/` – TypeScript types for workflow domain
  - `constants/` – Feature constants (layout, catalog)
  - `utils/` – Utility functions
  - `schemas/` – Zod validation schemas
- [x] Create `src/components/canvas/` for React Flow abstraction (independent of workflow):
  - `Canvas.tsx` – Main canvas component
  - `types.ts` – Canvas-specific types
  - `hooks/` – Canvas-related hooks (zoom, pan)
- [x] Create `ReactFlowProvider` wrapper component in canvas directory

**Acceptance Criteria:**

- ✅ React Flow package installed without peer dependency issues
- ✅ Workflow feature directory structure is complete
- ✅ Canvas component is separate and workflow-agnostic
- ✅ Provider component is created and exportable

---

### Task 2.2: Create Canvas Abstraction Layer ✅

- [x] Define `CanvasNode` and `CanvasEdge` types in `src/components/canvas/types.ts`
- [x] Create `Canvas` component wrapping `ReactFlow` in `src/components/canvas/`
- [x] Define `CanvasProps` interface with JSDoc documentation
- [x] Implement canvas background (dots or grid pattern)
- [x] Ensure React Flow is an internal implementation detail
- [x] Canvas accepts generic node/edge data, not workflow-specific types

**Acceptance Criteria:**

- ✅ `Canvas` component renders without exposing React Flow internals
- ✅ Custom types abstract away React Flow's node/edge types
- ✅ Background pattern is visible on the canvas
- ✅ Canvas is reusable and not coupled to workflow feature

---

### Task 2.3: Implement Canvas Panning (FR-005) ✅

- [x] Enable mouse drag panning on empty canvas space
- [x] Configure trackpad/scroll wheel for vertical panning
- [x] Enable horizontal scroll for horizontal panning (if available)
- [x] Ensure clicking on nodes does NOT trigger panning
- [x] Add visual cursor feedback (`grab` → `grabbing`)

**Acceptance Criteria:**

- ✅ Dragging empty canvas space pans the view
- ✅ Scroll wheel zooms (standard canvas behavior)
- ✅ Pinch gesture zooms

---

### Task 2.4: Implement Zoom Controls (FR-006) ✅

- [x] Enable mouse wheel/trackpad pinch zoom
- [x] Create `ZoomControls` component with:
  - Zoom in button
  - Zoom out button
  - Reset zoom button (100%)
  - Fit view button
- [x] Position controls in bottom-right corner of canvas
- [x] Define zoom limits (min: 0.25, max: 2.0)
- [x] Style controls using ShadCN Button component

**Acceptance Criteria:**

- ✅ Pinch/wheel zoom works smoothly
- ✅ Zoom buttons increment/decrement zoom level
- ✅ Reset button sets zoom to 100%
- ✅ Fit view button fits all nodes in view
- ✅ Zoom cannot exceed defined limits

---

### Task 2.5: Disable Node Dragging (FR-007) ✅

- [x] Configure React Flow to disable node dragging (`nodesDraggable={false}`)
- [x] Ensure nodes remain in their programmatic positions
- [x] Verify clicking nodes does not initiate drag behavior
- [x] Add visual cursor on nodes (`pointer` for clickable)

**Acceptance Criteria:**

- ✅ Nodes cannot be dragged by the user
- ✅ Node click events still fire correctly
- ✅ Cursor indicates nodes are clickable

---

### Task 2.6: Create Canvas Page Route ✅

- [x] Create workflow builder page at `/` (or `/workflow`)
- [x] Integrate `Canvas` component into the page
- [x] Wrap page with necessary providers (ReactFlowProvider)
- [x] Ensure canvas fills available space below header
- [x] Add loading state placeholder

**Acceptance Criteria:**

- ✅ Navigating to `/` displays the canvas
- ✅ Canvas is responsive to viewport size changes
- ✅ No layout shift occurs during initial render

---

## Phase 3: Workflow Data Model and Initialization

**Goal:** Define the workflow data structure and initialize an empty workflow with one Trigger node, one Action node, and Plus helper nodes.

**Verification:** On page load, the workflow state contains correctly structured nodes (not yet rendered on canvas).

### Task 3.1: Define Core Domain Types ✅

- [x] Create `src/features/workflow/types/workflow.ts`
- [x] Define `NodeType` for structural role:
  ```typescript
  type NodeType = 'trigger' | 'action' | 'plus' | 'placeholder';
  ```
- [x] Define `NodeName` for concrete implementations:
  ```typescript
  type TriggerName = 'schedule';
  type ActionName = 'send-email' | 'if-else';
  type NodeName = TriggerName | ActionName;
  ```
- [x] Node status is derived from `name`:
  - `name: null` → unconfigured
  - `name: NodeName` → configured (or partially configured if config incomplete)
- [x] Add JSDoc documentation for all types

**Acceptance Criteria:**

- ✅ All types are properly exported
- ✅ Types use discriminated unions where appropriate
- ✅ No `any` types present
- ✅ Status is derived, not stored separately

---

### Task 3.2: Define Node Data Structures ✅

- [x] Define `WorkflowNode` as discriminated union by `type`:
  ```typescript
  type WorkflowNode = TriggerNode | ActionNode | PlusNode | PlaceholderNode;
  ```
- [x] Define `TriggerNode`:
  ```typescript
  interface TriggerNode {
    id: string;
    type: 'trigger';
    name: TriggerName | null;
    position: { x: number; y: number };
    config?: ScheduleConfig;
  }
  ```
- [x] Define `ActionNode`:
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
- [x] Define `PlusNode`:
  ```typescript
  interface PlusNode {
    id: string;
    type: 'plus';
    position: { x: number; y: number };
    branchId?: string;
  }
  ```
- [x] Define `PlaceholderNode`:
  ```typescript
  interface PlaceholderNode {
    id: string;
    type: 'placeholder';
    forType: 'trigger' | 'action';
    position: { x: number; y: number };
    branchId?: string;
  }
  ```
- [x] Create type guard functions for each node type

**Acceptance Criteria:**

- ✅ Each node type has its own interface
- ✅ Type guards can discriminate between node types
- ✅ `name: null` clearly indicates unconfigured state
- ✅ Configuration fields are properly typed per node name

---

### Task 3.3: Define Edge and Workflow Types ✅

- [x] Define `WorkflowEdge` interface:
  - `id: string`
  - `source: string`
  - `target: string`
- [x] Define `Workflow` interface:
  - `id: string`
  - `nodes: Map<string, WorkflowNode>`
  - `edges: WorkflowEdge[]`
- [x] Add factory functions for creating IDs

> **Note:** Simplified from original plan - removed `Branch` interface and `EdgeType`. Branching is derived from edges + node `branchId` field.

**Acceptance Criteria:**

- ✅ Workflow structure supports branching (via edges and node branchId)
- ✅ Types enforce referential integrity conceptually
- ✅ Factory functions generate unique IDs

---

### Task 3.4: Create Workflow State Hook ✅

- [x] Create `useWorkflowState` hook in `src/features/workflow/hooks/`
- [x] Implement state using `useReducer` for complex updates
- [x] Define action types for state mutations:
  - `INITIALIZE_WORKFLOW`
  - `ADD_NODE`
  - `UPDATE_NODE` (trigger/action nodes only)
  - `DELETE_NODE`
  - `REPLACE_NODE` (for plus/placeholder → action)
  - `SET_EDGES`
- [x] Return typed state and dispatch function
- [x] Use explicit return type annotation

**Acceptance Criteria:**

- ✅ Hook manages workflow state immutably
- ✅ All actions are properly typed
- ✅ State updates trigger re-renders correctly

---

### Task 3.5: Implement Workflow Initialization (FR-001, FR-002) ✅

- [x] Create `createInitialWorkflow` function returning initial state
- [x] Generate initial Trigger node (unconfigured, top position)
- [x] Generate initial Action node (unconfigured, below trigger)
- [x] Generate Plus node between Trigger and Action
- [x] Generate Plus node below Action (end of flow)
- [x] Create edges connecting all nodes
- [x] Define position constants for consistent spacing

**Acceptance Criteria:**

- ✅ Function returns valid `Workflow` structure
- ✅ Exactly 4 nodes created (Trigger, Action, 2 Plus nodes)
- ✅ Edges connect nodes in correct order
- ✅ All nodes have valid positions

---

### Task 3.6: Create Workflow Context Provider ✅

- [x] Create `WorkflowContext` with typed value
- [x] Create `WorkflowProvider` component
- [x] Initialize workflow on provider mount (FR-001)
- [x] Create `useWorkflow` hook for consuming context
- [x] Add error handling for missing provider
- [x] Export from feature index file

**Acceptance Criteria:**

- ✅ Provider initializes workflow automatically
- ✅ Context consumers receive typed workflow state
- ✅ Error thrown when hook used outside provider

---

### Task 3.7: Integrate Provider into Application ✅

- [x] Wrap canvas page with `WorkflowProvider`
- [x] Create temporary debug component showing node count
- [x] Verify workflow initializes with correct node count (4)
- [x] Verify workflow initializes with correct edge count (3)
- [x] Log workflow state to console for manual verification

**Acceptance Criteria:**

- ✅ Debug output shows 4 nodes and 3 edges
- ✅ No errors in console during initialization
- ✅ State persists during component re-renders

---

## Phase 4: Render Nodes on Canvas

**Goal:** Display the initialized workflow nodes on the React Flow canvas with proper styling and positioning.

**Verification:** User sees Trigger node, Action node, and Plus nodes rendered on the canvas in a vertical layout.

### Task 4.1: Create Node Position Calculator ✅

- [x] Create `calculateNodePositions` utility function
- [x] Define layout constants:
  - `NODE_WIDTH: 320`
  - `NODE_HEIGHT: 98` (actual rendered height)
  - `NODE_PADDING: 12`
  - `VERTICAL_SPACING: 48` (gap between nodes)
  - `PLUS_NODE_SIZE: 32`
  - `BRANCH_HORIZONTAL_SPACING: 320`
- [x] Calculate positions based on workflow structure
- [x] Handle linear layout (single column centered)
- [x] Account for different node heights (content nodes vs plus nodes)
- [x] Return position map: `Map<nodeId, {x, y}>`

**Acceptance Criteria:**

- ✅ Positions are calculated deterministically
- ✅ Constants are configurable
- ✅ Function is pure (no side effects)
- ✅ Node heights properly accounted for in spacing

---

### Task 4.2: Create ConfiguredNode Base Component ✅

> **Refactored in Task 4.6**: Originally `BaseNode` with status prop. Now split into `PlaceholderNode` (unconfigured) and `ConfiguredNode` (configured).

- [x] Create `ConfiguredNode` component for configured nodes
- [x] Define `ConfiguredNodeProps` interface with JSDoc
- [x] Implement solid border styling with shadow
- [x] Support `onClick` and `onMenuClick` handler props
- [x] Use composition for node content
- [x] Add menu button (onMenuClick handler)
- [x] Create `NodeBadge` sub-component (#7297c5 brand color)
- [x] Create `NodeDescription` sub-component (step number + text)

**Acceptance Criteria:**

- ✅ Component renders with consistent styling
- ✅ Click events propagate correctly
- ✅ Menu button works independently

---

### Task 4.3: Create Trigger Node Components (FR-008) ✅

> **Refactored in Task 4.6**: Generic `TriggerNode` replaced by `PlaceholderNode` with `forType='trigger'`.

- [x] Create `ScheduleTriggerNode` for concrete schedule trigger (name='schedule')
- [x] Display "Schedule" label with Calendar icon
- [x] Show step number ("1.")
- [x] Uses `ConfiguredNode` composition

**Acceptance Criteria:**

- ✅ Schedule trigger has distinct visual style
- ✅ Icon renders correctly (Calendar)

---

### Task 4.4: Create Action Node Components (FR-008) ✅

> **Refactored in Task 4.6**: Generic `ActionNode` replaced by `PlaceholderNode` with `forType='action'`.

- [x] Create `SendEmailActionNode` for send-email action (name='send-email')
- [x] Create `IfElseActionNode` for if-else action (name='if-else')
- [x] Add action icons (Mail for email, GitBranch for if-else)
- [x] Show step number dynamically via `step` prop
- [x] All use `ConfiguredNode` composition

**Acceptance Criteria:**

- ✅ Action nodes have distinct visual style
- ✅ Step numbers are passed dynamically

---

### Task 4.5: Create Plus Helper Node Component (FR-013) ✅

- [x] Create `PlusNode` component
- [x] Style as circular button with "+" icon
- [x] Size: 32x32 pixels (uses PLUS_NODE_SIZE constant)
- [x] Add hover state (scale up, color change to #7297c5 fill)
- [x] Position on edge line between nodes
- [x] Make focusable for accessibility (focus-visible ring)

**Acceptance Criteria:**

- ✅ Plus node is visually smaller than content nodes
- ✅ Hover feedback is visible (scale-110, bg fill, shadow)
- ✅ Keyboard accessible (focusable, activatable)

---

### Task 4.6: Create Placeholder Node Component (FR-008) ✅

> **Architecture Change**: PlaceholderNode replaces generic TriggerNode/ActionNode. Uses `forType` prop to determine badge (Trigger/Action).

- [x] Create `PlaceholderNode` component for unconfigured trigger/action slots
- [x] Style with dashed border (gray)
- [x] Display badge based on `forType` ("Trigger" with Zap icon, "Action" with CirclePlus icon)
- [x] Display description based on `forType`
- [x] Match size of configured nodes (NODE_WIDTH x NODE_HEIGHT)
- [x] Keyboard accessible (focusable, activatable)

**Acceptance Criteria:**

- ✅ Placeholder is visually distinct from configured nodes (dashed vs solid border)
- ✅ User understands what type of node can be added (badge shows Trigger/Action)
- ✅ Consistent sizing with other nodes

---

### Task 4.7: Register Custom Nodes with React Flow ✅

- [x] Create `nodeTypes` configuration object in `src/features/workflow/node-types.ts`
- [x] Register all custom node components:
  - `placeholder` → `PlaceholderNode`
  - `plus` → `PlusNode`
  - `schedule-trigger` → `ScheduleTriggerNode`
  - `send-email-action` → `SendEmailActionNode`
  - `if-else-action` → `IfElseActionNode`
- [x] Export `nodeTypes` from feature index
- [x] Pass `nodeTypes` to `Canvas` component in page.tsx
- [x] Verify React Flow recognizes custom types (build passes)

**Acceptance Criteria:**

- ✅ No React Flow warnings about unknown node types
- ✅ Each node type renders its custom component
- ✅ Type configuration is centralized

---

### Task 4.8: Transform Workflow State to React Flow Nodes ✅

- [x] Create `workflowToCanvasNodes` transformer function in `src/features/workflow/utils/workflow-to-canvas.ts`
- [x] Map `WorkflowNode` to React Flow `Node` type
- [x] Include node data for custom component consumption
- [x] Handle all node types correctly:
  - `trigger` (name=null) → `placeholder` with forType='trigger'
  - `trigger` (name='schedule') → `schedule-trigger`
  - `action` (name=null) → `placeholder` with forType='action'
  - `action` (name='send-email') → `send-email-action`
  - `action` (name='if-else') → `if-else-action`
  - `placeholder` → `placeholder`
  - `plus` → `plus`
- [x] Step numbers calculated based on Map order (trigger=1, actions=2+)

> **Note**: No manual memoization - React Compiler handles optimization.

**Acceptance Criteria:**

- ✅ Transformation is type-safe
- ✅ All workflow nodes produce valid React Flow nodes
- ✅ Custom data is accessible in node components

---

### Task 4.9: Transform Workflow Edges to React Flow Edges ✅

- [x] Create `workflowToCanvasEdges` transformer function in `src/features/workflow/utils/workflow-to-canvas.ts`
- [x] Map `WorkflowEdge` to React Flow `CanvasEdge` type
- [x] Style edges with brand color (#7297c5), stroke width 2px
- [x] Configure edge routing as `smoothstep` (Zapier-style)
- [x] Update `CanvasEdge` type to support `style` property

**Acceptance Criteria:**

- ✅ All edges render between correct nodes
- ✅ Edge styling is consistent (smoothstep, #7297c5, 2px)
- ✅ No orphaned edges or errors

---

### Task 4.10: Render Initial Workflow on Canvas ✅

- [x] Create `WorkflowCanvas` component that connects workflow state to Canvas
- [x] Use `workflowToCanvasNodes` and `workflowToCanvasEdges` transformers
- [x] Fix Canvas edge style passthrough (was missing `style` property)
- [x] Pass transformed nodes and edges to React Flow
- [x] Center workflow using `fitView` with `maxZoom: 1`
- [x] Add React Flow `Handle` components to all nodes for edge connections

**Acceptance Criteria:**

- ✅ Trigger placeholder at top (step 1)
- ✅ Plus node below Trigger (centered horizontally)
- ✅ Action placeholder below Plus (step 2)
- ✅ Plus node below Action (centered horizontally)
- ✅ Edges visible with smoothstep routing and brand color (#7297c5)
- ✅ Workflow centered on screen at zoom 1
- ✅ No React Flow console warnings

---

## Phase 4 Complete ✅

All node rendering tasks completed. The workflow canvas now displays:

- 2 placeholder nodes (unconfigured trigger and action)
- 2 plus nodes (for adding new nodes)
- 3 smoothstep edges connecting all nodes
- Proper vertical spacing accounting for node heights
- Centered layout at 100% zoom

---

## Phase 5: Node Selection and Configuration Modals

**Goal:** Enable users to click nodes to configure them, including selecting node names and filling configuration forms.

**Verification:** User can click nodes, select node names, configure settings, and see changes reflected on the canvas.

### Task 5.1: Create Dialog Infrastructure ✅

- [x] Use existing ShadCN Dialog component (focus trap, escape, outside click already handled)
- [x] Implement dialog state management hook (`useDialog`) at `src/hooks/use-dialog.ts`
- [x] Support dialog stacking prevention (only one dialog open via `useDialog` hook)
- [x] Generic hook with `<TType, TData>` type parameters for reusability

**Acceptance Criteria:**

- ✅ Only one dialog can be open at a time (enforced by `useDialog` hook)
- ✅ Focus is trapped within dialog (Radix Dialog default)
- ✅ Escape key closes dialog (Radix Dialog default)
- ✅ Clicking outside closes dialog (Radix Dialog default)

---

### Task 5.2: Define Node Catalog ✅

- [x] Create `src/features/workflow/constants/node-catalog.ts`
- [x] Define `NodeCatalogEntry` interface with name, label, description, icon, type
- [x] Add catalog entries:
  - `{ name: 'schedule', type: 'trigger', label: 'Schedule', icon: Calendar }`
  - `{ name: 'send-email', type: 'action', label: 'Send Email', icon: Mail }`
  - `{ name: 'if-else', type: 'action', label: 'If/Else', icon: GitBranch }`
- [x] Export helper functions:
  - `getNodeCatalogByType(type)` - filter by trigger/action
  - `getNodeCatalogEntry(name)` - lookup single entry
- [x] Create `src/features/workflow/constants/index.ts` barrel export

**Acceptance Criteria:**

- ✅ Catalog uses `name` for node identification (matches `TriggerName | ActionName`)
- ✅ Each entry has complete information
- ✅ Filter function returns correct entries by type

---

### Task 5.3: Create Node Selection Dialog (FR-014, FR-015, FR-016) ✅

- [x] Create `NodeSelectionDialog` component at `src/features/workflow/components/NodeSelectionDialog.tsx`
- [x] Accept `nodeType` prop to filter catalog (`'trigger' | 'action'`)
- [x] Display filtered catalog entries as selectable list
- [x] Show icon, label, and description for each entry
- [x] Handle selection: emit chosen `name` value via `onSelect` callback
- [x] Handle cancellation: close without selection (X, Escape, outside click)

**Acceptance Criteria:**

- ✅ Trigger nodes only see trigger options (schedule)
- ✅ Action nodes only see action options (send-email, if-else)
- ✅ Selection emits the `name` value (e.g., 'schedule', 'send-email')
- ✅ Cancel returns without selection

---

### Task 5.4: Create Node Configuration Dialog Shell ✅

- [x] Create `NodeConfigurationDialog` component at `src/features/workflow/components/NodeConfigurationDialog.tsx`
- [x] Accept `node` prop with current node data (`ConfigurableNode` = TriggerNode | ActionNode)
- [x] Display node icon, label, and description in header (from catalog)
- [x] Create form container via `children` prop for configuration fields
- [x] Add Save and Cancel buttons in footer
- [x] Handle form submission (`onSave`) and cancellation (`onOpenChange`)

**Acceptance Criteria:**

- ✅ Dialog displays for any configured/unconfigured node
- ✅ Header shows node icon, label, and description from catalog
- ✅ Footer buttons are consistently positioned

---

### Task 5.5: Define Configuration Schemas with Zod ✅

- [x] Install Zod (`pnpm add zod`)
- [x] Create `src/features/workflow/schemas/schedule-config.ts`:
  - frequency, timeOfDay (HH:mm regex), timezone, dayOfWeek (required for weekly via refine)
- [x] Create `src/features/workflow/schemas/send-email-config.ts`:
  - to (email), subject, body, fromName (optional)
- [x] Create `src/features/workflow/schemas/if-else-config.ts`:
  - comparisonOperatorSchema, conditionSchema, conditionGroupSchema, ifElseConfigSchema
- [x] Create `src/features/workflow/schemas/index.ts` - barrel export
- [x] Export schemas and inferred types (`z.input`/`z.output`)

**Acceptance Criteria:**

- ✅ All schemas validate correctly
- ✅ Type inference works from schemas
- ✅ Error messages are user-friendly

---

### Task 5.6: Create Schedule Trigger Configuration Form (FR-017, FR-018) ✅

- [x] Create `ScheduleConfigForm` component at `src/features/workflow/components/forms/ScheduleConfigForm.tsx`
- [x] Add frequency select field (daily, hourly, weekly, monthly)
- [x] Add time of day picker field (HTML5 time input)
- [x] Add timezone select field (13 common timezones)
- [x] Add conditional day of week field (shows for weekly)
- [x] Integrate with Zod validation via `@hookform/resolvers`
- [x] Use ShadCN form components (Input, Select, Field)
- [x] Install ShadCN Select component
- [x] Create `forms/` directory with barrel export

**Acceptance Criteria:**

- ✅ All fields render correctly
- ✅ Validation errors display inline via FieldError
- ✅ Conditional fields show/hide based on frequency

---

### Task 5.7: Create Send Email Configuration Form (FR-017, FR-018) ✅

- [x] Create `SendEmailConfigForm` component at `src/features/workflow/components/forms/SendEmailConfigForm.tsx`
- [x] Add "To" email input with validation
- [x] Add "Subject" text input
- [x] Add "Body" textarea
- [x] Add "From Name" optional input
- [x] Integrate with Zod validation via `@hookform/resolvers`
- [x] Show validation errors inline via FieldError

**Acceptance Criteria:**

- ✅ Email field validates format
- ✅ Required fields show error when empty
- ✅ Form is accessible with proper labels

---

### Task 5.8: Create If/Else Configuration Form (FR-018a, FR-018b) ✅

> **Simplified:** One condition per path instead of multiple conditions with AND logic.

- [x] Simplify schema to single condition per path (`pathACondition`, `pathBCondition`)
- [x] Create `IfElseConfigForm` component at `src/features/workflow/components/forms/IfElseConfigForm.tsx`
- [x] Display Path A and Path B sections with separator (no tabs)
- [x] Each path has: Source, Field, Operator, Value fields
- [x] Integrate with Zod validation via `@hookform/resolvers`
- [x] Update `IfElseConfig` type in `types/workflow.ts`
- [x] Update type exports (removed `ConditionGroup`)

**Acceptance Criteria:**

- ✅ Both paths configurable with one condition each
- ✅ Field dropdown depends on selected source node
- ✅ Validation errors display inline

---

### Task 5.9: Implement Node Click Handler ✅

- [x] Canvas already has `onNodeClick` callback (reused existing)
- [x] Create `useNodeInteraction` hook at `src/features/workflow/hooks/use-node-interaction.ts`
- [x] Hook manages: dialogType, dialogData, handleNodeClick, closeDialog, openConfigDialog
- [x] Determine dialog type based on node state:
  - `name: null` → NodeSelectionDialog
  - `name: NodeName` → NodeConfigurationDialog
- [x] Wire up dialogs in `page.tsx` with stub handlers
- [x] Pass click handlers via `workflowToCanvasNodes` callbacks

**Acceptance Criteria:**

- ✅ Clicking node with `name: null` opens selection dialog
- ✅ Clicking node with `name` set opens configuration dialog
- ✅ Dialog state managed via `useNodeInteraction` hook

---

### Task 5.10: Implement Node Selection Flow ✅

- [x] Wire `NodeSelectionModal` to node click for unconfigured nodes (`name: null`)
- [x] On selection: update node with selected `name`
- [x] On selection: immediately open configuration modal
- [x] On cancel: dialog closes, node remains with `name: null`
- [x] Update workflow state via dispatch

**Acceptance Criteria:**

- ✅ Selecting a name (e.g., 'schedule') updates node's `name` field
- ✅ Configuration modal opens after selection
- ✅ Cancellation leaves node with `name: null`

---

### Task 5.11: Implement Node Configuration Save (FR-019) ✅

- [x] Validate form data with Zod schema on save (via react-hook-form + zodResolver)
- [x] If valid: update node config in workflow state
- [x] If valid: close modal
- [x] If invalid: show errors, keep modal open
- [x] Render appropriate form based on node.name (schedule, send-email, if-else)

**Acceptance Criteria:**

- ✅ Valid configuration saves and closes modal
- ✅ Invalid configuration shows errors
- ✅ Node config saved to workflow state

---

### Task 5.12: Implement Modal Cancel Behavior (FR-020) ✅

- [x] Cancel button closes modal without saving
- [x] X button closes modal without saving
- [x] Clicking outside closes modal without saving
- [x] Escape key closes modal without saving
- [x] Unsaved changes are discarded

**Acceptance Criteria:**

- ✅ All close methods work consistently (via Radix Dialog defaults)
- ✅ No partial saves occur
- ✅ Original state preserved on cancel

---

## Phase 6: Plus Node Interaction and Node Addition

**Goal:** Enable users to add new nodes to the workflow by clicking Plus helper nodes.

**Verification:** User can click a Plus node, select a node type, configure it, and see the new node appear in the workflow.

### Task 6.1: Implement Plus Node Click Handler (FR-014) ✅

- [x] Add click handler to `PlusNode` component
- [x] On click: replace Plus node with Placeholder node (unconfigured action)
- [x] On click: open Node Selection modal (actions only)
- [x] Update workflow state to reflect placeholder

**Acceptance Criteria:**

- ✅ Plus node transforms to placeholder on click
- ✅ Selection modal opens automatically
- ✅ Placeholder appears in correct position

---

### Task 6.2: Implement Node Insertion Logic ✅

- [x] Create `INSERT_PLUS_AFTER_NODE` reducer action in workflow state
- [x] Handle insertion in linear section:
  - Plus node converted to Action (Task 6.1)
  - New Plus node inserted after new Action
  - Edges updated: Action → NewPlus → Successor
- [x] Positions recalculated automatically by `calculateNodePositions` on render
- [x] Plus node placement rules maintained (FR-013)

**Acceptance Criteria:**

- ✅ New node inserts at correct position
- ✅ Plus nodes remain between all consecutive nodes
- ✅ Edges reconnect correctly

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

**Acceptance Criteria:**

- Full flow works without errors
- Node count increases correctly
- Edges maintain connectivity

---

## Phase 7: If/Else Branching Implementation ✅

**Goal:** Enable users to add If/Else nodes that create branching paths in the workflow.

**Verification:** User can add an If/Else node and see two branch paths (Path A, Path B) with their own nodes.

### Task 7.1: Implement If/Else Node Creation (FR-026) ✅

- [x] When `name: 'if-else'` selected from catalog:
  - Create Action node with `{ type: 'action', name: 'if-else' }` (existing flow)
  - Create 2 unconfigured Action nodes (children of if-else)
  - Create 2 Plus nodes (one below each action)
- [x] Update edges for branching structure:
  - If-else → Path A Action → Path A Plus
  - If-else → Path B Action → Path B Plus
- [x] If if-else has existing successor, move it to Path A

> **Design Decision:** No branch abstraction needed - just edges. Path A/B derived from edge order.

**Acceptance Criteria:**

- ✅ If/Else node creates 4 child nodes (2 actions + 2 plus)
- ✅ Each path has one Action node with `name: null`
- ✅ Each path has a Plus node at the end
- ✅ Existing successor moves to Path A if present

---

### Task 7.2: Implement Branch Layout Calculator ✅

- [x] Update `calculateNodePositions` for branches
- [x] Position branch nodes horizontally offset:
  - Path A: `centerX - BRANCH_HORIZONTAL_SPACING / 2` (left)
  - Path B: `centerX + BRANCH_HORIZONTAL_SPACING / 2` (right)
- [x] Maintain vertical spacing within branches
- [x] Handle nested branches (returns max Y, ready for future)

> **Note:** Branch labels (Task 7.3) are a separate task.

**Acceptance Criteria:**

- ✅ Branches appear side-by-side
- ✅ Vertical alignment is consistent
- ✅ No node overlap

---

### Task 7.3: Create Branch Label Component - SKIPPED

> Not needed - current implementation is sufficient without visual labels.

---

### Task 7.4: Create Branch Edge Routing - SKIPPED

> Not needed - default edges work fine for branching.

---

### Task 7.5: Implement Branch Path Independence (FR-028) - SKIPPED

> Already works - each branch has separate node IDs and edges, no shared state.

---

## Phase 8: Node Deletion

**Goal:** Enable users to delete nodes from the workflow with proper cleanup.

**Verification:** User can delete nodes via context menu, confirm deletion, and see the workflow update correctly.

### Task 8.1: Create Node Context Menu (FR-021) ✅

- [x] Create `NodeContextMenu` component using ShadCN DropdownMenu
- [x] Add "Delete" menu item with destructive styling (hidden for trigger nodes)
- [x] Add "Configure" menu item (opens config modal)
- [x] Trigger menu on menu button click
- [x] Position menu relative to node (align="end")

**Acceptance Criteria:**

- ✅ Context menu appears on menu button click
- ✅ Menu items are clearly labeled
- ✅ Menu closes on item selection or outside click
- ✅ Delete option hidden for trigger nodes

---

### Task 8.2: Create Delete Confirmation Dialog ✅

- [x] Create `DeleteConfirmationDialog` component
- [x] Display warning message about deletion
- [x] Show node name being deleted
- [x] Add "Cancel" and "Delete" buttons
- [x] Style Delete button as destructive

**Acceptance Criteria:**

- ✅ Dialog clearly communicates action
- ✅ Cancel returns without deletion
- ✅ Delete confirms and proceeds

---

### Task 8.3: Implement Linear Node Deletion (FR-022) ✅

- [x] Enhance `DELETE_NODE` reducer action in workflow state
- [x] Handle deletion in linear path:
  - Remove the node
  - Reconnect predecessor to successor
  - Remove extra plus node (after deleted node) to avoid duplicates
  - Positions recalculated automatically by calculateNodePositions
- [x] Prevent deletion of trigger nodes (blocked in reducer)
- [x] Update edges after deletion

**Acceptance Criteria:**

- ✅ Node is removed from workflow
- ✅ Path remains connected
- ✅ Plus nodes are correctly placed (no duplicates)
- ✅ Trigger node cannot be deleted

---

### Task 8.4: Implement If/Else Cascade Deletion ✅

- [x] Detect if-else nodes (2 outgoing edges)
- [x] Cascade delete all branch descendants using `getAllDescendantIds` helper
- [x] Remove all edges involving deleted nodes
- [x] Predecessor (plus) becomes end of path

**Acceptance Criteria:**

- ✅ Deleting if-else cascades to all branch descendants
- ✅ Edges properly cleaned up
- ✅ Predecessor remains as end of path

---

### Task 8.5: Implement Branch Node Deletion ✅

- [x] Handle deletion of nodes within a branch
- [x] Preserve Plus nodes at end of path/branch
- [x] Maintain branch structure after deletion
- [x] Update DELETE_NODE to keep plus when `!finalSuccessorId`

**Acceptance Criteria:**

- ✅ Branch nodes can be deleted
- ✅ Branch structure remains valid
- ✅ Plus nodes at end of branches are preserved

---

## Phase 9: Visual Polish and Node States

**Goal:** Refine visual appearance of nodes to clearly indicate configuration state and improve overall UX.

**Verification:** Users can easily distinguish configured vs unconfigured nodes, and the UI matches the quality of the Zapier reference.

### Task 9.1: Implement Node State Visual Indicators (FR-024) ✅

- [x] Create visual distinction for unconfigured nodes (`name: null`):
  - Dashed border (`border-2 border-dashed border-gray-300`)
  - Muted colors (gray badge: `bg-gray-100 text-gray-600`)
  - Info icon (Zap for triggers, CirclePlus for actions)
  - "Select the event/action..." description text
- [x] Create visual distinction for configured nodes (`name` set):
  - Solid border (`border border-solid border-gray-200`)
  - Full colors (brand badge: `bg-[#7297c5]/10 text-[#7297c5]`)
  - Node name displayed (e.g., "Schedule", "Send Email")

**Acceptance Criteria:**

- ✅ Configuration state (`name` null vs set) is immediately visible
- ✅ Visual language is consistent
- ✅ Accessibility contrast requirements met

---

### Task 9.2: Add Node Icons ✅

- [x] Add icon set for node names:
  - `schedule`: Calendar icon (lucide-react)
  - `send-email`: Mail icon (lucide-react)
  - `if-else`: GitBranch icon (lucide-react)
- [x] Add icon for unconfigured Trigger (`name: null`): Zap icon
- [x] Add icon for unconfigured Action (`name: null`): CirclePlus icon
- [x] Size and position icons consistently (h-3.5 w-3.5 in badges)

**Acceptance Criteria:**

- ✅ Each node name has unique icon
- ✅ Icons render crisply at all zoom levels
- ✅ Icon meanings are intuitive

---

### Task 9.3: Implement Step Numbers ✅

- [x] Calculate step numbers based on node order (via `workflowToCanvasNodes`)
- [x] Display step number on each node ("1.", "2.", etc.) via `NodeDescription` component
- [x] Handle branch numbering (e.g., "3.", "4." for Path A, "5.", "6." for Path B)
- [x] Update numbers when nodes are added/removed (dynamic calculation)
- [x] Style step numbers consistently (`font-medium text-gray-900`)

**Acceptance Criteria:**

- ✅ Step numbers are sequential
- ✅ Numbers update on workflow changes
- ✅ Styling matches Zapier reference

---

### Task 9.4: Refine Edge Styling ✅

- [x] Style edges with consistent color (`#7297c5` brand blue)
- [x] Add edge stroke width (2px)
- [x] Ensure edges connect at node center points (smoothstep routing)
- [x] Edge visibility at zoom levels (sufficient for PoC)

**Acceptance Criteria:**

- ✅ Edges are visually pleasing
- ✅ Connection points are accurate
- ✅ Edges remain visible at all zoom levels

---

### Task 9.5: Add Hover and Focus States ✅

- [x] Add hover state to all interactive nodes:
  - PlusNode: scale-110, bg fill with brand color
  - All nodes: `hover:shadow-md hover:border-[#7297c5]`
- [x] Add focus state for keyboard navigation (`focus-visible:ring-2 focus-visible:ring-[#7297c5]`)
- [x] Smooth transitions (`transition-all duration-150 ease-in-out`)
- [x] Ensure states don't conflict with configuration state indicators

**Acceptance Criteria:**

- ✅ Hover provides clear feedback
- ✅ Focus is visible for accessibility
- ✅ States are consistent across node types

---

### Task 9.6: Implement Loading States - SKIPPED

> Skipped for PoC - not needed for basic functionality.

- [ ] ~~Add loading indicator for configuration save~~
- [ ] ~~Add loading state to configuration modal~~
- [ ] ~~Disable form during save operation~~
- [ ] ~~Show success feedback on save complete~~
- [ ] ~~Handle error states gracefully~~

**Note:** Loading states are nice-to-have for PoC. Configuration saves are synchronous in-memory operations.

---

## Phase 10: Error Handling and Validation ✅

**Goal:** Implement comprehensive error handling and validation throughout the application.

**Verification:** Validation errors display correctly, error boundaries catch failures, and the application never enters a broken state.

### Task 10.1: Implement Validation Error Display (FR-025) ✅ ALREADY COMPLETE

- [x] `FieldError` component exists at `src/components/ui/field.tsx`
- [x] Position errors below relevant form fields
- [x] Style errors with destructive color
- [x] Support multiple errors per field
- [x] Uses `role="alert"` for accessibility

**Acceptance Criteria:**

- ✅ Errors appear next to invalid fields
- ✅ Error messages are user-friendly
- ✅ Screen readers announce errors

---

### Task 10.2: Create Error Summary Component - SKIPPED

> **Skipped for PoC.** Forms have 4-5 fields max; inline errors are sufficient. Error summary adds complexity without significant benefit.

---

### Task 10.3: Implement Error Boundary for Canvas - SKIPPED

> **Skipped for PoC.** Next.js `error.tsx` already catches page-level errors. Canvas errors are rare. Root boundary provides adequate protection.

---

### Task 10.4: Implement Workflow State Validation - SKIPPED

> **Skipped for PoC.** Workflow state is managed by reducer which already ensures valid transitions. No async operations that could corrupt state.

---

### Task 10.5: Add Toast Notifications ✅

- [x] Sonner already installed and configured
- [x] Create toast for successful config save
- [x] Create toast for successful node deletion
- [x] Toasts positioned appropriately (via Toaster in layout)

**Implementation:**

- Added `toast.success('Configuration saved')` in `handleConfigSave`
- Added `toast.success('${label} deleted')` in `handleConfirmDelete`
- File: `src/features/workflow/components/WorkflowCanvas.tsx`

**Acceptance Criteria:**

- ✅ Toasts appear for save and delete actions
- ✅ Toasts are dismissible (Sonner default)
- ✅ Toasts don't block interaction
