const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const { hasTextValue, parseArgs, printHelp } = require("../scripts/lib/cli.cjs");
const { privacyBlock } = require("../scripts/hooks/privacy-block.cjs");
const { projectPreflight } = require("../scripts/hooks/project-preflight.cjs");
const { generateProject } = require("../scripts/lib/project-generator.cjs");
const { collectPrimaryInput, collectWorkflowUpdateInput } = require("../scripts/lib/workflow-inputs.cjs");
const { docsOutputGate } = require("../scripts/hooks/docs-output-gate.cjs");

test("generateProject creates a git-ready project workspace", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-data-viz-kit-"));
  const repoRoot = path.join(tempRoot, "repo");
  await fs.mkdir(path.join(repoRoot, "projects"), { recursive: true });

  const result = await generateProject({
    repoRoot,
    intake: {
      projectContext: "Retention analysis",
      projectDataset: "Orders and customers",
      projectGoals: "Show churn insight and technical workflow",
    },
    slug: "retention-analysis",
    preferFreeDeploy: true,
  });

  const files = [
    "README.md",
    ".gitignore",
    "docs/project-brief.md",
    "docs/project-plan.md",
    "docs/data-preparation.md",
    "docs/visualization.md",
    "docs/publish.md",
    "docs/debug-report.md",
    "docs/document-management.md",
    "docs/assets/exports/01-analysis.sql",
  ];

  for (const relativePath of files) {
    const target = path.join(result.projectRoot, relativePath);
    await assert.doesNotReject(() => fs.access(target));
  }

  await assert.rejects(() => fs.access(path.join(result.projectRoot, "plans")));
  await assert.rejects(() => fs.access(path.join(result.projectRoot, "assets")));

  const planDoc = await fs.readFile(path.join(result.projectRoot, "docs", "project-plan.md"), "utf8");
  assert.match(planDoc, /Metabase/);
  assert.match(planDoc, /Framework/);
  assert.match(planDoc, /\$dv-cook/);
});

test("generateProject selects Grafana for operational time-series goals", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-data-viz-kit-"));
  const repoRoot = path.join(tempRoot, "repo");
  await fs.mkdir(path.join(repoRoot, "projects"), { recursive: true });

  const result = await generateProject({
    repoRoot,
    intake: {
      projectContext: "Platform monitoring",
      projectDataset: "Metrics, logs, and traces",
      projectGoals: "Build a real-time observability dashboard for SLA metrics",
    },
    slug: "ops-monitoring",
    preferFreeDeploy: true,
  });

  const planDoc = await fs.readFile(path.join(result.projectRoot, "docs", "project-plan.md"), "utf8");
  assert.match(planDoc, /Grafana/);
});

test("generateProject escapes quoted intake values in the python starter", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-data-viz-kit-"));
  const repoRoot = path.join(tempRoot, "repo");
  await fs.mkdir(path.join(repoRoot, "projects"), { recursive: true });

  const result = await generateProject({
    repoRoot,
    intake: {
      projectContext: 'Portfolio for "quoted" context',
      projectDataset: 'Dataset with "quotes"',
      projectGoals: "Show advanced technical workflow",
    },
    slug: "quoted-intake",
    preferFreeDeploy: true,
  });

  const pythonStarter = await fs.readFile(
    path.join(result.projectRoot, "docs", "assets", "exports", "01-analysis.py"),
    "utf8",
  );
  assert.match(pythonStarter, /Portfolio for \\"quoted\\" context/);
  assert.match(pythonStarter, /Dataset with \\"quotes\\"/);
});

test("generateProject rejects empty slugs and protects the projects root", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-data-viz-kit-"));
  const repoRoot = path.join(tempRoot, "repo");
  await fs.mkdir(path.join(repoRoot, "projects"), { recursive: true });

  await assert.rejects(
    () =>
      generateProject({
        repoRoot,
        intake: {
          projectContext: "Invalid slug test",
          projectDataset: "N/A",
          projectGoals: "!!!",
        },
        preferFreeDeploy: true,
      }),
    /empty value/,
  );
});

test("collectPortfolioInput rejects malformed non-interactive flags", async () => {
  await assert.rejects(
    () =>
      collectPrimaryInput(
        {
          slug: "malformed-intake",
          "project-context": "true",
          "project-dataset": "true",
          "project-goals": "true",
        },
        { interactive: false },
      ),
    /Missing required intake values/,
  );
});

test("collectWorkflowUpdateInput requires slug and brief for non-interactive runs", async () => {
  await assert.rejects(
    () =>
      collectWorkflowUpdateInput(
        {
          slug: "existing-project",
          brief: "true",
        },
        { interactive: false },
      ),
    /Missing required workflow update values/,
  );
});

test("docsOutputGate blocks writes outside a project's docs tree", () => {
  assert.throws(
    () =>
      docsOutputGate({
        repoRoot: "D:\\repo",
        projectSlug: "demo-project",
        targetPath: "D:\\repo\\projects\\demo-project\\plans\\plan.md",
      }),
    /docs/,
  );
});

test("projectPreflight stays read-only for a fresh project target", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "codex-data-viz-kit-"));
  const repoRoot = path.join(tempRoot, "repo");
  const targetPath = path.join(repoRoot, "projects", "fresh-project");

  await projectPreflight({
    repoRoot,
    projectSlug: "fresh-project",
    targetPath,
    force: false,
  });

  await assert.rejects(() => fs.access(targetPath));
});

test("privacyBlock matches secret filenames without rejecting normal project slugs", () => {
  assert.equal(privacyBlock("D:\\repo\\.env").blocked, true);
  assert.equal(privacyBlock("D:\\repo\\github_token").blocked, true);
  assert.equal(privacyBlock("D:\\repo\\projects\\customer-token-churn").blocked, false);
});

test("printHelp reflects the current public command surface", () => {
  const output = captureConsoleLog(() => printHelp());

  assert.match(output, /\$dv-cook <brief>/);
  assert.match(output, /\$dv-document-management <brief>/);
  assert.doesNotMatch(output, /\$dv-docs/);
  assert.doesNotMatch(output, /\$dv-hooks/);
  assert.doesNotMatch(output, /\$dv-hook-workflow/);
  assert.doesNotMatch(output, /\$dv-orchestration/);
  assert.doesNotMatch(output, /\$dv-orchestration <brief>/);
});

test("hasTextValue rejects placeholder boolean flags", () => {
  assert.equal(hasTextValue("true"), false);
  assert.equal(hasTextValue(" real text "), true);
});

test("parseArgs preserves $dv command and brief text", () => {
  const parsed = parseArgs([
    "$dv-data-visualize",
    "refresh",
    "charts",
    "--slug",
    "demo-project",
    "--brief",
    "Refresh visuals after source change",
  ]);

  assert.equal(parsed.command, "$dv-data-visualize");
  assert.equal(parsed.flags.slug, "demo-project");
  assert.equal(parsed.flags.brief, "Refresh visuals after source change");
  assert.equal(parsed.rawText, "$dv-data-visualize refresh charts");
});

function captureConsoleLog(run) {
  const originalLog = console.log;
  let output = "";
  console.log = (value) => {
    output += `${value}\n`;
  };

  try {
    run();
  } finally {
    console.log = originalLog;
  }

  return output;
}
