#!/usr/bin/env node
/**
 * PreToolUse hook — block bash commands that touch privacy-sensitive files.
 *
 * Fires: PreToolUse with tool_name=Bash
 * Input (stdin): { session_id, cwd, turn_id, tool_name, tool_use_id, tool_input: { command } }
 * Output (stdout): JSON block decision if the command accesses sensitive paths
 *
 * Reuses the privacy-block logic from scripts/hooks/privacy-block.cjs.
 * Sensitive paths: .env files, credentials, tokens, keys, PEM files.
 *
 * Exit 0 always (fail-open — a hook crash must never stop a Codex turn).
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

/** Resolve the repo git root, fall back to cwd. */
function getRepoRoot(cwd) {
  try {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], {
      encoding: 'utf8', timeout: 3000, cwd,
      stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true,
    }).trim();
  } catch { return cwd; }
}

function main() {
  try {
    const stdin = fs.readFileSync(0, 'utf8').trim();
    const data = stdin ? JSON.parse(stdin) : {};
    const cwd = data.cwd || process.cwd();
    const command = data.tool_input?.command || '';

    if (!command) {
      process.exit(0);
    }

    // Load privacy-block from the scripts/hooks layer.
    const repoRoot = getRepoRoot(cwd);
    const privacyBlockPath = path.join(repoRoot, 'scripts', 'hooks', 'privacy-block.cjs');

    let privacyBlock;
    try {
      privacyBlock = require(privacyBlockPath).privacyBlock;
    } catch {
      // If the module is unavailable, fail-open.
      process.exit(0);
    }

    const result = privacyBlock({
      tool_name: 'Bash',
      tool_input: { command },
      options: { allowBash: false }, // in Codex hooks we enforce strictly
    });

    if (result.blocked) {
      // Block the bash command using the current Codex block shape.
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason: `Privacy block: command accesses sensitive file "${result.filePath}". Approve access explicitly before proceeding.`,
        },
      }));
      process.exit(0);
    }

    // Not blocked — exit silently, Codex continues.
    process.exit(0);
  } catch (err) {
    process.stderr.write(`[pre-tool-use hook] ${err.message}\n`);
    process.exit(0);
  }
}

main();
