# Accounts & Legal Entity

Beyond email and phone, an agent needs accounts on the platforms where its work happens (GitHub, Slack, Discord), a way to be present on social networks if it speaks in public, and, behind all of it, a legal entity whose name goes on every contract, card programme and bank account. These sit across [Presence](../stack/02-presence.md), [Identity](../stack/01-identity.md) and [Economic Identity](../stack/05-economy.md), and they are where the gap between "agent-native" and "usable" is widest. Agent-native platforms have a first-class non-human account type (an App, a bot user) with its own credentials, scopes and audit trail. Open protocols let a keypair hold an account outright. Legal wrappers let a human or a DAO stand behind the agent so that a bank or registrar has someone to hold accountable.

The trap that dominates this chapter is stated plainly: **as of 2026, no bank opens an account for an agent.** Every banking, card and payment relationship is opened by the owner's legal entity after KYB, and the agent receives a scoped API token, a card with controls, or a sub-account. The same holds for most developer platforms: GitHub's terms allow one free machine account per person and make the human who created it responsible for its actions; Slack and Discord bots are installed into a workspace or server by an admin. Accounts an agent creates for itself by pretending to be a human violate terms and get closed. Provision the entity first, then the accounts under it, and record the entity as `spec.authority.principal`.

## Interfaces

- **Platform App** - A registered application with its own identity, granular permissions and installation tokens that expire; the agent acts as the App, not as a user. GitHub Apps, Slack apps with bot users, Discord bots.
- **Fine-grained personal access token** - A token minted from a human's or machine user's account, scoped to repositories and permissions with an expiry; simpler than an App, but the actions are attributed to that account.
- **Machine user** - A separate user account operated by automation; permitted by GitHub within limits and owned by a human who accepts the terms on its behalf.
- **Open social protocol account** - An identity controlled by a keypair or a DID: AT Protocol accounts (Bluesky) with a `did:plc` and a PDS; Farcaster IDs bound to an Ethereum address; Nostr identities that are simply a public key. No terms of service stand between an agent and an account, though individual apps and relays may moderate.
- **Legal wrapper** - An LLC, a Wyoming DUNA, or a Marshall Islands DAO LLC, formed through a filing service and holding the bank account, cards and contracts. The agent is an asset or an operator of the entity, never the entity.
- **Banking / card API under the entity** - Covered in [Payments & Cards](payments-and-cards.md); listed here because the entity is the prerequisite.

## Providers

| Provider | Agent-native | OSS | Pricing | Notes |
|---|---|---|---|---|
| [GitHub Apps](https://docs.github.com/en/apps) | Yes | No | Free tier | Own identity, per-repository permissions, short-lived installation tokens; the recommended pattern for a coding agent. Fine-grained PATs and machine users are alternatives; GitHub's terms allow one free machine account per person and hold the human owner responsible. |
| [Slack apps / bot users](https://api.slack.com/) | Yes | No | Free tier | Bot tokens with granular scopes, installed by a workspace admin; Socket Mode or Events API for receiving. |
| [Discord bots](https://discord.com/developers/docs) | Yes | No | Free tier | Bot accounts with OAuth2 scopes and gateway intents; verification required above 100 servers. |
| [AT Protocol / Bluesky](https://atproto.com) | Yes | Yes | n/a | Accounts are DIDs on a personal data server; an agent can hold one under the owner's domain as its handle; labelling and moderation are app-level. |
| [Farcaster](https://www.farcaster.xyz) | Yes | Yes | n/a | Farcaster ID registered on-chain to an Ethereum address; signers can be delegated to an agent's key with revocation. |
| [Nostr](https://nostr.com) | Yes | Yes | n/a | Identity is a public key; posts are signed events published to relays; no registration step at all. |
| [Moltbook](https://www.moltbook.com) | Yes | No | n/a | Social network built for agents as posters and humans as observers; ownership verified through the owner's X account. New in 2026; small. |
| [OtoCo](https://otoco.io) | Usable | Partial | Paid | On-chain formation of LLCs and unincorporated associations, including Wyoming DUNAs, controlled by a wallet. |
| [Wyoming DUNA](https://wyoleg.gov/Legislation/2024/SF0050) | Usable | n/a | n/a | Decentralized Unincorporated Nonprofit Association Act (SF0050, 2024): a legal entity for a decentralised group, able to contract and bank; needs at least 100 members. Statute, not a vendor. |
| [MIDAO](https://www.midao.org) | Usable | No | Paid | Marshall Islands DAO LLC formation and registered-agent service. |
| [doola](https://www.doola.com) | Usable | No | Paid | US LLC formation, EIN, registered agent and bookkeeping for non-residents. |
| [Stripe Atlas](https://stripe.com/atlas) | Usable | No | Paid | Delaware C-corp or LLC formation with EIN and a Stripe account. |
| [Firstbase](https://www.firstbase.io) | Usable | No | Paid | US company formation, registered agent and compliance for founders anywhere. |

## Resources

- [About creating GitHub Apps](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps) · [Authenticating with a GitHub App](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/about-authentication-with-a-github-app) - Installation tokens and permissions.
- [Managing personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) - Fine-grained PAT scopes and expiry.
- [Types of GitHub accounts](https://docs.github.com/en/get-started/learning-about-github/types-of-github-accounts) · [GitHub Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service) - Machine users and the one-free-machine-account rule.
- [Slack authentication basics](https://api.slack.com/authentication/basics) · [Slack developer docs](https://docs.slack.dev) - Bot tokens and scopes.
- [Discord OAuth2](https://discord.com/developers/docs/topics/oauth2) - Bot authorization flow.
- [AT Protocol docs](https://atproto.com) · [Bluesky API docs](https://docs.bsky.app) - Accounts, DIDs and handles.
- [Farcaster docs](https://docs.farcaster.xyz) - FIDs, signers and delegation.
- [Nostr NIPs](https://github.com/nostr-protocol/nips) - Protocol specifications.
- [Wyoming SF0050 text](https://www.wyoleg.gov/2024/Introduced/SF0050.pdf) - The DUNA statute.
- [Mercury API](https://docs.mercury.com) · [Brex developer](https://developer.brex.com) - Banking APIs the owner's entity exposes to the agent.

## Related

- [1. Identity](../stack/01-identity.md) - `spec.identity.registrations[]` for platform and protocol accounts.
- [2. Presence](../stack/02-presence.md) - `spec.presence.endpoints[]` for social protocol handles.
- [8. Authority](../stack/08-authority.md) - `spec.authority.principal` is the entity, not the agent.
- [Identity standards](../standards/identity.md) - DIDs, ERC-8004 and agent passports as the protocol-level counterpart to platform accounts.
- [Payments & Cards](payments-and-cards.md) - What the entity opens on the agent's behalf.
- [Email](email.md) · [Phone, SMS & Voice](phone.md) - The verification channels every account signup will demand.
