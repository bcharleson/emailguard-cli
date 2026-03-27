import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allSurblCommands: CommandDefinition[] = [
  {
    name: 'surbl_list_domains',
    group: 'surbl',
    subcommand: 'list-domains',
    description: 'List all domains monitored via SURBL blacklist checks',
    examples: ['emailguard surbl list-domains', 'emailguard surbl list-domains --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/surbl-blacklist-checks/domains'),
  },
  {
    name: 'surbl_check',
    group: 'surbl',
    subcommand: 'check',
    description: 'Run a SURBL blacklist check for a domain',
    examples: [
      'emailguard surbl check --domain example.com',
      'emailguard surbl check --domain spammy.net --pretty',
    ],
    inputSchema: z.object({
      domain: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'domain', flags: '--domain <domain>', description: 'Domain to check against SURBL' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/surbl-blacklist-checks', { domain: input.domain }),
  },
  {
    name: 'surbl_get',
    group: 'surbl',
    subcommand: 'get',
    description: 'Get the results of a specific SURBL check by UUID',
    examples: ['emailguard surbl get <uuid>'],
    inputSchema: z.object({
      uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.get(`/api/v1/surbl-blacklist-checks/${input.uuid}`),
  },
];
