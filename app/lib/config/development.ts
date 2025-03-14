import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'https://verifiable-ai-data.vercel.app/',
  apiUrl: 'https://34.162.3.245/api',
  VERIFIER_CONTRACT: '0xd3E937767392921c7eA63d675E02e3b3B4B7435A',
  FE_KEY:
    'xBh5ExNAO9tZOCatJbGkZLv0wv7YYRWXKZHh4hIWdxxZP2vIJqewliOG7DbLcTVwMQEVZHvjflQaFYgaiTmSK3dSicwtUtzyUhIg8du82ObsebHyABjotsqH0q9SylDO',
};

export default config;
