import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allLookupCommands: CommandDefinition[] = [
  {
    name: 'lookup_domain',
    group: 'lookup',
    subcommand: 'domain',
    description: 'Look up the hosting provider and infrastructure for a domain',
    examples: [
      'emailguard lookup domain --domain example.com',
      'emailguard lookup domain --domain acme.com --pretty',
    ],
    inputSchema: z.object({
      domain: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'domain', flags: '--domain <domain>', description: 'Domain to look up host for' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/domain-host-lookup', { domain: input.domain }),
  },
  {
    name: 'lookup_email',
    group: 'lookup',
    subcommand: 'email',
    description: 'Look up the email hosting provider for an email address',
    examples: [
      'emailguard lookup email --email user@example.com',
      'emailguard lookup email --email contact@acme.com --pretty',
    ],
    inputSchema: z.object({
      email: z.string().email(),
    }),
    cliMappings: {
      options: [
        { field: 'email', flags: '--email <email>', description: 'Email address to look up host for' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/email-host-lookup', { email: input.email }),
  },
];
