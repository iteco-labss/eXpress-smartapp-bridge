import { Bridge, BridgeSendBotEventParams, BridgeSendClientEventParams, BridgeSendEventParams, EventEmitterCallback } from '../../types';
declare class WebBridge implements Bridge {
    private readonly eventEmitter;
    logsEnabled: boolean;
    constructor();
    addGlobalListener(): void;
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
    onReceive(callback: EventEmitterCallback): void;
    protected sendEvent({ handler, method, params, files, timeout, guaranteed_delivery_required, }: BridgeSendEventParams): Promise<import("../../types").EmitterEventPayload>;
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
    sendBotEvent({ method, params, files, timeout, guaranteed_delivery_required }: BridgeSendBotEventParams): Promise<import("../../types").EmitterEventPayload>;
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
    sendClientEvent({ method, params, timeout }: BridgeSendClientEventParams): Promise<import("../../types").EmitterEventPayload>;
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
}
export default WebBridge;
