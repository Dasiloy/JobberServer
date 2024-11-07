/* eslint-disable @typescript-eslint/no-require-imports */
import { AppController } from './app.controller';
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
import { LoggerModule } from './logger/logger.module';
import { APP_PIPE } from '@nestjs/core';
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
const cookieSession = require('cookie-session');

@Module({
  imports: [
    LoggerModule,
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
        // SMTP_ENABLED: Joi.boolean().default(false),
        // SMTP_SECURE: Joi.boolean().default(false),
        // SMTP_TLS_REQUIRED: Joi.boolean().default(false),
        // SMTP_STARTTLS_REQUIRED: Joi.boolean().default(false),
        // SMTP_HOST: Joi.string().required(),
        // SMTP_PORT: Joi.number().default(587),
        // SMTP_USERNAME: Joi.string().required(),
        // SMTP_PASSWORD: Joi.string().required(),
        // SMTP_FROM_EMAIL: Joi.string().required(),
        // SMTP_FROM_NAME: Joi.string().required(),
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
          // we need to understand these better
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
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
