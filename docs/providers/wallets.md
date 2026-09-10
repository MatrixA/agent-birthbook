# Wallets & Keys

An agent that transacts on-chain, pays for APIs with stablecoins, or signs anything that has to be verifiable later needs a key it can use and a wallet built around it. This is the on-chain half of [Economic Identity](../stack/05-economy.md) and it overlaps with [Identity](../stack/01-identity.md), because the same key often anchors the agent's DID or ERC-8004 registration. Agent-native here means the provider expects the signer to be software: wallets are created by API, every signature passes through a policy engine the owner controls (allow-lists, per-transaction and daily caps, contract and method restrictions), and the key material never sits in the agent's process memory.

The trap is custody. A private key in an environment variable on the agent's host is one prompt injection away from an empty wallet, and there is no chargeback. Provider-held custody moves the risk to the provider's security and terms; MPC and TEE designs split or seal the key so neither the provider nor the agent holds all of it; smart accounts move the policy on-chain where it is enforceable without trusting anyone's API. All three are acceptable. Self-custody on the agent's host is not, and this book does not list providers for it.

## Custody archetypes

- **Provider-held with policy engine** - The provider generates and stores the key (often inside a TEE) and exposes signing through an API that consults an owner-defined policy on every request. Coinbase CDP Server Wallets, Privy, Turnkey and Crossmint all work this way. Simplest to provision; the policy language and audit log are the product.
- **MPC / TEE threshold signing** - The key exists only as shares across nodes or inside sealed enclaves, and signing requires a quorum plus a programmable condition. Lit Protocol's network, Turnkey's enclaves and Fireblocks' MPC-CMP fall here. Stronger against a single compromised party; more moving parts.
- **Smart account + session keys** - The agent's wallet is a contract account ([ERC-4337](https://eips.ethereum.org/EIPS/eip-4337), or an EOA upgraded via [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702)). The owner's key installs a module that grants the agent a *session key* limited by target contract, function selector, spend cap and expiry ([ERC-7715](https://eips.ethereum.org/EIPS/eip-7715) describes the permission request flow). Safe, ZeroDev and Alchemy Smart Wallets implement this. The limits are on-chain and survive a provider outage; revocation is one owner transaction.
- **Self-custody on the agent host** - Key file or env var on the sandbox. Not recommended for anything holding real value; acceptable only for testnets and for signing non-financial attestations where the key can be rotated freely.

Record the choice in `spec.identity.keys[].custody` (`provider`, `tee`, `mpc`) and `spec.economy.wallets[].custody`, and set the matching caps in `spec.economy.budget`.

## Interfaces

- **Wallet-as-a-service REST/SDK** - Create wallet, sign message, sign transaction, send transaction, list balances, with a policy object attached to each wallet or API key.
- **Policy engine** - Declarative rules evaluated before every signature; the primary [Authority](../stack/08-authority.md) hook at this layer.
- **Smart-account SDK** - Deploy account, install permission module, mint session key, submit UserOperation via a bundler and paymaster.
- **Threshold signing network** - Submit a signing request that runs a program (Lit Action, Turnkey policy) to decide whether the shares combine.
- **Agent toolkits** - Framework bindings (LangChain, Vercel AI SDK, MCP) that expose wallet actions as tools: AgentKit, Solana Agent Kit, Phantom Agent Kit.

## Providers

| Provider | Agent-native | OSS | Pricing | Notes |
|---|---|---|---|---|
| [Coinbase CDP Server Wallets](https://docs.cdp.coinbase.com/server-wallets/v2/introduction/welcome) + [AgentKit](https://github.com/coinbase/agentkit) | Yes | Partial | Free tier | TEE-held keys with account and project policies; AgentKit wraps wallet and onchain actions as tools for LangChain, Vercel AI SDK and MCP; native x402 support. |
| [Privy](https://privy.io) | Yes | No | Free tier | Server wallets with policies, TEE signing and multi-chain support; part of Stripe since 2025. |
| [Turnkey](https://www.turnkey.com) | Yes | Partial | Free tier | Key management in secure enclaves with a policy engine over users, keys and transactions; sub-organisations per agent. |
| [Crossmint](https://www.crossmint.com) | Yes | No | Usage-based | Agent wallets on EVM, Solana and Stellar with delegated signers and spend rules; bundled with checkout and stablecoin cards. |
| [Lit Protocol](https://litprotocol.com) / [Vincent](https://github.com/LIT-Protocol/Vincent) | Yes | Yes | Usage-based | Threshold MPC + TEE network; Vincent packages agent wallets with user-set abilities and policies. |
| [Fireblocks](https://www.fireblocks.com) | Usable | No | Paid | Institutional MPC custody with transaction authorization policy and API co-signers; heavy onboarding. |
| [Safe](https://safe.global) | Usable | Yes | n/a | The reference smart account; modules and guards enforce agent permissions on-chain; pair with a session-key module. |
| [ZeroDev](https://docs.zerodev.app) | Yes | Yes | Free tier | ERC-4337 accounts with a permissions system for session keys scoped by target, selector, value and time. |
| [Alchemy Smart Wallets](https://www.alchemy.com/docs/wallets) | Usable | Partial | Free tier | Account abstraction SDK with session keys, gas sponsorship and bundler; formerly Account Kit. |
| [Dynamic](https://www.dynamic.xyz) | Usable | No | Free tier | Embedded and server wallets with policy controls; consumer-first product. |
| [Para](https://docs.getpara.com) | Usable | No | Free tier | MPC embedded wallets with server-side signing and permissioned sessions. |
| [thirdweb Engine](https://thirdweb.com/engine) | Usable | Yes | OSS + cloud | Backend wallet server with nonce management and access tokens; self-hostable. |
| [Solana Agent Kit](https://github.com/sendaifun/solana-agent-kit) | Yes | Yes | n/a | Toolkit exposing Solana protocol actions to agents; bring your own signer. |
| [Phantom Agent Kit](https://github.com/phantom/phantom-agent-kit) | Yes | Yes | n/a | MCP server and plugin for operating Phantom embedded wallets from an agent within user-granted permissions. |

## Resources

- [CDP policies](https://docs.cdp.coinbase.com/) - Policy schema for server wallets.
- [Privy docs](https://docs.privy.io) - Server wallets and policy rules.
- [Turnkey docs](https://docs.turnkey.com) - Policy language and enclave architecture.
- [Crossmint agent wallets](https://docs.crossmint.com/wallets/quickstarts/agent-wallets) - Quickstart for agent-controlled wallets.
- [Lit developer docs](https://developer.litprotocol.com) - Lit Actions and programmable signing.
- [Safe docs](https://docs.safe.global) · [safe-modules](https://github.com/safe-global/safe-modules) - Modules and guards.
- [ZeroDev permissions](https://docs.zerodev.app/sdk/permissions/intro) - Session key policies.
- [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) · [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) · [ERC-7715](https://eips.ethereum.org/EIPS/eip-7715) - Account abstraction and permission specs.
- [Solana Agent Kit docs](https://docs.sendai.fun/docs/v2/introduction) - Actions and signer setup.

## Related

- [5. Economic Identity](../stack/05-economy.md) - `spec.economy.wallets[]`, `budget`, `paymentProtocols[]`.
- [1. Identity](../stack/01-identity.md) - `spec.identity.keys[].custody`; the same key may anchor a DID or ERC-8004 record.
- [8. Authority](../stack/08-authority.md) - Policy engines and session keys are the enforcement point for delegations.
- [Payments standards](../standards/payments.md) - x402, AP2 and the card-network agent protocols these wallets pay through.
- [Identity standards](../standards/identity.md) - ERC-8004 Trustless Agents.
- [Payments & Cards](payments-and-cards.md) - The fiat side.
