"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
/** @ignore */
const getPlatformByGetParam = () => {
    const platform = new URLSearchParams(location.search).get('platform');
    const isValidPlatform = Object.values(constants_1.PLATFORM).includes(platform);
    if (isValidPlatform)
        return platform;
    return constants_1.PLATFORM.UNKNOWN;
};
/** @ignore */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1EZXRlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcGxhdGZvcm1EZXRlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFzQztBQUV0QyxjQUFjO0FBQ2QsTUFBTSxxQkFBcUIsR0FBRyxHQUFhLEVBQUU7SUFDM0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUVyRSxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFRLENBQUMsQ0FBQyxRQUFRLENBQVcsUUFBUSxDQUFDLENBQUE7SUFDNUUsSUFBSSxlQUFlO1FBQUUsT0FBaUIsUUFBUSxDQUFBO0lBRTlDLE9BQU8sb0JBQVEsQ0FBQyxPQUFPLENBQUE7QUFDekIsQ0FBQyxDQUFBO0FBRUQsY0FBYztBQUNkLE1BQU0seUJBQXlCLEdBQUcsR0FBYSxFQUFFO0lBQy9DLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDeEMsT0FBTyxvQkFBUSxDQUFDLE9BQU8sQ0FBQTtLQUN4QjtJQUVELElBQ0UsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztRQUMzQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLFlBQVksSUFBSSxRQUFRLENBQUMsQ0FBQztRQUNwRSxDQUFDLE1BQU0sQ0FBQyxRQUFRO1FBRWhCLE9BQU8sb0JBQVEsQ0FBQyxHQUFHLENBQUE7SUFFckIsT0FBTyxvQkFBUSxDQUFDLEdBQUcsQ0FBQTtBQUNyQixDQUFDLENBQUE7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sV0FBVyxHQUFHLEdBQWEsRUFBRTtJQUNqQyxPQUFPLHFCQUFxQixFQUFFLElBQUkseUJBQXlCLEVBQUUsQ0FBQTtBQUMvRCxDQUFDLENBQUE7QUFFRCxrQkFBZSxXQUFXLENBQUEifQ==