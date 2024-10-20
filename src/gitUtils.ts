import simpleGit, { SimpleGit } from 'simple-git';
import * as vscode from 'vscode';

const git: SimpleGit = simpleGit(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '.');

export async function getCurrentUsername(): Promise<string> {
  try {
    const username = await git.raw(['config', 'user.name']);
    return username.trim();
  } catch (error) {
    vscode.window.showErrorMessage('Failed to fetch the current Git username.');
    console.error('Git username fetch error:', error);
    return '';
  }
}

export async function getTotalContributors(): Promise<{ name: string; email: string }[]> {
  try {
    const result = await git.raw(['shortlog', '-sne', '--all']);
    const contributors: { name: string; email: string }[] = [];

    result.split('\n').forEach((line) => {
      const match = line.trim().match(/^\d+\s+(.+?)\s+<(.+?)>$/);
      if (match) {
        contributors.push({ name: match[1], email: match[2] });
      }
    });

    return contributors;
  } catch (error) {
    vscode.window.showErrorMessage('Failed to fetch contributors.');
    console.error('Git fetch error:', error);
    return [];
  }
}