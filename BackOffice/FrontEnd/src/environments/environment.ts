declare const process: any;

export const environment = {
  production: false,
  apiUrl: process.env['NG_APP_API_URL'] || 'http://localhost:3000',
  whatsappBaseUrl: 'https://wa.me/',
  autoRefreshInterval: 30000,
  appName: 'Fotocopiadora BackOffice',
  version: '1.0.0'
};
