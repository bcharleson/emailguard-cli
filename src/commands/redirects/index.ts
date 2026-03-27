import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allRedirectsCommands: CommandDefinition[] = [
  {
    name: 'redirects_get_ip',
    group: 'redirects',
    subcommand: 'get-ip',
    description: 'Get the IP address for hosted domain redirects',
    examples: ['emailguard redirects get-ip'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/hosted-domain-redirects/ip'),
  },
  {
    name: 'redirects_list',
    group: 'redirects',
    subcommand: 'list',
    description: 'List all hosted domain redirect rules in the current workspace',
    examples: ['emailguard redirects list', 'emailguard redirects list --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/hosted-domain-redirects'),
  },
  {
    name: 'redirects_create',
    group: 'redirects',
    subcommand: 'create',
    description: 'Create a new hosted domain redirect rule (includes managed SSL)',
    examples: [
      'emailguard redirects create --domain links.example.com --redirect https://example.com',
    ],
    inputSchema: z.object({
      domain: z.string().min(1),
      redirect: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'domain', flags: '--domain <domain>', description: 'Domain to set up redirect for' },
        { field: 'redirect', flags: '--redirect <url>', description: 'Destination URL to redirect to' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/hosted-domain-redirects', { domain: input.domain, redirect: input.redirect }),
  },
  {
    name: 'redirects_get',
    group: 'redirects',
    subcommand: 'get',
    description: 'Get details for a specific hosted domain redirect by ID',
    examples: ['emailguard redirects get <id>'],
    inputSchema: z.object({
      id: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'id', name: 'id', required: true }],
    },
    handler: async (input, client) => client.get(`/api/v1/hosted-domain-redirects/${input.id}`),
  },
  {
    name: 'redirects_delete',
    group: 'redirects',
    subcommand: 'delete',
    description: 'Delete a hosted domain redirect rule by UUID',
    examples: ['emailguard redirects delete <uuid>'],
    inputSchema: z.object({
      uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.delete(`/api/v1/hosted-domain-redirects/${input.uuid}`),
  },
];
