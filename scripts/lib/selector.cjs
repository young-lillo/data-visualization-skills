function selectFramework(projectGoals) {
  const goals = projectGoals.toLowerCase();
  const pipelineKeywords = [
    "pipeline",
    "etl",
    "warehouse",
    "transformation",
    "orchestration",
    "data quality",
    "modeling",
  ];

  const usePipeline = pipelineKeywords.some((keyword) => goals.includes(keyword));
  return {
    name: usePipeline ? "Data Pipeline Framework" : "CRISP-DM",
    reason: usePipeline
      ? "Goals are engineering-first, so the project should emphasize ingestion, transformation, and reproducibility."
      : "Goals are insight-first, so the project should emphasize business framing, analysis, and recommendations.",
  };
}

function selectLayer(projectGoals) {
  const goals = projectGoals.toLowerCase();
  const advancedKeywords = ["forecast", "geospatial", "network", "advanced", "senior", "scenario"];
  const basicKeywords = ["quick", "simple", "intro", "basic"];

  if (advancedKeywords.some((keyword) => goals.includes(keyword))) {
    return {
      name: "Advanced",
      reason: "Goals suggest a deeper showcase with richer analysis and stronger technical proof.",
      requiresPython: true,
      requiresSql: true,
    };
  }

  if (basicKeywords.some((keyword) => goals.includes(keyword))) {
    return {
      name: "Basic",
      reason: "Goals suggest a lighter portfolio piece with fast delivery and lower scope.",
      requiresPython: false,
      requiresSql: true,
    };
  }

  return {
    name: "Pro",
    reason: "Goals need balanced domain insight and technical depth, which fits the middle tier best.",
    requiresPython: true,
    requiresSql: true,
  };
}

function selectVisualizationTool(projectGoals, preferFreeDeploy) {
  const goals = projectGoals.toLowerCase();
  const dashboardFirst = ["dashboard", "bi", "sql editor", "semantic layer"].some((keyword) =>
    goals.includes(keyword),
  );

  if (!preferFreeDeploy && dashboardFirst) {
    return {
      name: "Apache Superset",
      reason: "Goals lean toward BI dashboards and free static deploy is not the primary constraint.",
      deployNote: "Superset is not the recommended Netlify Free path because it needs a running backend.",
    };
  }

  return {
    name: "RAWGraphs",
    reason: "Free deployment is the priority, so a browser-first and static-friendly visualization path is the safer default.",
    deployNote: "RAWGraphs fits static portfolio publishing much better than Superset.",
  };
}

function buildDecisionBundle({ projectGoals, preferFreeDeploy }) {
  const framework = selectFramework(projectGoals);
  const layer = selectLayer(projectGoals);
  const tool = selectVisualizationTool(projectGoals, preferFreeDeploy);

  return { framework, layer, tool };
}

module.exports = {
  buildDecisionBundle,
  selectFramework,
  selectLayer,
  selectVisualizationTool,
};

