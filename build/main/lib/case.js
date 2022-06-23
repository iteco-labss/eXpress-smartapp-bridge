"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelCaseToSnakeCase = exports.snakeCaseToCamelCase = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const camelCase_1 = __importDefault(require("lodash/camelCase"));
const snakeCase_1 = __importDefault(require("lodash/snakeCase"));
const snakeCaseToCamelCase = (data) => {
    var _a;
    if (Array.isArray(data))
        return data.map(exports.snakeCaseToCamelCase);
    if (!data || ((_a = data.constructor) === null || _a === void 0 ? void 0 : _a.name) !== 'Object')
        return data;
    return Object.keys(data).reduce((result, key) => {
        const value = (0, exports.snakeCaseToCamelCase)(data[key]);
        const keyValue = (0, camelCase_1.default)(key);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY2FzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx1REFBdUQ7QUFDdkQsaUVBQXdDO0FBQ3hDLGlFQUF3QztBQUVqQyxNQUFNLG9CQUFvQixHQUFHLENBQUMsSUFBUyxFQUFPLEVBQUU7O0lBQ3JELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsNEJBQW9CLENBQUMsQ0FBQTtJQUU5RCxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUEsTUFBQSxJQUFJLENBQUMsV0FBVywwQ0FBRSxJQUFJLE1BQUssUUFBUTtRQUFFLE9BQU8sSUFBSSxDQUFBO0lBRTdELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDOUMsTUFBTSxLQUFLLEdBQUcsSUFBQSw0QkFBb0IsRUFBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUM3QyxNQUFNLFFBQVEsR0FBRyxJQUFBLG1CQUFTLEVBQUMsR0FBRyxDQUFDLENBQUE7UUFDL0IsdUNBQVksTUFBTSxLQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxJQUFFO0lBQ3pDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUNSLENBQUMsQ0FBQTtBQVZZLFFBQUEsb0JBQW9CLHdCQVVoQztBQUVNLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxJQUFTLEVBQU8sRUFBRTs7SUFDckQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUFFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyw0QkFBb0IsQ0FBQyxDQUFBO0lBRTlELElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQSxNQUFBLElBQUksQ0FBQyxXQUFXLDBDQUFFLElBQUksTUFBSyxRQUFRO1FBQUUsT0FBTyxJQUFJLENBQUE7SUFFN0QsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUM5QyxNQUFNLEtBQUssR0FBRyxJQUFBLDRCQUFvQixFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQzdDLHVDQUFZLE1BQU0sS0FBRSxDQUFDLElBQUEsbUJBQVMsRUFBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssSUFBRTtJQUMvQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDUixDQUFDLENBQUE7QUFUWSxRQUFBLG9CQUFvQix3QkFTaEMifQ==