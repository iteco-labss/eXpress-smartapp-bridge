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
        window.addEventListener('message', (event) => {
            const isRenameParamsWasEnabled = this.isRenameParamsEnabled;
            if ((0, platformDetector_1.default)() === constants_1.PLATFORM.WEB &&
                event.data.handler === constants_1.HANDLER.EXPRESS &&
                this.isRenameParamsEnabled)
                this.isRenameParamsEnabled = false;
            if (typeof event.data !== 'object' ||
                typeof event.data.data !== 'object' ||
                typeof event.data.data.type !== 'string')
                return;
            if (this.logsEnabled)
                console.log('Bridge ~ Incoming event', event.data);
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
     */
    onReceive(callback) {
        this.eventEmitter.on(constants_1.EVENT_TYPE.RECEIVE, callback);
    }
    sendEvent({ handler, method, params, files, timeout = constants_1.RESPONSE_TIMEOUT, guaranteed_delivery_required = false, }) {
        const isRenameParamsInitiallyEnabled = this.isRenameParamsEnabled;
        if ((0, platformDetector_1.default)() === constants_1.PLATFORM.WEB &&
            handler === constants_1.HANDLER.EXPRESS &&
            this.isRenameParamsEnabled)
            this.isRenameParamsEnabled = false;
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
            console.log('Bridge ~ Outgoing event', event);
        window.parent.postMessage({
            type: constants_1.WEB_COMMAND_TYPE,
            payload: event,
        }, '*');
        if (isRenameParamsInitiallyEnabled)
            this.isRenameParamsEnabled = true;
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
     */
    sendClientEvent({ method, params, timeout }) {
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
        const _log = console.log;
        console.log = function (...rest) {
            window.parent.postMessage({
                type: constants_1.WEB_COMMAND_TYPE_RPC_LOGS,
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
exports.default = WebBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wbGF0Zm9ybXMvd2ViLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBaUM7QUFTakMsa0NBQW9FO0FBQ3BFLDRDQVFxQjtBQUNyQixtRUFBa0Q7QUFDbEQsMkVBQTZDO0FBRTdDLE1BQU0sU0FBUztJQUtiO1FBQ0UsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLHNCQUFvQixFQUFFLENBQUE7UUFDOUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7UUFDeEIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQTtJQUNuQyxDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLEtBQW1CLEVBQVEsRUFBRTtZQUMvRCxNQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQTtZQUMzRCxJQUNFLElBQUEsMEJBQVcsR0FBRSxLQUFLLG9CQUFRLENBQUMsR0FBRztnQkFDOUIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssbUJBQU8sQ0FBQyxPQUFPO2dCQUN0QyxJQUFJLENBQUMscUJBQXFCO2dCQUUxQixJQUFJLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFBO1lBRXBDLElBQ0UsT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVE7Z0JBQzlCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtnQkFDbkMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtnQkFFeEMsT0FBTTtZQUVSLElBQUksSUFBSSxDQUFDLFdBQVc7Z0JBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxLQUFLLENBQUMsSUFBSSxD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