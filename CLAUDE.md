# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Visual workflow automation platform (Zapier-like) for designing, building, and managing automated workflows through a no-code builder interface. Uses React Flow for the canvas and node-based workflow visualization.

## General rule

When reporting information to me, be extremely concise. Sacrifice grammar for the sake of concision.

## Commands

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Architecture

- **Framework**: Next.js 16 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui (new-york style)
- **Workflow Canvas**: @xyflow/react (React Flow)
- **Package Manager**: pnpm

### Path Aliases

- `@/*` maps to `./src/*`
- Components: `@/components` and `@/components/ui`
- Utilities: `@/lib` (includes `cn()` helper for className merging)
- Hooks: `@/hooks`

## Domain Concepts

See `SPECIFICATION.md` for full details. Key concepts:

- **Workflow**: Complete automation with trigger + actions, built on infinite canvas
- **Node**: Visual block representing a trigger, action, or control flow step
- **Trigger**: Event that starts a workflow (schedule, webhook)
- **Action**: Operation performed when workflow runs (send email, HTTP request)
- **Control Flow**: Logic nodes for conditions (if/else), delays, parallel paths
- **Add helper**: Plus icon nodes placed between other nodes to allow inserting new steps

### Node Validation States

- Striped/Dotted border: Empty (no type selected)
- Blue border: Valid (correctly configured)
- Red border: Invalid (missing required fields)

### Workflow States

Draft → Published → Paused → Archived

## Import Organization Rules

### Rules

1. **Use absolute imports** for all internal app imports (prefer `@/lib` over `./lib` or `../lib`)
2. **Group imports** by category with blank lines between groups
3. **Keep related imports together** (e.g., multiple imports from same react flow package)
4. **Place style imports** at the end of their respective group

### Import Path Preferences

Use absolute imports for all interal app imports.

- [good] `@/component/ui/button` (absolute)
- [bad] `./button` or `../components/button` (relative)

### Import Order

Organize imports in the following order with blank lines separating each group:

1. **Third-party libraries** - External packages from node_modules
2. **App imports** - Internal application imports using absolute paths (@/src/\*)
3. **Assets** - Stylesheets, images, and other static assets (always last)

### Example

#### Good

```typescript
// Proper order, grouped imports and absolute paths
import React from 'react';
import { createRoot } from 'react-dom/client';

import { Button } from '@/component/ui/button';
import { Modal } from '@/component/ui/modal';
import { Dropdown } from '@/component/ui/dropdown';
```

#### Bad

```typescript
// Mixed order and relative imports
import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';
import React from 'react';
import './styles.css';
import { Button }json from '@/component/ui/button';
import { createRoot } from 'react-dom/client';
```


## React TypeScript Best Practices

### Architecture

- **Feature-based folder structure** - group by feature, not file type. Each feature contains its components, hooks, types, and tests.
- **Separation of concerns** - components handle UI, hooks handle state logic, services handle I/O. Never mix API calls with rendering.
- **Dependency injection** - pass dependencies (storage, API clients) as parameters to hooks/functions. Enables testing and flexibility.

### TypeScript

- **No `any`** - use `unknown` and narrow with type guards.
- **Branded types for IDs** - `type TodoId = string & { __brand: 'TodoId' }` prevents mixing different ID types.
- **Discriminated unions for state** - model async states explicitly:
```typescript
  type AsyncState<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: Error };
```
- **Explicit return types on public APIs** - hooks and exported functions should declare return types for documentation and safety.

### Components

- **Single responsibility** - one component does one thing. If it's hard to name, it's doing too much.
- **Props interface with JSDoc** - document each prop's purpose:
```typescript
  interface ButtonProps {
    /** Button label text */
    label: string;
    /** Called when button is clicked */
    onClick: () => void;
    /** Disables interaction when true */
    disabled?: boolean;
  }
```
- **Composition over configuration** - prefer children and render props over boolean flags that switch behavior.
- **No business logic in components** - extract to hooks or utils, keep components focused on rendering.

### State Management

- **Derive state, don't sync it** - compute values from source state instead of storing derived data.
- **Colocate state** - keep state as close to where it's used as possible. Lift only when necessary.
- **Immutable updates** - always return new objects/arrays, never mutate.

### Error Handling

- **Result types over exceptions** - makes errors explicit in the type system:
```typescript
  type Result<T, E = Error> =
    | { ok: true; value: T }
    | { ok: false; error: E };
```
- **Validation at boundaries** - validate external data (API responses, user input) with schemas (Zod). Trust nothing from outside.
- **Error boundaries** - wrap feature sections to prevent full-app crashes.

### Code Quality

- **Constants over magic values** - extract strings, numbers, config to named constants.
- **Pure functions for logic** - extract complex conditions and transformations to testable pure functions.
- **Consistent naming conventions**:
  - `handleX` for event handlers
  - `useX` for hooks
  - `XProvider` / `useX` for context pairs
  - `XService` for API/external service wrappers

### Testing

- **Test behavior, not implementation** - test what the hook/component does, not how it does it.
- **Arrange-Act-Assert structure** - clear setup, action, and expectation in each test.
- **Mock at boundaries** - mock API calls and storage, not internal functions.

### Performance (React 19+)

- **Trust the compiler** - React Compiler handles memoization. Remove manual `useCallback`, `useMemo`, `memo()` unless you have measured performance issues.
- **Measure before optimizing** - use React DevTools Profiler. Don't optimize hypothetical problems.

### Don'ts

- Don't use `useEffect` for derived state or event handling. Read this article to be sure if you need useEffect https://react.dev/learn/you-might-not-need-an-effect
- Don't store in state what can be computed.
- Don't pass more than 4-5 props - consider composition or context.
- Don't catch errors silently - log, report, or surface to user.
- Don't mix controlled and uncontrolled inputs.