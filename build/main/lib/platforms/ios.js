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
        this.isRenameParamsEnabledForBotx = true;
        if (!this.hasCommunicationObject) {
            (0, logger_1.default)('No method "express.postMessage", cannot send message to iOS');
            return;
        }
        // Expect json data as string
        window.handleIosEvent = ({ ref, data, files, }) => {
            if (this.logsEnabled)
                console.log('Bridge ~ Incoming event', JSON.stringify({ ref, data, files }, null, 2));
            const { type } = data, payload = __rest(data, ["type"]);
            const emitterType = ref || constants_1.EVENT_TYPE.RECEIVE;
            // const isRenameParamsEnabled = data.handler === HANDLER.BOTX ? this.isRenameParamsEnabledForBotx : true // TODO uncomment when client is ready
            const eventFiles = this.isRenameParamsEnabledForBotx ?
                files === null || files === void 0 ? void 0 : files.map((file) => (0, case_1.snakeCaseToCamelCase)(file)) : files;
            const event = {
                ref,
                type,
                payload: this.isRenameParamsEnabledForBotx ? (0, case_1.snakeCaseToCamelCase)(payload) : payload,
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
        this.eventEmitter.on(constants_1.EVENT_TYPE.RECEIVE, callback);
    }
    sendEvent({ handler, method, params, files, timeout = constants_1.RESPONSE_TIMEOUT, guaranteed_delivery_required = false, }) {
        if (!this.hasCommunicationObject)
            return Promise.reject();
        const ref = (0, uuid_1.v4)(); // UUID to detect express response.
        const isRenameParamsEnabled = handler === constants_1.HANDLER.BOTX ? this.isRenameParamsEnabledForBotx : true;
        const eventProps = {
            ref,
            type: constants_1.WEB_COMMAND_TYPE_RPC,
            method,
            handler,
            payload: isRenameParamsEnabled ? (0, case_1.camelCaseToSnakeCase)(params) : params,
            guaranteed_delivery_required,
        };
        const eventFiles = isRenameParamsEnabled ?
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
     */
    sendBotEvent({ method, params, files, timeout = constants_1.RESPONSE_TIMEOUT, guaranteed_delivery_required, }) {
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
    sendClientEvent({ method, params, timeout = constants_1.RESPONSE_TIMEOUT, }) {
        return this.sendEvent({
            handler: constants_1.HANDLER.EXPRESS,
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
        this.isRenameParamsEnabledForBotx = true;
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
        this.isRenameParamsEnabledForBotx = false;
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
exports.default = IosBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wbGF0Zm9ybXMvaW9zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBaUM7QUFTakMsa0NBQW9FO0FBQ3BFLDRDQUEwRjtBQUMxRixtRUFBa0Q7QUFDbEQsdURBQTJCO0FBRTNCLE1BQU0sU0FBUztJQU1iO1FBQ0UsSUFBSSxDQUFDLHNCQUFzQjtZQUN2QixNQUFNLENBQUMsTUFBTTtnQkFDYixNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWU7Z0JBQzdCLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU87Z0JBQ3JDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFBO1FBQ3ZELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxzQkFBb0IsRUFBRSxDQUFBO1FBQzlDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFBO1FBQ3hCLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUE7UUFFeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUNoQyxJQUFBLGdCQUFHLEVBQUMsNkRBQTZELENBQUMsQ0FBQTtZQUNsRSxPQUFNO1NBQ1A7UUFFRCw2QkFBNkI7UUFDN0IsTUFBTSxDQUFDLGNBQWMsR0FBRyxDQUNwQixFQUNFLEdBQUcsRUFDSCxJQUFJLEVBQ0osS0FBSyxHQU9OLEVBQ0csRUFBRTtZQUNSLElBQUksSUFBSSxDQUFDLFdBQVc7Z0JBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFdkYsTUFBTSxFQUFFLElBQUksS0FBaUIsSUFBSSxFQUFoQixP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