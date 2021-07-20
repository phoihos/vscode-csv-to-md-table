import { ICommand } from '@phoihos/vsce-util';

import * as vscode from 'vscode';

export class DeconvertSelectionCommand implements ICommand {
  public readonly id = 'csvToMdTable.deconvertSelection';

  public constructor(private readonly _deconvertCommand: ICommand) {}

  public async execute(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) return;

    const selections = editor.selections.sort(
      (a, b) => a.start.line - b.start.line || a.start.character - b.start.character
    );

    const texts = selections.map((selection) => {
      return editor.document.getText(selection);
    });

    const delimiter = ',';

    return this._deconvertCommand.execute({ editor, selections, texts, delimiter });
  }
}
