import { z } from 'zod';
import { readFileSync } from 'fs';
import { basename } from 'path';
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
    description: 'Upload a CSV file of email addresses for verification. The file should have one email per row (with or without a header).',
    examples: [
      'emailguard contacts upload --file contacts.csv',
      'emailguard contacts upload --file /path/to/emails.csv --pretty',
    ],
    inputSchema: z.object({
      file: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'file', flags: '--file <path>', description: 'Path to CSV file to upload (one email per row)' },
      ],
    },
    handler: async (input, client) => {
      const fileBuffer = readFileSync(input.file);
      const blob = new Blob([fileBuffer], { type: 'text/csv' });
      const formData = new FormData();
      formData.append('contacts', blob, basename(input.file));
      return client.postFormData('/api/v1/contact-verification', formData);
    },
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
