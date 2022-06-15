// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import getConfiguration from './configuration';

import vsceUtil from '@phoihos/vsce-util';
import commands from './commands';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(registerCommands());
}

function registerCommands(): vscode.Disposable {
  const config = getConfiguration();

  const commandManager = new vsceUtil.CommandManager();

  const convertCommand = new commands.ConvertCommand(config);
  commandManager.register(new commands.ConvertSelectionCommand(convertCommand));
  commandManager.register(new commands.PastClipboardCommand(convertCommand));

  const deconvertCommand = new commands.DeconvertCommand();
  commandManager.register(new commands.DeconvertSelectionCommand(deconvertCommand));
  commandManager.register(new commands.DeconvertSelectionDelimiterCommand(deconvertCommand));

  return commandManager;
}

// this method is called when your extension is deactivated
export function deactivate() {}
