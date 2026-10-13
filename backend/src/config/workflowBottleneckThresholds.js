// Starting operational thresholds for this project, not validated laboratory
// standards. Override a stage with WORKFLOW_BOTTLENECK_<STAGE>_MINUTES.
const DEFAULT_THRESHOLDS_MINUTES = Object.freeze({
  SPECIMEN_COLLECTION: 120,
  ACCESSIONING: 120,
  GROSSING: 240,
  EMBEDDING: 240,
  SECTIONING: 240,
  STAINING: 180,
  SCANNING: 120,
  PATHOLOGIST_REVIEW: 480,
});

const getWorkflowBottleneckThresholds = (environment = process.env) =>
  Object.fromEntries(
    Object.entries(DEFAULT_THRESHOLDS_MINUTES).map(([stage, defaultValue]) => {
      const configuredValue = Number(
        environment[`WORKFLOW_BOTTLENECK_${stage}_MINUTES`]
      );
      const threshold = Number.isInteger(configuredValue) && configuredValue > 0
        ? configuredValue
        : defaultValue;

      return [stage, threshold];
    })
  );

module.exports = {
  DEFAULT_THRESHOLDS_MINUTES,
  getWorkflowBottleneckThresholds,
};
