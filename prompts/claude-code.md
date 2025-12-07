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

## Phase 4.

After implementing the phase 3, I moved to the phase 4, where I cleared the context and wrote this prompt.

```prompt
We want to start implementing task 4.1 from phase 4, please analyze the project, @project/functional-requirement.md and @project/implementation-plan.md. Next, schedule the plan of this task. Please show me sample code that we will be implementing, as I may want to make changes to it.Next, schedule the execution of this task. When you finish each individual task, please update our @project/implementation-plan.md.
```

```prompt
Okay, now please complete task 4.2. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

Claude asked me some additional questions about color design and my response was.
g

```prompt
I think there is no color distinction between Trigger and Action here. An unconfigured Node has a dashed line, while a configured one has a solid line. An unconfigured Node has a gray badge, and a configured badge is orange. In our case, maybe we should not use orange color, just the Goldman Sachs branding, which is a bluish tone #7297c5
```

```prompt
Okay, now please complete task 4.3. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

I wasn't happy with code proposed by Claude so I add to clarification to the plan:

```prompt
The trigger node is a higher-level node, we can have many different types of triggers. For now, we only have a schedule, but in the future, we might have, for example, a webhook. We shouldn't add schedule logic to the basic trigger node, the schedule should be a separate node that extends the trigger.
```

```prompt
Okay, now please complete task 4.4. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 4.5. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 4.6. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

And here I had a doubt because I saw that PlaceholderNode somewhat duplicates the logic of our BaseNode.

```prompt
The placeholder will have dashed border, and we already have those dashed border in our base node. I think they might duplicate their functionality a bit. Unconfigured nodes should use the placeholder. The base node probably shouldn't be displayed at all, but the placeholder can use it to group some logic.
```

```prompt
 I think I prefer to use Placeholder Node instead of Base Node. Placeholder Node is an unconfigured Node. We still need to add the ability to configure whether the placeholder can be filled by a Trigger, or by Action. This way we won't need BaseNode, TriggerNode, and ActionNode. We will only have a Placeholder, in which there will be the option to configure which type of node we can fill in, and possibly a badge configuration, where we will be able to enter Action or Trigger in an empty badge. This will indicate what the user can expect when they click the placeholder
```

```prompt
Okay, now please complete task 4.7. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 4.8. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 4.9. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 4.10. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

This was the first time when I could saw a rendered workflow and I have couple problems which I resolved with this prompt.

```
Ok I have multiple warnings in console like:
[warnings from console]
I think the problem is that we are missing Handles from React Flow. Please, let's add them so that the paths are displayed correctly. Plus icon is not centered with respect to the node and it is not centered with respect to space between nodes. During the calculation of the distances between the nodes, do not take their height into account. Please correct this. Additionally, I would like the zoom to be set to 100% instead of fitView when loading for the first time. We can set fitView with a maximum zoom of 1, then it will solve our problem.
```
