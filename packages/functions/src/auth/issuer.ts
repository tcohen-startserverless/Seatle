import { issuer } from '@openauthjs/openauth';
import { Resource } from 'sst';
import { EmailService } from '@core/email/service';
import CodeEmail from '@core/email/templates/code';
import { CodeProvider } from '@openauthjs/openauth/provider/code';
import { CodeUI } from '@openauthjs/openauth/ui/code';
import { DynamoStorage } from '@openauthjs/openauth/storage/dynamo';
import { subjects } from './subjects';
import { UserService } from '@core/user';

export const app = issuer({
  providers: {
    code: CodeProvider(
      CodeUI({
        copy: {
          code_info: "We'll send a verification code to your email",
          email_placeholder: 'Enter your email',
          button_continue: 'Continue',
          code_placeholder: 'Enter verification code',
          code_sent: 'Code sent to your email',
          code_resent: 'Code resent to your email',
          code_didnt_get: "Didn't receive a code?",
          code_resend: 'Resend code',
        },
        sendCode: async (claims, code) => {
          try {
            const email = claims.email;
            if (!email) return;
            const userName = email.split('@')[0] || 'User';

            await EmailService.send({
              to: email,
              subject: 'Your School App Verification Code',
              react: CodeEmail({
                code,
                userName,
                expiryTime: '10 minutes',
              }),
            });

            if (process.env.NODE_ENV !== 'production') {
              console.log(`[DEV] Verification code for ${email}: ${code}`);
            }

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
  storage: DynamoStorage({
    table: Resource.Table.name,
  }),
  async success(ctx, value) {
    const email = value.claims.email;
    if (!email) throw new Error('Missing email in claims');
    const user = await UserService.getByEmail({ email });
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
