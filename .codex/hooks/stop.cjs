#!/usr/bin/env node
/**
 * Stop hook — persist session state for compact/resume recovery.
 *
 * Fires: Stop (end of every Codex turn)
 * Input (stdin): { session_id, cwd, turn_id, stop_hook_active, last_assistant_message, transcript_path }
 * Output (stdout): JSON { continue: true } — always let Codex stop normally
 *
 * State file: ~/.codex/session-states/<hash>/latest.md
 * Read by session-start.cjs on the next startup or resume.
 *
 * State content:
 *   - Timestamp + branch (from git)
 *   - Last assistant message summary
 *   - Modified files (from git diff HEAD)
 *
 * Exit 0 always (fail-open).
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const STATE_FILENAME = 'latest.md';
const MAX_ARCHIVES = 5;

/** Resolve the global state directory for this cwd. Creates it if missing. */
function getStateDir(cwd) {
  const hash = crypto.createHash('md5').update(cwd).digest('hex').slice(0, 12);
  const dir = path.join(os.homedir(), '.codex', 'session-states', hash);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** Run a git command, return trimmed stdout or '' on failure. */
function git(args, cwd) {
  try {
    return execFileSync('git', args, {
      encoding: 'utf8', timeout: 3000, cwd,
      stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true,
    }).trim();
  } catch { return ''; }
}

/** Archive current state, keep last MAX_ARCHIVES. */
function archiveState(stateDir) {
  try {
    const statePath = path.join(stateDir, STATE_FILENAME);
    if (!fs.existsSync(statePath)) return;
    const archiveDir = path.join(stateDir, 'archive');
    if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });
    const now = new Date();
    const ts = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
      '-',
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
    ].join('');
    fs.copyFileSync(statePath, path.join(archiveDir, `${ts}.md`));
    // Rotate: delete oldest archives beyond MAX_ARCHIVES.
    const entries = fs.readdirSync(archiveDir).filter(f => f.endsWith('.md')).sort();
    while (entries.length > MAX_ARCHIVES) {
      try { fs.unlinkSync(path.join(archiveDir, entries.shift())); } catch { /* ignore */ }
    }
  } catch { /* fail-open */ }
}

/** Atomic write: write to temp file then rename. */
function writeAtomic(filePath, content) {
  const tmp = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, filePath);
}

/** Build the session state markdown content. */
function buildStateContent({ cwd, branch, lastMessage, modifiedFiles }) {
  const lines = [
    '# Session State',
    `<!-- Generated: ${new Date().toISOString()} -->`,
    `<!-- Branch: ${branch || 'unknown'} -->`,
    '',
    '## Last Turn Summary',
    lastMessage
      ? lastMessage.slice(0, 500).replace(/\n{3,}/g, '\n\n')
      : '(No assistant message captured)',
    '',
    '## Key Files Modified',
    ...(modifiedFiles.length
      ? modifiedFiles.map(f => `- ${f}`)
      : ['- (No file changes detected)']),
    '',
  ];
  return lines.join('\n');
}

function main() {
  try {
    const stdin = fs.readFileSync(0, 'utf8').trim();
    const data = stdin ? JSON.parse(stdin) : {};
    const cwd = data.cwd || process.cwd();

    const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'], cwd);
    const diffOutput = git(['diff', '--name-only', 'HEAD'], cwd);
    const modifiedFiles = diffOutput ? diffOutput.split('\n').slice(0, 20) : [];
    const lastMessage = typeof data.last_assistant_message === 'string'
      ? data.last_assistant_message.trim()
      : '';

    const content = buildStateContent({ cwd, branch, lastMessage, modifiedFiles });

    const stateDir = getStateDir(cwd);
    archiveState(stateDir);
    writeAtomic(path.join(stateDir, STATE_FILENAME), content);

    // Always let Codex stop normally — this hook only persists state.
    console.log(JSON.stringify({ continue: true }));
    process.exit(0);
  } catch (err) {
    process.stderr.write(`[stop hook] ${err.message}\n`);
    // Still output valid JSON so Codex doesn't treat this as a block.
    console.log(JSON.stringify({ continue: true }));
    process.exit(0);
  }
}

main();
