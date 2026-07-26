import app from './app.js';
import env, { validateEnv } from './config/env.js';
import prisma from './lib/prisma.js';

validateEnv();

const server = app.listen(env.PORT, () => {
  console.log(`🚗 CarVault API listening on port ${env.PORT} [${env.NODE_ENV}]`);
});

async function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Server closed. Database disconnected.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});