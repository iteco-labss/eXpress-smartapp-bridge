import { v4 as uuid } from 'uuid'

import {
  Bridge,
  BridgeSendBotEventParams,
  BridgeSendClientEventParams,
  BridgeSendEventParams,
  EventEmitterCallback,
} from '../../types'
import { EVENT_TYPE, HANDLER, RESPONSE_TIMEOUT, WEB_COMMAND_TYPE_RPC } from '../constants'
import ExtendedEventEmitter from '../eventEmitter'
import log from '../logger'

class IosBridge implements Bridge {
  private readonly eventEmitter: ExtendedEventEmitter
  private readonly hasCommunicationObject: boolean
  logsEnabled: boolean

  constructor() {
    this.hasCommunicationObject =
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.express &&
        !!window.webkit.messageHandlers.express.postMessage
    this.eventEmitter = new ExtendedEventEmitter()
    this.logsEnabled = false

    if (!this.hasCommunicationObject) {
      log('No method "express.postMessage", cannot send message to iOS')
      return
    }

    // Expect json data as string
    window.handleIosEvent = (
        {
          ref,
          data,
          files,
        }: {
          readonly ref: string
          readonly data: {
            readonly type: string
          }
          readonly files: any
        },
    ): void => {
      if (this.logsEnabled)
        console.log('Bridge ~ Incoming event', JSON.stringify({ ref, data, files }, null, 2))

      const { type, ...payload } = data

      const emitterType = ref || EVENT_TYPE.RECEIVE

      const event = {
        ref,
        type,
        payload,
        files,
      }

      this.eventEmitter.emit(emitterType, event)
    }
  }

  /**
   * Set callback function to handle events without **ref**
   * (notifications for example).
   *
   * ```js
   * bridge.onRecieve(({ type, handler, payload }) => {
   *   // Handle event data
   *   console.log('event', type, handler, payload)
   * })
   * ```
   */
  onReceive(callback: EventEmitterCallback) {
    this.eventEmitter.on(EVENT_TYPE.RECEIVE, callback)
  }

  private sendEvent(
      {
        handler,
        method,
        params,
        files,
        timeout = RESPONSE_TIMEOUT,
        guaranteed_delivery_required = false,
      }: BridgeSendEventParams,
  ) {
    if (!this.hasCommunicationObject) return Promise.reject()

    const ref = uuid() // UUID to detect express response.
    const eventProps = {
      ref,
      type: WEB_COMMAND_TYPE_RPC,
      method,
      handler,
      payload: params,
      guaranteed_delivery_required,
    }

    const event = files ? { ...eventProps, files } : eventProps

    if (this.logsEnabled)
      console.log('Bridge ~ Outgoing event', JSON.stringify(event, null, '  '))

    window.webkit.messageHandlers.express.postMessage(event)

    return this.eventEmitter.onceWithTimeout(ref, timeout)
  }

  /**
   * Send event and wait response from express client.
   *
   * ```js
   * bridge
   *   .sendBotEvent(
   *     {
   *       method: 'get_weather',
   *       params: {
   *         city: 'Moscow',
   *       },
   *       files: []
   *     }
   *   )
   *   .then(data => {
   *     // Handle response
   *     console.log('response', data)
   *   })
   * ```
   */
  sendBotEvent(
      {
        method,
        params,
        files,
        timeout = RESPONSE_TIMEOUT,
        guaranteed_delivery_required,
      }: BridgeSendBotEventParams,
  ) {
    return this.sendEvent(
        {
          handler: HANDLER.BOTX,
          method,
          params,
          files,
          timeout,
          guaranteed_delivery_required,
        },
    )
  }

  /**
   * Send event and wait response from express client.
   *
   * ```js
   * bridge
   *   .sendClientEvent(
   *     {
   *       type: 'get_weather',
   *       handler: 'express',
   *       payload: {
   *         city: 'Moscow',
   *       },
   *     }
   *   )
   *   .then(data => {
   *     // Handle response
   *     console.log('response', data)
   *   })
   * ```
   */
  sendClientEvent(
      {
        method,
        params,
        timeout = RESPONSE_TIMEOUT,
      }: BridgeSendClientEventParams,
  ) {
    return this.sendEvent(
        {
          handler: HANDLER.EXPRESS,
          method,
          params,
          timeout,
        },
    )
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

  /**
   * Enabling renaming event params from camelCase to snake_case and vice versa
   * ```js
   * bridge
   *    .enableRenameParams()
   * ```
   * @deprecated since version 2.0
   */
  enableRenameParams() {
    console.log('Bridge ~ WARN: enableRenameParams() is deprecated and has no effect')
  }

  /**
   * Enabling renaming event params from camelCase to snake_case and vice versa
   * ```js
   * bridge
   *    .disableRenameParams()
   * ```
   * @deprecated since version 2.0
   */
  disableRenameParams() {
    console.log('Bridge ~ WARN: disableRenameParams() is deprecated and has no effect')
  }

  log(data: string | object) {
    if (!this.hasCommunicationObject || !data) return

    let value: typeof data = ''
    if (typeof data === 'string') {
      value = data
    } else if (typeof data === 'object') {
      value = JSON.stringify(data, null, 2)
    } else return

    window.webkit.messageHandlers.express.postMessage({ 'SmartApp Log': value })
  }
}

export default IosBridge
