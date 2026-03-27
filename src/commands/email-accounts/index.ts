import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allEmailAccountsCommands: CommandDefinition[] = [
  {
    name: 'email_accounts_list',
    group: 'email-accounts',
    subcommand: 'list',
    description: 'List all email accounts in the current workspace',
    examples: ['emailguard email-accounts list', 'emailguard email-accounts list --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) => client.get('/api/v1/email-accounts'),
  },
  {
    name: 'email_accounts_get',
    group: 'email-accounts',
    subcommand: 'get',
    description: 'Get details for a specific email account by ID',
    examples: ['emailguard email-accounts get <id>', 'emailguard email-accounts get <id> --pretty'],
    inputSchema: z.object({
      id: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'id', name: 'id', required: true }],
    },
    handler: async (input, client) => client.get(`/api/v1/email-accounts/${input.id}`),
  },
  {
    name: 'email_accounts_add',
    group: 'email-accounts',
    subcommand: 'add',
    description: 'Add a new email account via IMAP/SMTP credentials',
    examples: [
      'emailguard email-accounts add --name "Work Gmail" --provider google --imap-host imap.gmail.com --imap-port 993 --imap-username you@example.com --imap-password pass --smtp-host smtp.gmail.com --smtp-port 587 --smtp-username you@example.com --smtp-password pass',
    ],
    inputSchema: z.object({
      name: z.string().min(1),
      provider: z.string().optional(),
      imap_username: z.string().min(1),
      imap_password: z.string().min(1),
      imap_host: z.string().min(1),
      imap_port: z.coerce.number().int().positive(),
      imap_tls: z.coerce.boolean().optional(),
      smtp_username: z.string().min(1),
      smtp_password: z.string().min(1),
      smtp_host: z.string().min(1),
      smtp_port: z.coerce.number().int().positive(),
      smtp_tls: z.coerce.boolean().optional(),
    }),
    cliMappings: {
      options: [
        { field: 'name', flags: '--name <name>', description: 'Account name/label' },
        { field: 'provider', flags: '--provider <provider>', description: 'Provider (e.g., google, microsoft, custom)' },
        { field: 'imap_username', flags: '--imap-username <username>', description: 'IMAP username' },
        { field: 'imap_password', flags: '--imap-password <password>', description: 'IMAP password' },
        { field: 'imap_host', flags: '--imap-host <host>', description: 'IMAP host (e.g., imap.gmail.com)' },
        { field: 'imap_port', flags: '--imap-port <port>', description: 'IMAP port (e.g., 993)' },
        { field: 'imap_tls', flags: '--imap-tls', description: 'Enable IMAP TLS' },
        { field: 'smtp_username', flags: '--smtp-username <username>', description: 'SMTP username' },
        { field: 'smtp_password', flags: '--smtp-password <password>', description: 'SMTP password' },
        { field: 'smtp_host', flags: '--smtp-host <host>', description: 'SMTP host (e.g., smtp.gmail.com)' },
        { field: 'smtp_port', flags: '--smtp-port <port>', description: 'SMTP port (e.g., 587)' },
        { field: 'smtp_tls', flags: '--smtp-tls', description: 'Enable SMTP TLS' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/email-accounts/imap-smtp', {
        name: input.name,
        provider: input.provider,
        imap_username: input.imap_username,
        imap_password: input.imap_password,
        imap_host: input.imap_host,
        imap_port: input.imap_port,
        imap_tls: input.imap_tls,
        smtp_username: input.smtp_username,
        smtp_password: input.smtp_password,
        smtp_host: input.smtp_host,
        smtp_port: input.smtp_port,
        smtp_tls: input.smtp_tls,
      }),
  },
  {
    name: 'email_accounts_delete',
    group: 'email-accounts',
    subcommand: 'delete',
    description: 'Delete an email account by UUID',
    examples: ['emailguard email-accounts delete <uuid>'],
    inputSchema: z.object({
      email_account_uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'email_account_uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.delete(`/api/v1/email-accounts/delete/${input.email_account_uuid}`),
  },
  {
    name: 'email_accounts_test_imap',
    group: 'email-accounts',
    subcommand: 'test-imap',
    description: 'Test an IMAP connection with provided credentials',
    examples: [
      'emailguard email-accounts test-imap --host imap.gmail.com --port 993 --username you@example.com --password pass',
    ],
    inputSchema: z.object({
      imap_username: z.string().min(1),
      imap_password: z.string().min(1),
      imap_host: z.string().min(1),
      imap_port: z.coerce.number().int().positive(),
      imap_tls: z.coerce.boolean().optional(),
    }),
    cliMappings: {
      options: [
        { field: 'imap_username', flags: '--username <username>', description: 'IMAP username' },
        { field: 'imap_password', flags: '--password <password>', description: 'IMAP password' },
        { field: 'imap_host', flags: '--host <host>', description: 'IMAP host' },
        { field: 'imap_port', flags: '--port <port>', description: 'IMAP port' },
        { field: 'imap_tls', flags: '--tls', description: 'Enable TLS' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/email-accounts/test-imap-connection', {
        imap_username: input.imap_username,
        imap_password: input.imap_password,
        imap_host: input.imap_host,
        imap_port: input.imap_port,
        imap_tls: input.imap_tls,
      }),
  },
  {
    name: 'email_accounts_test_smtp',
    group: 'email-accounts',
    subcommand: 'test-smtp',
    description: 'Test an SMTP connection with provided credentials',
    examples: [
      'emailguard email-accounts test-smtp --host smtp.gmail.com --port 587 --username you@example.com --password pass',
    ],
    inputSchema: z.object({
      smtp_username: z.string().min(1),
      smtp_password: z.string().min(1),
      smtp_host: z.string().min(1),
      smtp_port: z.coerce.number().int().positive(),
      smtp_tls: z.coerce.boolean().optional(),
    }),
    cliMappings: {
      options: [
        { field: 'smtp_username', flags: '--username <username>', description: 'SMTP username' },
        { field: 'smtp_password', flags: '--password <password>', description: 'SMTP password' },
        { field: 'smtp_host', flags: '--host <host>', description: 'SMTP host' },
        { field: 'smtp_port', flags: '--port <port>', description: 'SMTP port' },
        { field: 'smtp_tls', flags: '--tls', description: 'Enable TLS' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/email-accounts/test-smtp-connection', {
        smtp_username: input.smtp_username,
        smtp_password: input.smtp_password,
        smtp_host: input.smtp_host,
        smtp_port: input.smtp_port,
        smtp_tls: input.smtp_tls,
      }),
  },
  {
    name: 'email_accounts_reputation_builder',
    group: 'email-accounts',
    subcommand: 'reputation-builder',
    description: 'Get a random reputation builder (warm-up seed) email account',
    examples: ['emailguard email-accounts reputation-builder'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) =>
      client.get('/api/v1/email-accounts/reputation-builder-accounts/random'),
  },
];
