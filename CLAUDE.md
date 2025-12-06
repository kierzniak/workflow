# CLAUDE.md

## 1. Communication Rules

- When reporting information to me, be **extremely concise**, sacrifice grammar for brevity.
- At the end of each plan, give me a list of unresolved questions to answer, if any. Make the questions extremely concise. Sacrifice grammar for the sake of concision.

---

## 2. Project Overview

Visual workflow automation platform (Zapier-like) for designing, building, and managing automated workflows through a no-code builder interface.

See `@project/functional-requirement.md` for complete domain details.
See `@project/implementation-plan.md` for implementation plan.

---

## 3. Commands

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

---

## 4. Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui (new-york style)
- **Workflow Canvas**: `@xyflow/react` (React Flow)
- **Package Manager**: pnpm

### 4.1 Path Aliases

- `@/*` → `./src/*`
- Components: `@/components`, `@/components/ui`
- Utilities: `@/lib` (includes `cn()` helper for className merging)
- Hooks: `@/hooks`

---

## 5. Import Organization Rules

### 5.1 General Rules

1. **Use absolute imports** for all internal app imports  
   Prefer `@/...` over `./...` or `../...`.
2. **Group imports by category** with blank lines between groups.
3. **Keep related imports together**  
   (e.g. multiple imports from the same React Flow package).
4. **Place style imports** at the end of their group (or as the last group if global).

### 5.2 Import Path Preferences

Use absolute imports for all internal app modules.

- ✅ `@/components/ui/button` (absolute)
- ❌ `./button` (relative)
- ❌ `../components/button` (relative)

### 5.3 Import Order

Organize imports in this order, with a **blank line** between each group:

1. **Third-party libraries**  
   External packages from `node_modules`.
2. **App imports**  
   Internal application imports using absolute paths (`@/...`).
3. **Assets**  
   Stylesheets, images, and other static assets (always last).

### 5.4 Examples

#### Good

```typescript
// Proper order, grouped imports and absolute paths
import React from 'react';
import { createRoot } from 'react-dom/client';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Dropdown } from '@/components/ui/dropdown';

import './styles.css';
```

#### Bad

```typescript
// Mixed order and relative imports
import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';
import React from 'react';
import './styles.css';
import { Button } from '@/components/ui/button';
import { createRoot } from 'react-dom/client';
```

---

## 6. React + TypeScript Best Practices

### 6.1 Architecture

- **Feature-based folder structure**  
  Group by feature, not file type. Each feature contains its components, hooks, types, and tests.
- **Separation of concerns**  
  Components handle UI, hooks handle state logic, services handle I/O.  
  Never mix API calls with rendering.
- **Dependency injection**  
  Pass dependencies (storage, API clients, etc.) as parameters to hooks/functions.  
  This enables testing and flexibility.

### 6.2 TypeScript

- **No `any`**  
  Use `unknown` and narrow with type guards.
- **Explicit return types on public APIs**  
  Hooks and exported functions should declare return types for documentation and safety.

### 6.3 Components

- **Single responsibility**  
  One component does one thing. If it's hard to name, it's doing too much.
- **Props interface with JSDoc**

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

- **Composition over configuration**  
  Prefer children and render props over boolean flags that switch behavior.
- **No business logic in components**  
  Extract to hooks or utils; keep components focused on rendering.

### 6.4 State Management

- **Derive state, don't sync it**  
  Compute values from source state instead of storing derived data.
- **Colocate state**  
  Keep state as close to where it's used as possible. Lift only when necessary.
- **Immutable updates**  
  Always return new objects/arrays; never mutate.

### 6.5 Error Handling

- **Result types over exceptions**  
  Make errors explicit in the type system:

  ```typescript
  type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
  ```

- **Validation at boundaries**  
  Validate external data (API responses, user input) with schemas (e.g. Zod).  
  Trust nothing from outside.
- **Error boundaries**  
  Wrap feature sections to prevent full-app crashes.

### 6.6 Code Quality

- **Constants over magic values**  
  Extract strings, numbers, config to named constants.
- **Pure functions for logic**  
  Extract complex conditions and transformations to testable pure functions.
- **Consistent naming conventions**:
  - `handleX` for event handlers
  - `useX` for hooks
  - `XProvider` / `useX` for context pairs
  - `XService` for API/external service wrappers

### 6.7 Testing

- **Test behavior, not implementation**  
  Test what the hook/component does, not how it does it.
- **Arrange–Act–Assert structure**  
  Clear setup, action, and expectation in each test.
- **Mock at boundaries**  
  Mock API calls and storage, not internal helper functions.

### 6.8 Performance (React 19+)

- **Trust the compiler**  
  React Compiler handles memoization. Remove manual `useCallback`, `useMemo`, `memo()` unless you have measured performance issues.
- **Measure before optimizing**  
  Use React DevTools Profiler. Don't optimize hypothetical problems.

### 6.9 Don'ts

- Don't use `useEffect` for derived state or simple event handling.  
  Read: https://react.dev/learn/you-might-not-need-an-effect
- Don't store in state what can be computed.
- Don't pass more than 4–5 props; consider composition or context.
- Don't catch errors silently – log, report, or surface to the user.
- Don't mix controlled and uncontrolled inputs.
