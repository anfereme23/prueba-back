import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe()); 

    // Configuración de Swagger
    const config = new DocumentBuilder()
    .setTitle('API de Usuarios')
    .setDescription('CRUD y autenticación de usuarios')
    .setVersion('1.0')
    .addBearerAuth() // Para agregar soporte a JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // /api será la URL para Swagger

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
