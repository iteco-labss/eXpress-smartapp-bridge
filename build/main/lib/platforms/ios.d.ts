import { Bridge, BridgeSendBotEventParams, BridgeSendClientEventParams, EventEmitterCallback } from '../../types';
declare class IosBridge implements Bridge {
    private readonly eventEmitter;
    private readonly hasCommunicationObject;
    logsEnabled: boolean;
    constructor();
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
    onReceive(callback: EventEmitterCallback): void;
    private sendEvent;
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
    sendBotEvent({ method, params, files, timeout, guaranteed_delivery_required, }: BridgeSendBotEventParams): Promise<import("../../types").EmitterEventPayload>;
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
    sendClientEvent({ method, params, timeout, }: BridgeSendClientEventParams): Promise<import("../../types").EmitterEventPayload>;
    /**
     * Enabling logs.
     *
     * ```js
     * bridge
     *   .enableLogs()
     * ```
     */
    enableLogs(): void;
    /**
     * Disabling logs.
     *
     * ```js
     * bridge
     *   .disableLogs()
     * ```
     */
    disableLogs(): void;
    /**
     * Enabling renaming event params from camelCase to snake_case and vice versa
     * ```js
     * bridge
     *    .enableRenameParams()
     * ```
     * @deprecated since version 2.0
     */
    enableRenameParams(): void;
    /**
     * Enabling renaming event params from camelCase to snake_case and vice versa
     * ```js
     * bridge
     *    .disableRenameParams()
     * ```
     * @deprecated since version 2.0
     */
    disableRenameParams(): void;
    log(data: string | object): void;
}
export default IosBridge;
