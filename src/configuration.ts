import * as vscode from 'vscode';

import * as vsceUtil from '@phoihos/vsce-util';

export interface Configuration extends vsceUtil.DisposableLike {
  numberAlignRight: boolean;
}

class ConfigurationImpl implements Partial<Configuration> {}

export default function getConfiguration(): Readonly<Configuration> {
  return new Proxy(new ConfigurationImpl() as Configuration, {
    get: function (target: Configuration, prop: keyof Configuration) {
      return target[prop] ?? vscode.workspace.getConfiguration('csvToMdTable').get(prop);
    }
  });
}
