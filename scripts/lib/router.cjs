const { printHelp } = require("./cli.cjs");
const { runCookWorkflow, runPrimaryWorkflow, runProjectUpdateWorkflow } = require("./dv-workflows.cjs");
const { renderWorkflowUpdateDoc } = require("./project-doc-templates.cjs");
const fs = require("node:fs/promises");
const path = require("node:path");

async function routeCommand({ command, flags, repoRoot, rawText, runtimeContext }) {
  const normalizedCommand = normalizeCommand(command);
  const briefText = deriveBriefText(normalizedCommand, rawText);

  if (normalizedCommand === "$dv-help") {
    printHelp();
    return;
  }

  switch (normalizedCommand) {
    case "$dv-primary":
      await runPrimaryWorkflow({ flags, repoRoot, briefText, runtimeContext, commandName: normalizedCommand });
      return;
    case "$dv-cook":
      await runCookWorkflow({
        flags: withBrief(flags, briefText),
        repoRoot,
        briefText,
        runtimeContext,
        commandName: normalizedCommand,
      });
      return;
    case "$dv-data-preparation":
      await runProjectUpdateWorkflow({
        flags: withBrief(flags, briefText),
        repoRoot,
        runtimeContext,
        commandName: normalizedCommand,
        workflowName: "data-preparation",
        title: "Data Preparation",
        fileName: "data-preparation.md",
        notesBuilder: ({ brief }) =>
          renderWorkflowUpdateDoc({
            title: "Data Preparation",
            brief,
            notes: "Use this document to record ingestion, cleaning, validation, and transformation work.",
          }),
      });
      return;
    case "$dv-data-visualize":
      await runProjectUpdateWorkflow({
        flags: withBrief(flags, briefText),
        repoRoot,
        runtimeContext,
        commandName: normalizedCommand,
        workflowName: "data-visualize",
        title: "Visualization",
        fileName: "visualization.md",
        notesBuilder: ({ brief }) =>
          renderWorkflowUpdateDoc({
            title: "Visualization",
            brief,
            notes: "Use this document to record visualization choices, source changes, exports, and presentation updates.",
          }),
      });
      return;
    case "$dv-publish":
      await runProjectUpdateWorkflow({
        flags: withBrief(flags, briefText),
        repoRoot,
        runtimeContext,
        commandName: normalizedCommand,
        workflowName: "publish",
        title: "Publish",
        fileName: "publish.md",
        notesBuilder: ({ brief }) =>
          renderWorkflowUpdateDoc({
            title: "Publish",
            brief,
            notes: "Use this document to capture git readiness, deployment choices, and publish checklists.",
          }),
      });
      return;
    case "$dv-debug":
      await runProjectUpdateWorkflow({
        flags: withBrief(flags, briefText),
        repoRoot,
        runtimeContext,
        commandName: normalizedCommand,
        workflowName: "debug",
        title: "Debug Report",
        fileName: "debug-report.md",
        notesBuilder: ({ brief }) =>
          renderWorkflowUpdateDoc({
            title: "Debug Report",
            brief,
            notes: "Use this document to record root cause analysis, fixes, and unresolved issues.",
          }),
      });
      return;
    case "$dv-document-management":
      await runProjectUpdateWorkflow({
        flags: withBrief(flags, briefText),
        repoRoot,
        runtimeContext,
        commandName: normalizedCommand,
        workflowName: "document-management",
        title: "Document Management",
        fileName: "document-management.md",
        notesBuilder: ({ brief }) =>
          renderWorkflowUpdateDoc({
            title: "Document Management",
            brief,
            notes: "Use this document to record doc sync actions, user assets, and compact workspace cleanup.",
          }),
      });
      return;
    default:
      if (!command.startsWith("$dv-") && hasNaturalLanguageFallback(normalizedCommand, rawText)) {
        await runPrimaryWorkflow({
          flags,
          repoRoot,
          briefText: rawText,
          runtimeContext,
          commandName: "$dv-primary",
        });
        return;
      }
      throw new Error(`Unknown command: ${command}`);
  }
}

function normalizeCommand(command) {
  if (command === "$dv-docs") {
    return "$dv-document-management";
  }
  if (command === "help") {
    return "$dv-help";
  }
  if (command === "primary") {
    return "$dv-primary";
  }
  if (command === "cook") {
    return "$dv-cook";
  }
  if (command === "data-preparation") {
    return "$dv-data-preparation";
  }
  if (command === "data-visualize") {
    return "$dv-data-visualize";
  }
  if (command === "publish") {
    return "$dv-publish";
  }
  if (command === "debug") {
    return "$dv-debug";
  }
  if (command === "docs" || command === "document-management") {
    return "$dv-document-management";
  }
  return command;
}

function deriveBriefText(normalizedCommand, rawText) {
  if (!rawText) {
    return "";
  }
  if (rawText.startsWith(normalizedCommand)) {
    return rawText.slice(normalizedCommand.length).trim();
  }
  return rawText;
}

function withBrief(flags, briefText) {
  return {
    ...flags,
    brief: flags.brief ?? briefText,
  };
}

function hasNaturalLanguageFallback(normalizedCommand, rawText) {
  return !normalizedCommand.startsWith("$dv-") && rawText.trim().includes(" ");
}

async function printWorkflowReference(repoRoot, relativePath) {
  const content = await fs.readFile(path.join(repoRoot, relativePath), "utf8");
  console.log(content);
}

module.exports = {
  routeCommand,
};
