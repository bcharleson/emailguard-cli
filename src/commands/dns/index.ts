import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

export const allDnsCommands: CommandDefinition[] = [
  {
    name: 'dns_spf_lookup',
    group: 'dns',
    subcommand: 'spf-lookup',
    description: 'Look up the SPF record for a domain',
    examples: [
      'emailguard dns spf-lookup --domain example.com',
      'emailguard dns spf-lookup --domain acme.com --pretty',
    ],
    inputSchema: z.object({
      domain: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'domain', flags: '--domain <domain>', description: 'Domain to look up SPF for' },
      ],
    },
    handler: async (input, client) =>
      client.get('/api/v1/email-authentication/spf-lookup', { domain: input.domain }),
  },
  {
    name: 'dns_spf_wizard',
    group: 'dns',
    subcommand: 'spf-wizard',
    description: 'Generate an SPF record using the wizard (provide provider list)',
    examples: [
      'emailguard dns spf-wizard --providers "google,sendgrid,mailchimp"',
    ],
    inputSchema: z.object({
      providers: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'providers', flags: '--providers <list>', description: 'Comma-separated list of email providers (e.g., google,sendgrid)' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/email-authentication/spf-generator-wizard', {
        providers: input.providers.split(',').map((p: string) => p.trim()).filter(Boolean),
      }),
  },
  {
    name: 'dns_spf_raw',
    group: 'dns',
    subcommand: 'spf-raw',
    description: 'Generate a raw SPF record with full parameter control. Use --tag and --value together to add a single SPF mechanism (e.g., --tag ip4 --value 1.2.3.4). Use --failure-policy to set the qualifier (~all, -all, ?all, +all). For provider-based generation prefer spf-wizard.',
    examples: [
      'emailguard dns spf-raw --failure-policy ~all',
      'emailguard dns spf-raw --tag ip4 --value 203.0.113.0/24 --failure-policy -all',
      'emailguard dns spf-raw --tag include --value sendgrid.net --failure-policy ~all',
    ],
    inputSchema: z.object({
      redirect: z.boolean().optional(),
      redirect_url: z.string().optional(),
      failure_policy: z.string().optional(),
      tag: z.string().optional(),
      value: z.string().optional(),
    }),
    cliMappings: {
      options: [
        { field: 'redirect', flags: '--redirect', description: 'Enable SPF redirect modifier (boolean flag; pair with --redirect-url)' },
        { field: 'redirect_url', flags: '--redirect-url <url>', description: 'Redirect target domain (used when --redirect is set)' },
        { field: 'failure_policy', flags: '--failure-policy <policy>', description: 'Failure policy (~all, -all, ?all, +all)' },
        { field: 'tag', flags: '--tag <tag>', description: 'SPF mechanism tag (e.g., ip4, include, a, mx)' },
        { field: 'value', flags: '--value <value>', description: 'SPF mechanism value (e.g., 203.0.113.0/24, sendgrid.net)' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/email-authentication/spf-raw-generator', {
        redirect: input.redirect === true,
        redirect_url: input.redirect_url ?? '',
        failure_policy: input.failure_policy,
        tag: input.tag,
        value: input.value,
      }),
  },
  {
    name: 'dns_dkim_lookup',
    group: 'dns',
    subcommand: 'dkim-lookup',
    description: 'Look up the DKIM record for a domain and selector',
    examples: [
      'emailguard dns dkim-lookup --domain example.com --selector google',
      'emailguard dns dkim-lookup --domain acme.com --selector s1 --pretty',
    ],
    inputSchema: z.object({
      domain: z.string().min(1),
      selector: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'domain', flags: '--domain <domain>', description: 'Domain to look up DKIM for' },
        { field: 'selector', flags: '--selector <selector>', description: 'DKIM selector (e.g., google, s1, default)' },
      ],
    },
    handler: async (input, client) =>
      client.get('/api/v1/email-authentication/dkim-lookup', {
        domain: input.domain,
        selector: input.selector,
      }),
  },
  {
    name: 'dns_dkim_generate',
    group: 'dns',
    subcommand: 'dkim-generate',
    description: 'Generate a DKIM key pair',
    examples: [
      'emailguard dns dkim-generate --key-length 2048',
    ],
    inputSchema: z.object({
      keyLength: z.coerce.number().int().optional(),
    }),
    cliMappings: {
      options: [
        { field: 'keyLength', flags: '--key-length <bits>', description: 'Key length in bits (e.g., 1024, 2048)' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/email-authentication/dkim-raw-generator', {
        keyLength: input.keyLength,
      }),
  },
  {
    name: 'dns_dmarc_lookup',
    group: 'dns',
    subcommand: 'dmarc-lookup',
    description: 'Look up the DMARC record for a domain',
    examples: [
      'emailguard dns dmarc-lookup --domain example.com',
      'emailguard dns dmarc-lookup --domain acme.com --pretty',
    ],
    inputSchema: z.object({
      domain: z.string().min(1),
    }),
    cliMappings: {
      options: [
        { field: 'domain', flags: '--domain <domain>', description: 'Domain to look up DMARC for' },
      ],
    },
    handler: async (input, client) =>
      client.get('/api/v1/email-authentication/dmarc-lookup', { domain: input.domain }),
  },
  {
    name: 'dns_dmarc_connected',
    group: 'dns',
    subcommand: 'dmarc-connected',
    description: 'Generate a DMARC record for a domain already added to your EmailGuard workspace (requires --domain-uuid). For domains not in EmailGuard, use dmarc-external instead.',
    examples: [
      'emailguard dns dmarc-connected --domain-uuid abc-123 --policy quarantine',
    ],
    inputSchema: z.object({
      domain_uuid: z.string().min(1),
      policy: z.string().optional(),
    }),
    cliMappings: {
      options: [
        { field: 'domain_uuid', flags: '--domain-uuid <uuid>', description: 'Domain UUID in EmailGuard' },
        { field: 'policy', flags: '--policy <policy>', description: 'DMARC policy (none, quarantine, reject)' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/email-authentication/dmarc-connected-domain', {
        domain_uuid: input.domain_uuid,
        policy: input.policy,
      }),
  },
  {
    name: 'dns_dmarc_external',
    group: 'dns',
    subcommand: 'dmarc-external',
    description: 'Generate a DMARC record for any domain by name (not required to be in EmailGuard). For domains already added to your workspace, use dmarc-connected instead.',
    examples: [
      'emailguard dns dmarc-external --domain example.com --policy quarantine --rua mailto:dmarc@example.com',
    ],
    inputSchema: z.object({
      domain: z.string().min(1),
      policy: z.string().optional(),
      rua: z.string().optional(),
    }),
    cliMappings: {
      options: [
        { field: 'domain', flags: '--domain <domain>', description: 'Domain name' },
        { field: 'policy', flags: '--policy <policy>', description: 'DMARC policy (none, quarantine, reject)' },
        { field: 'rua', flags: '--rua <rua>', description: 'Reporting URI (e.g., mailto:dmarc@example.com)' },
      ],
    },
    handler: async (input, client) =>
      client.post('/api/v1/email-authentication/dmarc-another-domain', {
        domain: input.domain,
        policy: input.policy,
        rua: input.rua,
      }),
  },
];
