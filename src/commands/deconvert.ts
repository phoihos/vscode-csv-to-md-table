import { ICommand } from '@phoihos/vsce-util';
import { IConvertOption } from './convert';

import * as vscode from 'vscode';

export interface IDeconvertOption extends IConvertOption {
  delimiter: string;
}

export class DeconvertCommand implements ICommand {
  public readonly id = '';

  public async execute(option: IDeconvertOption): Promise<void> {
    const { editor, selections, texts, delimiter } = option;
    const eol = editor.document.eol === vscode.EndOfLine.LF ? '\n' : '\r\n';

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
        if (row.endsWith('|') === false) {
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

        line += cells.join(delimiter);

        csvRows.push(line);
      }

      const options = {
        undoStopBefore: i === selections.length - 1,
        undoStopAfter: i === 0
      };

      await editor.edit((eb) => eb.replace(selection, csvRows.join(eol)), options);
    }
  }
}
