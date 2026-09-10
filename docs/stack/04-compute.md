# 4. Compute

Compute is where the agent's code executes and what that execution can touch: a runtime with some isolation level, optionally a browser, a network policy, and disk. It is the first layer of the Action band: the agent can now *do* things, and the choices made here decide how much damage a wrong action can do.

## What the agent needs

An agent's runtime differs from a normal service in one way that dominates everything else: the code path is chosen at run time by a model reading untrusted input. A web page, an email or a tool result can steer the agent into running a command nobody wrote. Compute therefore has to be designed as if the workload were hostile, which is a different posture from deploying a service whose code you reviewed. The isolation level in `spec.compute.isolation` names that posture:

| Isolation | What it is | Fine when |
|---|---|---|
| `microvm` | Firecracker-class VM per agent or per task ([E2B](https://e2b.dev), [Modal](https://modal.com), [Fly Machines](https://fly.io/docs/machines/)) | Agent executes arbitrary code, browses, or handles other people's input |
| `container` | Shared kernel, namespaces and cgroups | Agent runs fixed tools on data from trusted sources; you accept kernel-escape risk |
| `process` | Separate OS process on a shared host | Internal scripts with no code execution tool and no untrusted input |
| `none` | Runs inside the owner's own process or shell | Development only |

Cheaper and equally important is the **network egress policy**. An agent that can only reach an allowlist of hosts cannot exfiltrate secrets to an attacker's server, cannot be tricked into calling an unlisted API, and cannot spend money at an unknown merchant, regardless of how good the prompt injection was. `spec.compute.network.egress: allowlist` with a short `allow[]` is the highest-value control per line of configuration in the whole manifest. The list also documents the agent's real dependencies, which makes [3. Authentication](03-authentication.md) and [10. Governance](10-governance.md) easier to audit.

Two shape decisions follow. **Ephemeral vs persistent**: an ephemeral runtime is created per task and destroyed after, so anything not written to external storage is gone, which is a feature for security and a problem for continuity. A persistent runtime keeps a filesystem and processes alive between tasks, is simpler to reason about, and accumulates state nobody reviews. Most agents do best with an ephemeral runtime plus explicit external storage, which is why `spec.compute.storage` exists separately and hands off to [7. Memory](07-memory.md): the runtime's disk is scratch, memory stores are the durable record. **Local vs cloud**: an agent on the owner's laptop inherits the owner's credentials, network and files and has no isolation boundary that a model can be trusted to respect. Cloud sandboxes exist precisely to draw that boundary. Local is fine for a personal assistant with `none` isolation whose owner understands it is running as them.

The **browser** deserves to be a first-class resource rather than a tool the agent installs. It has its own identity to sites (cookies, fingerprint, IP), its own storage (sessions), and its own attack surface (every page is untrusted input). Hosted browsers ([Browserbase](https://www.browserbase.com), [Steel](https://steel.dev), [Browser Use](https://browser-use.com)) isolate it from the runtime, keep sessions across ephemeral runs, and give the owner a place to look at what the agent saw. Logged-in browser sessions are credentials and belong under the same rotation and revocation discipline as any token.

Finally, **cost and idle**. Runtimes bill by wall-clock or by CPU-second; an agent that keeps a microVM alive waiting for email costs more than one that wakes on a webhook. Prefer scale-to-zero (Modal, Cloudflare, Fly Machines stop/start) and record the expected idle model so the budget in [5. Economic Identity](05-economy.md) covers compute as well as API calls.

## Minimum vs full provisioning

| Aspect | Minimum viable | Full |
|---|---|---|
| Runtime | Container on a single VPS, or `local` | Per-task microVM from a sandbox provider, scale-to-zero |
| Isolation | `container` | `microvm`, no privileged mounts, read-only root |
| Browser | None, or Playwright inside the runtime | Hosted browser with session persistence and recording |
| Network | `open` | `allowlist` with named hosts, DNS pinned, no inbound except webhooks |
| Storage | Runtime disk, lost on restart | Object storage bucket per agent, encrypted, lifecycle rules |
| Idle model | Always-on | Wake on webhook or schedule, hard runtime-hours limit |

## Depends on / enables

- Depends on [3. Authentication](03-authentication.md): the runtime needs secrets injected from the secret store at start.
- Enables [6. Capabilities](06-capabilities.md): tools, CLIs and the browser run here.
- Enables [7. Memory](07-memory.md): storage is the hand-off from scratch disk to durable stores.
- Controlled by [10. Governance](10-governance.md): `suspend-runtime` is one of the kill-switch mechanisms; runtime-hours is a governance limit.

## Failure modes & gotchas

- **Owner's laptop as production.** The agent has the owner's SSH keys, browser cookies and cloud CLI sessions. One injection and it is the owner.
- **Open egress.** Every leaked secret has somewhere to go. Allowlist first, widen when a real call fails.
- **Docker socket or cloud metadata endpoint reachable.** Container isolation with `/var/run/docker.sock` mounted or `169.254.169.254` open is `none` in practice.
- **State hiding in a persistent runtime.** Cron jobs, cached tokens and half-finished files accumulate where no memory store or audit log sees them.
- **Browser sessions as forgotten credentials.** A hosted browser logged into the owner's accounts outlives the task that needed it. Expire sessions, list them under authentication.
- **Runaway compute bill.** Loops, retries and always-on sandboxes. Set `maxRuntimeHoursPerDay` in `spec.governance.limits` and a provider-side spend cap.
- **Residency.** A sandbox provider's region choice is a data-residency decision the owner may be accountable for.

## Standards

- [Security & Governance](../standards/security-and-governance.md): OWASP ASI05 unexpected code execution, ASI04 supply chain, NIST AI 800-4 post-deployment monitoring.
- [Authentication & Delegation](../standards/auth-and-delegation.md): SPIFFE for identifying the runtime itself to internal services.

## Providers

- [Compute & Browsers](../providers/compute-and-browsers.md): E2B, Daytona, Modal, Fly Machines and Sprites, Vercel Sandbox, Cloudflare Sandbox SDK and Agents SDK, AWS Bedrock AgentCore, Hetzner; browsers Browserbase, Steel, Hyperbrowser, Browser Use, Kernel, Lightpanda.
- [Memory & Storage](../providers/memory-and-storage.md): R2, S3, Tigris for the storage hand-off.

## In the manifest

`spec.compute.runtime`, `spec.compute.isolation` (`microvm | container | process | none`), `spec.compute.browser`, `spec.compute.network{egress,allow[]}`, `spec.compute.storage`. Runtime-hours and spend caps live in `spec.governance.limits`, not here.

```yaml
spec:
  compute:
    runtime: e2b
    isolation: microvm
    browser: browserbase
    network:
      egress: allowlist
      allow: [api.openrouter.ai, api.agentmail.to, api.github.com, "*.arxiv.org"]
    storage: r2://agents-scout
```
