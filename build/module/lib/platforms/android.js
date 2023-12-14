import { v4 as uuid } from 'uuid';
import { EVENT_TYPE, HANDLER, RESPONSE_TIMEOUT, WEB_COMMAND_TYPE_RPC } from '../constants';
import ExtendedEventEmitter from '../eventEmitter';
import log from '../logger';
class AndroidBridge {
    eventEmitter;
    hasCommunicationObject;
    logsEnabled;
    constructor() {
        this.hasCommunicationObject = typeof window.express !== 'undefined' && !!window.express.handleSmartAppEvent;
        this.eventEmitter = new ExtendedEventEmitter();
        this.logsEnabled = false;
        if (!this.hasCommunicationObject) {
            log('No method "express.handleSmartAppEvent", cannot send message to Android');
            return;
        }
        // Expect json data as string
        window.handleAndroidEvent = ({ ref, data, files, }) => {
            if (this.logsEnabled)
                console.log('Bridge ~ Incoming event', JSON.stringify({ ref, data, files }, null, 2));
            const { type, ...payload } = data;
            const emitterType = ref || EVENT_TYPE.RECEIVE;
            const event = {
                ref,
                type,
                payload,
                files,
            };
            this.eventEmitter.emit(emitterType, event);
        };
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
    onReceive(callback) {
        this.eventEmitter.on(EVENT_TYPE.RECEIVE, callback);
    }
    sendEvent({ handler, method, params, files, timeout = RESPONSE_TIMEOUT, guaranteed_delivery_required = false, }) {
        if (!this.hasCommunicationObject)
            return Promise.reject();
        const ref = uuid(); // UUID to detect express response.
        const eventParams = {
            ref,
            type: WEB_COMMAND_TYPE_RPC,
            method,
            handler,
            payload: params,
            guaranteed_delivery_required,
        };
        const event = JSON.stringify(files ? { ...eventParams, files } : eventParams);
        if (this.logsEnabled)
            console.log('Bridge ~ Outgoing event', JSON.stringify(event, null, '  '));
        window.express.handleSmartAppEvent(event);
        return this.eventEmitter.onceWithTimeout(ref, timeout);
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
     * @param method - Event type.
     * @param params
     * @param files
     * @param timeout - Timeout in ms.
     * @param guaranteed_delivery_required - boolean.
     * @returns Promise.
     */
    sendBotEvent({ method, params, files, timeout, guaranteed_delivery_required, }) {
        return this.sendEvent({
            handler: HANDLER.BOTX,
            method,
            params,
            files,
            timeout,
            guaranteed_delivery_required,
        });
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
     * @param method - Event type.
     * @param params
     * @param timeout - Timeout in ms.
     * @returns Promise.
     */
    sendClientEvent({ method, params, timeout }) {
        return this.sendEvent({ handler: HANDLER.EXPRESS, method, params, timeout });
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
        this.logsEnabled = true;
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
        this.logsEnabled = false;
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
        console.log('Bridge ~ WARN: enableRenameParams() is deprecated and has no effect');
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
        console.log('Bridge ~ WARN: disableRenameParams() is deprecated and has no effect');
    }
    log(data) {
        if ((!this.hasCommunicationObject || !data) ||
            (typeof data !== 'string' && typeof data !== 'object'))
            return;
        window.express.handleSmartAppEvent(JSON.stringify({ 'SmartApp Log': data }, null, 2));
    }
}
export default AndroidBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5kcm9pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvcGxhdGZvcm1zL2FuZHJvaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEVBQUUsSUFBSSxJQUFJLEVBQUUsTUFBTSxNQUFNLENBQUE7QUFTakMsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxjQUFjLENBQUE7QUFDMUYsT0FBTyxvQkFBb0IsTUFBTSxpQkFBaUIsQ0FBQTtBQUNsRCxPQUFPLEdBQUcsTUFBTSxXQUFXLENBQUE7QUFFM0IsTUFBTSxhQUFhO0lBQ0EsWUFBWSxDQUFzQjtJQUNsQyxzQkFBc0IsQ0FBUztJQUNoRCxXQUFXLENBQVM7SUFFcEI7UUFDRSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsT0FBTyxNQUFNLENBQUMsT0FBTyxLQUFLLFdBQVcsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQTtRQUMzRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQTtRQUM5QyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtRQUV4QixJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFO1lBQ2hDLEdBQUcsQ0FBQyx5RUFBeUUsQ0FBQyxDQUFBO1lBQzlFLE9BQU07U0FDUDtRQUVELDZCQUE2QjtRQUM3QixNQUFNLENBQUMsa0JBQWtCLEdBQUcsQ0FDeEIsRUFDRSxHQUFHLEVBQ0gsSUFBSSxFQUNKLEtBQUssR0FPTixFQUFRLEVBQUU7WUFDYixJQUFJLElBQUksQ0FBQyxXQUFXO2dCQUNsQixPQUFPLENBQUMsR0FBRyxDQUNQLHlCQUF5QixFQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFD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