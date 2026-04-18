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
  const grafanaKeywords = [
    "grafana",
    "monitoring",
    "observability",
    "metrics",
    "logs",
    "timeseries",
    "time series",
    "real-time",
    "realtime",
    "telemetry",
    "infrastructure",
    "ops",
    "incident",
    "sla",
  ];
  const metabaseKeywords = [
    "metabase",
    "dashboard",
    "bi",
    "analytics",
    "cohort",
    "retention",
    "funnel",
    "marketing",
    "sales",
    "product",
    "finance",
    "sql editor",
    "semantic layer",
  ];

  if (grafanaKeywords.some((keyword) => goals.includes(keyword))) {
    return {
      name: "Grafana",
      reason: "Goals lean toward operational or time-series dashboards, which fits Grafana better than a BI-first stack.",
      deployNote: "Grafana is open-source and works best on free-tier VM/container hosting or self-hosted deployment, not static hosting.",
    };
  }

  if (metabaseKeywords.some((keyword) => goals.includes(keyword)) || preferFreeDeploy) {
    return {
      name: "Metabase",
      reason: "Goals need an interactive open-source dashboard with a simpler free-host or self-host deployment path.",
      deployNote: "Metabase is the default interactive dashboard path for general BI portfolios and fits free-tier app hosting or self-hosted deployment.",
    };
  }

  return {
    name: "Metabase",
    reason: "General interactive analytics work fits Metabase as the default open-source dashboard stack.",
    deployNote: "Metabase is the default open-source dashboard option unless the project is explicitly observability or time-series first.",
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

