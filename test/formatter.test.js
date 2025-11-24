"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const formatter_1 = require("../src/formatter");
describe('formatter', () => {
    it('formats JSON with indentation', () => {
        const input = '{"a":1,"b":{"c":2}}';
        const result = (0, formatter_1.formatJsonOrJsoncForTest)(input, 2, true, '\n');
        assert.ok(result.ok);
        assert.strictEqual(result.text, ['{', '  "a": 1,', '  "b": {', '    "c": 2', '  }', '}'].join('\n'));
    });
    it('formats JSONC with comments and trailing comma', () => {
        const input = '{//c\n "a":1,}';
        const result = (0, formatter_1.formatJsonOrJsoncForTest)(input, 2, true, '\n');
        assert.ok(result.ok);
        assert.strictEqual(result.text, ['{', '  //c', '  "a": 1', '}'].join('\n'));
    });
    it('formats JSONL entries individually', () => {
        const input = ['{"a":1,"b":2}', '{"c":{"d":3}}'].join('\n');
        const result = (0, formatter_1.formatJsonLinesForTest)(input, '  ', '\n');
        assert.ok(result.ok);
        assert.strictEqual(result.text, ['{', '  "a": 1,', '  "b": 2', '}', '{', '  "c": {', '    "d": 3', '  }', '}'].join('\n'));
    });
    it('reports JSONL parse errors with line number', () => {
        const input = ['{"a":1}', '{bad json}'].join('\n');
        const result = (0, formatter_1.formatJsonLinesForTest)(input, '  ', '\n');
        assert.ok(!result.ok);
        assert.ok(result.error?.startsWith('Line 2'));
    });
});
//# sourceMappingURL=formatter.test.js.map