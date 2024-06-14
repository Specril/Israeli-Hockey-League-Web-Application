const { Connection, Request } = require("tedious");

DB_USER = "IsraeliHockeyLeague";
DB_PASSWORD = "ZivCool69";
DB_SERVER = "hockey-il-server.database.windows.net";
DB_NAME = "Hockey League DB v2";
DB_PORT = 1433;

// Connection configuration
const config = {
  authentication: {
    options: {
      userName: DB_USER,
      password: DB_PASSWORD,
    },
    type: "default",
  },
  server: DB_SERVER,
  options: {
    database: DB_NAME,
    encrypt: true, // Use encryption
    trustServerCertificate: true, // Change this based on your security requirements
  },
};

// Create connection instance
const connection = new Connection(config);

// Attempt to connect
connection.on("connect", (err) => {
  if (err) {
    console.error("Connection failed:", err);
  } else {
    console.log("Connected to database");
    executeStatement();
  }
});

// Attempt to execute a sample query
function executeStatement() {
  const request = new Request("SELECT * FROM Teams", (err, rowCount) => {
    if (err) {
      console.error("Query execution failed:", err);
    } else {
      console.log(`Query executed successfully. Rows affected: ${rowCount}`);
    }
    connection.close();
  });

  // Handle rows from the query result
  request.on("row", (columns) => {
    columns.forEach((column) => {
      console.log(`${column.metadata.colName}: ${column.value}`);
    });
  });

  // Execute the request
  connection.execSql(request);
}

// Connect to the database
connection.connect();
