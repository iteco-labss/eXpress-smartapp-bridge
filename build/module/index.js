import { PLATFORM } from './lib/constants';
import getPlatform from './lib/platformDetector';
import AndroidBridge from './lib/platforms/android';
import IosBridge from './lib/platforms/ios';
import WebBridge from './lib/platforms/web';
import { LIB_VERSION } from './version';
const getBridge = () => {
    if (process.env.NODE_ENV === 'test')
        return null;
    const platform = getPlatform();
    console.log('Bridge ~ version', LIB_VERSION);
    switch (platform) {
        case PLATFORM.ANDROID:
            return new AndroidBridge();
        case PLATFORM.IOS:
            return new IosBridge();
        case PLATFORM.WEB:
            return new WebBridge();
        default:
            console.error('Wrong platform');
            break;
    }
    return null;
};
export default getBridge();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBQzFDLE9BQU8sV0FBVyxNQUFNLHdCQUF3QixDQUFBO0FBQ2hELE9BQU8sYUFBYSxNQUFNLHlCQUF5QixDQUFBO0FBQ25ELE9BQU8sU0FBUyxNQUFNLHFCQUFxQixDQUFBO0FBQzNDLE9BQU8sU0FBUyxNQUFNLHFCQUFxQixDQUFBO0FBRTNDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxXQUFXLENBQUE7QUFFdkMsTUFBTSxTQUFTLEdBQUcsR0FBa0IsRUFBRTtJQUNwQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLE1BQU07UUFBRSxPQUFPLElBQUksQ0FBQTtJQUVoRCxNQUFNLFFBQVEsR0FBRyxXQUFXLEVBQUUsQ0FBQTtJQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLFdBQVcsQ0FBQyxDQUFBO0lBRTVDLFFBQVEsUUFBUSxFQUFFO1FBQ2hCLEtBQUssUUFBUSxDQUFDLE9BQU87WUFDbkIsT0FBTyxJQUFJLGFBQWEsRUFBRSxDQUFBO1FBQzVCLEtBQUssUUFBUSxDQUFDLEdBQUc7WUFDZixPQUFPLElBQUksU0FBUyxFQUFFLENBQUE7UUFDeEIsS0FBSyxRQUFRLENBQUMsR0FBRztZQUNmLE9BQU8sSUFBSSxTQUFTLEVBQUUsQ0FBQTtRQUN4QjtZQUNFLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUMvQixNQUFLO0tBQ1I7SUFFRCxPQUFPLElBQUksQ0FBQTtBQUNiLENBQUMsQ0FBQTtBQUVELGVBQWUsU0FBUyxFQUFFLENBQUEifQ==