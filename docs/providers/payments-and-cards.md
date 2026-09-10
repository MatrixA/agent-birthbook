# Payments & Cards

Most of what an agent will ever buy is priced in fiat and sold by merchants who take cards: API credits, SaaS seats, domain renewals, a flight. The fiat half of [Economic Identity](../stack/05-economy.md) is therefore a card the agent can present, with controls that make the card itself enforce the budget, plus a way to pay other agents and services that never touch a card network. Agent-native means cards are issued by API per agent or per task, spend controls (merchant category, per-authorization and per-period caps, single-use lifecycle) are attached at issuance, every authorization can be approved or declined in real time by a webhook, and the transaction feed is machine-readable so [Governance](../stack/10-governance.md) can reconcile it.

The trap is that no card issuer or payment processor will onboard an agent. KYC (for a person) or KYB (for a business) is passed by the **owner's legal entity**; the agent is a cardholder or an API key under that entity's programme, and the entity is liable for every charge. Consumer virtual-card products usually forbid automated use in their terms. Stablecoin cards shift settlement on-chain but still run KYB at issuance. Agent-to-agent payment rails avoid the card network but add a counterparty whose reputation you must judge; see [Trust](../stack/09-trust.md).

## Interfaces

- **Card issuing API** - Create cardholder, issue virtual card, set spending controls, retrieve PAN/CVC once for the agent to use, freeze or cancel.
- **Real-time authorization webhook** - The issuer asks the owner's endpoint to approve each authorization within a timeout; the natural place to enforce [Authority](../stack/08-authority.md) rules and to require a human for large amounts.
- **Spend-management API** - Corporate cards with budgets, approvals and receipts; the agent is a "user" with a card and a limit.
- **Business banking API** - Accounts, ACH/wire, and cards from a bank or bank-programme fintech; the owner's account, the agent's scoped token.
- **Stablecoin card** - A card funded from an on-chain balance; bridges the [wallet](wallets.md) to card-accepting merchants.
- **Agent payment rail** - Prepaid or wallet-backed accounts where an agent pays another agent or a service by API, often with a KYA credential attached; x402 for per-request HTTP payments is covered under [Payments standards](../standards/payments.md).

## Providers

| Provider | Agent-native | OSS | Pricing | Notes |
|---|---|---|---|---|
| [Stripe Issuing for agents](https://docs.stripe.com/issuing/agents) | Yes | No | Usage-based | Virtual cards per agent with single-use lifecycle, category and amount controls, real-time authorization webhooks and Radar risk scores; requires a Stripe account for the owner's business. |
| [Lithic](https://www.lithic.com) | Usable | No | Usage-based | Card-issuing API with auth rules and an authorization stream; programme-level onboarding. |
| [Ramp](https://docs.ramp.com) | Usable | No | Free tier | Corporate card and spend platform with a developer API for cards, limits and transactions; the owner's company is the customer. |
| [Brex](https://developer.brex.com) | Usable | No | Free tier | Corporate cards and accounts with an API for card issuance, budgets and transactions. |
| [Mercury](https://docs.mercury.com) | Usable | No | Free tier | Business banking with API access to accounts, transactions and payments; the closest thing to an "agent bank account" is a Mercury account owned by the owner's entity with a scoped API token. |
| [Extend](https://www.paywithextend.com) | Usable | No | Paid | Virtual cards on top of an existing corporate card programme, with an API for issuing and controls. |
| [Slash](https://www.slash.com) | Usable | No | Free tier | Business banking and virtual cards with an API and per-card spend rules. |
| [Rain](https://www.rain.xyz) | Usable | No | Paid | Stablecoin-funded card issuing for platforms; KYB at the platform level. |
| [Crossmint](https://www.crossmint.com) | Yes | No | Usage-based | Agent wallets plus stablecoin-backed cards and checkout in one API. |
| [Payman](https://paymanai.com) | Yes | No | Usage-based | Agent payments with human-defined policies and approvals; fiat payouts and wallets under the owner's account. |
| [Skyfire](https://skyfire.xyz) | Yes | No | Usage-based | Payment and identity network for agents (KYAPay); prefunded accounts, spend caps and KYA tokens. |
| [Locus](https://paywithlocus.com) | Yes | No | Usage-based | Agent wallets with policy controls and stablecoin settlement. |
| [Nevermined](https://nevermined.ai) | Yes | Partial | Usage-based | Payment and metering protocol for agent-to-agent and agent-to-service transactions. |

## Resources

- [Stripe Issuing](https://docs.stripe.com/issuing) · [Spending controls](https://docs.stripe.com/issuing/controls/spending-controls) · [Real-time authorizations](https://docs.stripe.com/issuing/controls/real-time-authorizations) - Card controls and the authorization webhook.
- [Stripe Agent Toolkit](https://github.com/stripe/agent-toolkit) - Stripe actions as tools for agent frameworks.
- [Stripe agentic commerce](https://docs.stripe.com/agentic-commerce) - Shared Payment Tokens and the Agentic Commerce Protocol.
- [Lithic docs](https://docs.lithic.com) - Auth rules and the authorization stream.
- [Rain docs](https://docs.rain.xyz) - Stablecoin card issuing.
- [Slash docs](https://docs.slash.com) - Cards and account API.
- [Skyfire docs](https://docs.skyfire.xyz) · [Locus docs](https://docs.paywithlocus.com) · [Nevermined docs](https://docs.nevermined.app) - Agent payment rails.
- [x402](https://github.com/coinbase/x402) - HTTP 402 per-request payments, the card-free path for machine-to-machine purchases.

## Related

- [5. Economic Identity](../stack/05-economy.md) - `spec.economy.cards[]`, `budget`, `paymentProtocols[]`.
- [8. Authority](../stack/08-authority.md) - Real-time authorization as an approval channel.
- [10. Governance](../stack/10-governance.md) - Reconciling the transaction feed against the budget; freezing cards as a kill switch.
- [Payments standards](../standards/payments.md) - x402, AP2, Visa Trusted Agent Protocol, Mastercard Agent Pay, Agentic Commerce Protocol.
- [Wallets & Keys](wallets.md) - The on-chain side that funds stablecoin cards.
- [Accounts & Legal Entity](accounts-and-legal-entity.md) - The entity that passes KYB.
