import { v4 as uuid } from 'uuid';
import { EVENT_TYPE, HANDLER, RESPONSE_TIMEOUT, WEB_COMMAND_TYPE_RPC } from '../constants';
import ExtendedEventEmitter from '../eventEmitter';
import log from '../logger';
class IosBridge {
    constructor() {
        this.hasCommunicationObject =
            window.webkit &&
                window.webkit.messageHandlers &&
                window.webkit.messageHandlers.express &&
                !!window.webkit.messageHandlers.express.postMessage;
        this.eventEmitter = new ExtendedEventEmitter();
        if (!this.hasCommunicationObject) {
            log('No method "express.postMessage", cannot send message to iOS');
            return;
        }
        // Expect json data as string
        window.handleIosEvent = ({ ref, data, files, }) => {
            const { type, ...payload } = data;
            const emitterType = ref || EVENT_TYPE.RECEIVE;
            const event = { ref, type, payload: payload, files };
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
    sendEvent({ handler, method, params, files, timeout = RESPONSE_TIMEOUT }) {
        if (!this.hasCommunicationObject)
            return Promise.reject();
        const ref = uuid(); // UUID to detect express response.
        const eventProps = { ref, type: WEB_COMMAND_TYPE_RPC, method, handler, payload: params };
        const event = files ? { ...eventProps, files: files?.map((file) => file) } : eventProps;
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
     */
    sendBotEvent({ method, params, files, timeout = RESPONSE_TIMEOUT }) {
        return this.sendEvent({ handler: HANDLER.BOTX, method, params, files, timeout });
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
}
export default IosBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wbGF0Zm9ybXMvaW9zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxFQUFFLElBQUksSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBU2pDLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLG9CQUFvQixFQUFFLE1BQU0sY0FBYyxDQUFBO0FBQzFGLE9BQU8sb0JBQW9CLE1BQU0saUJBQWlCLENBQUE7QUFDbEQsT0FBTyxHQUFHLE1BQU0sV0FBVyxDQUFBO0FBRTNCLE1BQU0sU0FBUztJQUliO1FBQ0UsSUFBSSxDQUFDLHNCQUFzQjtZQUN6QixNQUFNLENBQUMsTUFBTTtnQkFDYixNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWU7Z0JBQzdCLE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU87Z0JBQ3JDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFBO1FBQ3JELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFBO1FBRTlDLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUU7WUFDaEMsR0FBRyxDQUFDLDZEQUE2RCxDQUFDLENBQUE7WUFDbEUsT0FBTTtTQUNQO1FBRUQsNkJBQTZCO1FBQzdCLE1BQU0sQ0FBQyxjQUFjLEdBQUcsQ0FBQyxFQUN2QixHQUFHLEVBQ0gsSUFBSSxFQUNKLEtBQUssR0FPTixFQUFRLEVBQUU7WUFDVCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFBO1lBRWpDLE1BQU0sV0FBVyxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFBO1lBQzdDLE1BQU0sS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFBO1lBRXBELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUM1QyxDQUFDLENBQUE7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSCxTQUFTLENBQUMsUUFBOEI7UUFDdEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNwRCxDQUFDO0lBRVMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sR0FBRyxnQkFBZ0IsRUFBeUI7UUFDdkcsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0I7WUFBRSxPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUV6RCxNQUFNLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQSxDQUFDLG1DQUFtQztRQUN0RCxNQUFNLFVBQVUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUE7UUFFeEYsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsVUFBVSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUE7UUFFNUYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUV4RCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUN4RCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BdUJHO0lBQ0gsWUFBWSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxHQUFHLGdCQUFnQixFQUE0QjtRQUMxRixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBO0lBQ2xGLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXNCRztJQUNILGVBQWUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxHQUFHLGdCQUFnQixFQUErQjtRQUN6RixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7SUFDOUUsQ0FBQztDQUNGO0FBRUQsZUFBZSxTQUFTLENBQUEifQ==