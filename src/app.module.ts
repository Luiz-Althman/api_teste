import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PublishModule } from './publish/publish.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, PublishModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
