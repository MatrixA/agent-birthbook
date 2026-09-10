# 7. Memory

Memory is what persists between runs. Without it, every invocation is a new agent that happens to share a name; with it, the agent accumulates context, learns the owner's preferences, and can pick up a task where it left off. Memory is also the layer where the agent's history becomes an attack surface and a data-protection liability.

## What the agent needs

**Five kinds of store.** *Working* memory is the current context window and scratch state; it is gone at the end of the run. *Episodic* memory records what happened: conversations, actions taken, outcomes. *Semantic* memory holds distilled facts and preferences ("owner prefers PDFs", "vendor X was unreliable"). *Files* are documents, code and artefacts the agent reads and writes, typically object storage or a git repo. A *knowledge graph* links entities and relations for retrieval that vectors alone handle poorly. Most real agents have working memory plus one or two of the others; the manifest lets you say which.

**Continuity is what makes it "the same agent".** A human has one body and one continuous stream of experience. An agent is a process that gets restarted, migrated, or run in several copies. What makes tomorrow's process the same agent as today's is that it holds the same keys ([Identity](01-identity.md)) and reads the same memory. Identity is the anchor; memory is the continuity. Losing the keys means nobody can prove the agent is who it was; losing the memory means the agent can prove it, but no longer knows what it did. Both are lifecycle events (see [Migration](../lifecycle/migration.md) and [Death](../lifecycle/death.md)).

**Portability.** Two patterns dominate. *Markdown-in-git*: memory as plain files in a repository, human-readable, diffable, trivially backed up and moved; the agent reads and writes it like any other file. *Vendor memory APIs*: Mem0, Zep/Graphiti, Letta and similar offer extraction, deduplication, temporal reasoning and retrieval that plain files do not. The trade is convenience against lock-in. An agent whose memory lives in one vendor's API cannot be migrated without that vendor's export path. The Birth Profile records the provider so that the question is at least visible.

## Minimum vs full provisioning

| Aspect | Minimum viable | Full |
|---|---|---|
| Stores | Working memory only; files on the runtime's disk | Working + episodic + semantic + files, knowledge graph where relations matter |
| Persistence | Per-run, lost on restart | Durable store outside the runtime, survives [Compute](04-compute.md) replacement |
| Retention | Undefined | Per-store retention (ISO 8601 duration or `forever`), enforced by deletion jobs |
| Encryption | Provider default | Encryption at rest with keys the owner controls; separate keys per agent |
| Integrity | None | Writes attributed to a source (tool, user, owner) and traced; untrusted-origin content quarantined before promotion to semantic memory |
| Portability | Vendor format | Exportable to plain files; markdown-in-git or a documented export |
| Deletion | Manual | Owner-triggered purge across all stores, verified in the [audit log](10-governance.md) |

## Depends on / enables

- Depends on [4. Compute](04-compute.md) for the storage the stores live on, and on [1. Identity](01-identity.md) for the key that scopes and encrypts the agent's memory.
- Depends on [3. Authentication](03-authentication.md) for the credential to a hosted memory provider.
- Enables [6. Capabilities](06-capabilities.md) to be used well: tools without memory of past results repeat mistakes.
- Governed by [10. Governance](10-governance.md): retention, deletion and audit obligations are enforced here.

## Failure modes & gotchas

- **Memory poisoning ([OWASP ASI06](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications/)).** A web page or email the agent reads today becomes a "fact" it acts on for months. Anything written to semantic memory from untrusted input needs a provenance tag and, ideally, a review gate before it influences future decisions.
- **Secrets leaking into memory.** Episodic logs will happily store an API key that appeared in a tool result. Scrub before write; keep secrets in the [secret store](03-authentication.md), never in memory.
- **Personal data and deletion obligations.** If the agent talks to people, its episodic memory contains personal data. GDPR-style erasure requests must reach every store, including vector indexes and graph nodes, not just the primary database.
- **Retention drift.** `forever` is the default nobody chose. Set a retention per store and make the deletion job observable.
- **Encryption at rest by whom.** Provider-managed encryption protects against a lost disk, not against the provider. Owner-held keys change the threat model and the recovery story ([Governance](10-governance.md)).
- **Memory shared across agents.** A shared store makes one poisoned agent poison the fleet, and makes per-agent deletion impossible. Scope stores per agent unless sharing is the point.
- **Losing memory on migration.** Moving runtime without moving the store leaves a functioning agent that has forgotten everything; test the export path before you need it.

## Standards

- [Security & Governance](../standards/security-and-governance.md) - OWASP ASI06 memory and context poisoning; OWASP Agentic AI Threats & Mitigations.
- [Identity](../standards/identity.md) - why the key, not the memory, is the continuity anchor.
- There is no memory-format standard yet; the [Agent Skills](https://agentskills.io/) folder convention and markdown-in-git are the closest to a portable de facto format.

## Providers

- [Memory & Storage](../providers/memory-and-storage.md) - Mem0, Zep/Graphiti, Letta, LangGraph persistence, vector databases, object storage, the markdown-vault pattern.
- [Compute & Browsers](../providers/compute-and-browsers.md) - runtimes whose disks are or are not durable.
- [Observability & Human-in-the-loop](../providers/observability-and-hitl.md) - traces double as episodic memory in some setups; keep the two distinguishable.

## In the manifest

`spec.memory.stores[]` lists each store with `kind` (`working | episodic | semantic | files | knowledge-graph`), `provider` and `retention`; `spec.memory.encryptionAtRest` is a single boolean. If a store holds personal data, say so in `retention` policy terms and make sure [`spec.governance.recovery`](10-governance.md) covers the encryption keys.

```yaml
memory:
  encryptionAtRest: true
  stores:
    - { kind: working, provider: in-context, retention: PT0S }
    - { kind: episodic, provider: mem0, retention: P365D }
    - { kind: files, provider: git+r2, retention: forever }
```
