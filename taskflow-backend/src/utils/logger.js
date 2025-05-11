// utils/logger.js
const winston = require('winston');

// Create a Winston logger
const logger = winston.createLogger({
  level: 'info', // Default log level
  format: winston.format.combine(
    winston.format.timestamp(), // Adds timestamp
    winston.format.simple() // Simple text format for logs
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.combine(
      winston.format.colorize(), // Color the logs for console
      winston.format.simple() // Simple text format for console
    )}),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }) // Log errors to a file
  ],
});

// A simple function to log errors with context
const logError = (context, error) => {
  const err = error instanceof Error ? error : new Error(String(error));
  logger.error(`${context}: ${err.message}\n${err.stack}`);
};

module.exports = { logError };
