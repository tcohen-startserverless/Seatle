const PRODUCTION = 'seatle.app';
const DEV = 'dev.seatle.app';

export const { zone, domain } = (() => {
  if ($app.stage === 'production')
    return {
      zone: new aws.route53.Zone(
        'Zone',
        {
          name: PRODUCTION,
        },
        {
          retainOnDelete: true,
          import: 'Z0406942248EQAM70P31',
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
        },
        {
          import: 'Z05417841XFB23HQ48514',
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
