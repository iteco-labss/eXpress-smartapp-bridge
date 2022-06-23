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
const constants_1 = require("../constants");
const eventEmitter_1 = __importDefault(require("../eventEmitter"));
class WebBridge {
    constructor() {
        this.eventEmitter = new eventEmitter_1.default();
        this.addGlobalListener();
        this.logsEnabled = false;
    }
    addGlobalListener() {
        window.addEventListener('message', (event) => {
            if (typeof event.data !== 'object' ||
                typeof event.data.data !== 'object' ||
                typeof event.data.data.type !== 'string')
                return;
            if (this.logsEnabled)
                console.log('Bridge ~ Incoming event', event.data);
            const _a = event.data, { ref } = _a, _b = _a.data, { type } = _b, payload = __rest(_b, ["type"]), { files } = _a;
            const emitterType = ref || constants_1.EVENT_TYPE.RECEIVE;
            this.eventEmitter.emit(emitterType, { ref, type, payload, files });
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
        const ref = (0, uuid_1.v4)(); // UUID to detect express response.
        const payload = { ref, type: constants_1.WEB_COMMAND_TYPE_RPC, method, handler, payload: params, guaranteed_delivery_required };
        const event = files ? Object.assign(Object.assign({}, payload), { files }) : payload;
        if (this.logsEnabled)
            console.log('Bridge ~ Outgoing event', event);
        window.parent.postMessage({
            type: constants_1.WEB_COMMAND_TYPE,
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
     * @param method - Event type.
     * @param params
     * @param files
     * @param timeout - Timeout in ms.
     * @param guaranteed_delivery_required - boolean.
     */
    sendBotEvent({ method, params, files, timeout, guaranteed_delivery_required }) {
        return this.sendEvent({ handler: constants_1.HANDLER.BOTX, method, params, files, timeout, guaranteed_delivery_required });
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
}
exports.default = WebBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wbGF0Zm9ybXMvd2ViLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBaUM7QUFTakMsNENBT3FCO0FBQ3JCLG1FQUFrRDtBQUVsRCxNQUFNLFNBQVM7SUFJYjtRQUNFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxzQkFBb0IsRUFBRSxDQUFBO1FBQzlDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFBO0lBQzFCLENBQUM7SUFFRCxpQkFBaUI7UUFDZixNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBbUIsRUFBUSxFQUFFO1lBQy9ELElBQ0UsT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVE7Z0JBQzlCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtnQkFDbkMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtnQkFFeEMsT0FBTTtZQUVSLElBQUksSUFBSSxDQUFDLFdBQVc7Z0JBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFeEUsTUFBTSxLQUlGLEtBQUssQ0FBQyxJQUFJLEVBSlIsRUFDSixHQUFHLE9BR1MsRUFGWixZQUEwQixFQUExQixFQUFRLElBQUksT0FBYyxFQUFULE9BQU8sY0FBbEIsUUFBb0IsQ0FBRixFQUZwQixFQUdKLEtBQUssT0FDTyxDQUFBO1lBQ2QsTUFBTSxXQUFXLEdBQUcsR0FBRyxJQUFJLHNCQUFVLENBQUMsT0FBTyxDQUFBO1lBRTdDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxF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