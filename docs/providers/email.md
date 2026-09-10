# Email

An agent needs an email address for the same reason a new employee does: almost every third-party service still bootstraps an account, confirms a password reset, or delivers a magic link through email. It is the cheapest form of [Presence](../stack/02-presence.md) and the one that unlocks most of [Authentication](../stack/03-authentication.md). An agent-native email provider treats the inbox as a resource created by API, read by API or webhook, and deleted by API, with no human ever logging into a web client; it also tolerates hundreds of inboxes under one account without treating that as abuse.

The traps are consumer mailboxes and reputation. Gmail, Outlook and similar consumer services forbid automated account creation in their terms and gate API access behind OAuth verification that assumes a human user. Sending from a fresh domain with no warm-up lands in spam. Inbound parsing through a general transactional provider works but the inbox is really a webhook, so the agent has no mailbox to search unless you store messages yourself. Finally, an inbox that receives password resets is a privileged credential in its own right and belongs behind the same controls as any secret in [layer 3](../stack/03-authentication.md).

## Interfaces

- **SMTP + IMAP** - The lowest common denominator; every client library speaks it. IMAP IDLE gives near-real-time receive. Fine for self-hosted servers; most API-first providers do not expose IMAP.
- **JMAP** ([RFC 8620](https://www.rfc-editor.org/rfc/rfc8620), [RFC 8621](https://www.rfc-editor.org/rfc/rfc8621)) - JSON over HTTP with push, batching and a coherent object model; far easier for an agent than IMAP. Fastmail and Stalwart implement it.
- **REST + webhooks** - Send by POST, receive by webhook with the parsed message. The dominant pattern for transactional providers; the agent must persist mail itself if it wants history.
- **MCP server** - A vendor-maintained server exposing `send`, `list_messages`, `reply` as tools. AgentMail, Resend and Mailgun ship one; it removes the SDK from the agent's code and moves credentials to the MCP host.
- **Inbound routing rules** - Provider-side filters that fan a wildcard address (`*@agent.example.com`) into per-task inboxes or webhooks, which is how one domain serves many agents.

## Providers

| Provider | Agent-native | OSS | Pricing | Notes |
|---|---|---|---|---|
| [AgentMail](https://www.agentmail.to) | Yes | No | Usage-based | Inboxes created per agent by API; SDK, webhooks and MCP server; built for programmatic signup flows. |
| [Resend](https://resend.com) | Usable | Partial | Free tier | Send API plus inbound webhooks; official MCP server; domain-level DKIM/SPF setup by API. |
| [Postmark](https://postmarkapp.com) | Usable | No | Paid | Transactional send with inbound parse to webhook; strict sending-quality rules help deliverability. |
| [Mailgun](https://www.mailgun.com) | Usable | No | Free tier | Routes match inbound mail to webhooks or forwarding; MCP server available. |
| [Fastmail](https://www.fastmail.com/developer/) | Usable | No | Paid | Full JMAP mailbox with aliases and masked addresses; a real inbox with search, at the cost of a human-shaped account. |
| [MailSlurp](https://www.mailslurp.com) | Usable | Partial | Free tier | Programmatic disposable and persistent inboxes with REST API; originally for test automation, works for agents. |
| [Mailtrap](https://mailtrap.io) | Usable | No | Free tier | Sandbox inboxes for testing plus production sending API. |
| [Gmail API](https://developers.google.com/workspace/gmail/api) | Usable | No | n/a | Only via an existing Google Workspace account owned by a human or organisation; automated account creation is disallowed by Google's terms; OAuth app verification required for restricted scopes. |
| [Stalwart](https://stalw.art) | Usable | Yes | OSS + cloud | Self-hosted server with JMAP, IMAP, SMTP and a management REST API; the strongest self-hosted option for an agent that needs a real mailbox. |
| [Maddy](https://maddy.email) | Usable | Yes | n/a | Single-binary SMTP/IMAP server; minimal, no JMAP. |
| [Mailpit](https://mailpit.axllent.org) | Usable | Yes | n/a | Development mail catcher with REST API; use for local testing, not production. |

## Resources

- [AgentMail docs](https://docs.agentmail.to) - Inbox lifecycle, webhooks and MCP setup.
- [Resend docs](https://resend.com/docs) - Sending, receiving and domain verification.
- [Postmark developer docs](https://postmarkapp.com/developer) - Inbound processing and message streams.
- [Mailgun documentation](https://documentation.mailgun.com/) - Routes and inbound message parsing.
- [Fastmail developer](https://www.fastmail.com/developer/) - JMAP API tokens and endpoints.
- [Stalwart documentation](https://stalw.art/docs/) - Deployment, JMAP and management API.
- [RFC 8620 JMAP Core](https://www.rfc-editor.org/rfc/rfc8620) - The protocol most worth learning if you self-host.
- [Gmail API usage policy](https://developers.google.com/workspace/gmail/api/guides) - Scope restrictions and verification requirements.

## Related

- [2. Presence](../stack/02-presence.md) - The layer this chapter fills; `spec.presence.email`.
- [3. Authentication](../stack/03-authentication.md) - Why the inbox is itself a credential.
- [Domains & DNS](domains.md) - SPF, DKIM and MX records the inbox depends on.
- [Phone, SMS & Voice](phone.md) - The other verification channel, and the harder one.
- [Discovery standards](../standards/discovery.md) - Where an agent's contact address is published.
