import * as vscode from 'vscode';
import { formatDocument } from './formatter';

export function activate(context: vscode.ExtensionContext) {
  const selector: vscode.DocumentSelector = [
    { language: 'json', scheme: '*' },
    { language: 'jsonc', scheme: '*' },
    { language: 'jsonl', scheme: '*' }
  ];

  const formattingProvider = vscode.languages.registerDocumentFormattingEditProvider(
    selector,
    {
      provideDocumentFormattingEdits(document, options) {
        return formatWithHandling(document, options);
      }
    }
  );

  const formatCommand = vscode.commands.registerCommand('jsonext.formatDocument', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    try {
      const edits = formatWithHandling(editor.document, editor.options as vscode.FormattingOptions);
      await applyEdits(editor, edits);
    } catch (err) {
      vscode.window.showErrorMessage(`JSONExt format failed: ${(err as Error).message}`);
    }
  });

  context.subscriptions.push(formattingProvider, formatCommand);
}

export function deactivate() {
  // Nothing to clean up beyond disposables in activate.
}

function formatWithHandling(
  document: vscode.TextDocument,
  options: vscode.FormattingOptions
): vscode.TextEdit[] {
  const config = vscode.workspace.getConfiguration('jsonext');
  const formatterConfig = {
    indentSize: config.get<number>('indentSize'),
    ensureFinalNewline: config.get<boolean>('ensureFinalNewline')
  };

  try {
    return formatDocument(document, options, formatterConfig);
  } catch (err) {
    vscode.window.showErrorMessage(`JSONExt: ${(err as Error).message}`);
    return [];
  }
}

async function applyEdits(editor: vscode.TextEditor, edits: vscode.TextEdit[]): Promise<void> {
  if (!edits.length) {
    return;
  }

  const workspaceEdit = new vscode.WorkspaceEdit();
  for (const edit of edits) {
    workspaceEdit.replace(editor.document.uri, edit.range, edit.newText);
  }
  await vscode.workspace.applyEdit(workspaceEdit);
}
