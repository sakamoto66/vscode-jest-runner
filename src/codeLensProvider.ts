import { CodeLens, CodeLensProvider, Range, TextDocument } from 'vscode';

import { parse } from './playwright-editor-support';
import { resolveTestNameStringInterpolation } from './util';

function getPlaywrightCodeLens(filepath: string, text: string): CodeLens[] {
  const codeLens: CodeLens[] = [];
  parse(filepath, text).forEach((element) => {
    const range = new Range(element.startline - 1, element.startcolumn, element.endline - 1, element.endcolumn);
    const fullname = resolveTestNameStringInterpolation(element.fullname);
    codeLens.push(
      new CodeLens(range, {
        arguments: [fullname],
        command: 'playwright.runTest',
        title: 'Run',
      }),
      new CodeLens(range, {
        arguments: [fullname],
        command: 'playwright.debugTest',
        title: 'Debug',
      }),
      new CodeLens(range, {
        arguments: [fullname],
        command: 'playwright.inspectTest',
        title: 'Inspect',
      })
    );
  });
  return codeLens;
}
export class PlaywrightRunnerCodeLensProvider implements CodeLensProvider {
  public async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    try {
      const text = document.getText();
      return getPlaywrightCodeLens(document.fileName, text);
    } catch (e) {
      // Ignore error and keep showing Run/Debug buttons at same position
      console.error('playwright-editor-support parser returned error', e);
    }
    return [];
  }
}
