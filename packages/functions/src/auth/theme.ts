import type { Theme } from '@openauthjs/openauth/ui/theme';

export const seaterTheme: Theme = {
  title: 'Seater',
  primary: {
    light: '#0A7EA4', // Using the info color as primary
    dark: '#0A7EA4',
  },
  background: {
    light: '#fff',
    dark: '#151718',
  },
  radius: 'md',
  font: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    scale: '1',
  },
  css: `
    :root {
      --spacing-xs: 4px;
      --spacing-sm: 8px;
      --spacing-md: 16px;
      --spacing-lg: 24px;
      --spacing-xl: 32px;
    }

    [data-theme="light"] {
      --color-text: #11181C;
      --color-background: #fff;
      --color-border: #E6E8EB;
      --color-card: #ffffff;
      --color-input-background: #F8F9FA;
      --color-placeholder: #889096;
      --color-success: #4CAF50;
      --color-error: #FF3B30;
    }

    [data-theme="dark"] {
      --color-text: #ECEDEE;
      --color-background: #151718;
      --color-border: #2F3336;
      --color-card: #1f2123;
      --color-input-background: #1A1D1E;
      --color-placeholder: #687076;
      --color-success: #4CAF50;
      --color-error: #FF3B30;
    }

    /* Custom styling to match app design */
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--color-background);
      color: var(--color-text);
    }

    .auth-container {
      padding: var(--spacing-lg);
      max-width: 400px;
      margin: 0 auto;
    }

    .auth-form {
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: 8px;
      padding: var(--spacing-xl);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    /* CodeUI specific styling */
    .code-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .code-info {
      color: var(--color-text);
      font-size: 14px;
      line-height: 1.5;
    }

    .code-input-container {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .auth-input {
      background: var(--color-input-background);
      border: 1px solid var(--color-border);
      color: var(--color-text);
      padding: var(--spacing-md);
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s ease;
    }

    .auth-input:focus {
      outline: none;
      border-color: #0a7ea4;
      box-shadow: 0 0 0 3px rgba(10, 126, 164, 0.1);
    }

    .auth-input::placeholder {
      color: var(--color-placeholder);
    }

    .code-input {
      text-align: center;
      font-size: 18px;
      font-weight: 500;
      letter-spacing: 0.5em;
      padding: var(--spacing-lg);
    }

    .auth-button {
      background: #0a7ea4;
      color: white;
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: 8px;
      border: none;
      font-weight: 500;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .auth-button:hover {
      background: #0968a3;
    }

    .auth-button:disabled {
      background: var(--color-placeholder);
      cursor: not-allowed;
    }

    .auth-text {
      color: var(--color-text);
      font-size: 14px;
    }

    .auth-link {
      color: #0a7ea4;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-link:hover {
      text-decoration: underline;
    }

    .code-status {
      text-align: center;
      font-size: 14px;
    }

    .code-sent {
      color: var(--color-success);
    }

    .code-resend-container {
      text-align: center;
      margin-top: var(--spacing-md);
    }

    .auth-error {
      color: var(--color-error);
      background: rgba(255, 59, 48, 0.1);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: 6px;
      border: 1px solid rgba(255, 59, 48, 0.2);
      font-size: 14px;
    }

    .auth-success {
      color: var(--color-success);
      background: rgba(76, 175, 80, 0.1);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: 6px;
      border: 1px solid rgba(76, 175, 80, 0.2);
      font-size: 14px;
    }
  `,
};
