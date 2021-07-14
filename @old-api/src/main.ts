/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as firebase from 'firebase-admin';

import { AppModule } from './app/app.module';

const port = process.env.PORT || 3333;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle("Let's share a TOAST")
    .setDescription('API documentation')
    .setVersion('1.0')
    .addTag('toast')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  const firebaseCredentials = JSON.parse(
    configService.get('FIREBASE_ADMIN_CREDENTIALS')
  );

  firebase.initializeApp({
    credential: firebase.credential.cert(firebaseCredentials),
    databaseURL: configService.get('FIREBASE_DATABASE_URL'),
  });

  await app.listen(port);
}

bootstrap().then(() => {
  Logger.log('Enjoy 🤩');
});