const express = require("express");
const newLoger = require("../../lib/logger");
const { version } = require("./package.json");
const { pool } = require("../../lib/db");

const service = process.env.OTEL_SERVICE_NAME;
const logger = newLoger.logger(service);

const app = express();
const port = process.env.USERS_PORT;

app.get("/", async (_, res) => {
  try {
    logger.verbose("fetching users");
    const result = await pool.query("SELECT * FROM users");
    res.send(result.rows);
    logger.info("users fetched: " + result.rows.length);
  } catch (err) {
    logger.error("error fetching users", err);
    res.status(500).send();
  }
});

app.listen(port, () => {
  logger.info(`${service} v${version}: localhost:${port}`);
});
