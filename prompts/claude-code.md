## Session 1.

```prompt
Analyze the @project/functional-requirement.md and @project/implementation-plan.md and investigate the projeect, then analyze what has already been implemented from the implementation plan. Then update the implementation plan. Please do not create new files in the project for now, just synchronize the implementation plan with the actual state.
```

```prompt
Okay, now please complete task 1.2.
```

```prompt
Okay, now please complete task 1.5.
```

```prompt
Okay, now please complete task 1.6.
```

After last prompt I saw that our error handling do not follow nextjs best practices so I updated Claude plan to follow Next.js codding standards:

```prompt
I think Next.js already has a mechanism for catching errors, global errors, and we don't need to define our own error boundary, which means we can use the built-in functionalities that Next.js offers. Please add one file, @app/error.tsx, that will capture all errors according to the Next.js documentation. https://nextjs.org/docs/app/getting-started/error-handling
```
