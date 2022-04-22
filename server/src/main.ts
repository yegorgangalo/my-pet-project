import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AppModule } from './app.module';

const start = async () => {
  try {
    const PORT = process.env.SERVER_PORT || 5001;
    const app = await NestFactory.create(AppModule);

    addSwaggerApiDocumentation(app);

    app.use(cookieParser());
    app.enableCors({
      credentials: true,
      origin: process.env.CLIENT_URL,
    });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();

function addSwaggerApiDocumentation(app) {
  const config = new DocumentBuilder()
    .setTitle('Nest Test BE')
    .setDescription('Rest API documentation')
    .setVersion('1.0.0')
    .addTag('Yegor Gangalo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
}
