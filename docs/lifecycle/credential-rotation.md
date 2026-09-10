# Credential Rotation

Rotation is the routine replacement of a credential with a new one before the old one is compromised. For agents it is not optional hygiene: an agent's credentials sit in more places than a human's (secret store, runtime environment, gateway config, tool servers, occasionally a memory store that captured a request), and an agent has no MFA prompt, no push notification, and no instinct that something is off. The only defence that scales is a short lifetime and an automated replacement, driven from the secret store provisioned in [layer 3](../stack/03-authentication.md).

## Why agents rotate faster than humans

- A human login is protected by a second factor at use time. An agent's API key is a bearer token: whoever holds it, is the agent.
- Agents copy credentials into runtime state. A microVM snapshot, a crash dump, or a verbose trace in the [audit log](../stack/10-governance.md) can hold a live token.
- Agents talk to many services in a loop. A leaked key is exercised within seconds, not days.
- Rotating a human's password interrupts the human. Rotating an agent's key interrupts nothing if the overlap window is respected, so there is no cost argument for long lifetimes.

Default lifetimes that work in practice: API keys 30 days, OAuth access tokens minutes to an hour with daily refresh-token rotation, signing keys 6 to 12 months, TLS certificates 90 days or shorter, SPIFFE SVIDs an hour.

## Procedure

Generic zero-downtime rotation, run by the secret store or a scheduler, never by the agent itself:

1. Issue the new credential at the provider while the old one is still valid.
2. Write the new value to the `secretRef` path; bump a version marker.
3. Signal the runtime to reload (restart the sandbox or re-read the store).
4. Wait an overlap window long enough for in-flight requests and cached tokens to drain.
5. Revoke the old credential at the provider.
6. Record the rotation event in the audit log with key IDs, not values.

Per credential type:

- **API keys.** Most providers allow two active keys. Create the second, cut over, delete the first. If a provider allows only one, the overlap window is zero and rotation causes a brief outage; schedule it in a quiet period and note the constraint in the manifest.
- **OAuth refresh tokens.** Access tokens are short-lived by design; the refresh token is the long-lived secret. Prefer authorization servers that rotate the refresh token on every use, as MCP Authorization and OAuth 2.1 recommend ([Authentication & Delegation](../standards/auth-and-delegation.md)). Store only the latest one; a reused old refresh token should invalidate the grant.
- **Signing keys (identity).** Rotating a `spec.identity.keys[]` entry is a DID document update: add the new verification method, publish, wait for resolvers and counterparties to pick it up, then remove the old one. Keep the old public key retrievable so past signatures still verify. See [Identity standards](../standards/identity.md).
- **Wallet keys.** Usually not rotated. A wallet address is the economic identity; changing it means moving funds and updating every counterparty and registry. Instead the key is policy-gated at a provider or TEE ([Wallets & Keys](../providers/wallets.md)) and the policy is what changes. Rotate only on suspected compromise, by sweeping to a new address under the same owner.
- **TLS and mTLS certificates.** Use ACME or the provider's automatic renewal; 90 days is the common maximum and shorter is fine. For mTLS to internal services, pin to the CA, not the leaf, so rotation does not break peers.
- **SPIFFE SVIDs.** Rotate automatically through the SPIRE agent, typically hourly. Nothing to schedule; confirm the workload attestation selectors still match after any [compute migration](migration.md).

## In the manifest

Each entry in `spec.authentication.credentials[]` carries a `rotation` field, an ISO 8601 duration:

```yaml
- service: github
  type: oauth2
  secretRef: GITHUB_APP_INSTALLATION
  rotation: P1D
```

The value is a promise, not a mechanism. The secret store or scheduler must actually enforce it. A useful review-cadence check is to diff each credential's provider-side creation date against its declared `rotation`.

## Per-layer notes

| Layer | What happens at this stage |
|---|---|
| 1 Identity | Signing key rotation is a DID document update; old public keys stay resolvable. |
| 2 Presence | Inbox and DNS API keys rotate like any API key; domain registrar credentials are owner-held and rotate on owner review. |
| 3 Authentication | Owns the process: secret store issues, versions, and revokes. |
| 4 Compute | Runtime must reload on signal; no credentials baked into images. |
| 5 Economic Identity | Wallet keys policy-gated, not rotated; card numbers reissued on compromise. |
| 6 Capabilities | Gateway and tool credentials are ordinary API keys; rotate on the same schedule. |
| 7 Memory | Storage credentials rotate; scan stores for accidentally captured secrets. |
| 8 Authority | Delegations have `expires`; renewal is a re-signing by the owner, not a rotation. |
| 9 Trust | Attestations re-issued when the signing key changes. |
| 10 Governance | Every rotation and revocation lands in the audit log. |

## Gotchas

- **Revoke first on a suspected leak.** Rotation is the calm path. If a key may have leaked, revoke immediately and accept the outage; then issue a new key. Rotating in the leak case gives the attacker the overlap window.
- **The agent should not hold rotation rights.** An agent that can create its own keys can create a key you do not know about. Rotation is a provisioner action.
- **Cached tokens outlive the store.** A gateway or MCP server may cache a token for its full lifetime. Size the overlap window to the longest cache.
- **Rotation that only rotates the store.** If the runtime reads once at boot and never again, the new key sits unused and the old one keeps working until revocation breaks the agent.
- **Signing key rotation without a DID update.** Counterparties verifying against the old document reject the agent, and registries that pin the key mark it as changed.
- **Forgetting delegations.** A delegation bound to a rotated signing key by key ID must be re-issued, or the agent loses authority quietly.

## Related

- [3. Authentication](../stack/03-authentication.md), [1. Identity](../stack/01-identity.md), [10. Governance](../stack/10-governance.md).
- [Credentials & Tool Auth](../providers/credentials-and-tool-auth.md) for secret stores and token vaults.
- [Authentication & Delegation](../standards/auth-and-delegation.md) for OAuth 2.1, token exchange, SPIFFE.
- [Death](death.md) for revocation as a wind-down step.
