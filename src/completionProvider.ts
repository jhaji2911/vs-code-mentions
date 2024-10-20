import * as vscode from 'vscode';
import { getTotalContributors } from './gitUtils';

export class MentionCompletionProvider implements vscode.CompletionItemProvider {
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.CompletionItem[]> {
    const text = document.getText(
      new vscode.Range(new vscode.Position(position.line, 0), position)
    );

    if (!text.trim().endsWith('m@')) return [];

    const contributors = await getTotalContributors();

    return contributors.map((contributor) => {
      const item = new vscode.CompletionItem(
        contributor.name,
        vscode.CompletionItemKind.User
      );
      item.detail = contributor.email;
      return item;
    });
  }
}