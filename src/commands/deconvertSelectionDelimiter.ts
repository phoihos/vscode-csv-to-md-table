import { ICommand } from '@phoihos/vsce-util';

import * as vscode from 'vscode';

export class DeconvertSelectionDelimiterCommand implements ICommand {
  public readonly id = 'csvToMdTable.deconvertSelectionDelimiter';

  private readonly _delimiterPickOptions: vscode.QuickPickOptions = {
    placeHolder: 'Select Delimiter'
  };

  private readonly _delimiterPickItems: (vscode.QuickPickItem & { delimiter: string })[] = [
    {
      label: ',',
      description: '(Comma)',
      delimiter: ','
    },
    {
      label: ';',
      description: '(Semicolon)',
      delimiter: ';'
    },
    {
      label: '\\t',
      description: '(Tab)',
      delimiter: '\t'
    },
    {
      label: '|',
      description: '(Pipe)',
      delimiter: '|'
    }
  ];

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

    const pickedItem = await vscode.window.showQuickPick(
      this._delimiterPickItems,
      this._delimiterPickOptions
    );
    if (pickedItem === undefined) return;

    const delimiter = pickedItem.delimiter;

    return this._deconvertCommand.execute({ editor, selections, texts, delimiter });
  }
}
