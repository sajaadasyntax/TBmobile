export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl: process.env.API_URL || 'https://api.trustbuild.uk',
    webUrl: process.env.WEB_URL || 'https://trustbuild.uk',
  },
});

