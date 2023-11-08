import winston from "winston";

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({
      level: "info",
      filename: "app.log",
      handleExceptions: true,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});

export default logger;
