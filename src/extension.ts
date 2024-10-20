import * as vscode from 'vscode';
import simpleGit, { SimpleGit } from 'simple-git';

let mentionDecorationType: vscode.TextEditorDecorationType;
let totalMentions = 0; // Store total mentions for the current user
let currentUsername = ''; // Store the current Git username

// Initialize the Git instance with the active workspace folder
const git: SimpleGit = simpleGit(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '.');

export async function activate(context: vscode.ExtensionContext) {
  console.log('Mentions Extension is now active! 🎉');

  // Define the decoration style for mentions
  mentionDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255, 230, 153, 0.5)', // Soft yellow background
    borderRadius: '4px',
    border: '1px solid rgba(255, 213, 79, 0.8)',
	color: 'white'
  });

  // Fetch the current Git username on activation
  currentUsername = await getCurrentGitUsername();
  console.log(`Current Git username: ${currentUsername}`);

  // Register the command to show the current user's mention count
  let mentionCountCommand = vscode.commands.registerCommand('mentions.detect', () => {
    vscode.window.showInformationMessage(
      `You have ${totalMentions} mentions in this file, ${currentUsername}.`
    );
  });

  // Register the completion provider for 'm@'
  let mentionCompletionProvider = vscode.languages.registerCompletionItemProvider(
    { scheme: 'file' },
    new MentionCompletionProvider(),
    '@' // Trigger on '@'
  );

  // Listen for document changes to update highlights
  vscode.workspace.onDidChangeTextDocument((event) => {
    if (vscode.window.activeTextEditor) {
      detectAndHighlightMentions();
    }
  });

  // Trigger highlights on activation
  if (vscode.window.activeTextEditor) {
    detectAndHighlightMentions();
  }

  // Push all disposables to context's subscriptions
  context.subscriptions.push(mentionCountCommand, mentionCompletionProvider);
}

// Completion Provider Class for Git Contributors
class MentionCompletionProvider implements vscode.CompletionItemProvider {
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.CompletionItem[]> {
    const text = document.getText(
      new vscode.Range(new vscode.Position(position.line, 0), position)
    );

    // Check if 'm@' was typed
    if (!text.trim().endsWith('m@')) return [];

    // Get the list of contributors from the local repo
    const contributors = await getRepoContributors();

    // Create and return completion items for each contributor
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

// **Function to Fetch Git Contributors**
async function getRepoContributors(): Promise<{ name: string; email: string }[]> {
  try {
    console.log('Fetching contributors from the Git repository...');

    const result = await git.raw(['shortlog', '-sne', '--all']);
    console.log('Git command output:', result);

    const contributors: { name: string; email: string }[] = [];
    const lines = result.split('\n');
    lines.forEach((line) => {
      const match = line.trim().match(/^\d+\s+(.+?)\s+<(.+?)>$/);
      if (match) {
        contributors.push({ name: match[1], email: match[2] });
      }
    });

    return contributors;
  } catch (error) {
    vscode.window.showErrorMessage('Failed to fetch contributors. Make sure this is a valid Git repo.');
    console.error('Git fetch error:', error);
    return [];
  }
}

// **Function to Fetch the Current Git Username**
async function getCurrentGitUsername(): Promise<string> {
  try {
    const username = await git.raw(['config', 'user.name']);
    return username.trim();
  } catch (error) {
    vscode.window.showErrorMessage('Failed to fetch the current Git username.');
    console.error('Git username fetch error:', error);
    return '';
  }
}

// **Function to Detect and Highlight Mentions for the Current User**
function detectAndHighlightMentions() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const document = editor.document;
  const text = document.getText();
  const mentionPattern = new RegExp(`m@${currentUsername}\\b`, 'g');
  const decorations: vscode.DecorationOptions[] = [];

  totalMentions = 0; // Reset mention count

  let match;
  while ((match = mentionPattern.exec(text)) !== null) {
    const startPos = document.positionAt(match.index);
    const endPos = document.positionAt(match.index + match[0].length);
    const range = new vscode.Range(startPos, endPos);

    decorations.push({ range });
    totalMentions++;
  }

  // Apply decorations
  editor.setDecorations(mentionDecorationType, decorations);
}

// Clean up decorations on deactivate
export function deactivate() {
  mentionDecorationType.dispose();
}