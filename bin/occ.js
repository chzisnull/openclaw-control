#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig } from '../src/lib/config.js';
import { startServer } from '../src/server/index.js';

const program = new Command();

program
  .name('occ')
  .description('OpenClaw Control Center CLI')
  .version('1.0.0');

program
  .command('status')
  .description('List current agents and their status')
  .action(async () => {
    try {
      const config = await loadConfig();
      const agents = config.agents?.list || [];

      console.log(chalk.bold.blue('OpenClaw Agents Status'));
      console.log(chalk.gray('--------------------------------------------------'));

      if (agents.length === 0) {
        console.log(chalk.yellow('No agents configured.'));
      } else {
        agents.forEach(agent => {
          console.log(
            chalk.green('ID:   ') + chalk.white(agent.id) + '\n' +
            chalk.green('Model:') + chalk.cyan(agent.model) + '\n' +
            chalk.gray('--------------------------------------------------')
          );
        });
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('serve')
  .description('Start the OpenClaw Control Center Server')
  .action(async () => {
    console.log(chalk.blue('Starting OpenClaw Control Center Server...'));
    await startServer();
  });

program.parse();
