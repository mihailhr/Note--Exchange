//  PostgreSQL connection pool setup and  a function to test the database connection by querying the current time.

const { Pool } = require("pg");
require("dotenv").config();
const connection_string = process.env.CONNECTION_STRING;
const pool = new Pool({
  connectionString: connection_string,
  ssl: { rejectUnauthorized: false },
});

async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log(
      "Successful connection to DB; Here's the current time: " +
        result.rows[0].now
    );
    client.release();
  } catch (error) {
    console.error("Error occurred when connecting to the Database: " + error);
  }
}
module.exports = { pool, testDatabaseConnection };
