import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  // Função para tratar o encerramento da aplicação
  const exitHandler = async () => {
    await app.close();
  };

  // Eventos de encerramento do Node.js
  process.on('exit', exitHandler);
  process.on('beforeExit', exitHandler);
  process.on('SIGINT', exitHandler); // Ctrl+C
  process.on('SIGTERM', exitHandler); // Sinal de término (e.g., Docker)
  process.on('SIGUSR2', exitHandler); // Reinicialização do Nodemon

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS
  app.enableCors();

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Documentation with Swagger - API TESTE')
    .setDescription(
      'The design and documentation platform for teams and individuals working with the OpenAPI Specification.',
    )
    .setVersion('1.0')
    .addTag('hello')
    .addTag('auth')
    .addTag('user')
    .addTag('publish')
    .addTag('comment')
    .addBearerAuth()
    .build();

  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Api Teste API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, customOptions);

  await app.listen(3000);
}
bootstrap();
