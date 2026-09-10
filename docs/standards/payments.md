# Payment standards

Layer 5 gives the agent the ability to move value; these protocols define *how* a payment initiated by software rather than a person is authorised and settled. They divide by rail. **Stablecoin-native** protocols (x402) let the agent pay from its own wallet key per HTTP request, with no human in the loop after funding. **Card-network** protocols (Visa Trusted Agent Protocol, Mastercard Agent Pay, Stripe Shared Payment Tokens) keep the human's existing card and issuer, and add an agent-specific token plus a signed proof of consent. **Mandate** protocols (Google AP2) sit above both: they define the signed record of what the user asked for, and let the rail underneath vary. Skyfire's KYAPay fuses identity and payment into one token. Every one of them needs an [Authority](../stack/08-authority.md) answer (who set the limit) and a [Governance](../stack/10-governance.md) answer (who can stop it); the manifest records them under `spec.economy.paymentProtocols[]` and `spec.economy.budget`.

## At a glance

| Standard | Layer | Maturity | Backed by | Link |
|---|---|---|---|---|
| x402 | 5 Economic Identity | Production | x402 Foundation (Coinbase, Cloudflare; Google, Visa, AWS, Circle, Anthropic among contributors) | [x402.org](https://www.x402.org/) · [github](https://github.com/coinbase/x402) |
| Google Agent Payments Protocol (AP2) | 5, 8 | Production (early) | Google + 60 partners | [ap2-protocol.org](https://ap2-protocol.org/) · [github](https://github.com/google-agentic-commerce/AP2) |
| Visa Trusted Agent Protocol / Intelligent Commerce | 5, 9 | Production | Visa | [developer.visa.com](https://developer.visa.com/capabilities/trusted-agent-protocol) · [github](https://github.com/visa/trusted-agent-protocol) |
| Mastercard Agent Pay (Agentic Tokens) | 5, 9 | Production | Mastercard | [mastercard.com](https://www.mastercard.com/us/en/news-and-trends/press/2025/april/mastercard-unveils-agent-pay-pioneering-agentic-payments-technology-to-power-commerce-in-the-age-of-ai.html) |
| Agentic Commerce Protocol (ACP) | 5 Economic Identity | Production | OpenAI + Stripe | [agenticcommerce.dev](https://www.agenticcommerce.dev/) · [github](https://github.com/agentic-commerce-protocol/agentic-commerce-protocol) |
| Stripe Shared Payment Tokens | 5 Economic Identity | Production | Stripe | [docs.stripe.com](https://docs.stripe.com/agentic-commerce/concepts/shared-payment-tokens) |
| PayPal Agent Toolkit | 5 Economic Identity | Production | PayPal | [github.com/paypal/agent-toolkit](https://github.com/paypal/agent-toolkit) |
| Skyfire KYAPay | 5, 9 | Production | Skyfire | [docs.skyfire.xyz](https://docs.skyfire.xyz/docs/kyapay-tokens) |
| Coinbase AgentKit / CDP Server Wallets | 5 (implementation) | Production | Coinbase | [github.com/coinbase/agentkit](https://github.com/coinbase/agentkit) · [CDP docs](https://docs.cdp.coinbase.com/server-wallets/v2/introduction/welcome) |

## Notes per standard

### x402
Revives HTTP 402: a server replies `402 Payment Required` with price and chain details, the client signs a stablecoin transfer (USDC on Base and other EVM chains, Solana), retries with the payment header, and a facilitator settles. No accounts, no API keys, sub-cent amounts. It does not say who funded the wallet or whether the agent was allowed to spend; that is the manifest's `spec.economy.budget` and a wallet policy. Pick it for agent-to-API and agent-to-agent micropayments. Stripe's machine payments and ERC-8004 both interoperate with it.

### Google AP2
Defines **mandates**: signed verifiable credentials capturing the user's intent (Intent Mandate), the agreed cart (Cart Mandate) and payment authorisation, so a merchant can prove afterwards what the human asked for. Rail-agnostic (cards, real-time bank, stablecoins via an x402 extension). Built on A2A and MCP. It does not move money itself; it is the audit and consent layer. Pick it when a *human's* purchase is being delegated and disputes need a paper trail.

### Visa Trusted Agent Protocol / Visa Intelligent Commerce
Intelligent Commerce issues agent-specific payment tokens tied to a cardholder's passkey and checks each transaction against the user's instructions. Trusted Agent Protocol is the merchant-facing half: the agent signs requests (Web Bot Auth / RFC 9421 style, time-bound and merchant-specific) so a site can distinguish an authorised commerce agent from a scraper. Card rail only; issuer decides.

### Mastercard Agent Pay
Agentic Tokens are network tokens issued to a registered agent, plus a Verifiable Intent record. The acceptance framework lets merchants verify agents at the CDN with Web Bot Auth and accept a Dynamic Token Verification Code in a standard card form. Card rail only; liability follows tokenised-transaction rules. Works with ACP for ChatGPT checkout.

### Agentic Commerce Protocol and Shared Payment Tokens
ACP (OpenAI + Stripe) is the checkout protocol: product feed, cart, delegated payment. Stripe Shared Payment Tokens are the scoped credential an agent receives from a user's Stripe-hosted wallet (Link) and hands to a seller, limited by amount, merchant and time. Together they cover the ChatGPT Instant Checkout case. Card/wallet rail via Stripe.

### PayPal Agent Toolkit
MCP server and SDK exposing PayPal invoicing, orders, payouts and subscriptions to agents. It is an integration, not a protocol; authorisation is the merchant's PayPal credentials. Pick it when the agent operates a *business's* PayPal account.

### Skyfire KYAPay
Skyfire issues three JWT types: `kya` (identity of a verified agent), `pay` (a spend authorisation) and `kya-pay` (both). A seller verifies one token to learn who the agent is and that it can pay. Bridges [Trust](../stack/09-trust.md) and Economic Identity; see [Security & Governance](security-and-governance.md) for the KYA side.

### Coinbase AgentKit / CDP Server Wallets
An implementation, not a standard: server-side custodied wallets with policy controls plus an agent framework integration that speaks x402. Listed because it is the reference stack most x402 agents actually run. See [Wallets & Keys](../providers/wallets.md).

## How they fit together

| Protocol | Rail (card / stablecoin / any) | Who authorises (user mandate / agent key / issuer token) | Micropayments? | Backed by |
|---|---|---|---|---|
| x402 | stablecoin | agent key | Yes (sub-cent) | x402 Foundation |
| Google AP2 | any | user mandate | No (per-purchase) | Google + partners |
| Visa Trusted Agent Protocol | card | issuer token + user passkey | No | Visa |
| Mastercard Agent Pay | card | issuer token + verifiable intent | No | Mastercard |
| Stripe ACP + Shared Payment Tokens | card / wallet | user-scoped token | No | OpenAI, Stripe |
| PayPal Agent Toolkit | PayPal balance / card | merchant account credentials | No | PayPal |
| Skyfire KYAPay | stablecoin / fiat ledger | agent key within owner-set budget | Yes | Skyfire |
| Coinbase AgentKit (x402) | stablecoin | agent key under wallet policy | Yes | Coinbase |

Read the table as two questions. *Who holds the key?* If the agent does (x402, KYAPay, AgentKit), the spending limit must be enforced by the wallet policy and `spec.economy.budget`, because the protocol will happily sign anything. If the issuer does (Visa, Mastercard, Stripe), the limit is in the token and the human's card controls still apply, but the agent cannot pay a machine that has no card acceptance. AP2 is orthogonal: it records the consent whichever rail moves the money. Most real deployments in 2026 combine one of each: a card token for buying from merchants, x402 for buying from APIs, and AP2-style mandates in the audit log.

## Related

- Stack: [5. Economic Identity](../stack/05-economy.md) · [8. Authority](../stack/08-authority.md) · [9. Trust](../stack/09-trust.md) · [10. Governance](../stack/10-governance.md)
- Standards: [Identity](identity.md) (ERC-8004) · [Authentication & Delegation](auth-and-delegation.md) (Web Bot Auth, RFC 9421) · [Security & Governance](security-and-governance.md) (KYA)
- Providers: [Wallets & Keys](../providers/wallets.md) · [Payments & Cards](../providers/payments-and-cards.md) · [Accounts & Legal Entity](../providers/accounts-and-legal-entity.md)
