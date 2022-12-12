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
                this.disableRenameParams();
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
                this.enableRenameParams();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wbGF0Zm9ybXMvd2ViLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxFQUFFLElBQUksSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBU2pDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUNwRSxPQUFPLEVBQ0wsVUFBVSxFQUNWLE9BQU8sRUFBRSxRQUFRLEVBQ2pCLGdCQUFnQixFQUNoQixnQkFBZ0IsRUFDaEIsb0JBQW9CLEVBQ3BCLHlCQUF5QixHQUMxQixNQUFNLGNBQWMsQ0FBQTtBQUNyQixPQUFPLG9CQUFvQixNQUFNLGlCQUFpQixDQUFBO0FBQ2xELE9BQU8sV0FBVyxNQUFNLHFCQUFxQixDQUFBO0FBRTdDLE1BQU0sU0FBUztJQUNJLFlBQVksQ0FBc0I7SUFDbkQsV0FBVyxDQUFTO0lBQ3BCLHFCQUFxQixDQUFTO0lBRTlCO1FBQ0UsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUE7UUFDOUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7UUFDeEIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQTtJQUNuQyxDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQW1CLEVBQVEsRUFBRTtZQUMvRCxNQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQTtZQUMzRCxJQUNFLFdBQVcsRUFBRSxLQUFLLFFBQVEsQ0FBQyxHQUFHO2dCQUM5QixLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxPQUFPLENBQUMsT0FBTztnQkFDdEMsSUFBSSxDQUFDLHFCQUFxQjtnQkFFMUIsSUFBSSxDQUFDLG1CQUFtQixF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