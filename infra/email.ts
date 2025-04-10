import { domain, zone } from './domain';

export const email = new sst.aws.Email('email', {
  sender: domain ? domain : 'trevor.cohen@startserverless.dev',
  dns: zone
    ? sst.aws.dns({
        zone: zone?.id,
      })
    : undefined,
});

export const reactEmail = new sst.x.DevCommand('ReactEmail', {
  dev: {
    command: 'bun email dev --dir src/email',
    directory: 'packages/core',
    autostart: true,
    title: 'Email Preview',
  },
});
