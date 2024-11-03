import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthModule } from './auth/auth.module';
import { WorksModule } from './works/works.module';
import { EducationsModule } from './educations/educations.module';
import { CompaniesModule } from './companies/companies.module';
import { JobApplicationsModule } from './job_applications/job_applications.module';
import { WorkHistoriesModule } from './work_histories/work_histories.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { LoggerService } from './logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

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
        // JWT_SECRET: Joi.string().required(),
        // JWT_EXPIRATION: Joi.number().default(3600),
        // JWT_ALGORITHM: Joi.string().default('HS256'),
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
          entities: [__dirname + './**/*.entity{.ts,.js}'],
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
    WorksModule,
    EducationsModule,
    CompaniesModule,
    JobApplicationsModule,
    WorkHistoriesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}
}
