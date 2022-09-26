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
const logger_1 = __importDefault(require("../logger"));
class IosBridge {
    constructor() {
        this.hasCommunicationObject =
            window.webkit &&
                window.webkit.messageHandlers &&
                window.webkit.messageHandlers.express &&
                !!window.webkit.messageHandlers.express.postMessage;
        this.eventEmitter = new eventEmitter_1.default();
        this.logsEnabled = false;
        this.isRenameParamsEnabled = true;
        if (!this.hasCommunicationObject) {
            (0, logger_1.default)('No method "express.postMessage", cannot send message to iOS');
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
            const { type } = data, payload = __rest(data, ["type"]);
            const emitterType = ref || constants_1.EVENT_TYPE.RECEIVE;
            const eventFiles = this.isRenameParamsEnabled ?
                files === null || files === void 0 ? void 0 : files.map((file) => (0, case_1.snakeCaseToCamelCase)(file)) : files;
            const event = {
                ref,
                type,
                payload: this.isRenameParamsEnabled ? (0, case_1.snakeCaseToCamelCase)(payload) : payload,
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
        this.eventEmitter.on(constants_1.EVENT_TYPE.RECEIVE, callback);
    }
    sendEvent({ handler, method, params, files, timeout = constants_1.RESPONSE_TIMEOUT, guaranteed_delivery_required = false, }) {
        if (!this.hasCommunicationObject)
            return Promise.reject();
        const ref = (0, uuid_1.v4)(); // UUID to detect express response.
        const eventProps = {
            ref,
            type: constants_1.WEB_COMMAND_TYPE_RPC,
            method,
            handler,
            payload: this.isRenameParamsEnabled ? (0, case_1.camelCaseToSnakeCase)(params) : params,
            guaranteed_delivery_required,
        };
        const eventFiles = this.isRenameParamsEnabled ?
            files === null || files === void 0 ? void 0 : files.map((file) => (0, case_1.camelCaseToSnakeCase)(file)) : files;
        const event = files ? Object.assign(Object.assign({}, eventProps), { files: eventFiles }) : eventProps;
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
    sendBotEvent({ method, params, files, timeout = constants_1.RESPONSE_TIMEOUT, guaranteed_delivery_required, }) {
        return this.sendEvent({ handler: constants_1.HANDLER.BOTX, method, params, files, timeout, guaranteed_delivery_required });
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
    sendClientEvent({ method, params, timeout = constants_1.RESPONSE_TIMEOUT }) {
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
exports.default = IosBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wbGF0Zm9ybXMvaW9zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBaUM7QUFTakMsa0NBQW9FO0FBQ3BFLDRDQUEwRjtBQUMxRixtRUFBa0Q7QUFDbEQsdURBQTJCO0FBRTNCLE1BQU0sU0FBUztJQU1iO1FBQ0UsSUFBSSxDQUFDLHNCQUFzQjtZQUN6QixNQUFNLENBQUMsTUFBTTtnQkFDYixNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWU7Z0JBQzdCLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU87Z0JBQ3JDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFBO1FBQ3JELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxzQkFBb0IsRUFBRSxDQUFBO1FBQzlDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFBO1FBQ3hCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUE7UUFFakMsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUNoQyxJQUFBLGdCQUFHLEVBQUMsNkRBQTZELENBQUMsQ0FBQTtZQUNsRSxPQUFNO1NBQ1A7UUFFRCw2QkFBNkI7UUFDN0IsTUFBTSxDQUFDLGNBQWMsR0FBRyxDQUFDLEVBQ0UsR0FBRyxFQUNILElBQUksRUFDSixLQUFLLEdBTy9CLEVBQVEsRUFBRTtZQUNULElBQUksSUFBSSxDQUFDLFdBQVc7Z0JBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQ1QseUJBQXlCLEVBQ3pCLElBQUksQ0FBQyxTQUFTLENBQ1o7b0JBQ0UsR0FBRztvQkFDSCxJQUFJO29CQUNKLEtBQUs7aUJBQ04sRUFDRCxJQUFJLEVBQ0osQ0FBQyxDQUNGLENBQ0YsQ0FBQTtZQUVILE1BQU0sRUFBRSxJQUFJLEtBQWlCLElBQUksRUFB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