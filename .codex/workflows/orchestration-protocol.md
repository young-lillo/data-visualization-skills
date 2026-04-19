# Orchestration Protocol

Defines how the kit coordinates `spawn_agent` execution safely and predictably.
Use this protocol after routing has selected one owner workflow and before any parallel delegation starts.

## Delegation Context

When spawning subagents, always include:

1. work context path
2. reports path
3. plans path
4. specific files to read
5. specific files to modify if any
6. acceptance criteria

### Required Paths

- work context: the git root or project workspace that owns the task
- reports path: `{work_context}/plans/reports/` when plan reports exist
- plans path: `{work_context}/plans/` when plans exist
- project docs path: `projects/<project-slug>/docs/` for project-scoped outputs

### Rule

If the current working directory differs from the real work context, use the work-context paths in the subagent prompt, not the shell CWD.

## Core Rules

- one request has one owner workflow
- route before delegation
- prefer the smallest useful agent set
- do not parallelize until prerequisites are complete
- pass only the scoped context needed for the assigned task
- define the integration and review path before parallel fan-out
- all spawned agents must receive the current hook-safe runtime context
- the controller keeps orchestration responsibility; subagents do not coordinate each other implicitly

## Agent Roster

Default controller-side roster:

- `planner`
- `researcher`
- `ui-ux-designer`
- `tester`
- `debugger`
- `code-reviewer`
- `docs-manager`
- `project-manager`
- `git-manager`
- `mcp-manager`

Use support implementation agents only when the owner workflow needs them and file ownership is explicit.

## Sequential Chaining

Use sequential chaining when later work depends on earlier outputs.

Recommended chains:

- planning -> implementation -> testing -> review -> docs sync
- research -> design -> code -> validation
- debug -> fix -> retest -> review
- intake -> data preparation -> visualization -> publish

### Sequential Rules

- each subagent finishes fully before the next dependent subagent starts
- pass forward only the outputs needed by the next step
- if a step changes scope, refresh the plan before continuing
- use `tester` after implementation or workflow changes
- use `code-reviewer` after tests or validation pass

## Parallel Execution

Use parallel delegation only when:

- prerequisites are already complete
- file ownership boundaries are explicit
- outputs do not overlap
- integration order is known in advance
- one final reviewer and one final integrator are already defined

### Good Parallel Patterns

- research topics split by tool, deployment path, or technical unknown
- docs sync in parallel with non-overlapping implementation work
- validation in parallel with non-overlapping documentation cleanup
- separate project slices with disjoint write ownership

### Bad Parallel Patterns

- two agents editing the same workflow file
- sending broad "figure it out" prompts to multiple agents
- parallelizing before routing and acceptance criteria are clear
- delegating the immediate blocking step when the controller can do it directly faster

## Subagent Status Protocol

Subagents should finish with one of these statuses:

| Status | Meaning | Controller action |
|---|---|---|
| `DONE` | Task completed successfully | Proceed to next step |
| `DONE_WITH_CONCERNS` | Completed with flagged doubts or risks | Read concerns and address correctness issues before moving on |
| `BLOCKED` | Cannot complete the task | Change context, scope, or approach before retry |
| `NEEDS_CONTEXT` | Missing required information | Provide context and re-dispatch |

### Handling Rules

- never ignore `BLOCKED` or `NEEDS_CONTEXT`
- never force the same failed approach repeatedly
- treat correctness concerns as blocking until reviewed
- treat tech-debt concerns as follow-up items unless they threaten correctness now
- if the same delegated task fails repeatedly, simplify it or take it back into the controller path

### Reporting Format

Preferred closing format:

```text
Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
Summary: 1-2 sentences
Concerns/Blockers: if applicable
```

## Context Isolation Principle

Subagents receive only the context they need.
Do not pass full session history or broad, ambiguous mission statements.

### Rules

1. craft prompts explicitly with task, scope, files, and acceptance criteria
2. summarize prior decisions instead of replaying the conversation
3. scope file references tightly
4. include only the relevant plan phase, not the entire plan tree
5. keep controller-only coordination detail out of worker prompts

## Prompt Template

```text
Task: [specific task description]
Files to read: [list]
Files to modify: [list or none]
Acceptance criteria: [list]
Constraints: [list]
Plan reference: [phase or plan path if applicable]

Work context: [project or repo path]
Reports: [reports path]
Plans: [plans path]
```

## Workflow-Specific Coordination Rules

### Data Preparation

- read project docs before changing prepared outputs
- keep data contracts stable for downstream visualization when possible
- document schema or contract changes in project docs before handoff

### Visualization

- read project docs before changing dashboards
- consume the prepared-data contract from `$dv-data-preparation`
- stay on one selected path at a time: `metabase`, `grafana`, or `apache-superset`
- rerun validation when dashboard structure, queries, or source contracts change

### Publish

- start only after the owner workflow reports stable validated outputs
- verify git-readiness and deploy-readiness without writing outside the approved project structure

### Docs Management

- keep outputs under `projects/<project-slug>/docs/`
- prevent ad hoc artifact sprawl outside the project docs tree

## Anti-Patterns

| Bad | Good |
|---|---|
| "Continue from where we left off" | "Update visualization docs for the Grafana refresh in `projects/demo/docs/visualization.md`" |
| "Fix the issues we discussed" | "Fix the publish checklist mismatch in `projects/demo/docs/publish.md`" |
| "Look at the codebase and figure it out" | "Read `project-plan.md` and `visualization.md`, then update the Metabase path notes" |
| passing full chat history | a short scoped task summary with concrete files |

## Completion Gate

Orchestration is complete only when:

- the owner workflow has finished its scoped responsibilities
- required docs exist in the project workspace
- required validation has passed
- changed files and output paths are clear
- unresolved questions are listed if any
