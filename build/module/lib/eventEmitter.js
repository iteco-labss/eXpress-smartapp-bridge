import EventEmitter from 'eventemitter3';
/**
 * Extended Event Emitted class
 *
 * ```typescript
 * const emitter = new EmitterEventPayload();
 *
 * // promise will be rejected in 20 secs
 * // if no one event has been received with type 'ref-uuid-value'
 * // otherwise promise will be fulfilled with payload object
 * const promise = emitter.onceWithTimeout('ref-uuid-value', 20000)
 * ```
 */
class ExtendedEventEmitter extends EventEmitter {
    constructor() {
        super();
    }
    /**
     * Wait when event with `type` will be emitted for `timeout` ms.
     *
     * ```js
     * emitter.onceWithTimeout('d6910a9d-ea24-5fc6-a654-28781ef21f8f', 20000)
     * // => Promise
     * ```
     */
    onceWithTimeout(type, timeout) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(), timeout);
            this.once(type, (event) => {
                clearTimeout(timer);
                resolve(event);
            });
        });
    }
}
export default ExtendedEventEmitter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRFbWl0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9ldmVudEVtaXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxZQUFZLE1BQU0sZUFBZSxDQUFBO0FBSXhDOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBTSxvQkFBcUIsU0FBUSxZQUFZO0lBQzdDO1FBQ0UsS0FBSyxFQUFFLENBQUE7SUFDVCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILGVBQWUsQ0FBQyxJQUFzQixFQUFFLE9BQWU7UUFDckQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNyQyxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFFakQsSUFBSSxDQUFDLElBQUksQ0FBUyxJQUFJLEVBQUUsQ0FBQyxLQUEwQixFQUFFLEVBQUU7Z0JBQ3JELFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDbkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2hCLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0Y7QUFFRCxlQUFlLG9CQUFvQixDQUFBIn0=