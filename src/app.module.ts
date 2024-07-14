import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './logger.middleware';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TreinoController } from './treino/treino.controller';
import { TreinoService } from './treino/treino.service';
import { TreinoModule } from './treino/treino.module';
import { CategoriaModule } from './categoria/categoria.module';

@Module({
  imports: [AuthModule, UserModule, JwtModule, TreinoModule, CategoriaModule],
  controllers: [AppController, AuthController, UserController, TreinoController],
  providers: [AppService, TreinoService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('user');
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('treino');
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('categoria');
  }
}
