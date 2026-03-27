import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allSpamhausCommands: CommandDefinition[] = [
  // --- Domain Reputation ---
  {
    name: 'spamhaus_domain_reputation_list',
    group: 'spamhaus',
    subcommand: 'domain-reputation-list',
    description: 'List all Spamhaus domain reputation checks',
    examples: ['emailguard spamhaus domain-reputation-list', 'emailguard spamhaus domain-reputation-list --pretty'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) =>
      client.get('/api/v1/spamhaus-intelligence/domain-reputation'),
  },
  {
    name: 'spamhaus_domain_reputation_check',
    group: 'spamhaus',
    subcommand: 'domain-reputation-check',
    description: 'Run a Spamhaus domain reputation check for a domain',
    examples: [
      'emailguard spamhaus domain-reputation-check --domain example.com',
      'emailguard spamhaus domain-reputation-check --domain acme.com --pretty',
    ],
    inputSchema: z.object({
      domain: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'domain', flags: '--domain <domain>', description: 'Domain to check' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/spamhaus-intelligence/domain-reputation/create', { domain: input.domain }),
  },
  {
    name: 'spamhaus_domain_reputation_get',
    group: 'spamhaus',
    subcommand: 'domain-reputation-get',
    description: 'Get the result of a specific Spamhaus domain reputation check by UUID',
    examples: ['emailguard spamhaus domain-reputation-get <uuid>'],
    inputSchema: z.object({
      uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.get(`/api/v1/spamhaus-intelligence/domain-reputation/${input.uuid}`),
  },

  // --- Domain Context ---
  {
    name: 'spamhaus_domain_context_list',
    group: 'spamhaus',
    subcommand: 'domain-context-list',
    description: 'List all Spamhaus domain context checks',
    examples: ['emailguard spamhaus domain-context-list'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) =>
      client.get('/api/v1/spamhaus-intelligence/domain-contexts'),
  },
  {
    name: 'spamhaus_domain_context_check',
    group: 'spamhaus',
    subcommand: 'domain-context-check',
    description: 'Run a Spamhaus domain context check for a domain',
    examples: ['emailguard spamhaus domain-context-check --domain example.com'],
    inputSchema: z.object({
      domain: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'domain', flags: '--domain <domain>', description: 'Domain to check' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/spamhaus-intelligence/domain-contexts/create', { domain: input.domain }),
  },
  {
    name: 'spamhaus_domain_context_get',
    group: 'spamhaus',
    subcommand: 'domain-context-get',
    description: 'Get the result of a specific Spamhaus domain context check by UUID',
    examples: ['emailguard spamhaus domain-context-get <uuid>'],
    inputSchema: z.object({
      uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.get(`/api/v1/spamhaus-intelligence/domain-contexts/${input.uuid}`),
  },

  // --- Domain Senders ---
  {
    name: 'spamhaus_domain_senders_list',
    group: 'spamhaus',
    subcommand: 'domain-senders-list',
    description: 'List all Spamhaus domain sender checks',
    examples: ['emailguard spamhaus domain-senders-list'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) =>
      client.get('/api/v1/spamhaus-intelligence/domain-senders'),
  },
  {
    name: 'spamhaus_domain_senders_check',
    group: 'spamhaus',
    subcommand: 'domain-senders-check',
    description: 'Run a Spamhaus domain senders check for a domain',
    examples: ['emailguard spamhaus domain-senders-check --domain example.com'],
    inputSchema: z.object({
      domain: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'domain', flags: '--domain <domain>', description: 'Domain to check' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/spamhaus-intelligence/domain-senders/create', { domain: input.domain }),
  },
  {
    name: 'spamhaus_domain_senders_get',
    group: 'spamhaus',
    subcommand: 'domain-senders-get',
    description: 'Get the result of a specific Spamhaus domain senders check by UUID',
    examples: ['emailguard spamhaus domain-senders-get <uuid>'],
    inputSchema: z.object({
      uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.get(`/api/v1/spamhaus-intelligence/domain-senders/${input.uuid}`),
  },

  // --- A-Record Reputation ---
  {
    name: 'spamhaus_a_record_list',
    group: 'spamhaus',
    subcommand: 'a-record-list',
    description: 'List all Spamhaus A-record reputation checks',
    examples: ['emailguard spamhaus a-record-list'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) =>
      client.get('/api/v1/spamhaus-intelligence/a-record-reputation'),
  },
  {
    name: 'spamhaus_a_record_check',
    group: 'spamhaus',
    subcommand: 'a-record-check',
    description: 'Run a Spamhaus A-record reputation check for a domain',
    examples: ['emailguard spamhaus a-record-check --domain example.com'],
    inputSchema: z.object({
      domain: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'domain', flags: '--domain <domain>', description: 'Domain to check' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/spamhaus-intelligence/a-record-reputation/create', { domain: input.domain }),
  },
  {
    name: 'spamhaus_a_record_get',
    group: 'spamhaus',
    subcommand: 'a-record-get',
    description: 'Get the result of a specific Spamhaus A-record check by UUID',
    examples: ['emailguard spamhaus a-record-get <uuid>'],
    inputSchema: z.object({
      uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.get(`/api/v1/spamhaus-intelligence/a-record-reputation/${input.uuid}`),
  },

  // --- Nameserver Reputation ---
  {
    name: 'spamhaus_nameserver_list',
    group: 'spamhaus',
    subcommand: 'nameserver-list',
    description: 'List all Spamhaus nameserver reputation checks',
    examples: ['emailguard spamhaus nameserver-list'],
    inputSchema: z.object({}),
    cliMappings: {},
    handler: async (_input, client) =>
      client.get('/api/v1/spamhaus-intelligence/nameserver-reputation'),
  },
  {
    name: 'spamhaus_nameserver_check',
    group: 'spamhaus',
    subcommand: 'nameserver-check',
    description: 'Run a Spamhaus nameserver reputation check for a domain',
    examples: ['emailguard spamhaus nameserver-check --domain example.com'],
    inputSchema: z.object({
      domain: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'domain', flags: '--domain <domain>', description: 'Domain to check' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/spamhaus-intelligence/nameserver-reputation/create', { domain: input.domain }),
  },
  {
    name: 'spamhaus_nameserver_get',
    group: 'spamhaus',
    subcommand: 'nameserver-get',
    description: 'Get the result of a specific Spamhaus nameserver check by UUID',
    examples: ['emailguard spamhaus nameserver-get <uuid>'],
    inputSchema: z.object({
      uuid: z.string().min(1),
    }),
    cliMappings: {
      args: [{ field: 'uuid', name: 'uuid', required: true }],
    },
    handler: async (input, client) =>
      client.get(`/api/v1/spamhaus-intelligence/nameserver-reputation/${input.uuid}`),
  },
];
