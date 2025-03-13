import packageConfig from '../../package.json';

const config: ConfigInterface = {
  VERSION: packageConfig.version || '1.0.0',
  url: 'http://localhost:3000',
  apiUrl: 'http://localhost:4444',
  VERIFIER_CONTRACT: '0xd3E937767392921c7eA63d675E02e3b3B4B7435A',
};

export default config;
