import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import prisma from './config/database.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Connected successfully to MySQL database via Prisma');

    const server = app.listen(PORT, () => {
      console.log(`🚀 DairyFresh Backend Server running on http://localhost:${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('💤 Database connection closed. Server exited.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
