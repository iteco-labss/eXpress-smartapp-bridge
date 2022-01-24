import { HANDLER } from '../lib/constants'

import { EmitterEventPayload, EventEmitterCallback } from './eventEmitter'

type BridgeSendClientEventParams = {
  readonly method: string
  readonly params: object | undefined
  readonly timeout: number
}

type BridgeSendBotEventParams = BridgeSendClientEventParams & {
  readonly files?: any
}

type BridgeSendEventParams = BridgeSendClientEventParams & BridgeSendBotEventParams & {
  readonly handler: HANDLER
}

type Bridge = {
  readonly onReceive: (callback: EventEmitterCallback) => void
  readonly sendBotEvent: (event: BridgeSendBotEventParams) => Promise<EmitterEventPayload>
  readonly sendClientEvent: (event: BridgeSendClientEventParams) => Promise<EmitterEventPayload>
}
