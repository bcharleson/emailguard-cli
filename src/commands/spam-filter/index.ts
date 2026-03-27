import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allSpamFilterCommands: CommandDefinition[] = [
  {
    name: 'spam_filter_list',
    group: 'spam-filter',
    subcommand: 'list',
    description: 'List all spam filter tests in the current workspace',
    examples: ['emailguard spam-filter list', 'emailguard spam-filter list --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/spam-filter-tests'),
  },
  {
    name: 'spam_filter_create',
    group: 'spam-filter',
    subcommand: 'create',
    description: 'Create a new spam filter test',
    examples: ['emailguard spam-filter create --name "Cold outreach filter test"'],
    inputSchema: z.object({
      name: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'name', flags: '--name <name>', description: 'Test name/label' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/spam-filter-tests', { name: input.name }),
  },
  {
    name: 'spam_filter_get',
    group: 'spam-filter',
    subcommand: 'get',
    description: 'Get the results of a specific spam filter test by UUID',
    examples: ['emailguard spam-filter get <uuid>', 'emailguard spam-filter get <uuid> --pretty'],
    inputSchema: z.object({
      uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.get(`/api/v1/spam-filter-tests/${input.uuid}`),
  },
];
