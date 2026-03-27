import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allTagsCommands: CommandDefinition[] = [
  {
    name: 'tags_list',
    group: 'tags',
    subcommand: 'list',
    description: 'List all tags in the current workspace',
    examples: ['emailguard tags list', 'emailguard tags list --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/tags'),
  },
  {
    name: 'tags_create',
    group: 'tags',
    subcommand: 'create',
    description: 'Create a new tag',
    examples: [
      'emailguard tags create --name "Production" --color "#22c55e"',
      'emailguard tags create --name "Staging" --color "#f59e0b"',
    ],
    inputSchema: z.object({
      name: z.string().min(1),
      color: z.string().optional(),
    }),
    cliMappings: {
      options: [
        { field: 'name', flags: '--name <name>', description: 'Tag name' },
        { field: 'color', flags: '--color <color>', description: 'Tag color (hex, e.g., #22c55e)' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/tags', { name: input.name, color: input.color }),
  },
  {
    name: 'tags_get',
    group: 'tags',
    subcommand: 'get',
    description: 'Get details for a specific tag by UUID',
    examples: ['emailguard tags get <uuid>'],
    inputSchema: z.object({
      uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) => client.get(`/api/v1/tags/${input.uuid}`),
  },
  {
    name: 'tags_delete',
    group: 'tags',
    subcommand: 'delete',
    description: 'Delete a tag by UUID',
    examples: ['emailguard tags delete <uuid>'],
    inputSchema: z.object({
      tag_uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'tag_uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) => client.delete(`/api/v1/tags/${input.tag_uuid}`),
  },
];
