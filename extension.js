'use strict';

const vscode = require('vscode');

function activate(context) {
    // Command for deleting lines
    let deleteDisposable = vscode.commands.registerCommand('delextension.deleteLines', async () => {
        const lineCount = await vscode.window.showInputBox({
            prompt: 'Enter the line number to delete',
            placeHolder: '1'
        });

        if (lineCount) {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                // Get the current line number (0-based index)
                const currentLineNumber = editor.selection.start.line;

                // Convert the user input to a relative target line number
                const relativeLineNumber = parseInt(lineCount);
                const targetLineNumber = currentLineNumber + relativeLineNumber;

                // Ensure the target line number is within the document's range
                const endLine = Math.min(targetLineNumber, editor.document.lineCount - 1);
                const preDeletionPosition = editor.selection.active;
                // Create a range for deletion
                const deleteRange = new vscode.Range(
                    new vscode.Position(currentLineNumber, 0),
                    new vscode.Position(endLine, editor.document.lineAt(endLine).text.length)
                );

                // Perform deletion
                editor.edit(editBuilder => {
                    editBuilder.delete(deleteRange);
                }).then(() => {
                    const newPosition = new vscode.Position(currentLineNumber,preDeletionPosition.character);
                    vscode.window.activeTextEditor.edit(editBuilder => {
                        const spaces = ' '.repeat(preDeletionPosition.character);
                        editBuilder.insert(newPosition, spaces);
                    });

                });
            }
        }
    });

    // Command for copying lines based on input
    let copyLinesDisposable = vscode.commands.registerCommand('delextension.copyLines', async () => {
        const lineCount = await vscode.window.showInputBox({
            prompt: 'Enter the relative line number to copy',
            placeHolder: '1'
        });

        if (lineCount) {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                // Get the current line number (0-based index)
                const currentLineNumber = editor.selection.start.line;

                // Convert the user input to a relative target line number
                const relativeLineNumber = parseInt(lineCount);
                const targetLineNumber = currentLineNumber + relativeLineNumber;

                // Ensure the target line number is within the document's range
                const endLine = Math.min(targetLineNumber, editor.document.lineCount - 1);

                // Create a range for copying
                const copyRange = new vscode.Range(
                    new vscode.Position(currentLineNumber, 0),
                    new vscode.Position(endLine, editor.document.lineAt(endLine).text.length)
                );

                // Get the selected text for copying
                const selectedText = editor.document.getText(copyRange);

                // Copy the selected lines to the clipboard
                vscode.env.clipboard.writeText(selectedText);
            }
        }
    });

    context.subscriptions.push(deleteDisposable);
    context.subscriptions.push(copyLinesDisposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
