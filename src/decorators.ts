import * as vscode from 'vscode';
import { getCurrentUsername } from './gitUtils';

const mentionDecorationType = vscode.window.createTextEditorDecorationType({
  backgroundColor: 'rgba(255, 230, 153, 0.5)',
  borderRadius: '4px',
  border: '1px solid rgba(255, 213, 79, 0.8)',
});

let totalMentions = 0;

export function detectAndHighlightMentions() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const document = editor.document;
  const text = document.getText();
  const mentionPattern = new RegExp(`m@${getCurrentUsername()}\\b`, 'g');
  const decorations: vscode.DecorationOptions[] = [];

  totalMentions = 0;

  let match;
  while ((match = mentionPattern.exec(text)) !== null) {
    const startPos = document.positionAt(match.index);
    const endPos = document.positionAt(match.index + match[0].length);
    decorations.push({ range: new vscode.Range(startPos, endPos) });
    totalMentions++;
  }

  editor.setDecorations(mentionDecorationType, decorations);
}

export function getTotalMentions() {
  return totalMentions;
}