export const environment = {
  production: true,
  apiUrl: (import.meta as any).env?.NG_APP_API_URL || 'https://api.fotocopiadora.com',
  whatsappBaseUrl: 'https://wa.me/',
  autoRefreshInterval: 30000,
  appName: 'Fotocopiadora BackOffice',
  version: '1.0.0'
};
