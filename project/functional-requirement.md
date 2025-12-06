# Functional Requirements – Visual Workflow Automation PoC

## 1. Purpose & Scope

This document defines the **functional requirements** for a proof-of-concept visual workflow automation platform (similar to Zapier) that allows users to design, configure, and manage a **single automated workflow** through a no-code builder interface.

The focus of this PoC is:

- The **canvas** and **node-based workflow builder**.
- Node creation, positioning, branching, configuration, and deletion.
- Basic navigation controls (pan, zoom).

The following are **out of scope for this PoC**:

- Workflow persistence and lifecycle management (list, open, save, rename, delete workflows).
- Execution of workflows and integration with external systems.
- Authentication, authorization, or multi-user support.
- Versioning, audit logging, or collaboration features.

---

## 2. Glossary

- **Workflow** – A directed graph of nodes representing an automation from top to bottom.
- **Node** – A single step in the workflow.
- **Node type (programming)** – Logical kind of node used in the implementation:
  - **Trigger node type** – Starts the workflow. There is exactly one Trigger at the top.
  - **Action node type** – Performs some action after the trigger or within a branch.
    - The **If/Else node** is a _special Action node type_ that creates two branches.
  - **Plus helper node type** – A utility node (“+”) representing where a new node can be inserted.
  - **Placeholder node type** – Temporary node displayed after clicking “+” and before selecting a concrete node.
- **Concrete node** – A specific implementation of a node type, e.g.:
  - **Trigger-type concrete nodes:** “Schedule”.
  - **Action-type concrete nodes:** “Send Email”, “If/Else”.
- **Node visual category / style (UI)** – How a node looks on the canvas (shape, color, icon).  
  This is **purely visual** and used only for representation (e.g., Trigger vs Action styling).
- **If/Else node** – A concrete **Action node type** whose configuration defines two separate sets of conditions (for Path A and Path B). It splits the workflow into two branches and, conceptually, chooses the branch whose condition set evaluates to `true` based on values coming from previous nodes.
- **Canvas** – Infinite-scroll area in which the workflow graph is displayed, powered by React Flow.
- **Branch** – A path of nodes created from an If/Else node (e.g., “Path A”, “Path B”).
- **Unconfigured node** – A node created but not yet assigned a concrete type and/or missing required settings.
- **Configured node** – A node with a concrete type selected and all required configuration fields completed and saved.

> In the rest of this document, when we talk about behavior and logic we refer to **node types** (Trigger, Action, Plus, Placeholder).  
> Visual categories/styles are reserved for how nodes appear on the canvas.

---

## 3. Actors

- **User** – A person using the builder interface.  
  For the PoC, all users are treated identically (no roles/permissions).

---

## 4. Application Initialization & Workflow Lifecycle

### FR-001 – New Workflow on Load

- When the application loads, it **MUST** automatically create a new workflow in memory.
- This workflow becomes the **only workflow** the user can interact with during the session.

### FR-002 – Initial Canvas State

- The newly created workflow **MUST** contain:
  - One **unconfigured Trigger node** at the top of the canvas:
    - Node type = `Trigger`.
    - No concrete Trigger implementation selected yet (e.g., “Schedule” not chosen).
  - One **unconfigured Action node** directly below the Trigger node:
    - Node type = `Action`.
    - No concrete Action implementation selected yet (e.g., “Send Email” not chosen).
- A **Plus helper node** **MUST** appear:
  - Between the Trigger and Action node.
  - Below the Action node (end of flow).

### FR-003 – No Workflow Management

- The UI **MUST NOT** provide options to:
  - Create additional workflows.
  - View a list of existing workflows.
  - Open, rename, edit, or delete existing workflows.
- For this PoC, the workflow exists only for the lifetime of the browser session/tab (persistence behavior can be defined later).

---

## 5. Canvas & Navigation

### FR-004 – Canvas Implementation

- The workflow **MUST** be rendered using **React Flow** (or an abstraction built on it).
- The canvas **MUST** support an effectively **infinite scroll** in all directions.

### FR-005 – Panning

The user **MUST** be able to move around the canvas via:

1. **Mouse drag on empty space**
   - Clicking and holding on any empty region of the canvas, then dragging, **MUST** pan the view.
   - Clicking on a node **MUST NOT** pan; it should select/open the node.

2. **Mouse scroll wheel / trackpad**
   - Vertical scroll **MUST** pan vertically.
   - Horizontal scrolling (if available) **SHOULD** pan horizontally.

### FR-006 – Zoom Controls

- The canvas **MUST** support zooming in and out.
- The user **MUST** be able to:
  - Zoom using mouse wheel gestures (or trackpad pinch, if available).
  - Use UI controls for:
    - **Zoom in**
    - **Zoom out**
    - **Reset zoom & position** (centers the main workflow in view).

### FR-007 – Node Dragging Disabled

- Users **MUST NOT** be able to drag nodes to reposition them.
- All node positions **MUST** be determined programmatically to maintain a clean, vertical layout.

---

## 6. Node Types & Layout

### FR-008 – Supported Node Types (Programming)

The system **MUST** support at least the following **node types**:

1. **Trigger**
2. **Action** (including the special **If/Else** Action that creates branches)
3. **Plus helper** (“+”)
4. **Placeholder** (transient)

### FR-009 – Concrete Node Implementations

The system **MUST** support at least the following **concrete nodes**:

- Trigger-type concrete node:
  - **Schedule Trigger**
- Action-type concrete nodes:
  - **Send Email**
  - **If/Else** (branching Action)

### FR-010 – Node Type Rules

- The **first node** in the workflow **MUST** always be of node type **Trigger**.
- All nodes created via a Plus helper node **MUST** be of node type **Action** (including the **If/Else** Action).
- Node type **MUST NOT** be changed between Trigger and Action:
  - The initial Trigger node always remains a Trigger-type node.
  - Action nodes always remain Action-type nodes (but may change between Action _implementations_ like “Send Email” ↔ “If/Else”, if supported).

### FR-011 – Node Positioning Rules (Linear Flow)

- In a non-branching section of the workflow:
  - Each new node **MUST** appear directly **below** its preceding node.
  - Vertical spacing between consecutive nodes **MUST** be consistent.
  - Edges between nodes **MUST** be rendered as straight or slightly curved lines from the bottom of one node to the top of the next.

### FR-012 – Node Positioning Rules (If/Else Branches)

- When an **If/Else Action node** is inserted:
  - It **MUST** appear directly below the previous node in the same path.
  - Two new branch lanes (e.g., “Path A” and “Path B”) **MUST** be created beneath it and laid out horizontally.
  - For each branch lane, the system **MUST** automatically create an **unconfigured Action node** as the first node in that branch.
    - These unconfigured Action nodes **MUST** be aligned horizontally under the If/Else node (Path A on the left, Path B on the right).
  - Each branch path then continues as its own vertical sequence of nodes.
- Plus helper nodes **MUST** be added **below** each unconfigured Action node to support further node insertion, consistent with FR-013.

### FR-013 – Plus Helper Node Placement

The system **MUST** display Plus helper nodes (“+” icons) in the following locations:

- **Between** every pair of consecutive nodes on a given path.
- **At the end** of each path (below the last node in that path).
- For paths created by an If/Else node, each branch path **MUST** have its own Plus node at the end.

---

## 7. Node Creation Flow

### FR-014 – Adding a Node via Plus Helper Node

1. **User Action**
   - The user clicks on a **Plus helper node**.

2. **Immediate UI Change**
   - The Plus node **MUST** be replaced inline by a **Placeholder node**.
   - A **modal window** **MUST** open, presenting the **Concrete Node Selection** interface.

3. **Concrete Node Selection Modal – Allowed Types**
   - The modal **MUST** display a list of **Action-type concrete nodes**, not raw node types.
   - For nodes created via Plus:
     - The list **MUST NOT** include any Trigger-type concrete nodes.
     - The list **MUST** include:
       - Standard Action concrete nodes (e.g., “Send Email”).
       - The **If/Else** concrete Action node.
   - Each entry **SHOULD** display:
     - Concrete node name (e.g., “Send Email”, “If/Else”).
     - Short description.
     - Optional icon.

4. **Creation**
   - When the user selects a concrete Action node:
     - The Placeholder **MUST** be converted into an Action node of the selected concrete type.
     - The Concrete Node Selection modal **MUST** close.
     - A **Node Configuration modal** for that newly created Action node **MUST** immediately open.

5. **Cancellation / Dismissal**
   - If the user cancels or closes the Concrete Node Selection modal:
     - The Placeholder node **MUST** revert back to the original Plus helper node.
   - If the user closes the Node Configuration modal without saving:
     - The node **MUST** remain in an “unconfigured” state
     - Behavior **MUST** be implemented consistently and clarified in the UI.

---

## 8. Configuring the Initial Trigger and Action Nodes

### FR-015 – Configuring the Initial Trigger Node

- The initial Trigger node at the top of the workflow:
  - Is created by the system as node type **Trigger**.
  - Starts in an **unconfigured** state (no concrete Trigger selected).
- When the user clicks this node:
  - A Concrete Node Selection modal **MUST** open listing **only Trigger-type concrete nodes** (e.g., “Schedule”).
  - The list **MUST NOT** include any Action-type concrete nodes (e.g., “Send Email”, “If/Else”).
  - The raw node type label “Trigger” **MUST NOT** appear as a selectable option.

### FR-016 – Configuring the Initial Action Node

- The initial Action node directly below the trigger:
  - Is created by the system as node type **Action**.
  - Starts in an **unconfigured** state (no concrete Action selected).
- When the user clicks this node:
  - A Concrete Node Selection modal **MUST** open listing **only Action-type concrete nodes** (e.g., “Send Email”, “If/Else”).
  - The list **MUST NOT** include Trigger-type concrete nodes.
  - The raw node type labels “Action” or “Trigger” **MUST NOT** appear as selectable options.

---

## 9. Node Configuration & Editing

### FR-017 – Opening Configuration for an Existing Node

- Clicking on any configured or unconfigured node (Trigger or Action, including If/Else) **MUST** open a **Node Configuration modal** for that node.
- The modal **MUST**:
  - Display the node’s current configuration values (if any).
  - Allow the user to modify editable fields.
  - Provide **Save** and **Cancel/Close** actions.

### FR-018 – Node Configuration Modal Content

- The fields shown in the modal **MUST** be specific to the **concrete node**. Examples:
  - **Schedule Trigger**: frequency, time of day, time zone, etc.
  - **Send Email Action**: `To`, `Subject`, `Body`, `From Name`, etc.
  - **If/Else Action**: condition fields, comparison operators, threshold values, etc.
- The system **MUST** support per-concrete-node validation rules (see FR-023).

### FR-018a – If/Else Node Configuration – Condition Groups

- The Node Configuration modal for an **If/Else Action node** **MUST** expose two distinct configuration sections:
  - **Path A conditions**
  - **Path B conditions**
- Each section **MUST** allow the user to define one or more simple conditions (condition rows).
- For each condition row, the user **MUST** be able to:
  - Select a **value source** from any **previous node** in the same path or upstream of the If/Else node (e.g., trigger output, prior action outputs, static fields).
  - Choose a **comparison operator** (e.g., equals, not equals, greater than, contains, etc.; the exact operator set is **TBD** in the UI spec).
  - Provide a **comparison value**, which may be a constant or another value taken from previous nodes.

### FR-018b – If/Else Node Configuration – Conceptual Evaluation

- Conceptually, when the workflow is evaluated:
  - The **Path A conditions** are evaluated against the values from previous nodes.
  - The **Path B conditions** are evaluated against the values from previous nodes.
  - If the Path A condition set evaluates to `true`, the workflow **SHOULD** follow **Path A**.
  - If the Path B condition set evaluates to `true`, the workflow **SHOULD** follow **Path B**.
- Edge cases where both or neither condition sets evaluate to `true` **MUST** be defined in a later **execution semantics** specification and are out of scope for this PoC’s builder implementation.

### FR-019 – Saving Changes

- On **Save**:
  - The system **MUST** validate the user input.
  - If validation succeeds:
    - The configuration **MUST** be stored in the workflow state.
    - The modal **MUST** close.
    - The node’s visual appearance **SHOULD** reflect its configured state (e.g., show concrete label like “Schedule” or “Send Email”, use a configured badge/checkmark).
  - If validation fails:
    - The modal **MUST NOT** close.
    - Validation errors **MUST** be visible near the relevant fields and/or in a general error area.

### FR-020 – Cancel / Close Without Saving

- If the user closes the modal via Cancel, “X”, or clicking outside:
  - Unsaved changes **MUST NOT** be persisted.
  - The node configuration **MUST** stay as it was when the modal opened.

---

## 10. Node Deletion

### FR-021 – Deleting a Node

- The UI **MUST** provide a way to delete nodes via a context menu.
- When the user chooses to delete a node, the system **MUST** show a confirmation dialog.

### FR-022 – Deletion Behavior (Linear Path)

- When deleting a node that is part of a linear path (no branching at that point):
  - The node **MUST** be removed from the path.
  - The path **MUST** remain connected:
    - The predecessor node’s outgoing edge **MUST** be connected to the successor node.
  - A Plus helper node **MUST** be created between the predecessor and successor (consistent with FR-013).

### FR-023 – Deletion Behavior (If/Else Action)

- Deleting an **If/Else Action node** with downstream branches is complex; PoC behavior **MUST** be defined clearly and implemented consistently. Options:
  - **Option A (simplest)**: Disallow deletion of If/Else nodes that have any child nodes; prompt user to delete branch contents first.
  - **Option B**: When deleting an If/Else node, delete all nodes downstream in both branches.
  - **Option C**: When deleting an If/Else node, merge one branch back into the main path and discard the other (requires clear visual indication and documentation of which branch is kept).

- Regardless of the option chosen:
  - The system **MUST** prevent invalid or dangling edges.
  - The upstream predecessor node **MUST** end with a Plus helper node.

---

## 11. Node States & Validation

### FR-024 – Node States

Each node **MUST** track at least the following high-level states:

- **Unconfigured** – Concrete node not selected and/or required fields missing.
- **Configured** – Concrete node selected and all required fields valid and saved.

The UI **SHOULD** visually distinguish these states (e.g., color, icon, badge, or label).

### FR-025 – Validation Rules

- For each **concrete node**, the system **MUST** define validation constraints, such as:
  - Required fields.
  - Type checks (string, number, email format, etc.).
  - Value ranges (e.g., day of week 1–7).
- Validation **MUST** be executed:
  - When the user clicks **Save** in the configuration modal.
- Errors **MUST** be shown inline near invalid fields and/or in a summarized error region.

---

## 12. Branching Logic (If/Else Action Node)

### FR-026 – Branch Creation

- When an **If/Else Action node** is created (whether from the initial Action node or via a Plus helper node):
  - Two branch lanes **MUST** be created and labeled (e.g., _Path A_ and _Path B_).
  - Under each lane label, the system **MUST** automatically create a single **unconfigured Action node**.
  - A Plus helper node **MUST** be placed below each of these unconfigured Action nodes, marking the end of each branch path.
- The automatically created unconfigured Action nodes in Path A and Path B **MUST** behave like any other Action node:
  - Clicking them opens the Concrete Node Selection modal listing only Action-type concrete nodes (e.g., “Send Email”, additional If/Else nodes, etc.).

### FR-027 – Branch Path Management

- Within each branch:
  - Nodes **MUST** be added, edited, and removed using the same Plus-node behavior and rules as the main path.
  - The system **MUST** maintain consistent vertical spacing and automatic layout inside each branch.
  - The first unconfigured Action nodes that are auto-created under an If/Else Action node **MUST** be treated as part of their respective branch paths (Path A and Path B) for all layout and validation rules (e.g., FR-011, FR-024).

### FR-028 – Branch Independence

- Editing nodes in Path A **MUST NOT** affect nodes in Path B, and vice versa, except:
  - Changes to the If/Else Action node’s conditions logically affect both branches but not their structure.

> **Note:** Detailed runtime behavior of the overall workflow execution is still out of scope for this PoC. However, the builder assumes the conceptual rule from FR-018b: each path of an If/Else node has its own condition group, and the engine will choose the branch whose conditions evaluate to `true`.

---

## 13. Modals – General Behavior

### FR-029 – Modal Layering

- Only **one modal** related to node selection/configuration **MUST** be open at a time.
- While a modal is open:
  - Interactions with the canvas **MUST** be blocked (except for closing the modal).
  - Keyboard focus **MUST** be constrained to the modal’s content.

### FR-030 – Modal Closing Behavior

- All modals **MUST** support closing via:
  - Explicit **Cancel** or **Close** button.
  - Clicking an **“X”** icon in the modal header.
  - Optionally, pressing the `Esc` key (if supported).

---

## 14. Non-Functional / UX Constraints (PoC Level)

These are not strictly functional but guide implementation.

### FR-031 – Technology Stack

- The frontend **SHALL** be built with **React**.
- **React Flow** **MUST** be used for:
  - Rendering the node graph.
  - Managing edges and basic interactions (zoom, pan).
- **Zod** **MUST** be used for validation and checking output schema
- **ShadCN** **MUST** be used for app reusable components like Field, Input, Dialog, Sonner, DropdownMenu and so on.
- **TailwindCSS** **MUST** be used for styling

### FR-032 – Responsiveness

- The builder **SHOULD** be usable on typical desktop browser resolutions (e.g., ≥ 1280px width).
- Mobile and tablet support are **nice-to-have** but not required for this PoC.

### FR-033 – Performance

- The canvas **SHOULD** remain responsive with at least:
  - ~50 nodes.
  - Several branches created via If/Else Action nodes.

### FR-034 – Error Handling

- The system **SHOULD**:
  - Surface friendly error messages for unexpected failures (e.g., state update fails).
  - Avoid leaving the UI in a broken state; where not possible, prompt the user to refresh.

---

## 15. Out-of-Scope (Explicit)

For clarity, the following are **not required** in this PoC unless later added to scope:

- Running workflows or viewing past runs / logs.
- Integrations with real external apps (email providers, CRMs, etc.) beyond mocked configuration.
- User authentication, multi-tenant behavior, or role-based access control.
- Undo/redo history for canvas operations.
- Keyboard-driven node creation and navigation.
- Multi-select of nodes, group operations, or copy/paste of nodes or branches.
- Workflow import/export.
