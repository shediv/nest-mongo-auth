import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AppConst } from './constants/app.constant'
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    UserModule,
    MongooseModule.forRoot(AppConst.DB_CON_URL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
