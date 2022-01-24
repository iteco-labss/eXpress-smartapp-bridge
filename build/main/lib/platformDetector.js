"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const getPlatformByGetParam = () => {
    const platform = new URLSearchParams(location.search).get('platform');
    const isValidPlatform = Object.values(constants_1.PLATFORM).includes(platform);
    if (isValidPlatform)
        return platform;
    return constants_1.PLATFORM.UNKNOWN;
};
const detectPlatformByUserAgent = () => {
    if (/android/i.test(navigator.userAgent)) {
        return constants_1.PLATFORM.ANDROID;
    }
    if ((/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document)) &&
        !window.MSStream)
        return constants_1.PLATFORM.IOS;
    return constants_1.PLATFORM.WEB;
};
/**
 * Get platform. Detection based on GET param `platform` or user agent.
 *
 * ```typescript
 * const platform = getPlatform();
 *
 * // => 'web' | 'ios' | 'android'
 * ```
 */
const getPlatform = () => {
    return getPlatformByGetParam() || detectPlatformByUserAgent();
};
exports.default = getPlatform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1EZXRlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcGxhdGZvcm1EZXRlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFzQztBQUV0QyxNQUFNLHFCQUFxQixHQUFHLEdBQWEsRUFBRTtJQUMzQyxNQUFNLFFBQVEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBRXJFLE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBVyxRQUFRLENBQUMsQ0FBQTtJQUM1RSxJQUFJLGVBQWU7UUFBRSxPQUFpQixRQUFRLENBQUE7SUFFOUMsT0FBTyxvQkFBUSxDQUFDLE9BQU8sQ0FBQTtBQUN6QixDQUFDLENBQUE7QUFFRCxNQUFNLHlCQUF5QixHQUFHLEdBQWEsRUFBRTtJQUMvQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ3hDLE9BQU8sb0JBQVEsQ0FBQyxPQUFPLENBQUE7S0FDeEI7SUFFRCxJQUNFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUM7UUFDM0MsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxZQUFZLElBQUksUUFBUSxDQUFDLENBQUM7UUFDcEUsQ0FBQyxNQUFNLENBQUMsUUFBUTtRQUVoQixPQUFPLG9CQUFRLENBQUMsR0FBRyxDQUFBO0lBRXJCLE9BQU8sb0JBQVEsQ0FBQyxHQUFHLENBQUE7QUFDckIsQ0FBQyxDQUFBO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLFdBQVcsR0FBRyxHQUFhLEVBQUU7SUFDakMsT0FBTyxxQkFBcUIsRUFBRSxJQUFJLHlCQUF5QixFQUFFLENBQUE7QUFDL0QsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsV0FBVyxDQUFBIn0=