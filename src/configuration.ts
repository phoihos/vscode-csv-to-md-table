import * as vscode from 'vscode';

import * as vsceUtil from '@phoihos/vsce-util';

export interface IConfiguration extends vsceUtil.IDisposable {
  numberAlignRight: boolean;
}

class Configuration implements Partial<IConfiguration> {}

export default function getConfiguration(): Readonly<IConfiguration> {
  return new Proxy(new Configuration() as IConfiguration, {
    get: function (target: IConfiguration, prop: keyof IConfiguration) {
      return target[prop] ?? vscode.workspace.getConfiguration('csvToMdTable').get(prop);
    }
  });
}
