# Contributing to Agent Birthbook

Thanks for helping document what agents need to exist. Pull requests welcome.

## What belongs here

- **Standards & protocols** that give an agent identity, credentials, authority, trust, or the ability to pay — at any maturity (draft / adopted / production), as long as the spec is public.
- **Providers** that hand an agent a real-world resource: an inbox, a phone number, a domain, a sandbox, a wallet, a card, a secret store, memory, model access, skills, observability, or a legal wrapper. Agent-native products and general-purpose products an agent can realistically use both count.
- **Lifecycle practices**: provisioning, rotation, migration, revocation, wind-down.
- Corrections. Pricing and maturity drift fast; a PR that only fixes a stale fact is a good PR.

## What does not belong here

- Agent *frameworks* and orchestration libraries (LangGraph, CrewAI, AutoGen…). Plenty of awesome lists cover those — see [Related Projects](docs/related.md).
- Model rankings, prompt libraries, benchmarks.
- Anything you cannot link to a public page.

## Entry format

Link lists use the awesome-list convention, one entry per line:

```markdown
- [Name](https://example.com) - One sentence, ending with a period.
```

Comparison tables use the columns already present in the file you are editing. Keep descriptions factual; no marketing adjectives.

## Adding a standard

Add a row to the relevant `docs/standards/*.md` table with **Layer**, **Maturity** (`Draft` = not yet stable / no production users, `Adopted` = published RFC or equivalent, `Production` = shipped and in real use) and **Backed by**. If it does not fit any layer of the [Birth Stack](docs/birth-stack.md), open an issue first — it may not belong, or the stack may need a change.

## Adding a provider

Add a row to the relevant `docs/providers/*.md` table. Mark **Agent-native** `Yes` only if the product was designed for agents (agent SDK, MCP server, per-agent policies), otherwise `Usable`. Link the official site or GitHub repo, not a blog post about it.

## Checks

Every PR runs a link check (`lychee`). Locally:

```sh
cargo install mdbook mdbook-mermaid lychee
mdbook build            # docs must build with zero warnings
lychee --exclude-mail './**/*.md'
python3 -c "import json,yaml,jsonschema; jsonschema.validate(yaml.safe_load(open('manifests/examples/research-agent.birth.yaml')), json.load(open('manifests/schema.json')))"
```

Every chapter must be reachable from `docs/SUMMARY.md`.

## License

By contributing you agree your contribution is released under [CC0 1.0](LICENSE).
