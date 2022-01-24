import { EVENT_TYPE, HANDLER } from '../lib/constants'

type EmitterEventPayload = {
  readonly ref: string | undefined
  readonly type: string
  readonly handler: HANDLER
  readonly payload: object | undefined
  readonly files?: object
}

type EmitterEventType = EVENT_TYPE | string

type EventEmitterCallback = (event: EmitterEventPayload) => void

