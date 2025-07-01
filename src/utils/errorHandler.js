const logger = require("./logger");

class ErrorHandler {
  static handleError(error, context = "") {
    logger.error(`Error ${context}:`, {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  static handleAsyncError(fn) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        ErrorHandler.handleError(error, fn.name);
        throw error;
      }
    };
  }

  static setupUncaughtExceptionHandlers() {
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception:", error);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Rejection at:", promise, "reason:", reason);
      process.exit(1);
    });
  }
}

module.exports = ErrorHandler;
