import { v4 as uuid } from 'uuid'

import { BridgeInterface, BridgeSendFuncArgs, EventEmitterCallback } from '../../types'
import { camelCaseToSnakeCase, snakeCaseToCamelCase } from '../case'
import { EVENT_TYPE, RESPONSE_TIMEOUT } from '../constants'
import ExtendedEventEmitter from '../eventEmitter'
import log from '../logger'

class IosBridge implements BridgeInterface {
  /** @ignore */
  private readonly eventEmitter: ExtendedEventEmitter
  /** @ignore */
  private readonly hasCommunicationObject: boolean

  /** @ignore */
  constructor() {
    this.hasCommunicationObject =
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.express &&
      !!window.webkit.messageHandlers.express.postMessage
    this.eventEmitter = new ExtendedEventEmitter()

    if (!this.hasCommunicationObject) {
      log('No method "express.postMessage", cannot send message to iOS')
      return
    }

    // Expect json data as string
    window.handleIosEvent = ({
      ref,
      data,
    }: {
      readonly ref: string
      readonly data: {
        readonly type: string
      }
    }): void => {
      const { type, ...payload } = data
     
      const emitterType = ref || EVENT_TYPE.RECEIVE
      const event = { ref, type, payload: snakeCaseToCamelCase(payload) }

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
   * @param callback - Callback function.
   */
  onRecieve(callback: EventEmitterCallback) {
    this.eventEmitter.on(EVENT_TYPE.RECEIVE, callback)
  }

  /**
   * Send event and wait response from express client.
   *
   * ```js
   * bridge
   *   .send(
   *     {
   *       type: 'get_weather',
   *       handler: 'botx',
   *       payload: {
   *         city: 'Moscow',
   *       },
   *     }
   *   )
   *   .then(data => {
   *     // Handle response
   *     console.log('respose', data)
   *   })
   * ```
   * @param type - Event type.
   * @param handler - Set client/server side which is handle this event.
   * @param timeout - Timeout in ms. 
   * @returns Promise.
   */
  send({ type, handler, payload, timeout = RESPONSE_TIMEOUT }: BridgeSendFuncArgs) {
    if (!this.hasCommunicationObject) return Promise.reject()

    const ref = uuid()
    const event = { ref, type, handler, payload: camelCaseToSnakeCase(payload) }

    window.webkit.messageHandlers.express.postMessage(event)

    return this.eventEmitter.onceWithTimeout(ref, timeout)
  }
}

export default IosBridge
