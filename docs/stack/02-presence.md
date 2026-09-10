# 2. Presence

Presence is the set of addresses at which the agent can be found and contacted: an email address, a domain, a phone number, and protocol endpoints. An agent with identity but no presence is a name nobody can write to; presence is what makes it a participant rather than a label.

## What the agent needs

The reason presence sits this low in the stack is that almost every account on the internet is bootstrapped through it. Sign up for an API, a SaaS tool, a registry or a bank and the flow asks for an email address, sends a verification link, and increasingly asks for a phone number and an SMS code. That makes presence a hard dependency of [3. Authentication](03-authentication.md): the agent cannot obtain most credentials until it has an inbox it can read and, often, a number it can receive texts on. Humans never notice this dependency because they already have both.

Agents run into a second problem humans do not: consumer accounts are written for people. Google's [Terms of Service](https://policies.google.com/terms) prohibit creating fake accounts and bypassing sign-up protections, and Gmail sign-up itself demands a phone number and behaviour signals that an automated flow will not pass. The same holds for Outlook.com, iCloud and most free providers. Even when an account is created by hand and handed to the agent, automated access sits in a grey zone and the account can be suspended without appeal, taking every downstream registration with it. The robust answer is an address on a **domain the owner controls**, delivered through an API-first email provider or a self-hosted server: no ToS aimed at humans, no CAPTCHA, full control over DNS, and the same domain doubles as the host of the agent's `did:web` document (see [1. Identity](01-identity.md)).

Phone numbers are the hardest resource in the whole stack. Verification services reject VoIP and virtual numbers as a category, so a Twilio or Telnyx number will pass some OTP checks and fail others, with no way to know in advance. Sending in the US requires [A2P 10DLC](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc) brand and campaign registration in the name of a legal entity, which the owner must supply. A real mobile SIM in an eSIM-capable device or a hosted SIM box is often the only thing that works for receiving OTPs, and that is a physical asset the owner has to manage. Plan for phone as an owner-provided resource, not something the agent provisions itself.

Endpoints are the easy part. An agent that speaks A2A publishes its card at `/.well-known/agent-card.json`; an MCP server publishes its metadata under `/.well-known/oauth-protected-resource` per [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728). Both follow the [RFC 8615](https://www.rfc-editor.org/rfc/rfc8615) well-known URI convention, so a domain plus a static file is enough for other agents and services to discover how to reach it.

## Minimum vs full provisioning

| Aspect | Minimum viable | Full |
|---|---|---|
| Email | One inbox on the owner's domain, read via API or IMAP | Dedicated subdomain (`agents.example.com`), SPF/DKIM/DMARC, inbound webhooks, per-agent inboxes |
| Domain | Shared owner domain | Agent subdomain with DNS under the provisioner's control, auto-renew, registrar lock |
| Phone | None; owner completes OTP by hand | Owner-supplied mobile number or hosted SIM, plus a 10DLC-registered VoIP number for outbound |
| Endpoints | One HTTPS URL | A2A card, MCP metadata, x402 endpoint, all under `/.well-known` |

## Depends on / enables

- Depends on [1. Identity](01-identity.md): the domain is the owner's; the DID document lists the endpoints.
- Enables [3. Authentication](03-authentication.md): email and phone verification are the bootstrap for nearly every credential.
- Enables [9. Trust](09-trust.md): a domain with age and DNS records is a reputation signal in itself.
- Feeds [10. Governance](10-governance.md): the inbox is where providers send abuse notices, billing failures and security alerts.

## Failure modes & gotchas

- **Gmail for an agent.** Sign-up fails or the account is suspended later; every service registered with it becomes unrecoverable at once.
- **Shared inbox across agents.** One agent's verification codes are readable by all. One inbox per agent, or at least one alias per agent with routing.
- **VoIP number for OTP.** Many verification providers reject it outright. Test the specific service before depending on it.
- **Unregistered A2P traffic.** US carriers filter or block SMS from unregistered 10DLC numbers; registration takes days and needs the owner's legal entity.
- **Domain under the agent's own account.** If the agent's registrar login is compromised or the card expires, the domain, the email and the `did:web` go together. Keep registrar and DNS under the owner (see [Domains & DNS](../providers/domains.md)).
- **Missing DMARC.** Agent mail lands in spam, the owner does not notice, and reply-based workflows silently stall.
- **Well-known files that lie.** Endpoints in the agent card that are down or point at an old host break other agents' discovery; generate them from the manifest.

## Standards

- [Discovery](../standards/discovery.md): A2A agent card at `/.well-known/agent-card.json`, agents.txt / agents.json, llms.txt, MCP Registry.
- [Identity](../standards/identity.md): `did:web` resolution over the same domain.
- [Authentication & Delegation](../standards/auth-and-delegation.md): RFC 9728 Protected Resource Metadata for MCP endpoints.

## Providers

- [Email](../providers/email.md): AgentMail, Resend, Postmark, Mailgun, Fastmail, self-hosted Stalwart or Maddy.
- [Phone, SMS & Voice](../providers/phone.md): Twilio, Telnyx, Vonage, Plivo; voice agents via Bland, Vapi, Retell.
- [Domains & DNS](../providers/domains.md): Cloudflare, Porkbun, Namecheap, Name.com, DNSimple.

## In the manifest

`spec.presence.email`, `spec.presence.domain`, `spec.presence.phone`, `spec.presence.endpoints[]{protocol,url}`. Credentials for the inbox are not here; they are `spec.authentication.credentials[]` entries with a `secretRef`.

```yaml
spec:
  presence:
    email: scout@agents.example.com
    domain: agents.example.com
    endpoints:
      - { protocol: a2a, url: https://agents.example.com/scout/a2a }
      - { protocol: mcp, url: https://agents.example.com/scout/mcp }
```
