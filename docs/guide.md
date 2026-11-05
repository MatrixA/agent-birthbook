# High-Level Guide to the Agent Birthbook

This guide is the fastest way to understand what the Birthbook is, why it exists, and how to use it — whether you are designing a new agent, auditing an existing one, evaluating a provider, or just trying to understand why autonomous agents fail.

---

## Why agents fail at provisioning, not at reasoning

When an autonomous agent stops working, the cause is usually not the model. It is a provisioning gap: the agent cannot receive the verification email sent to an inbox it does not control, the API key it was given is scoped too broadly and gets revoked after the first suspicious call, the wallet has funds but no spending limit so the guardrail layer refuses every transaction, or nobody wrote down how to switch it off.

These are not edge cases. They are the default outcome of deploying an agent whose existence was designed around the prompt and not around what the agent needs in order to *act in the world as a persistent, accountable digital actor*.

The Agent Birthbook maps that territory. It is not a framework, an SDK, or a protocol. It is a knowledge base organized around a single question:

> **What must an autonomous agent be given in order to exist and act in the digital world?**

---

## The Agent Birth Stack: ten layers

The Birthbook answers that question with a ten-layer model called the **Agent Birth Stack**. Each layer is a *kind of thing* the agent needs — not a product, not a protocol. Products and protocols live one level down as providers and standards that satisfy a layer.

```
10 · Governance        audit · limits · kill switch · recovery
 9 · Trust             credentials · attestations · reputation · KYA
 8 · Authority         principal · delegation · approvals
─────────────────── SAFETY ────────────────────────────────────────
 7 · Memory            state · knowledge · files
 6 · Capabilities      models · tools · skills
 5 · Economic Identity wallet · card · budget
 4 · Compute           runtime · browser · network · storage
─────────────────── ACTION ────────────────────────────────────────
 3 · Authentication    OAuth · API keys · signatures · secret store
 2 · Presence          email · domain · phone · endpoints
 1 · Identity          name · DID · keys · owner
─────────────────── EXISTENCE ─────────────────────────────────────
```

Read the stack bottom-up. The three bands tell the story:

**Existence (1–3):** The agent *is* someone, *can be reached*, and *can prove it*.  
**Action (4–7):** It has somewhere to run, something to spend, things it can do, and continuity between runs.  
**Safety (8–10):** Its power is bounded, others have reason to believe it, and a human can see, limit, and stop it.

The full model, with dependency edges between layers, is in [The Agent Birth Stack](birth-stack.md).

---

## What each layer means

### 1 · Identity

A stable answer to *who is this agent and who is responsible for it*: a name, a resolvable identifier (usually a [W3C DID](https://www.w3.org/TR/did-core/)), signing keys, and an **owner**.

The owner is the part that is different from service identity. An agent is not a legal person; nothing it signs is binding unless a human or company stands behind it. The owner holds the kill switch, passes KYC checks, and grants delegations. An agent with no owner is unverifiable by design.

Key custody — where the private key lives — decides how autonomous and how recoverable the agent is. Provider custody under a policy engine is the common middle: the agent signs freely within policy bounds, and the owner can revoke with a single API call.

→ [1. Identity](stack/01-identity.md)

---

### 2 · Presence

The addresses at which the agent can be found and contacted: an email address, a domain, a phone number, protocol endpoints.

This layer contains the most underestimated bootstrap problem in agent provisioning. Many services verify an agent account by sending a verification email or SMS. If the agent does not control the inbox or the phone number *at the moment of signup*, it cannot complete verification. Presence is a hard dependency for Authentication and all credential-dependent layers above it; Identity remains the root of the whole stack and comes before Presence.

The practical guidance is: provision the email address on a domain the owner controls. Do not use a free webmail account for a production agent. If a phone number is needed for OTP receipt, budget for it; it is the hardest resource to provision at scale.

→ [2. Presence](stack/02-presence.md)

---

### 3 · Authentication

The credentials the agent presents to other systems: OAuth grants, API keys, HTTP request signatures, workload identity certificates, and the **secret store** that holds them.

The critical rule: credentials are referenced, never embedded. A key that lives in a configuration file is a key that will eventually leak. A key in a secret store with a rotation schedule, an audit trail, and a scope limit is a key that can be recovered from.

Scope matters as much as secrecy. An API key that can read and write everything is a liability. An API key scoped to one endpoint and one operation is a containment boundary.

→ [3. Authentication](stack/03-authentication.md)

---

### 4 · Compute

Where the agent's code executes and what it can touch: a sandbox or VM, a browser, network egress rules, disk.

The key design decisions are isolation and egress. An agent that runs in a shared process or on a bare host without egress restrictions can reach any network endpoint and affect any file. An agent in an isolated sandbox with an egress allowlist can only reach what it needs. The sandbox is not a performance consideration; it is a blast radius decision.

Storage deserves separate attention: persistent agent state should not live on the same filesystem as the runtime. Losing the runtime should not mean losing the memory.

→ [4. Compute](stack/04-compute.md)

---

### 5 · Economic Identity

The agent's ability to hold and move value: wallets, cards, a budget, and the payment protocols it speaks.

The critical principle: **the owner passes KYC, not the agent**. An agent cannot be a legal counterparty. The economic identity layer is about giving the agent access to financial instruments that are owned, funded, and monitored by a human entity.

Budget limits are not optional niceties. A wallet with no spend cap and a runaway loop is a financial incident. The minimum viable configuration is a provider-side spend cap on one account. Full production adds hard per-transaction, per-day, and per-month limits enforced at the custodian, plus soft alerts at 50% and 80% of the daily budget.

→ [5. Economic Identity](stack/05-economy.md)

---

### 6 · Capabilities

What the agent can actually do: model access, tools (MCP servers, CLI tools, HTTP endpoints), and packaged skills.

Tool supply-chain risk is the dominant concern at this layer. A tool is code the agent will execute with its own credentials on its own compute. An unvetted MCP server is not a convenience; it is an untrusted code execution surface. Treat tool sources the way you treat npm packages: pin versions, review changes, prefer known registries.

Model access should go through a gateway with a budget cap, not directly to a provider with an unbounded key.

→ [6. Capabilities](stack/06-capabilities.md)

---

### 7 · Memory

What persists between runs: working context in the prompt window, episodic memory of past actions, semantic memory in a vector store, files, knowledge graphs.

Memory is an attack surface. Prompt injection via retrieved memory — where an adversarial string stored in a past interaction surfaces in a future retrieval and hijacks the agent's reasoning — is a real and documented attack class. Retention policies, access controls on memory stores, and encryption at rest are not academic; they are operational hygiene.

→ [7. Memory](stack/07-memory.md)

---

### 8 · Authority

What the agent is permitted to do, on whose behalf, how far it may delegate, and which actions require a human in the loop.

Capability is not permission. An agent with a wallet does not thereby have permission to spend. The authority layer is where "has access to" becomes "is authorized to", with explicit scope, an expiry, and an audit trail.

Delegations should attenuate: a delegation can only grant permissions the grantor has, and it should grant fewer than all of them. An agent that received a delegation to "manage files" should not be able to sub-delegate "delete all files."

→ [8. Authority](stack/08-authority.md)

---

### 9 · Trust

Why a third party should believe the agent is what it claims: verifiable credentials, attestations, reputation, Know-Your-Agent (KYA) checks.

Registrations — in a DID registry, an on-chain identity system, a signed A2A agent card published at `/.well-known/agent-card.json` — provide verifiable evidence that the agent is who it says it is (a card with a JWS operator signature is verifiable; an unsigned self-published card proves only domain control). These registrations should be made *after* the kill switch exists (layer 10), so that any party relying on the registration can follow the owner attestation to find the control surface.

→ [9. Trust](stack/09-trust.md)

---

### 10 · Governance

How the owner watches, limits, recovers, and if needed kills the agent: an audit log, spend and rate limits, a kill switch, a recovery path.

Governance is the last layer provisioned — it has to reach into all the others: the audit log records what Capabilities did, the limits cap Economic Identity and Compute, and the kill switch must be able to revoke Authentication and Authority even if the agent's own runtime is compromised. Decide the controller and mechanism early, but wire and test the switch at this layer, before the agent takes any consequential action. The audit log is equally important: without it, post-incident investigation is impossible and human oversight is theatrical.

→ [10. Governance](stack/10-governance.md)

---

## The provisioning lifecycle

The stack describes *what* the agent needs. The [Birth Procedure](lifecycle/birth.md) describes *when* to provision it and in what order.

The order matters because of the bootstrap dependencies. Email must come before account signups. A secret store must come before credentials are issued. A kill switch must exist before consequential actions begin.

The lifecycle also covers what happens after birth:

- **[Credential Rotation](lifecycle/credential-rotation.md):** Every credential issued at birth will expire or should be rotated. The plan for rotation is part of the provisioning design, not an afterthought.
- **[Migration](lifecycle/migration.md):** Agents move — between compute providers, between model providers, between owners. The rule of thumb from the migration chapter: state is portable, credentials are re-provisioned, and anything that binds identity to a party is re-attested. Memory, capabilities and economic identity generally migrate; trust credentials and owner-bound keys must be re-attested; OAuth grants and platform verifications are re-provisioned; a domain move re-provisions the DID.
- **[Death](lifecycle/death.md):** A decommissioned agent that retains live credentials, an open inbox, and an active wallet is a security liability. The wind-down sequence — revoke credentials, close inboxes, drain and close wallets, publish the death event — is as important as the birth sequence.

---

## Standards and protocols

The Birthbook does not advocate for one standard over another. It places each standard in the layer it fills and notes what it competes with.

| Area | Active standards |
|---|---|
| Identity (layer 1) | W3C DID + VC, A2A Agent Card, ERC-8004, AIMS/Agent Manifest, HCS-14, Microsoft Entra Agent ID |
| Authentication (layer 3) | MCP Authorization (OAuth 2.1 based), RFC 8693 Token Exchange, GNAP, SPIFFE, Web Bot Auth / RFC 9421 |
| Economic Identity (layer 5) | x402, Google AP2, Visa Trusted Agent Protocol, Mastercard Agent Pay, Agentic Commerce Protocol (OpenAI + Stripe), Stripe Shared Payment Tokens |
| Discovery (layers 2 + 6) | `/.well-known/agent-card.json`, agents.txt, llms.txt, MCP Registry, NANDA |
| Security & Governance (layers 8–10) | OWASP Top 10 for Agentic Applications, CSA Agentic IAM, NIST CAISI, EU AI Act |

The [standards map](https://matrixa.github.io/agent-birthbook/standards/index.html) shows maturity, overlap, and where each spec fits in the stack.

---

## Birth providers

For each layer there is a curated set of providers — services that actually hand an agent the resource the layer requires. The [provider chapters](https://matrixa.github.io/agent-birthbook/providers/index.html) each start with the interface requirements, then give a comparison table (agent-native support, open-source availability, pricing model, notes), then links.

| Resource | Where to look |
|---|---|
| Email | [Email providers](providers/email.md) |
| Phone / OTP receipt | [Phone providers](providers/phone.md) |
| Domain + DNS | [Domain providers](providers/domains.md) |
| Sandboxes + browsers | [Compute & Browsers](providers/compute-and-browsers.md) |
| Wallets + signing keys | [Wallets & Keys](providers/wallets.md) |
| Cards + payment rails | [Payments & Cards](providers/payments-and-cards.md) |
| OAuth + secret stores | [Credentials & Tool Auth](providers/credentials-and-tool-auth.md) |
| Vector stores + episodic memory | [Memory & Storage](providers/memory-and-storage.md) |
| Model gateways + MCP registries | [Models & Skills](providers/models-and-skills.md) |
| Tracing + human-in-the-loop | [Observability & HITL](providers/observability-and-hitl.md) |
| Bot accounts + legal wrappers | [Accounts & Legal Entity](providers/accounts-and-legal-entity.md) |

---

## The Agent Birth Manifest

`birth.yaml` is the experimental machine-readable Agent Birth Manifest (ABM) format; each agent's file is a Birth Profile. It has one section per layer, no secrets, owner required. It is designed to be version-controlled alongside the agent and to serve as the living checklist of what has been provisioned and what has not.

A minimal manifest that passes schema validation is not the same as a complete provisioning. The manifest captures intent; the provisioning checklist in [Birth](lifecycle/birth.md) captures verification.

A worked example — a research agent with provider-custodied keys, own-domain email, an E2B sandbox, a Coinbase CDP wallet with layered budget limits, Slack approvals, and Langfuse audit log — is at [`manifests/examples/research-agent.birth.yaml`](https://github.com/MatrixA/agent-birthbook/blob/main/manifests/examples/research-agent.birth.yaml).

→ [birth.yaml walkthrough](manifest.md) · [JSON Schema](https://github.com/MatrixA/agent-birthbook/blob/main/manifests/schema.json)

---

## How to use this book

**Designing a new agent?**  
Read [The Agent Birth Stack](birth-stack.md) end to end. Walk through the [Birth checklist](lifecycle/birth.md) layer by layer. Fill in a [Birth Profile](manifest.md) as you go; the gaps in the manifest are your to-do list. Decide the kill-switch controller and mechanism early, even though Governance is provisioned last.

**Choosing a provider for one thing?**  
Go to the matching [provider chapter](https://matrixa.github.io/agent-birthbook/providers/index.html). Each one starts with the interface requirements, so you can check whether a candidate provider actually satisfies the layer, not just whether it has a relevant-sounding product name.

**Auditing an existing agent?**  
Start at [Governance](stack/10-governance.md) and work down. The two questions that matter most: "Who can stop this agent and how?" and "What has the agent done in the last 30 days?" If either has no answer, that is the first gap to close.

**Evaluating a standard?**  
The [standards map](https://matrixa.github.io/agent-birthbook/standards/index.html) places each spec in the layer it fills, states its maturity, and identifies what it competes with or complements.

**Planning decommission?**  
[Death](lifecycle/death.md) covers the wind-down order, what to retain for compliance purposes, and how to handle orphaned agents whose owner is no longer reachable.

---

## Quick-reference checklist

The shortest version. The full version, with three to six items per layer, is in [Birth](lifecycle/birth.md).

- [ ] **Identity** — a named owner, a DID or registry entry, a signing key with a chosen custody model
- [ ] **Presence** — an email on a domain the owner controls; endpoints published where counterparties look
- [ ] **Authentication** — a secret store; every credential scoped, referenced not embedded, with a rotation period
- [ ] **Compute** — an isolated runtime; egress allowlisted; storage separate from the runtime
- [ ] **Economic Identity** — a wallet or card under policy; hard per-transaction and daily limits
- [ ] **Capabilities** — model access through a gateway with a budget; tools from known sources only
- [ ] **Memory** — stores named, retention set, encrypted at rest
- [ ] **Authority** — delegations scoped and expiring; actions that need a human listed explicitly
- [ ] **Trust** — owner attestation published; registrations made *after* the kill switch exists
- [ ] **Governance** — audit log flowing; kill switch tested; recovery path written down; review cadence set

---

## What this book does not cover

**Agent frameworks and orchestration.** How you build the agent's reasoning loop, choose prompts, structure its tools, or evaluate its outputs is out of scope. Those topics are covered well elsewhere; see [Related Projects](related.md) for the lists that catalogue frameworks, model rankings, and MCP server catalogues.

**Model selection.** Which model to use for which task is not a provisioning question. The Birthbook cares only that model access is provisioned through a gateway with a budget cap and that the model endpoint is reachable from the agent's compute environment.

**Security in the agent's reasoning.** Prompt injection via the prompt window is an important topic, but it is distinct from provisioning-layer security. The Birthbook covers memory as an attack surface and tool supply-chain risk, which are provisioning decisions; it does not cover how to design a reasoning loop that resists manipulation.

The boundary is deliberate: Birthbook is a map of the territory between *the agent's first line of code* and *the world the agent acts in*. Everything inside the agent — its logic, its prompts, its training — is out of scope by design.
