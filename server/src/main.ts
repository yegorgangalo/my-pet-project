import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AppModule } from './modules/app.module';
import { runInCluster } from './utils/runInCluster';
import { addSwaggerApiDocumentation } from './utils/addSwaggerApiDoc';

const bootstrap = async () => {
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

runInCluster({ bootstrap, cores: 1 });
