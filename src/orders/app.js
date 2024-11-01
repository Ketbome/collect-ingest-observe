require("dotenv").config();
const express = require("express");
const newLoger = require("../../lib/logger");
const { version } = require("./package.json");
const { pool } = require("../../lib/db");

const service = process.env.OTEL_SERVICE_NAME;
const logger = newLoger.logger(service);

const app = express();
const port = process.env.ORDERS_PORT;

app.get("/", async (_, res) => {
  try {
    logger.verbose("fetching orders");
    const result = await pool.query("SELECT * FROM orders");
    res.send(result.rows);
    logger.info("orders fetched: " + result.rows.length);
  } catch (err) {
    logger.error("error fetching orders", err);
    res.status(500).send();
  }
});

app.get("/:userId", async (req, res) => {
  try {
    logger.verbose("fetching orders");
    const userId = req.params.userId;
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [userId]);
    res.send(result.rows);
    logger.info("orders fetched: " + result.rows.length);
  } catch (err) {
    logger.error("error fetching orders", err);
    res.status(500).send();
  }
});

app.listen(port, () => {
  logger.info(`${service} v${version}: localhost:${port}`);
});
