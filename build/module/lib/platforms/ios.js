import { v4 as uuid } from 'uuid';
import { camelCaseToSnakeCase, snakeCaseToCamelCase } from '../case';
import { EVENT_TYPE, HANDLER, RESPONSE_TIMEOUT, WEB_COMMAND_TYPE_RPC } from '../constants';
import ExtendedEventEmitter from '../eventEmitter';
import log from '../logger';
class IosBridge {
    eventEmitter;
    hasCommunicationObject;
    logsEnabled;
    isRenameParamsEnabled;
    constructor() {
        this.hasCommunicationObject =
            window.webkit &&
                window.webkit.messageHandlers &&
                window.webkit.messageHandlers.express &&
                !!window.webkit.messageHandlers.express.postMessage;
        this.eventEmitter = new ExtendedEventEmitter();
        this.logsEnabled = false;
        this.isRenameParamsEnabled = true;
        if (!this.hasCommunicationObject) {
            log('No method "express.postMessage", cannot send message to iOS');
            return;
        }
        // Expect json data as string
        window.handleIosEvent = ({ ref, data, files, }) => {
            if (this.logsEnabled)
                console.log('Bridge ~ Incoming event', JSON.stringify({ ref, data, files }, null, 2));
            const { type, ...payload } = data;
            const emitterType = ref || EVENT_TYPE.RECEIVE;
            const eventFiles = this.isRenameParamsEnabled ?
                files?.map((file) => snakeCaseToCamelCase(file)) : files;
            const event = {
                ref,
                type,
                payload: this.isRenameParamsEnabled ? snakeCaseToCamelCase(payload) : payload,
                files: eventFiles,
            };
            this.eventEmitter.emit(emitterType, event);
        };
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
    onReceive(callback) {
        this.eventEmitter.on(EVENT_TYPE.RECEIVE, callback);
    }
    sendEvent({ handler, method, params, files, timeout = RESPONSE_TIMEOUT, guaranteed_delivery_required = false, }) {
        if (!this.hasCommunicationObject)
            return Promise.reject();
        const ref = uuid(); // UUID to detect express response.
        const eventProps = {
            ref,
            type: WEB_COMMAND_TYPE_RPC,
            method,
            handler,
            payload: this.isRenameParamsEnabled ? camelCaseToSnakeCase(params) : params,
            guaranteed_delivery_required,
        };
        const eventFiles = this.isRenameParamsEnabled ?
            files?.map((file) => camelCaseToSnakeCase(file)) : files;
        const event = files ? { ...eventProps, files: eventFiles } : eventProps;
        if (this.logsEnabled)
            console.log('Bridge ~ Outgoing event', JSON.stringify(event, null, '  '));
        window.webkit.messageHandlers.express.postMessage(event);
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
     */
    sendBotEvent({ method, params, files, timeout = RESPONSE_TIMEOUT, guaranteed_delivery_required, }) {
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
     */
    sendClientEvent({ method, params, timeout = RESPONSE_TIMEOUT, }) {
        return this.sendEvent({
            handler: HANDLER.EXPRESS,
            method,
            params,
            timeout,
        });
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
     */
    enableRenameParams() {
        this.isRenameParamsEnabled = true;
        console.log('Bridge ~ Enabled renaming event params from camelCase to snake_case and vice versa');
    }
    /**
     * Enabling renaming event params from camelCase to snake_case and vice versa
     * ```js
     * bridge
     *    .disableRenameParams()
     * ```
     */
    disableRenameParams() {
        this.isRenameParamsEnabled = false;
        console.log('Bridge ~ Disabled renaming event params from camelCase to snake_case and vice versa');
    }
    log(data) {
        if (!this.hasCommunicationObject || !data)
            return;
        let value = '';
        if (typeof data === 'string') {
            value = data;
        }
        else if (typeof data === 'object') {
            value = JSON.stringify(data, null, 2);
        }
        else
            return;
        window.webkit.messageHandlers.express.postMessage({ 'SmartApp Log': value });
    }
}
export default IosBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wbGF0Zm9ybXMvaW9zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxFQUFFLElBQUksSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBU2pDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUNwRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGNBQWMsQ0FBQTtBQUMxRixPQUFPLG9CQUFvQixNQUFNLGlCQUFpQixDQUFBO0FBQ2xELE9BQU8sR0FBRyxNQUFNLFdBQVcsQ0FBQTtBQUUzQixNQUFNLFNBQVM7SUFDSSxZQUFZLENBQXNCO0lBQ2xDLHNCQUFzQixDQUFTO0lBQ2hELFdBQVcsQ0FBUztJQUNwQixxQkFBcUIsQ0FBUztJQUU5QjtRQUNFLElBQUksQ0FBQyxzQkFBc0I7WUFDekIsTUFBTSxDQUFDLE1BQU07Z0JBQ2IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlO2dCQUM3QixNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPO2dCQUNyQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQTtRQUNyRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQTtRQUM5QyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtRQUN4QixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFBO1FBRWpDLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUU7WUFDaEMsR0FBRyxDQUFDLDZEQUE2RCxDQUFDLENBQUE7WUFDbEUsT0FBTTtTQUNQO1FBRUQsNkJBQTZCO1FBQzdCLE1BQU0sQ0FBQyxjQUFjLEdBQUcsQ0FDdEIsRUFDRSxHQUFH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