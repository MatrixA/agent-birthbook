# Domains & DNS

A domain gives an agent a namespace it controls: an email address that is not borrowed, a hostname for its endpoints, and a place to publish machine-readable facts about itself (`/.well-known/agent-card.json`, `agents.txt`, DKIM and SPF records, TXT-record proofs). In the [Presence](../stack/02-presence.md) layer the domain is the root that email, endpoints and much of [Trust](../stack/09-trust.md) hang from. An agent-native domain provider is one where registration, renewal, nameserver changes and every record type are reachable by API with scoped tokens, so that the [Birth Procedure](../lifecycle/birth.md) can create `agent.example.com`, add its MX and TXT records, and hand back a token that can touch only that zone.

The traps: registrars require a registrant with a legal name, postal address and payment method, and ICANN's rules make the registrant of record the accountable party, so the agent cannot be the registrant. Domain ownership is a high-value credential; a token that can change nameservers can hijack every email and endpoint under it. Most registrar APIs are broader than an agent needs. For those reasons the default recommendation in this book is that an agent gets a **subdomain of the owner's domain**, delegated by a DNS token scoped to that zone, not its own registration. The owner keeps the registrar account, the renewal, and the ability to unplug the agent with one NS record. Only an agent that must outlive or be transferred independently of its owner should hold its own name, and then usually through the owner's legal entity anyway.

## Interfaces

- **Registrar API** - Availability check, registration, renewal, contact update, nameserver update, transfer lock. Needed only if the agent registers its own names.
- **DNS zone API** - Create, read, update, delete records; the interface that matters. Zone- or record-scoped tokens are the difference between a safe delegation and a hijack risk.
- **`_well-known` and TXT publication** - [RFC 8615](https://www.rfc-editor.org/rfc/rfc8615) well-known URIs for agent cards and discovery files; TXT records for domain-ownership proofs demanded by email providers, OAuth consoles and ACME DNS-01 challenges ([RFC 8555](https://www.rfc-editor.org/rfc/rfc8555)).
- **Email authentication records** - SPF, DKIM and DMARC ([RFC 7489](https://www.rfc-editor.org/rfc/rfc7489)) TXT records without which nothing the agent sends is delivered.
- **Blockchain naming** - ENS names resolve on Ethereum and can carry text records and a wallet address; Handshake sells top-level names on its own chain. Both let a key, not a registrant, own the name, which is attractive for agents and useless for the DNS-only services the agent must talk to.
- **MCP / agent tooling** - Cloudflare publishes agent-setup docs for its API; most others expect a plain REST client.

## Providers

| Provider | Agent-native | OSS | Pricing | Notes |
|---|---|---|---|---|
| [Cloudflare Registrar + DNS](https://developers.cloudflare.com/registrar/) | Usable | No | Paid | Registrar API covers search, check, registration and renewal; DNS API with per-zone scoped tokens; at-cost renewals. The default pairing for a subdomain delegation. |
| [Porkbun](https://porkbun.com/api/json/v3/documentation) | Usable | No | Paid | JSON API for registration and DNS; API access must be enabled per domain. |
| [Namecheap](https://www.namecheap.com/support/api/intro/) | Usable | No | Paid | XML API for domains and DNS; requires IP allow-listing and an account spend threshold before API is enabled. |
| [Name.com](https://www.name.com/api-docs) | Usable | No | Paid | REST API for domains, DNS and transfers. |
| [Dynadot](https://www.dynadot.com/domain/api) | Usable | No | Paid | Registrar API with DNS record management. |
| [DNSimple](https://dnsimple.com) | Usable | No | Paid | API-first registrar and DNS host; account-level and domain-level tokens; Terraform provider. |
| [Vercel Domains](https://vercel.com/docs/domains) | Usable | No | Paid | Buy and manage domains and DNS through the Vercel API; convenient when the agent's endpoints already run on Vercel. |
| [ENS](https://ens.domains) | Usable | Yes | Usage-based | Ethereum Name Service; a key owns the name; text and address records; resolvable in DNS only via gateways. |
| [Handshake](https://handshake.org) | Usable | Yes | Usage-based | Decentralised root zone with auctioned TLDs; requires an HNS-aware resolver; niche. |

## Resources

- [Cloudflare DNS docs](https://developers.cloudflare.com/dns/) - Records, zone delegation and token scoping.
- [Cloudflare Registrar API](https://developers.cloudflare.com/api/resources/registrar/) - Endpoints for search, check and registration.
- [DNSimple developer](https://developer.dnsimple.com/) - REST API reference.
- [Vercel domains API](https://vercel.com/docs/rest-api/reference/endpoints/domains) - Programmatic purchase and record management.
- [ENS docs](https://docs.ens.domains) - Registration, resolvers and text records.
- [hsd](https://github.com/handshake-org/hsd) - Handshake reference node and resolver.
- [RFC 8615 Well-Known URIs](https://www.rfc-editor.org/rfc/rfc8615) - The `/.well-known/` convention agent cards rely on.
- [RFC 8555 ACME](https://www.rfc-editor.org/rfc/rfc8555) - DNS-01 challenges for certificates on agent endpoints.
- [RFC 7489 DMARC](https://www.rfc-editor.org/rfc/rfc7489) - Alignment rules for the agent's sending domain.
- [A2A specification](https://a2a-protocol.org/) - Agent Card location and contents.

## Related

- [2. Presence](../stack/02-presence.md) - `spec.presence.domain` and `spec.presence.endpoints[]`.
- [9. Trust](../stack/09-trust.md) - Domain-anchored proofs and attestations.
- [Discovery standards](../standards/discovery.md) - agents.txt, llms.txt, A2A Agent Card, MCP Registry.
- [Email](email.md) - SPF, DKIM and MX records that live in the delegated zone.
- [Wallets & Keys](wallets.md) - The key that owns an ENS name.
