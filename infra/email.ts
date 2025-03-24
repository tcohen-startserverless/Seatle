import { domain } from './domain';

export const email = new sst.aws.Email('email', {
  sender: `${domain}`,
});

export const reactEmail = new sst.x.DevCommand('ReactEmail', {
  dev: {
    command: 'bun email dev --dir src/email',
    directory: 'packages/core',
    autostart: true,
    title: 'Email Preview',
  },
});
