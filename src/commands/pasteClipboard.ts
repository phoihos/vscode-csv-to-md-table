import { Command } from '@phoihos/vsce-util';

import * as vscode from 'vscode';

export class PastClipboardCommand implements Command {
  public readonly id = 'csvToMdTable.pasteClipboard';

  public constructor(private readonly _convertCommand: Command) {}

  public async execute(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) return;

    const selections = [
      editor.selection.isEmpty
        ? new vscode.Selection(editor.selection.active, editor.selection.active)
        : editor.selection
    ];
    const texts = [await vscode.env.clipboard.readText()];

    return this._convertCommand.execute({ editor, selections, texts });
  }
}
