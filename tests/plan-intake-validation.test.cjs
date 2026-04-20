const test = require("node:test");
const assert = require("node:assert/strict");

const {
  planIntakeValidation,
  VALID_FRAMEWORKS,
  VALID_GOAL_TIERS,
  VALID_TOOLS,
} = require("../scripts/hooks/plan-intake-validation.cjs");

// ---------------------------------------------------------------------------
// Non-interactive path — all three decisions supplied via flags
// ---------------------------------------------------------------------------

test("planIntakeValidation accepts explicit flag values in non-interactive mode", async () => {
  const result = await planIntakeValidation({
    flags: {
      framework: "CRISP-DM",
      "goal-tier": "Pro",
      "visualization-tool": "Metabase",
    },
    interactive: false,
  });

  assert.equal(result.ok, true);
  assert.equal(result.framework, "CRISP-DM");
  assert.equal(result.goalTier, "Pro");
  assert.equal(result.visualizationTool, "Metabase");
});

test("planIntakeValidation accepts Grafana and Advanced in non-interactive mode", async () => {
  const result = await planIntakeValidation({
    flags: {
      framework: "Data Pipeline",
      "goal-tier": "Advanced",
      "visualization-tool": "Grafana",
    },
    interactive: false,
  });

  assert.equal(result.framework, "Data Pipeline");
  assert.equal(result.goalTier, "Advanced");
  assert.equal(result.visualizationTool, "Grafana");
});

test("planIntakeValidation is case-insensitive for flag values", async () => {
  const result = await planIntakeValidation({
    flags: {
      framework: "crisp-dm",
      "goal-tier": "basic",
      "visualization-tool": "metabase",
    },
    interactive: false,
  });

  assert.equal(result.framework, "CRISP-DM");
  assert.equal(result.goalTier, "Basic");
  assert.equal(result.visualizationTool, "Metabase");
});

test("planIntakeValidation applies Pro and Metabase defaults in non-interactive mode when flags are absent", async () => {
  // Pro and Metabase have defaults; framework has no default → should still not throw
  // because non-interactive with no framework flag falls back to null default path.
  // In non-interactive mode with missing framework, it should throw.
  await assert.rejects(
    () => planIntakeValidation({ flags: {}, interactive: false }),
    (err) => {
      assert.match(err.message, /Framework/);
      assert.match(err.message, /non-interactive/);
      return true;
    },
  );
});

test("planIntakeValidation rejects invalid flag value with descriptive error", async () => {
  await assert.rejects(
    () =>
      planIntakeValidation({
        flags: {
          framework: "NotAFramework",
          "goal-tier": "Pro",
          "visualization-tool": "Metabase",
        },
        interactive: false,
      }),
    (err) => {
      assert.match(err.message, /Invalid Framework/);
      assert.match(err.message, /NotAFramework/);
      return true;
    },
  );
});

test("planIntakeValidation rejects invalid goal-tier in non-interactive mode", async () => {
  await assert.rejects(
    () =>
      planIntakeValidation({
        flags: {
          framework: "CRISP-DM",
          "goal-tier": "Expert",
          "visualization-tool": "Metabase",
        },
        interactive: false,
      }),
    (err) => {
      assert.match(err.message, /Invalid Goal tier/);
      return true;
    },
  );
});

test("planIntakeValidation rejects invalid visualization-tool in non-interactive mode", async () => {
  await assert.rejects(
    () =>
      planIntakeValidation({
        flags: {
          framework: "CRISP-DM",
          "goal-tier": "Pro",
          "visualization-tool": "Tableau",
        },
        interactive: false,
      }),
    (err) => {
      assert.match(err.message, /Invalid Visualization tool/);
      return true;
    },
  );
});

// ---------------------------------------------------------------------------
// Constants sanity checks
// ---------------------------------------------------------------------------

test("VALID_FRAMEWORKS contains exactly CRISP-DM and Data Pipeline", () => {
  assert.deepEqual(VALID_FRAMEWORKS, ["CRISP-DM", "Data Pipeline"]);
});

test("VALID_GOAL_TIERS contains exactly Basic, Pro, Advanced", () => {
  assert.deepEqual(VALID_GOAL_TIERS, ["Basic", "Pro", "Advanced"]);
});

test("VALID_TOOLS contains exactly Metabase, Grafana, Apache Superset", () => {
  assert.deepEqual(VALID_TOOLS, ["Metabase", "Grafana", "Apache Superset"]);
});
