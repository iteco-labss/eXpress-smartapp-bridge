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
    }
    addGlobalListener() {
        window.addEventListener('message', (event) => {
            if (typeof event.data !== 'object' ||
                typeof event.data.data !== 'object' ||
                typeof event.data.data.type !== 'string')
                return;
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
    sendEvent({ handler, method, params, files, timeout = constants_1.RESPONSE_TIMEOUT }) {
        const ref = uuid_1.v4(); // UUID to detect express response.
        const payload = { ref, type: constants_1.WEB_COMMAND_TYPE_RPC, method, handler, payload: params };
        window.parent.postMessage({
            type: constants_1.WEB_COMMAND_TYPE,
            payload: files ? Object.assign(Object.assign({}, payload), { files }) : payload,
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
     */
    sendBotEvent({ method, params, files, timeout }) {
        return this.sendEvent({ handler: constants_1.HANDLER.BOTX, method, params, files, timeout });
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
}
exports.default = WebBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wbGF0Zm9ybXMvd2ViLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBaUM7QUFTakMsNENBQTRHO0FBQzVHLG1FQUFrRDtBQUVsRCxNQUFNLFNBQVM7SUFHYjtRQUNFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxzQkFBb0IsRUFBRSxDQUFBO1FBQzlDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0lBQzFCLENBQUM7SUFFRCxpQkFBaUI7UUFDZixNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBbUIsRUFBUSxFQUFFO1lBQy9ELElBQ0UsT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVE7Z0JBQzlCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtnQkFDbkMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtnQkFFeEMsT0FBTTtZQUVSLE1BQU0sS0FJRixLQUFLLENBQUMsSUFBSSxFQUpSLEVBQ0osR0FBRyxPQUdTLEVBRlosWUFBMEIsRUFBMUIsRUFBUSxJQUFJLE9BQWMsRUFBVCxPQUFPLGNBQWxCLFFBQW9CLENBQUYsRUFGcEIsRUFHSixLQUFLLE9BQ08sQ0FBQTtZQUNkLE1BQU0sV0FBVyxHQUFHLEdBQUcsSUFBSSxzQkFBVSxDQUFDLE9BQU8sQ0FBQTtZQUU3QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO1FBQ3BFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ0gsU0FBUyxDQUFDLFFBQThCO1FBQ3RDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLHNCQUFVLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ3BELENBQUM7SUFFUyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxHQUFHLDRCQUFnQixFQUF5QjtRQUN2RyxNQUFNLEdBQUcsR0FBRyxTQUFJLEVBQUUsQ0FBQSxDQUFDLG1DQUFtQztRQUN0RCxNQUFNLE9BQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsZ0NBQW9CLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUE7UUFFckYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQ3ZCO1lBQ0UsSUFBSSxFQUFFLDRCQUFnQjtZQUN0QixPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsaUNBQU0sT0FBTyxLQUFFLEtBQUssSUFBRyxDQUFDLENBQUMsT0FBTztTQUNqRCxFQUNELEdBQUcsQ0FDSixDQUFBO1FBRUQsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDeEQsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bc0JHO0lBQ0gsWUFBWSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUE0QjtRQUN2RSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsbUJBQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtJQUNsRixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXFCRztJQUNILGVBQWUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUErQjtRQUN0RSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsbUJBQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBO0lBQzlFLENBQUM7Q0FDRjtBQUVELGtCQUFlLFNBQVMsQ0FBQSJ9