export const email = new sst.aws.Email('email', {
  sender: 'trevor.cohen@startserverless.dev',
});

export const reactEmail = new sst.x.DevCommand('ReactEmail', {
  dev: {
    command: 'bun email dev --dir src/email',
    directory: 'packages/core',
    autostart: true,
    title: 'Email Preview',
  },
});
