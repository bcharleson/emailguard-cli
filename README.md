# emailguard-cli

CLI and MCP server for [EmailGuard](https://emailguard.io) — email deliverability, blacklist monitoring, inbox placement testing, and spam analysis.

## Features

- **86 tools** covering every EmailGuard API endpoint
- **Dual-mode:** Full CLI (`emailguard`) + MCP server (`emailguard-mcp`) from one binary
- **18 command groups:** domains, email-accounts, blacklist, dmarc, dns, inbox-tests, spam-check, spamhaus, and more
- **Agent-native:** JSON output, `--fields`, exit codes, MCP protocol for Claude/Cursor
- **Zero config:** set `EMAILGUARD_API_KEY` and go

## Install

```bash
npm install -g emailguard-cli
```

> **Permission error?** If you get `EACCES`, either run with `sudo` or configure a user-writable npm prefix:
> ```bash
> mkdir -p ~/.npm-global && npm config set prefix ~/.npm-global
> export PATH="$HOME/.npm-global/bin:$PATH"   # add to ~/.zshrc or ~/.bashrc
> npm install -g emailguard-cli
> ```

## Authentication

Get your API token from **https://app.emailguard.io/api-settings** → Developer API → Add New API Token.

```bash
# Option 1: Environment variable (recommended for agents)
export EMAILGUARD_API_KEY="5|YourTokenHere"

# Option 2: Interactive login
emailguard login

# Option 3: Store a pre-generated token
emailguard login --api-key "5|YourTokenHere"
```

## Quick Examples

```bash
# Domain health
emailguard domains list --pretty
emailguard dns spf-lookup --domain example.com
emailguard blacklist check --domain example.com --pretty

# Inbox placement test
emailguard inbox-tests create --name "Campaign A" --pretty
emailguard inbox-tests get <id> --pretty

# Spam content analysis
emailguard spam-check check --content "Subject: Buy now!" --pretty

# Spamhaus intelligence
emailguard spamhaus domain-reputation-check --domain example.com --pretty
```

## MCP Server (AI Agents)

```bash
emailguard mcp        # Start MCP server
emailguard-mcp        # Or via dedicated binary
```

**Claude Desktop config:**
```json
{
  "mcpServers": {
    "emailguard": {
      "command": "emailguard-mcp",
      "env": { "EMAILGUARD_API_KEY": "5|YourTokenHere" }
    }
  }
}
```

## All Command Groups

| Group | Key Commands |
|---|---|
| `account` | get, update-profile, update-password |
| `workspaces` | list, current, create, switch, invite-member |
| `domains` | list, get, add, delete, patch-spf, patch-dkim, patch-dmarc |
| `email-accounts` | list, get, add, delete, test-imap, test-smtp, reputation-builder |
| `contacts` | list, get, upload, download |
| `blacklist` | list-domains, list-accounts, check, get |
| `surbl` | list-domains, check, get |
| `dmarc` | list, insights, sources, failures |
| `dns` | spf-lookup, spf-wizard, dkim-lookup, dkim-generate, dmarc-lookup, dmarc-external |
| `spam-check` | check |
| `inbox-tests` | list, create, get |
| `spam-filter` | list, create, get |
| `redirects` | list, create, get, delete, get-ip |
| `proxy` | list, create, get, delete, get-ip |
| `lookup` | domain, email |
| `spamhaus` | domain-reputation-check/list/get, domain-context-*, domain-senders-*, a-record-*, nameserver-* |
| `tags` | list, create, get, delete |

See [AGENTS.md](./AGENTS.md) for the complete agent reference with all examples and workflows.

## Output Options

```bash
emailguard domains list              # compact JSON (default)
emailguard domains list --pretty     # pretty-printed JSON
emailguard domains list --quiet      # no output, exit code only
emailguard domains list --fields data.uuid,data.name  # filter fields
```

## License

MIT — [github.com/bcharleson/emailguard-cli](https://github.com/bcharleson/emailguard-cli)
