import Fastify from 'fastify';
import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const fastify = Fastify({ logger: true });
const PORT = 3000;

// Helper to load config (reusing logic or importing)
// Since src/lib/config.js uses export, I'll try to import it.
// Note: This requires the project to be module-based (type: module in package.json) or handled by a bundler/transpiler.
// Let's check package.json first to see if "type": "module" is set.
// If not, I might need to use require.
// But the existing code in src/lib/config.js uses `export async function`, so it must be using ESM.

async function loadConfig() {
  const homeDir = os.homedir();
  const configPath = path.join(homeDir, '.openclaw', 'openclaw.json');

  if (!await fs.pathExists(configPath)) {
    throw new Error(`Config file not found at ${configPath}`);
  }

  try {
    return await fs.readJson(configPath);
  } catch (error) {
    throw new Error(`Failed to parse config file: ${error.message}`);
  }
}

// API Routes
fastify.get('/api/agents', async (request, reply) => {
  const config = await loadConfig();
  return config.agents || [];
});

fastify.get('/api/config', async (request, reply) => {
  const config = await loadConfig();
  return config;
});

fastify.post('/api/config', async (request, reply) => {
  return { status: 'ok', message: 'Config update not implemented yet' };
});

// File Tailing State
const fileSizes = new Map();

async function handleFileChange(filePath, wss) {
  try {
    const stats = await fs.stat(filePath);
    const currentSize = stats.size;
    let lastSize = fileSizes.get(filePath) || 0;

    if (currentSize > lastSize) {
      const stream = fs.createReadStream(filePath, {
        start: lastSize,
        end: currentSize - 1,
        encoding: 'utf8'
      });

      let newContent = '';
      for await (const chunk of stream) {
        newContent += chunk;
      }

      // Extract agentId and sessionId from path
      // Path format: .../agents/{agentId}/sessions/{sessionId}.jsonl
      const parts = filePath.split(path.sep);
      const sessionIndex = parts.indexOf('sessions');
      
      if (sessionIndex > 0) {
        const agentId = parts[sessionIndex - 1];
        const sessionId = path.basename(filePath, '.jsonl');

        // Broadcast to all clients
        const message = JSON.stringify({
          agentId,
          sessionId,
          content: newContent
        });

        wss.clients.forEach(client => {
          if (client.readyState === 1) { // WebSocket.OPEN is 1
            client.send(message);
          }
        });
      }
    }
    
    fileSizes.set(filePath, currentSize);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
  }
}

// Start Server
export const startServer = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server listening on ${fastify.server.address().port}`);

    // WebSocket Server
    const wss = new WebSocketServer({ server: fastify.server });

    wss.on('connection', (ws) => {
      console.log('Client connected');
      ws.send(JSON.stringify({ type: 'connected', message: 'Connected to OpenClaw Log Stream' }));
    });

    // Watch Logs
    const homeDir = os.homedir();
    const logGlob = path.join(homeDir, '.openclaw', 'agents', '*', 'sessions', '*.jsonl');
    
    const watcher = chokidar.watch(logGlob, {
      persistent: true,
      ignoreInitial: false
    });

    watcher.on('add', async (filePath) => {
      try {
        const stats = await fs.stat(filePath);
        fileSizes.set(filePath, stats.size);
      } catch (err) {
        console.error(`Error stat file ${filePath}:`, err);
      }
    });

    watcher.on('change', (filePath) => handleFileChange(filePath, wss));

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
