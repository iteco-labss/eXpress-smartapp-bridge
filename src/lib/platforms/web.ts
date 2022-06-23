import { v4 as uuid } from 'uuid'

import {
  Bridge,
  BridgeSendBotEventParams,
  BridgeSendClientEventParams,
  BridgeSendEventParams,
  EventEmitterCallback,
} from '../../types'
import {
  EVENT_TYPE,
  HANDLER,
  RESPONSE_TIMEOUT,
  WEB_COMMAND_TYPE,
  WEB_COMMAND_TYPE_RPC,
  WEB_COMMAND_TYPE_RPC_LOGS,
} from '../constants'
import ExtendedEventEmitter from '../eventEmitter'

class WebBridge implements Bridge {
  private readonly eventEmitter: ExtendedEventEmitter
  logsEnabled: boolean

  constructor() {
    this.eventEmitter = new ExtendedEventEmitter()
    this.addGlobalListener()
    this.logsEnabled = false
  }

  addGlobalListener() {
    window.addEventListener('message', (event: MessageEvent): void => {
      if (
        typeof event.data !== 'object' ||
        typeof event.data.data !== 'object' ||
        typeof event.data.data.type !== 'string'
      )
        return

      if (this.logsEnabled) console.log('Bridge ~ Incoming event', event.data)

      const {
        ref,
        data: { type, ...payload },
        files,
      } = event.data
      const emitterType = ref || EVENT_TYPE.RECEIVE

      this.eventEmitter.emit(emitterType, { ref, type, payload, files })
    })
  }

  /**
   * Set callback function to handle events without **ref**
   * (notifications for example).
   *
   * ```js
   * bridge.onReceive(({ type, handler, payload }) => {
   *   // Handle event data
   *   console.log('event', type, handler, payload)
   * })
   * ```
   * @param callback - Callback function.
   */
  onReceive(callback: EventEmitterCallback) {
    this.eventEmitter.on(EVENT_TYPE.RECEIVE, callback)
  }

  protected sendEvent({
    handler,
    method,
    params,
    files,
    timeout = RESPONSE_TIMEOUT,
    guaranteed_delivery_required = false,
  }: BridgeSendEventParams) {
    const ref = uuid() // UUID to detect express response.
    const payload = { ref, type: WEB_COMMAND_TYPE_RPC, method, handler, payload: params, guaranteed_delivery_required }
    const event = files ? { ...payload, files } : payload

    if (this.logsEnabled) console.log('Bridge ~ Outgoing event', event)

    window.parent.postMessage(
      {
        type: WEB_COMMAND_TYPE,
        payload: event,
      },
      '*'
    )

    return this.eventEmitter.onceWithTimeout(ref, timeout)
  }

  /**
   * Send event and wait response from express client.
   *
   * ```js
   * bridge
   *   .sendClientEvent(
   *     {
   *       method: 'get_weather',
   *       params: {
   *         city: 'Moscow',
   *       },
   *     }
   *   )
   *   .then(data => {
   *     // Handle response
   *     console.log('response', data)
   *   })
   * ```
   * @param method - Event type.
   * @param params
   * @param files
   * @param timeout - Timeout in ms.
   * @param guaranteed_delivery_required - boolean.
   */
  sendBotEvent({ method, params, files, timeout, guaranteed_delivery_required }: BridgeSendBotEventParams) {
    return this.sendEvent({ handler: HANDLER.BOTX, method, params, files, timeout, guaranteed_delivery_required })
  }

  /**
   * Send event and wait response from express client.
   *
   * ```js
   * bridge
   *   .sendClientEvent(
   *     {
   *       method: 'get_weather',
   *       params: {
   *         city: 'Moscow',
   *       },
   *     }
   *   )
   *   .then(data => {
   *     // Handle response
   *     console.log('response', data)
   *   })
   * ```
   * @param method - Event type.
   * @param params
   * @param timeout - Timeout in ms.
   */
  sendClientEvent({ method, params, timeout }: BridgeSendClientEventParams) {
    return this.sendEvent({ handler: HANDLER.EXPRESS, method, params, timeout })
  }

  /**
   * Enabling logs.
   *
   * ```js
   * bridge
   *   .enableLogs()
   * ```
   */
  enableLogs() {
    this.logsEnabled = true
    const _log = console.log

    console.log = function (...rest: unknown[]) {
      window.parent.postMessage(
        {
          type: WEB_COMMAND_TYPE_RPC_LOGS,
          payload: rest,
        },
        '*'
      )

      _log.apply(console, rest)
    }
  }

  /**
   * Disabling logs.
   *
   * ```js
   * bridge
   *   .disableLogs()
   * ```
   */
  disableLogs() {
    this.logsEnabled = false
  }
}

export default WebBridge
