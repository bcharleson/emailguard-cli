import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allSpamCheckCommands: CommandDefinition[] = [
  {
    name: 'spam_check_check',
    group: 'spam-check',
    subcommand: 'check',
    description: 'Submit email content for spam analysis — returns a 162-point spam score and the top trigger words',
    examples: [
      'emailguard spam-check check --content "Subject: Buy now! Act fast!"',
      'emailguard spam-check check --content "$(cat email.html)" --pretty',
    ],
    inputSchema: z.object({
      content: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'content', flags: '--content <text>', description: 'Email body/content to analyze for spam triggers' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/content-spam-check', { content: input.content }),
  },
];
