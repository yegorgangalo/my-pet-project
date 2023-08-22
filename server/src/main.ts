import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { config } from 'aws-sdk';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AppModule } from 'src/modules/app.module';
import { runInCluster } from 'src/utils/runInCluster';
import { addSwaggerApiDocumentation } from 'src/utils/addSwaggerApiDoc';
import { NestExpressApplication } from '@nestjs/platform-express';

const bootstrap = async () => {
  try {
    const PORT = process.env.SERVER_PORT || 5002;

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    addSwaggerApiDocumentation(app);

    app.use(cookieParser());
    app.enableCors({
      credentials: true,
      origin: process.env.CLIENT_URL,
    });
    app.useGlobalPipes(new ValidationPipe());

    config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    await app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));
  } catch (e) {
    console.log('app error:', e);
  }
};

runInCluster({ bootstrap, cores: 1 });
