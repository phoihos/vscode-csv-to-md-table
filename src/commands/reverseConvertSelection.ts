import { ICommand } from '@phoihos/vsce-util';

import * as vscode from 'vscode';

export class ReverseConvertSelectionCommand implements ICommand {
  public readonly id = 'csvToMdTable.reverseConvertSelection';

  public constructor() {}

  public async execute(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) return;

    const selections = editor.selections.sort(
      (a, b) => a.start.line - b.start.line || a.start.character - b.start.character
    );

    const texts = selections.map((selection) => {
      return editor.document.getText(selection);
    });

    const eol = editor.document.eol == vscode.EndOfLine.LF ? '\n' : '\r\n';

    const regexHyphens = /^\s*:?-+:?\s*\|/;
    const regexCell = /((\\\||[^\|])*)\|/gu;

    let i = selections.length;
    while (i--) {
      const selection = selections[i];
      const text = texts[i] ?? '';

      const indentWidth = selection.start.character;

      const tableRows = text.split(eol);
      const csvRows: string[] = [];

      for (let i = 0; i < tableRows.length; ++i) {
        let row = tableRows[i].trim();

        // Normalize for RegExp
        if (row.startsWith('|')) {
          row = row.slice(1);
        }
        if (!row.endsWith('|')) {
          row += '|';
        }

        // Exclude the hyphens line
        if (regexHyphens.test(row)) {
          continue;
        }

        const cells: string[] = [];

        let match: RegExpExecArray | null = null;
        while ((match = regexCell.exec(row)) !== null) {
          let value = match[1].trim();
          // Unescape backslashes and pipes
          value = value.replace(/(\\)(\\|\|)/g, '$2');

          cells.push(value);
        }

        let line = '';

        if (i > 0) {
          line += ' '.repeat(indentWidth);
        }

        line += cells.join(',');

        csvRows.push(line);
      }

      const options = {
        undoStopBefore: i == selections.length - 1,
        undoStopAfter: i == 0
      };

      await editor.edit((eb) => eb.replace(selection, csvRows.join(eol)), options);
    }
  }
}
