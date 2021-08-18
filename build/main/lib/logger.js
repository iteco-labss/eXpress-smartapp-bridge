"use strict";
/* eslint-disable functional/functional-parameters */
Object.defineProperty(exports, "__esModule", { value: true });
/** @ignore */
const log = (...args) => {
    const text = args.map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg))).join(' ');
    alert(text);
};
exports.default = log;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9sb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFEQUFxRDs7QUFFckQsY0FBYztBQUNkLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxJQUE0QixFQUFFLEVBQUU7SUFDOUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQVksRUFBVSxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ2hILEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNiLENBQUMsQ0FBQTtBQUVELGtCQUFlLEdBQUcsQ0FBQSJ9