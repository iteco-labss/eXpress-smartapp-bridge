import { v4 as uuid } from "uuid"

import {
  Bridge,
  BridgeSendBotEventParams,
  BridgeSendClientEventParams,
  BridgeSendEventParams,
  EventEmitterCallback,
} from "../../types"
import { camelCaseToSnakeCase, snakeCaseToCamelCase } from "../case"
import {
  EVENT_TYPE,
  HANDLER, PLATFORM,
  RESPONSE_TIMEOUT,
  WEB_COMMAND_TYPE,
  WEB_COMMAND_TYPE_RPC,
  WEB_COMMAND_TYPE_RPC_LOGS,
} from "../constants"
import ExtendedEventEmitter from "../eventEmitter"
import getPlatform from "../platformDetector"

class WebBridge implements Bridge {
  private readonly eventEmitter: ExtendedEventEmitter
  logsEnabled: boolean
  isRenameParamsEnabled: boolean

  constructor() {
    this.eventEmitter = new ExtendedEventEmitter()
    this.addGlobalListener()
    this.logsEnabled = false
    this.isRenameParamsEnabled = true
  }

  addGlobalListener() {
    window.addEventListener("message", (event: MessageEvent): void => {
      const isRenameParamsWasEnabled = this.isRenameParamsEnabled
      if (
        getPlatform() === PLATFORM.WEB &&
        event.data.handler === HANDLER.EXPRESS &&
        this.isRenameParamsEnabled
      )
        this.isRenameParamsEnabled = false

      if (
        typeof event.data !== "object" ||
        typeof event.data.data !== "object" ||
        typeof event.data.data.type !== "string"
      )
        return

      if (this.logsEnabled) console.log("Bridge ~ Incoming event", event.data)

      const {
        ref,
        data: { type, ...payload },
        files,
      } = event.data

      const emitterType = ref || EVENT_TYPE.RECEIVE

      const eventFiles = this.isRenameParamsEnabled ?
        files?.map((file: any) => snakeCaseToCamelCase(file)) : files

      this.eventEmitter.emit(emitterType, {
        ref,
        type,
        payload: this.isRenameParamsEnabled ? snakeCaseToCamelCase(payload) : payload,
        files: eventFiles,
      })

      if (isRenameParamsWasEnabled) this.isRenameParamsEnabled = true
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

  private sendEvent(
    {
      handler,
      method,
      params,
      files,
      timeout = RESPONSE_TIMEOUT,
      guaranteed_delivery_required = false,
    }: BridgeSendEventParams) {
    const isRenameParamsWasEnabled = this.isRenameParamsEnabled
    if (
      getPlatform() === PLATFORM.WEB &&
      handler === HANDLER.EXPRESS &&
      this.isRenameParamsEnabled
    )
      this.disableRenameParams()

    const ref = uuid() // UUID to detect express response.
    const payload = {
      ref,
      type: WEB_COMMAND_TYPE_RPC,
      method,
      handler,
      payload: this.isRenameParamsEnabled ? camelCaseToSnakeCase(params) : params,
      guaranteed_delivery_required,
    }

    const eventFiles = this.isRenameParamsEnabled ?
      files?.map((file: any) => camelCaseToSnakeCase(file)) : files

    const event = files ? { ...payload, files: eventFiles } : payload

    if (this.logsEnabled) console.log("Bridge ~ Outgoing event", event)

    window.parent.postMessage(
      {
        type: WEB_COMMAND_TYPE,
        payload: event,
      },
      "*",
    )
    if (isRenameParamsWasEnabled) this.enableRenameParams()

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
   * @param is_rename_params_fields - boolean.
   * @param timeout - Timeout in ms.
   * @param guaranteed_delivery_required - boolean.
   */
  sendBotEvent(
    {
      method,
      params,
      files,
      timeout,
      guaranteed_delivery_required,
    }: BridgeSendBotEventParams) {
    return this.sendEvent({
      handler: HANDLER.BOTX,
      method,
      params,
      files,
      timeout,
      guaranteed_delivery_required,
    })
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

    console.log = function(...rest: unknown[]) {
      window.parent.postMessage(
        {
          type: WEB_COMMAND_TYPE_RPC_LOGS,
          payload: rest,
        },
        "*",
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

  /**
   * Enabling renaming event params from camelCase to snake_case and vice versa
   * ```js
   * bridge
   *    .enableRenameParams()
   * ```
   */
  enableRenameParams() {
    this.isRenameParamsEnabled = true
    console.log("Bridge ~ Enabled renaming event params from camelCase to snake_case and vice versa")
  }

  /**
   * Enabling renaming event params from camelCase to snake_case and vice versa
   * ```js
   * bridge
   *    .disableRenameParams()
   * ```
   */
  disableRenameParams() {
    this.isRenameParamsEnabled = false
    console.log("Bridge ~ Disabled renaming event params from camelCase to snake_case and vice versa")
  }
}

export default WebBridge
