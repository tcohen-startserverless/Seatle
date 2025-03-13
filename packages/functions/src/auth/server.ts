import { issuer } from '@openauthjs/openauth';
import { PasswordProvider } from '@openauthjs/openauth/provider/password';
import { PasswordUI } from '@openauthjs/openauth/ui/password';
import { DynamoDBStorage } from '@openauthjs/openauth/storage/dynamodb';
import { subjects } from './subjects';

export const createAuthServer = () => {
  return issuer({
    providers: {
      password: PasswordProvider(
        PasswordUI({
          sendCode: async (email, code) => {
            // In production, implement email sending here
            console.log(`Send code ${code} to ${email}`);
          },
        }),
      ),
    },
    subjects,
    storage: DynamoDBStorage({
      tableName: process.env.AUTH_TABLE_NAME || 'school-auth',
    }),
    async success(ctx, value) {
      if (value.provider === 'password') {
        // If the user authenticated with password, we have their email
        return ctx.subject('user', {
          userId: value.email, // Use email as userId for simplicity
          email: value.email,
          role: 'user', // Default role
        });
      }
      
      // Handle any other providers here
      throw new Error(`Unsupported provider: ${value.provider}`);
    },
  });
};

export const authServer = createAuthServer();