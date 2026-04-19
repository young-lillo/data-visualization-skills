# Hook Workflow

## Purpose

Mandatory runtime hook layer for the kit.

## Responsibilities

- run preflight hooks before routing
- run user-prompt hooks after CLI parse and before workflow routing
- run routing gate after request normalization and intake resolution
- run project and output gates before writes
- run privacy and provider gates only when a workflow reaches sensitive or provider-backed work
- inject subagent context before spawned agents start
- stop execution immediately when a hook blocks
