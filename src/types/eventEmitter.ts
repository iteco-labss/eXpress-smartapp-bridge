import { EVENT_TYPE, HANDLER } from '../lib/constants'

export type EmitterEventPayload = {
  readonly ref: string | undefined
  readonly type: string
  readonly handler: HANDLER
  readonly payload: object | undefined
  readonly files?: object
}

export type EmitterEventType = EVENT_TYPE | string

export type EventEmitterCallback = (event: EmitterEventPayload) => void

