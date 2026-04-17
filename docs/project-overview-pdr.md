# Project Overview PDR

## Overview

Build an open-source kit for Codex agents that generates and maintains professional data visualization portfolio projects through a `$dv-*` workflow family.

## Product Goal

- help users show domain knowledge
- help users show technical knowledge
- produce repeatable, git-ready project workspaces

## Core User Flow

1. clone repo
2. run a `$dv-*` command
3. answer the 3 required intake questions
4. pass runtime preflight and hook checks
5. receive generated project folder under `projects/`
6. refine and commit the generated workspace

## Core Requirements

- workflow-first orchestration
- thin entrypoints
- mandatory hooks
- command surface follows `$dv-<workflow> <brief>`
- non-interactive intake must fail fast when required values are missing
- agent-scoped execution
- one owner workflow per request
- project artifacts stay under `projects/<slug>/docs/`
- smoke validation must confirm the generated output contract

## Constraints

- default free-deploy path should prefer `RAWGraphs`
- project outputs must include SQL and/or Python work
- no hardcoded business values in the kit itself
- generated project paths must stay inside `projects/`
