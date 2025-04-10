const PRODUCTION = 'seatle.app';

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
    zone: undefined,
    domain: undefined,
  };
})();
