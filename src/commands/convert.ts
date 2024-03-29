import { Command } from '@phoihos/vsce-util';

import * as vscode from 'vscode';
import * as Papa from 'papaparse';
import GraphemeSplitter = require('grapheme-splitter');

import { Configuration } from '../configuration';

export interface ConvertOption {
  editor: vscode.TextEditor;
  selections: vscode.Selection[];
  texts: string[];
}

export class ConvertCommand implements Command {
  public readonly id = '';

  private readonly _splitter = new GraphemeSplitter();
  private readonly _regexCJK = /[\u3000-\u9fff\uac00-\ud7af\uff01-\uff60]/g; // see: https://jrgraphix.net/r/Unicode/

  public constructor(private readonly _config: Readonly<Configuration>) {}

  public async execute(option: ConvertOption): Promise<void> {
    const { editor, selections, texts } = option;
    const eol = editor.document.eol === vscode.EndOfLine.LF ? '\n' : '\r\n';

    let i = selections.length;
    while (i--) {
      const selection = selections[i];
      const text = texts[i] ?? '';

      const indentWidth = selection.start.character;

      const parsedResult = Papa.parse(text);
      const csv = parsedResult.data as string[][];

      // Build tabular data and calculate column sizes
      const colWidths: number[] = [];

      const tabularData = csv.map((row) => {
        const cells = row.map((cell, j) => {
          let value = cell.trim();
          // Escape newlines, backslashes and pipes
          value = value.replace(/(\r?\n)/g, '<br>').replace(/(\\|\|)/g, '\\$1');

          let width = this._splitter.countGraphemes(value);
          // CJK characters take up 2 width
          width += value.match(this._regexCJK)?.length ?? 0;

          colWidths[j] = Math.max(width, colWidths[j] ?? 3);

          return { value, width };
        });

        return cells;
      });

      // Build table
      const tableRows = tabularData.map((row, i) => {
        const cells = row.map((cell, j) => {
          if (this._config.numberAlignRight && !isNaN(parseFloat(cell.value))) {
            return ' '.repeat(colWidths[j] - cell.width) + cell.value;
          } else {
            return cell.value + ' '.repeat(colWidths[j] - cell.width);
          }
        });

        // Pad empty cell(s)
        for (let j = row.length; j < colWidths.length; ++j) {
          cells.push(' '.repeat(colWidths[j]));
        }

        let line = '';

        if (i > 0) {
          line += ' '.repeat(indentWidth);

          // Insert the hyphens line
          if (i === 1) {
            const hyphens = colWidths.map((j) => {
              return '-'.repeat(j);
            });

            line += '| ' + hyphens.join(' | ') + ' |';
            line += eol + ' '.repeat(indentWidth);
          }
        }

        line += '| ' + cells.join(' | ') + ' |';

        return line;
      });

      const options = {
        undoStopBefore: i === selections.length - 1,
        undoStopAfter: i === 0
      };

      await editor.edit((eb) => eb.replace(selection, tableRows.join(eol)), options);
    }
  }
}
