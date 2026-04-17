const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");

const { hasTextValue, resolveBoolean } = require("./cli.cjs");

async function collectPrimaryInput(flags, options = {}) {
  const interactive = options.interactive ?? stdin.isTTY;

  if (
    hasTextValue(flags["project-context"]) &&
    hasTextValue(flags["project-dataset"]) &&
    hasTextValue(flags["project-goals"])
  ) {
    return {
      projectContext: flags["project-context"],
      projectDataset: flags["project-dataset"],
      projectGoals: flags["project-goals"],
      preferFreeDeploy: resolveBoolean(flags["prefer-free-deploy"], true),
      slug: flags.slug,
    };
  }

  if (!interactive) {
    throw new Error("Missing required intake values for non-interactive execution.");
  }

  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    const projectContext = hasTextValue(flags["project-context"])
      ? flags["project-context"]
      : await rl.question("Project context: ");
    const projectDataset = hasTextValue(flags["project-dataset"])
      ? flags["project-dataset"]
      : await rl.question("Project dataset: ");
    const projectGoals = hasTextValue(flags["project-goals"])
      ? flags["project-goals"]
      : await rl.question("Project goals: ");
    const preferFreeDeploy =
      flags["prefer-free-deploy"] ??
      await rl.question("Prefer free static deployment by default? [Y/n]: ");
    const slug = flags.slug ?? await rl.question("Project slug (optional): ");

    return {
      projectContext,
      projectDataset,
      projectGoals,
      preferFreeDeploy: resolveBoolean(preferFreeDeploy, true),
      slug,
    };
  } finally {
    rl.close();
  }
}

async function collectWorkflowUpdateInput(flags, options = {}) {
  const interactive = options.interactive ?? stdin.isTTY;

  if (hasTextValue(flags.slug) && hasTextValue(flags.brief)) {
    return {
      slug: flags.slug,
      brief: flags.brief,
    };
  }

  if (!interactive) {
    throw new Error("Missing required workflow update values: --slug and --brief.");
  }

  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    const slug = hasTextValue(flags.slug) ? flags.slug : await rl.question("Project slug: ");
    const brief = hasTextValue(flags.brief) ? flags.brief : await rl.question("Workflow brief: ");
    return { slug, brief };
  } finally {
    rl.close();
  }
}

module.exports = {
  collectPrimaryInput,
  collectWorkflowUpdateInput,
};

