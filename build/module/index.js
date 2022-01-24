import { PLATFORM } from './lib/constants';
import getPlatform from './lib/platformDetector';
import AndroidBridge from './lib/platforms/android';
import IosBridge from './lib/platforms/ios';
import WebBridge from './lib/platforms/web';
const getBridge = () => {
    const platform = getPlatform();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBQzFDLE9BQU8sV0FBVyxNQUFNLHdCQUF3QixDQUFBO0FBQ2hELE9BQU8sYUFBYSxNQUFNLHlCQUF5QixDQUFBO0FBQ25ELE9BQU8sU0FBUyxNQUFNLHFCQUFxQixDQUFBO0FBQzNDLE9BQU8sU0FBUyxNQUFNLHFCQUFxQixDQUFBO0FBRzNDLE1BQU0sU0FBUyxHQUFHLEdBQWtCLEVBQUU7SUFDcEMsTUFBTSxRQUFRLEdBQUcsV0FBVyxFQUFFLENBQUE7SUFFOUIsUUFBUSxRQUFRLEVBQUU7UUFDaEIsS0FBSyxRQUFRLENBQUMsT0FBTztZQUNuQixPQUFPLElBQUksYUFBYSxFQUFFLENBQUE7UUFDNUIsS0FBSyxRQUFRLENBQUMsR0FBRztZQUNmLE9BQU8sSUFBSSxTQUFTLEVBQUUsQ0FBQTtRQUN4QixLQUFLLFFBQVEsQ0FBQyxHQUFHO1lBQ2YsT0FBTyxJQUFJLFNBQVMsRUFBRSxDQUFBO1FBQ3hCO1lBQ0UsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1lBQy9CLE1BQUs7S0FDUjtJQUVELE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQyxDQUFBO0FBRUQsZUFBZSxTQUFTLEVBQUUsQ0FBQSJ9