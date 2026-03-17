

test("0100_CLUBS_CASE_TEST_JS")
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