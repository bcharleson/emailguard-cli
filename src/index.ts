import { Command } from 'commander';
import { registerAllCommands } from './commands/index.js';

const program = new Command();

program
  .name('emailguard')
  .description('CLI and MCP server for EmailGuard — email deliverability, blacklist monitoring, inbox testing, and spam analysis')
  .version('0.1.3')
  .option('--api-key <key>', 'API key (overrides EMAILGUARD_API_KEY env var and stored config)')
  .option('--base-url <url>', 'Override API base URL (default: https://app.emailguard.io)')
  .option('--output <format>', 'Output format: json (default) or pretty', 'json')
  .option('--pretty', 'Shorthand for --output pretty')
  .option('--quiet', 'Suppress output, exit codes only')
  .option('--fields <fields>', 'Comma-separated fields to include in output (supports dot notation)');

registerAllCommands(program);

program.parse();
