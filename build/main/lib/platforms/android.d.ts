import { Bridge, BridgeSendBotEventParams, BridgeSendClientEventParams, BridgeSendEventParams, EventEmitterCallback } from '../../types';
declare class AndroidBridge implements Bridge {
    private readonly eventEmitter;
    private readonly hasCommunicationObject;
    constructor();
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
    protected sendEvent({ handler, method, params, files, timeout }: BridgeSendEventParams): Promise<import("../../types").EmitterEventPayload>;
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
     * @param method - Event type.
     * @param params
     * @param files
     * @param timeout - Timeout in ms.
     * @returns Promise.
     */
    sendBotEvent({ method, params, files, timeout }: BridgeSendBotEventParams): Promise<import("../../types").EmitterEventPayload>;
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
     * @param method - Event type.
     * @param params
     * @param timeout - Timeout in ms.
     * @returns Promise.
     */
    sendClientEvent({ method, params, timeout }: BridgeSendClientEventParams): Promise<import("../../types").EmitterEventPayload>;
}
export default AndroidBridge;
