import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { ResetModule } from './reset/reset.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    RegisterModule,
    LoginModule,
    ResetModule,
    RouterModule.register([
      {
        path: '/auth',
        children: [
          {
            path: '/register',
            module: RegisterModule,
          },
          {
            path: '/login',
            module: LoginModule,
          },
          {
            path: '/reset',
            module: ResetModule,
          },
        ],
      },
    ]),
  ],
  providers: [],
})
export class AuthModule { }
