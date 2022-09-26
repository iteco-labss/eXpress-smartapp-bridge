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
                console.log('Bridge ~ Incoming event', JSON.stringify({
                    ref,
                    data,
                    files,
                }, null, 2));
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
     * @param callback - Callback function.
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
     * @param method - Event type.
     * @param params
     * @param files
     * @param timeout - Timeout in ms.
     * @param guaranteed_delivery_required - boolean.
     */
    sendBotEvent({ method, params, files, timeout = RESPONSE_TIMEOUT, guaranteed_delivery_required, }) {
        return this.sendEvent({ handler: HANDLER.BOTX, method, params, files, timeout, guaranteed_delivery_required });
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
     */
    sendClientEvent({ method, params, timeout = RESPONSE_TIMEOUT }) {
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
}
export default IosBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wbGF0Zm9ybXMvaW9zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxFQUFFLElBQUksSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBU2pDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUNwRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGNBQWMsQ0FBQTtBQUMxRixPQUFPLG9CQUFvQixNQUFNLGlCQUFpQixDQUFBO0FBQ2xELE9BQU8sR0FBRyxNQUFNLFdBQVcsQ0FBQTtBQUUzQixNQUFNLFNBQVM7SUFDSSxZQUFZLENBQXNCO0lBQ2xDLHNCQUFzQixDQUFTO0lBQ2hELFdBQVcsQ0FBUztJQUNwQixxQkFBcUIsQ0FBUztJQUU5QjtRQUNFLElBQUksQ0FBQyxzQkFBc0I7WUFDekIsTUFBTSxDQUFDLE1BQU07Z0JBQ2IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlO2dCQUM3QixNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPO2dCQUNyQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQTtRQUNyRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQTtRQUM5QyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtRQUN4QixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFBO1FBRWpDLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUU7WUFDaEMsR0FBRyxDQUFDLDZEQUE2RCxDQUFDLENBQUE7WUFDbEUsT0FBTTtTQUNQO1FBRUQsNkJBQTZCO1FBQzdCLE1BQU0sQ0FBQyxjQUFjLEdBQUcsQ0FBQyxFQUNFLEdBQUcsRUFDSCxJQUFJLEVBQ0osS0FBSyxHQU8vQixFQUFRLEVBQUU7WUFDVCxJQUFJLElBQUksQ0FBQyxXQUFXO2dCQUNsQixPQUFPLENBQUMsR0FBRyxDQUNULHlCQUF5QixFQUN6QixJQUFJLENBQUMsU0FBUyxDQUNaO29CQUNFLEdBQUc7b0JBQ0gsSUFBSTtvQkFDSixLQUFLO2lCQUNOLEVBQ0QsSUFBSSxFQUNKLENBQUMsQ0FDRixDQUNGLENBQUE7WUFFSCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFBO1lBRWpDLE1BQU0sV0FBVyxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFBO1lBRTdDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUM3QyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUE7WUFFL0QsTUFBTSxLQUFLLEdBQUc7Z0JBQ1osR0FBRztnQkFDSCxJQUFJO2dCQUNKLE9BQU8sRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPO2dCQUM3RSxLQUFLLEVBQUUsVUFBVTthQUNsQixDQUFBO1lBRUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQzVDLENBQUMsQ0FBQTtJQUNILENBQUM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNILFNBQVMsQ0FBQyxRQUE4QjtRQUN0QyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ3BELENBQUM7SUFFTyxTQUFTLENBQUMsRUFDSSxPQUFPLEVBQ1AsTUFBTSxFQUNOLE1BQU0sRUFDTixLQUFLLEVBQ0wsT0FBTyxHQUFHLGdCQUFnQixFQUMxQiw0QkFBNEIsR0FBRyxLQUFLLEdBQ2Q7UUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0I7WUFBRSxPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUV6RCxNQUFNLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQSxDQUFDLG1DQUFtQztRQUN0RCxNQUFNLFVBQVUsR0FBRztZQUNqQixHQUFHO1lBQ0gsSUFBSSxFQUFFLG9CQUFvQjtZQUMxQixNQUFNO1lBQ04sT0FBTztZQUNQLE9BQU8sRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNO1lBQzNFLDRCQUE0QjtTQUM3QixDQUFBO1FBRUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDN0MsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBO1FBRS9ELE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLFVBQVUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQTtRQUV2RSxJQUFJLElBQUksQ0FBQyxXQUFXO1lBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUUvRixNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRXhELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ3hELENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bd0JHO0lBQ0gsWUFBWSxDQUFDLEVBQ0UsTUFBTSxFQUNOLE1BQU0sRUFDTixLQUFLLEVBQ0wsT0FBTyxHQUFHLGdCQUFnQixFQUMxQiw0QkFBNEIsR0FDSDtRQUN0QyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsQ0FBQyxDQUFBO0lBQ2hILENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXNCRztJQUNILGVBQWUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxHQUFHLGdCQUFnQixFQUErQjtRQUN6RixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7SUFDOUUsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxVQUFVO1FBQ1IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7SUFDekIsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7SUFDMUIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILGtCQUFrQjtRQUNoQixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFBO1FBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0ZBQW9GLENBQUMsQ0FBQTtJQUNuRyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsbUJBQW1CO1FBQ2pCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUE7UUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxRkFBcUYsQ0FBQyxDQUFBO0lBQ3BHLENBQUM7Q0FDRjtBQUVELGVBQWUsU0FBUyxDQUFBIn0=