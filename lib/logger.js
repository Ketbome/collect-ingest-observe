const winston = require("winston");

exports.logger = (service) => {
  const transports = [new winston.transports.Console()];

  return winston.createLogger({
    level: "verbose",
    defaultMeta: { service },
    transports,
  });
};
