# Migration

An agent migrates when something underneath it changes without the agent itself being retired: a new compute provider, a new owner, a new model provider, a new domain. The Birth Stack makes these cases easy to reason about because each one touches a known set of layers. The rule of thumb: state is portable, credentials are re-provisioned, and anything that binds identity to a party is re-attested. The [Birth Profile](../manifest.md) is the migration checklist; diff the old and new manifests and every changed key tells you what to do.

## Procedure

```mermaid
flowchart LR
    A[Active] --> F[Freeze: pause tasks, drain in-flight]
    F --> S[Snapshot memory, files, secret refs, manifest]
    S --> P[Provision target layers]
    P --> R[Re-attest: delegations, owner VC, registrations]
    R --> V[Verify: resolve DID, test kill switch, replay one task]
    V --> C[Cut over endpoints, revoke old credentials]
    C --> A2[Active on new footing]
```

The four common migrations, from cheapest to most expensive:

### Between compute providers

State is memory plus files plus secret references. Identity does not change.

1. Suspend the agent (see [Death](death.md) for the Suspended state).
2. Export memory stores and the storage bucket; verify the export can be read back.
3. Provision the new runtime with the same isolation level and egress allowlist from `spec.compute`.
4. Point the new runtime at the same `spec.authentication.secretStore`. If credentials were baked into the old image, this is where you discover it; issue new ones from the store rather than copying.
5. If workload identity is in use, re-register the workload (new SPIFFE selectors, new TEE attestation).
6. Update `spec.compute.runtime`, resume, and revoke anything the old provider still holds.

### Between owners

This is an identity event even though the DID may not change. The owner is part of layer 1, and layers 8, 9 and 10 are bound to the owner.

- Re-issue every delegation in `spec.authority.delegations[]`: the old owner's signatures are no longer valid authority.
- Replace the owner attestation in `spec.trust.credentials[]` with one issued by the new owner.
- Transfer registry ownership. Under ERC-8004 the agent is an ERC-721 token; ownership moves by transferring the NFT ([Identity standards](../standards/identity.md)).
- Re-KYC on financial rails. Cards, custodial wallets, and payment providers are underwritten to the owner; the new owner opens new accounts and funds are swept across. See [Payments & Cards](../providers/payments-and-cards.md).
- Move kill-switch control and recovery shares (`spec.governance.killSwitch.controller`, `spec.governance.recovery`). Until this is done, the old owner can still stop the agent.
- If custody of the signing key is `owner`, rotate the key ([Credential Rotation](credential-rotation.md)); the old owner held it.

### Between model providers

A capability change, not an identity change. Update `spec.capabilities.models[]` and the gateway credential. Then re-evaluate: the agent's behaviour under its approval rules and budget was tested against the old model. Run the same evaluation set before resuming, and review the tool list for anything the new model uses differently.

### Between email or domain

The most painful case, because presence is what other systems bootstrapped on. A `did:web` DID lives on the domain; OAuth grants were verified against the inbox; registries and agent cards point at the endpoints. Changing the domain means re-minting the DID or publishing a redirect, re-doing every OAuth grant, re-publishing the agent card, and updating every registry entry. This is why an owner-controlled domain is the first Presence requirement ([2. Presence](../stack/02-presence.md), [Domains & DNS](../providers/domains.md)): renting presence from a provider's domain makes migration away from that provider a re-birth.

## Per-layer notes

| Layer | Compute move | Owner move | Model move | Domain move |
|---|---|---|---|---|
| 1 Identity | portable | re-attest (owner field, possibly key) | portable | re-provision (did:web) |
| 2 Presence | portable | portable | portable | re-provision |
| 3 Authentication | re-provision (issue from store) | re-provision | re-provision (gateway key) | re-provision (OAuth grants) |
| 4 Compute | re-provision | portable | portable | portable |
| 5 Economic Identity | portable | re-provision (re-KYC, sweep) | portable | portable |
| 6 Capabilities | portable | portable | re-provision + re-evaluate | portable |
| 7 Memory | portable (export/import) | portable, review retention | portable | portable |
| 8 Authority | portable | re-attest (all delegations) | portable | portable |
| 9 Trust | re-attest (workload) | re-attest (owner VC, registry transfer) | portable | re-attest (card, registrations) |
| 10 Governance | re-provision (audit sink, kill switch reach) | re-attest (controller, recovery) | portable | portable |

## Gotchas

- **Migrating while Active.** Two runtimes with the same credentials and memory produce duplicate actions and split memory. Suspend first.
- **Copying secrets instead of re-issuing.** The old provider keeps a copy. Issue new ones from the secret store and revoke the old.
- **Owner change without a kill-switch handover.** The agent has two controllers, one of whom no longer has responsibility.
- **Forgetting registry ownership.** A transferred agent whose ERC-8004 token still belongs to the old owner is, to the world, still the old owner's agent.
- **Treating a model swap as a config change.** Approval thresholds and budgets were tuned to one model's behaviour.
- **Memory retention across owners.** Episodic memory may hold the old owner's data; check `spec.memory.stores[].retention` and purge what the new owner is not entitled to.

## Related

- [Birth](birth.md) for the provisioning order you are partially repeating.
- [Death](death.md) for the Suspended and Migrating states.
- [1. Identity](../stack/01-identity.md), [4. Compute](../stack/04-compute.md), [8. Authority](../stack/08-authority.md), [9. Trust](../stack/09-trust.md).
- [Compute & Browsers](../providers/compute-and-browsers.md), [Memory & Storage](../providers/memory-and-storage.md), [Wallets & Keys](../providers/wallets.md).
