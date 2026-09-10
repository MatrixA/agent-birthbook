# Security & governance standards

These documents answer the Safety band's question: what can go wrong once an agent exists, and what a responsible owner is expected to have in place. They are of three kinds. **Threat taxonomies** (OWASP Top 10 for Agentic Applications, OWASP Agentic Threats & Mitigations) name the failure modes. **Control frameworks** (CSA Agentic AI IAM, NIST Cyber AI Profile, Singapore's agentic framework) say which controls to apply. **Assurance schemes** (Know Your Agent, NIST's agent standards initiative) try to make those controls verifiable to third parties. None is a wire protocol; they shape what goes into `spec.governance`, `spec.authority.approvals[]` and `spec.trust.kya`, and they are the checklists the [Birth Procedure](../lifecycle/birth.md) is audited against.

## At a glance

| Standard | Layer | Maturity | Backed by | Link |
|---|---|---|---|---|
| OWASP Top 10 for Agentic Applications (2026) | 8, 9, 10 | Adopted | OWASP GenAI Security Project | [genai.owasp.org](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications/) |
| OWASP Agentic AI Threats and Mitigations | 8, 10 | Adopted | OWASP GenAI Security Project | [genai.owasp.org](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/) |
| CSA Agentic AI Identity & Access Management | 1, 3, 8 | Adopted (guidance) | Cloud Security Alliance | [cloudsecurityalliance.org](https://cloudsecurityalliance.org/artifacts/agentic-ai-identity-and-access-management-a-new-approach) |
| NIST CAISI AI Agent Standards Initiative | 10 Governance | Draft | NIST | [nist.gov/caisi](https://www.nist.gov/caisi/ai-agent-standards-initiative) |
| NIST AI 800-4 Challenges to the Monitoring of Deployed AI Systems | 10 Governance | Adopted (report) | NIST CAISI | [nist.gov](https://www.nist.gov/news-events/news/2026/03/new-report-challenges-monitoring-deployed-ai-systems) · [PDF](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.800-4.pdf) |
| NIST IR 8596 Cyber AI Profile | 10 Governance | Draft | NIST / NCCoE | [csrc.nist.gov/pubs/ir/8596/iprd](https://csrc.nist.gov/pubs/ir/8596/iprd) |
| Know Your Agent (AgentFacts) | 9 Trust | Draft | NANDA / AgentFacts | [agentfacts.org/kya](https://agentfacts.org/kya/) |
| Know Your Agent (Skyfire KYA token) | 9 Trust | Production | Skyfire | [docs.skyfire.xyz](https://docs.skyfire.xyz/docs/kyapay-tokens) |
| Singapore IMDA Model AI Governance Framework for Agentic AI | 10 Governance | Adopted (v1.5, May 2026) | IMDA | [imda.gov.sg](https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/press-releases/2026/new-model-ai-governance-framework-for-agentic-ai) · [PDF](https://www.imda.gov.sg/-/media/imda/files/about/emerging-tech-and-research/artificial-intelligence/mgf-for-agentic-ai.pdf) |
| EU AI Act (Regulation 2024/1689) | 10 Governance | Adopted (law) | European Union | [eur-lex.europa.eu](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) · [explorer](https://artificialintelligenceact.eu/) |
| Anthropic, Building effective agents | 6, 10 | Adopted (guidance) | Anthropic | [anthropic.com](https://www.anthropic.com/research/building-effective-agents) |

## Notes per standard

### OWASP Top 10 for Agentic Applications
Published December 2025 with 100+ reviewers; the canonical vocabulary for agent risk. Each entry maps onto a Birth Stack layer where the control belongs:

| ID | Risk | One line | Birth Stack layer |
|---|---|---|---|
| ASI01 | Agent Goal Hijack | Injected instructions redirect the agent's objective or plan. | [8 Authority](../stack/08-authority.md) (scope), [6 Capabilities](../stack/06-capabilities.md) |
| ASI02 | Tool Misuse and Exploitation | Legitimate tools called with harmful arguments or exploited via their interfaces. | [6 Capabilities](../stack/06-capabilities.md), [8 Authority](../stack/08-authority.md) |
| ASI03 | Identity and Privilege Abuse | Agent credentials, inherited tokens or over-broad scopes used beyond intent. | [3 Authentication](../stack/03-authentication.md), [8 Authority](../stack/08-authority.md) |
| ASI04 | Agentic Supply Chain Vulnerabilities | Malicious or compromised MCP servers, skills, plugins, registries. | [6 Capabilities](../stack/06-capabilities.md) |
| ASI05 | Unexpected Code Execution | Agent generates or runs code with unintended effect. | [4 Compute](../stack/04-compute.md) (isolation) |
| ASI06 | Memory and Context Poisoning | Stored or retrieved context tampered with to steer future behaviour. | [7 Memory](../stack/07-memory.md) |
| ASI07 | Insecure Inter-Agent Communication | Agent-to-agent messages without authentication, integrity or policy. | [3 Authentication](../stack/03-authentication.md), [9 Trust](../stack/09-trust.md) |
| ASI08 | Cascading Failures | One bad decision propagates across agents, tools and workflows. | [10 Governance](../stack/10-governance.md) (limits, kill switch) |
| ASI09 | Human-Agent Trust Exploitation | Agent output manipulates the human into approving unsafe actions. | [8 Authority](../stack/08-authority.md) (approvals), [10 Governance](../stack/10-governance.md) |
| ASI10 | Rogue Agents | Compromised or drifting agents keep operating outside intent. | [10 Governance](../stack/10-governance.md) (audit, kill switch, recovery) |

The list extends rather than replaces the OWASP Top 10 for LLM Applications. Its organising principle, "least agency", is the same as the manifest's habit of declaring `spec.authority` before `spec.capabilities`.

### OWASP Agentic AI Threats and Mitigations
The February 2025 threat model (T1–T15: memory poisoning, tool misuse, privilege compromise, resource overload, cascading hallucination, intent breaking, misaligned behaviour, repudiation, identity spoofing, overwhelming HITL, unexpected RCE, agent communication poisoning, rogue agents, human attacks on multi-agent systems, human manipulation) from which the Top 10 was distilled. Use it when you need the finer-grained mitigations behind each ASI entry.

### CSA Agentic AI Identity & Access Management
August 2025 paper arguing that OAuth-style static roles do not fit agents and proposing an IAM built on DIDs, Verifiable Credentials, zero-trust per-request policy and fine-grained delegation. It is the clearest statement of why layers 1, 3 and 8 are separate. Guidance, not a spec.

### NIST CAISI AI Agent Standards Initiative
The Center for AI Standards and Innovation programme convening industry on agent identity, interoperability and security protocols. No normative output yet; it is where US-government-recognised agent standards are likely to be blessed.

### NIST AI 800-4
March 2026 report cataloguing what post-deployment monitoring of AI systems requires and where practice falls short, based on three workshops and a literature review. It is the reference for what `spec.governance.auditLog` and `reviewCadence` should be able to answer. Not agent-specific but directly applicable.

### NIST IR 8596 Cyber AI Profile
Draft CSF 2.0 Community Profile covering cybersecurity *of* AI systems, AI-enabled attacks and AI-enabled defence. Map your Governance layer to its Govern/Identify/Protect/Detect/Respond/Recover outcomes if you need to show CSF alignment.

### Know Your Agent
Two things share the name. **AgentFacts KYA** (from the NANDA orbit) proposes signed, verifiable agent metadata (identity, capabilities, compliance, provenance) checked before an agent is admitted, KYC-style. **Skyfire's `kya` token** is a shipping JWT a seller verifies to learn a paying agent's verified identity. Both fill `spec.trust.kya`; see [Trust](../stack/09-trust.md) and [Payments](payments.md).

### Singapore IMDA Model AI Governance Framework for Agentic AI
Launched January 2026, updated to v1.5 in May 2026. Four dimensions: bound risks up front, keep humans accountable, apply lifecycle technical controls (baseline testing, allow-listed services), enable end-user responsibility. The most concrete government checklist for agent deployers; short and readable.

### EU AI Act
Regulation (EU) 2024/1689. Touchpoints for agents: general-purpose model obligations on the model provider (layer 6), transparency duties when an agent interacts with people (layer 2/9), high-risk obligations if the agent's *use case* falls in Annex III (layers 8 and 10: human oversight, logging, record-keeping). Whether an autonomous agent is a "deployer" or part of a "system" is unsettled; log everything and keep a human principal named in `spec.authority.principal`.

### Anthropic, Building effective agents
Engineering guidance (December 2024): prefer simple composable workflows, add autonomy only where needed, keep tool interfaces well-documented, and stop at checkpoints for human review. Its "start simple" advice is the practitioner's version of least agency and shapes what a minimum viable [Capabilities](../stack/06-capabilities.md) layer looks like.

## How they fit together

OWASP tells you what to defend against; CSA and the IETF/OAuth work in [Authentication & Delegation](auth-and-delegation.md) tell you how to build the identity and permission controls; NIST and IMDA tell you what monitoring and accountability a regulator or auditor will expect; KYA schemes let a counterparty check you did it. In manifest terms: ASI03/ASI07 controls land in `spec.authentication` and `spec.trust`; ASI01/02/09 in `spec.authority` (scopes and approvals); ASI04/05/06 in `spec.capabilities`, `spec.compute.isolation` and `spec.memory`; ASI08/10 in `spec.governance` (limits, `killSwitch`, `recovery`). The unsolved parts are shared with the other chapters: revoking a compromised agent's credentials across many providers at once, and standardised evidence that a kill switch actually works.

## Related

- Stack: [3. Authentication](../stack/03-authentication.md) · [4. Compute](../stack/04-compute.md) · [6. Capabilities](../stack/06-capabilities.md) · [7. Memory](../stack/07-memory.md) · [8. Authority](../stack/08-authority.md) · [9. Trust](../stack/09-trust.md) · [10. Governance](../stack/10-governance.md)
- Standards: [Identity](identity.md) · [Authentication & Delegation](auth-and-delegation.md) · [Payments](payments.md)
- Providers: [Observability & Human-in-the-loop](../providers/observability-and-hitl.md) · [Credentials & Tool Auth](../providers/credentials-and-tool-auth.md) · [Compute & Browsers](../providers/compute-and-browsers.md)
- Lifecycle: [Death](../lifecycle/death.md) · [Credential Rotation](../lifecycle/credential-rotation.md)
