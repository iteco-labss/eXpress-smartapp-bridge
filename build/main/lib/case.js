"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelCaseToSnakeCase = exports.snakeCaseToCamelCase = exports.isUuid = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const camelCase_1 = __importDefault(require("lodash/camelCase"));
const snakeCase_1 = __importDefault(require("lodash/snakeCase"));
const isUuid = (value) => {
    return /[0-9a-fA-F-]{32}/.test(value);
};
exports.isUuid = isUuid;
const snakeCaseToCamelCase = (data) => {
    var _a;
    if (Array.isArray(data))
        return data.map(exports.snakeCaseToCamelCase);
    if (!data || ((_a = data.constructor) === null || _a === void 0 ? void 0 : _a.name) !== 'Object')
        return data;
    return Object.keys(data).reduce((result, key) => {
        const value = (0, exports.snakeCaseToCamelCase)(data[key]);
        const keyValue = (0, exports.isUuid)(key) ? key : (0, camelCase_1.default)(key);
        return Object.assign(Object.assign({}, result), { [keyValue]: value });
    }, {});
};
exports.snakeCaseToCamelCase = snakeCaseToCamelCase;
const camelCaseToSnakeCase = (data) => {
    var _a;
    if (Array.isArray(data))
        return data.map(exports.camelCaseToSnakeCase);
    if (!data || ((_a = data.constructor) === null || _a === void 0 ? void 0 : _a.name) !== 'Object')
        return data;
    return Object.keys(data).reduce((result, key) => {
        const value = (0, exports.camelCaseToSnakeCase)(data[key]);
        return Object.assign(Object.assign({}, result), { [(0, snakeCase_1.default)(key)]: value });
    }, {});
};
exports.camelCaseToSnakeCase = camelCaseToSnakeCase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY2FzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx1REFBdUQ7QUFDdkQsaUVBQXdDO0FBQ3hDLGlFQUF3QztBQUVqQyxNQUFNLE1BQU0sR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFO0lBQ3RDLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3ZDLENBQUMsQ0FBQTtBQUZZLFFBQUEsTUFBTSxVQUVsQjtBQUVNLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxJQUFTLEVBQU8sRUFBRTs7SUFDckQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyw0QkFBb0IsQ0FBQyxDQUFBO0lBQzlELElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQSxNQUFBLElBQUksQ0FBQyxXQUFXLDBDQUFFLElBQUksTUFBSyxRQUFRO1FBQUUsT0FBTyxJQUFJLENBQUE7SUFDN0QsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUM5QyxNQUFNLEtBQUssR0FBRyxJQUFBLDRCQUFvQixFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQzdDLE1BQU0sUUFBUSxHQUFHLElBQUEsY0FBTSxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUEsbUJBQVMsRUFBQyxHQUFHLENBQUMsQ0FBQTtRQUNuRCx1Q0FBWSxNQUFNLEtBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLElBQUU7SUFDekMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ1IsQ0FBQyxDQUFBO0FBUlksUUFBQSxvQkFBb0Isd0JBUWhDO0FBRU0sTUFBTSxvQkFBb0IsR0FBRyxDQUFDLElBQVMsRUFBTyxFQUFFOztJQUNyRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLDRCQUFvQixDQUFDLENBQUE7SUFFOUQsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFBLE1BQUEsSUFBSSxDQUFDLFdBQVcsMENBQUUsSUFBSSxNQUFLLFFBQVE7UUFBRSxPQUFPLElBQUksQ0FBQTtJQUU3RCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQzlDLE1BQU0sS0FBSyxHQUFHLElBQUEsNEJBQW9CLEVBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDN0MsdUNBQVksTUFBTSxLQUFFLENBQUMsSUFBQSxtQkFBUyxFQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFFO0lBQy9DLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUNSLENBQUMsQ0FBQTtBQVRZLFFBQUEsb0JBQW9CLHdCQVNoQyJ9