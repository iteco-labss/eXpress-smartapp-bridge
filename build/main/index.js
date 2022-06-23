"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./lib/constants");
const platformDetector_1 = __importDefault(require("./lib/platformDetector"));
const android_1 = __importDefault(require("./lib/platforms/android"));
const ios_1 = __importDefault(require("./lib/platforms/ios"));
const web_1 = __importDefault(require("./lib/platforms/web"));
const version_1 = require("./version");
const getBridge = () => {
    if (process.env.NODE_ENV === 'test')
        return null;
    const platform = (0, platformDetector_1.default)();
    console.log('Bridge ~ version', version_1.LIB_VERSION);
    switch (platform) {
        case constants_1.PLATFORM.ANDROID:
            return new android_1.default();
        case constants_1.PLATFORM.IOS:
            return new ios_1.default();
        case constants_1.PLATFORM.WEB:
            return new web_1.default();
        default:
            console.error('Wrong platform');
            break;
    }
    return null;
};
exports.default = getBridge();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwrQ0FBMEM7QUFDMUMsOEVBQWdEO0FBQ2hELHNFQUFtRDtBQUNuRCw4REFBMkM7QUFDM0MsOERBQTJDO0FBRTNDLHVDQUF1QztBQUV2QyxNQUFNLFNBQVMsR0FBRyxHQUFrQixFQUFFO0lBQ3BDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssTUFBTTtRQUFFLE9BQU8sSUFBSSxDQUFBO0lBRWhELE1BQU0sUUFBUSxHQUFHLElBQUEsMEJBQVcsR0FBRSxDQUFBO0lBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUscUJBQVcsQ0FBQyxDQUFBO0lBRTVDLFFBQVEsUUFBUSxFQUFFO1FBQ2hCLEtBQUssb0JBQVEsQ0FBQyxPQUFPO1lBQ25CLE9BQU8sSUFBSSxpQkFBYSxFQUFFLENBQUE7UUFDNUIsS0FBSyxvQkFBUSxDQUFDLEdBQUc7WUFDZixPQUFPLElBQUksYUFBUyxFQUFFLENBQUE7UUFDeEIsS0FBSyxvQkFBUSxDQUFDLEdBQUc7WUFDZixPQUFPLElBQUksYUFBUyxFQUFFLENBQUE7UUFDeEI7WUFDRSxPQUFPLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUE7WUFDL0IsTUFBSztLQUNSO0lBRUQsT0FBTyxJQUFJLENBQUE7QUFDYixDQUFDLENBQUE7QUFFRCxrQkFBZSxTQUFTLEVBQUUsQ0FBQSJ9