# 6. Capabilities

Capabilities are what the agent can actually do: which models it can call, which tools it can invoke, and which packaged skills it has loaded. Everything below this layer gives the agent a place to stand; this layer gives it hands. It is also the layer where most of the agent-framework ecosystem lives, and where most supply-chain risk enters.

## What the agent needs

**Model access.** An agent needs at least one model it can call, and in practice a primary, a fallback, and often a cheaper model for embeddings or classification. The choice is *direct* (an API key for one vendor) versus *gateway or router* (OpenRouter, LiteLLM, Portkey, Vercel or Cloudflare AI Gateway). Gateways matter for agents more than for chat apps because they put a per-key budget, a rate limit, and a fallback chain in front of a process that will otherwise run until the credit card says no. A human notices a $400 bill; an agent in a retry loop does not. Model access is also where [Economic Identity](05-economy.md) and Capabilities meet: the model bill is usually the agent's largest recurring cost.

**Tools.** A tool is anything the agent can call with structured arguments. Four kinds recur: MCP servers (the [Model Context Protocol](https://modelcontextprotocol.io/) has become the default way to expose a tool to any agent), CLIs the agent runs in its sandbox, plain HTTP APIs, and SDKs linked into the agent's own code. Each carries a credential from [Authentication](03-authentication.md) and each is a channel through which untrusted data reaches the model. Agents differ from services here: a service calls the tools its developer wired in; an agent chooses at runtime, from a menu, based on text it read. The menu is therefore a security boundary.

**Skills.** Skills are the emerging unit of packaged procedural knowledge: a folder with a `SKILL.md` (name, description, instructions) plus optional scripts and references, loaded on demand. Anthropic released the format as the open [Agent Skills](https://agentskills.io/) specification and it is now read by many agent products. A skill is not a tool; it is instructions *about* using tools, which means it is executable prose and should be reviewed as code.

**Frameworks live here, not above.** LangGraph, the Claude Agent SDK, the OpenAI Agents SDK, CrewAI and similar orchestrators are ways of arranging models, tools and skills into a loop. They are fillers for this layer. Birthbook does not choose one; it asks what the loop has been given.

## Minimum vs full provisioning

| Aspect | Minimum viable | Full |
|---|---|---|
| Models | One API key, one model | Gateway with per-key budget, primary + fallback + embedding roles, provider outage routing |
| Tool inventory | Hand-picked list in config | Signed manifest of tools, pinned versions, registry source recorded per tool |
| Tool auth | Static keys in env | Scoped, rotating credentials via a tool-auth broker (see [Authentication](03-authentication.md)) |
| Skills | None, or a few local `SKILL.md` folders | Versioned skill set from a reviewed internal repo; no auto-install from public indexes |
| Least capability | "Everything the framework ships" | Allowlist per task; dangerous tools gated by [Authority](08-authority.md) approvals |
| Supply chain | Trust the registry | Pin by hash, verify publisher, sandbox each MCP server separately in [Compute](04-compute.md) |

## Depends on / enables

- Depends on [3. Authentication](03-authentication.md) for every credential a tool needs, and on [4. Compute](04-compute.md) for somewhere to run CLIs and MCP servers.
- Depends on [5. Economic Identity](05-economy.md): model calls and paid APIs (x402 endpoints) draw on the budget.
- Gated by [8. Authority](08-authority.md): having a tool is not permission to use it.
- Feeds [9. Trust](09-trust.md): provenance claims ("which model, which tools") are part of what a counterparty verifies.

## Failure modes & gotchas

- **Tool supply-chain compromise ([OWASP ASI04](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications/)).** A public MCP server or skill can be updated under you. A tool description is prompt text the model reads; a malicious update can redirect behaviour without touching your code. Pin versions, record `source` per tool, and review descriptions as untrusted input.
- **Tool misuse (ASI02).** A legitimate `shell` or `send_email` tool with too-wide arguments is the usual escalation path. Narrow the tool, not just the prompt.
- **Runaway model spend.** Direct keys with no budget cap plus a retry loop is the classic first incident. Put a hard per-key limit at the gateway, not only in the agent.
- **Fallback to a weaker model silently changes behaviour.** Log which model served each step (see [Governance](10-governance.md)); a fallback that fires at 3am should be visible in the trace.
- **Skills as an unreviewed code path.** `SKILL.md` can bundle scripts. Treat a skill install like a dependency bump with a diff review.
- **Least capability is not the default.** Frameworks ship with broad tool sets enabled. The Birth Profile should list what is *on*, and that list should be shorter than what is installed.
- **Provider ToS.** Some model providers forbid re-selling access or automated account creation; a gateway account is the owner's, not the agent's.

## Standards

- [Security & Governance](../standards/security-and-governance.md) - OWASP Top 10 for Agentic Applications (ASI02 tool misuse, ASI04 supply chain).
- [Authentication & Delegation](../standards/auth-and-delegation.md) - MCP Authorization (OAuth 2.1, RFC 9728, RFC 8707) for tool servers.
- [Discovery](../standards/discovery.md) - MCP Registry and how tools are found and identified.
- [Model Context Protocol](https://modelcontextprotocol.io/) - the tool-server protocol itself.
- [Agent Skills specification](https://agentskills.io/specification) - the `SKILL.md` format.

## Providers

- [Models & Skills](../providers/models-and-skills.md) - model gateways and routers, MCP registries, skill indexes.
- [Credentials & Tool Auth](../providers/credentials-and-tool-auth.md) - brokers that hand tools scoped credentials.
- [Compute & Browsers](../providers/compute-and-browsers.md) - where CLIs and MCP servers execute.
- [Observability & Human-in-the-loop](../providers/observability-and-hitl.md) - tracing which tool was called with what.

## In the manifest

`spec.capabilities.models[]` records `id`, `via` (the gateway, if any) and `role`; `spec.capabilities.tools[]` records `name`, `kind` (`mcp | cli | http | sdk | skill`) and `source`; `spec.capabilities.skills[]` lists skill names. The `source` field is the supply-chain anchor: it should be a URL you could pin a hash against.

```yaml
capabilities:
  models:
    - { id: anthropic/claude-sonnet-4-6, via: openrouter, role: primary }
  tools:
    - { name: fetch, kind: mcp, source: https://github.com/modelcontextprotocol/servers }
  skills: [literature-review]
```
