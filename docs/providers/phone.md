# Phone, SMS & Voice

A phone number is the second verification channel most services demand, and for an agent it is the hardest resource in the whole [Presence](../stack/02-presence.md) layer to obtain honestly. The requirement splits three ways: *receive* one-time codes so the agent can finish signups and log back in; *send* messages to humans (notifications, confirmations); and *speak* on the phone when the counterparty is a call centre or a customer. An agent-native provider lets code buy a number, receive inbound SMS by webhook, place and answer calls with a programmable voice pipeline, and release the number, all without a human in the loop and without the provider treating that as fraud.

The traps are structural, not technical. Carriers and OTP-issuing services actively reject numbers they classify as VoIP or "non-fixed", which is exactly what every CPaaS provider hands out. US application-to-person (A2P) traffic on 10-digit long codes requires 10DLC registration of a brand and a campaign, tied to a legal entity with a tax ID, before messages are delivered reliably. Many services' terms forbid automated OTP handling outright. The pragmatic answer for OTP receipt is therefore usually not a fresh CPaaS number at all: it is the owner's own mobile number with messages forwarded to the agent, or a dedicated carrier number (a real SIM or eSIM on a mobile network) registered to the owner's business and bridged into the agent's inbox. Treat any received OTP as a credential and route it through the [Authentication](../stack/03-authentication.md) layer's secret store rather than into a log.

## Interfaces

- **Number provisioning API** - Search, buy, configure and release numbers by REST call; the minimum for an agent to own a number at all.
- **Inbound SMS webhook** - The provider POSTs each received message to the agent's endpoint. This is how OTP receipt works when it works.
- **Outbound messaging API** - Send SMS/MMS; in the US requires a registered 10DLC campaign, toll-free verification, or a short code.
- **Programmable voice** - TwiML-style call control or a WebSocket media stream, so the agent can drive a call turn by turn; the voice-agent platforms wrap this with speech-to-text, an LLM, and text-to-speech.
- **SIP trunking** - Bring the number into the agent's own PBX or media server; the lowest-level and cheapest path at volume.
- **Forwarding bridge** - Not an API: the owner's carrier forwards SMS or calls to a CPaaS number or an app the agent reads. Ugly, but it passes VoIP checks because the number of record is a real mobile.

## Providers

| Provider | Agent-native | OSS | Pricing | Notes |
|---|---|---|---|---|
| [Twilio](https://www.twilio.com) | Usable | No | Usage-based | Reference CPaaS; numbers, SMS, voice, SIP. US A2P needs 10DLC brand + campaign registration; numbers are VoIP-class for OTP purposes. |
| [Telnyx](https://telnyx.com) | Usable | No | Usage-based | Own carrier network; numbers, SMS, voice, SIP; generally cheaper per message than Twilio; same 10DLC obligations. |
| [Vonage](https://www.vonage.com) | Usable | No | Usage-based | SMS, voice, verify and video APIs; a Verify product for *sending* OTPs, not receiving them. |
| [Plivo](https://www.plivo.com) | Usable | No | Usage-based | SMS and voice APIs with number provisioning; 10DLC registration through the console or API. |
| [Bland](https://www.bland.ai) | Yes | No | Usage-based | Voice agents that place and receive calls with a scripted or LLM-driven conversation; brings its own numbers or uses yours. |
| [Vapi](https://vapi.ai) | Yes | No | Usage-based | Voice-agent orchestration API: STT, LLM, TTS pipeline over telephony or web; SIP and BYO-number support. |
| [Retell](https://www.retellai.com) | Yes | No | Usage-based | Voice-agent API with call transfer, knowledge bases and post-call analysis; numbers via Twilio or Telnyx integration. |
| Owner's carrier number + forwarding | Usable | n/a | n/a | A real mobile or eSIM registered to the owner or the owner's business, with SMS forwarded into the agent's inbox; the only reliable route through VoIP-rejecting verifiers. Not a product; a procedure. |

## Resources

- [Twilio A2P 10DLC](https://www.twilio.com/docs/messaging/compliance/a2p-10dlc) - What brand and campaign registration requires and how throughput is assigned.
- [Telnyx 10DLC](https://developers.telnyx.com/docs/messaging/10dlc) - The same process from a second carrier's perspective.
- [The Campaign Registry](https://www.campaignregistry.com/) - The industry registry behind 10DLC; useful for understanding what carriers actually check.
- [CTIA Messaging Principles and Best Practices](https://www.ctia.org/the-wireless-industry/industry-commitments/messaging-interoperability-sms-mms) - The rules US carriers enforce on A2P traffic.
- [Twilio Programmable Voice](https://www.twilio.com/docs/voice) - Call control and media streams.
- [Vonage developer](https://developer.vonage.com/) - Messages, Voice and Verify APIs.
- [Plivo docs](https://www.plivo.com/docs/) - Numbers, messaging and voice.
- [Bland docs](https://docs.bland.ai) · [Vapi docs](https://docs.vapi.ai) · [Retell docs](https://docs.retellai.com) - Voice-agent APIs.

## Related

- [2. Presence](../stack/02-presence.md) - `spec.presence.phone`; when a phone is minimum viable and when it is not.
- [3. Authentication](../stack/03-authentication.md) - OTPs are credentials; store them accordingly.
- [8. Authority](../stack/08-authority.md) - Placing calls and sending messages to humans is an action that often needs an approval rule.
- [Email](email.md) - The verification channel to prefer wherever a service allows it.
- [Accounts & Legal Entity](accounts-and-legal-entity.md) - The owner's business entity that 10DLC and carrier contracts are registered to.
