#!/usr/bin/env node
/**
 * SessionStart hook — restore session state after resume or compact.
 *
 * Fires: SessionStart with source=startup|resume
 * Input (stdin): { session_id, cwd, source, transcript_path, model }
 * Output (stdout): JSON additionalContext injected into Codex developer context
 *
 * State file: ~/.codex/session-states/<hash>/latest.md
 * State is written by the Stop hook and read here on next startup/resume.
 *
 * Exit 0 always (fail-open — never block a session from starting).
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');

const STATE_FILENAME = 'latest.md';
const EXPIRY_DAYS = 7;

/** Resolve the global state directory for this working directory. */
function getStateDir(cwd) {
  const hash = crypto.createHash('md5').update(cwd).digest('hex').slice(0, 12);
  const dir = path.join(os.homedir(), '.codex', 'session-states', hash);
  return dir;
}

/** Load state file. Returns null if missing or older than EXPIRY_DAYS. */
function loadState(cwd) {
  try {
    const stateDir = getStateDir(cwd);
    const statePath = path.join(stateDir, STATE_FILENAME);
    if (!fs.existsSync(statePath)) return null;
    const content = fs.readFileSync(statePath, 'utf8');
    const tsMatch = content.match(/<!-- Generated: (.+?) -->/);
    if (tsMatch) {
      const age = Date.now() - new Date(tsMatch[1]).getTime();
      if (age > EXPIRY_DAYS * 24 * 60 * 60 * 1000) return null;
    }
    return content;
  } catch {
    return null;
  }
}

function main() {
  try {
    const stdin = fs.readFileSync(0, 'utf8').trim();
    const data = stdin ? JSON.parse(stdin) : {};
    const cwd = data.cwd || process.cwd();
    const source = data.source || 'startup';

    const state = loadState(cwd);

    if (!state) {
      // No saved state — exit silently, let Codex start fresh.
      process.exit(0);
    }

    const label = source === 'resume' ? 'Previous Session State' : 'Session State (Post-Compaction Recovery)';
    const resumeNote = source === 'resume'
      ? 'Review the state above from your last session. Continue where you left off or start fresh.'
      : 'Context was compacted. Resume from where you left off. Do NOT redo completed work. Re-read active workflow docs before continuing.';

    const additionalContext = [
      `--- ${label} ---`,
      state.trim(),
      `--- End ${label} ---`,
      '',
      resumeNote,
    ].join('\n');

    console.log(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext,
      },
    }));

    process.exit(0);
  } catch (err) {
    // Fail-open: log to stderr so Codex shows a warning but doesn't block.
    process.stderr.write(`[session-start hook] ${err.message}\n`);
    process.exit(0);
  }
}

main();
