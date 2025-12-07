# Workflow

Visual workflow automation platform (Zapier-like) for designing automated workflows through a no-code builder interface.

**Live Demo:** https://workflow-gs.vercel.app

## Getting Started

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Features

### Triggers

- **Schedule** - Run workflow on a schedule (hourly, daily, weekly, monthly)
- **Webhook** - Run workflow when HTTP request is received

### Actions

- **Send Email** - Send an email to a recipient
- **Send SMS** - Send an SMS message to a phone number
- **If/Else** - Branch workflow based on conditions

## Documentation

Project documentation is located in the `/project/` directory:

- `functional-requirement.md` - Complete functional requirements specification
- `implementation-plan.md` - Implementation plan and architecture

## Prompts

Saved prompts used to build this application are located in the `/prompts/` directory:

- `claude-code.md` - Development history with phase-by-phase prompts
- `funcional-requirments.md` - Original prompt for functional requirements
- `implementation-plan.md` - Original prompt for implementation plan

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- React Flow (@xyflow/react)
