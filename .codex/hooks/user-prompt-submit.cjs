#!/usr/bin/env node
/**
 * UserPromptSubmit hook — inject developer context before every Codex turn.
 *
 * Fires: UserPromptSubmit (every user prompt, matcher field is ignored by Codex)
 * Input (stdin): { session_id, cwd, prompt, turn_id, model, transcript_path }
 * Output (stdout): JSON additionalContext injected into Codex developer context
 *
 * Responsibilities:
 *   1. Detect $dv-plan in the prompt → inject Mandatory Decision Gate reminder
 *   2. Detect privacy-sensitive paths in the prompt → inject a warning
 *   3. Inject workflow contract reminders for all $dv-* commands
 *
 * Exit 0 always (fail-open).
 */

'use strict';

const fs = require('node:fs');

// ---- Decision gate reminder text (mirrors dv-plan.md Step 3) ----------------

const PLAN_INTAKE_REMINDER = `
MANDATORY DECISION GATE — $dv-plan detected.

Before writing any project plan file, you MUST explicitly confirm all four decisions with the user:

1. Framework
   1. CRISP-DM — insight-first (business understanding, analysis, recommendations)
   2. Data Pipeline — engineering-first (ingestion, transformation, orchestration)
   → Ask: "Which framework fits your project? (1 or 2)"

2. Goal Tier
   1. Basic — descriptive questions, lighter dashboard output
   2. Pro — stakeholder questions, driver/segment analysis (default)
   3. Advanced — forecasting, anomaly detection, scenario analysis
   → Ask: "Which goal tier best matches your ambition? (1, 2, or 3)"

3. Visualization Tool
   1. Evidence.dev — CSV/Excel/Kaggle datasets, static portfolio, Netlify/Vercel deploy (no server)
   2. Metabase — SQL DB, interactive BI, self-hosted VPS (default)
   3. Grafana — operational monitoring, time-series, observability, self-hosted VPS
   4. Apache Superset — legacy Superset estates or migration analysis only (4GB+ RAM required)
   → Ask: "Which visualization tool will you use? (1, 2, 3, or 4)"

4. Deploy Target
   1. Netlify — static hosting only → Evidence.dev is the natural fit
   2. Vercel — static hosting only → Evidence.dev is the natural fit
   3. VPS — server-side → Metabase or Grafana
   → Ask: "Where will this project be deployed? (1, 2, or 3)"

Do NOT proceed to create any project files until the user has answered all four questions.
Record the confirmed answers in the project-plan.md decisions section.
`.trim();

// ---- Workflow contract reminder injected for all $dv-* commands -------------

const WORKFLOW_CONTRACT_REMINDER = `
Active kit: Data Visualization Kit
All project work stays inside projects/<project-slug>/docs/.
Run hook layer before any specialist workflow writes files.
Broad asks route to $dv-plan; explicit specialist asks still pass through hooks.
One request → one owner workflow → one clear next step.
`.trim();

// ---- Privacy warning text ---------------------------------------------------

function buildPrivacyWarning(matchedPaths) {
  return `Privacy alert: the prompt references potentially sensitive path(s): ${matchedPaths.join(', ')}. Do not read these files unless the user explicitly approves.`;
}

// ---- Detect $dv-* command from prompt text ----------------------------------

function extractDvCommand(promptText) {
  const match = String(promptText || '').match(/\$dv(-[\w-]+)?/);
  return match ? match[0] : null;
}

// ---- Check prompt for sensitive-looking paths -------------------------------

function findSensitivePaths(promptText) {
  const PATTERNS = [
    /\.env\b/i, /credentials/i, /secrets?\.json/i, /token(?:\.txt)?/i,
    /github_token/i, /id_rsa/i, /id_ed25519/i, /\.pem\b/i, /\.key\b/i,
  ];
  const found = [];
  for (const pattern of PATTERNS) {
    if (pattern.test(promptText)) {
      const m = promptText.match(pattern);
      if (m) found.push(m[0]);
    }
  }
  return [...new Set(found)];
}

// ---- Main -------------------------------------------------------------------

function main() {
  try {
    const stdin = fs.readFileSync(0, 'utf8').trim();
    const data = stdin ? JSON.parse(stdin) : {};
    const prompt = data.prompt || '';

    const contextLines = [];

    // 1. Always inject the workflow contract reminder for $dv-* commands.
    const dvCommand = extractDvCommand(prompt);
    if (dvCommand) {
      contextLines.push(`Command detected: ${dvCommand}`);
      contextLines.push('');
      contextLines.push(WORKFLOW_CONTRACT_REMINDER);
    }

    // 2. If $dv-plan, inject the mandatory decision gate reminder.
    if (dvCommand === '$dv-plan' || dvCommand === '$dv') {
      const lowerPrompt = prompt.toLowerCase();
      const isPlanIntent = dvCommand === '$dv-plan' ||
        /\b(plan|setup|start|new project|create project)\b/.test(lowerPrompt);
      if (isPlanIntent) {
        contextLines.push('');
        contextLines.push(PLAN_INTAKE_REMINDER);
      }
    }

    // 3. Privacy: warn if the prompt references sensitive paths.
    const sensitivePaths = findSensitivePaths(prompt);
    if (sensitivePaths.length > 0) {
      contextLines.push('');
      contextLines.push(buildPrivacyWarning(sensitivePaths));
    }

    if (contextLines.length === 0) {
      // Nothing to inject — exit silently.
      process.exit(0);
    }

    console.log(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: contextLines.join('\n'),
      },
    }));

    process.exit(0);
  } catch (err) {
    process.stderr.write(`[user-prompt-submit hook] ${err.message}\n`);
    process.exit(0);
  }
}

main();
