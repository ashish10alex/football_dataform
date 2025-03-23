const tableNames = ["table1", "table2", "table3", "table4", ]

tableNames.forEach(tableName => {
  publish(tableName, {
    type: "table",
    schema: "dataform",
  }).query(ctx => `
    SELECT '${tableName}' AS table_name, 
           CURRENT_TIMESTAMP() AS created_at
  `);
});


