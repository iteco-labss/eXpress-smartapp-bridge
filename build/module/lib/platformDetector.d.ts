import { PLATFORM } from './constants';
/**
 * Get platform. Detection based on GET param `platform` or user agent.
 *
 * ```typescript
 * const platform = getPlatform();
 *
 * // => 'web' | 'ios' | 'android'
 * ```
 */
declare const getPlatform: () => PLATFORM;
export default getPlatform;
