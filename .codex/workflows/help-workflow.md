# Help Workflow

## Purpose

Authoritative workflow for command discovery and workflow routing help in Data Visualization Kit.
This workflow owns the user-facing explanation of what the kit does, which `$dv-*` command fits the ask, and what the next step should be.

## Workflow Contract

1. read the user ask and current kit command surface
2. identify whether the user needs orientation, routing, or a concrete next command
3. explain the smallest correct command set
4. recommend one best next workflow with a realistic example
5. keep the response anchored to canonical `$dv-*` commands instead of internal implementation details

## Core Rules

- treat `$dv-help` as the public discovery layer for the kit
- prefer canonical commands such as `$dv-plan`, `$dv-cook`, `$dv-data-preparation`, `$dv-data-visualize`, `$dv-publish`, `$dv-debug`, and `$dv-document-management`
- recommend the smallest correct next step instead of listing every command by default
- explain workflow purpose in user terms, not internal runtime jargon
- reuse the thin help prompt only when useful, but let this workflow own the routing rules
- if the user already made the right workflow choice, reinforce it and move forward instead of re-teaching the whole kit
- if the ask is broad or ambiguous, default the user toward `$dv-plan`

## Required Inputs

Before help routing starts, gather:

- the current user ask
- the current public command surface from the repo
- the current workflow roster and its intended use boundaries
- the current `$dv-help` context, if any

If help text, prompts, or workflow files disagree, prefer the latest canonical workflow contract and public command surface.

## Execution Stages

### 1. Ask Read

- determine whether the user wants command discovery, workflow selection, or clarification of what a command does
- identify whether the ask is broad, specialist, or post-intake continuation
- avoid answering a routing question with generic product marketing language

### 2. Intent Classification

- map the ask to the narrowest correct workflow family
- treat broad project starts as planning-first requests
- distinguish between preparation, visualization, publish, debug, and docs-management asks before recommending a command

### 3. Command Recommendation

- recommend one primary next command first
- include additional commands only when they materially help the user choose correctly
- give one realistic example invocation when it improves clarity

### 4. Workflow Explanation

- explain what the selected workflow does and why it fits the current ask
- keep the explanation concise, practical, and tied to the user's likely next action
- avoid surfacing internal-only system concepts unless they help prevent misuse

### 5. Escalation to Execution

- if the user is no longer asking for help and is effectively giving a real workflow brief, route directly to the matching canonical workflow
- if the request still lacks enough shape, route to `$dv-plan`
- if the user only wants the command roster, keep the answer compact and complete

## Routing Rules

- if the user is starting a project or the ask is broad, route to `$dv-plan`
- if the user wants end-to-end execution after planning, route to `$dv-cook`
- if the user needs ingestion, cleaning, shaping, or validation of data, route to `$dv-data-preparation`
- if the user needs dashboard construction or visualization refresh, route to `$dv-data-visualize`
- if the user needs release, deployment, or git-readiness, route to `$dv-publish`
- if the user needs root-cause analysis or workflow failure diagnosis, route to `$dv-debug`
- if the user needs project docs cleanup, summaries, or asset organization, route to `$dv-document-management`

## Collaboration Contract

This workflow coordinates:

- `$dv-plan` as the default starting point for broad or ambiguous asks
- `$dv-cook` for post-intake end-to-end execution
- `$dv-data-preparation` for data shaping and readiness work
- `$dv-data-visualize` for dashboard delivery and refresh work
- `$dv-publish` for release and deployment readiness
- `$dv-debug` for failure investigation
- `$dv-document-management` for project-scoped docs and assets

## Completion Gate

Help work is complete only when:

- the user has a clear recommended next command
- the recommendation matches the actual command surface
- the explanation is concise enough to act on immediately
- broad asks have been routed to `$dv-plan`
- specialist asks have been routed to the correct canonical workflow

