import { v4 as uuid } from 'uuid';
import { EVENT_TYPE, HANDLER, RESPONSE_TIMEOUT, WEB_COMMAND_TYPE, WEB_COMMAND_TYPE_RPC, WEB_COMMAND_TYPE_RPC_LOGS, } from '../constants';
import ExtendedEventEmitter from '../eventEmitter';
class WebBridge {
    eventEmitter;
    logsEnabled;
    constructor() {
        this.eventEmitter = new ExtendedEventEmitter();
        this.addGlobalListener();
        this.logsEnabled = false;
    }
    addGlobalListener() {
        window.addEventListener('message', (event) => {
            if (typeof event.data !== 'object' ||
                typeof event.data.data !== 'object' ||
                typeof event.data.data.type !== 'string')
                return;
            const { ref, data: { type, ...payload }, files, } = event.data;
            if (this.logsEnabled)
                console.log('Bridge ~ Incoming event', event.data);
            const emitterType = ref || EVENT_TYPE.RECEIVE;
            this.eventEmitter.emit(emitterType, {
                ref,
                type,
                payload,
                files,
            });
        });
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
     */
    onReceive(callback) {
        this.eventEmitter.on(EVENT_TYPE.RECEIVE, callback);
    }
    sendEvent({ handler, method, params, files, timeout = RESPONSE_TIMEOUT, guaranteed_delivery_required = false, }) {
        const ref = uuid(); // UUID to detect express response.
        const payload = {
            ref,
            type: WEB_COMMAND_TYPE_RPC,
            method,
            handler,
            payload: params,
            guaranteed_delivery_required,
        };
        const event = files ? { ...payload, files } : payload;
        if (this.logsEnabled)
            console.log('Bridge ~ Outgoing event', event);
        window.parent.postMessage({
            type: WEB_COMMAND_TYPE,
            payload: event,
        }, '*');
        return this.eventEmitter.onceWithTimeout(ref, timeout);
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
     */
    sendClientEvent({ method, params, timeout }) {
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
        const _log = console.log;
        console.log = function (...rest) {
            window.parent.postMessage({
                type: WEB_COMMAND_TYPE_RPC_LOGS,
                payload: rest,
            }, '*');
            _log.apply(console, rest);
        };
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
        console.log('Bridge ~ WARN: enableRenameParams() is deprecated and has no effect');
    }
    /**
     * Enabling renaming event params from camelCase to snake_case and vice versa
     * ```js
     * bridge
     *    .disableRenameParams()
     * ```
     */
    disableRenameParams() {
        console.log('Bridge ~ WARN: disableRenameParams() is deprecated and has no effect');
    }
}
export default WebBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wbGF0Zm9ybXMvd2ViLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxFQUFFLElBQUksSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBU2pDLE9BQU8sRUFDTCxVQUFVLEVBQ1YsT0FBTyxFQUNQLGdCQUFnQixFQUNoQixnQkFBZ0IsRUFDaEIsb0JBQW9CLEVBQ3BCLHlCQUF5QixHQUMxQixNQUFNLGNBQWMsQ0FBQTtBQUNyQixPQUFPLG9CQUFvQixNQUFNLGlCQUFpQixDQUFBO0FBRWxELE1BQU0sU0FBUztJQUNJLFlBQVksQ0FBc0I7SUFDbkQsV0FBVyxDQUFTO0lBRXBCO1FBQ0UsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUE7UUFDOUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7SUFDMUIsQ0FBQztJQUVELGlCQUFpQjtRQUNmLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFtQixFQUFRLEVBQUU7WUFDL0QsSUFDSSxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUTtnQkFDOUIsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRO2dCQUNuQyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRO2dCQUUxQyxPQUFNO1lBRVIsTUFBTSxFQUNKLEdBQUcsRUFDSCxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxPQUFPLEVBQUUsRUFDMUIsS0FBSyxHQUNOLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQTtZQUVkLElBQUksSUFBSSxDQUFDLFdBQVc7Z0JBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxLQUFLLENBQUMsSUFBSSxD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