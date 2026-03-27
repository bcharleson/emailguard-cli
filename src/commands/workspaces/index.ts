import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allWorkspacesCommands: CommandDefinition[] = [
  {
    name: 'workspaces_list',
    group: 'workspaces',
    subcommand: 'list',
    description: 'List all workspaces for the current account',
    examples: ['emailguard workspaces list', 'emailguard workspaces list --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/workspaces'),
  },
  {
    name: 'workspaces_current',
    group: 'workspaces',
    subcommand: 'current',
    description: 'Get the currently active workspace',
    examples: ['emailguard workspaces current', 'emailguard workspaces current --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/workspaces/current'),
  },
  {
    name: 'workspaces_create',
    group: 'workspaces',
    subcommand: 'create',
    description: 'Create a new workspace',
    examples: ['emailguard workspaces create --name "Acme Corp"'],
    inputSchema: z.object({
      name: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'name', flags: '--name <name>', description: 'Workspace name' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/workspaces', { name: input.name }),
  },
  {
    name: 'workspaces_switch',
    group: 'workspaces',
    subcommand: 'switch',
    description: 'Switch to a different workspace by UUID',
    examples: ['emailguard workspaces switch --uuid abc-123'],
    inputSchema: z.object({
      uuid: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'uuid', flags: '--uuid <uuid>', description: 'Workspace UUID' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/workspaces/switch-workspace', { uuid: input.uuid }),
  },
  {
    name: 'workspaces_update',
    group: 'workspaces',
    subcommand: 'update',
    description: 'Update a workspace name',
    examples: ['emailguard workspaces update --team-id abc-123 --name "New Name"'],
    inputSchema: z.object({
      team_id: z.string().min(1),
      name: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'team_id', name: 'team-id', required: true }],
      options: [
        { field: 'name', flags: '--name <name>', description: 'New workspace name' },
      ],
    },
    handler: async (input, client) =>
      client.put(`/api/v1/workspaces/${input.team_id}`, { name: input.name }),
  },
  {
    name: 'workspaces_invite_member',
    group: 'workspaces',
    subcommand: 'invite-member',
    description: 'Invite a team member to the current workspace by email',
    examples: [
      'emailguard workspaces invite-member --email jane@acme.com --role member',
      'emailguard workspaces invite-member --email admin@acme.com --role admin',
    ],
    inputSchema: z.object({
      email: z.string().email(),
      role: z.string().optional(),
    }),
    cliMappings: {
      options: [
        { field: 'email', flags: '--email <email>', description: 'Team member email' },
        { field: 'role', flags: '--role <role>', description: 'Member role (e.g., member, admin)' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/workspaces/invite-members', { email: input.email, role: input.role }),
  },
  {
    name: 'workspaces_update_member',
    group: 'workspaces',
    subcommand: 'update-member',
    description: 'Update a workspace team member role',
    examples: ['emailguard workspaces update-member <user-id> --role admin'],
    inputSchema: z.object({
      user_id: z.string().min(1),
      role: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'user_id', name: 'user-id', required: true }],
      options: [
        { field: 'role', flags: '--role <role>', description: 'New role for the member' },
      ],
    },
    handler: async (input, client) =>
      client.put(`/api/v1/workspaces/members/${input.user_id}`, { role: input.role }),
  },
  {
    name: 'workspaces_remove_member',
    group: 'workspaces',
    subcommand: 'remove-member',
    description: 'Remove a team member from the current workspace',
    examples: ['emailguard workspaces remove-member <user-id>'],
    inputSchema: z.object({
      user_id: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'user_id', name: 'user-id', required: true }],
    },
    handler: async (input, client) =>
      client.delete(`/api/v1/workspaces/members/${input.user_id}`),
  },
];
