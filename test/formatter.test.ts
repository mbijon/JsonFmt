import * as assert from 'assert';
import { formatJsonLinesForTest, formatJsonOrJsoncForTest } from '../src/formatter';

describe('formatter', () => {
  it('formats JSON with indentation', () => {
    const input = '{"a":1,"b":{"c":2}}';
    const result = formatJsonOrJsoncForTest(input, 2, true, '\n');
    assert.ok(result.ok);
    assert.strictEqual(
      result.text,
      ['{', '  "a": 1,', '  "b": {', '    "c": 2', '  }', '}'].join('\n')
    );
  });

  it('formats JSONC with comments and trailing comma', () => {
    const input = '{//c\n "a":1,}';
    const result = formatJsonOrJsoncForTest(input, 2, true, '\n');
    assert.ok(result.ok);
    assert.strictEqual(
      result.text,
      ['{ //c', '  "a": 1,', '}'].join('\n')
    );
  });

  it('formats JSONL entries individually', () => {
    const input = ['{"a":1,"b":2}', '{"c":{"d":3}}'].join('\n');
    const result = formatJsonLinesForTest(input, '  ', '\n');
    assert.ok(result.ok);
    assert.strictEqual(
      result.text,
      ['{', '  "a": 1,', '  "b": 2', '}', '{', '  "c": {', '    "d": 3', '  }', '}'].join('\n')
    );
  });

  it('reports JSONL parse errors with line number', () => {
    const input = ['{"a":1}', '{bad json}'].join('\n');
    const result = formatJsonLinesForTest(input, '  ', '\n');
    assert.ok(!result.ok);
    assert.ok(result.error?.startsWith('Line 2'));
  });
});
