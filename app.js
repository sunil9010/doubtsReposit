const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "covid19India.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertStateDbObjectToResponseObject = (dbObject) => {
  return {
    stateId: dbObject.state_id,
    stateName: dbObject.state_name,
    population: dbObject.population,
  };
};

// const convertDistrictDbObjectToResponseObject = (dbObject) => {
//   return {
//     districtId: dbObject.district_id,
//     districtName: dbObject.district_name,
//     stateId: dbObject.state_id,
//     cases: dbObject.cases,
//     cured: dbObject.cured,
//     active: dbObject.active,
//     deaths: dbObject.deaths,
//   };
// };

// app.get("/states/", async (request, response) => {
//   const getStatesQuery = `
//     SELECT
//       *
//     FROM
//       state;`;
//   const statesArray = await database.all(getStatesQuery);
//   response.send(
//     statesArray.map((eachState) =>
//       convertStateDbObjectToResponseObject(eachState)
//     )
//   );
// });

app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const getStateQuery = `
    SELECT 
      *
    FROM 
      state 
    WHERE 
      state_id = ${stateId};`;
  const state = await database.get(getStateQuery);
  response.send(convertStateDbObjectToResponseObject(state));
});
