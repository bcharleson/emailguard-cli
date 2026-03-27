import { Command } from 'commander';
import { loadConfig, getConfigPath } from '../../core/config.js';
import { EmailGuardClient } from '../../core/client.js';
import { resolveApiKey } from '../../core/auth.js';
import { output, outputError } from '../../core/output.js';
import type { GlobalOptions } from '../../core/types.js';

export function registerStatusCommand(program: Command): void {
  program
    .command('status')
    .description('Show current authentication status and account info')
    .action(async () => {
      const globalOpts = program.opts() as GlobalOptions;

      try {
        let apiKey: string | undefined;
        try {
          apiKey = await resolveApiKey(globalOpts.apiKey);
        } catch {
          // No key available
        }

        if (!apiKey) {
          const result = {
            authenticated: false,
            config_path: getConfigPath(),
            message: 'Not authenticated. Run: emailguard login',
          };
          if (process.stdin.isTTY) {
            console.log('Not authenticated. Run: emailguard login');
          } else {
            output(result, globalOpts);
          }
          process.exitCode = 1;
          return;
        }

        // Fetch account info
        const client = new EmailGuardClient({ apiKey });
        let userInfo: any;
        try {
          userInfo = await client.get('/api/v1/user');
        } catch {
          userInfo = null;
        }

        const config = await loadConfig();

        const result = {
          authenticated: true,
          email: (userInfo as any)?.data?.email ?? config?.email ?? 'unknown',
          name: (userInfo as any)?.data?.name,
          config_path: getConfigPath(),
          token_source: globalOpts.apiKey
            ? 'flag'
            : process.env.EMAILGUARD_API_KEY
              ? 'env'
              : 'config',
        };

        if (process.stdin.isTTY) {
          console.log('Authenticated');
          console.log(`Email: ${result.email}`);
          if (result.name) console.log(`Name: ${result.name}`);
          console.log(`Token source: ${result.token_source}`);
        } else {
          output(result, globalOpts);
        }
      } catch (error) {
        outputError(error, globalOpts);
      }
    });
}
