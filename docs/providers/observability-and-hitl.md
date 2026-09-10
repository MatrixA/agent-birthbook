# Observability & Human-in-the-loop

The [Governance](../stack/10-governance.md) layer is the owner's window into the agent and their hand on the brake. Four capabilities make that concrete: tracing every model call, tool call and decision so a run can be reconstructed after the fact; guardrails that inspect inputs and outputs for injection, leakage and policy violations before they take effect; metering that turns tokens, tool calls and dollars into budgets with hard stops; and a human-approval channel through which the agent can pause and ask before an action that [Authority](../stack/08-authority.md) marks as requiring a person. Agent-native tooling here understands agent structure (runs, steps, tool spans, sub-agents) rather than only HTTP requests, and lets an approval be a first-class event rather than a Slack message someone hopes to notice.

The traps: tracing captures prompts and tool arguments, which means it captures secrets and personal data unless redaction is configured; an approval channel with a default of "approve on timeout" is not an approval channel; guardrails add latency and false positives that agents learn to route around by rephrasing; and budgets enforced only inside the agent's own code are not budgets, because the code is what you are trying to bound. Put the meter at the gateway (see [Models & Skills](models-and-skills.md)) and the card (see [Payments & Cards](payments-and-cards.md)), and make `spec.governance.auditLog` point at a store the agent cannot write to selectively.

## Interfaces

- **OpenTelemetry GenAI semantic conventions** - Standard span and attribute names for model calls, tool executions and agent steps; emit these and any backend can ingest them. The interoperability layer for tracing.
- **Tracing SDK / callback** - Vendor SDKs and framework integrations (LangChain, OpenAI Agents, Claude Agent SDK, Vercel AI SDK) that produce nested traces of runs, steps and tool calls.
- **Guardrail API** - Synchronous classify/validate calls on prompts, tool arguments and completions; returns allow, block or transform.
- **Guardrail runtime** - A policy language and runner that wraps the agent loop with input, output and tool rails.
- **Metering events** - Usage events (tokens, calls, dollars) aggregated into meters and compared against entitlements; raise a hard stop when exceeded.
- **Approval request / response** - The agent posts a pending action with context; a human approves, rejects or edits through email, Slack, or a web queue; the agent resumes on the decision. Recorded in `spec.authority.approvals[]`.
- **Kill switch** - Revocation of gateway keys, wallet policies and sandbox lifetime from one place; the observability platform is usually where the button lives, even if the enforcement is elsewhere.

## Providers

| Provider | Agent-native | OSS | Pricing | Notes |
|---|---|---|---|---|
| [Langfuse](https://langfuse.com) | Yes | Yes | OSS + cloud | Traces, sessions, evaluations, prompt management; OpenTelemetry ingestion; self-hostable. |
| [LangSmith](https://smith.langchain.com) | Yes | No | Free tier | Tracing and evaluation from LangChain; works with any framework via SDK or OpenTelemetry. |
| [Arize Phoenix](https://phoenix.arize.com) | Yes | Yes | OSS + cloud | OpenTelemetry-native tracing and evaluation via OpenInference instrumentation. |
| [Braintrust](https://www.braintrust.dev) | Yes | Partial | Free tier | Evaluation-centred platform with tracing, datasets and scoring; open-source SDK. |
| [AgentOps](https://www.agentops.ai) | Yes | Yes | Free tier | Session replay and cost tracking for agents; integrations with major agent frameworks. |
| [OpenTelemetry GenAI semconv](https://opentelemetry.io/docs/specs/semconv/gen-ai/) | Yes | Yes | n/a | Not a product: the specification for GenAI spans and metrics that the platforms above accept. |
| [Lakera](https://www.lakera.ai) | Yes | No | Free tier | Prompt-injection and content-risk detection API for inputs and outputs. |
| [Guardrails AI](https://www.guardrailsai.com) | Yes | Yes | OSS + cloud | Python framework of validators applied to LLM inputs and outputs; validator hub. |
| [NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails) | Yes | Yes | n/a | NVIDIA's toolkit with Colang rails for input, output, dialogue and tool execution. |
| [OpenMeter](https://openmeter.io) | Usable | Yes | OSS + cloud | Usage metering and entitlements over CloudEvents; enforce token and call budgets per agent. |
| [LiteLLM budgets](https://docs.litellm.ai/docs/proxy/users) | Yes | Yes | OSS + cloud | Per-key and per-team spend limits in the model proxy; the enforcement point for model budgets. |
| [HumanLayer](https://www.humanlayer.dev) | Yes | Yes | Free tier | `require_approval` and `human_as_tool` decorators that route agent actions to humans over Slack, email or web and resume on response. |
| [gotoHuman](https://www.gotohuman.com) | Yes | No | Free tier | Review queues for agent outputs and actions with custom forms and webhooks back to the agent. |

## Resources

- [Langfuse docs](https://langfuse.com/docs) · [langfuse repository](https://github.com/langfuse/langfuse) - Tracing, self-hosting and OpenTelemetry.
- [LangSmith docs](https://docs.smith.langchain.com) - Tracing and evaluation.
- [Phoenix docs](https://arize.com/docs/phoenix) · [phoenix repository](https://github.com/Arize-ai/phoenix) - OpenInference instrumentation.
- [Braintrust docs](https://www.braintrust.dev/docs) - Evals and logging.
- [AgentOps docs](https://docs.agentops.ai) · [agentops repository](https://github.com/AgentOps-AI/agentops) - Session tracking.
- [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) - Span, event and metric definitions.
- [Lakera docs](https://docs.lakera.ai) - Guard API.
- [Guardrails AI docs](https://www.guardrailsai.com/docs) · [guardrails repository](https://github.com/guardrails-ai/guardrails) - Validators.
- [NeMo Guardrails docs](https://docs.nvidia.com/nemo/guardrails/) - Colang and rail configuration.
- [OpenMeter docs](https://openmeter.io/docs) · [openmeter repository](https://github.com/openmeterio/openmeter) - Meters and entitlements.
- [HumanLayer repository](https://github.com/humanlayer/humanlayer) - SDK and approval flows.
- [gotoHuman docs](https://docs.gotohuman.com) - Review requests and webhooks.
- [OWASP Top 10 for Agentic Applications](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications/) - The threat list guardrails and monitoring are aimed at.

## Related

- [10. Governance](../stack/10-governance.md) - `spec.governance.auditLog`, `limits`, `killSwitch`, `reviewCadence`.
- [8. Authority](../stack/08-authority.md) - `spec.authority.approvals[]`; which actions need a human.
- [6. Capabilities](../stack/06-capabilities.md) - The model and tool calls being traced.
- [Security & Governance standards](../standards/security-and-governance.md) - OWASP agentic threats, CSA agentic IAM, NIST monitoring guidance.
- [Models & Skills](models-and-skills.md) - Gateways where model budgets are enforced.
- [Payments & Cards](payments-and-cards.md) - Real-time authorization as a money-side approval channel.
