# Glossary

Terms the book coins are marked **(Birthbook)**. Everything else is borrowed, with a link to where it is defined.

## Birthbook vocabulary

**Agent Birthbook (Birthbook)** — This knowledge base: a reference architecture for what autonomous agents must be provisioned with.

**Agent Birth Stack (Birthbook)** — The ten-layer concept model: 1 Identity, 2 Presence, 3 Authentication, 4 Compute, 5 Economic Identity, 6 Capabilities, 7 Memory, 8 Authority, 9 Trust, 10 Governance. See [The Agent Birth Stack](birth-stack.md).

**Agent Birth Manifest, ABM (Birthbook)** — The machine-readable format for describing an agent's provisioning, one section per layer. File name by convention `birth.yaml`. See [birth.yaml](manifest.md).

**Birth Profile (Birthbook)** — One agent's manifest; an instance of the ABM.

**Birth Provider (Birthbook)** — Any party that provisions a resource to an agent: an inbox, a number, a domain, a sandbox, a wallet, a card, a secret store, memory, model access, tools, observability, a legal wrapper. See [Provider model](providers/README.md).

**Birth Procedure (Birthbook)** — The provisioning lifecycle: [birth](lifecycle/birth.md), [credential rotation](lifecycle/credential-rotation.md), [migration](lifecycle/migration.md), [death](lifecycle/death.md).

**Existence / Action / Safety bands (Birthbook)** — The grouping of layers 1–3, 4–7 and 8–10 respectively.

**Owner** — The natural or legal person responsible for an agent. Every Birth Profile names one. The owner passes KYC, holds the kill switch, and is who a counterparty ultimately has recourse to.

**Principal** — The party on whose behalf an agent is acting for a given task. Often the owner, but not always: a customer-service agent acts for the customer within limits set by the owner.

## Identity and trust

**DID — Decentralized Identifier** — A URI of the form `did:method:identifier` that resolves to a DID document containing public keys and service endpoints. [W3C DID Core](https://www.w3.org/TR/did-core/). Common methods for agents: `did:web` (hosted on the owner's domain), `did:key` (self-describing, no resolution), `did:pkh` (derived from a blockchain address).

**VC — Verifiable Credential** — A signed set of claims about a subject, issued by an issuer, checkable by a verifier without contacting the issuer. [W3C VC Data Model 2.0](https://www.w3.org/TR/vc-data-model-2.0/). In the stack, VCs fill layer 9 Trust.

**Agent Card** — A JSON document describing an agent's capabilities, endpoints and accepted authentication, published at `/.well-known/agent-card.json` by the [A2A protocol](https://a2a-protocol.org/). ERC-8004 and AIMS define similar but non-identical documents; see [Standards: Identity](standards/identity.md).

**ERC-8004 — Trustless Agents** — Ethereum standard with Identity, Reputation and Validation registries; an agent is an ERC-721 token pointing at a registration file. [EIP-8004](https://eips.ethereum.org/EIPS/eip-8004).

**AIMS — Agent Identity and Manifest Standard** — Manifest, discovery and verification spec from OpenAttribution so a website can establish which agent is calling it. [Specification](https://github.com/openattribution-org/aims/blob/main/SPECIFICATION.md).

**Agent Passport** — Generic name for a signed document asserting an agent's identity, provenance, and often its authorisation and spend limits. Several unrelated projects use the term; Birthbook does not, because the stack sits *before* any passport is issued.

**KYA — Know Your Agent** — Verification of an agent's identity, provenance and permissions before a counterparty transacts with it; the agent-world analogue of KYC. See [AgentFacts KYA](https://agentfacts.org/kya/) and [Standards: Security & Governance](standards/security-and-governance.md).

**Attestation** — A signed statement by one party about another; in this book usually the owner attesting to the agent ("this agent is mine, here is its key"), or a TEE attesting to the code it runs.

**Provenance** — Where an agent came from: which model, which operator, which code, which owner. A trust signal distinct from identity.

**Reputation** — Aggregated third-party feedback about an agent's past behaviour, typically in a registry (ERC-8004 Reputation Registry, marketplace ratings).

## Authentication and authority

**Authentication vs Identity** — Identity is what the agent *is* (layer 1); authentication is what it *presents* to another system to prove it (layer 3). An agent has one identity and many credentials.

**Credential (authentication sense)** — An API key, OAuth token, certificate or signature the agent uses to access a service. Not to be confused with Verifiable Credential, which is a trust artifact.

**Secret store** — The system that holds credentials and hands them to the agent at runtime. A Birth Profile contains `secretRef` pointers, never secret values.

**OAuth 2.1** — The consolidated OAuth profile (PKCE mandatory, implicit grant removed) that the [MCP authorization spec](https://modelcontextprotocol.io/specification/draft/basic/authorization) builds on.

**Token exchange / on-behalf-of** — Swapping one token for another so a downstream service knows both *who* is acting (`sub`) and *through whom* (`act`). [RFC 8693](https://www.rfc-editor.org/rfc/rfc8693). The agent-specific extension is the IETF [OBO for AI agents draft](https://www.ietf.org/archive/id/draft-oauth-ai-agents-on-behalf-of-user-00.html).

**Delegation** — A grant from a principal to an agent (or agent to sub-agent) of a bounded authority: scope, expiry, whether it can be re-delegated, and to what depth. Layer 8.

**Attenuation** — The rule that a delegation can only narrow, never widen, the authority of the grantor. Central to capability systems such as [UCAN](https://github.com/ucan-wg/spec) and [ZCAP-LD](https://w3c-ccg.github.io/zcap-spec/).

**Approval / human-in-the-loop (HITL)** — An action the agent may not complete without a named human deciding, recorded in `spec.authority.approvals[]`.

**Workload identity** — An identity issued to a running process rather than a person, usually short-lived and automatically rotated. [SPIFFE](https://spiffe.io/) is the reference; the IETF [WIMSE](https://datatracker.ietf.org/wg/wimse/about/) working group is standardising the multi-system case.

**Web Bot Auth** — Signing outbound HTTP requests with [RFC 9421 HTTP Message Signatures](https://www.rfc-editor.org/rfc/rfc9421) so a site can verify which agent operator is calling. [Cloudflare's write-up](https://blog.cloudflare.com/web-bot-auth/).

## Economy

**Custody** — Who controls a key: `self` (the agent's own host), `owner`, `provider` (a wallet or key service, usually with a policy engine), `tee` (hardware enclave), `mpc` (threshold shares). The single biggest design decision in layers 1 and 5.

**Budget** — Hard spending limits per transaction, per day and per month, enforced outside the agent's own reasoning.

**x402** — Paying for an HTTP resource by answering a `402 Payment Required` with a stablecoin payment. [Coinbase x402](https://github.com/coinbase/x402).

**AP2 — Agent Payments Protocol** — Google-led protocol in which a user signs *mandates* (intent, cart) that authorise an agent to complete a purchase. [AP2](https://ap2-protocol.org/).

**Agentic token / Shared Payment Token** — A card-network or PSP token bound to a specific agent, merchant and amount so the agent never holds raw card data (Mastercard Agent Pay, Stripe SPT).

**KYC / KYB** — Know Your Customer / Business checks. Passed by the owner or the owner's entity, never by the agent.

## Compute, memory, governance

**Sandbox** — An isolated execution environment for agent code: microVM (Firecracker), container, or process-level.

**Egress allowlist** — Restricting which hosts a runtime may reach. The cheapest high-value control in layer 4.

**Memory kinds** — *Working* (current context), *episodic* (what happened), *semantic* (what is known), *files*, *knowledge graph*. Layer 7.

**Memory poisoning** — Injecting content into an agent's persistent memory so it misbehaves later. [OWASP ASI06](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications/).

**Audit log** — The append-only record of what the agent did, with which credentials, at what cost. Layer 10's non-negotiable.

**Kill switch** — The mechanism and the person that can halt an agent: suspend compute, revoke credentials, freeze wallets, mark registrations revoked. See [Governance](stack/10-governance.md).

**Recovery** — How control over an agent is regained when keys, credentials or the owner are lost.

**MCP — Model Context Protocol** — Protocol for connecting agents to tools and data. [modelcontextprotocol.io](https://modelcontextprotocol.io/).

**A2A — Agent2Agent protocol** — Protocol for agent-to-agent discovery and task exchange. [a2a-protocol.org](https://a2a-protocol.org/).

**Agent Skills** — Packaged, discoverable instructions and scripts an agent can load (`SKILL.md`). [agentskills.io](https://agentskills.io/).
