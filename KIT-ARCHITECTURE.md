# Workflow-First AI Kit Architecture

## Goal

Build a reusable workflow-first AI kit inspired by CodexKit.

This kit must use:
- workflows as the orchestration layer
- agents as scoped executors
- skills as reusable capabilities
- hooks as mandatory runtime gates

The kit must be dynamic.
It must read project context from the user's workspace and must never hardcode business values, brand values, or project-specific logic into the kit itself.

## Core Runtime Model

The runtime architecture must follow this chain:

```text
User Request
-> Thin Entrypoint
-> Mandatory Hooks
-> Owner Workflow
-> Scoped Agents
-> Stage-Specific Skills
-> Outputs in Project Workspace
```

### Non-negotiable rule

One request must have one owner workflow.

Routing must happen before deep execution.

Workflows own orchestration.
Agents execute scoped work.
Skills support execution only.
Hooks can block execution.

## Layer Responsibilities

## 1. Entrypoints

Entrypoints are the public command surface.

They must:
- be thin
- not contain orchestration logic
- normalize the user request
- route into the correct workflow

Canonical command format:
- `$dv-help`
- `$dv-<workflow> <goal / task / brief>`

Examples:
- `$dv-help`
- `$dv-primary Build a churn-analysis portfolio project`
- `$dv-data-preparation Load CSV files, clean nulls, and derive chart-ready tables`
- `$dv-data-visualize Refresh visuals after source schema changed`

### Entrypoint rule

Prompts are not the architecture.
They are only the public interface.

## 2. Workflows

Workflows are the source of truth for runtime behavior.

Each workflow must own:
- intake rules
- routing rules
- planning logic
- delegation rules
- skill activation policy
- output contract
- review and quality gates
- stop conditions

### Workflow rule

Skills and agents must not create alternate routing trees outside workflow docs.

### Workflow families

Recommended structure:
- primary workflow
- help workflow
- domain workflows
- operational workflows

Example:
- `primary-workflow`
- `help-workflow`
- `data-preparation-workflow`
- `data-visualize-workflow`
- `publish-workflow`
- `debug-workflow`
- `document-management-workflow`
- `orchestration-protocol`
- `hook-workflow`

### Owner workflow rule

A broad or ambiguous request goes to the primary workflow first.
A clear domain request routes directly to the matching domain workflow.

## 3. Agents

Agents are role-based executors.

They do not own routing.
They execute well-scoped tasks inside a workflow stage.

Each agent should have:
- a clear role
- a clear input contract
- a clear output contract
- defined ownership boundaries
- allowed skills
- completion statuses

### Required completion statuses

Every agent should report one of these:
- `DONE`
- `DONE_WITH_CONCERNS`
- `BLOCKED`
- `NEEDS_CONTEXT`

### Agent rule

Agents must receive only the context they need.
Do not pass full conversation history.
Pass a task summary, relevant files, constraints, acceptance criteria, and output paths.

### Delegation patterns

Use:
- sequential chaining when outputs depend on previous work
- parallel execution only for independent scopes

Parallel delegation is allowed only if:
- file and path ownership is explicit
- outputs do not overlap
- integration order is defined
- a final reviewer is defined

## 4. Skills

Skills are reusable capability modules.

They support execution at the workflow or agent stage level.

A skill may include:
- a `SKILL.md`
- scripts
- templates
- references
- assets
- checklists

Each skill must define:
- when to use it
- when not to use it
- expected inputs
- expected outputs
- dependencies
- constraints

### Skill rule

Skills must not become top-level routers.
They are support modules, not orchestration owners.

### Activation rule

Activate only the minimum set of skills needed for the current stage.

Do not globally activate all skills.

## 5. Hooks

Hooks are mandatory runtime gates.

Hooks run before sensitive or stateful execution steps.

Hooks must be able to:
- validate project and workspace context
- validate required docs and runtime state
- initialize subagent handoff context
- block access to secrets
- block missing provider and API setup
- stop execution when prerequisites fail

### Hook authority

If a hook blocks, execution must stop until the blocker is resolved.

### Required hooks

At minimum implement:

#### `run-workflow-preflight`

Purpose:
- ensure a valid workspace exists
- ensure a project is selected
- ensure runtime can continue

#### `project-preflight`

Purpose:
- confirm project docs are present and valid
- confirm project context is ready before planning or output generation

#### `subagent-init`

Purpose:
- inject stable context into subagent handoff
- include project paths, report paths, plan paths, naming rules, and constraints

#### `privacy-block`

Purpose:
- check before reading `.env`, secrets, credentials, auth material, tokens, or private config

#### `provider-key-gate`

Purpose:
- check required API keys before provider-dependent features run

## Directory Architecture

Use this structure:

```text
kit-root/
|-- .codex/
|   |-- config.toml
|   |-- prompts/
|   |   |-- kit.md
|   |   |-- dv-help.md
|   |   |-- dv-primary.md
|   |   `-- dv-data-visualize.md
|   |-- workflows/
|   |   |-- primary-workflow.md
|   |   |-- data-preparation-workflow.md
|   |   |-- data-visualize-workflow.md
|   |   |-- publish-workflow.md
|   |   |-- debug-workflow.md
|   |   |-- document-management-workflow.md
|   |   |-- orchestration-protocol.md
|   |   |-- hook-workflow.md
|   |   |-- hook-runtime-contract.md
|   |   `-- help-workflow.md
|   `-- agents/
|       |-- planner-agent.toml
|       |-- database-agent.toml
|       |-- visualize-agent.toml
|       |-- debug-agent.toml
|       |-- tester-agent.toml
|       |-- git-manager-agent.toml
|       `-- ...
|-- .agents/
|   `-- skills/
|       |-- content-strategy/
|       |   |-- SKILL.md
|       |   |-- scripts/
|       |   `-- references/
|       |-- seo-audit/
|       `-- ...
|-- scripts/
|   `-- hooks/
|       |-- run-workflow-preflight.cjs
|       |-- project-preflight.cjs
|       |-- subagent-init.cjs
|       |-- privacy-block.cjs
|       `-- provider-key-gate.cjs
|-- docs/
|   `-- ...
`-- projects/
    `-- <project-slug>/
        |-- README.md
        `-- docs/
            `-- assets/
```

## Runtime Context Rules

The kit must separate template context from live project context.

### Template space

Root `docs/` is template, example, and reference space only.

### Live execution space

All real execution must happen inside:

```text
projects/<project-slug>/
  README.md
  .gitignore
  docs/
    assets/
```

### Runtime docs contract

The kit must read live context only from project workspace docs.

Example:

```text
projects/<project-slug>/docs/project-overview.md
projects/<project-slug>/docs/brand-guidelines.md
projects/<project-slug>/docs/strategy.md
```

### Dynamic context rule

Never hardcode:
- colors
- fonts
- company voice
- goals
- audience
- ICP
- messaging
- business rules

Always read them from project docs or derive them from user-provided workspace files.

## Relationship Model

Use this relationship model:

### Entrypoint -> Workflow

Entrypoints select or route to the owner workflow.

### Workflow -> Agents

Workflow delegates scoped work to agents by stage.

### Agents -> Skills

Agents activate only the skills needed to complete their current task.

### Hooks -> Workflow and Agents

Hooks run before planning, delegation, secret access, or provider-dependent execution.

### Workspace -> All runtime execution

Workflows, agents, and skills must read and write from the active project workspace.

## Activation Model

Activation should work like this:

## 1. Entrypoint activation

A user invokes:
- `$dv-help`
- `$dv-primary`
- `$dv-<workflow>`

This activates the public runtime surface.

## 2. Hook activation

Before workflow intake:
- run preflight hooks
- validate project and workspace
- stop if blocked

## 3. Workflow activation

The system chooses one owner workflow:
- umbrella workflow for ambiguous requests
- direct domain workflow for clear requests

## 4. Agent activation

The workflow activates the smallest useful set of agents for the current stage.

Examples:
- intake agent
- researcher
- planner
- executor
- reviewer

## 5. Skill activation

Each agent activates only the stage-specific skills it needs.

Examples:
- research skill during discovery
- writing skill during content generation
- review skill during quality gate

## 6. Review activation

Before finalizing, activate the correct review layer:
- content reviewer
- campaign reviewer
- code reviewer
- QA reviewer

Use the reviewer that matches the artifact type.

## Routing Rules

The system must route like this:

### Broad request

Broad, ambiguous, or cross-domain request
-> umbrella workflow

### Clear request

Clear domain-specific request
-> domain workflow

### Help request

Help, usage, discovery, or onboarding
-> help workflow

### Operational request

Storage, MCP, integrations, dashboard, or toolkit maintenance
-> operational workflow

### Routing rule

Do not let agents guess routing after execution has already started.
Route first.

## Output Rules

All outputs must go to the active project workspace.

### Plans

Write to:

```text
projects/<project-slug>/docs/
```

### Deliverables

Write to:

```text
projects/<project-slug>/docs/assets/
```

### Live docs

Write to:

```text
projects/<project-slug>/docs/
```

### Root docs rule

Do not treat root `docs/` as runtime output space unless the task is explicitly about editing templates.

## Orchestration Rules

## Sequential chaining

Use when one step depends on previous outputs.

Example:
- intake
- research
- planning
- execution
- review

## Parallel execution

Use only when tasks are independent.

Before parallel execution define:
- ownership per agent
- output paths
- constraints
- integration order
- final reviewer

### Conflict prevention

If two agents need the same file or output path, do not run them in parallel.

## Quality Gate

A task is complete only when:
1. the correct outputs exist in the correct workspace paths
2. required validation and review passes
3. unresolved questions are explicitly listed
4. the final summary includes changed files, output paths, and next actions if needed

## Design Principles

The kit must follow:
- YAGNI
- KISS
- DRY

Also enforce:
- dynamic context only
- workflow-first orchestration
- minimal skill activation
- explicit ownership boundaries
- hook-enforced safety
- predictable output locations

## Anti-Patterns To Avoid

Do not:
- put orchestration logic in prompts
- let skills behave like workflows
- let agents invent new routing trees
- hardcode project values
- use root docs as live context
- bypass hooks
- delegate without ownership boundaries
- activate every skill just in case
- continue execution after a hook blocks

## Minimal Example Runtime

```text
User:
$dv-primary Build a churn-analysis portfolio project for an e-commerce dataset

System:
1. Run run-workflow-preflight
2. Run workflow-routing-gate
3. Activate primary-workflow
4. Delegate:
   - planner-agent for intake and planning
   - database-agent for data preparation
   - visualize-agent for visualization output
   - tester-agent for quality gate
   - git-manager-agent for publish readiness
5. Activate only relevant skills:
   - plan
   - Apache Superset or RAWGraphs
   - debug if a workflow fails
6. Save outputs to:
   - projects/<project-slug>/docs/...
   - projects/<project-slug>/docs/assets/...
7. Finalize only after review passes
```

## Build Instruction For AI

Build this kit as a workflow-first system.

Requirements:
- create thin public entrypoints
- create a workflow layer as the orchestration source of truth
- create role-based agents with clear contracts
- create reusable skills with `SKILL.md`
- create mandatory hooks for preflight, project validation, subagent init, privacy blocking, and provider key gating
- enforce dynamic project context from `projects/<project-slug>/docs/`
- keep root `docs/` as template-only space
- enforce output placement into `projects/<project-slug>/docs/` and `projects/<project-slug>/docs/assets/`
- support sequential and parallel delegation safely
- implement strict stop behavior when hooks block
- keep activation minimal and stage-specific
