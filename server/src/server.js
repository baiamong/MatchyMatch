import app from './app.js';
import config from './config/env.js';
import { testConnection } from './config/database.js';

const PORT = config.server.port;

// Test database connection before starting server
const startServer = async () => {
  try {
    console.log('Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      console.error('Failed to connect to database. Please check your DATABASE_URL.');
      process.exit(1);
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║     MatchyMatch Server Running         ║
╠════════════════════════════════════════╣
║  Port:        ${PORT}                     ║
║  Environment: ${config.server.nodeEnv.padEnd(11)} ║
║  Frontend:    ${config.frontend.url.padEnd(23)} ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

startServer();
