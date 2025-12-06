This prompt was used to generate functional-requirement.md document. Also I used screenshot to give a context and enrich prompt. I tested this prompt with ChatGPT and Claude and found that I like more ChatGPT response.

```prompt
You are a Senior Software Engineer, and you are helping me write a functional requirement document for our new application.

We are building a proof-of-concept visual workflow automation platform (similar to Zapier) for designing, building, and managing automated workflows through a no-code builder interface. The application uses an infinite-scroll canvas with nodes that connect to visualize the workflow. We use React Flow for the canvas and node-based workflow visualization.

For simplicity, a new workflow is always created when the application is opened. The user cannot create, view, edit, or delete workflows from the application interface. Each new workflow starts with a canvas containing one unconfigured trigger node and one unconfigured action node. Users can navigate the canvas by clicking and dragging on empty space, using the mouse scroll wheel, or using a trackpad. Zoom-in, zoom-out, and reset options are also available. Drag-and-drop of nodes is not allowed.

Users can add, edit, configure, and remove nodes in the workflow. A node can be added by clicking the plus icon located below each node. This plus icon appears both at the end of the flow and between existing nodes. The plus icon is itself a type of helper node that provides greater control over where new nodes can be inserted.

When the user clicks the plus icon, a blank node replaces the plus icon, and a modal window opens with a list of available node types. After selecting a node type, the blank node is populated, and a new modal window opens with the configuration settings for that node. Each node type can have its own unique set of settings.

Each new node must appear directly below the previous node, spaced evenly. The only exception is an if/else control flow node, which is also placed below the previous node but creates two additional branching paths.

Users can edit or configure a node by clicking it. When a node is selected, the application opens a modal window displaying its configuration settings.

Im attaching images with screenshot from similar app for context. You must respond to me in markdown format.
```

The prompt did not provide me with a perfect answer, so I continued the conversation with the chat to enrich the document with values that I consider essential. For example, I asked it to rewrite section if/else with following prompt. Additionally, I edited the document manually to meet my needs.

```prompt
OK, we need to enrich the description of the if-else node a bit. The if-else configuration works in such a way that when we add an if-else action in the configuration, we can choose conditions for path A and select conditions for path B. Of course, during the configuration of these conditions, we can use values from previous nodes. If the values for one condition are true, we select path A, and if the values for the other condition are true, we select path B. When we add an if-else condition, two paths and two empty action nodes immediately appear so that we can add the appropriate types there. It's very similar to how it is when creating applications. When we have those empty action nodes, they also appear. When you make changes, please only output the changes that need to be made. Don't give me the entire document from scratch.
```
