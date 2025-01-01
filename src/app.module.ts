/* eslint-disable @typescript-eslint/no-require-imports */
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { EducationsModule } from './educations/educations.module';
import { CompaniesModule } from './companies/companies.module';
import { JobApplicationsModule } from './job_applications/job_applications.module';
import { WorkHistoriesModule } from './work_histories/work_histories.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import * as morgan from 'morgan';
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { User } from './users/users.entity';
import { Profile } from './profiles/profiles.entity';
import { Portfolio } from './portfolios/portfolios.entity';
import { PortfolioItem } from './portfolios/portfolios_item.entity';
import { Education } from './educations/education.entity';
import { JobApplication } from './job_applications/job_applications.entity';
import { Job } from './jobs/jobs.entity';
import { Company } from './companies/companies.entity';
import { Session } from './auth/session.entity';
import { RefreshToken } from './auth/refresh_token.entity';
import { WorkHistory } from './work_histories/work_histories.entity';
import { Notification } from './notifications/notifications.entity';
import { JobApplicationTimeline } from './job_applications/job_applications_timeline.entity';
import { SerializeInterceptor } from './addons/interceptors/serialize.interceptor';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GlobalModule } from './global/global.module';
import { GlobalExceptionsFilter } from './addons/filters/global.filter';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
        JWT_OTP_SECRET: Joi.string().required(),
        JWT_OTP_EXPIRATION: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
        JWT_REFRESHTOKEN_EXPIRATION: Joi.string().required(),
        JWT_PROFILE_SECRET: Joi.string().required(),
        JWT_PROFILE_EXPIRATION: Joi.string().required(),
        JWT_PASSWORD_SECRET: Joi.string().required(),
        JWT_PASSWORD_EXPIRATION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        SWAGGER_USER: Joi.string().required(),
        SWAGGER_PASSWORD: Joi.string().required(),
        TERMII_SENDER_ID: Joi.string().required(),
        TERMII_BASE_URL: Joi.string().required(),
        TERMII_API_KEY: Joi.string().required(),
        SMTP_HOST: Joi.string().required(),
        SMTP_PORT: Joi.number().required(),
        SMTP_USER: Joi.string().required(),
        SMTP_PASSWORD: Joi.string().required(),
        SMTP_SENDER: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [
            User,
            Profile,
            Portfolio,
            PortfolioItem,
            Education,
            Job,
            Company,
            Session,
            RefreshToken,
            Notification,
            JobApplication,
            WorkHistory,
            JobApplicationTimeline,
          ],
          synchronize: !!configService.get<boolean>('DB_SYNC'),
          autoLoadEntities: true,
          migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
          seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
          factories: [__dirname + '/factories/**/*{.ts,.js}'],
          cli: {
            migrationsDir: __dirname + '/migrations/',
          },
        };
      },
    }),
    EventEmitterModule.forRoot({
      global: true,
      wildcard: false,
      delimiter: '.',
      newListener: true,
      removeListener: true,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: true,
    }),
    // main modules
    UsersModule,
    JobsModule,
    ProfilesModule,
    AuthModule,
    EducationsModule,
    CompaniesModule,
    JobApplicationsModule,
    WorkHistoriesModule,
    NotificationsModule,
    GlobalModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SerializeInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionsFilter,
    },
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          name: 'session',
          httpOnly: true,
          keys: [this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')],
          secure: this.configService.get<string>('NODE_ENV') === 'production',
        }),
        this.configService.get<string>('NODE_ENV') !== 'development' &&
          morgan('tiny'),
      )
      .forRoutes('*');
  }
}
