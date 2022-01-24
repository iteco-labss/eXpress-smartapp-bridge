import { PLATFORM } from './constants';
const getPlatformByGetParam = () => {
    const platform = new URLSearchParams(location.search).get('platform');
    const isValidPlatform = Object.values(PLATFORM).includes(platform);
    if (isValidPlatform)
        return platform;
    return PLATFORM.UNKNOWN;
};
const detectPlatformByUserAgent = () => {
    if (/android/i.test(navigator.userAgent)) {
        return PLATFORM.ANDROID;
    }
    if ((/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document)) &&
        !window.MSStream)
        return PLATFORM.IOS;
    return PLATFORM.WEB;
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
export default getPlatform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1EZXRlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcGxhdGZvcm1EZXRlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sYUFBYSxDQUFBO0FBRXRDLE1BQU0scUJBQXFCLEdBQUcsR0FBYSxFQUFFO0lBQzNDLE1BQU0sUUFBUSxHQUFHLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7SUFFckUsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQVcsUUFBUSxDQUFDLENBQUE7SUFDNUUsSUFBSSxlQUFlO1FBQUUsT0FBaUIsUUFBUSxDQUFBO0lBRTlDLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQTtBQUN6QixDQUFDLENBQUE7QUFFRCxNQUFNLHlCQUF5QixHQUFHLEdBQWEsRUFBRTtJQUMvQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ3hDLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQTtLQUN4QjtJQUVELElBQ0UsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztRQUMzQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLFlBQVksSUFBSSxRQUFRLENBQUMsQ0FBQztRQUNwRSxDQUFDLE1BQU0sQ0FBQyxRQUFRO1FBRWhCLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQTtJQUVyQixPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUE7QUFDckIsQ0FBQyxDQUFBO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLFdBQVcsR0FBRyxHQUFhLEVBQUU7SUFDakMsT0FBTyxxQkFBcUIsRUFBRSxJQUFJLHlCQUF5QixFQUFFLENBQUE7QUFDL0QsQ0FBQyxDQUFBO0FBRUQsZUFBZSxXQUFXLENBQUEifQ==