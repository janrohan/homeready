import dotenv from "dotenv";

// load env early
dotenv.config();

// Global error handlers to make crashes visible
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err && err.stack ? err.stack : err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason && reason.stack ? reason.stack : reason);
});

// Use dynamic import so we can catch import-time errors and print a clearer
// stacktrace instead of letting nodemon just report "app crashed".
const start = async () => {
  try {
    const { default: app } = await import("./app.js");

    const PORT = process.env.PORT || 3000;
    const HOST = process.env.HOST || "0.0.0.0";

    const server = app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });

    server.on("error", (err) => {
      console.error("Server error:", err && err.stack ? err.stack : err);
    });
  } catch (err) {
    console.error("Failed to start server:", err && err.stack ? err.stack : err);
    // keep process alive for nodemon to show logs, then exit with failure
    process.exit(1);
  }
};

start();
