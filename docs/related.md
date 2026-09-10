# Related Projects

Birthbook deliberately does not cover agent frameworks, model rankings or MCP server catalogues. These projects do, or they inspired the shape of this book.

## Method models

Repositories whose *structure* Birthbook borrows from.

- [EU Digital Identity Wallet — Architecture and Reference Framework](https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework) - A living architecture document answering "which components, roles, interfaces and requirements make up a digital identity system"; the closest methodological precedent for a provisioning reference architecture.
- [Awesome Self-Sovereign Identity](https://github.com/animo/awesome-self-sovereign-identity) - Curation of the SSI world from philosophy to specifications; the model for how Birthbook's standards and provider lists are kept.
- [DIF Universal Resolver](https://github.com/decentralized-identity/universal-resolver) - One abstract interface, many pluggable drivers; the pattern behind Birthbook's requirement → capability → interface → provider chain.
- [The Twelve-Factor App](https://12factor.net/) - Short, numbered, opinionated layers; the tone Birthbook aims for in the stack chapters.

## Neighbouring standards and projects

Things that fill one or more layers of the stack. Each is placed in context in the [standards chapters](standards/README.md); listed here so the boundary is clear.

- [AIMS — Agent Identity and Manifest Standard](https://github.com/openattribution-org/aims) - Agent identity, manifest, discovery and verification so a website knows which agent is calling. Layers 1 and 9.
- [ERC-8004 Trustless Agents](https://eips.ethereum.org/EIPS/eip-8004) - On-chain identity, reputation and validation registries. Layers 1 and 9.
- [A2A Protocol](https://a2a-protocol.org/) - Agent-to-agent discovery and task exchange, including the Agent Card. Layers 2 and 6.
- [Model Context Protocol](https://modelcontextprotocol.io/) - Tool connectivity and the authorization profile agents use to reach tools. Layers 3 and 6.
- [Agent Passport Standard](https://github.com/cezexPL/agent-passport-standard) - Signed identity and provenance documents for agents. Layers 1 and 9.
- [A-Identity](https://github.com/getA-Identity/A-Identity) - Passport plus wallet plus human-set spending limit; an early implementation of the identity → wallet → budget → authority chain. Layers 1, 5, 8.
- [x402](https://github.com/coinbase/x402) - HTTP-native stablecoin payments. Layer 5.
- [AP2 — Agent Payments Protocol](https://ap2-protocol.org/) - Mandate-based agent payments. Layers 5 and 8.
- [OWASP Top 10 for Agentic Applications](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications/) - The threat taxonomy Birthbook maps onto its layers. Layers 8–10.

## Agent runtimes and "agent OS" products

Products that bundle several layers into one hosted agent. They are the natural consumers of a Birth Profile.

- [OpenClaw](https://github.com/openclaw/openclaw) - Open-source personal agent runtime (formerly Clawdbot) with channels, memory and tool access.
- [Cloudflare Agents SDK](https://developers.cloudflare.com/agents/) - Stateful agents on Durable Objects with built-in storage, scheduling and sandboxes.
- [AWS Bedrock AgentCore](https://aws.amazon.com/bedrock/agentcore/) - Runtime, memory, identity and gateway services for agents.
- [Zo Computer](https://zo.computer/) - A hosted personal computer for an agent: files, apps, memory and a persistent runtime.

## Other awesome lists

Go here for what Birthbook leaves out.

- [awesome-ai-agents](https://github.com/e2b-dev/awesome-ai-agents) - Agent products and frameworks, open and closed source.
- [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) - MCP server catalogue by category.
- [awesome-mcp-security](https://github.com/Puliczek/awesome-mcp-security) - Threats, scanners and hardening for MCP.
- [awesome-agent-skills-security](https://github.com/LLMSecurity/awesome-agent-skills-security) - Attacks, defences and benchmarks around agent tool use.
- [awesome-ai-governance](https://github.com/agentrust-io/awesome-ai-governance) - Governance, safety and compliance tooling and standards.
- [awesome-agentic-ai](https://github.com/mfornos/awesome-agentic-ai) - Principles, technologies and standards for agentic systems.
- [awesome-self-sovereign-identity](https://github.com/animo/awesome-self-sovereign-identity) - The SSI ecosystem, from which Birthbook's identity vocabulary comes.
- [AgentID.md](https://agentid.md/) - Reference on how agents identify themselves in HTTP user agents and headers.
