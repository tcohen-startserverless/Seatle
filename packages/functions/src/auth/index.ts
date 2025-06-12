import { subjects } from '@core/auth/subjects';
import { EmailService } from '@core/email/service';
import CodeEmail from '@core/email/templates/code';
import { UserService } from '@core/user';
import { issuer } from '@openauthjs/openauth';
import { CodeProvider } from '@openauthjs/openauth/provider/code';
import { CodeUI } from '@openauthjs/openauth/ui/code';
import { handle } from 'hono/aws-lambda';
import { seaterTheme } from './theme';

const app = issuer({
  theme: seaterTheme,
  allow: async (req) => {
    return true;
  },
  providers: {
    code: CodeProvider(
      CodeUI({
        copy: {
          code_info:
            "We'll send a secure verification code to your email to access your Seater account",
          email_placeholder: 'Enter your email address',
          button_continue: 'Continue to Seater',
          code_placeholder: 'Enter 6-digit code',
          code_sent: 'Verification code sent to',
          code_resent: 'New code sent to',
          code_didnt_get: "Didn't receive your code?",
          code_resend: 'Send new code',
          email_invalid: 'Please enter a valid email address',
          code_invalid: 'Invalid code. Please try again.',
        },
        sendCode: async (claims, code) => {
          try {
            const email = claims.email;
            if (!email) {
              console.error('No email in claims:', claims);
              return;
            }
            const userName = email.split('@')[0] || 'User';
            await EmailService.send({
              to: email,
              subject: 'Your Seater App Verification Code',
              react: CodeEmail({
                code,
                userName,
                expiryTime: '10 minutes',
              }),
            });
            return;
          } catch (error) {
            console.error('Error sending verification code:', error);
            return;
          }
        },
      })
    ),
  },
  subjects,
  async success(ctx, value) {
    const email = value.claims.email;
    if (!email) throw new Error('Missing email in claims');
    const user = await UserService.getOrCreateUser(email);
    if (!user) throw new Error('User not found');
    if (value.provider === 'code') {
      return ctx.subject('user', {
        id: user.id,
        email: user.email,
        role: 'user',
      });
    }
    throw new Error(`Unsupported provider: ${value.provider}`);
  },
});

export const handler = handle(app);
