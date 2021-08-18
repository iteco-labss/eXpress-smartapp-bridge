import { v4 as uuid } from 'uuid';
import { camelCaseToSnakeCase, snakeCaseToCamelCase } from '../case';
import { EVENT_TYPE, RESPONSE_TIMEOUT } from '../constants';
import ExtendedEventEmitter from '../eventEmitter';
import log from '../logger';
class AndroidBridge {
    /** @ignore */
    constructor() {
        this.hasCommunicationObject = typeof window.express !== 'undefined' && !!window.express.handleSmartAppEvent;
        this.eventEmitter = new ExtendedEventEmitter();
        if (!this.hasCommunicationObject) {
            log('No method "express.handleSmartAppEvent", cannot send message to Android');
            return;
        }
        // Expect json data as string
        window.handleAndroidEvent = ({ ref, data, }) => {
            const { type, ...payload } = data;
            const emitterType = ref || EVENT_TYPE.RECEIVE;
            const event = { ref, type, payload: snakeCaseToCamelCase(payload) };
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
    onRecieve(callback) {
        this.eventEmitter.on(EVENT_TYPE.RECEIVE, callback);
    }
    /**
     * Send event and wait response from express client.
     *
     * ```js
     * bridge
     *   .send(
     *     {
     *       type: 'get_weather',
     *       handler: 'botx',
     *       payload: {
     *         city: 'Moscow',
     *       },
     *     }
     *   )
     *   .then(data => {
     *     // Handle response
     *     console.log('respose', data)
     *   })
     * ```
     * @param type - Event type.
     * @param handler - Set client/server side which is handle this event.
     * @param timeout - Timeout in ms.
     * @returns Promise.
     */
    send({ type, handler, payload, timeout = RESPONSE_TIMEOUT }) {
        if (!this.hasCommunicationObject)
            return Promise.reject();
        const ref = uuid();
        const event = JSON.stringify({ ref, type, handler, payload: camelCaseToSnakeCase(payload) });
        window.express.handleSmartAppEvent(event);
        if (!ref)
            return Promise.reject();
        return this.eventEmitter.onceWithTimeout(ref, timeout);
    }
}
export default AndroidBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5kcm9pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvcGxhdGZvcm1zL2FuZHJvaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEVBQUUsSUFBSSxJQUFJLEVBQUUsTUFBTSxNQUFNLENBQUE7QUFHakMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLG9CQUFvQixFQUFFLE1BQU0sU0FBUyxDQUFBO0FBQ3BFLE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxjQUFjLENBQUE7QUFDM0QsT0FBTyxvQkFBb0IsTUFBTSxpQkFBaUIsQ0FBQTtBQUNsRCxPQUFPLEdBQUcsTUFBTSxXQUFXLENBQUE7QUFFM0IsTUFBTSxhQUFhO0lBTWpCLGNBQWM7SUFDZDtRQUNFLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxPQUFPLE1BQU0sQ0FBQyxPQUFPLEtBQUssV0FBVyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFBO1FBQzNHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFBO1FBRTlDLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUU7WUFDaEMsR0FBRyxDQUFDLHlFQUF5RSxDQUFDLENBQUE7WUFDOUUsT0FBTTtTQUNQO1FBRUQsNkJBQTZCO1FBQzdCLE1BQU0sQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLEVBQzNCLEdBQUcsRUFDSCxJQUFJLEdBTUwsRUFBUSxFQUFFO1lBQ1QsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQTtZQUVqQyxNQUFNLFdBQVcsR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQTtZQUM3QyxNQUFNLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUE7WUFFbkUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQzVDLENBQUMsQ0FBQTtJQUNILENBQUM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNILFNBQVMsQ0FBQyxRQUE4QjtRQUN0QyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ3BELENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F1Qkc7SUFDSCxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEdBQUcsZ0JBQWdCLEVBQXNCO1FBQzdFLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCO1lBQUUsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7UUFFekQsTUFBTSxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUE7UUFFbEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDNUYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUV6QyxJQUFJLENBQUMsR0FBRztZQUFFLE9BQU8sT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBRWpDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ3hELENBQUM7Q0FDRjtBQUVELGVBQWUsYUFBYSxDQUFBIn0=