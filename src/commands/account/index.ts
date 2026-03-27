import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allAccountCommands: CommandDefinition[] = [
  {
    name: 'account_get',
    group: 'account',
    subcommand: 'get',
    description: 'Get current authenticated user account details',
    examples: ['emailguard account get', 'emailguard account get --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/user'),
  },
  {
    name: 'account_update_profile',
    group: 'account',
    subcommand: 'update-profile',
    description: 'Update account profile name',
    examples: ['emailguard account update-profile --name "Jane Doe"'],
    inputSchema: z.object({
      name: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'name', flags: '--name <name>', description: 'New display name' },
      ],
    },
    handler: async (input, client) =>
      client.put('/api/v1/user/profile', { name: input.name }),
  },
  {
    name: 'account_update_password',
    group: 'account',
    subcommand: 'update-password',
    description: 'Update account password',
    examples: ['emailguard account update-password --current "oldpass" --new "newpass" --confirm "newpass"'],
    inputSchema: z.object({
      current_password: z.string().min(1),
      password: z.string().min(1),
      password_confirmation: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'current_password', flags: '--current <password>', description: 'Current password' },
        { field: 'password', flags: '--new <password>', description: 'New password' },
        { field: 'password_confirmation', flags: '--confirm <password>', description: 'Confirm new password' },
      ],
    },
    handler: async (input, client) =>
      client.put('/api/v1/user/password', {
        current_password: input.current_password,
        password: input.password,
        password_confirmation: input.password_confirmation,
      }),
  },
];
