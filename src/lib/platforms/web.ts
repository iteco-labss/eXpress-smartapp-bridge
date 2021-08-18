import { v4 as uuid } from 'uuid'

import { BridgeInterface, BridgeSendFuncArgs, EventEmitterCallback } from '../../types'
import { EVENT_TYPE, RESPONSE_TIMEOUT, WEB_COMMAND_TYPE } from '../constants'
import ExtendedEventEmitter from '../eventEmitter'

class WebBridge implements BridgeInterface {
  /** @ignore */
  private readonly eventEmitter: ExtendedEventEmitter

  /** @ignore */
  constructor() {
    this.eventEmitter = new ExtendedEventEmitter()
    this.addGlobalListener()
  }

  /** @ignore */
  addGlobalListener() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.addEventListener('message', (event: MessageEvent<any>): void => {
      if (
        typeof event.data !== 'object' ||
        typeof event.data.data !== 'object' ||
        typeof event.data.data.type !== 'string'
      )
        return

      const {
        ref,
        data: { type, ...payload },
      } = event.data
      const emitterType = ref || EVENT_TYPE.RECEIVE

      this.eventEmitter.emit(emitterType, { ref, type, payload })
    })
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
   * @param ref - UUID to detect express response.
   * @param type - Event type.
   * @param handler - Set client/server side which is handle this event.
   * @param timeout - Timeout in ms.
   * @returns Promise.
   */
  send({ type, handler, payload, timeout = RESPONSE_TIMEOUT }: BridgeSendFuncArgs) {
    const ref = uuid()

    window.parent.postMessage(
      {
        type: WEB_COMMAND_TYPE,
        payload: { ref, type, handler, payload },
      },
      '*'
    )

    return this.eventEmitter.onceWithTimeout(ref, timeout)
  }
}

export default WebBridge
