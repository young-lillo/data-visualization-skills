---
name: plan
description: "Plan implementations, design architectures, create technical roadmaps with detailed phases. Use for feature planning, system design, solution architecture, implementation strategy, phase documentation."
argument-hint: "[task] OR [archive|red-team|validate]"
license: MIT
metadata:
  author: data-visualization-kit
  version: "1.0.0"
---

# Planning

## Codex Adaptation

- Replace legacy `AskUserQuestion` guidance with a direct concise user question only when required.
- Replace legacy task-tool hydration with plan files under `plans/` plus `update_plan`.
- Replace legacy cook-command examples with the active Data Visualization Kit workflow, usually `$dv-cook` after intake or the matching specialist `$dv-*` workflow.
- Use repo-local paths under `.agents/skills/` and `projects/<slug>/docs/`; do not rely on legacy hidden-runtime paths.

Create detailed technical implementation plans through research, codebase analysis, solution design, and comprehensive documentation.

**IMPORTANT:** Before you start, scan unfinished plans in the current project at `./plans/` directory, read the `plan.md`, and update any relevant in-flight plan. If critical clarification is still missing, ask the user directly.

### Cross-Plan Dependency Detection

During the pre-creation scan, detect and mark blocking relationships between plans:

1. **Scan** — Read `plan.md` frontmatter of each unfinished plan (status != `completed`/`cancelled`)
2. **Compare scope** — Check overlapping files, shared dependencies, same feature area
3. **Classify relationship:**
   - New plan needs output of existing plan → new plan `blockedBy: [existing-plan-dir]`
   - New plan changes something existing plan depends on → existing plan `blockedBy: [new-plan-dir]`, new plan `blocks: [existing-plan-dir]`
   - Mutual dependency → both plans reference each other in `blockedBy`/`blocks`
4. **Bidirectional update** — When relationship detected, update BOTH `plan.md` files' frontmatter
5. **Ambiguous?** → Ask the user directly which dependency relationship applies: `blocks`, `blockedBy`, or none.

**Frontmatter fields** (relative plan dir paths):
```yaml
blockedBy: [260301-1200-auth-system]     # This plan waits on these plans
blocks: [260228-0900-user-dashboard]     # This plan blocks these plans
```

**Status interaction:** A plan with `blockedBy` entries where ANY blocker is not `completed` → plan status should note `blocked` in its overview. When all blockers complete, the blocked plan becomes unblocked automatically on next scan.

## Default (No Arguments)

If invoked with a task description, proceed with planning workflow. If invoked without arguments or with unclear intent, ask the user directly which planning operation they want.

| Operation | Description |
|-----------|-------------|
| `(default)` | Create implementation plan for a task |
| `archive` | Write journal entry & archive plans |
| `red-team` | Adversarial plan review |
| `validate` | Critical questions interview |

Use a short direct question such as: "Do you want a new plan, archive, red-team review, or validation?"

## Workflow Modes

Default: `--auto` (analyze task complexity and auto-pick mode).

| Flag | Mode | Research | Red Team | Validation | Cook Flag |
|------|------|----------|----------|------------|-----------|
| `--auto` | Auto-detect | Follows mode | Follows mode | Follows mode | Follows mode |
| `--fast` | Fast | Skip | Skip | Skip | `--auto` |
| `--hard` | Hard | 2 researchers | Yes | Optional | (none) |
| `--parallel` | Parallel | 2 researchers | Yes | Optional | `--parallel` |
| `--two` | Two approaches | 2+ researchers | After selection | After selection | (none) |

Add `--no-tasks` to skip task hydration in any mode.

Load: `references/workflow-modes.md` for auto-detection logic, per-mode workflows, context reminders.

## When to Use

- Planning new feature implementations
- Architecting system designs
- Evaluating technical approaches
- Creating implementation roadmaps
- Breaking down complex requirements

## Core Responsibilities & Rules

Always honoring **YAGNI**, **KISS**, and **DRY** principles.
**Be honest, be brutal, straight to the point, and be concise.**

### 0. Scope Challenge
Load: `references/scope-challenge.md`
**Skip if:** `--fast` mode or trivial task (single file fix, <20 word description)

### 1. Research & Analysis
Load: `references/research-phase.md`
**Skip if:** Fast mode or provided with researcher reports

### 2. Codebase Understanding
Load: `references/codebase-understanding.md`
**Skip if:** Provided with scout reports

### 3. Solution Design
Load: `references/solution-design.md`

### 4. Plan Creation & Organization
Load: `references/plan-organization.md`

### 5. Task Breakdown & Output Standards
Load: `references/output-standards.md`

## Process Flow (Authoritative)

```mermaid
flowchart TD
    A[Pre-Creation Check] --> B[Cross-Plan Scan]
    B --> C[Scope Challenge]
    C --> D[Mode Detection]
    D -->|fast| E[Skip Research]
    D -->|hard/parallel/two| F[Spawn Researchers]
    E --> G[Codebase Analysis]
    F --> G
    G --> H[Write Plan via Planner]
    H --> I{Red Team?}
    I -->|Yes| J[Red Team Review]
    I -->|No| K{Validate?}
    J --> K
    K -->|Yes| L[Validation Interview]
    K -->|No| M[Hydrate Tasks]
    L --> M
    M --> N[Output Cook Command]
    N --> O[Journal]
```

**This diagram is the authoritative workflow.** Prose sections below provide detail for each node.

## Workflow Process

1. **Pre-Creation Check** → Check Plan Context for active/suggested/none
1b. **Cross-Plan Scan** → Scan unfinished plans, detect `blockedBy`/`blocks` relationships, update both plans
1c. **Scope Challenge** → Run Step 0 scope questions, select mode (see `references/scope-challenge.md`)
    **Skip if:** `--fast` mode or trivial task
2. **Mode Detection** → Auto-detect or use explicit flag (see `workflow-modes.md`)
3. **Research Phase** → Spawn researchers (skip in fast mode)
4. **Codebase Analysis** → Read docs, scout if needed
5. **Plan Documentation** → Write comprehensive plan via planner subagent
6. **Red Team Review** → Run the red-team review flow against `{plan-path}` (hard/parallel/two modes)
7. **Post-Plan Validation** → Run the validation flow against `{plan-path}` (hard/parallel/two modes)
8. **Hydrate Tasks** → Create tracked execution steps from phases (default on, `--no-tasks` to skip)
9. **Context Reminder** → Output cook command with absolute path (MANDATORY)
10. **Journal** → Use the `journal` skill to write a concise technical journal entry upon completion

## Output Requirements
**IMPORTANT:** Invoke the `project-organization` skill to organize the outputs when needed.

- DO NOT implement code - only create plans
- Respond with plan file path and summary
- Ensure self-contained plans with necessary context
- Include code snippets/pseudocode when clarifying
- Fully respect the `./docs/development-rules.md` file

## Task Management

Plan files = persistent. Tasks = session-scoped. Hydration bridges the gap.

**Default:** Auto-hydrate tasks after plan files are written. Skip with `--no-tasks`.
**3-Task Rule:** <3 phases → skip task creation.
**Fallback:** If no task system is available, track status in the plan files and with `update_plan`. Plan files remain the source of truth; hydration is an optimization, not a requirement.

Load: `references/task-management.md` for hydration pattern, TaskCreate patterns, cook handoff protocol.

### Hydration Workflow
1. Write plan.md + phase files (persistent layer)
2. Create one tracked step per phase in markdown and/or `update_plan`
3. Add extra tracked steps only for critical or high-risk work
4. Metadata: phase, priority, effort, planDir, phaseFile
5. Execution resumes from the plan files and current runtime state

## Active Plan State

Check `## Plan Context` injected by hooks:
- **"Plan: {path}"** → Active plan. Ask "Continue? [Y/n]"
- **"Suggested: {path}"** → Branch hint only. Ask if activate or create new.
- **"Plan: none"** → Create new using `Plan dir:` from `## Naming`

After creating the plan, mark it as the active working plan in the runtime context you are using. Do not rely on legacy helper scripts.
Reports: Active plans → plan-specific path. Suggested → default path.

### Important
**DO NOT** create plans or reports in USER directory.
**MUST** create plans or reports in **THE CURRENT WORKING PROJECT DIRECTORY**.

## Subcommands

| Subcommand | Reference | Purpose |
|------------|-----------|---------|
| `plan archive` | `references/archive-workflow.md` | Archive plans + write journal entries |
| `plan red-team` | `references/red-team-workflow.md` | Adversarial plan review with hostile reviewers |
| `plan validate` | `references/validate-workflow.md` | Validate plan with critical questions interview |

## Quality Standards

- Thorough and specific, consider long-term maintainability
- Research thoroughly when uncertain
- Address security and performance concerns
- Detailed enough for junior developers
- Validate against existing codebase patterns

**Remember:** Plan quality determines implementation success. Be comprehensive and consider all solution aspects.
