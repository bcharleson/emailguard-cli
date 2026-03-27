import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allInboxTestsCommands: CommandDefinition[] = [
  {
    name: 'inbox_tests_list',
    group: 'inbox-tests',
    subcommand: 'list',
    description: 'List all inbox placement tests in the current workspace',
    examples: ['emailguard inbox-tests list', 'emailguard inbox-tests list --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/inbox-placement-tests'),
  },
  {
    name: 'inbox_tests_create',
    group: 'inbox-tests',
    subcommand: 'create',
    description: 'Create a new inbox placement test. Returns a unique phrase and seed email addresses to send your test email to.',
    examples: [
      'emailguard inbox-tests create --name "Campaign A test"',
      'emailguard inbox-tests create --name "Newsletter test" --pretty',
    ],
    inputSchema: z.object({
      name: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'name', flags: '--name <name>', description: 'Test name/label' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/inbox-placement-tests', { name: input.name }),
  },
  {
    name: 'inbox_tests_get',
    group: 'inbox-tests',
    subcommand: 'get',
    description: 'Get results of a specific inbox placement test by ID (shows inbox/spam placement per provider)',
    examples: [
      'emailguard inbox-tests get <id>',
      'emailguard inbox-tests get <id> --pretty',
    ],
    inputSchema: z.object({
      id: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'id', name: 'id', required: true }],
    },
    handler: async (input, client) => client.get(`/api/v1/inbox-placement-tests/${input.id}`),
  },
];
