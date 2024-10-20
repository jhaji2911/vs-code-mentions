import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { MentionCompletionProvider } from './completionProvider';
import { detectAndHighlightMentions } from './decorators';

// Entry point of the extension
export function activate(context: vscode.ExtensionContext) {
  console.log('Mentions Extension is now active! 🎉');

  // Register all commands
  registerCommands(context);

  // Register completion provider for mentions
  let completionProvider = vscode.languages.registerCompletionItemProvider(
    { scheme: 'file' },
    new MentionCompletionProvider(),
    '@'
  );
  context.subscriptions.push(completionProvider);

  // Detect and highlight mentions on activation
  if (vscode.window.activeTextEditor) {
    detectAndHighlightMentions();
  }

  // Listen to document changes to re-detect mentions
  vscode.workspace.onDidChangeTextDocument(() => {
    if (vscode.window.activeTextEditor) {
      detectAndHighlightMentions();
    }
  });
}

// Cleanup logic when the extension is deactivated
export function deactivate() {
  console.log('Mentions Extension is now deactivated.');
}