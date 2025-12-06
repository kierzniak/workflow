## Phase 1.

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

## Phase 2.

After implementing the phase 1, I moved to the phase 2, where I cleared the context and wrote this prompt.

```prompt
We want to start implementing task 2.1 from phase 2, please analyze the project, @project/functional-requirement.md and @project/implementation-plan.md. Next, schedule the plan of this task. Please show me sample code that we will be implementing, as I may want to make changes to it.Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 2.2. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

and follow up prompt to our plan for 2.2

```prompt
Everything is correct, but I don't see if this canvas is working. So please render the canvas on main page, where it should be rendered.
```

```prompt
Okay, now please complete task 2.3. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 2.4. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

and follow up prompt to our plan for 2.4.

```
FitView is not a reset. FitView means you can see all nodes in a given view. The Reset button is the button that resets the zoom to 100%. There is no such button.
```

```prompt
Okay, now please complete task 2.5. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 2.6. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, I think all tasks from phase two have been completed. Please set our phase two as completed in our @project/implementation-plan.md, along with the individual tasks.
```

## Phase 3.

After implementing the phase 2, I moved to the phase 3, where I cleared the context and wrote this prompt.

```prompt
We want to start implementing task 3.1 from phase 3, please analyze the project, @project/functional-requirement.md and @project/implementation-plan.md. Next, schedule the plan of this task. Please show me sample code that we will be implementing, as I may want to make changes to it.Next, schedule the execution of this task. When you finish each individual task, please update our @project/implementation-plan.md.
```

```prompt
Okay, now please complete task 3.2. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 3.3. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

In the plan, I saw some strange type of branch that seemed completely unnecessary to me, so I corrected the plan.

```prompt
I don't know what you mean by branch here, but I think that edge can have multiple sources and targets. And by this we can recognize if our node has more targets, more paths. We don’t need a separate type of branch for this.
```

```prompt
Okay, now please complete task 3.4. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 3.5. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 3.6. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 3.7. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```
