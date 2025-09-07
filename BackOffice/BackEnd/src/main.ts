import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1) CORS permisivo para desarrollo (refleja el Origin)
  app.enableCors({
    origin: true, // refleja el Origin que venga
    credentials: false,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 204,
  });

  // 2) Respuesta explícita al preflight OPTIONS (por si el middleware no intercepta)
  app.use((req, res, next) => {
    const origin = req.headers.origin as string | undefined;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
    }
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    // refleja los headers que pide el browser en el preflight (authorization, content-type, etc.)
    const reqHeaders =
      (req.headers['access-control-request-headers'] as string) ||
      'Authorization,Content-Type';
    res.header('Access-Control-Allow-Headers', reqHeaders);
    // si usás cookies en el futuro, poné true aquí y en enableCors
    res.header('Access-Control-Allow-Credentials', 'false');

    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`API on http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
