import { Command } from 'commander';
import { saveConfig, getConfigPath } from '../../core/config.js';
import { output, outputError } from '../../core/output.js';
import type { GlobalOptions } from '../../core/types.js';

const BASE_URL = 'https://app.emailguard.io';

export function registerLoginCommand(program: Command): void {
  program
    .command('login')
    .description('Authenticate with EmailGuard using email + password (saves token to ~/.emailguard-cli/config.json). Alternatively set EMAILGUARD_API_KEY to use a pre-generated API token from your dashboard.')
    .option('--email <email>', 'EmailGuard account email (skips interactive prompt)')
    .option('--password <password>', 'EmailGuard account password (skips interactive prompt)')
    .option('--api-key <key>', 'Use a pre-generated API token directly (from dashboard → Developer API)')
    .action(async (opts) => {
      const globalOpts = program.opts() as GlobalOptions;

      try {
        // Fast path: pre-generated API token provided directly
        if (opts.apiKey) {
          await saveConfig({ api_key: opts.apiKey });
          const result = { status: 'authenticated', token_source: 'api_key', config_path: getConfigPath() };
          if (process.stdin.isTTY) {
            console.log('API token saved to ~/.emailguard-cli/config.json');
          } else {
            output(result, globalOpts);
          }
          return;
        }

        let email = opts.email || process.env.EMAILGUARD_EMAIL;
        let password = opts.password || process.env.EMAILGUARD_PASSWORD;

        // Interactive prompts if not provided and we're in a TTY
        if (!email || !password) {
          if (!process.stdin.isTTY) {
            outputError(
              new Error('No credentials provided. Use --email + --password, --api-key, or set EMAILGUARD_API_KEY'),
              globalOpts,
            );
            return;
          }

          const [major] = process.versions.node.split('.').map(Number);
          if (major < 20) {
            outputError(
              new Error('Interactive login requires Node.js 20+. Use --email/--password flags or set EMAILGUARD_API_KEY.'),
              globalOpts,
            );
            return;
          }

          console.log('Get your API token from: https://app.emailguard.io/api-settings\n');

          const { input, password: promptPassword } = await import('@inquirer/prompts');
          if (!email) {
            email = await input({ message: 'EmailGuard email:' });
          }
          if (!password) {
            password = await promptPassword({ message: 'Password:', mask: '*' });
          }
        }

        if (!email || !password) {
          outputError(new Error('Email and password are required'), globalOpts);
          return;
        }

        if (process.stdin.isTTY) {
          console.log('Authenticating...');
        }

        const response = await fetch(`${BASE_URL}/api/v1/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const body = await response.text().catch(() => '');
          let msg = 'Authentication failed';
          try { msg = JSON.parse(body).message ?? msg; } catch { /* */ }
          outputError(new Error(msg), globalOpts);
          return;
        }

        const data = await response.json() as { data?: { token?: string } };
        const token = data?.data?.token;

        if (!token) {
          outputError(new Error('No token returned from EmailGuard API'), globalOpts);
          return;
        }

        await saveConfig({ api_key: token, email });

        const result = {
          status: 'authenticated',
          email,
          config_path: getConfigPath(),
        };

        if (process.stdin.isTTY) {
          console.log(`\nAuthenticated successfully as ${email}`);
          console.log('Token saved to ~/.emailguard-cli/config.json');
        } else {
          output(result, globalOpts);
        }
      } catch (error) {
        outputError(error, globalOpts);
      }
    });
}
