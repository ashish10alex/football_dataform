/** Builds a filtered slice of a source table using the watermark and optional partition filter. Generic for any model. */
const buildIncrementalSliceCte = ({
  cteName = "scoped_clean",
  sourceRef,
  tableAlias = "clean",
  selectList,
  idCondition = "TRUE",
  additionalWhere,
  isIncremental,
  timestampColumn,
  dateColumn,
  watermarkVariable = "watermark_lower_bound",
}) => {
  if (!timestampColumn && !dateColumn) {
    throw new Error(
      "buildIncrementalSliceCte requires timestampColumn or dateColumn to filter incrementally."
    );
  }

  const selectClause = selectList || `${tableAlias}.*`;
  const hasTimestampFilter = Boolean(timestampColumn);
  const hasDateFilter = Boolean(dateColumn);

  const whereClauses = [
    idCondition || "TRUE",
    ...(additionalWhere ? [additionalWhere] : []),
    ...(hasTimestampFilter
      ? [
          isIncremental
            ? `${timestampColumn} >= ${watermarkVariable}`
            : `${timestampColumn} >= TIMESTAMP('1970-01-01')`,
        ]
      : []),
    ...(hasDateFilter
      ? [
          isIncremental
            ? `${dateColumn} >= DATE(${watermarkVariable})`
            : `${dateColumn} >= DATE('1970-01-01')`,
        ]
      : []),
  ];

  return `
    ${cteName} AS (
      SELECT
        ${selectClause}
      FROM ${sourceRef} AS ${tableAlias}
      WHERE
        ${whereClauses.join("\n      AND ")}
    )`;
};

/** Builds a QUALIFY-based deduplication CTE with deterministic ordering. */
const buildDedupedCte = ({
  cteName = "deduped",
  sourceName,
  sourceAlias = "src",
  selectList,
  partitionBy = [],
  orderBy = [],
}) => {
  if (!sourceName) {
    throw new Error(
      "buildDedupedCte requires sourceName to point at the CTE or table to dedupe."
    );
  }

  if (!partitionBy.length) {
    throw new Error(
      "buildDedupedCte requires at least one partitionBy column."
    );
  }

  if (!orderBy.length) {
    throw new Error(
      "buildDedupedCte requires at least one orderBy expression."
    );
  }

  const partitionSql = partitionBy
    .map(
      (column, index) =>
        `      ${column}${index < partitionBy.length - 1 ? "," : ""}`
    )
    .join("\n");

  const orderSql = orderBy
    .map(
      (expression, index) =>
        `      ${expression}${index < orderBy.length - 1 ? "," : ""}`
    )
    .join("\n");

  const selectSql = selectList || `${sourceAlias}.*`;

  return `
, ${cteName} AS (
  SELECT
    ${selectSql}
  FROM ${sourceName} AS ${sourceAlias}
  QUALIFY ROW_NUMBER() OVER (
    PARTITION BY
${partitionSql}
    ORDER BY
${orderSql}
  ) = 1
)`;
};

/**
 * Declares a lower bound scalar for use in partition filters.
 * Keeps the required partition filter compatible with BigQuery while still pruning based on the watermark.
 */
const declareWatermarkVariable = ({
  /** Watermark reference to use for incremental reads. */
  watermarkRef: watermarkRef,
  /** Table name to track. */
  tableName: tableName,
  /** Watermark variable name to use for the lower bound. */
  watermarkVariable: watermarkVariable = "watermark_lower_bound",
  /** Buffer time to subtract from the watermark. Optional, defaults to 10 minutes */
  buffer: buffer = "10 MINUTE",
}) => `
  DECLARE ${watermarkVariable} TIMESTAMP DEFAULT
  TIMESTAMP_SUB(
    IFNULL(
      (
        SELECT
          MAX(w.last_processed_at)
        FROM ${watermarkRef} AS w
        WHERE w.table_name = "${tableName}"
      ),
      TIMESTAMP('1970-01-01')
    ),
    INTERVAL ${buffer}
  )
`;

/**
 * Append-only watermark write to avoid concurrent MERGE/UPDATE conflicts.
 * declareWatermarkLowerBound uses MAX(last_processed_at) so the newest row wins.
 */
const setWatermarkLastProcessedAt = ({
  /** Watermark reference to use for incremental reads. */
  watermarkRef: watermarkRef,
  /** Table name to track. */
  tableName: tableName,
  /** Timestamp expression to use for the watermark. */
  timestampExpression: timestampExpression,
}) => `
  INSERT INTO ${watermarkRef} (string_col, date_col)
  SELECT
    "${tableName}" AS table_name,
    ${timestampExpression} AS last_processed_at
`;

module.exports = {
  buildIncrementalSliceCte,
  buildDedupedCte,
  declareWatermarkVariable,
  setWatermarkLastProcessedAt,
};