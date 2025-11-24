import * as vscode from 'vscode';
import { applyEdits, format as formatJsonc } from 'jsonc-parser';

export interface FormatterConfig {
  indentSize?: number;
  ensureFinalNewline?: boolean;
}

interface FormatResult {
  ok: boolean;
  text?: string;
  error?: string;
}

export function formatDocument(
  document: vscode.TextDocument,
  options: vscode.FormattingOptions,
  config: FormatterConfig
): vscode.TextEdit[] {
  const indentSize = resolveIndentSize(options, config);
  const insertSpaces = options.insertSpaces ?? true;
  const indentString = insertSpaces ? ' '.repeat(indentSize) : '\t';
  const eol = document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';

  const result =
    document.languageId === 'json' || document.languageId === 'jsonc'
      ? formatJsonOrJsonc(document.getText(), indentSize, insertSpaces, eol)
      : formatJsonLines(document.getText(), indentString, eol);

  if (!result.ok || !result.text) {
    throw new Error(result.error ?? 'Formatting failed');
  }

  const text = appendFinalNewlineIfNeeded(result.text, config.ensureFinalNewline !== false, eol);
  return [vscode.TextEdit.replace(fullDocumentRange(document), text)];
}

function formatJsonOrJsonc(
  content: string,
  tabSize: number,
  insertSpaces: boolean,
  eol: string
): FormatResult {
  try {
    const edits = formatJsonc(content, undefined, {
      tabSize,
      insertSpaces,
      eol,
      keepLines: false
    });
    const formatted = applyEdits(content, edits);
    return { ok: true, text: formatted };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

function formatJsonLines(content: string, indentString: string, eol: string): FormatResult {
  const lines = content.split(/\r?\n/);
  const formattedLines: string[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      formattedLines.push('');
      continue;
    }
    if (trimmed.startsWith('//')) {
      formattedLines.push(trimmed);
      continue;
    }

    try {
      const parsed = JSON.parse(trimmed);
      const pretty = JSON.stringify(parsed, null, indentString);
      formattedLines.push(pretty);
    } catch (err) {
      return { ok: false, error: `Line ${i + 1}: ${(err as Error).message}` };
    }
  }

  return { ok: true, text: formattedLines.join(eol) };
}

function appendFinalNewlineIfNeeded(text: string, ensureFinalNewline: boolean, eol: string): string {
  if (!ensureFinalNewline) {
    return text;
  }
  return text.endsWith(eol) ? text : `${text}${eol}`;
}

function resolveIndentSize(options: vscode.FormattingOptions, config: FormatterConfig): number {
  if (config.indentSize && Number.isInteger(config.indentSize) && config.indentSize > 0) {
    return config.indentSize;
  }
  return options.tabSize ?? 2;
}

function fullDocumentRange(document: vscode.TextDocument): vscode.Range {
  const lastLineIndex = Math.max(document.lineCount - 1, 0);
  const lastLine = document.lineAt(lastLineIndex);
  return new vscode.Range(0, 0, lastLineIndex, lastLine.text.length);
}

// Exposed for tests
export { formatJsonOrJsonc as formatJsonOrJsoncForTest, formatJsonLines as formatJsonLinesForTest };
