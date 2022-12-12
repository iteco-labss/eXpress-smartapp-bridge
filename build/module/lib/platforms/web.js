import { v4 as uuid } from "uuid";
import { camelCaseToSnakeCase, snakeCaseToCamelCase } from "../case";
import { EVENT_TYPE, HANDLER, PLATFORM, RESPONSE_TIMEOUT, WEB_COMMAND_TYPE, WEB_COMMAND_TYPE_RPC, WEB_COMMAND_TYPE_RPC_LOGS, } from "../constants";
import ExtendedEventEmitter from "../eventEmitter";
import getPlatform from "../platformDetector";
class WebBridge {
    eventEmitter;
    logsEnabled;
    isRenameParamsEnabled;
    constructor() {
        this.eventEmitter = new ExtendedEventEmitter();
        this.addGlobalListener();
        this.logsEnabled = false;
        this.isRenameParamsEnabled = true;
    }
    addGlobalListener() {
        window.addEventListener("message", (event) => {
            const isRenameParamsWasEnabled = this.isRenameParamsEnabled;
            if (getPlatform() === PLATFORM.WEB &&
                event.data.handler === HANDLER.EXPRESS &&
                this.isRenameParamsEnabled)
                this.isRenameParamsEnabled = false;
            if (typeof event.data !== "object" ||
                typeof event.data.data !== "object" ||
                typeof event.data.data.type !== "string")
                return;
            if (this.logsEnabled)
                console.log("Bridge ~ Incoming event", event.data);
            const { ref, data: { type, ...payload }, files, } = event.data;
            const emitterType = ref || EVENT_TYPE.RECEIVE;
            const eventFiles = this.isRenameParamsEnabled ?
                files?.map((file) => snakeCaseToCamelCase(file)) : files;
            this.eventEmitter.emit(emitterType, {
                ref,
                type,
                payload: this.isRenameParamsEnabled ? snakeCaseToCamelCase(payload) : payload,
                files: eventFiles,
            });
            if (isRenameParamsWasEnabled)
                this.isRenameParamsEnabled = true;
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
     * @param callback - Callback function.
     */
    onReceive(callback) {
        this.eventEmitter.on(EVENT_TYPE.RECEIVE, callback);
    }
    sendEvent({ handler, method, params, files, timeout = RESPONSE_TIMEOUT, guaranteed_delivery_required = false, }) {
        const isRenameParamsWasEnabled = this.isRenameParamsEnabled;
        if (getPlatform() === PLATFORM.WEB &&
            handler === HANDLER.EXPRESS &&
            this.isRenameParamsEnabled)
            this.disableRenameParams();
        const ref = uuid(); // UUID to detect express response.
        const payload = {
            ref,
            type: WEB_COMMAND_TYPE_RPC,
            method,
            handler,
            payload: this.isRenameParamsEnabled ? camelCaseToSnakeCase(params) : params,
            guaranteed_delivery_required,
        };
        const eventFiles = this.isRenameParamsEnabled ?
            files?.map((file) => camelCaseToSnakeCase(file)) : files;
        const event = files ? { ...payload, files: eventFiles } : payload;
        if (this.logsEnabled)
            console.log("Bridge ~ Outgoing event", event);
        window.parent.postMessage({
            type: WEB_COMMAND_TYPE,
            payload: event,
        }, "*");
        if (isRenameParamsWasEnabled)
            this.enableRenameParams();
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
     * @param method - Event type.
     * @param params
     * @param files
     * @param is_rename_params_fields - boolean.
     * @param timeout - Timeout in ms.
     * @param guaranteed_delivery_required - boolean.
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
     * @param method - Event type.
     * @param params
     * @param timeout - Timeout in ms.
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
        const _log = console.log;
        console.log = function (...rest) {
            window.parent.postMessage({
                type: WEB_COMMAND_TYPE_RPC_LOGS,
                payload: rest,
            }, "*");
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
        this.isRenameParamsEnabled = true;
        console.log("Bridge ~ Enabled renaming event params from camelCase to snake_case and vice versa");
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
        console.log("Bridge ~ Disabled renaming event params from camelCase to snake_case and vice versa");
    }
}
export default WebBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wbGF0Zm9ybXMvd2ViLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxFQUFFLElBQUksSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBU2pDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUNwRSxPQUFPLEVBQ0wsVUFBVSxFQUNWLE9BQU8sRUFBRSxRQUFRLEVBQ2pCLGdCQUFnQixFQUNoQixnQkFBZ0IsRUFDaEIsb0JBQW9CLEVBQ3BCLHlCQUF5QixHQUMxQixNQUFNLGNBQWMsQ0FBQTtBQUNyQixPQUFPLG9CQUFvQixNQUFNLGlCQUFpQixDQUFBO0FBQ2xELE9BQU8sV0FBVyxNQUFNLHFCQUFxQixDQUFBO0FBRTdDLE1BQU0sU0FBUztJQUNJLFlBQVksQ0FBc0I7SUFDbkQsV0FBVyxDQUFTO0lBQ3BCLHFCQUFxQixDQUFTO0lBRTlCO1FBQ0UsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUE7UUFDOUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7UUFDeEIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQTtJQUNuQyxDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQW1CLEVBQVEsRUFBRTtZQUMvRCxNQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQTtZQUMzRCxJQUNFLFdBQVcsRUFBRSxLQUFLLFFBQVEsQ0FBQyxHQUFHO2dCQUM5QixLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxPQUFPLENBQUMsT0FBTztnQkFDdEMsSUFBSSxDQUFDLHFCQUFxQjtnQkFFMUIsSUFBSSxDQUFDLHFCQUFxQixH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