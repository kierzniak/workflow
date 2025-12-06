This prompt was used to generate implementation-plan.md document. Also I used screenshot to give a context and enrich prompt. I tested this prompt with ChatGPT and Claude and found that I like more ChatGPT response.

````prompt
You are a Senior Software Engineer, and you are helping me write a implementation plan document for our new application.

We are building a proof-of-concept visual workflow automation platform (similar to Zapier) for designing, building, and managing automated workflows through a no-code builder interface. In the attachment, I am adding the functional-requirements.md document with all application details. Also I'm attaching screenshots of a similar application so that you can be inspired.

Please create a detailed implementation plan divided into phases and tasks. Each phase should consist of a set of tasks. Every task must be an independent unit, and upon its completion, the application **MUST** be functional and **MUST** be available for manual testing and verification. Each task in the generated document will later be marked as done, so there should be an [] next to each task, in which we will insert an 'x' to indicate that the task is completed.

I would like the application to be fully functional after each statement, after each phase. Therefore, I think that a good order of operations will be as follows:

- **Guiding Principle: Incremental Functionality**
  - Ensure the application is fully functional after each statement / phase.
  - After every phase, the user should be able to interact with the current subset of features in a meaningful way.

- **Phase 1: Project Setup and Skeleton**
  - Create the project (e.g., using a chosen framework and tooling).
  - Set up the basic project structure and skeleton.
  - Configure dependencies and base configuration required for further work.

- **Phase 2: Workflow Functionality – Canvas with React Flow**
  - Introduce the **Workflow** feature as a core concept.
  - Integrate **React Flow** into the project.
  - Create an initial empty canvas that renders correctly in the UI.

- **Phase 3: Initialize an Empty Workflow**
  - Define the data structure for a **Workflow**.
  - Initialize an empty Workflow instance that contains:
    - One empty **trigger node**.
    - One empty **action node**.
  - Make sure this structure is persisted (locally or via API) if needed.

- **Phase 4: Add Nodes to the Workflow Canvas**
  - Render the trigger and action nodes on the React Flow canvas.
  - Ensure the nodes are correctly positioned and visible.
  - Connect the workflow data model with the visual representation on the canvas.

- **Phase 5: Editing the Flow**
  - Enable editing of the flow on the canvas, including:
    - Modifying node properties/configuration.
    - Adjusting connections between nodes.
    - Adding, removing, or rearranging nodes.
  - Ensure that all edits are reflected both in the UI and in the underlying Workflow data.

The application will be built with React, Next.js, and TypeScript and must meet the highest standards of code quality. When writing the plan, you **MUST** follow these best practices:

## Architecture

- **Feature-based folder structure** - group by feature, not file type. Each feature contains its components, hooks, types, and tests. We can also add the feature catalog to the feature itself. For example, node feature will be a workflow feature.
- **Separation of concerns** - components handle UI, hooks handle state logic, services handle I/O. Never mix API calls with rendering.
- **Dependency injection** - pass dependencies (storage, API clients) as parameters to hooks/functions. Enables testing and flexibility.

## TypeScript

- **No `any`** - use `unknown` and narrow with type guards.
- **Discriminated unions for state** - model async states explicitly:
```typescript
  type AsyncState<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: Error };
````

- **Explicit return types on public APIs** - hooks and exported functions should declare return types for documentation and safety.

## Components

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

## State Management

- **Derive state, don't sync it** - compute values from source state instead of storing derived data.
- **Colocate state** - keep state as close to where it's used as possible. Lift only when necessary.
- **Immutable updates** - always return new objects/arrays, never mutate.

## Error Handling

- **Result types over exceptions** - makes errors explicit in the type system:

```typescript
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
```

- **Validation at boundaries** - validate external data (API responses, user input) with schemas (Zod). Trust nothing from outside.
- **Error boundaries** - wrap feature sections to prevent full-app crashes.

## Code Quality

- **Constants over magic values** - extract strings, numbers, config to named constants.
- **Pure functions for logic** - extract complex conditions and transformations to testable pure functions.
- **Consistent naming conventions**:
  - `handleX` for event handlers
  - `useX` for hooks
  - `XProvider` / `useX` for context pairs
  - `XService` for API/external service wrappers

## Testing

- **Test behavior, not implementation** - test what the hook/component does, not how it does it.
- **Arrange-Act-Assert structure** - clear setup, action, and expectation in each test.
- **Mock at boundaries** - mock API calls and storage, not internal functions.

## Performance (React 19+)

- **Trust the compiler** - React Compiler handles memoization. Remove manual `useCallback`, `useMemo`, `memo()` unless you have measured performance issues.
- **Measure before optimizing** - use React DevTools Profiler. Don't optimize hypothetical problems.

## Don'ts

- Don't use `useEffect` for derived state or event handling.
- Don't store in state what can be computed.
- Don't pass more than 4-5 props - consider composition or context.
- Don't catch errors silently - log, report, or surface to user.
- Don't mix controlled and uncontrolled inputs.

Your generated response **MUST** be in markdown, later I will use this file in my project.

````

The prompt did not provide me with a perfect answer, so I continued the conversation with the chat to enrich the document with values that I consider essential. For example, I asked it to rewrite node naming convention to `type` + `name`. Additionally, I edited the document manually to meet my needs.

```prompt
We have a somewhat strange setup of these nodes here. We have NodeType and ConcreteTriggerType, ConcreteActionType. I don't like it. Please suggest something different here. I would like to have some basic naming convetion like node type and node name.
````
