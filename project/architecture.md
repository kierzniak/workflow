# Workflow Application Architecture

## Overview

This document describes the architecture of a visual workflow automation platform. The architecture centers on two core concepts: **Workflow** (business logic layer abstracting React Flow) and **Node** (self-contained entities representing workflow steps). These are most important aspects of this applications.

## Workflow Architecture

### Separation from React Flow

The WorkflowCanvas component is built on React Flow but designed to be completely separated from it. React Flow is an internal implementation detail confined to `src/components/canvas/`. The rest of the application interacts only with workflow-specific types and APIs there are zero React Flow imports outside the canvas layer.

A thin adapter layer converts workflow domain nodes to React Flow nodes. This conversion happens in one place and is the only code that knows about React Flow's data structures. The application defines its own types and API contract, making React Flow theoretically replaceable by changing only this adapter.

### Single Place for Business Logic

All workflow business logic is centralized in the **WorkflowProvider** context and consumed via the **useWorkflow** hook. Components never mutate state directly they call hook methods like `addNode()`, `deleteNode()`, or `saveNodeConfig()`.

The hook encapsulates all business rules. For example, when a node is deleted, the hook automatically reconnects edges to maintain workflow continuity. Components don't need to understand these rules.

## Node Architecture

### Type System

Nodes use a two-level discrimination pattern:

```typescript
type NodeType = 'trigger' | 'action' | 'plus' | 'placeholder'; // structural role

type TriggerName = 'schedule' | 'webhook';
type ActionName = 'send-email' | 'send-sms' | 'if-else';
type NodeName = TriggerName | ActionName; // concrete implementation
```

### Independent Entities

Each node is a separate folder containing everything it needs component, config panel, types, and Zod schema:

```
src/features/workflow/nodes/
├── schedule/
│   ├── ScheduleNode.tsx
│   ├── ScheduleConfigPanel.tsx
│   ├── schema.ts
│   └── types.ts
├── send-email/
│   └── ...
└── if-else/
    └── ...
```

Each node carries all information needed to render and configure it type, name, position, and configuration. Given a node object, you have everything required without external lookups.

### Adding New Nodes

Adding a new node is straightforward:

1. Create a new folder in `nodes/`
2. Add the node name to the `NodeName` type union

That's it. TypeScript then reports errors everywhere the new type needs handling, guiding you to all required updates. The `satisfies Record<NodeName, ...>` pattern enforces completeness at compile time if you forget to handle a node type in the components map or metadata, the code won't compile.
