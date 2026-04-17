#!/usr/bin/env node

const { parseArgs } = require("./lib/cli.cjs");
const { routeCommand } = require("./lib/router.cjs");
const { runWorkflowPreflight } = require("./hooks/run-workflow-preflight.cjs");

async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  const context = await runWorkflowPreflight({ cwd: process.cwd() });
  await routeCommand({
    command: parsed.command,
    flags: parsed.flags,
    repoRoot: context.repoRoot,
    rawText: parsed.rawText,
  });
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
