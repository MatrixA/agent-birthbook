# birth.yaml — the Agent Birth Manifest

> **Status: experimental.** The manifest is a seed, not a specification. Field names may change. Every section is optional and every object accepts extra keys, so you can use it today to *describe* an agent without waiting for it to be finished.

The Agent Birth Manifest (ABM) is a machine-readable statement of what an agent has been provisioned with, one section per layer of the [Birth Stack](birth-stack.md). One agent's manifest is its **Birth Profile**.

- Schema: [`manifests/schema.json`](https://github.com/MatrixA/agent-birthbook/blob/main/manifests/schema.json) (JSON Schema 2020-12)
- Example: [`manifests/examples/research-agent.birth.yaml`](https://github.com/MatrixA/agent-birthbook/blob/main/manifests/examples/research-agent.birth.yaml)

## Why a file

Three uses, in order of how soon they are realistic:

1. **A checklist that cannot be skipped.** Writing the profile forces every layer to be answered, including the ones teams forget (who holds the kill switch, what the daily budget is, when keys rotate). An empty section is a finding.
2. **An audit artifact.** A profile plus an audit log is enough to answer "what could this agent do, and what did it do" after an incident.
3. **Provisioning input.** Eventually a tool can read a profile and drive [Birth Providers](providers/README.md) to create the inbox, the sandbox, the wallet and the limits. Nothing in this repo does that yet.

## Rules

- **No secrets.** `secretRef` fields point into `spec.authentication.secretStore`. The profile is safe to commit.
- **Owner is mandatory.** `metadata.owner` is the only field besides `name` that is required. An agent without a responsible party is not born, it is loose.
- **Layer names are fixed.** The ten keys under `spec` match the stack. Put anything that does not fit under the closest layer with an extra key rather than inventing an eleventh.

## Shape

```yaml
apiVersion: birthbook.dev/v0
kind: BirthProfile
metadata:
  name: <agent name>
  owner: <DID, email or org handle of the responsible party>
  createdAt: "<RFC 3339>"
  purpose: <one sentence>
spec:
  identity:        # 1
  presence:        # 2
  authentication:  # 3
  compute:         # 4
  economy:         # 5
  capabilities:    # 6
  memory:          # 7
  authority:       # 8
  trust:           # 9
  governance:      # 10
```

## Field walkthrough

Each layer's chapter has an "In the manifest" section; this table is the index.

| Section | Key fields | Chapter |
|---|---|---|
| `spec.identity` | `did`; `keys[] {id, type, custody, publicKey}`; `registrations[] {registry, id, url}` | [1. Identity](stack/01-identity.md) |
| `spec.presence` | `email`; `domain`; `phone`; `endpoints[] {protocol, url}` | [2. Presence](stack/02-presence.md) |
| `spec.authentication` | `secretStore`; `credentials[] {service, type, scopes[], secretRef, rotation}` | [3. Authentication](stack/03-authentication.md) |
| `spec.compute` | `runtime`; `isolation`; `browser`; `network {egress, allow[]}`; `storage` | [4. Compute](stack/04-compute.md) |
| `spec.economy` | `wallets[] {chain, address, custody, provider}`; `cards[] {issuer, last4, controls}`; `budget {currency, perTransaction, perDay, perMonth}`; `paymentProtocols[]` | [5. Economic Identity](stack/05-economy.md) |
| `spec.capabilities` | `models[] {id, via, role}`; `tools[] {name, kind, source}`; `skills[]` | [6. Capabilities](stack/06-capabilities.md) |
| `spec.memory` | `stores[] {kind, provider, retention}`; `encryptionAtRest` | [7. Memory](stack/07-memory.md) |
| `spec.authority` | `principal`; `delegations[] {scope, grantedBy, expires, canSubDelegate, maxDelegationDepth}`; `approvals[] {action, approver, channel}` | [8. Authority](stack/08-authority.md) |
| `spec.trust` | `credentials[] {type, issuer, url}`; `reputation[] {registry, id}`; `kya` | [9. Trust](stack/09-trust.md) |
| `spec.governance` | `auditLog`; `killSwitch {controller, mechanism}`; `limits {}`; `recovery`; `reviewCadence` | [10. Governance](stack/10-governance.md) |

Enumerations worth knowing:

- `custody` (identity keys and wallets): `self` · `owner` · `provider` · `tee` · `mpc`
- `authentication.credentials[].type`: `oauth2` · `api-key` · `jwt` · `mtls` · `http-signature` · `spiffe` · `other`
- `compute.isolation`: `microvm` · `container` · `process` · `none`
- `compute.network.egress`: `open` · `allowlist` · `none`
- `capabilities.tools[].kind`: `mcp` · `cli` · `http` · `sdk` · `skill`
- `memory.stores[].kind`: `working` · `episodic` · `semantic` · `files` · `knowledge-graph`
- Durations (`rotation`, `retention`, `reviewCadence`) are ISO 8601: `P30D`, `PT12H`, or the literal `forever` for retention.

## Validating

```sh
python3 -c "import json,yaml,jsonschema; jsonschema.validate(
  yaml.safe_load(open('manifests/examples/research-agent.birth.yaml')),
  json.load(open('manifests/schema.json')),
  format_checker=jsonschema.FormatChecker()); print('ok')"
```

Quote timestamps in YAML (`"2026-09-10T00:00:00Z"`); unquoted, most YAML parsers turn them into native datetimes and the `date-time` string check fails.

## Reading the example

The example profile describes a research agent named `scout`. Things to notice:

- Its identity key is `custody: provider` — the wallet platform holds it under policy, so a compromised sandbox cannot exfiltrate it. See [Wallets & Keys](providers/wallets.md).
- It has an email on the owner's subdomain, not a consumer mailbox. See [Presence](stack/02-presence.md).
- Its GitHub credential rotates daily (`P1D`) because it is a GitHub App installation token; its mail API key rotates every 90 days. See [Credential Rotation](lifecycle/credential-rotation.md).
- Egress is an allowlist of four hosts. See [Compute](stack/04-compute.md).
- It may pay up to 2 USD per call over x402 without asking; anything above that is an `approvals[]` entry routed to Slack. See [Authority](stack/08-authority.md).
- The kill switch `mechanism: all` means suspend runtime, revoke credentials and freeze the wallet in one action. See [Governance](stack/10-governance.md).

## What is deliberately missing

- **Versioning and signatures.** A real spec needs a signed profile so a counterparty can trust it. That belongs with the [Trust](stack/09-trust.md) layer and is not designed yet.
- **Provider drivers.** The requirement → interface → provider chain is described in prose; there is no driver interface for tools to implement.
- **Conformance tests.** Only the example is validated.

If you are building any of these, open an issue first so the field names can be agreed.
