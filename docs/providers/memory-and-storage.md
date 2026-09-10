# Memory & Storage

An agent without memory restarts from zero every run: it re-learns the owner's preferences, repeats mistakes, and cannot say what it did yesterday. The [Memory](../stack/07-memory.md) layer covers everything that persists between runs: working state for the current task, episodic records of past interactions, semantic knowledge distilled from them, plain files, and knowledge graphs of entities and relations. Agent-native memory providers expose *add / search / update / forget* over natural-language content, scope memories to an agent, a user and a session, and handle the extraction and consolidation that turns a transcript into facts. Vector stores and object storage are the substrate underneath; they are not agent-native, and do not need to be.

The traps: memory is an attack surface (OWASP ASI06, memory poisoning), so what an agent writes to its own long-term store from untrusted input needs the same scrutiny as what it executes; memory is also personal data, so retention (`spec.memory.stores[].retention`) and encryption at rest (`spec.memory.encryptionAtRest`) are compliance decisions, not tuning knobs; provider lock-in is real, because exported embeddings are useless without the same model; and an agent whose memory lives only in a hosted service cannot be [migrated](../lifecycle/migration.md) or [retired](../lifecycle/death.md) cleanly unless the export path was tested at birth.

## Interfaces

- **Memory API** - `add(messages, user_id, agent_id)`, `search(query, filters)`, `get_all`, `delete`; the provider extracts facts, deduplicates and versions them.
- **Graph memory** - Temporal knowledge graph with entities, relations and validity intervals; queried by hybrid search and traversal. Graphiti and Cognee.
- **Framework checkpointer / store** - Thread-scoped checkpoints for resuming a run, plus a cross-thread key-value store; LangGraph's persistence model.
- **Vector database** - Upsert vectors with metadata, filtered nearest-neighbour search, namespaces per agent or tenant.
- **Object storage (S3 API)** - Buckets and keys for files, transcripts, artefacts; the universal interface every provider implements.
- **Files in git** - Markdown notes committed to a repository the agent clones at start and pushes at end; versioned, diffable, reviewable by a human, portable to anything.

## Providers

| Provider | Agent-native | OSS | Pricing | Notes |
|---|---|---|---|---|
| [Mem0](https://mem0.ai) | Yes | Yes | OSS + cloud | Memory layer with user/agent/session scoping, fact extraction and graph memory option; SDKs and MCP. |
| [Zep](https://www.getzep.com) + [Graphiti](https://github.com/getzep/graphiti) | Yes | Partial | Free tier | Temporal knowledge-graph memory; Graphiti is the open-source graph engine, Zep the hosted service. |
| [Letta](https://www.letta.com) | Yes | Yes | OSS + cloud | Stateful agent server (formerly MemGPT) where memory blocks are first-class and the agent edits them itself. |
| [Cognee](https://www.cognee.ai) | Yes | Yes | OSS + cloud | Builds a knowledge graph plus vectors from documents and conversations; pluggable stores. |
| [LangGraph persistence](https://langchain-ai.github.io/langgraph/concepts/persistence/) | Yes | Yes | OSS + cloud | Checkpointers for thread state and a Store for cross-thread memory; backends for Postgres, SQLite and hosted LangGraph Platform. |
| [Chroma](https://www.trychroma.com) | Usable | Yes | OSS + cloud | Embedded or server vector store; simplest local option. |
| [Qdrant](https://qdrant.tech) | Usable | Yes | OSS + cloud | Vector database with payload filtering, quantisation and multitenancy. |
| [Pinecone](https://www.pinecone.io) | Usable | No | Free tier | Serverless managed vector database with namespaces and integrated inference. |
| [Turbopuffer](https://turbopuffer.com) | Usable | No | Usage-based | Object-storage-backed vector and full-text search; low cost at rest, per-namespace isolation. |
| [pgvector](https://github.com/pgvector/pgvector) / [Supabase](https://supabase.com) | Usable | Yes | OSS + cloud | Vectors inside Postgres next to the agent's relational data; Supabase hosts it with auth and storage. |
| [Amazon S3](https://aws.amazon.com/s3/) | Usable | No | Usage-based | The reference object store; every other one speaks its API. |
| [Cloudflare R2](https://developers.cloudflare.com/r2/) | Usable | No | Usage-based | S3-compatible object storage with no egress fees; pairs with Workers-hosted agents. |
| [Tigris](https://www.tigrisdata.com) | Usable | No | Usage-based | Globally distributed S3-compatible storage with automatic placement near the requester. |
| Markdown in git | Usable | Yes | n/a | A repository of notes (often an Obsidian-compatible vault) the agent reads and writes; human-reviewable, portable, no vendor. Pattern, not product. |

## The markdown-in-git pattern

The lowest-tech option deserves a note because it solves several traps at once. The agent keeps `memory/` as a directory of markdown files: one per topic or entity, a daily log, and an index the agent loads at startup. Writes are commits; the owner reviews the diff like any pull request, which is the only memory system where poisoning is visible to a human before it takes effect. Migration is `git clone`. Death is deleting the repo. It does not scale to millions of facts or to semantic search without an index on top, but for a single-owner agent it is often the right first store, with a vector or graph layer added only when retrieval starts failing.

## Resources

- [Mem0 docs](https://docs.mem0.ai/introduction) · [mem0 repository](https://github.com/mem0ai/mem0) - API and self-hosting.
- [Zep docs](https://help.getzep.com) - Graph memory and retrieval.
- [Letta docs](https://docs.letta.com) · [letta repository](https://github.com/letta-ai/letta) - Memory blocks and agent state.
- [Cognee docs](https://docs.cognee.ai) - Pipelines and graph construction.
- [Chroma docs](https://docs.trychroma.com) · [Qdrant docs](https://qdrant.tech/documentation/) · [Pinecone docs](https://docs.pinecone.io) · [Turbopuffer docs](https://turbopuffer.com/docs) - Vector store references.
- [Supabase AI & vectors](https://supabase.com/docs/guides/ai) - pgvector in a hosted Postgres.
- [Amazon S3 docs](https://docs.aws.amazon.com/s3/) · [Tigris docs](https://www.tigrisdata.com/docs/) - Object storage APIs.
- [Obsidian](https://obsidian.md) - A human-facing viewer for the markdown vault pattern.

## Related

- [7. Memory](../stack/07-memory.md) - `spec.memory.stores[]` and `encryptionAtRest`.
- [4. Compute](../stack/04-compute.md) - `spec.compute.storage`, the disk the agent runs on versus the memory it keeps.
- [10. Governance](../stack/10-governance.md) - Retention, export and purge as governance controls.
- [Security & Governance standards](../standards/security-and-governance.md) - OWASP ASI06 memory and context poisoning.
- [Compute & Browsers](compute-and-browsers.md) - Where the working filesystem lives.
