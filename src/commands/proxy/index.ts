import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allProxyCommands: CommandDefinition[] = [
  {
    name: 'proxy_get_ip',
    group: 'proxy',
    subcommand: 'get-ip',
    description: 'Get the IP address for domain masking proxies',
    examples: ['emailguard proxy get-ip'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/domain-masking-proxies/ip'),
  },
  {
    name: 'proxy_list',
    group: 'proxy',
    subcommand: 'list',
    description: 'List all domain masking proxy configurations in the current workspace',
    examples: ['emailguard proxy list', 'emailguard proxy list --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/domain-masking-proxies'),
  },
  {
    name: 'proxy_create',
    group: 'proxy',
    subcommand: 'create',
    description: 'Create a domain masking proxy — routes a secondary domain through a clean IP',
    examples: [
      'emailguard proxy create --masking-domain links.secondary.com --primary-domain primary.com',
    ],
    inputSchema: z.object({
      masking_domain: z.string().min(1),
      primary_domain: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'masking_domain', flags: '--masking-domain <domain>', description: 'Secondary/masking domain' },
        { field: 'primary_domain', flags: '--primary-domain <domain>', description: 'Primary domain to route through' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/domain-masking-proxies', {
        masking_domain: input.masking_domain,
        primary_domain: input.primary_domain,
      }),
  },
  {
    name: 'proxy_get',
    group: 'proxy',
    subcommand: 'get',
    description: 'Get details for a specific domain masking proxy by UUID',
    examples: ['emailguard proxy get <uuid>'],
    inputSchema: z.object({
      uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.get(`/api/v1/domain-masking-proxies/${input.uuid}`),
  },
  {
    name: 'proxy_delete',
    group: 'proxy',
    subcommand: 'delete',
    description: 'Delete a domain masking proxy by UUID',
    examples: ['emailguard proxy delete <uuid>'],
    inputSchema: z.object({
      uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.delete(`/api/v1/domain-masking-proxies/${input.uuid}`),
  },
];
