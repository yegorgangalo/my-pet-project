import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function addSwaggerApiDocumentation(app) {
  const config = new DocumentBuilder()
    .setTitle('Nest Test BE')
    .setDescription('Rest API documentation')
    .setVersion('1.0.0')
    .addTag('Yegor Gangalo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
}
