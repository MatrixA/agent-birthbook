# Discovery standards

Discovery is how a stranger finds an agent and learns how to call it. It straddles [Presence](../stack/02-presence.md) (the agent has an address) and [Capabilities](../stack/06-capabilities.md) (what it can do). Today there are two mature patterns, both borrowed from the web: a **well-known file on the agent's own domain** (A2A agent card, agents.txt, llms.txt) and a **registry** someone else runs (MCP Registry, ERC-8004 Identity Registry). Everything else, including DNS-based naming and NANDA's index, is research or early deployment. Whatever is used goes into `spec.presence.endpoints[]` and `spec.identity.registrations[]`.

## At a glance

| Standard | Layer | Maturity | Backed by | Link |
|---|---|---|---|---|
| A2A `/.well-known/agent-card.json` | 2 Presence, 6 Capabilities | Production | Linux Foundation | [a2a-protocol.org](https://a2a-protocol.org/latest/topics/agent-discovery/) |
| agents.txt | 2 Presence | Draft | community (MIT licence) | [github.com/asturwebs/agents-txt](https://github.com/asturwebs/agents-txt) |
| llms.txt | 6 Capabilities (content) | Adopted | community (Answer.AI-originated) | [llmstxt.org](https://llmstxt.org/) |
| MCP Registry | 6 Capabilities | Production | MCP project | [github.com/modelcontextprotocol/registry](https://github.com/modelcontextprotocol/registry) |
| NANDA | 2 Presence, 9 Trust | Draft | MIT Media Lab | [media.mit.edu/groups/nanda](https://www.media.mit.edu/groups/nanda/overview/) · [github](https://github.com/projnanda/projnanda) |
| Agent Name Service (ANS) | 2 Presence | Draft (paper) | academic (Huang et al.) | [arxiv.org/abs/2505.10609](https://arxiv.org/abs/2505.10609) |
| ERC-8004 Identity Registry | 1 Identity, 2 Presence | Production | Ethereum community | [eips.ethereum.org/EIPS/eip-8004](https://eips.ethereum.org/EIPS/eip-8004) |
| DNS-based (`did:web`, `did:dns`, SRV/TXT) | 2 Presence | Adopted (DNS) / Draft (agent use) | W3C, IETF | [did-core](https://www.w3.org/TR/did-core/) |

## Notes per standard

### A2A well-known agent card
`https://{domain}/.well-known/agent-card.json` returns the card described in [Identity](identity.md): skills, endpoint, transports, auth schemes. Discovery is by knowing the domain; A2A does not define a search index. An authenticated "extended card" can reveal more once the caller has credentials. This is the only agent-to-agent discovery mechanism with broad implementation.

### agents.txt
A Markdown-with-YAML file at the site root (with a JSON mirror at `/api/agents`) telling visiting agents what the site offers, its endpoints and its rules, in the spirit of robots.txt. Site-to-agent direction; it does not advertise the agent itself. Single-maintainer proposal.

### llms.txt
A Markdown file at `/llms.txt` giving language models a curated map of a site's content. Widely adopted by documentation sites (including the MCP spec itself). It is about content, not agents, but it is how an agent's [Capabilities](../stack/06-capabilities.md) discover tool documentation.

### MCP Registry
Open-source service and hosted instance ([registry.modelcontextprotocol.io](https://registry.modelcontextprotocol.io)) listing published MCP servers with metadata and install details. Discovers *tools* for an agent, not agents for a caller. Third-party mirrors (Smithery, Glama, PulseMCP) index the same data; see [Models & Skills](../providers/models-and-skills.md).

### NANDA
MIT project for an "Internet of AI Agents": a decentralised index plus adaptive resolvers that map an agent name to current endpoints and bridge A2A, MCP and plain HTTPS. Includes AgentFacts, a signed metadata format that also underpins Know-Your-Agent ([Security & Governance](security-and-governance.md)). Research-stage with reference code.

### Agent Name Service
Paper proposing a DNS-inspired, PKI-backed directory where agents register signed records and clients resolve names to capabilities with protocol adapters for A2A/MCP. No running network; useful as a design reference.

### ERC-8004 as discovery
Because the Identity Registry is enumerable on-chain and each entry points to a registration file with service endpoints, it doubles as a permissionless directory: query the registry, filter by reputation, follow the URI. Slow and public by design; suited to marketplaces of unknown agents rather than internal fleets.

### DNS-based options
`did:web` already resolves an identifier to a DID Document via HTTPS on a domain, which can list A2A or MCP service endpoints. SRV or TXT records can advertise agent endpoints for a domain, and DNSSEC gives them integrity. Nothing agent-specific is standardised; the advantage is that [Domains & DNS](../providers/domains.md) is infrastructure every agent already needs.

## How they fit together

Well-known files answer "given a domain, how do I call it"; registries answer "given a need, which domain". A complete Birth Profile usually has one of each: the agent publishes an A2A card on its own domain (so `spec.presence.domain` becomes the discovery root) and is listed in a registry appropriate to its audience: the MCP Registry if it is a tool, ERC-8004 if it trades with strangers, an enterprise catalogue if it is internal. The overlap to watch is between the A2A card, the ERC-8004 registration file and the AIMS manifest, which all carry name and endpoints in different shapes; see [Identity](identity.md). The gap is search and trust: no adopted standard tells you whether the card you found is honest, which is what NANDA's AgentFacts and ERC-8004's reputation registry attempt.

## Related

- Stack: [1. Identity](../stack/01-identity.md) · [2. Presence](../stack/02-presence.md) · [6. Capabilities](../stack/06-capabilities.md) · [9. Trust](../stack/09-trust.md)
- Standards: [Identity](identity.md) · [Security & Governance](security-and-governance.md)
- Providers: [Domains & DNS](../providers/domains.md) · [Models & Skills](../providers/models-and-skills.md)
