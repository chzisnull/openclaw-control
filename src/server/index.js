import Fastify from 'fastify';
import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const fastify = Fastify({ logger: true });
const PORT = 18788;

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

fastify.get('/api/agents', async (request, reply) => {
  const config = await loadConfig();
  return config.agents || [];
});

fastify.get('/api/config', async (request, reply) => {
  const config = await loadConfig();
  return config;
});

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

      const parts = filePath.split(path.sep);
      const sessionIndex = parts.indexOf('sessions');
      
      if (sessionIndex > 0) {
        const agentId = parts[sessionIndex - 1];
        const sessionId = path.basename(filePath, '.jsonl');

        const message = JSON.stringify({
          agentId,
          sessionId,
          content: newContent
        });

        wss.clients.forEach(client => {
          if (client.readyState === 1) {
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

export const startServer = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`OCC Server listening on ${fastify.server.address().port}`);

    const wss = new WebSocketServer({ server: fastify.server });

    wss.on('connection', (ws) => {
      ws.send(JSON.stringify({ type: 'connected', message: 'Connected to OpenClaw Log Stream' }));
    });

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
