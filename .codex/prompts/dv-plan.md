---
description: Start the first project step for a new Data Visualization Kit workflow with structured intake and one canonical plan
argument-hint: [goal / task / brief]
---

Run the planning-first intake workflow.

<request>$ARGUMENTS</request>

## Workflow Contract

1. Before deep execution, load the mandatory hook layer from `./.codex/workflows/hook-runtime-contract.md`.
2. Gather and clarify:
   - dataset context
   - dataset or source surface
   - project goals if already provided
   - constraints when they materially affect planning
3. Follow `./.codex/workflows/primary-workflow.md` as process truth.
4. Map the project to the most suitable framework, such as CRISP-DM or a data-pipeline-first approach.
5. If goals are weak or missing, suggest `basic`, `pro`, and `advanced` goal directions and get them clarified.
6. Produce one canonical `project-plan.md` that downstream `$dv-*` workflows can use without guessing.
