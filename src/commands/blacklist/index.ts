import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allBlacklistCommands: CommandDefinition[] = [
  {
    name: 'blacklist_list_domains',
    group: 'blacklist',
    subcommand: 'list-domains',
    description: 'List all domains currently being monitored for blacklist status',
    examples: ['emailguard blacklist list-domains', 'emailguard blacklist list-domains --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/blacklist-checks/domains'),
  },
  {
    name: 'blacklist_list_accounts',
    group: 'blacklist',
    subcommand: 'list-accounts',
    description: 'List all email accounts being monitored for blacklist status',
    examples: ['emailguard blacklist list-accounts', 'emailguard blacklist list-accounts --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/blacklist-checks/email-accounts'),
  },
  {
    name: 'blacklist_check',
    group: 'blacklist',
    subcommand: 'check',
    description: 'Run an ad-hoc blacklist check against 100+ databases for a domain or IP address',
    examples: [
      'emailguard blacklist check --domain example.com',
      'emailguard blacklist check --domain 1.2.3.4 --pretty',
    ],
    inputSchema: z.object({
      domain_or_ip: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'domain_or_ip', flags: '--domain <domain-or-ip>', description: 'Domain or IP address to check' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/blacklist-checks/ad-hoc', { domain_or_ip: input.domain_or_ip }),
  },
  {
    name: 'blacklist_get',
    group: 'blacklist',
    subcommand: 'get',
    description: 'Get the results of a specific blacklist check by ID',
    examples: ['emailguard blacklist get <id>', 'emailguard blacklist get <id> --pretty'],
    inputSchema: z.object({
      id: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'id', name: 'id', required: true }],
    },
    handler: async (input, client) => client.get(`/api/v1/blacklist-checks/${input.id}`),
  },
];
