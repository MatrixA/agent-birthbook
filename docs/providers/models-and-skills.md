# Models & Skills

The [Capabilities](../stack/06-capabilities.md) layer is what the agent can actually do: which models it can call, which tools it can invoke, and which packaged procedures (skills) it knows how to follow. Provisioning it means three things. First, model access through a gateway rather than a raw vendor key, so that spend, rate and model choice are controlled per agent and the vendor can be swapped. Second, a way to discover and install tools, which in 2026 mostly means MCP servers found through a registry. Third, skills: versioned folders of instructions and scripts the agent loads on demand, now standardised as the Agent Skills format. Agent-native providers issue per-agent keys with budgets, serve tools with machine-readable manifests, and ship skills that any compliant client can load.

The traps: a shared vendor API key across agents means no per-agent budget, no per-agent kill switch and no attribution in the audit log; tool registries are a supply chain (OWASP ASI04) and a server's manifest is a claim, not a proof, so pin versions and read the source; skills are executable instructions and a malicious `SKILL.md` is a prompt injection with a package manager; and model routers that silently fall back to a different model change the agent's behaviour without anyone deciding to.

## Interfaces

- **OpenAI-compatible gateway** - One base URL and one virtual key per agent; the gateway maps to any upstream vendor and enforces budgets, rate limits and model allow-lists. The per-key budget is the cheapest [Governance](../stack/10-governance.md) hook in the whole stack: set `spec.governance.limits` at the gateway and the agent cannot overspend even if its own code is compromised.
- **Direct vendor API** - Anthropic, OpenAI, Google and others; needed for features a gateway lags on, at the cost of managing keys and quotas per vendor.
- **MCP** - Servers exposing tools, resources and prompts over stdio or HTTP with OAuth; the tool interface agents converge on. Recorded as `spec.capabilities.tools[].kind: mcp`.
- **MCP registry API** - A `server.json` manifest per server with name, package, transport and auth requirements; registries index it so an agent (or its owner) can discover and install servers by name.
- **Agent Skills** - A folder with `SKILL.md` (name, description, instructions) plus optional scripts and references, loaded by progressive disclosure: metadata at start, full instructions when relevant. Recorded as `spec.capabilities.skills[]`.
- **CLI tools** - Plain executables in the sandbox; the oldest interface and still the most reliable for filesystem and git work.

## Providers: model gateways

| Provider | Agent-native | OSS | Pricing | Notes |
|---|---|---|---|---|
| [OpenRouter](https://openrouter.ai) | Usable | No | Usage-based | Single API over hundreds of models; per-key credit limits; provider routing preferences. |
| [LiteLLM](https://github.com/BerriAI/litellm) | Yes | Yes | OSS + cloud | Proxy with virtual keys, per-key and per-team budgets, model allow-lists and spend logs; self-host as the agent fleet's model plane. |
| [Portkey](https://portkey.ai) | Yes | Partial | Free tier | AI gateway with virtual keys, budgets, guardrails, retries and observability; open-source gateway core. |
| [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) | Usable | No | Usage-based | Unified model access with usage tracking and BYOK; integrated with the AI SDK. |
| [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/) | Usable | No | Free tier | Proxy in front of vendor APIs with caching, rate limiting, logs and BYOK; per-gateway controls. |
| [Helicone](https://www.helicone.ai) | Usable | Yes | OSS + cloud | Gateway plus observability: request logs, cost per key, caching and rate limits. |
| [Anthropic API](https://docs.anthropic.com) | Usable | No | Usage-based | Direct access with workspaces and per-workspace spend limits; use behind a gateway when running more than one agent. |

## Providers: tool registries and skills

| Provider | Agent-native | OSS | Pricing | Notes |
|---|---|---|---|---|
| [MCP Registry](https://registry.modelcontextprotocol.io) | Yes | Yes | n/a | The official registry from the MCP project; `server.json` manifests, namespace ownership verified via GitHub or DNS; sub-registries can mirror it. |
| [Smithery](https://smithery.ai) | Yes | Partial | Free tier | Registry and hosting for MCP servers with a CLI installer. |
| [Glama](https://glama.ai/mcp/servers) | Yes | No | Free tier | MCP server directory with inspection and hosted gateway. |
| [mcp.so](https://mcp.so) | Yes | No | n/a | Community directory of MCP servers and clients. |
| [PulseMCP](https://www.pulsemcp.com) | Yes | No | n/a | Curated directory of MCP servers and clients with update tracking. |
| [Agent Skills](https://agentskills.io) | Yes | Yes | n/a | The open specification for the `SKILL.md` format, originated by Anthropic; adopted by Claude, Codex, Gemini CLI, Cursor, VS Code and others. |
| [anthropics/skills](https://github.com/anthropics/skills) | Yes | Yes | n/a | Anthropic's reference skills repository. |
| [skills.sh](https://skills.sh) | Yes | Yes | n/a | Vercel's directory and installer for open-source skills; ranks by installs and lists security audits. |

## Resources

- [OpenRouter docs](https://openrouter.ai/docs) - Key limits and provider routing.
- [LiteLLM virtual keys and budgets](https://docs.litellm.ai/docs/proxy/users) - Per-key, per-user and per-team spend limits.
- [Portkey gateway](https://github.com/Portkey-AI/gateway) - Open-source gateway core.
- [Helicone repository](https://github.com/Helicone/helicone) - Self-hosting.
- [Model Context Protocol](https://modelcontextprotocol.io) - Specification, SDKs and registry documentation.
- [MCP registry repository](https://github.com/modelcontextprotocol/registry) - Registry server, `server.json` schema and publishing CLI.
- [Agent Skills specification](https://agentskills.io/specification) - Required fields and loading semantics.
- [agentskills/agentskills](https://github.com/agentskills/agentskills) - Specification source and reference tooling.
- [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) - Community index of servers.

## Related

- [6. Capabilities](../stack/06-capabilities.md) - `spec.capabilities.models[]`, `tools[]`, `skills[]`.
- [10. Governance](../stack/10-governance.md) - Per-key budgets and model allow-lists as limits.
- [3. Authentication](../stack/03-authentication.md) - MCP servers authenticate the agent with OAuth 2.1.
- [Discovery standards](../standards/discovery.md) - MCP Registry alongside A2A Agent Cards and agents.txt.
- [Security & Governance standards](../standards/security-and-governance.md) - OWASP ASI04 agentic supply chain.
- [Credentials & Tool Auth](credentials-and-tool-auth.md) - Brokers and gateways in front of tools.
- [Observability & Human-in-the-loop](observability-and-hitl.md) - Tracing model and tool calls.
