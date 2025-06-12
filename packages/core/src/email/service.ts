import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { render } from '@react-email/components';
import { Resource } from 'sst';

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  from?: string;
};

export namespace EmailService {
  const sesClient = new SESv2Client();

  export const send = async ({
    to,
    subject,
    react,
    from = `noreply@${Resource.email.sender}`,
  }: SendEmailOptions) => {
    const html = await render(react);
    const toAddresses = Array.isArray(to) ? to : [to];

    const command = new SendEmailCommand({
      FromEmailAddress: from,
      Destination: {
        ToAddresses: toAddresses,
      },
      Content: {
        Simple: {
          Subject: {
            Data: subject,
          },
          Body: {
            Html: {
              Data: html,
            },
          },
        },
      },
    });

    const response = await sesClient.send(command);
    return { success: true, messageId: response.MessageId };
  };
}
