import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allDmarcCommands: CommandDefinition[] = [
  {
    name: 'dmarc_list',
    group: 'dmarc',
    subcommand: 'list',
    description: 'List all DMARC reports for domains in the current workspace',
    examples: ['emailguard dmarc list', 'emailguard dmarc list --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/dmarc-reports'),
  },
  {
    name: 'dmarc_insights',
    group: 'dmarc',
    subcommand: 'insights',
    description: 'Get DMARC report insights/statistics for a domain over a date range',
    examples: [
      'emailguard dmarc insights <domain-uuid> --start 2024-01-01 --end 2024-01-31',
      'emailguard dmarc insights <domain-uuid> --pretty',
    ],
    inputSchema: z.object({
      domain_uuid: z.string().min(1),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
    }),
    cliMappings: {
      args: [{ field: 'domain_uuid', name: 'domain-uuid', required: true }],
      options: [
        { field: 'start_date', flags: '--start <date>', description: 'Start date (YYYY-MM-DD)' },
        { field: 'end_date', flags: '--end <date>', description: 'End date (YYYY-MM-DD)' },
      ],
    },
    handler: async (input, client) =>
      client.get(`/api/v1/dmarc-reports/domains/${input.domain_uuid}/insights`, {
        start_date: input.start_date,
        end_date: input.end_date,
      }),
  },
  {
    name: 'dmarc_sources',
    group: 'dmarc',
    subcommand: 'sources',
    description: 'Get DMARC sending sources for a domain over a date range',
    examples: ['emailguard dmarc sources <domain-uuid> --start 2024-01-01 --end 2024-01-31'],
    inputSchema: z.object({
      domain_uuid: z.string().min(1),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
    }),
    cliMappings: {
      args: [{ field: 'domain_uuid', name: 'domain-uuid', required: true }],
      options: [
        { field: 'start_date', flags: '--start <date>', description: 'Start date (YYYY-MM-DD)' },
        { field: 'end_date', flags: '--end <date>', description: 'End date (YYYY-MM-DD)' },
      ],
    },
    handler: async (input, client) =>
      client.get(`/api/v1/dmarc-reports/domains/${input.domain_uuid}/dmarc-sources`, {
        start_date: input.start_date,
        end_date: input.end_date,
      }),
  },
  {
    name: 'dmarc_failures',
    group: 'dmarc',
    subcommand: 'failures',
    description: 'Get DMARC failure records for a domain over a date range',
    examples: ['emailguard dmarc failures <domain-uuid> --start 2024-01-01 --end 2024-01-31'],
    inputSchema: z.object({
      domain_uuid: z.string().min(1),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
    }),
    cliMappings: {
      args: [{ field: 'domain_uuid', name: 'domain-uuid', required: true }],
      options: [
        { field: 'start_date', flags: '--start <date>', description: 'Start date (YYYY-MM-DD)' },
        { field: 'end_date', flags: '--end <date>', description: 'End date (YYYY-MM-DD)' },
      ],
    },
    handler: async (input, client) =>
      client.get(`/api/v1/dmarc-reports/domains/${input.domain_uuid}/dmarc-failures`, {
        start_date: input.start_date,
        end_date: input.end_date,
      }),
  },
];
