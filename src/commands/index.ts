import { Command } from 'commander';
import type { CommandDefinition, GlobalOptions } from '../core/types.js';
import { resolveApiKey } from '../core/auth.js';
import { EmailGuardClient } from '../core/client.js';
import { output, outputError } from '../core/output.js';

// Auth commands (special — no API client needed)
import { registerLoginCommand } from './auth/login.js';
import { registerLogoutCommand } from './auth/logout.js';
import { registerStatusCommand } from './auth/status.js';

// MCP command
import { registerMcpCommand } from './mcp/index.js';

// Command definition groups
import { allAccountCommands } from './account/index.js';
import { allWorkspacesCommands } from './workspaces/index.js';
import { allDomainsCommands } from './domains/index.js';
import { allEmailAccountsCommands } from './email-accounts/index.js';
import { allContactsCommands } from './contacts/index.js';
import { allBlacklistCommands } from './blacklist/index.js';
import { allSurblCommands } from './surbl/index.js';
import { allDmarcCommands } from './dmarc/index.js';
import { allDnsCommands } from './dns/index.js';
import { allSpamCheckCommands } from './spam-check/index.js';
import { allInboxTestsCommands } from './inbox-tests/index.js';
import { allSpamFilterCommands } from './spam-filter/index.js';
import { allRedirectsCommands } from './redirects/index.js';
import { allProxyCommands } from './proxy/index.js';
import { allLookupCommands } from './lookup/index.js';
import { allSpamhausCommands } from './spamhaus/index.js';
import { allTagsCommands } from './tags/index.js';

/** All command definitions — single source of truth for CLI + MCP */
export const allCommands: CommandDefinition[] = [
  ...allAccountCommands,
  ...allWorkspacesCommands,
  ...allDomainsCommands,
  ...allEmailAccountsCommands,
  ...allContactsCommands,
  ...allBlacklistCommands,
  ...allSurblCommands,
  ...allDmarcCommands,
  ...allDnsCommands,
  ...allSpamCheckCommands,
  ...allInboxTestsCommands,
  ...allSpamFilterCommands,
  ...allRedirectsCommands,
  ...allProxyCommands,
  ...allLookupCommands,
  ...allSpamhausCommands,
  ...allTagsCommands,
];

export function registerAllCommands(program: Command): void {
  // Auth commands (no API client needed)
  registerLoginCommand(program);
  registerLogoutCommand(program);
  registerStatusCommand(program);

  // MCP server command
  registerMcpCommand(program);

  // Group commands by their `group` field
  const groups = new Map<string, CommandDefinition[]>();
  for (const cmd of allCommands) {
    if (!groups.has(cmd.group)) groups.set(cmd.group, []);
    groups.get(cmd.group)!.push(cmd);
  }

  for (const [groupName, commands] of groups) {
    const groupCmd = program
      .command(groupName)
      .description(`Manage ${groupName}`);

    for (const cmdDef of commands) {
      registerCommand(groupCmd, cmdDef);
    }

    groupCmd.on('command:*', (operands: string[]) => {
      const available = commands.map((c) => c.subcommand).join(', ');
      console.error(`error: unknown command '${operands[0]}' for '${groupName}'`);
      console.error(`Available: ${available}`);
      process.exitCode = 1;
    });
  }
}

function registerCommand(parent: Command, cmdDef: CommandDefinition): void {
  const cmd = parent
    .command(cmdDef.subcommand)
    .description(cmdDef.description);

  // Register positional arguments
  if (cmdDef.cliMappings.args) {
    for (const arg of cmdDef.cliMappings.args) {
      const argStr = arg.required ? `<${arg.name}>` : `[${arg.name}]`;
      cmd.argument(argStr, arg.field);
    }
  }

  // Register options
  if (cmdDef.cliMappings.options) {
    for (const opt of cmdDef.cliMappings.options) {
      cmd.option(opt.flags, opt.description ?? '');
    }
  }

  // Add examples to help
  if (cmdDef.examples?.length) {
    cmd.addHelpText('after', '\nExamples:\n' + cmdDef.examples.map((e) => `  $ ${e}`).join('\n'));
  }

  cmd.action(async (...actionArgs: any[]) => {
    // Capture opts before any async work so the catch block always has them
    const globalOpts = cmd.optsWithGlobals() as GlobalOptions & Record<string, any>;
    try {

      // --pretty shorthand for --output pretty
      if (globalOpts.pretty) {
        globalOpts.output = 'pretty';
      }

      // Resolve API key and build client
      const apiKey = await resolveApiKey(globalOpts.apiKey);
      const client = new EmailGuardClient({ apiKey, baseUrl: globalOpts.baseUrl });

      // Build input from positional args + options
      const input: Record<string, any> = {};

      // Map positional arguments
      if (cmdDef.cliMappings.args) {
        for (let i = 0; i < cmdDef.cliMappings.args.length; i++) {
          const argDef = cmdDef.cliMappings.args[i];
          if (actionArgs[i] !== undefined) {
            input[argDef.field] = actionArgs[i];
          }
        }
      }

      // Map options
      if (cmdDef.cliMappings.options) {
        for (const opt of cmdDef.cliMappings.options) {
          const match = opt.flags.match(/--([a-z][a-z0-9-]*)/);
          if (match) {
            const optName = match[1].replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
            if (globalOpts[optName] !== undefined) {
              input[opt.field] = globalOpts[optName];
            }
          }
        }
      }

      // Validate input against schema
      const parsed = cmdDef.inputSchema.safeParse(input);
      if (!parsed.success) {
        const issues = (parsed.error as any).issues ?? [];
        const missing = issues
          .filter((i: any) => {
            const fieldName = String(i.path?.[0] ?? '');
            return (input as Record<string, any>)[fieldName] === undefined;
          })
          .map((i: any) => {
            return '--' + String(i.path?.[0] ?? '').replace(/_/g, '-');
          });
        if (missing.length > 0) {
          throw new Error(`Missing required option(s): ${missing.join(', ')}`);
        }
        const msg = issues.map((i: any) => `${i.path?.join('.')}: ${i.message}`).join('; ');
        throw new Error(`Invalid input: ${msg}`);
      }

      const result = await cmdDef.handler(parsed.data, client);
      output(result, globalOpts);
    } catch (error) {
      outputError(error, globalOpts);
    }
  });
}
