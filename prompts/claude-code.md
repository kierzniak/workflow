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

## Phase 5.

After implementing the phase 4, I moved to the phase 5, where I cleared the context and wrote this prompt.

```prompt
We want to start implementing task 5.1 from phase 5, please analyze the project, @project/functional-requirement.md and @project/implementation-plan.md. Next, schedule the plan of this task. Please show me sample code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task. When you finish each individual task, please update our @project/implementation-plan.md.
```

Claude wanted to create a dialogin in our workflow feature. I stopped him and suggested that he should create everything in the shared space instead of our functionality.

```prompt
 Dialog is quite a generic component, and I believe it should be stored somewhere in a shared accessible place rather than in our workflow. Our workflow will use the dialog, but it shouldn't define it itself. Can what we have already defined, the dialog we have already installed, be sufficient for us? Do we need to define anything additional? If you want to create additional hooks, also create them in shared accessible place.
```

```prompt
Okay, now please complete task 5.2. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 5.3. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 5.4. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 5.5. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 5.6. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 5.7. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 5.8. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

Claude proposed a full featured integration with very broad configuration possibilities. I think that for now we don't need this, so I suggested simplifying it significantly.

```prommpt
I wanted to simplify this a bit. I think that for now we don't need tabs and we don't need to combine conditions, either AND or OR. Let's make it as simple as possible. One condition for A and one condition for B. Let's keep it as simple as we can.
```

```prompt
Okay, now please complete task 5.9. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 5.10. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 5.11. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 5.12. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

After the implementation of phase 5, I asked for a few functional changes and a few visual changes.

```prompt
Few changes:
- All inputs should be 100% width
- The single condition in the node if/else should be on one line. Just like it is in the screenshot in Zappier
- Required fields should have an asterisk after the label
- After selecting a node from the selector, a new dialog for configuring the selected node should immediately be displayed
```

After changes, at the end of phase 5, I don't like the structure of the Node directories, so I asked Claude to rewrite it. I had in mind roughly how I want it to look, but I asked him for different options. Before this tasks I cleared context.

```prompt
Phase 5 is finished, but the folder structure we currently have didn't turn out well for me. When we want to add a new node, a new action, or a new trigger, we have to do it in many places, which goes against the Open-Closed Principle from SOLID. Please suggest how I can rearrange the folder and file structure to address this issue. Let's propose three options.
```

## Phase 6.

After implementing the phase 5, I moved to the phase 6, where I cleared the context and wrote this prompt.

```prompt
We want to start implementing task 6.1 from phase 6, please analyze the project, @project/functional-requirement.md and @project/implementation-plan.md. Next, schedule the plan of this task. Please show me sample code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task. When you finish each individual task, please update our @project/implementation-plan.md.
```

```prompt
Okay, now please complete task 6.2. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

After the implementation, I realized that I wrote the instructions for Claude a bit incorrectly. Plus node should not be replaced by the new node, but the new node should be added after the plus node to preserve plus icon between nodes.

```prompt
Okay, now it doesn't work as expected, we forgot one thing. We always want the plus icon to be between the nodes. At this moment, when we click the plus, that node get replaced by action node. But, we should add that node after the clicked plus icon to save plus icon. When the plus icon is the last one, we should add new Node and Plus node.
```

After some consideration, I decided to not implement task 6.3, which seemed unnecessary and was creating unnecessary clutter in the code.

## Phase 7.

After implementing the phase 6, I moved to the phase 7, where I cleared the context and wrote this prompt.

```prompt
We want to start implementing task 7.1 from phase 7, please analyze the project, @project/functional-requirement.md and @project/implementation-plan.md. Next, schedule the plan of this task. Please show me sample code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task. When you finish each individual task, please update our @project/implementation-plan.md.
```

```prompt
Okay, now please complete task 7.2. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

After this task, there were some in the relevant branches. That is why it was necessary to change the plan a bit after the implementation. Instead of conditionally bringing the successor to the left branch, I decided to always bring it, because there is always some advantage there.

## Phase 8.

After implementing the phase 7, I moved to the phase 8, where I cleared the context and wrote this prompt.

```prompt
We want to start implementing task 8.1 from phase 8, please analyze the project, @project/functional-requirement.md and @project/implementation-plan.md. Next, schedule the plan of this task. Please show me sample code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task. When you finish each individual task, please update our @project/implementation-plan.md.
```

```prompt
Okay, now please complete task 8.2. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 8.3. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

```prompt
Okay, now please complete task 8.4. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```

For the simplification of this task, I have abandoned the task in which we check if/else has any children and prevent the removal of this node.

```prompt
Okay, let's simplify this task a bit, let's remove any logic that blocks us from deleting the if/else node. If we want to delete the if/else node, both branches will be deleted, meaning it will work exactly the same as all the other nodes.
```

```prompt
Okay, now please complete task 8.5. Please show me code that we will be implementing, as I may want to make changes to it. Next, schedule the execution of this task.
```
