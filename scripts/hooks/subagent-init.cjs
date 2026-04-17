const path = require("node:path");

function subagentInit({ repoRoot, projectSlug }) {
  const workContext = path.join(repoRoot, "projects", projectSlug);
  return {
    workContext,
    docsPath: path.join(workContext, "docs"),
    reportsPath: path.join(workContext, "docs"),
    plansPath: path.join(workContext, "docs"),
    naming: "kebab-case, project-scoped docs outputs, concise reports",
  };
}

if (require.main === module) {
  console.log(JSON.stringify(subagentInit({ repoRoot: process.cwd(), projectSlug: process.argv[2] }), null, 2));
}

module.exports = {
  subagentInit,
};
