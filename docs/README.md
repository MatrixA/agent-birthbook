# Agent Birthbook

**The reference architecture for autonomous agent provisioning.**

> **Agent Birthbook is not another agent identity standard.**
> Identity answers *who an agent is*.
> Birthbook asks *what an agent needs in order to exist and act as an autonomous digital actor.*

Humans arrive with a birth certificate and spend two decades collecting the rest: a name, an address, a phone, a bank account, keys to a place to work, permission to sign things, a reputation, and someone who can step in when it goes wrong. An autonomous agent needs the same set of things and gets none of them by default. Most of the interesting failures in agent deployments are not model failures; they are *provisioning* failures — an agent that cannot receive the verification email, that holds a wallet but no spending limit, that has an API key nobody rotates, that nobody can switch off.

This book is a map of that territory.

## What is in it

| Part | What you get |
|---|---|
| [The Agent Birth Stack](birth-stack.md) | The ten-layer concept model: Identity, Presence, Authentication, Compute, Economic Identity, Capabilities, Memory, Authority, Trust, Governance. |
| [The Stack, layer by layer](stack/01-identity.md) | One chapter per layer: what the agent needs, minimum vs full provisioning, failure modes, which standards and providers fill it. |
| [Standards & Protocols](standards/README.md) | DIDs and VCs, A2A Agent Cards, ERC-8004, AIMS, MCP authorization, OAuth token exchange, x402, AP2, Web Bot Auth, OWASP Agentic Top 10 — where each one sits in the stack and how they overlap. |
| [Birth Providers](providers/README.md) | Curated tables of who actually hands an agent an inbox, a phone number, a domain, a sandbox, a wallet, a card, a secret store, memory, model access, tools, observability, or a legal wrapper. |
| [Lifecycle](lifecycle/birth.md) | The Birth Procedure as a checklist, plus credential rotation, migration between providers or owners, and death — revocation and wind-down. |
| [Agent Birth Manifest](manifest.md) | `birth.yaml`: an experimental machine-readable Birth Profile, with a JSON Schema and a worked example. |

## How to read it

- **Designing a new agent?** Read [The Agent Birth Stack](birth-stack.md), then walk the [Birth checklist](lifecycle/birth.md). Fill in a [Birth Profile](manifest.md) as you go; the gaps are your to-do list.
- **Choosing a vendor for one thing?** Go straight to the matching [provider chapter](providers/README.md). Each starts with the interfaces, then a comparison table.
- **Evaluating a standard?** The [standards map](standards/README.md) shows which layer it fills and what it competes with.
- **Auditing an existing agent?** Use [Governance](stack/10-governance.md) and [Death](lifecycle/death.md): if you cannot answer "who can stop it, and how", start there.

## Vocabulary

| Term | Meaning |
|---|---|
| **Agent Birthbook** | This knowledge base. |
| **Agent Birth Stack** | The ten-layer model of what an agent must be given. |
| **Agent Birth Manifest (ABM)** | The machine-readable format, `birth.yaml`. |
| **Birth Profile** | One agent's manifest — an instance of the ABM. |
| **Birth Provider** | Anyone who provisions a resource to an agent: an email service, a wallet platform, a sandbox vendor, a registrar. |
| **Birth Procedure** | The provisioning lifecycle: birth, rotation, migration, death. |

Longer definitions, and the identity vocabulary the book borrows (DID, VC, KYA, delegation), are in the [Glossary](glossary.md).

## Scope

In: anything an agent must be *given* to act — identifiers, addresses, credentials, compute, money, capabilities, memory, permissions, trust signals, controls.

Out: how to build the agent itself. Frameworks, orchestration, prompting, evaluation and model choice are well covered elsewhere; see [Related Projects](related.md).

## Status

Living document. Layer definitions are stable; provider tables and standard maturity ratings will churn and are dated where it matters. The manifest is an experimental seed, not a spec. Contributions go through the repository's `CONTRIBUTING.md`; content is CC0.
