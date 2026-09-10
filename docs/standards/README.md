# Standards map

Standards are the second way a Birth Stack layer gets satisfied; [providers](../providers/README.md) are the first. This section lists the specs, drafts and frameworks that an agent's Birth Profile can point at, grouped by the problem they solve rather than by who publishes them. Birthbook does not compete with any of them; it records which ones an agent was born with.

Maturity in this book means one thing only, how safe it is to depend on:

| Maturity | Meaning |
|---|---|
| **Draft** | Text exists (Internet-Draft, community group, EIP Draft, paper). Interfaces may change; do not hard-code. |
| **Adopted** | Stable published spec (RFC, W3C Recommendation, versioned 1.0) or widely used guidance. Safe to reference; deployments may be few. |
| **Production** | Running in the wild with multiple independent implementations or a vendor SLA. Safe to build on today. |

A spec can be Production while its governing document is still Draft (ERC-8004 is the example); the table says which.

## Specs on the stack

```mermaid
flowchart LR
    subgraph L1["1 Identity"]
        DID[DID Core]
        A2A[A2A Agent Card]
        E8004[ERC-8004]
        AIMS[AIMS]
        ENTRA[Entra Agent ID]
    end
    subgraph L2["2 Presence"]
        WK[".well-known/agent-card.json"]
        ATXT[agents.txt]
        DNS[DNS / did:web]
    end
    subgraph L3["3 Authentication"]
        MCPA[MCP Authorization]
        SPIFFE[SPIFFE/SPIRE]
        WBA[Web Bot Auth / RFC 9421]
        WIMSE[WIMSE]
    end
    subgraph L4["4 Compute"]
        ISO["(isolation: see ASI05)"]
    end
    subgraph L5["5 Economic Identity"]
        X402[x402]
        AP2[AP2]
        CARD[Visa TAP · Mastercard Agent Pay]
        ACP[ACP / Shared Payment Tokens]
    end
    subgraph L6["6 Capabilities"]
        REG[MCP Registry]
        LLMS[llms.txt]
    end
    subgraph L7["7 Memory"]
        MEM["(no standard; see ASI06)"]
    end
    subgraph L8["8 Authority"]
        TX[RFC 8693 Token Exchange]
        GNAP[GNAP]
        UCAN[UCAN / ZCAP]
        OBO[OBO for agents]
    end
    subgraph L9["9 Trust"]
        VC[VC 2.0]
        KYA[KYA / AgentFacts]
        REP[ERC-8004 reputation]
    end
    subgraph L10["10 Governance"]
        OWASP[OWASP Agentic Top 10]
        NIST[NIST CAISI · AI 800-4 · IR 8596]
        IMDA[IMDA · EU AI Act]
    end
    L1 --> L2 --> L3 --> L4 --> L5 --> L6 --> L7 --> L8 --> L9 --> L10
```

## Master table

| Standard | Layer | Maturity | Chapter |
|---|---|---|---|
| W3C DID Core | 1 | Adopted | [Identity](identity.md) |
| W3C Verifiable Credentials 2.0 | 1, 9 | Adopted | [Identity](identity.md) |
| A2A Agent Card / `.well-known/agent-card.json` | 1, 2, 6 | Production | [Identity](identity.md) · [Discovery](discovery.md) |
| ERC-8004 Trustless Agents | 1, 2, 9 | Production (EIP Draft) | [Identity](identity.md) · [Discovery](discovery.md) |
| AIMS / Agent Manifest (OpenAttribution) | 1, 9 | Draft | [Identity](identity.md) |
| Agent Passport Standard | 1, 9 | Draft | [Identity](identity.md) |
| HCS-14 Universal Agent ID | 1 | Draft | [Identity](identity.md) |
| Microsoft Entra Agent ID | 1, 3 | Production | [Identity](identity.md) |
| DIF KYA-OS | 1, 8, 9 | Draft | [Identity](identity.md) |
| W3C Agent Identity Registry Protocol CG | 1 | Draft | [Identity](identity.md) |
| A-Identity | 1, 5 | Draft | [Identity](identity.md) |
| MCP Authorization (OAuth 2.1, RFC 9728, RFC 8707) | 3 | Adopted | [Authentication & Delegation](auth-and-delegation.md) |
| RFC 8693 OAuth 2.0 Token Exchange | 3, 8 | Adopted | [Authentication & Delegation](auth-and-delegation.md) |
| RFC 9635 / RFC 9767 GNAP | 3, 8 | Adopted | [Authentication & Delegation](auth-and-delegation.md) |
| OAuth On-Behalf-Of for AI agents (draft) | 8 | Draft | [Authentication & Delegation](auth-and-delegation.md) |
| Transaction Tokens (+ for agents) | 3, 8 | Draft | [Authentication & Delegation](auth-and-delegation.md) |
| draft-klrc-aiagent-auth | 3, 8 | Draft | [Authentication & Delegation](auth-and-delegation.md) |
| draft-liu-ai-agent-authorization-integration | 8 | Draft | [Authentication & Delegation](auth-and-delegation.md) |
| IETF WIMSE WG | 3 | Draft | [Authentication & Delegation](auth-and-delegation.md) |
| SPIFFE / SPIRE | 3 | Production | [Authentication & Delegation](auth-and-delegation.md) |
| Web Bot Auth + RFC 9421 | 3 | Draft / Adopted | [Authentication & Delegation](auth-and-delegation.md) |
| UCAN 1.0 | 8 | Adopted | [Authentication & Delegation](auth-and-delegation.md) |
| ZCAP (Authorization Capabilities) | 8 | Draft | [Authentication & Delegation](auth-and-delegation.md) |
| OpenID AI Identity Management CG | 3, 8 | Draft | [Authentication & Delegation](auth-and-delegation.md) |
| x402 | 5 | Production | [Payments](payments.md) |
| Google AP2 | 5, 8 | Production (early) | [Payments](payments.md) |
| Visa Trusted Agent Protocol / Intelligent Commerce | 5, 9 | Production | [Payments](payments.md) |
| Mastercard Agent Pay (Agentic Tokens) | 5, 9 | Production | [Payments](payments.md) |
| Agentic Commerce Protocol (OpenAI + Stripe) | 5 | Production | [Payments](payments.md) |
| Stripe Shared Payment Tokens | 5 | Production | [Payments](payments.md) |
| PayPal Agent Toolkit | 5 | Production | [Payments](payments.md) |
| Skyfire KYAPay / KYA token | 5, 9 | Production | [Payments](payments.md) · [Security & Governance](security-and-governance.md) |
| Coinbase AgentKit / CDP Server Wallets | 5 | Production | [Payments](payments.md) |
| agents.txt | 2 | Draft | [Discovery](discovery.md) |
| llms.txt | 6 | Adopted | [Discovery](discovery.md) |
| MCP Registry | 6 | Production | [Discovery](discovery.md) |
| NANDA | 2, 9 | Draft | [Discovery](discovery.md) |
| Agent Name Service (paper) | 2 | Draft | [Discovery](discovery.md) |
| DNS-based discovery (`did:web`, SRV/TXT) | 2 | Adopted / Draft | [Discovery](discovery.md) |
| OWASP Top 10 for Agentic Applications | 8, 9, 10 | Adopted | [Security & Governance](security-and-governance.md) |
| OWASP Agentic AI Threats and Mitigations | 8, 10 | Adopted | [Security & Governance](security-and-governance.md) |
| CSA Agentic AI Identity & Access Management | 1, 3, 8 | Adopted | [Security & Governance](security-and-governance.md) |
| NIST CAISI AI Agent Standards Initiative | 10 | Draft | [Security & Governance](security-and-governance.md) |
| NIST AI 800-4 | 10 | Adopted | [Security & Governance](security-and-governance.md) |
| NIST IR 8596 Cyber AI Profile | 10 | Draft | [Security & Governance](security-and-governance.md) |
| Know Your Agent (AgentFacts) | 9 | Draft | [Security & Governance](security-and-governance.md) |
| Singapore IMDA Model AI Governance Framework for Agentic AI | 10 | Adopted | [Security & Governance](security-and-governance.md) |
| EU AI Act | 10 | Adopted (law) | [Security & Governance](security-and-governance.md) |
| Anthropic, Building effective agents | 6, 10 | Adopted (guidance) | [Security & Governance](security-and-governance.md) |

## Overlaps and gaps

Overlaps, where you will have to choose or publish twice:

- **Three "agent card" formats.** The A2A Agent Card, the ERC-8004 registration file and the AIMS manifest all carry name, description and endpoints, for three different readers (other agents, anyone on-chain, websites being crawled). Compared side by side in [Identity](identity.md).
- **Two Know-Your-Agent schemes.** AgentFacts KYA (verifiable metadata) and Skyfire's `kya` token (a paying agent's verified identity) share a name and a goal but not a format.
- **Four ways to say "on behalf of".** RFC 8693 `act` claims, the OBO draft's `requested_agent`, transaction tokens, and UCAN/ZCAP delegation chains. Only RFC 8693 is adopted and only UCAN/ZCAP attenuate without an authorization server.
- **Card-network agent tokens.** Visa, Mastercard and Stripe each issue an agent-scoped payment token; AP2 mandates sit above all three. A merchant integrating one does not get the others.

Gaps, where no standard exists and the manifest carries the burden:

- **Delegation depth.** No adopted spec expresses or enforces how many hops a delegation may travel; `spec.authority.delegations[].maxDelegationDepth` is policy, not protocol.
- **Revocation at scale.** Killing an agent means revoking OAuth grants, API keys, wallet policies, registry entries and card tokens at many providers with no common revocation signal. See [Death](../lifecycle/death.md).
- **Ephemeral agent identity.** Sub-agents spawned for one task have no registry, no reputation and usually no key of their own beyond `did:key`; every card format assumes a long-lived agent.
- **Memory integrity.** There is no standard for signing or attesting agent memory, which is why OWASP ASI06 has no protocol answer in [7 Memory](../stack/07-memory.md).
- **Evidence of governance.** Regulators and KYA schemes ask whether a kill switch and audit log exist; nothing lets a counterparty verify that claim.

## Related

- [The Agent Birth Stack](../birth-stack.md) · [Provider model](../providers/README.md) · [birth.yaml](../manifest.md)
- Stack chapters: [1](../stack/01-identity.md) · [2](../stack/02-presence.md) · [3](../stack/03-authentication.md) · [4](../stack/04-compute.md) · [5](../stack/05-economy.md) · [6](../stack/06-capabilities.md) · [7](../stack/07-memory.md) · [8](../stack/08-authority.md) · [9](../stack/09-trust.md) · [10](../stack/10-governance.md)
