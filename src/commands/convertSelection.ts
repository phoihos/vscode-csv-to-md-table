import { ICommand } from '@phoihos/vsce-util';

import * as vscode from 'vscode';

export class ConvertSelectionCommand implements ICommand {
  public readonly id = 'csvToMdTable.convertSelection';

  public constructor(private readonly _convertCommand: ICommand) {}

  public async execute(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) return;

    const selections = [...editor.selections].sort(
      (a, b) => a.start.line - b.start.line || a.start.character - b.start.character
    );

    const texts = selections.map((selection) => {
      return editor.document.getText(selection);
    });

    return this._convertCommand.execute({ editor, selections, texts });
  }
}
