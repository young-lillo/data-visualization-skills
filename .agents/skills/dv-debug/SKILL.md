---
name: dv-debug
description: Debug systematically with root cause analysis before fixes. Use when the user types `$dv-debug` or when data preparation, visualization, publish, deployment, test, runtime, or workflow behavior fails and root cause must be proven before fixing.
languages: all
argument-hint: "[error or issue description]"
metadata:
  author: data-visualization-kit
  version: "5.0.0"
---

# DV Debug

Treat `$dv-debug` as the canonical debug entrypoint and the canonical debug methodology for Data Visualization Kit.

## Codex Adaptation

- Use this skill directly for `$dv-debug` instead of delegating to a separate debug workflow or prompt layer.
- Keep debug outputs aligned with Data Visualization Kit runtime rules and project `docs/` boundaries.
- Record root cause, evidence, fix path, and unresolved questions in the active project debug report under `projects/<slug>/docs/debug-report.md` when the task is project-scoped.
- Route back to the owning workflow after the failure is understood and the next safe action is clear.

Comprehensive framework combining systematic debugging, root cause tracing, defense-in-depth validation, verification protocols, and system-level investigation across workflow runtime, generated outputs, logs, CI/CD, databases, and performance.

## Core Principle

**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST**

Random fixes waste time and create new bugs. Find root cause, fix at source, validate at every layer, verify before claiming success.

## When to Use

**Workflow-level:** Data preparation, visualization, publish, runtime, hook, or generated-output failures  
**Code-level:** Test failures, bugs, unexpected behavior, build failures, integration problems  
**System-level:** Server errors, CI/CD pipeline failures, performance degradation, database issues, log analysis  
**Always:** Before claiming work complete after a failure

## Techniques

### 1. Systematic Debugging (`references/systematic-debugging.md`)

Four-phase framework: Root Cause Investigation -> Pattern Analysis -> Hypothesis Testing -> Implementation. Complete each phase before proceeding. No fixes without Phase 1.

**Load when:** Any bug or issue requiring investigation and fix

### 2. Root Cause Tracing (`references/root-cause-tracing.md`)

Trace bugs backward through call stack to find original trigger. Fix at source, not symptom. Includes `scripts/find-polluter.sh` for bisecting test pollution.

**Load when:** Error deep in stack, unclear where invalid data originated

### 3. Defense-in-Depth (`references/defense-in-depth.md`)

Validate at every layer: entry validation -> business logic -> environment guards -> debug instrumentation.

**Load when:** After finding root cause, need comprehensive validation

### 4. Verification (`references/verification.md`)

**Iron law:** NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE. Run command. Read output. Then claim result.

**Load when:** About to claim work complete, fixed, or passing

### 5. Investigation Methodology (`references/investigation-methodology.md`)

Five-step structured investigation for system-level issues: Initial Assessment -> Data Collection -> Analysis -> Root Cause ID -> Solution Development.

**Load when:** Server incidents, system behavior analysis, workflow failures, multi-component failures

### 6. Log & CI/CD Analysis (`references/log-and-ci-analysis.md`)

Collect and analyze logs from servers, CI/CD pipelines, and application layers. Tools: `gh` CLI, structured log queries, correlation across sources.

**Load when:** CI/CD pipeline failures, server errors, deployment issues

### 7. Performance Diagnostics (`references/performance-diagnostics.md`)

Identify bottlenecks, analyze query performance, and develop optimization strategies. Covers database queries, API response times, and resource utilization.

**Load when:** Performance degradation, slow queries, high latency, resource exhaustion

### 8. Reporting Standards (`references/reporting-standards.md`)

Structured diagnostic reports: Executive Summary -> Technical Analysis -> Recommendations -> Evidence.

**Load when:** Need to produce investigation report or diagnostic summary

### 9. Task Management (`references/task-management-debugging.md`)

Track investigation pipelines via plan files plus `update_plan`. Default to markdown plans and concise runtime progress tracking.

**Load when:** Multi-component investigation, parallel log collection, coordinating debugger subagents

### 10. Frontend Verification (`references/frontend-verification.md`)

Visual verification of frontend implementations via Chrome MCP or `chrome-devtools` skill fallback. Detect if frontend-related -> check Chrome MCP availability -> screenshot + console error check -> report. Skip if not frontend.

**Load when:** The failure touches frontend files, UI bugs, or visual regressions

## Quick Reference

```text
Workflow failure -> investigation-methodology.md
  Hook/runtime issue -> inspect scripts/hooks/ and generated docs
  Generated output issue -> compare expected docs contract vs actual files

Code bug        -> systematic-debugging.md
  Deep in stack -> root-cause-tracing.md
  Found cause   -> defense-in-depth.md
  Claiming done -> verification.md

System issue    -> investigation-methodology.md
  CI/CD failure -> log-and-ci-analysis.md
  Slow system   -> performance-diagnostics.md
  Need report   -> reporting-standards.md

Frontend fix    -> frontend-verification.md
```

## Tools Integration

- **Database:** `psql` for PostgreSQL queries and diagnostics
- **CI/CD:** `gh` CLI for GitHub Actions logs and pipeline debugging
- **Codebase:** `docs-seeker` skill for package/plugin docs; `repomix` skill for codebase summary
- **Scouting:** `scout` for finding relevant files
- **Frontend:** Chrome browser or `chrome-devtools` skill for visual verification
- **Skills:** Activate `problem-solving` when stuck on complex issues

## Project Output Rules

- Keep debug records under the active project `docs/` tree
- Prefer `projects/<slug>/docs/debug-report.md` for project-scoped failures
- When the issue belongs to one owner workflow, state clearly which workflow should resume next
- If the issue is runtime-wide, separate root cause from downstream symptom files

## Red Flags

Stop and follow process if thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "It's probably X, let me fix that"
- "Should work now" or "Seems fixed"
- "Tests pass, we're done"

**All mean:** Return to systematic process.
