import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allDomainsCommands: CommandDefinition[] = [
  {
    name: 'domains_list',
    group: 'domains',
    subcommand: 'list',
    description: 'List all domains in the current workspace',
    examples: ['emailguard domains list', 'emailguard domains list --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/domains'),
  },
  {
    name: 'domains_get',
    group: 'domains',
    subcommand: 'get',
    description: 'Get details for a specific domain by UUID',
    examples: ['emailguard domains get <uuid>', 'emailguard domains get <uuid> --pretty'],
    inputSchema: z.object({
      uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) => client.get(`/api/v1/domains/${input.uuid}`),
  },
  {
    name: 'domains_add',
    group: 'domains',
    subcommand: 'add',
    description: 'Add a new domain to the current workspace',
    examples: [
      'emailguard domains add --name example.com',
      'emailguard domains add --name acme.com --pretty',
    ],
    inputSchema: z.object({
      name: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'name', flags: '--name <domain>', description: 'Domain name (e.g., example.com)' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/domains', { name: input.name }),
  },
  {
    name: 'domains_delete',
    group: 'domains',
    subcommand: 'delete',
    description: 'Delete a domain by UUID',
    examples: ['emailguard domains delete <uuid>'],
    inputSchema: z.object({
      domain_uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'domain_uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.delete(`/api/v1/domains/delete/${input.domain_uuid}`),
  },
  {
    name: 'domains_patch_spf',
    group: 'domains',
    subcommand: 'patch-spf',
    description: 'Refresh / patch SPF record status for a domain',
    examples: ['emailguard domains patch-spf <uuid>'],
    inputSchema: z.object({
      domain_uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'domain_uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.patch(`/api/v1/domains/spf-record/${input.domain_uuid}`),
  },
  {
    name: 'domains_patch_dkim',
    group: 'domains',
    subcommand: 'patch-dkim',
    description: 'Update DKIM selectors for a domain',
    examples: ['emailguard domains patch-dkim <uuid> --selectors "google,sendgrid"'],
    inputSchema: z.object({
      domain_uuid: z.string().min(1),
      dkim_selectors: z.string().optional(),
    }),
    cliMappings: {
      args: [{ field: 'domain_uuid', name: 'uuid', required: true }],
      options: [
        { field: 'dkim_selectors', flags: '--selectors <selectors>', description: 'Comma-separated DKIM selectors' },
      ],
    },
    handler: async (input, client) =>
      client.patch(`/api/v1/domains/dkim-records/${input.domain_uuid}`, {
        dkim_selectors: input.dkim_selectors,
      }),
  },
  {
    name: 'domains_patch_dmarc',
    group: 'domains',
    subcommand: 'patch-dmarc',
    description: 'Refresh / patch DMARC record status for a domain',
    examples: ['emailguard domains patch-dmarc <uuid>'],
    inputSchema: z.object({
      domain_uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'domain_uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.patch(`/api/v1/domains/dmarc-record/${input.domain_uuid}`),
  },
];
