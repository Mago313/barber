import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppoinmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb+srv://islam:a6HiRXYXNeP4tHmn@cluster0.htkk47r.mongodb.net/'),
    AuthModule,
    AppoinmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}