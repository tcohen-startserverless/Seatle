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

  if ($app.stage === 'dev')
    return {
      zone: new aws.route53.Zone(
        'Zone',
        {
          name: DEV,
          forceDestroy: undefined,
        },
        {
          import: 'Z00515891UFIBINRG41CM',
          ignoreChanges: ['*'],
        }
      ),
      domain: DEV,
    };

  return {
    zone: aws.route53.Zone.get('Zone', 'Z05417841XFB23HQ48514'),
    domain: `${$app.stage}.${DEV}`,
  };
})();
