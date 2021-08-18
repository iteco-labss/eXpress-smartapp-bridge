import { HANDLER } from '../lib/constants'

import { EmitterEventPayload, EventEmitterCallback } from './eventEmitter'

type BridgeSendFuncArgs = {
  readonly type: string
  readonly handler: HANDLER
  readonly payload: object | undefined
  readonly timeout: number
}

type BridgeInterface = {
  readonly onRecieve: (callback: EventEmitterCallback) => void
  readonly send: (event: BridgeSendFuncArgs) => Promise<EmitterEventPayload>
}
