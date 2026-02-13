#!/usr/bin/env node

import { startServer } from './src/server/index.js';

// Start the server
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});