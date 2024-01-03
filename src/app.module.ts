import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ItemsController } from './items.controller';
import { OffersService } from './offers.service';
import { OffersRepository } from './offers.repository';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { LoggerModule } from 'nestjs-pino';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Options } from 'pino-http';

const environment = process.env.NODE_ENV ?? 'local';
const isLocal = 'local' === environment;

const pinoOptions: Options = {
  level: isLocal ? 'debug' : 'info',
  messageKey: 'message',
  autoLogging: false,
};

if (isLocal) {
  pinoOptions.transport = { target: 'pino-pretty' };
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env.local',
    }),
    LoggerModule.forRoot({ pinoHttp: pinoOptions }),
    HttpModule,
  ],
  controllers: [AppController, ItemsController],
  providers: [
    OffersService,
    OffersRepository,
    {
      provide: DynamoDBClient,
      useValue: new DynamoDBClient(),
    },
  ],
})
export class AppModule {}
