# Mention Checker

## Overview

The **Mention Checker** extension for Visual Studio Code enhances collaboration by enabling users to track mentions within their codebase. This extension allows developers to easily identify mentions of team members, receive notifications, and manage their mention states.

## Features

- **User Name Detection:** Automatically detects user names from your Git configuration.
- **Team Mentions:** Easily mention team members using the format `m@[username]`.
- **Notifications:** Receive notifications for new mentions in your code.
- **Read/Unread State Management:** Keep track of which mentions you have read and which are still unread.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
3. Search for "Mention Checker" and click **Install**.

## Usage

1. Use the `m@[username]` format in your code to mention team members.
2. Notifications will appear in the Notification Center when you receive a mention.
3. Manage your mentions through the Mention Checker sidebar panel.

## Configuration

You can customize the behavior of the Mention Checker extension in the settings:

```json
{
    "mentionChecker.enableNotifications": true,
    "mentionChecker.notificationSound": "default"
}