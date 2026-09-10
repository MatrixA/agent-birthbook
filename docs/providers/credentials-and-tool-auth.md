# Credentials & Tool Auth

Every tool an agent calls on someone else's system wants a credential: an OAuth grant to the owner's Google Workspace, an API key for a data vendor, a GitHub App installation token, a database password. The [Authentication](../stack/03-authentication.md) layer is about where those credentials live and how the agent gets to use one without ever being able to read it. Agent-native providers here do three things: hold tokens in a vault the agent's process cannot dump, hand the agent a short-lived, narrowly scoped credential (or perform the call on its behalf) per action, and give the owner a single place to see and revoke every grant the agent holds.

The traps are the ones every leaked-key incident is made of: long-lived secrets in environment variables inside a sandbox that also runs untrusted code; OAuth grants requested with the owner's full scope because the connector asked for it; tokens that outlive the agent because nobody wired [Death](../lifecycle/death.md) to the vault; and "just use my session" browser cookies that give the agent everything the owner can do. Whatever provider you pick, the test is whether `spec.authentication.credentials[].secretRef` points at something outside the agent's runtime and whether `rotation` is a schedule, not a hope.

## Three groups

**Tool-auth brokers and token vaults.** These sit between the agent and hundreds of third-party APIs. The owner (or the end user the agent serves) completes the OAuth dance once; the broker stores the refresh token, refreshes it, and exposes each API as a tool call the agent can make through the broker's own credential. The agent never sees the third-party token. Composio, Arcade, Nango, Pipedream Connect and Paragon are the main options; the differences are catalogue size, whether tools are pre-wrapped for LLMs, self-hosting, and how granular the per-tool scoping is.

**Identity providers with agent features.** Enterprise IdPs have started to register agents as first-class principals alongside users and service accounts. Auth0 for AI Agents adds a Token Vault for third-party tokens and async user-confirmation flows; Okta registers agents in Universal Directory and governs them through its identity fabric; WorkOS AuthKit and Descope's Agentic Identity Hub give an application's own MCP server OAuth 2.1 with tool-level scopes; Microsoft Entra Agent ID gives agents Entra identities with conditional access; Keycard issues short-lived composite credentials (user + device + agent + task) after policy evaluation. Choose one of these when the agent must be an identity in the same directory the humans are in, so that access reviews and offboarding cover it.

**Secret stores.** For credentials that are not OAuth grants (API keys, database passwords, signing keys) the answer is a secrets manager with dynamic or short-TTL secrets and an audit log: 1Password SDKs and Agentic Autofill (which fills a login in the agent's remote browser over an encrypted channel with human approval, without exposing the password to the model), HashiCorp Vault, Infisical, Doppler and Bitwarden Secrets Manager. Add an **MCP gateway** such as agentgateway in front of the agent's tool servers so that authentication, rate limits and logging are enforced once, at the boundary, rather than inside each server.

## Interfaces

- **Managed OAuth + tool proxy** - Broker holds the token; agent calls `execute(tool, args)`; broker injects the credential.
- **Token Vault / token exchange** - Agent presents its own identity token and receives a downstream access token via [RFC 8693](https://www.rfc-editor.org/rfc/rfc8693) style exchange, scoped to the requested resource.
- **MCP Authorization** - OAuth 2.1 with protected-resource metadata, as specified in the [MCP authorization spec](https://modelcontextprotocol.io/specification/draft/basic/authorization); the interface an agent uses to log in to an MCP server.
- **Workload identity** - [SPIFFE](https://spiffe.io/) SVIDs or cloud IAM roles bound to the agent's runtime instead of static keys.
- **Secrets API / SDK** - Read a secret by reference at call time; dynamic secrets generated per lease and revoked on expiry.
- **Approval-gated autofill** - The vault fills a form in a headless browser after the owner approves; the model never sees the secret.
- **MCP / A2A gateway** - A data plane that terminates auth, applies policy and emits telemetry for every tool call.

## Providers

| Provider | Agent-native | OSS | Pricing | Notes |
|---|---|---|---|---|
| [Composio](https://composio.dev) | Yes | Partial | Free tier | Managed auth and pre-wrapped tools for several hundred apps; per-user connected accounts; MCP servers. |
| [Arcade](https://www.arcade.dev) | Yes | Partial | Free tier | Tool-calling platform with a built-in auth broker; tools run in Arcade's runtime with the user's token. |
| [Nango](https://nango.dev) | Usable | Yes | OSS + cloud | Open-source OAuth broker and API proxy; self-host the token store. |
| [Pipedream Connect](https://pipedream.com/connect) | Yes | Partial | Usage-based | Managed auth for thousands of APIs plus an MCP server per connected app. |
| [Paragon](https://www.useparagon.com) | Usable | No | Paid | Embedded-integration platform with managed auth and an agent-facing tool layer (ActionKit). |
| [Auth0 for AI Agents](https://auth0.com/ai) | Yes | No | Free tier | Token Vault for third-party tokens, user authentication for agents, async authorization, fine-grained authorization for RAG. |
| [Okta for AI Agents](https://www.okta.com/products/govern-ai-agent-identity/) | Usable | No | Paid | Agents registered in Universal Directory with ownership, posture management and privileged access; Cross App Access (XAA) for app-to-app OAuth. |
| [WorkOS AuthKit](https://workos.com/authkit) | Usable | No | Free tier | Hosted auth with OAuth 2.1 support for turning your own MCP server into a protected resource. |
| [Descope Agentic Identity Hub](https://docs.descope.com/agentic-identity-hub) | Yes | No | Free tier | Inbound (your MCP server as IdP) and outbound (credential vault for agent tool tokens) apps with policy controls and agent-level audit. |
| [Microsoft Entra Agent ID](https://learn.microsoft.com/en-us/entra/agent-id/) | Yes | No | Paid | Agent identities in Entra with conditional access, lifecycle and audit; for organisations already on Microsoft 365 / Azure. |
| [Keycard](https://keycard.ai) | Yes | No | Paid | Policy-evaluated, short-lived scoped credentials built from user, device, agent and task context; tamper-evident audit trail. |
| [1Password](https://developer.1password.com/docs/agentic-autofill/) | Yes | Partial | Paid | Agentic Autofill fills logins in remote browsers with human approval; SDKs and Service Accounts for reading secrets by reference. |
| [HashiCorp Vault](https://developer.hashicorp.com/vault) | Usable | Yes | OSS + cloud | Dynamic secrets, leases, PKI and transit encryption; the mature choice when the agent already runs in infrastructure Vault knows. |
| [Infisical](https://infisical.com) | Usable | Yes | OSS + cloud | Open-source secrets manager with machine identities, dynamic secrets and PKI. |
| [Doppler](https://www.doppler.com) | Usable | No | Free tier | Hosted secrets manager with service tokens and sync to runtimes. |
| [Bitwarden Secrets Manager](https://bitwarden.com/products/secrets-manager/) | Usable | Yes | Free tier | Machine accounts with scoped access tokens; open-source clients. |
| [agentgateway](https://agentgateway.dev) | Yes | Yes | n/a | Open-source gateway for MCP, A2A and LLM traffic with auth, policy and OpenTelemetry; Linux Foundation project. |

## Resources

- [Composio docs](https://docs.composio.dev) · [Arcade docs](https://docs.arcade.dev) · [Nango docs](https://nango.dev/docs/) · [Pipedream Connect docs](https://pipedream.com/docs/connect) · [Paragon docs](https://docs.useparagon.com) - Broker setup and scoping.
- [Auth0 Token Vault](https://auth0.com/docs/secure/tokens/token-vault) - Storing and exchanging third-party tokens for agents.
- [WorkOS docs](https://workos.com/docs) - AuthKit and MCP authorization.
- [1Password SDKs](https://developer.1password.com/docs/sdks/) - Programmatic secret access with service accounts.
- [Vault dynamic secrets](https://developer.hashicorp.com/vault/docs/secrets/aws) - Example of leased, auto-revoked credentials.
- [Cloudflare Secrets Store](https://developers.cloudflare.com/secrets-store/) - Account-level secrets for Workers-hosted agents.
- [MCP Authorization specification](https://modelcontextprotocol.io/specification/draft/basic/authorization) - The OAuth profile MCP clients and servers implement.
- [SPIFFE](https://spiffe.io/) - Workload identity in place of static keys.

## Related

- [3. Authentication](../stack/03-authentication.md) - `spec.authentication.secretStore` and `credentials[]`.
- [8. Authority](../stack/08-authority.md) - Scopes are the machine-readable form of a delegation.
- [Authentication & Delegation standards](../standards/auth-and-delegation.md) - MCP Authorization, RFC 8693, GNAP, WIMSE, on-behalf-of drafts.
- [Credential Rotation](../lifecycle/credential-rotation.md) - Rotation schedules and revocation on death.
- [Compute & Browsers](compute-and-browsers.md) - Where autofill keeps secrets out of the browser context.
- [Models & Skills](models-and-skills.md) - Tool registries the gateway sits in front of.
