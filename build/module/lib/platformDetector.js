import { PLATFORM } from './constants';
/** @ignore */
const getPlatformByGetParam = () => {
    const platform = new URLSearchParams(location.search).get('platform');
    const isValidPlatform = Object.values(PLATFORM).includes(platform);
    if (isValidPlatform)
        return platform;
    return PLATFORM.UNKNOWN;
};
/** @ignore */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1EZXRlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcGxhdGZvcm1EZXRlY3Rvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sYUFBYSxDQUFBO0FBRXRDLGNBQWM7QUFDZCxNQUFNLHFCQUFxQixHQUFHLEdBQWEsRUFBRTtJQUMzQyxNQUFNLFFBQVEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBRXJFLE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFXLFFBQVEsQ0FBQyxDQUFBO0lBQzVFLElBQUksZUFBZTtRQUFFLE9BQWlCLFFBQVEsQ0FBQTtJQUU5QyxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUE7QUFDekIsQ0FBQyxDQUFBO0FBRUQsY0FBYztBQUNkLE1BQU0seUJBQXlCLEdBQUcsR0FBYSxFQUFFO0lBQy9DLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDeEMsT0FBTyxRQUFRLENBQUMsT0FBTyxDQUFBO0tBQ3hCO0lBRUQsSUFDRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO1FBQzNDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksWUFBWSxJQUFJLFFBQVEsQ0FBQyxDQUFDO1FBQ3BFLENBQUMsTUFBTSxDQUFDLFFBQVE7UUFFaEIsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFBO0lBRXJCLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQTtBQUNyQixDQUFDLENBQUE7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sV0FBVyxHQUFHLEdBQWEsRUFBRTtJQUNqQyxPQUFPLHFCQUFxQixFQUFFLElBQUkseUJBQXlCLEVBQUUsQ0FBQTtBQUMvRCxDQUFDLENBQUE7QUFFRCxlQUFlLFdBQVcsQ0FBQSJ9