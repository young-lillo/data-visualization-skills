# Summarize Workflow

Create a quick, high-signal docs summary pass without doing a full docs rewrite.

## Arguments
$1: Focused topics (default: all)
$2: Should scan codebase (`Boolean`, default: `false`)

## Focused Topics
<focused_topics>$1</focused_topics>

## Should Scan Codebase
<should_scan_codebase>$2</should_scan_codebase>

## Important
- Use the active project `docs/` tree as the source of truth
- Update `document-management.md` and any directly relevant summary docs only
- Do not scan the entire codebase unless the user explicitly requests it
- Do not start implementing product changes
