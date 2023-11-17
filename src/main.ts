export * from '@prisma/client';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as moment from 'moment';
import { LogRequestsInterceptor } from './interceptors/log-requests.interceptor';
import { logger } from './middlewares/logger.middleware';
import { identifier } from './middlewares/identifier.middleware';
import * as fs from 'fs';

moment.locale('ru');

async function bootstrap() {
  // Config
  // const httpsOptions = {
  //   key: fs.readFileSync(process.env.SSL_KEY_PATH ?? '', 'utf8'),
  //   cert: fs.readFileSync(process.env.SSL_CERTIFICATE_PATH ?? '', 'utf8'),
  // };

  const app = await NestFactory.create(AppModule, { /* httpsOptions */ });
  app.setGlobalPrefix('api');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  // console.log('origin: ' + (process.env.ALLOWED_ORIGINS?.split(',').concat(' | ') ?? ''));
  app.enableCors({
    origin: '*', //process.env.ALLOWED_ORIGINS, //?.split(',') ?? '',
    credentials: true,
  });
  // app.use(cookieParser());
  app.use(identifier);
  app.use(logger);
  app.useGlobalInterceptors(new LogRequestsInterceptor(), new ErrorsInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      always: true,
    }),
  );

  // Swaggers
  const config = new DocumentBuilder().setTitle('ERP').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Starting
  await app.listen(process.env.PORT || 3030, '0.0.0.0');
  console.log(`Server listening on port ${process.env.PORT || 3030}`);

  async function exitHandler() {
    await app.close();
  }

  process.on('exit', exitHandler);
  process.on('beforeExit', exitHandler);
  process.on('SIGINT', exitHandler);
  process.on('SIGTERM', exitHandler);
  process.on('SIGUSR2', exitHandler);
}
bootstrap();
