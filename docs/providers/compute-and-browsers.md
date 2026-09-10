# Compute & Browsers

An agent needs a place where its code runs and its tools execute: a shell, a filesystem, a network path, and often a browser, because a large share of the web has no API. This is the [Compute](../stack/04-compute.md) layer. Agent-native compute is created and destroyed by code in well under a second, isolates each agent (or each task) from every other and from the host, snapshots and resumes so a long task survives a restart, and exposes egress controls so the owner can say which hosts the agent may reach. Agent-native browsers are the same idea one level up: headless sessions started by API, with persistent profiles, CAPTCHA and proxy handling, and an action interface designed for an LLM rather than a test script.

The traps: running agent-generated code on the same host as the agent's credentials turns every prompt injection into a key-exfiltration path; containers alone share a kernel and are not a security boundary against hostile code; browsers with the owner's logged-in cookies are a credential store and must be treated as one; residential-proxy and anti-detection features shade into terms-of-service violations for the sites being visited; and every sandbox bills by the second of wall-clock time, so an agent that forgets to tear down is a budget leak that belongs under [Governance](../stack/10-governance.md) limits.

## Interfaces

- **Sandbox SDK** - `create()`, `exec()`, `write_file()`, `snapshot()`, `kill()` over HTTP or gRPC; the interface E2B, Daytona, Modal, Vercel and Cloudflare all converge on.
- **Machines / VM API** - Start a Firecracker microVM or full VM from an image with a REST call; slower to create than a sandbox, but a normal Linux box with a stable IP.
- **Container platform API** - Deploy long-running services and jobs; adequate for the agent's own process, not for executing untrusted code without an extra isolation layer.
- **Managed agent runtime** - A hosted loop that runs the agent framework itself with identity, memory and tool gateways attached; the compute is implicit.
- **CDP / WebDriver** - Chrome DevTools Protocol or WebDriver over a WebSocket; what Playwright and Puppeteer speak and what every remote-browser provider exposes underneath.
- **Action-level browser API** - `act("click the login button")`, `extract(schema)`, `observe()`; an LLM-facing layer over CDP that Stagehand, Browser Use and Hyperbrowser provide.
- **MCP browser server** - The browser as a set of MCP tools, so any MCP client can drive it.

## Providers: sandboxes and runtimes

| Provider | Agent-native | OSS | Pricing | Notes |
|---|---|---|---|---|
| [E2B](https://e2b.dev) | Yes | Yes | OSS + cloud | Firecracker microVM sandboxes with Python/JS SDK; custom templates; persistence and pause/resume. |
| [Daytona](https://www.daytona.io) | Yes | Yes | OSS + cloud | Sandboxes with sub-second start, snapshots, per-sandbox network policy; self-hostable. |
| [Modal](https://modal.com) | Yes | No | Usage-based | Serverless functions and Sandboxes including GPU; Python-first SDK; billed per second. |
| [Fly.io Machines](https://fly.io/docs/machines/) + [Sprites](https://fly.io/sprites) | Yes | No | Usage-based | Machines is a Firecracker VM API with stable IPs and volumes; Sprites is the agent-oriented sandbox layer on top with per-sandbox checkpoints. |
| [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox) | Yes | No | Usage-based | Ephemeral microVMs for running untrusted code from Vercel functions; Node and Python runtimes. |
| [Cloudflare Sandbox SDK](https://developers.cloudflare.com/sandbox/) + [Agents SDK](https://developers.cloudflare.com/agents/) | Yes | Partial | Usage-based | Sandboxed containers driven from Workers; Agents SDK adds Durable Object state, scheduling and WebSockets per agent instance. |
| [AWS Bedrock AgentCore](https://aws.amazon.com/bedrock/agentcore/) | Yes | No | Usage-based | Managed runtime with session isolation plus identity, memory, gateway and browser/code-interpreter tools; framework-agnostic. |
| [Runloop](https://www.runloop.ai) | Yes | No | Usage-based | Devboxes for coding agents with snapshots and a benchmark/eval harness. |
| [Blaxel](https://blaxel.ai) | Yes | No | Usage-based | Sandboxes with fast resume and an agent-hosting layer; MCP-native tool gateway. |
| [Northflank](https://northflank.com) | Usable | No | Usage-based | Container platform with API and BYOC; microVM sandboxes offered for agent workloads. |
| [Hetzner Cloud](https://docs.hetzner.cloud/) | Usable | No | Paid | Plain VPS by API at low hourly rates; the agent gets a real machine and you build the isolation. |
| [microsandbox](https://github.com/zerocore-ai/microsandbox) | Yes | Yes | n/a | Self-hosted microVM sandboxes with an SDK; runs on your own hardware. |

## Providers: browsers

| Provider | Agent-native | OSS | Pricing | Notes |
|---|---|---|---|---|
| [Browserbase](https://www.browserbase.com) + [Stagehand](https://github.com/browserbase/stagehand) | Yes | Partial | Usage-based | Hosted Chromium with session recording, contexts, proxies and CAPTCHA handling; Stagehand is the open-source act/extract/observe framework; 1Password Agentic Autofill integration. |
| [Steel](https://steel.dev) | Yes | Yes | OSS + cloud | Open-source browser API with sessions, CDP access and self-hosting. |
| [Hyperbrowser](https://hyperbrowser.ai) | Yes | No | Usage-based | Headless browser sessions plus scrape/crawl/extract endpoints and Browser Use integration. |
| [Browser Use](https://browser-use.com) | Yes | Yes | OSS + cloud | Python library that lets an LLM drive Playwright; hosted cloud version with managed browsers. |
| [Kernel](https://www.onkernel.com) | Yes | No | Usage-based | Browsers as infrastructure with persistence, replay and a CLI for agent deployments. |
| [Anchor Browser](https://anchorbrowser.io) | Yes | No | Usage-based | Cloud browsers with authenticated-session persistence and proxy management. |
| [Lightpanda](https://lightpanda.io) | Yes | Yes | OSS + cloud | Headless browser written from scratch for automation; lower memory than Chromium; CDP-compatible, partial web compatibility. |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | Yes | Yes | n/a | Microsoft's MCP server exposing Playwright to any MCP client; accessibility-tree based, no screenshots required. |
| [Camoufox](https://camoufox.com) | Usable | Yes | n/a | Anti-detection Firefox build for Playwright; check the terms of the sites you point it at. |

## Resources

- [E2B docs](https://docs.e2b.dev) · [E2B repository](https://github.com/e2b-dev/E2B) - Sandbox SDK and self-hosting.
- [Daytona docs](https://www.daytona.io/docs) · [Daytona repository](https://github.com/daytonaio/daytona) - Sandboxes, snapshots and network limits.
- [Modal Sandboxes](https://modal.com/docs/guide/sandbox) - Creating and controlling sandboxes.
- [Browserbase docs](https://docs.browserbase.com) - Sessions, contexts and Stagehand.
- [Steel docs](https://docs.steel.dev) · [steel-browser](https://github.com/steel-dev/steel-browser) - API and self-hosted deployment.
- [Browser Use docs](https://docs.browser-use.com) · [browser-use](https://github.com/browser-use/browser-use) - Library and cloud.
- [Lightpanda browser](https://github.com/lightpanda-io/browser) - Source and compatibility status.
- [Firecracker](https://firecracker-microvm.github.io/) - The microVM technology under most agent-native sandboxes.

## Related

- [4. Compute](../stack/04-compute.md) - `spec.compute.runtime`, `isolation`, `browser`, `network`.
- [3. Authentication](../stack/03-authentication.md) - Keep credentials outside the sandbox and inject per call.
- [10. Governance](../stack/10-governance.md) - Time and spend limits on sandbox lifetime.
- [Credentials & Tool Auth](credentials-and-tool-auth.md) - Autofill and token brokers that keep secrets out of the browser context.
- [Security & Governance standards](../standards/security-and-governance.md) - OWASP ASI05 unexpected code execution.
