import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allContactsCommands: CommandDefinition[] = [
  {
    name: 'contacts_list',
    group: 'contacts',
    subcommand: 'list',
    description: 'List all contact verification uploads in the current workspace',
    examples: ['emailguard contacts list', 'emailguard contacts list --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/contact-verification'),
  },
  {
    name: 'contacts_get',
    group: 'contacts',
    subcommand: 'get',
    description: 'Get the status and details of a specific contact list upload',
    examples: ['emailguard contacts get <uuid>', 'emailguard contacts get <uuid> --pretty'],
    inputSchema: z.object({
      contact_list_uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'contact_list_uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.get(`/api/v1/contact-verification/show/${input.contact_list_uuid}`),
  },
  {
    name: 'contacts_upload',
    group: 'contacts',
    subcommand: 'upload',
    description: 'Upload a contact list for email verification (multipart form data — use the dashboard for file uploads; this initiates a verification job)',
    examples: ['emailguard contacts upload'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) =>
      client.post('/api/v1/contact-verification'),
  },
  {
    name: 'contacts_download',
    group: 'contacts',
    subcommand: 'download',
    description: 'Download the verified results for a contact list',
    examples: ['emailguard contacts download <uuid>'],
    inputSchema: z.object({
      contact_list_uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'contact_list_uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.get(`/api/v1/contact-verification/download/${input.contact_list_uuid}`),
  },
];
