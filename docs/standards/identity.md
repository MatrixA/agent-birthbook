# Identity standards

These standards answer the question layer 1 asks: *who is this agent and who is responsible for it?* They split into three families that are often confused. **Identifier standards** (W3C DID Core, HCS-14 UAID) define a stable name and how to resolve it to keys. **Card / manifest formats** (A2A Agent Card, ERC-8004 registration file, AIMS) define a JSON document that describes the agent to strangers. **Enterprise directories** (Microsoft Entra Agent ID) put agents into an existing IAM system. Verifiable Credentials sit across all three as the way to attach signed claims to an identifier, which is why they also appear in [Trust](../stack/09-trust.md). Birthbook does not pick one; a Birth Profile records whichever the agent was given under `spec.identity.did`, `spec.identity.keys[]` and `spec.identity.registrations[]`.

## At a glance

| Standard | Layer | Maturity | Backed by | Link |
|---|---|---|---|---|
| W3C DID Core 1.0 | 1 Identity | Adopted | W3C | [w3.org/TR/did-core](https://www.w3.org/TR/did-core/) |
| W3C Verifiable Credentials Data Model 2.0 | 1 Identity, 9 Trust | Adopted | W3C | [w3.org/TR/vc-data-model-2.0](https://www.w3.org/TR/vc-data-model-2.0/) |
| A2A Agent Card | 1 Identity, 2 Presence | Production | Linux Foundation (Google-originated) | [a2a-protocol.org](https://a2a-protocol.org/latest/specification/) |
| ERC-8004 Trustless Agents | 1 Identity, 9 Trust | Production (EIP status: Draft) | Ethereum community; MetaMask, EF, Google, Coinbase contributors | [eips.ethereum.org/EIPS/eip-8004](https://eips.ethereum.org/EIPS/eip-8004) |
| AIMS / Agent Manifest (OpenAttribution) | 1 Identity, 9 Trust | Draft | OpenAttribution | [SPECIFICATION.md](https://github.com/openattribution-org/aims/blob/main/SPECIFICATION.md) |
| Agent Passport Standard | 1 Identity, 9 Trust | Draft | community | [github.com/cezexPL/agent-passport-standard](https://github.com/cezexPL/agent-passport-standard) |
| HCS-14 Universal Agent ID | 1 Identity | Draft | Hashgraph Online / Hedera | [hol.org/docs/standards/hcs-14](https://hol.org/docs/standards/hcs-14/) |
| Microsoft Entra Agent ID | 1 Identity, 3 Authentication | Production | Microsoft | [learn.microsoft.com/entra/agent-id](https://learn.microsoft.com/en-us/entra/agent-id/) |
| DIF KYA-OS | 1 Identity, 8 Authority, 9 Trust | Draft | DIF (donated by Vouched) | [blog.identity.foundation/kya-os](https://blog.identity.foundation/kya-os/) |
| W3C Agent Identity Registry Protocol CG | 1 Identity | Draft | W3C Community Group | [w3.org/community/agent-identity](https://www.w3.org/community/agent-identity/) |
| A-Identity | 1 Identity, 5 Economic Identity | Draft | community | [github.com/getA-Identity/A-Identity](https://github.com/getA-Identity/A-Identity) |

## Notes per standard

### W3C DID Core
Defines the `did:method:id` identifier syntax and the DID Document (verification methods, service endpoints) it resolves to. It says nothing about *what* the agent is or who owns it; that is left to methods (`did:web`, `did:key`, `did:pkh`, `did:ethr`) and to credentials. Pick it whenever you want an identifier that outlives any single provider: `did:web` if the agent has a domain ([Presence](../stack/02-presence.md)), `did:key` for ephemeral sub-agents, `did:pkh` when the wallet address *is* the identity.

### W3C Verifiable Credentials 2.0
Defines a signed JSON-LD claim envelope (issuer, subject, claims, proof) with JOSE/COSE or Data Integrity proofs. It does not define agent-specific claim vocabularies; KYA-OS, the W3C Agent Identity CG and AIMS all propose those. Use it to express "owner X controls agent Y" or "agent Y passed audit Z" in a form that survives leaving the issuer's platform. Mostly lives in [Trust](../stack/09-trust.md).

### A2A Agent Card
A JSON document at `/.well-known/agent-card.json` listing name, description, skills, endpoint URL, supported transports and the OAuth/API-key/mTLS schemes required to call the agent, with an optional `AgentCardSignature` (JWS). It is a capability advertisement first and an identity second: nothing binds the card to an owner unless you add a signature and a trust root. Pick it if the agent speaks A2A at all; it is the de-facto card for agent-to-agent calls. See also [Discovery](discovery.md).

### ERC-8004 Trustless Agents
Three per-chain registries. The **Identity Registry** mints an ERC-721 per agent whose `agentURI` resolves to a *registration file* (JSON: name, services/endpoints, other registrations, supported trust models). The **Reputation Registry** stores feedback; the **Validation Registry** stores third-party attestations. It does not define authorization or payment; it plugs into x402 and A2A. Pick it when the agent needs a public, owner-transferable identity that other agents can look up without a central registry. Deployed on mainnet since January 2026; the EIP text itself is still marked Draft.

### AIMS / Agent Manifest (OpenAttribution)
A DID-based JSON-LD manifest that a *crawling* or *content-consuming* agent publishes so that websites can verify who it is, what content licences it holds and where it reports telemetry. Companion effort: [github.com/agent-manifest](https://github.com/agent-manifest). It does not cover agent-to-agent calls or payments. Pick it when your agent reads other people's content and you want a publisher-facing identity rather than a service-facing one.

### Agent Passport Standard
An RFC-style community spec for a signed "passport" (Ed25519) carrying agent identity, provenance and optional blockchain anchoring, with Go/Python/TypeScript SDKs. Single-maintainer; no known production deployments. Useful as a reference design for `spec.identity.keys[].custody` and provenance fields, less so as a dependency.

### HCS-14 Universal Agent ID
Hedera Consensus Service standard defining `uaid:aid:` (deterministic hash of agent attributes) and `uaid:did:` (wrapping an existing DID) so one identifier can point at the same agent across registries. Pairs with HCS-10 OpenConvAI messaging. Narrow ecosystem; relevant if you already run on Hedera.

### Microsoft Entra Agent ID
Agents become first-class identities in Entra (formerly Azure AD) with blueprints, owners and sponsors, Conditional Access, ID Protection risk scoring and lifecycle governance. It is the enterprise answer to layers 1, 3 and 10 at once, but the identity does not leave the tenant. Pick it when the agent lives inside a Microsoft-centric organisation and the other party is also an Entra tenant; see [Credentials & Tool Auth](../providers/credentials-and-tool-auth.md).

### DIF KYA-OS
Know-Your-Agent Operating System (formerly MCP-I), an open identity-and-delegation framework built on DIDs and VCs, being incubated at the Decentralized Identity Foundation. It aims to standardise the credential vocabulary for "who deployed this agent, on whose behalf, with what bounds". Draft; watch rather than depend on.

### W3C Agent Identity Registry Protocol CG
Community Group (April 2026) drafting a DID method, credential formats and trust negotiation that bind agents to their controlling organisations, with MCP/A2A/OAuth integration. Draft; no published spec yet.

### A-Identity
Open-source "passport plus wallet" that gives an agent an on-chain identity, a USDC wallet and a human-set spend limit in one package. It is an opinionated implementation spanning layers 1, 5 and 8 rather than a standard. See [Wallets & Keys](../providers/wallets.md).

## How they fit together

The three "agent card" formats overlap on name, description and endpoints and diverge on *who reads them*:

| | A2A Agent Card | ERC-8004 registration file | AIMS manifest |
|---|---|---|---|
| Reader | Other agents / orchestrators | Anyone querying the chain | Websites being crawled |
| Where it lives | HTTPS well-known path | URI pointed to by an ERC-721 | DID document / HTTPS |
| Binds to owner? | Only if JWS-signed against a trust root | Yes, NFT owner address | Yes, DID controller |
| Carries capabilities? | Yes (skills, transports, auth schemes) | Services list, links out to A2A/MCP | Licences, telemetry endpoint |
| Reputation? | No | Yes (Reputation + Validation registries) | No |

A practical Birth Profile often uses all three: a DID as the stable `spec.identity.did`, an A2A card at the agent's domain for callers, and an ERC-8004 registration under `spec.identity.registrations[]` when the agent trades with strangers. DID Core and VC 2.0 are the substrate under KYA-OS, AIMS, the W3C CG and CSA's agentic IAM work; the fights are over vocabularies, not envelopes.

Open gaps: ephemeral sub-agent identity (spawned for one task, no registry) is underspecified everywhere except `did:key`; and none of these formats express delegation depth, which is why [Authority](../stack/08-authority.md) has its own standards chapter.

## Related

- Stack: [1. Identity](../stack/01-identity.md) · [2. Presence](../stack/02-presence.md) · [8. Authority](../stack/08-authority.md) · [9. Trust](../stack/09-trust.md)
- Standards: [Authentication & Delegation](auth-and-delegation.md) · [Discovery](discovery.md) · [Security & Governance](security-and-governance.md)
- Providers: [Wallets & Keys](../providers/wallets.md) · [Credentials & Tool Auth](../providers/credentials-and-tool-auth.md) · [Domains & DNS](../providers/domains.md)
