/*
Dynamically generated tests
*/

const scenarios = [
    {
     average_age: 29, // input
     age_profile: "Young" // expected output
    },
    { 
     average_age: 31, // input
     age_profile: "Old" // expected output
    },
];

scenarios.forEach((scenario, idx) => {
  test(`test_status_${idx}`)
    // Name of the model / action you are tesing. NOT GCP dataset
    .dataset("0100_CLUBS")
    // ${ref("CLUBS")} in 0100_CLUBS.sqlx gets substituted with this select statement
    .input("CLUBS", ` 
    SELECT 
    "1" AS CLUB_ID
  , "FCB" AS CLUB_CODE
  , "Barcelona" AS NAME
  , "La Liga" AS DOMESTIC_COMPETITION_ID
  , "20" AS SQUAD_SIZE
  , ${scenario.average_age} AS AVERAGE_AGE
  , "https://www.fcbarcelona.com/" AS URL
    
    `)
    .expect(`
    SELECT 
        "1" AS CLUB_ID
    , "FCB" AS CLUB_CODE
    , "Barcelona" AS NAME
    , "La Liga" AS DOMESTIC_COMPETITION_ID
    , "20" AS SQUAD_SIZE
    , ${scenario.average_age} AS AVERAGE_AGE
    , "${scenario.age_profile}" AS AGE_PROFILE
    , "https://www.fcbarcelona.com/" AS URL
    `);
});
