
publish("test_js_table_1").query(ctx => "SELECT 1 AS A");

publish(
    "test_js_table_2",
    `
    select 12 as a
    `
)


operate(
    "test_js_ops",
    `
    create or replace table
    drawingfire-b72a8.dataform.test_js_ops
    as 
    select 14 as b
    `
)

assert(
    "test_js_assert",
    `
    select 14 as b
    `
)


publish("my_incremental_table", {
  type: "incremental",
  description: "An example incremental table created using JavaScript",
  tags: ["daily", "reporting"] // Optional: You can add other properties here
})
.preOps(ctx => `
    DECLARE _RANGE INT64 DEFAULT 3;
  `)
.query(ctx => {
  let sqlQuery = `SELECT CURRENT_DATE AS DATE_COL`;
  if (ctx.incremental()) {
    sqlQuery += ` WHERE DATE_COL > (SELECT MAX(DATE_COL) FROM ${ctx.self()})`;
  }
  return sqlQuery;
});


test("0300_CLUBS_CASE_TEST_JS")
  .dataset("0100_CLUBS")   // Name of the model / action you are tesing. NOT GCP dataset 
  // ${ref("CLUBS")} in 0100_CLUBS.sqlx gets substituted with this select statement
  .input("CLUBS", ` 
    SELECT 
    "1" AS CLUB_ID
  , "FCB" AS CLUB_CODE
  , "Barcelona" AS NAME
  , "La Liga" AS DOMESTIC_COMPETITION_ID
  , "20" AS SQUAD_SIZE
  , 29 AS AVERAGE_AGE
  , "https://www.fcbarcelona.com/" AS URL
    
  `)
  .expect(`
SELECT 

    "1" AS CLUB_ID
  , "FCB" AS CLUB_CODE
  , "Barcelona" AS NAME
  , "La Liga" AS DOMESTIC_COMPETITION_ID
  , "20" AS SQUAD_SIZE
  , 29 AS AVERAGE_AGE
  , "Young" AS AGE_PROFILE
  -- , "Old" AS AGE_PROFILE -- Will fail
  , "https://www.fcbarcelona.com/" AS URL
  `);
