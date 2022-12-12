"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const case_1 = require("../case");
const constants_1 = require("../constants");
const eventEmitter_1 = __importDefault(require("../eventEmitter"));
const platformDetector_1 = __importDefault(require("../platformDetector"));
class WebBridge {
    constructor() {
        this.eventEmitter = new eventEmitter_1.default();
        this.addGlobalListener();
        this.logsEnabled = false;
        this.isRenameParamsEnabled = true;
    }
    addGlobalListener() {
        window.addEventListener("message", (event) => {
            const isRenameParamsWasEnabled = this.isRenameParamsEnabled;
            if ((0, platformDetector_1.default)() === constants_1.PLATFORM.WEB &&
                event.data.handler === constants_1.HANDLER.EXPRESS &&
                this.isRenameParamsEnabled)
                this.disableRenameParams();
            if (typeof event.data !== "object" ||
                typeof event.data.data !== "object" ||
                typeof event.data.data.type !== "string")
                return;
            if (this.logsEnabled)
                console.log("Bridge ~ Incoming event", event.data);
            const _a = event.data, { ref } = _a, _b = _a.data, { type } = _b, payload = __rest(_b, ["type"]), { files } = _a;
            const emitterType = ref || constants_1.EVENT_TYPE.RECEIVE;
            const eventFiles = this.isRenameParamsEnabled ?
                files === null || files === void 0 ? void 0 : files.map((file) => (0, case_1.snakeCaseToCamelCase)(file)) : files;
            this.eventEmitter.emit(emitterType, {
                ref,
                type,
                payload: this.isRenameParamsEnabled ? (0, case_1.snakeCaseToCamelCase)(payload) : payload,
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
        this.eventEmitter.on(constants_1.EVENT_TYPE.RECEIVE, callback);
    }
    sendEvent({ handler, method, params, files, timeout = constants_1.RESPONSE_TIMEOUT, guaranteed_delivery_required = false, }) {
        const isRenameParamsWasEnabled = this.isRenameParamsEnabled;
        if ((0, platformDetector_1.default)() === constants_1.PLATFORM.WEB &&
            handler === constants_1.HANDLER.EXPRESS &&
            this.isRenameParamsEnabled)
            this.disableRenameParams();
        const ref = (0, uuid_1.v4)(); // UUID to detect express response.
        const payload = {
            ref,
            type: constants_1.WEB_COMMAND_TYPE_RPC,
            method,
            handler,
            payload: this.isRenameParamsEnabled ? (0, case_1.camelCaseToSnakeCase)(params) : params,
            guaranteed_delivery_required,
        };
        const eventFiles = this.isRenameParamsEnabled ?
            files === null || files === void 0 ? void 0 : files.map((file) => (0, case_1.camelCaseToSnakeCase)(file)) : files;
        const event = files ? Object.assign(Object.assign({}, payload), { files: eventFiles }) : payload;
        if (this.logsEnabled)
            console.log("Bridge ~ Outgoing event", event);
        window.parent.postMessage({
            type: constants_1.WEB_COMMAND_TYPE,
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
            handler: constants_1.HANDLER.BOTX,
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
        return this.sendEvent({ handler: constants_1.HANDLER.EXPRESS, method, params, timeout });
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
                type: constants_1.WEB_COMMAND_TYPE_RPC_LOGS,
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
exports.default = WebBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wbGF0Zm9ybXMvd2ViLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBaUM7QUFTakMsa0NBQW9FO0FBQ3BFLDRDQU9xQjtBQUNyQixtRUFBa0Q7QUFDbEQsMkVBQTZDO0FBRTdDLE1BQU0sU0FBUztJQUtiO1FBQ0UsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLHNCQUFvQixFQUFFLENBQUE7UUFDOUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7UUFDeEIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQTtJQUNuQyxDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQW1CLEVBQVEsRUFBRTtZQUMvRCxNQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQTtZQUMzRCxJQUNFLElBQUEsMEJBQVcsR0FBRSxLQUFLLG9CQUFRLENBQUMsR0FBRztnQkFDOUIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssbUJBQU8sQ0FBQyxPQUFPO2dCQUN0QyxJQUFJLENBQUMscUJBQXFCO2dCQUUxQixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtZQUU1QixJQUNFLE9BQU8sS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRO2dCQUM5QixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVE7Z0JBQ25DLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVE7Z0JBRXhDLE9BQU07WUFFUixJQUFJLElBQUksQ0FBQyxXQUFXO2dCQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxD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