const path = require("node:path");

const { slugify, writeTextFile } = require("./fs-utils.cjs");
const { generateProject } = require("./project-generator.cjs");
const { validateGeneratedProject } = require("./project-validator.cjs");
const { collectPrimaryInput, collectWorkflowUpdateInput } = require("./workflow-inputs.cjs");
const { providerKeyGate } = require("../hooks/provider-key-gate.cjs");
const { projectPreflight } = require("../hooks/project-preflight.cjs");
const { subagentInit } = require("../hooks/subagent-init.cjs");
const { workflowRoutingGate } = require("../hooks/workflow-routing-gate.cjs");
const { docsOutputGate } = require("../hooks/docs-output-gate.cjs");
const { pathExists } = require("./fs-utils.cjs");

async function runPrimaryWorkflow({ flags, repoRoot, briefText }) {
  const intake = await collectPrimaryInput(
    {
      ...flags,
      "project-goals": flags["project-goals"] ?? briefText,
    },
    { interactive: resolveInteractiveMode(flags) },
  );

  workflowRoutingGate({ workflowName: "primary", brief: intake.projectGoals });

  const slug = intake.slug?.trim() ? slugify(intake.slug) : slugify(intake.projectGoals);
  if (!slug) {
    throw new Error("Could not derive a valid project slug. Use clearer goals or pass --slug.");
  }

  const projectRoot = path.join(repoRoot, "projects", slug);

  const providerCheck = providerKeyGate([]);
  if (!providerCheck.ok) {
    throw new Error(`Provider key gate failed: ${providerCheck.missing.join(", ")}`);
  }

  await projectPreflight({
    repoRoot,
    projectSlug: slug,
    targetPath: projectRoot,
    force: flags.force === "true",
  });

  const result = await generateProject({
    repoRoot,
    intake,
    slug,
    preferFreeDeploy: intake.preferFreeDeploy,
    force: flags.force === "true",
  });

  const validation = await validateGeneratedProject(result.projectRoot);
  const handoff = subagentInit({ repoRoot, projectSlug: result.slug });

  console.log(`Created project: ${result.projectRoot}`);
  console.log(`Workflow: primary`);
  console.log(`Framework: ${result.decisions.framework.name}`);
  console.log(`Layer: ${result.decisions.layer.name}`);
  console.log(`Tool: ${result.decisions.tool.name}`);
  console.log(`Validation: checked ${validation.checked} required paths`);
  console.log(`Codex handoff: ${JSON.stringify(handoff, null, 2)}`);
}

async function runProjectUpdateWorkflow({ flags, repoRoot, workflowName, title, fileName, notesBuilder }) {
  const input = await collectWorkflowUpdateInput(flags, {
    interactive: resolveInteractiveMode(flags),
  });

  workflowRoutingGate({ workflowName, brief: input.brief });

  const slug = slugify(input.slug);
  if (!slug) {
    throw new Error("Workflow update requires a valid project slug.");
  }

  const projectRoot = path.join(repoRoot, "projects", slug);
  if (!(await pathExists(projectRoot))) {
    throw new Error(`Project does not exist: ${projectRoot}. Start with $dv-primary first.`);
  }

  const targetFile = path.join(projectRoot, "docs", fileName);
  docsOutputGate({
    repoRoot,
    projectSlug: slug,
    targetPath: targetFile,
  });

  await writeTextFile(
    targetFile,
    notesBuilder({
      brief: input.brief,
      workflowName,
      slug,
    }),
  );

  const validation = await validateGeneratedProject(projectRoot);
  const handoff = subagentInit({ repoRoot, projectSlug: slug });

  console.log(`Updated project: ${projectRoot}`);
  console.log(`Workflow: ${workflowName}`);
  console.log(`Doc updated: ${path.join("docs", fileName)}`);
  console.log(`Validation: checked ${validation.checked} required paths`);
  console.log(`Codex handoff: ${JSON.stringify(handoff, null, 2)}`);
}

function resolveInteractiveMode(flags) {
  if (flags["non-interactive"] === "true") {
    return false;
  }
  return undefined;
}

module.exports = {
  resolveInteractiveMode,
  runPrimaryWorkflow,
  runProjectUpdateWorkflow,
};
