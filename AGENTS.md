# AI Agent Guide — EmailGuard CLI

> Complete reference for AI agents using `emailguard-cli` as a CLI tool or MCP server.

---

## Quick Start

```bash
npm install -g emailguard-cli

# Option 1: Authenticate with email + password (saves token)
emailguard login --email you@company.com --password yourpassword

# Option 2: Use a pre-generated API token from dashboard
emailguard login --api-key "5|YourTokenHere"

# Option 3: Environment variable (best for agents)
export EMAILGUARD_API_KEY="5|YourTokenHere"

# Verify
emailguard status
emailguard domains list --pretty
```

Get your API token from: **https://app.emailguard.io/api-settings** → Developer API tab → Add New API Token

---

## Authentication

**3-tier resolution (highest to lowest priority):**

1. `--api-key <token>` flag on any command
2. `EMAILGUARD_API_KEY` environment variable ← **use this for agents**
3. Stored config at `~/.emailguard-cli/config.json` (saved by `emailguard login`)

**For agents:** Always set `EMAILGUARD_API_KEY`. Never use interactive login in automation.

**API:** Base URL `https://app.emailguard.io`, all endpoints at `/api/v1/`. Bearer token auth.

---

## Output Format

All commands output **compact JSON** by default (machine-readable). Global flags:

| Flag | Effect |
|---|---|
| `--pretty` | Pretty-printed JSON |
| `--output pretty` | Same as `--pretty` |
| `--quiet` | Suppress output (exit codes only) |
| `--fields a,b.c` | Filter to specific fields (dot notation for nested) |

**Error format:**
```json
{"error": "Not authenticated", "code": "AUTH_ERROR"}
```

Exit code `1` on error, `0` on success.

---

## Discovering Commands

```bash
emailguard --help                          # All groups
emailguard <group> --help                  # All subcommands in group
emailguard <group> <subcommand> --help     # Full options + examples
```

---

## All Command Groups

### `emailguard login`
Authenticate with EmailGuard.
```bash
emailguard login --email you@co.com --password pass   # Login with credentials
emailguard login --api-key "5|token"                   # Store pre-generated token
emailguard logout                                       # Clear stored credentials
emailguard status                                       # Show auth state + account info
```

---

### `emailguard account`
Manage your user account.

| Subcommand | Description |
|---|---|
| `get` | Get current user details |
| `update-profile` | Update display name |
| `update-password` | Change account password |

```bash
emailguard account get --pretty
emailguard account update-profile --name "Jane Doe"
emailguard account update-password --current "old" --new "new" --confirm "new"
```

---

### `emailguard workspaces`
Manage workspaces and team members.

| Subcommand | Description |
|---|---|
| `list` | List all workspaces |
| `current` | Get currently active workspace |
| `create` | Create a new workspace |
| `switch` | Switch active workspace by UUID |
| `update` | Update workspace name |
| `invite-member` | Invite team member by email |
| `update-member` | Update team member role |
| `remove-member` | Remove team member |

```bash
emailguard workspaces list --pretty
emailguard workspaces current
emailguard workspaces create --name "Client ABC"
emailguard workspaces switch --uuid abc-123
emailguard workspaces invite-member --email jane@acme.com --role member
emailguard workspaces remove-member <user-id>
```

---

### `emailguard domains`
Manage domains and DNS authentication records.

| Subcommand | Description |
|---|---|
| `list` | List all domains in workspace |
| `get <uuid>` | Get domain details |
| `add` | Add a domain |
| `delete <uuid>` | Delete a domain |
| `patch-spf <uuid>` | Refresh SPF record status |
| `patch-dkim <uuid>` | Update DKIM selectors |
| `patch-dmarc <uuid>` | Refresh DMARC record status |

```bash
emailguard domains list --pretty
emailguard domains add --name example.com
emailguard domains get <uuid>
emailguard domains patch-dkim <uuid> --selectors "google,sendgrid"
emailguard domains delete <uuid>
```

---

### `emailguard email-accounts`
Manage email accounts connected to a workspace.

| Subcommand | Description |
|---|---|
| `list` | List all email accounts |
| `get <id>` | Get account details |
| `add` | Add account via IMAP/SMTP |
| `delete <uuid>` | Delete an email account |
| `test-imap` | Test IMAP connection |
| `test-smtp` | Test SMTP connection |
| `reputation-builder` | Get a random warm-up seed account |

```bash
emailguard email-accounts list --pretty
emailguard email-accounts test-imap --host imap.gmail.com --port 993 --username you@g.com --password pass
emailguard email-accounts add --name "Work" --imap-host imap.gmail.com --imap-port 993 --imap-username you@g.com --imap-password pass --smtp-host smtp.gmail.com --smtp-port 587 --smtp-username you@g.com --smtp-password pass
emailguard email-accounts delete <uuid>
```

---

### `emailguard contacts`
Contact list verification (upload CSV lists for email validation).

| Subcommand | Description |
|---|---|
| `list` | List all uploaded contact lists |
| `get <uuid>` | Get upload status + details |
| `upload` | Initiate a contact list upload (see dashboard for file uploads) |
| `download <uuid>` | Download verified results |

```bash
emailguard contacts list --pretty
emailguard contacts get <uuid>
emailguard contacts download <uuid>
```

---

### `emailguard blacklist`
Blacklist monitoring and ad-hoc checks against 100+ databases.

| Subcommand | Description |
|---|---|
| `list-domains` | List monitored domains |
| `list-accounts` | List monitored email accounts |
| `check` | Ad-hoc check for a domain or IP |
| `get <id>` | Get check result by ID |

```bash
emailguard blacklist list-domains --pretty
emailguard blacklist check --domain example.com
emailguard blacklist check --domain 1.2.3.4 --pretty
emailguard blacklist get <id>
```

---

### `emailguard surbl`
SURBL (Spam URL Real-time Blocklist) checks.

| Subcommand | Description |
|---|---|
| `list-domains` | List monitored domains |
| `check` | Run a SURBL check for a domain |
| `get <uuid>` | Get check result by UUID |

```bash
emailguard surbl check --domain example.com --pretty
emailguard surbl get <uuid>
```

---

### `emailguard dmarc`
DMARC report analytics.

| Subcommand | Description |
|---|---|
| `list` | List DMARC reports for workspace |
| `insights <domain-uuid>` | Get report statistics/insights |
| `sources <domain-uuid>` | Get sending sources |
| `failures <domain-uuid>` | Get failure records |

```bash
emailguard dmarc list --pretty
emailguard dmarc insights <domain-uuid> --start 2024-01-01 --end 2024-01-31
emailguard dmarc sources <domain-uuid>
emailguard dmarc failures <domain-uuid> --pretty
```

---

### `emailguard dns`
Email authentication DNS record tools (SPF, DKIM, DMARC).

| Subcommand | Description |
|---|---|
| `spf-lookup` | Look up SPF record for a domain |
| `spf-wizard` | Generate SPF via provider list |
| `spf-raw` | Generate raw SPF record |
| `dkim-lookup` | Look up DKIM record (domain + selector) |
| `dkim-generate` | Generate a DKIM key pair |
| `dmarc-lookup` | Look up DMARC record |
| `dmarc-connected` | Generate DMARC for connected domain |
| `dmarc-external` | Generate DMARC for any domain |

```bash
emailguard dns spf-lookup --domain example.com
emailguard dns spf-wizard --providers "google,sendgrid,mailchimp"
emailguard dns dkim-lookup --domain example.com --selector google
emailguard dns dkim-generate --key-length 2048
emailguard dns dmarc-lookup --domain example.com
emailguard dns dmarc-external --domain example.com --policy quarantine --rua mailto:dmarc@example.com
```

---

### `emailguard spam-check`
Content spam analysis (162-point scoring system).

| Subcommand | Description |
|---|---|
| `check` | Submit email content for spam scoring |

```bash
emailguard spam-check check --content "Subject: Buy now! Limited offer!!!"
emailguard spam-check check --content "$(cat email-body.html)" --pretty
```

Response includes: spam score + top trigger words with counts.

---

### `emailguard inbox-tests`
Inbox placement testing (tests where emails land across providers).

| Subcommand | Description |
|---|---|
| `list` | List all inbox placement tests |
| `create` | Create test → returns unique phrase + seed addresses |
| `get <id>` | Get results (inbox/spam/promotions per provider) |

**Workflow:**
1. `emailguard inbox-tests create --name "Campaign test"` → get unique phrase + seed addresses
2. Send your email to the seed addresses, include the unique phrase in the subject/body
3. `emailguard inbox-tests get <id>` → see placement results per provider

```bash
emailguard inbox-tests create --name "Cold outreach A/B test" --pretty
emailguard inbox-tests get <id> --pretty
emailguard inbox-tests list
```

---

### `emailguard spam-filter`
Spam filter tests (similar to inbox tests, different test mechanism).

| Subcommand | Description |
|---|---|
| `list` | List all spam filter tests |
| `create` | Create a new spam filter test |
| `get <uuid>` | Get test results |

```bash
emailguard spam-filter create --name "Newsletter test"
emailguard spam-filter get <uuid> --pretty
```

---

### `emailguard redirects`
Hosted domain redirect rules (managed SSL included).

| Subcommand | Description |
|---|---|
| `get-ip` | Get the redirect server IP |
| `list` | List all redirect rules |
| `create` | Create a redirect rule |
| `get <id>` | Get redirect details |
| `delete <uuid>` | Delete a redirect rule |

```bash
emailguard redirects get-ip
emailguard redirects create --domain links.example.com --redirect https://example.com
emailguard redirects list --pretty
emailguard redirects delete <uuid>
```

---

### `emailguard proxy`
Domain masking proxy — routes secondary domains through clean IPs.

| Subcommand | Description |
|---|---|
| `get-ip` | Get the proxy server IP |
| `list` | List all proxy configurations |
| `create` | Create a domain masking proxy |
| `get <uuid>` | Get proxy details |
| `delete <uuid>` | Delete a proxy |

```bash
emailguard proxy get-ip
emailguard proxy create --masking-domain links.secondary.com --primary-domain primary.com
emailguard proxy list --pretty
```

---

### `emailguard lookup`
Infrastructure lookup tools.

| Subcommand | Description |
|---|---|
| `domain` | Look up hosting provider for a domain |
| `email` | Look up email hosting provider for an address |

```bash
emailguard lookup domain --domain example.com --pretty
emailguard lookup email --email user@example.com --pretty
```

---

### `emailguard spamhaus`
Spamhaus Intelligence — 5 reputation check types.

| Subcommand | Description |
|---|---|
| `domain-reputation-check` | Domain reputation score |
| `domain-reputation-list` | List past domain reputation checks |
| `domain-reputation-get <uuid>` | Get specific result |
| `domain-context-check` | Domain context analysis |
| `domain-context-list` / `domain-context-get <uuid>` | List/get |
| `domain-senders-check` | Domain senders check |
| `domain-senders-list` / `domain-senders-get <uuid>` | List/get |
| `a-record-check` | A-record reputation check |
| `a-record-list` / `a-record-get <uuid>` | List/get |
| `nameserver-check` | Nameserver reputation check |
| `nameserver-list` / `nameserver-get <uuid>` | List/get |

```bash
emailguard spamhaus domain-reputation-check --domain example.com --pretty
emailguard spamhaus domain-context-check --domain example.com
emailguard spamhaus a-record-check --domain example.com
emailguard spamhaus nameserver-check --domain example.com
emailguard spamhaus domain-reputation-list
emailguard spamhaus domain-reputation-get <uuid>
```

---

### `emailguard tags`
Manage workspace tags.

| Subcommand | Description |
|---|---|
| `list` | List all tags |
| `create` | Create a tag |
| `get <uuid>` | Get tag details |
| `delete <uuid>` | Delete a tag |

```bash
emailguard tags list --pretty
emailguard tags create --name "Production" --color "#22c55e"
emailguard tags delete <uuid>
```

---

## MCP Server

Start the MCP server on stdio for Claude, Cursor, or any MCP-compatible client:

```bash
# Via CLI command
emailguard mcp

# Via dedicated binary
emailguard-mcp
```

**Claude Desktop config** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "emailguard": {
      "command": "emailguard-mcp",
      "env": {
        "EMAILGUARD_API_KEY": "5|YourTokenHere"
      }
    }
  }
}
```

**Claude Code / Cursor config** (`.mcp.json` or settings):
```json
{
  "mcpServers": {
    "emailguard": {
      "command": "emailguard-mcp",
      "env": {
        "EMAILGUARD_API_KEY": "5|YourTokenHere"
      }
    }
  }
}
```

**MCP tool naming convention:** `{group}_{subcommand}` with hyphens replaced by underscores.
Examples: `domains_list`, `blacklist_check`, `spamhaus_domain_reputation_check`

---

## Common Agent Workflows

### 1. Full domain health check
```bash
# Check SPF, DKIM, DMARC records
emailguard dns spf-lookup --domain example.com --pretty
emailguard dns dkim-lookup --domain example.com --selector google
emailguard dns dmarc-lookup --domain example.com

# Check blacklists
emailguard blacklist check --domain example.com --pretty

# Check SURBL
emailguard surbl check --domain example.com

# Check Spamhaus reputation
emailguard spamhaus domain-reputation-check --domain example.com --pretty
emailguard spamhaus a-record-check --domain example.com
emailguard spamhaus nameserver-check --domain example.com
```

### 2. Set up a new sending domain
```bash
emailguard domains add --name example.com
emailguard domains list --pretty  # get the UUID
emailguard dns spf-wizard --providers "google,sendgrid"
emailguard dns dkim-generate --key-length 2048
emailguard dns dmarc-external --domain example.com --policy quarantine --rua mailto:dmarc@example.com
emailguard blacklist check --domain example.com
```

### 3. Run inbox placement test
```bash
# Create test → note the unique phrase and seed addresses
emailguard inbox-tests create --name "Campaign A" --pretty
# → Send your email to all seed addresses with the phrase in subject
# → Wait 2-5 minutes
emailguard inbox-tests get <id> --pretty
# → See inbox/spam/promotions per provider
```

### 4. Monitor sending infrastructure
```bash
emailguard blacklist list-domains --pretty    # check monitored domains
emailguard blacklist list-accounts --pretty   # check monitored accounts
emailguard dmarc list --pretty               # DMARC report overview
emailguard workspaces current --pretty       # confirm workspace
```

### 5. Spam content analysis
```bash
emailguard spam-check check --content "$(cat subject-and-body.txt)" --pretty
# → Returns: spam_score (lower is better), trigger_words (reduce these)
```

---

## Response Structure

All responses wrap data in a `data` key (standard EmailGuard API format):
```json
{
  "data": { ... }
}
```

or for lists:
```json
{
  "data": [ { ... }, { ... } ]
}
```

Use `--fields data.uuid,data.name` to extract nested fields.

---

## Tips for AI Agents

1. **Always set `EMAILGUARD_API_KEY`** in the environment — never rely on interactive login
2. **Use `--pretty`** when inspecting data interactively; omit for machine parsing
3. **Use `--fields`** to extract only needed data: `--fields data.uuid,data.name`
4. **UUIDs vs IDs:** Most resources use UUID format. The `blacklist get` and `inbox-tests get` use numeric/string IDs
5. **Inbox tests workflow:** Create → send email to seed addresses → wait → get results
6. **DMARC reports** need domain UUID (from `emailguard domains list`), not domain name
7. **MCP tool count:** 86 tools registered. Tool names: `{group}_{subcommand}` (hyphens → underscores)
8. **Rate limits:** Not publicly documented. Use exponential backoff on 429 responses
9. **Parse exit codes:** exit 0 = success, exit 1 = error (check stderr for error JSON)
