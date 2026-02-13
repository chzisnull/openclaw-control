import fs from 'fs-extra';
import path from 'path';
import os from 'os';

export async function loadConfig() {
  const homeDir = os.homedir();
  const configPath = path.join(homeDir, '.openclaw', 'openclaw.json');

  if (!await fs.pathExists(configPath)) {
    throw new Error(`Config file not found at ${configPath}`);
  }

  try {
    const config = await fs.readJson(configPath);
    return config;
  } catch (error) {
    throw new Error(`Failed to parse config file: ${error.message}`);
  }
}
