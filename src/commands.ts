import * as vscode from 'vscode';
import { getCurrentUsername } from './gitUtils';
import { getTotalMentions } from './decorators';

export function registerCommands(context: vscode.ExtensionContext) {
  // Register the command to show the mention count for the current user
  let mentionCountCommand = vscode.commands.registerCommand('mentions.detect', async () => {
    try {
      const username = await getCurrentUsername(); // Await the username
      const mentions = getTotalMentions(); // Get the total mentions (synchronously)

      vscode.window.showInformationMessage(
        `You have ${mentions} mentions, ${username}.`
      );
    } catch (error) {
      vscode.window.showErrorMessage('Failed to fetch mention count.');
      console.error(error);
    }
  });

  // Register the command in the context
  context.subscriptions.push(mentionCountCommand);
}