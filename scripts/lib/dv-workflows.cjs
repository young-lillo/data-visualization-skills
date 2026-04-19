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

async function runPrimaryWorkflow({ flags, repoRoot, briefText, runtimeContext, commandName }) {
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
  const handoff = subagentInit({
    repoRoot,
    projectSlug: result.slug,
    workflowName: "primary",
    commandName,
    brief: intake.projectGoals,
    promptContext: runtimeContext?.promptContext,
    usage: runtimeContext?.usage,
  });

  console.log(`Created project: ${result.projectRoot}`);
  console.log(`Workflow: primary`);
  console.log(`Framework: ${result.decisions.framework.name}`);
  console.log(`Layer: ${result.decisions.layer.name}`);
  console.log(`Tool: ${result.decisions.tool.name}`);
  console.log(`Validation: checked ${validation.checked} required paths`);
  console.log(`Codex handoff: ${JSON.stringify(handoff, null, 2)}`);
}

async function runProjectUpdateWorkflow({
  flags,
  repoRoot,
  workflowName,
  title,
  fileName,
  notesBuilder,
  runtimeContext,
  commandName,
}) {
  const input = await collectWorkflowUpdateInput(flags, {
    interactive: resolveInteractiveMode(flags),
  });

  const { slug, projectRoot, validation } = await updateProjectWorkflowDoc({
    repoRoot,
    workflowName,
    fileName,
    notesBuilder,
    brief: input.brief,
    rawSlug: input.slug,
  });

  const handoff = subagentInit({
    repoRoot,
    projectSlug: slug,
    workflowName,
    commandName,
    brief: input.brief,
    promptContext: runtimeContext?.promptContext,
    usage: runtimeContext?.usage,
  });

  console.log(`Updated project: ${projectRoot}`);
  console.log(`Workflow: ${workflowName}`);
  console.log(`Doc updated: ${path.join("docs", fileName)}`);
  console.log(`Validation: checked ${validation.checked} required paths`);
  console.log(`Codex handoff: ${JSON.stringify(handoff, null, 2)}`);
}

async function runCookWorkflow({ flags, repoRoot, briefText, runtimeContext, commandName }) {
  const input = await collectWorkflowUpdateInput(
    {
      ...flags,
      brief: flags.brief ?? briefText,
    },
    { interactive: resolveInteractiveMode(flags) },
  );

  workflowRoutingGate({ workflowName: "cook", brief: input.brief });

  const preTestStages = [
    {
      workflowName: "data-preparation",
      fileName: "data-preparation.md",
      notesBuilder: ({ brief }) =>
        buildCookStageDoc({
          title: "Data Preparation",
          brief,
          notes: "Triggered by `$dv-cook`. Record ingestion, cleaning, validation, and transformation work here.",
        }),
    },
    {
      workflowName: "data-visualize",
      fileName: "visualization.md",
      notesBuilder: ({ brief }) =>
        buildCookStageDoc({
          title: "Visualization",
          brief,
          notes: "Triggered by `$dv-cook`. Record chart choices, source changes, exports, and presentation updates here.",
        }),
    },
  ];

  const postTestStages = [
    {
      workflowName: "document-management",
      fileName: "document-management.md",
      notesBuilder: ({ brief }) =>
        buildCookStageDoc({
          title: "Document Management",
          brief,
          notes: "Triggered by `$dv-cook`. Record doc sync, asset placement, and workspace cleanup here.",
        }),
    },
    {
      workflowName: "publish",
      fileName: "publish.md",
      notesBuilder: ({ brief }) =>
        buildCookStageDoc({
          title: "Publish",
          brief,
          notes: "Triggered by `$dv-cook`. Capture git readiness, deployment choice, and final publish checks here.",
        }),
    },
  ];

  const updatedDocs = [];
  let slug = "";
  let projectRoot = "";

  for (const stage of preTestStages) {
    const result = await updateProjectWorkflowDoc({
      repoRoot,
      workflowName: stage.workflowName,
      fileName: stage.fileName,
      notesBuilder: stage.notesBuilder,
      brief: input.brief,
      rawSlug: input.slug,
    });
    slug = result.slug;
    projectRoot = result.projectRoot;
    updatedDocs.push(path.join("docs", stage.fileName));
  }

  const testValidation = await validateGeneratedProject(projectRoot);

  for (const stage of postTestStages) {
    const result = await updateProjectWorkflowDoc({
      repoRoot,
      workflowName: stage.workflowName,
      fileName: stage.fileName,
      notesBuilder: stage.notesBuilder,
      brief: input.brief,
      rawSlug: input.slug,
    });
    slug = result.slug;
    projectRoot = result.projectRoot;
    updatedDocs.push(path.join("docs", stage.fileName));
  }

  const finalValidation = await validateGeneratedProject(projectRoot);
  const handoff = subagentInit({
    repoRoot,
    projectSlug: slug,
    workflowName: "cook",
    commandName,
    brief: input.brief,
    promptContext: runtimeContext?.promptContext,
    usage: runtimeContext?.usage,
  });

  console.log(`Updated project: ${projectRoot}`);
  console.log("Workflow: cook");
  console.log("Sequence: data-preparation -> data-visualize -> test -> document-management -> publish");
  console.log(`Docs updated: ${updatedDocs.join(", ")}`);
  console.log(`Test: project validation passed (${testValidation.checked} required paths)`);
  console.log(`Final validation: checked ${finalValidation.checked} required paths`);
  console.log(`Codex handoff: ${JSON.stringify(handoff, null, 2)}`);
}

async function updateProjectWorkflowDoc({ repoRoot, workflowName, fileName, notesBuilder, brief, rawSlug }) {
  workflowRoutingGate({ workflowName, brief });

  const slug = slugify(rawSlug);
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
      brief,
      workflowName,
      slug,
    }),
  );

  const validation = await validateGeneratedProject(projectRoot);
  return { slug, projectRoot, validation };
}

function buildCookStageDoc({ title, brief, notes }) {
  return `# ${title}

## Brief

${brief}

## Mode

Triggered by \`$dv-cook\`

## Notes

${notes}
`;
}

function resolveInteractiveMode(flags) {
  if (flags["non-interactive"] === "true") {
    return false;
  }
  return undefined;
}

module.exports = {
  resolveInteractiveMode,
  runCookWorkflow,
  runPrimaryWorkflow,
  runProjectUpdateWorkflow,
};
