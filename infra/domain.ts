const PRODUCTION = 'seatle.app';
const DEV = 'dev.seatle.app';

export const { zone, domain } = (() => {
  if ($app.stage === 'production')
    return {
      zone: new aws.route53.Zone(
        'Zone',
        {
          name: PRODUCTION,
          forceDestroy: undefined,
        },
        {
          retainOnDelete: true,
          import: 'Z0406942248EQAM70P31',
          ignoreChanges: ['*'],
        }
      ),
      domain: PRODUCTION,
    };
  return {
    zone: new aws.route53.Zone(
      'Zone',
      {
        name: DEV,
      },
      {
        import: 'Z0856640358EGYXK3RIKT',
        ignoreChanges: ['*'],
      }
    ),
    domain: DEV,
  };
})();
